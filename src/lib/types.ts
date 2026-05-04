export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string; // ISO string
  note?: string;
}

export interface Budget {
  monthly: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
}

export const CATEGORIES = [
  { name: "Food", icon: "🍔", color: "oklch(0.7 0.18 50)" },
  { name: "Transport", icon: "🚗", color: "oklch(0.55 0.22 265)" },
  { name: "Shopping", icon: "🛍️", color: "oklch(0.6 0.2 290)" },
  { name: "Entertainment", icon: "🎬", color: "oklch(0.65 0.18 180)" },
  { name: "Bills", icon: "📄", color: "oklch(0.6 0.22 330)" },
  { name: "Health", icon: "💊", color: "oklch(0.65 0.2 145)" },
  { name: "Education", icon: "📚", color: "oklch(0.7 0.15 80)" },
  { name: "Other", icon: "📦", color: "oklch(0.5 0.03 270)" },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]["name"];
