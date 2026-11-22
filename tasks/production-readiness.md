# SimpleInvoice Studio — Production Readiness Task Tracker

**Project:** SimpleInvoice Studio (client-side-invoice)  
**Spec:** `invoice_studio_production_spec.md`  
**Created:** 22 November 2026  
**Status legend:** `[ ]` not started · `[x]` done · `[~]` in progress  
**Priority:** P0 (must have for launch) · P1 (required for quality launch) · P2 (polish / Phase 2)

> Tick an item only when implemented **and** tested per spec §18 and §21.

---

## Phase 0 — Project foundation

- [x] [P0] Create Next.js + TypeScript project (App Router) with static export.
- [x] [P0] Configure Tailwind CSS design tokens (colors, radius, fonts).
- [x] [P0] Set up shared root layout, global styles, header/footer.
- [x] [P0] Add metadata, sitemap and robots handling (per-page unique titles/descriptions).
- [x] [P0] Configure secure response headers (vercel.json).
- [x] [P0] Set up lint, typecheck, test, build scripts.
- [x] [P1] Set up error boundary (app/error.tsx) and not-found page.
- [ ] [P1] Add privacy-friendly analytics wiring (lib/analytics) — page-level events only, no document data.
- [ ] [P1] Add Web Vitals reporting.
- [ ] [P2] Add consent/cookie banner if required by ad config.

---

## Phase A — Core free product

### A1. Money & calculation engine (lib/calculations, lib/formatting)
- [x] [P0] Implement money as integer minor units (cents) utilities.
- [x] [P0] Implement decimal-safe line subtotal (qty × unit price).
- [x] [P0] Implement per-line discount (percentage and fixed).
- [x] [P0] Implement document-level discount (percentage and fixed).
- [x] [P0] Implement shipping/expense/additional charge.
- [x] [P0] Implement tax calculation (user-entered rate or manual amount; no auto rates).
- [x] [P0] Implement deposits/amount paid and balance due.
- [x] [P0] Implement grand total.
- [x] [P0] Define and document rounding policy (line vs document); tests.
- [x] [P0] Currency formatting (USD default) with user-selected date format.
- [x] [P0] Date handling using local calendar dates (no UTC day shift).
- [x] [P0] Unit tests for all calculations (line subtotal, qty decimals, % discount, fixed discount, doc discount, tax %, manual tax, partial payment, balance, rounding, currency formatting).

### A2. Validation (lib/validation)
- [x] [P0] Quantity positive, unit price non-negative, discount ≤ line amount.
- [x] [P0] Prevent NaN/Infinity; inline errors.
- [x] [P0] Due date not earlier than issue date unless override.
- [x] [P0] Zod schemas for document/client/business profile.
- [x] [P0] Sanitize user-entered text before render (no dangerouslySetInnerHTML).
- [x] [P0] Uploaded image validation (type, size ≤ ~2MB).

### A3. Storage (lib/storage)
- [x] [P0] IndexedDB wrapper for business profile, clients, catalog items, invoices, estimates, receipts, numbering prefs, user prefs, license state.
- [x] [P0] Versioned schema + safe migrations.
- [x] [P0] Handle storage quota failures gracefully; clear message if storage unavailable.
- [x] [P0] Never silently discard user data.
- [x] [P0] JSON backup export with filename sanitization.
- [x] [P0] JSON backup import with schema/version validation, preview counts, confirmation.
- [x] [P0] Safe replace (and merge if correctly implemented) with warning.
- [x] [P0] Visible notice about local-only storage.

### A4. Business profile & clients
- [x] [P0] Business profile form (name, contact, email, phone, address, city/state/ZIP, country, logo, website, tax ID/EIN optional with warning).
- [x] [P0] Logo upload (PNG/JPEG/WebP), local processing, preserve aspect ratio, remove/replace, size limit.
- [x] [P0] Client directory: add/edit/search/select/delete; warn before deleting referenced client.
- [x] [P0] Selecting client fills document.

### A5. Document editor (invoice/estimate/receipt)
- [x] [P0] Invoice editor layout (desktop left form/right live preview; mobile single column + preview tab).
- [x] [P0] Line items: add/remove/reorder/duplicate, select saved service, optional notes.
- [x] [P0] Document metadata: number, issue date, due/valid-until, PO/ref, currency, status, title.
- [x] [P0] Local sequential numbering (INV/EST/REC prefixes), editable prefix/next number, avoid duplicates locally.
- [x] [P0] Totals/adjustments UI (subtotal, discounts, shipping, tax, deposit/paid, balance, total).
- [ ] [P0] Unsaved-changes warning.
- [x] [P0] Save to IndexedDB; reopen/edit.
- [x] [P0] Duplicate document.
- [ ] [P1] Reorder line items if practical.

### A6. Estimate & receipt specifics
- [x] [P0] Estimate: scope of work, assumptions, exclusions, terms, visual acceptance area (no legal e-signature claim).
- [x] [P0] Mark estimate accepted/declined locally.
- [x] [P0] Convert accepted estimate → new invoice (new number, preserve items/details, keep estimate, store reference, review before save).
- [x] [P0] Receipt: payment date, method label, amount received, related invoice, reference/transaction ID, notes.
- [x] [P0] Full/partial payment receipt; update invoice paid/balance after confirmation.

### A7. Document management (/documents)
- [x] [P0] Search by number/client/title; filter by type/status; sort by date/number/client/total.
- [x] [P0] Open/edit, duplicate, download PDF, print, delete with confirmation.
- [x] [P0] Convert estimate, record payment.
- [x] [P0] Export document data.
- [x] [P0] Overdue status only if due date past and balance > 0; explain local basis.

