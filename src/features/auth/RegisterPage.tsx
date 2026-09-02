import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerWithEmail } from "@/lib/firebase/auth";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/schemas";
import { firebaseConfigured } from "@/lib/firebase/config";
import { PasswordInput } from "@/components/forms/PasswordInput";

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const prefillEmail = (location.state as { email?: string } | null)?.email;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: prefillEmail ?? "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setError(null);
    try {
      await registerWithEmail(values.email, values.password, values.displayName);
      navigate("/account", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed.");
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
      <h1 className="text-page-heading font-semibold text-ink">Sign up</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Create an account to add politician records — an admin reviews new submissions before they're
        published.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="displayName">Full name</label>
          <input id="displayName" className="input" autoComplete="name" {...register("displayName")} />
          {errors.displayName && <p className="mt-1 text-sm text-status-critical">{errors.displayName.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" autoComplete="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-status-critical">{errors.email.message}</p>}
        </div>
        <PasswordInput
          id="password"
          label="Password"
          autoComplete="new-password"
          registration={register("password")}
          error={errors.password?.message}
        />
        {error && <p role="alert" className="text-sm text-status-critical">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
