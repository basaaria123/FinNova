import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSavingsGoals } from "@/hooks/use-finova-store";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile — Finova" },
      { name: "description", content: "Manage goals, reports, and settings." },
    ],
  }),
});

function ProfilePage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useSavingsGoals();
  const [showAdd, setShowAdd] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  const handleAdd = () => {
    const t = parseFloat(goalTarget);
    if (!goalName.trim() || !t || t <= 0) return;
    addGoal({ name: goalName.trim(), target: t, saved: 0 });
    setGoalName("");
    setGoalTarget("");
    setShowAdd(false);
  };

  return (
    <div className="px-4 pb-24 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-xl font-bold text-primary-foreground shadow-glow">
          U
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your finances</p>
        </div>
      </div>

      {/* Savings Goals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Savings Goals</h2>
          <button onClick={() => setShowAdd(!showAdd)} className="text-xs font-semibold text-primary">
            {showAdd ? "Cancel" : "+ Add Goal"}
          </button>
        </div>

        {showAdd && (
          <div className="finova-card p-4 mb-3 space-y-3">
            <input
              type="text"
              placeholder="Goal name (e.g., Vacation)"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              maxLength={50}
              className="w-full rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-muted-foreground">₹</span>
              <input
                type="number"
                placeholder="Target amount"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                className="flex-1 rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
              />
            </div>
            <button onClick={handleAdd} className="w-full rounded-xl gradient-primary py-2.5 text-sm font-semibold text-primary-foreground">
              Create Goal
            </button>
          </div>
        )}

        {goals.length === 0 && !showAdd ? (
          <div className="finova-card p-6 text-center">
            <p className="text-2xl mb-2">🎯</p>
            <p className="text-sm text-muted-foreground">No savings goals yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {goals.map((g) => {
              const pct = g.target > 0 ? Math.min((g.saved / g.target) * 100, 100) : 0;
              return (
                <div key={g.id} className="finova-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{g.name}</span>
                    <button onClick={() => deleteGoal(g.id)} className="text-xs text-muted-foreground hover:text-destructive">✕</button>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-base font-bold text-foreground">{formatINR(g.saved)}</span>
                    <span className="text-xs text-muted-foreground">/ {formatINR(g.target)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden mb-2">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-2">
                    {[500, 1000, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => updateGoal(g.id, Math.min(g.saved + amt, g.target))}
                        className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        +₹{amt.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Settings */}
      <h2 className="text-base font-semibold text-foreground mb-3">Settings</h2>
      <div className="finova-card divide-y divide-border">
        <SettingsRow icon="🔔" label="Notifications" value="Enabled" />
        <SettingsRow icon="💱" label="Currency" value="INR (₹)" />
        <SettingsRow icon="📱" label="Version" value="1.0.0" />
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-base">{icon}</span>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}
