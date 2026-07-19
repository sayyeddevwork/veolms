export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-line/15 bg-white px-6 py-10 text-center">
      <p className="text-ink/70">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full border border-line/20 px-4 py-1.5 text-sm"
        >
          Try again
        </button>
      )}
    </div>
  );
}
