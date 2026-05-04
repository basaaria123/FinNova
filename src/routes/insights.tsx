import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useExpenses } from "@/hooks/use-finova-store";
import { formatINR } from "@/lib/format";
import { CATEGORIES } from "@/lib/types";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  isWithinInterval, parseISO, format, subDays, eachDayOfInterval,
} from "date-fns";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
  head: () => ({
    meta: [
      { title: "Insights — Finova" },
      { name: "description", content: "View spending trends, category breakdown, and smart insights." },
    ],
  }),
});

const PIE_COLORS = [
  "oklch(0.55 0.22 265)",
  "oklch(0.6 0.2 290)",
  "oklch(0.65 0.18 180)",
  "oklch(0.7 0.18 50)",
  "oklch(0.6 0.22 330)",
  "oklch(0.65 0.2 145)",
  "oklch(0.7 0.15 80)",
  "oklch(0.5 0.03 270)",
];

function InsightsPage() {
  const { expenses } = useExpenses();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const { totalMonth, totalWeek, categoryData, topCategory, trendData } = useMemo(() => {
    let totalM = 0;
    let totalW = 0;
    const catMap: Record<string, number> = {};

    for (const e of expenses) {
      const d = parseISO(e.date);
      if (isWithinInterval(d, { start: monthStart, end: monthEnd })) {
        totalM += e.amount;
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      }
      if (isWithinInterval(d, { start: weekStart, end: weekEnd })) {
        totalW += e.amount;
      }
    }

    const catData = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const top = catData[0]?.name || null;

    // Trend: last 14 days
    const days = eachDayOfInterval({ start: subDays(now, 13), end: now });
    const dayMap: Record<string, number> = {};
    for (const e of expenses) {
      const key = format(parseISO(e.date), "MM/dd");
      dayMap[key] = (dayMap[key] || 0) + e.amount;
    }
    const trend = days.map((d) => ({
      date: format(d, "dd"),
      amount: dayMap[format(d, "MM/dd")] || 0,
    }));

    return { totalMonth: totalM, totalWeek: totalW, categoryData: catData, topCategory: top, trendData: trend };
  }, [expenses, monthStart, monthEnd, weekStart, weekEnd, now]);

  return (
    <div className="px-4 pb-24 pt-6">
      <h1 className="text-xl font-bold text-foreground mb-6">Insights</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="finova-card p-4">
          <p className="text-xs text-muted-foreground mb-1">This Month</p>
          <p className="text-lg font-bold text-foreground">{formatINR(totalMonth)}</p>
        </div>
        <div className="finova-card p-4">
          <p className="text-xs text-muted-foreground mb-1">This Week</p>
          <p className="text-lg font-bold text-foreground">{formatINR(totalWeek)}</p>
        </div>
      </div>

      {/* Smart Insight */}
      {topCategory && (
        <div className="finova-card gradient-card p-4 mb-6">
          <p className="text-xs font-medium text-muted-foreground mb-1">💡 Smart Insight</p>
          <p className="text-sm font-medium text-foreground">
            You're spending most on <span className="font-bold text-primary">{topCategory}</span> this month
          </p>
        </div>
      )}

      {/* Spending Trend */}
      <div className="finova-card p-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Spending Trend (14 days)</h2>
        {trendData.every((d) => d.amount === 0) ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--color-muted-foreground)" width={45} tickFormatter={(v: number) => `₹${v}`} />
              <Tooltip
                formatter={(value: any) => [formatINR(Number(value)), "Spent"]}
                contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }}
              />
              <Line type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Pie */}
      <div className="finova-card p-4 mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Category Breakdown</h2>
        {categoryData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatINR(Number(value))} contentStyle={{ borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryData.map((c, i) => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
