import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from "react";
import type { Expense, Budget, SavingsGoal } from "@/lib/types";

// ---- Helpers ----

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

// ---- Auth Context (shared) ----

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => string | null;
  signup: (name: string, email: string, password: string) => string | null;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    loadJSON("finova_auth_user", null)
  );

  const login = useCallback((email: string, _password: string) => {
    const users: Record<string, { name: string; password: string }> = loadJSON("finova_users", {});
    const entry = users[email];
    if (!entry) return "No account found with this email";
    if (entry.password !== _password) return "Incorrect password";
    const u: AuthUser = { name: entry.name, email };
    setUser(u);
    saveJSON("finova_auth_user", u);
    return null;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    const users: Record<string, { name: string; password: string }> = loadJSON("finova_users", {});
    if (users[email]) return "An account with this email already exists";
    users[email] = { name, password };
    saveJSON("finova_users", users);
    const u: AuthUser = { name, email };
    setUser(u);
    saveJSON("finova_auth_user", u);
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem("finova_auth_user");
  }, []);

  const resetPassword = useCallback((email: string, newPassword: string) => {
    const users: Record<string, { name: string; password: string }> = loadJSON("finova_users", {});
    if (!users[email]) return "No account found with this email";
    users[email].password = newPassword;
    saveJSON("finova_users", users);
    return null;
  }, []);

  return (
    <AuthContext value={{ user, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      login: () => "Auth not available",
      signup: () => "Auth not available",
      logout: () => {},
      resetPassword: () => "Auth not available",
    };
  }
  return ctx;
}

// ---- Per-user data hooks ----

function userKey(base: string, email: string | undefined) {
  return email ? `finova_${base}_${email}` : `finova_${base}`;
}

export function useExpenses() {
  const { user } = useAuth();
  const key = userKey("expenses", user?.email);

  const [expenses, setExpenses] = useState<Expense[]>(() => loadJSON(key, []));

  // Re-load when user changes
  useEffect(() => {
    setExpenses(loadJSON(key, []));
  }, [key]);

  useEffect(() => saveJSON(key, expenses), [key, expenses]);

  const addExpense = useCallback((e: Omit<Expense, "id">) => {
    setExpenses((prev) => [{ ...e, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { expenses, addExpense, deleteExpense };
}

export function useBudget() {
  const { user } = useAuth();
  const key = userKey("budget", user?.email);

  const [budget, setBudgetState] = useState<Budget>(() => loadJSON(key, { monthly: 0 }));

  useEffect(() => {
    setBudgetState(loadJSON(key, { monthly: 0 }));
  }, [key]);

  useEffect(() => saveJSON(key, budget), [key, budget]);

  const setBudget = useCallback((monthly: number) => {
    setBudgetState({ monthly });
  }, []);

  return { budget, setBudget };
}

export function useSavingsGoals() {
  const { user } = useAuth();
  const key = userKey("goals", user?.email);

  const [goals, setGoals] = useState<SavingsGoal[]>(() => loadJSON(key, []));

  useEffect(() => {
    setGoals(loadJSON(key, []));
  }, [key]);

  useEffect(() => saveJSON(key, goals), [key, goals]);

  const addGoal = useCallback((g: Omit<SavingsGoal, "id">) => {
    setGoals((prev) => [...prev, { ...g, id: crypto.randomUUID() }]);
  }, []);

  const updateGoal = useCallback((id: string, saved: number) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, saved } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { goals, addGoal, updateGoal, deleteGoal };
}

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
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("finova_theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return { theme, toggleTheme };
}
