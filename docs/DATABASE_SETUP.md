# Database Setup

## Provider
Neon PostgreSQL (or any Postgres). Set DATABASE_URL.

## Migrations
Schema defined in lib/db/schema.ts (Drizzle ORM).
Run: npx drizzle-kit push (or generate + migrate).

## Tables
customers, transactions, licenses, activations, otp_challenges, webhook_events.

## Notes
- Use separate databases for sandbox and production.
- Never mix webhook secrets across environments.