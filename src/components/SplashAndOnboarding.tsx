import { useState, useEffect } from "react";
import { useOnboarding } from "@/hooks/use-finova-store";

export function SplashAndOnboarding({ children }: { children: React.ReactNode }) {
  const { seen, complete } = useOnboarding();
  const [phase, setPhase] = useState<"splash" | "onboarding" | "app">(
    seen ? "app" : "splash"
  );

  useEffect(() => {
    if (phase === "splash") {
      const t = setTimeout(() => setPhase("onboarding"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "splash") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center gradient-primary">
        <div className="animate-logo-appear text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
            <span className="text-4xl font-bold text-primary-foreground">F</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground">Finova</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">Smart Expense Tracker</p>
        </div>
      </div>
    );
  }

  if (phase === "onboarding") {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6">
        <div className="animate-fade-in-up max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">F</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to Finova</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Track your expenses, manage budgets, and gain smart insights — all in Indian Rupees.
          </p>
          <div className="mt-8 space-y-3">
            <Feature icon="📊" text="Track spending with smart categories" />
            <Feature icon="💰" text="Set monthly budgets & savings goals" />
            <Feature icon="📈" text="Get AI-powered spending insights" />
          </div>
          <button
            onClick={() => {
              complete();
              setPhase("app");
            }}
            className="mt-8 w-full rounded-xl gradient-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-glow transition-transform active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 text-left">
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
}
