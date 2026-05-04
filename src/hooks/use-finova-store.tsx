import { useState, useCallback, useEffect } from "react";
import type { Expense, Budget, SavingsGoal } from "@/lib/types";

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

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadJSON("finova_expenses", [])
  );

  useEffect(() => saveJSON("finova_expenses", expenses), [expenses]);

  const addExpense = useCallback((e: Omit<Expense, "id">) => {
    setExpenses((prev) => [
      { ...e, id: crypto.randomUUID() },
      ...prev,
    ]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { expenses, addExpense, deleteExpense };
}

export function useBudget() {
  const [budget, setBudgetState] = useState<Budget>(() =>
    loadJSON("finova_budget", { monthly: 0 })
  );

  useEffect(() => saveJSON("finova_budget", budget), [budget]);

  const setBudget = useCallback((monthly: number) => {
    setBudgetState({ monthly });
  }, []);

  return { budget, setBudget };
}

export function useSavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>(() =>
    loadJSON("finova_goals", [])
  );

  useEffect(() => saveJSON("finova_goals", goals), [goals]);

  const addGoal = useCallback((g: Omit<SavingsGoal, "id">) => {
    setGoals((prev) => [...prev, { ...g, id: crypto.randomUUID() }]);
  }, []);

  const updateGoal = useCallback((id: string, saved: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, saved } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return { goals, addGoal, updateGoal, deleteGoal };
}

export function useOnboarding() {
  const [seen, setSeen] = useState(() =>
    loadJSON("finova_onboarded", false)
  );

  const complete = useCallback(() => {
    setSeen(true);
    saveJSON("finova_onboarded", true);
  }, []);

  return { seen, complete };
}
