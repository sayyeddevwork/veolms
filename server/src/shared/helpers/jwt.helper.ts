import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../../config/index.js";

export interface AccessTokenPayload {
  id: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  sessionId: string;
}
/**
 * Access tokens are short-lived, stateless JWTs.
 * They are NOT stored anywhere — verification is just a signature + expiry check.
 * Revocation works at the refresh-token/session layer instead (see auth.service.ts).
 */
export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload;
};
