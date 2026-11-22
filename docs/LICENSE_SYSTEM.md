# License System

## Flow
1. Customer purchases via Paddle checkout.
2. Paddle sends transaction.completed webhook (verified server-side).
3. Server creates customer, transaction, and active license.
4. Customer visits /activate, enters purchase email.
5. POST /api/license/request-otp sends a 6-digit code (only if active license exists; generic response either way).
6. POST /api/license/verify-otp validates code, creates activation session (hashed token in DB, raw token in HTTP-only cookie).
7. GET /api/license/status returns isPro based on cookie + DB.
8. POST /api/license/logout revokes session.

## Security
- OTPs and tokens are hashed (SHA-256) before storage.
- Cookies are HttpOnly, Secure in production, SameSite=Lax.
- No passwords or accounts.