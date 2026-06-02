import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [{ title: "FinNova — Reset Password" }],
  }),
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); return; }
    setSuccess("Password updated! Redirecting…");
    setTimeout(() => navigate({ to: "/" }), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Set new password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {error && <div className="rounded-xl bg-destructive/10 px-4 py-2.5 text-xs font-medium text-destructive">{error}</div>}
          {success && <div className="rounded-xl bg-success/10 px-4 py-2.5 text-xs font-medium text-success">{success}</div>}
          <button type="submit" className="btn-animated w-full rounded-xl gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
