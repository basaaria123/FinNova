import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-finova-store";
import finovaLogo from "@/assets/finova-logo.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "FinNova — Login" },
      { name: "description", content: "Sign in or create your FinNova account." },
    ],
  }),
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, login, signup, loginWithGoogle, sendPasswordReset } = useAuth();
  const navigate = useNavigate();

  // Redirect once logged in (covers Google OAuth return + post-signup)
  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    if (mode === "forgot") return null;
    if (password.length < 6) return "Password must be at least 6 characters";
    if (mode === "signup") {
      if (!name.trim()) return "Name is required";
      if (password !== confirmPassword) return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const err = validate();
    if (err) { setError(err); return; }
    setBusy(true);
    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (res) setError(res);
      } else if (mode === "signup") {
        const res = await signup(name.trim(), email.trim(), password);
        if (res) setError(res);
      } else {
        const res = await sendPasswordReset(email.trim());
        if (res) setError(res);
        else setSuccess("Check your email for a reset link.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(""); setBusy(true);
    const res = await loginWithGoogle();
    if (res) setError(res);
    setBusy(false);
  };

  const switchMode = (m: typeof mode) => { setMode(m); setError(""); setSuccess(""); };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 overflow-hidden">
      <div className="ambient-orbs" />
      <div className="w-full max-w-sm animate-fade-in-up relative z-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl overflow-hidden animate-pulse-glow shadow-glow">
            <img src={finovaLogo} alt="FinNova logo" width={80} height={80} className="h-full w-full object-contain" />
          </div>
          <h1 className="font-brand text-2xl" style={{ color: 'var(--finova-metal-blue)' }}>
            <span style={{ opacity: 0.85 }}>Fin</span>Nova
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "forgot" ? "Reset your password" : "Your smart expense companion"}
          </p>
        </div>

        {mode !== "forgot" && (
          <div className="mb-6 flex rounded-xl bg-muted/60 p-1">
            <button type="button" onClick={() => switchMode("login")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${mode === "login" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}>
              Login
            </button>
            <button type="button" onClick={() => switchMode("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${mode === "signup" ? "bg-card shadow-card text-foreground" : "text-muted-foreground"}`}>
              Sign Up
            </button>
          </div>
        )}

        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-card px-4 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted/50 disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C41.3 35.4 44 30.1 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              Continue with Google
            </button>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="animate-fade-in-up">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          {mode !== "forgot" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          )}
          {mode === "signup" && (
            <div className="animate-fade-in-up">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          )}

          {error && <div className="animate-fade-in-up rounded-xl bg-destructive/10 px-4 py-2.5 text-xs font-medium text-destructive">{error}</div>}
          {success && <div className="animate-fade-in-up rounded-xl bg-success/10 px-4 py-2.5 text-xs font-medium text-success">{success}</div>}

          <button type="submit" disabled={busy}
            className="btn-animated w-full rounded-xl gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
            {busy ? "Please wait…" : mode === "login" ? "Login" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          {mode === "login" && (
            <button onClick={() => switchMode("forgot")} className="text-xs text-primary font-medium hover:text-primary/80">
              Forgot password?
            </button>
          )}
          {mode === "forgot" && (
            <button onClick={() => switchMode("login")} className="text-xs text-primary font-medium hover:text-primary/80">
              ← Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
