import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail } from "@/lib/firebase/auth";
import { registerSchema, type RegisterFormValues } from "@/lib/validation/schemas";
import { firebaseConfigured } from "@/lib/firebase/config";

export function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

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
      <div className="mx-auto max-w-md p-8 text-center text-sm text-gray-600">
        Authentication is not configured in this environment. Set the VITE_FIREBASE_* variables.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-xl font-semibold text-gray-900">Create a researcher account</h1>
      <p className="mt-1 text-sm text-gray-600">
        New accounts start with public-level access. A reviewer or administrator must upgrade your role
        to "researcher" before you can add records.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="displayName">Full name</label>
          <input id="displayName" className="input" autoComplete="name" {...register("displayName")} />
          {errors.displayName && <p className="mt-1 text-sm text-red-700">{errors.displayName.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" autoComplete="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" className="input" autoComplete="new-password" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm text-red-700">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" className="input" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-700">{errors.confirmPassword.message}</p>}
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-blue-700 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
