# Security

- Paddle webhook signatures verified with HMAC-SHA256 (timing-safe).
- Raw request body used for verification.
- Idempotent event processing via webhook_events table.
- OTPs hashed, expired, attempt-limited, rate-limited.
- Activation tokens hashed; raw token only in HttpOnly cookie.
- No secrets in client bundle; only NEXT_PUBLIC_ Paddle config exposed.
- SQL via Drizzle (parameterized).
- No card data stored.