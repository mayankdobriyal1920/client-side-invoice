# Paddle Integration

## Architecture
- Frontend: Paddle.js client-side checkout (NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, NEXT_PUBLIC_PADDLE_PRICE_ID).
- Backend: Vercel serverless route POST /api/paddle/webhook verifies Paddle-Signature and processes events.
- No subscription lifecycle; one-time lifetime purchase.

## Webhook events handled
- transaction.completed: verifies price/quantity, creates customer/transaction/license.
- transaction.refunded / adjustment.created: revokes license and invalidates activations.

## Environment variables
See .env.example. Server-side only: PADDLE_WEBHOOK_SECRET, PADDLE_API_KEY, DATABASE_URL, RESEND_API_KEY, RESEND_FROM_EMAIL.

## Dashboard steps
1. Create Pro product + $29 price in Paddle (sandbox then live).
2. Create notification destination pointing to https://easybillkit.online/api/paddle/webhook.
3. Copy webhook signing secret to PADDLE_WEBHOOK_SECRET.
4. Submit easybillkit.online for website approval.