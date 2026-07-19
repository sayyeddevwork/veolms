import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api/v1";

// Fail loudly at boot rather than silently sending credentialed requests
// over plaintext HTTP in production (e.g. a misconfigured env var).
if (import.meta.env.PROD && !baseURL.startsWith("https://")) {
  throw new Error(
    `VITE_API_BASE_URL must be https:// in production, got: ${baseURL}`,
  );
}

export const api = axios.create({
  baseURL,
  withCredentials: true, // send/receive httpOnly cookies (accessToken/refreshToken)
  timeout: 15_000,
  maxContentLength: 10 * 1024 * 1024, // 10MB response cap — refuse to buffer runaway payloads
  headers: {
    "Content-Type": "application/json",
  },
});

// --- CSRF mitigation ----------------------------------------------------
// We authenticate via httpOnly cookies, which a cross-site <form> submit
// or <img>/fetch(no-cors) can also trigger. A custom header can only be
// attached by JS running on an origin CORS explicitly allows (the browser
// blocks it pre-flight otherwise), so requiring one on every mutating
// request blocks naive cross-site form/script CSRF. The backend's CORS
// config (allowed origin = frontend domain only) is what actually
// enforces this — this header is defense-in-depth, not a substitute
// for that server-side check.
api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();
  if (method && method !== "GET" && method !== "HEAD") {
    config.headers.set("X-Requested-With", "XMLHttpRequest");
  }
  return config;
});

// --- Refresh-on-401 handling ---------------------------------------------
// Backend uses short-lived access tokens + httpOnly refresh cookie.
// On a 401 we try /auth/refresh once, then retry the original request.
// Concurrent 401s share a single in-flight refresh call.

let refreshPromise: Promise<void> | null = null;

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

function isAuthRoute(url?: string) {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh")
  );
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retried ||
      isAuthRoute(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshPromise = null;
          });
      }
      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — bubble up so the UI can redirect to login.
      return Promise.reject(refreshError);
    }
  },
);
