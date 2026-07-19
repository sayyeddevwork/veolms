import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="mt-3 text-ink/60">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-6 inline-block underline">
        Back to home
      </Link>
    </section>
  );
}
