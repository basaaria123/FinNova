import { useState, useEffect } from "react";
import { useOnboarding, useAuth } from "@/hooks/use-finova-store";
import { useNavigate, useLocation } from "@tanstack/react-router";

export function SplashAndOnboarding({ children }: { children: React.ReactNode }) {
  const { seen, complete } = useOnboarding();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"splash" | "onboarding" | "done">("splash");
  const [slide, setSlide] = useState(0);

  // Only run client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    if (seen) {
      setPhase("done");
    }
  }, [seen]);

  useEffect(() => {
    if (phase === "splash" && mounted) {
      const t = setTimeout(() => {
        if (seen) {
          setPhase("done");
        } else {
          setPhase("onboarding");
        }
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [phase, mounted, seen]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (mounted && phase === "done" && !user && location.pathname !== "/login") {
      navigate({ to: "/login" });
    }
  }, [mounted, phase, user, location.pathname, navigate]);

  // During SSR or before mount, render children to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  if (phase === "splash") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center gradient-primary">
        <div className="animate-logo-appear text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
            <span className="text-4xl font-bold text-primary-foreground">F</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground font-brand">
            <span className="opacity-90">Fin</span>Nova
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/70">Smart Expense Tracker</p>
        </div>
      </div>
    );
  }

  if (phase === "onboarding") {
    const slides = [
      { icon: "📊", title: "Track Expenses", desc: "Log every rupee you spend with smart categories and instant insights." },
      { icon: "💰", title: "Budget Smarter", desc: "Set monthly budgets and savings goals to stay on track effortlessly." },
      { icon: "📈", title: "AI Insights", desc: "Get personalized spending analysis and smart tips to save more." },
    ];

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6">
        <div className="animate-fade-in-up max-w-sm text-center w-full">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow animate-pulse-glow">
            <span className="text-2xl">{slides[slide].icon}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">{slides[slide].title}</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">{slides[slide].desc}</p>

          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === slide ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (slide < slides.length - 1) {
                setSlide(slide + 1);
              } else {
                complete();
                setPhase("done");
                navigate({ to: "/login" });
              }
            }}
            className="btn-animated mt-8 w-full rounded-xl gradient-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-glow"
          >
            {slide < slides.length - 1 ? "Next" : "Get Started"}
          </button>
          {slide < slides.length - 1 && (
            <button
              onClick={() => {
                complete();
                setPhase("done");
                navigate({ to: "/login" });
              }}
              className="mt-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    );
  }

  // If not logged in and not on login page, show nothing (redirect handles it)
  if (!user && location.pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
