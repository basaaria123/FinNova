import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useExpenses, useBudget } from "@/hooks/use-finova-store";
import { formatINR } from "@/lib/format";
import { CATEGORIES } from "@/lib/types";
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

export const Route = createFileRoute("/budget")({
  component: BudgetPage,
  head: () => ({
    meta: [
      { title: "Budget — FinNova" },
      { name: "description", content: "Set and manage your monthly budget." },
    ],
  }),
});

function BudgetPage() {
  const { budget, setBudget } = useBudget();
  const { expenses } = useExpenses();
  const [editing, setEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(String(budget.monthly || ""));

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const { totalMonth, categorySpending, budgetPct, remaining } = useMemo(() => {
    let total = 0;
    const catMap: Record<string, number> = {};
    for (const e of expenses) {
      const d = parseISO(e.date);
      if (isWithinInterval(d, { start: monthStart, end: monthEnd })) {
        total += e.amount;
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      }
    }
    const pct = budget.monthly > 0 ? Math.min((total / budget.monthly) * 100, 100) : 0;
    return {
      totalMonth: total,
      categorySpending: catMap,
      budgetPct: pct,
      remaining: budget.monthly - total,
    };
  }, [expenses, budget, monthStart, monthEnd]);

  const handleSave = () => {
    const val = parseFloat(newBudget);
    if (val > 0) setBudget(val);
    setEditing(false);
  };

  return (
    <div className="px-4 pb-24 pt-6">
      <h1 className="text-xl font-bold text-foreground mb-6">Budget Overview</h1>

      {/* Budget Setting Card */}
      <div className="finova-card p-5 mb-5">
        {editing ? (
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Set Monthly Budget (₹)</label>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-muted-foreground">₹</span>
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="flex-1 rounded-lg bg-muted px-3 py-2.5 text-lg font-bold text-foreground outline-none"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-primary-foreground">Save</button>
              <button onClick={() => setEditing(false)} className="flex-1 rounded-xl bg-muted py-2.5 text-sm font-semibold text-muted-foreground">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Monthly Budget</span>
              <button onClick={() => { setNewBudget(String(budget.monthly || "")); setEditing(true); }} className="text-xs font-semibold text-primary">
                {budget.monthly > 0 ? "Edit" : "Set Budget"}
              </button>
            </div>
            {budget.monthly > 0 ? (
              <>
                <p className="text-2xl font-bold text-foreground mb-3">{formatINR(budget.monthly)}</p>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${budgetPct}%`,
                      background: budgetPct > 90 ? "oklch(0.58 0.24 27)" : budgetPct > 70 ? "oklch(0.75 0.18 70)" : "var(--gradient-primary)",
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spent: {formatINR(totalMonth)} ({budgetPct.toFixed(0)}%)</span>
                  <span className={remaining < 0 ? "text-destructive font-semibold" : ""}>
                    {remaining >= 0 ? `Left: ${formatINR(remaining)}` : `Over: ${formatINR(Math.abs(remaining))}`}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Set a monthly budget to track your spending.</p>
            )}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <h2 className="text-base font-semibold text-foreground mb-3">Category Spending</h2>
      {Object.keys(categorySpending).length === 0 ? (
        <div className="finova-card p-6 text-center">
          <p className="text-sm text-muted-foreground">No spending data this month</p>
        </div>
      ) : (
        <div className="space-y-2">
          {CATEGORIES.filter((c) => categorySpending[c.name]).map((c) => {
            const spent = categorySpending[c.name];
            const pct = totalMonth > 0 ? (spent / totalMonth) * 100 : 0;
            return (
              <div key={c.name} className="finova-card p-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{c.icon}</span>
                  <span className="flex-1 text-sm font-medium text-foreground">{c.name}</span>
                  <span className="text-sm font-semibold text-foreground">{formatINR(spent)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
