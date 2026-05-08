import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-finova-store";
import { useNavigate, useLocation } from "@tanstack/react-router";
import finovaLogo from "@/assets/finova-logo.png";

export function SplashAndOnboarding({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"splash" | "onboarding" | "done">("splash");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (phase === "splash" && mounted) {
      const t = setTimeout(() => setPhase("onboarding"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase, mounted]);

  useEffect(() => {
    if (mounted && phase === "done" && !user && location.pathname !== "/login") {
      navigate({ to: "/login" });
    }
  }, [mounted, phase, user, location.pathname, navigate]);

  if (!mounted) return <>{children}</>;

  if (phase === "splash") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center gradient-primary animate-gradient-shift overflow-hidden">
        <div className="ambient-orbs" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[480px] w-[480px] rounded-full border border-primary-foreground/10 animate-ring-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[340px] w-[340px] rounded-full border border-primary-foreground/15 animate-ring-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[220px] w-[220px] rounded-full border border-primary-foreground/20 animate-ring-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="animate-logo-appear text-center relative z-10">
          <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-3xl bg-primary-foreground/20 backdrop-blur-sm overflow-hidden animate-pulse-glow shadow-glow">
            <img src={finovaLogo} alt="FinNova" width={112} height={112} className="h-24 w-24 object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground font-brand">
            <span className="opacity-90">Fin</span>Nova
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/75 tracking-wide">SMART · EXPENSE · TRACKER</p>
          <div className="mt-6 flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70 animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70 animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70 animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (phase === "onboarding") {
    const slides = [
      {
        icon: "📊",
        title: "Track Every Rupee",
        desc: "Effortlessly log expenses with smart categories and instant visual insights.",
        accent: "from-blue-500/20 to-purple-500/20",
      },
      {
        icon: "💰",
        title: "Budget Smarter",
        desc: "Set monthly budgets and savings goals. Stay on track with real-time alerts.",
        accent: "from-purple-500/20 to-pink-500/20",
      },
      {
        icon: "📈",
        title: "AI-Powered Insights",
        desc: "Get personalized spending analysis and smart tips to save more every month.",
        accent: "from-teal-500/20 to-blue-500/20",
      },
    ];

    const finish = () => {
      setPhase("done");
      if (!user) navigate({ to: "/login" });
    };

    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6 overflow-hidden">
        <div className="ambient-orbs" />
        <div key={slide} className="animate-float-up max-w-sm text-center w-full relative z-10">
          <div className="relative mx-auto mb-8 h-32 w-32">
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-ring-spin" />
            <div className="absolute inset-3 rounded-full border border-primary/30 animate-ring-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
            <div className="absolute inset-6 flex items-center justify-center rounded-2xl gradient-primary shadow-glow animate-pulse-glow">
              <span className="text-4xl">{slides[slide].icon}</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground tracking-tight">{slides[slide].title}</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed px-2">{slides[slide].desc}</p>

          <div className="mt-8 flex justify-center gap-2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === slide ? "w-8 gradient-primary shadow-glow" : "w-2 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (slide < slides.length - 1) setSlide(slide + 1);
              else finish();
            }}
            className="btn-animated mt-8 w-full rounded-xl gradient-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-glow"
          >
            {slide < slides.length - 1 ? "Next →" : "Get Started"}
          </button>
          {slide < slides.length - 1 && (
            <button
              onClick={finish}
              className="mt-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!user && location.pathname !== "/login") return null;

  return <>{children}</>;
}
