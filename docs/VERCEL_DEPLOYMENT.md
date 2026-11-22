# Vercel Deployment

1. Set all env vars from .env.example in Vercel (Production + Preview).
2. Ensure DATABASE_URL points to production Postgres.
3. Run migrations against production DB.
4. Configure Resend sending domain.
5. Configure Paddle notification destination to https://easybillkit.online/api/paddle/webhook.
6. Redeploy after env changes.
7. Test /api/license/status and webhook delivery.