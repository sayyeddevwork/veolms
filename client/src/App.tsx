import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { queryClient } from "@/lib/queryClient";
import { store } from "@/store/store";
import { router } from "@/app/router";
import { useBootstrapAuth } from "@/features/auth/hooks/useBootstrapAuth";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function AuthBootstrap() {
  useBootstrapAuth();
  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}

export default App;
