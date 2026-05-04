import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useExpenses } from "@/hooks/use-finova-store";
import { CATEGORIES } from "@/lib/types";
import { format } from "date-fns";

export const Route = createFileRoute("/add-expense")({
  component: AddExpense,
  head: () => ({
    meta: [
      { title: "Add Expense — Finova" },
      { name: "description", content: "Add a new expense to track your spending." },
    ],
  }),
});

function AddExpense() {
  const { addExpense } = useExpenses();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    addExpense({
      amount: val,
      category,
      date: new Date(date).toISOString(),
      note: note.trim() || undefined,
    });
    navigate({ to: "/" });
  };

  return (
    <div className="px-4 pb-24 pt-6">
      <h1 className="text-xl font-bold text-foreground mb-6">Add Expense</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Amount (₹)</label>
          <div className="finova-card flex items-center px-4">
            <span className="text-lg font-semibold text-muted-foreground">₹</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-transparent py-3.5 pl-2 text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/40"
              required
              min="1"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setCategory(c.name)}
                className={`flex flex-col items-center gap-1 rounded-xl p-3 text-xs font-medium transition-all ${
                  category === c.name
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="finova-card w-full px-4 py-3 text-sm text-foreground outline-none"
          />
        </div>

        {/* Note */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Lunch with friends"
            maxLength={100}
            className="finova-card w-full px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl gradient-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-transform active:scale-[0.98]"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
