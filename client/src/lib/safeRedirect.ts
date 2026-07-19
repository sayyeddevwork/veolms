/**
 * Only ever redirect to a same-app relative path. `location.state.from`
 * (set by RequireAuth) is trusted today because we build it ourselves,
 * but the moment anyone adds a `?redirectTo=` query param or reads this
 * from anything URL-controllable, an absolute or protocol-relative value
 * ("https://evil.com", "//evil.com") becomes an open-redirect vector.
 * Route every redirect target through this guard regardless of source.
 */
export function safeInternalPath(path: unknown, fallback = "/"): string {
  if (typeof path !== "string" || path.length === 0) return fallback;
  // Must start with a single "/" — rejects "//evil.com", "https://evil.com",
  // "javascript:...", and bare "evil.com".
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
