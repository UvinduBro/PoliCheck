import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle, requestPasswordReset } from "@/lib/firebase/auth";
import { loginSchema, type LoginFormValues } from "@/lib/validation/schemas";
import { firebaseConfigured } from "@/lib/firebase/config";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      await loginWithEmail(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    }
  }

  async function onGoogleLogin() {
    setError(null);
    try {
      await loginWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Google sign-in failed.");
    }
  }

  async function onForgotPassword() {
    const email = getValues("email");
    if (!email) {
      setError("Enter your email above first, then click 'Forgot password'.");
      return;
    }
    try {
      await requestPasswordReset(email);
      setResetSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send reset email.");
    }
  }

  if (!firebaseConfigured) {
    return (
      <div className="mx-auto max-w-md p-8 text-center text-sm text-ink-muted">
        Authentication is not configured in this environment. Set the VITE_FIREBASE_* variables.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-page-heading font-semibold text-ink">Sign in to CivicLens</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" autoComplete="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-status-critical">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm text-status-critical">{errors.password.message}</p>}
        </div>
        {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}
        {resetSent && <p role="status" className="text-sm text-status-verified">Password reset email sent.</p>}
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        <button type="button" className="text-sm text-accent hover:underline" onClick={onForgotPassword}>
          Forgot password?
        </button>
      </form>
      <div className="mt-4">
        <button type="button" className="btn-secondary w-full" onClick={onGoogleLogin}>
          Continue with Google
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-ink-muted">
        Need an account? <Link to="/register" className="text-accent hover:underline">Register as a researcher</Link>
      </p>
    </div>
  );
}
