import { useState, useCallback, useEffect, useRef, createContext, useContext, type ReactNode } from "react";
import type { Expense, Budget, SavingsGoal } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { Session } from "@supabase/supabase-js";

// ---- localStorage helpers (theme/onboarding only) ----

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Auth Context ----

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  loginWithGoogle: () => Promise<string | null>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function migrateLocalData(userId: string, email: string) {
  if (typeof window === "undefined") return;
  const flagKey = `finova_migrated_${userId}`;
  if (localStorage.getItem(flagKey)) return;

  try {
    const oldExpenses: Expense[] = loadJSON(`finova_expenses_${email}`, []);
    const oldBudget: Budget = loadJSON(`finova_budget_${email}`, { monthly: 0 });
    const oldGoals: SavingsGoal[] = loadJSON(`finova_goals_${email}`, []);

    if (oldExpenses.length > 0) {
      const { count } = await supabase.from("expenses").select("id", { count: "exact", head: true }).eq("user_id", userId);
      if (!count) {
        await supabase.from("expenses").insert(
          oldExpenses.map((e) => ({
            user_id: userId,
            amount: e.amount,
            category: e.category,
            note: e.note ?? null,
            date: e.date,
          }))
        );
      }
    }
    if (oldBudget.monthly > 0) {
      await supabase.from("budgets").upsert(
        { user_id: userId, monthly: oldBudget.monthly },
        { onConflict: "user_id" }
      );
    }
    if (oldGoals.length > 0) {
      const { count } = await supabase.from("savings_goals").select("id", { count: "exact", head: true }).eq("user_id", userId);
      if (!count) {
        await supabase.from("savings_goals").insert(
          oldGoals.map((g) => ({
            user_id: userId,
            name: g.name,
            target: g.target,
            saved: g.saved,
          }))
        );
      }
    }
    localStorage.setItem(flagKey, "1");
  } catch (err) {
    console.error("Migration error", err);
  }
}

async function buildUser(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user) return null;
  const u = session.user;
  let name = (u.user_metadata?.name as string) || (u.user_metadata?.full_name as string) || u.email?.split("@")[0] || "User";
  // Try to refine from profiles table (best-effort)
  try {
    const { data } = await supabase.from("profiles").select("name").eq("user_id", u.id).maybeSingle();
    if (data?.name) name = data.name;
  } catch {
    /* ignore */
  }
  return { id: u.id, name, email: u.email ?? "" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1) Listener first to avoid race
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;
      // Defer non-trivial work to avoid deadlocks
      setTimeout(async () => {
        const u = await buildUser(session);
        if (!mounted) return;
        setUser(u);
        if (u) migrateLocalData(u.id, u.email);
      }, 0);
    });

    // 2) Then existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      const u = await buildUser(session);
      if (!mounted) return;
      setUser(u);
      setLoading(false);
      if (u) migrateLocalData(u.id, u.email);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    return error?.message ?? null;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    return error?.message ?? null;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    if (result.error) return result.error.message ?? "Google sign-in failed";
    return null;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    return error?.message ?? null;
  }, []);

  return (
    <AuthContext value={{ user, loading, login, signup, loginWithGoogle, logout, sendPasswordReset }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      login: async () => "Auth not available",
      signup: async () => "Auth not available",
      loginWithGoogle: async () => "Auth not available",
      logout: async () => {},
      sendPasswordReset: async () => "Auth not available",
    };
  }
  return ctx;
}

// ---- Data hooks (Supabase-backed) ----

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) { setExpenses([]); return; }
    let cancelled = false;
    supabase
      .from("expenses")
      .select("id, amount, category, note, date")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .then(({ data }) => {
        if (cancelled || !data) return;
        setExpenses(
          data.map((r) => ({
            id: r.id,
            amount: Number(r.amount),
            category: r.category,
            note: r.note ?? undefined,
            date: r.date,
          }))
        );
      });
    return () => { cancelled = true; };
  }, [userId]);

  const addExpense = useCallback(async (e: Omit<Expense, "id">) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("expenses")
      .insert({ user_id: userId, amount: e.amount, category: e.category, note: e.note ?? null, date: e.date })
      .select("id, amount, category, note, date")
      .single();
    if (error || !data) return;
    setExpenses((prev) => [
      { id: data.id, amount: Number(data.amount), category: data.category, note: data.note ?? undefined, date: data.date },
      ...prev,
    ]);
  }, [userId]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!userId) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    await supabase.from("expenses").delete().eq("id", id);
  }, [userId]);

  return { expenses, addExpense, deleteExpense };
}

export function useBudget() {
  const { user } = useAuth();
  const [budget, setBudgetState] = useState<Budget>({ monthly: 0 });
  const userId = user?.id;

  useEffect(() => {
    if (!userId) { setBudgetState({ monthly: 0 }); return; }
    let cancelled = false;
    supabase
      .from("budgets")
      .select("monthly")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setBudgetState({ monthly: data ? Number(data.monthly) : 0 });
      });
    return () => { cancelled = true; };
  }, [userId]);

  const setBudget = useCallback(async (monthly: number) => {
    setBudgetState({ monthly });
    if (!userId) return;
    await supabase.from("budgets").upsert({ user_id: userId, monthly }, { onConflict: "user_id" });
  }, [userId]);

  return { budget, setBudget };
}

export function useSavingsGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) { setGoals([]); return; }
    let cancelled = false;
    supabase
      .from("savings_goals")
      .select("id, name, target, saved")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (cancelled || !data) return;
        setGoals(data.map((g) => ({ id: g.id, name: g.name, target: Number(g.target), saved: Number(g.saved) })));
      });
    return () => { cancelled = true; };
  }, [userId]);

  const addGoal = useCallback(async (g: Omit<SavingsGoal, "id">) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("savings_goals")
      .insert({ user_id: userId, name: g.name, target: g.target, saved: g.saved })
      .select("id, name, target, saved")
      .single();
    if (error || !data) return;
    setGoals((prev) => [...prev, { id: data.id, name: data.name, target: Number(data.target), saved: Number(data.saved) }]);
  }, [userId]);

  const updateGoal = useCallback(async (id: string, saved: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved } : g)));
    if (!userId) return;
    await supabase.from("savings_goals").update({ saved }).eq("id", id);
  }, [userId]);

  const deleteGoal = useCallback(async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (!userId) return;
    await supabase.from("savings_goals").delete().eq("id", id);
  }, [userId]);

  return { goals, addGoal, updateGoal, deleteGoal };
}

// ---- Local-only UI prefs ----

export function useOnboarding() {
  const [seen, setSeen] = useState(() => loadJSON("finova_onboarded", false));

  const complete = useCallback(() => {
    setSeen(true);
    saveJSON("finova_onboarded", true);
  }, []);

  return { seen, complete };
}

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("finova_theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("finova_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}
