import crypto from "crypto";

/**
 * Generates a raw, URL-safe random token.
 * This is the value sent to the user (via email link, or as the refresh token) —
 * it is NEVER stored in the database directly.
 */
export const generateRawToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString("hex");
};

/**
 * Hashes a raw token for safe storage in the database.
 * Lookups are done by hashing the incoming raw token and comparing hashes,
 * so a leaked database never exposes usable tokens.
 */
export const hashToken = (rawToken: string): string => {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
};
