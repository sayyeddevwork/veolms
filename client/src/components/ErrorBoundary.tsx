import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Wire this into an error-reporting service (Sentry, etc.) in production.
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
          <h1 className="font-display text-2xl">Something went wrong</h1>
          <p className="max-w-sm text-ink/60">
            Please refresh the page. If this keeps happening, let us know.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-ink px-5 py-2 text-paper"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
