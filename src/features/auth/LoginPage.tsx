import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginWithEmail, requestPasswordReset } from "@/lib/firebase/auth";
import { loginSchema, type LoginFormValues } from "@/lib/validation/schemas";
import { firebaseConfigured } from "@/lib/firebase/config";
import { PasswordInput } from "@/components/forms/PasswordInput";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
  const email = watch("email");

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      await loginWithEmail(values.email, values.password);
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
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
      <h1 className="text-page-heading font-semibold text-ink">{t("auth.signInTitle")}</h1>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="email">{t("auth.email")}</label>
          <input id="email" type="email" className="input" autoComplete="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-status-critical">{errors.email.message}</p>}
        </div>
        <PasswordInput
          id="password"
          label={t("auth.password")}
          autoComplete="current-password"
          registration={register("password")}
          error={errors.password?.message}
        />
        {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}
        {resetSent && <p role="status" className="text-sm text-status-verified">{t("auth.resetSent")}</p>}
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
        </button>
        <button type="button" className="text-sm text-accent hover:underline" onClick={onForgotPassword}>
          {t("auth.forgotPassword")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        {t("auth.needAccount")}{" "}
        <Link to="/register" state={{ email }} className="text-accent hover:underline">
          {t("auth.signUp")}
        </Link>
      </p>
    </div>
  );
}
