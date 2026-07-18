# Auth Module — Wiring Guide

## 1. Install packages

```bash
npm install argon2 jsonwebtoken nodemailer cookie-parser
npm install -D @types/jsonwebtoken @types/nodemailer @types/cookie-parser
```

## 2. Merge Prisma schema

Copy the models from `schema-additions.prisma` into your real `schema.prisma`.
If you already have a `User` model, merge the new fields/relations into it instead
of creating a duplicate model (see comment at top of the file).

Then:

```bash
npx prisma migrate dev --name add_auth_tables
```

## 3. Env vars — add to `.env` and your `config/env.ts`

```env
JWT_ACCESS_SECRET=replace-with-a-long-random-string
JWT_ACCESS_EXPIRES_IN=15m

CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM="Your App <no-reply@yourapp.com>"
```

Make sure your `config/env.ts` validates/exposes these (e.g. via Zod, if that's
what you're using there) — I didn't include that file since I haven't seen your
existing `env.ts`.

## 4. Wire cookie-parser + the route in `app.ts`

```typescript
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";

app.use(cookieParser());
// ... your existing middleware (requestId, metrics, express.json, etc.)

app.use("/api/v1/auth", authRoutes);
```

`cookieParser()` must run before the auth routes, since `auth.controller.ts`
reads `req.cookies.refreshToken`.

## 5. Protecting other routes with the same access token

Anywhere else in your app that needs a logged-in user, just use the same
`authenticate` middleware:

```typescript
import { authenticate } from "../../middleware/authenticate.js";

router.get("/me", authenticate, userController.getProfile);
```

Inside any handler behind `authenticate`, `req.userId` and `req.sessionId`
are available and typed (declared via the global Express augmentation in
`authenticate.ts`).

## 6. Messages constants (optional but recommended)

`authenticate.ts` references `Messages.UNAUTHORIZED` and
`Messages.INVALID_OR_EXPIRED_TOKEN` with `??` fallbacks in case they don't
exist yet in your `constants/messages.ts`. Add them there for consistency
with the rest of your error messages:

```typescript
export const Messages = {
  // ...your existing messages
  UNAUTHORIZED: "Unauthorized",
  INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
};
```

## Endpoint summary

| Method | Path                             | Auth required | Purpose                                      |
| ------ | -------------------------------- | ------------- | -------------------------------------------- |
| POST   | /api/v1/auth/register            | No            | Create account, sends verify email           |
| POST   | /api/v1/auth/login               | No            | Login, sets refresh cookie                   |
| POST   | /api/v1/auth/refresh-token       | No (cookie)   | Rotate refresh token, new access token       |
| POST   | /api/v1/auth/logout              | No (cookie)   | Revoke current session                       |
| POST   | /api/v1/auth/forgot-password     | No            | Send password reset email                    |
| POST   | /api/v1/auth/reset-password      | No            | Reset password via token, kills all sessions |
| POST   | /api/v1/auth/verify-email        | No            | Verify email via token                       |
| POST   | /api/v1/auth/change-password     | Yes           | Change password, revokes other sessions      |
| POST   | /api/v1/auth/logout-all          | Yes           | Revoke all sessions (logout everywhere)      |
| GET    | /api/v1/auth/sessions            | Yes           | List active sessions/devices                 |
| DELETE | /api/v1/auth/sessions/:sessionId | Yes           | Revoke one specific device/session           |

## Design notes

- **Access token**: short-lived JWT (15m default), sent in response body,
  client stores it in memory and sends via `Authorization: Bearer <token>`.
- **Refresh token**: random opaque string, sent as an `httpOnly` cookie
  scoped to `/api/v1/auth`. Only the hash is stored in the `Session` table —
  a leaked database never exposes a usable token.
- **Refresh rotation**: every call to `/refresh-token` revokes the old
  session and issues a new one. This limits replay if a refresh token is
  ever stolen.
- **Password reset / change password** both revoke sessions (reset kills
  _all_ sessions since it's a recovery flow; change-password keeps the
  current session alive so the user isn't logged out of the device they're
  using).
- **Forgot-password** always responds with the same message whether or not
  the email exists, to avoid leaking which emails are registered.

# Course Testing!

GET Published Courses
GET Course By Id
GET Invalid Course Id
GET Unknown Course
POST Create Course (Instructor)
POST Create Course (Admin)
POST Student Cannot Create
POST Anonymous Cannot Create
POST Empty Body
POST Missing Title
POST Missing Description
POST Missing Thumbnail
POST Missing Price
POST Negative Price
PATCH Update Own Course
PATCH Publish Course
PATCH Unpublish Course
PATCH Instructor Updates Another Course
DELETE Delete Own Course
DELETE Instructor Deletes Another Course
GET Admin List Courses
======================
