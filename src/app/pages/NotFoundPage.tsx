import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink-muted">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Back to home</Link>
    </div>
  );
}