### A8. PDF & print
- [x] [P0] Real downloadable PDF (multi-page, repeating table headers, page numbers, document number).
- [x] [P0] Include business/client details, totals, logo; selectable text.
- [x] [P0] Sanitized file names (Invoice-INV-0001.pdf etc.).
- [x] [P0] Print stylesheet: hide nav/controls/ads; print only document; no clipped margins.
- [ ] [P0] PDF quality tests (empty optionals, long names/descriptions, 1/10/25/50 items, multi-page, logo present/absent, large totals, discounts/taxes, partial payment, invalid input rejection, mobile download).

### A9. UI/UX & accessibility
- [ ] [P0] Responsive layouts; no horizontal overflow; touch targets ~44px.
- [ ] [P0] Semantic HTML, keyboard access, visible focus, labels, error text, screen-reader announcements, contrast, reduced motion.
- [ ] [P0] Accessible dialogs/confirmations.

### A10. Tests (Phase A)
- [ ] [P0] Unit tests for calculations and numbering and due-date status.
- [ ] [P0] Integration: create invoice → preview → save → reopen → export PDF.
- [ ] [P0] Integration: client → select → populate invoice.
- [ ] [P0] Integration: estimate → accepted → convert to invoice.
- [ ] [P0] Integration: invoice → partial payment → receipt.
- [ ] [P0] Integration: export backup → clear data → import → verify.
- [ ] [P0] Browser tests: Chrome/Safari/Firefox desktop, Mobile Safari/Chrome (PDF download, print, logo upload, IndexedDB, refresh, mobile keyboard, no overflow).

---

## Phase B — Pro and payments

- [x] [P1] Pricing page (free vs Pro, one-time, inclusions, refund/license/device limitations, no account required, local data no sync, activation may need internet).
- [x] [P1] Gumroad product setup (owner action) + hosted checkout link/button.
- [x] [P1] License activation page (key field, activate, loading, success/failure, help link, privacy).
- [x] [P1] License verification via official Gumroad mechanism (no secrets in frontend).
- [x] [P1] Handle invalid/revoked/exhausted/network/rate-limit/outage; never log/track keys.
- [x] [P1] Grace period for previously verified entitlement during provider outage (disclosed).
- [x] [P1] Re-verify/restore action.
- [x] [P1] Pro feature gating (premium templates, brand colors, multiple profiles, themes, CSV export, batch PDF if implemented, ad-free).
- [x] [P1] Ad-free experience for Pro if promised (consistent).
- [x] [P1] Honest security model disclosures (frontend gates not DRM).

---

## Phase C — SEO and content

- [x] [P1] Core SEO pages (free invoice generator, estimate maker, receipt maker, contractor/handyman/cleaning/landscaping/plumber/electrician/freelancer/consultant/tutor invoice generators).
- [x] [P1] Utility pages (estimate-template, receipt-template, invoice-number-generator, hourly-invoice-calculator).
- [ ] [P1] Unique title/meta, one H1, headings, original copy, working tool, FAQs, internal links, canonical, OG metadata, alt text.
- [ ] [P1] XML sitemap, robots.txt, canonical trailing slash/host, HTTPS, redirects, favicon/social image.
- [ ] [P1] Avoid indexing app states/activation URLs/query variants/private views; no client data in URLs.
- [ ] [P1] Structured data only where qualifies; no fake review/rating schema.
- [ ] [P2] Industry pages with genuinely relevant examples (fictional data), tips, payment terms, FAQ, limitations.
- [ ] [P2] Search Console setup (owner action).

---

## Phase D — AdSense

- [ ] [P2] Review current AdSense policies; complete site content & legal disclosures.
- [ ] [P2] Apply for AdSense (owner action).
- [ ] [P2] Implement approved ad code in safe placements (homepage below value prop, guide/template pages within content; no ads in editor active area/checkout/activation/PDFs).
- [ ] [P2] Reserve ad slots; avoid layout shift; no ads blocking editor.
- [ ] [P2] Consent/privacy tooling per jurisdiction.
- [ ] [P2] Pro ad-free behavior if promised.

---

## Phase E — Production hardening

- [ ] [P0] Security/privacy tests: inspect network requests, no document data to analytics/ads, logos not uploaded, license key not logged/tracked, malicious strings, malformed backup JSON, oversized image, bundle secret scan.
- [ ] [P0] Accessibility checks.
- [ ] [P0] Performance checks (lazy-load, code splitting, optimize images, offline handling).
- [ ] [P0] All routes tested directly + refresh; 404; sitemap/robots; metadata; contact email.
- [ ] [P0] Gumroad checkout URL + license activation verified.
- [ ] [P0] Privacy/terms reflect real behavior.
- [ ] [P0] Vercel deployment verified.
- [ ] [P0] Final issue report (features, routes, deps, schema/migrations, PDF lib, owner steps, license flow/limits, AdSense steps, privacy/network results, test commands/results, build result, bugs/limits, deploy instructions, verdict).

---

## Cross-cutting

- [x] [P0] Legal pages: privacy policy accurate (local storage, Gumroad data, analytics, ads, deletion, no sync), terms with disclaimers, about, contact with mailto:hello@flipfee.online.
- [x] [P0] Contact email hello@flipfee.online on contact/footer/privacy/terms.
- [x] [P0] No fake contact form.
- [ ] [P1] Error handling & recovery; no silent data loss.
- [ ] [P1] Offline/network error handling; don't promise offline until tested.