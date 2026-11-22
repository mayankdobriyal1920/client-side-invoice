# Invoice Studio — Production-Ready Product & Implementation Specification

**Product:** SimpleInvoice Studio (working name)  
**Target market:** United States  
**Primary audience:** Freelancers, independent contractors, cleaners, handymen, tutors, consultants, and small service businesses  
**Architecture:** Static/client-side web application; no custom backend or database  
**Hosting:** Vercel  
**Monetization:** Free tier with Google AdSense + one-time Pro purchase through Gumroad  
**Initial Pro price hypothesis:** USD $29 lifetime  
**Document purpose:** Build specification, acceptance criteria, launch checklist, and operational guidance

---

## 0. Non-negotiable implementation rules

1. Inspect the existing repository before changing anything. Reuse its framework, conventions, components, and deployment setup.
2. Build the actual product. Do not stop after generating a plan, mockup, or audit report.
3. Do not introduce a custom backend, database, authentication server, or server-side invoice storage in this phase.
4. Keep invoice and client data in the user's browser. Never transmit invoice contents, client names, addresses, email addresses, line items, or financial amounts to analytics, advertising systems, or the payment provider.
5. Never claim that local browser storage is a backup, encrypted vault, or cross-device sync.
6. Do not invent tax rates, legal requirements, marketplace/payment integrations, payment status, or successful payment verification.
7. Keep the free workflow useful. Do not deliberately cripple PDF export to force a purchase.
8. Do not place advertisements near controls where accidental clicks are likely.
9. Do not include ads in generated PDFs, print layouts, checkout screens, license activation screens, or error dialogs.
10. All payment entitlements must be clearly described as best-effort client-side licensing. A fully static app cannot securely prevent a technically capable user from bypassing frontend restrictions.
11. Do not store card details. Checkout must be hosted by the payment provider.
12. Every feature marked complete must have been implemented and tested. Report anything not completed honestly.

---

# 1. Product positioning

## 1.1 Product promise

A fast, clean, no-account invoice, estimate, and receipt maker for US freelancers and small service businesses.

Core message:

> Create professional invoices, estimates, and receipts in your browser. No account required. Export a clean PDF in seconds.

Differentiators:
- No account required for the basic workflow.
- No watermark on standard PDF exports.
- Browser-local data storage.
- Fast invoice, estimate, and receipt creation.
- Practical templates for common service businesses.
- No server upload of invoice documents.
- Simple one-time Pro upgrade rather than a mandatory subscription.

Avoid unsubstantiated claims such as “100% secure,” “tax compliant in all states,” “IRS approved,” or “legally guaranteed.”

## 1.2 Primary user jobs

1. Create an invoice and download a PDF.
2. Create an estimate/quote and send it to a customer.
3. Record a payment and issue a receipt.
4. Reuse customer and business details without retyping.
5. Track invoice numbers and statuses locally.
6. Customize the document with a logo and brand colors.
7. Print a professional document or email it to a customer.

## 1.3 Initial scope

Build these document types:
- Invoice
- Estimate / Quote
- Receipt

Build these supporting features:
- Business profile
- Client directory
- Item/service library
- Document list and local history
- PDF download and print
- Duplicate document
- Convert accepted estimate to invoice
- Record full or partial payment
- Basic payment instructions
- Local export/import backup
- Pro license activation

Do not build in phase one:
- Online payment collection from the invoice itself
- Bank feeds
- Automatic bookkeeping
- Tax filing
- E-signature
- Recurring invoice automation
- Multi-user collaboration
- Cloud sync
- Automated payment reminders
- Native mobile apps
- AI-generated accounting or tax advice

---

# 2. Suggested technical architecture

Adapt to the existing project. If the repository is empty, use a stable, maintained React/Next.js or equivalent static-friendly stack.

## 2.1 Frontend

- TypeScript with strict mode.
- React / Next.js static-friendly routes, or the repository's existing framework.
- Responsive CSS and accessible components.
- Client-side state management appropriate to project size.
- IndexedDB for document and client records.
- `localStorage` only for small preferences and non-sensitive feature flags.
- A maintained PDF-generation approach.
- A maintained ZIP library only if needed for backup/export.
- No custom API routes required for core app functionality.

Do not add dependencies without a clear reason. Pin compatible versions and commit the lockfile.

## 2.2 Data flow

All invoice editing and calculations happen locally:

`User input → validation → calculation engine → preview → PDF export`

Persist locally:

`Validated document → IndexedDB`

Payment:

`Upgrade button → Gumroad hosted checkout → license key supplied by buyer → provider license verification → local Pro entitlement`

Analytics:

`Page-level events only → analytics`

Never send document or client field values to analytics.

## 2.3 Suggested source structure

Adapt names to the existing repository.

```text
src/
  app/
    page
    invoice
    estimates
    receipts
    documents
    clients
    settings
    pricing
    privacy-policy
    terms
    about
    contact
    tools/
      invoice-generator
      estimate-generator
      receipt-maker
      invoice-number-generator
      hourly-invoice-calculator
    guides/
      contractor-invoice
      handyman-invoice
      cleaning-invoice
      landscaping-invoice
      plumbing-invoice
      electrical-invoice
      freelance-designer-invoice
      consulting-invoice
      tutoring-invoice
  components/
    editor/
    preview/
    document/
    layout/
    ads/
    pro/
    forms/
  lib/
    calculations/
    validation/
    storage/
    pdf/
    licensing/
    analytics/
    formatting/
  types/
  tests/
```

Do not create thin duplicate SEO pages with only the business name changed. Each guide must provide genuinely relevant instructions and examples.

---

# 3. Application navigation and routes

Required routes (preserve existing URL conventions if already deployed):

- `/` — homepage
- `/invoice-generator` — invoice creation
- `/estimate-maker` — estimate creation
- `/receipt-maker` — receipt creation
- `/documents` — locally saved documents
- `/clients` — locally saved clients
- `/settings` — business profile, preferences, backup
- `/pricing` — free vs Pro
- `/activate` — Pro license activation
- `/how-it-works` — privacy and calculation explanation
- `/privacy-policy`
- `/terms`
- `/about`
- `/contact`

Useful SEO landing pages:
- `/invoice-generator/contractor`
- `/invoice-generator/handyman`
- `/invoice-generator/cleaning-service`
- `/invoice-generator/landscaping`
- `/invoice-generator/plumber`
- `/invoice-generator/electrician`
- `/invoice-generator/freelancer`
- `/invoice-generator/consultant`
- `/invoice-generator/tutor`

Utility pages:
- `/estimate-template`
- `/receipt-template`
- `/invoice-number-generator`
- `/hourly-invoice-calculator`

Every route must:
- Load directly.
- Survive browser refresh.
- Have a unique title and meta description.
- Have one clear H1.
- Use a canonical URL.
- Work on mobile.
- Have meaningful internal links.
- Return the correct HTTP status.
- Avoid accidental `noindex` on public content pages.

---

# 4. Invoice editor — full requirements

## 4.1 Layout

Desktop:
- Left side: editable form sections.
- Right side: live document preview.
- Clear Save, Download PDF, Print, Duplicate, and Upgrade actions.
- Preview must not be clipped by the viewport.

Mobile:
- Single-column editor.
- Preview accessible through a clear Preview tab/button or a well-designed section below the form.
- Sticky action bar must not cover inputs or consent controls.
- No horizontal scrolling.
- Touch targets at least approximately 44 CSS pixels where practical.

## 4.2 Business information

Fields:
- Business / trading name (required for a complete document, but allow draft without it)
- Contact person (optional)
- Business email (optional)
- Phone (optional)
- Address lines (optional)
- City
- State
- ZIP code
- Country (default United States)
- Logo upload (PNG, JPEG, WebP; SVG only if safely sanitized and supported)
- Website (optional)
- Tax ID / EIN display field (optional, user-controlled)

Never require an EIN or SSN. Clearly warn users not to enter sensitive personal identifiers unless they have a specific need to display them.

Logo:
- Validate file type and size.
- Set a reasonable limit, e.g. 2 MB.
- Process locally.
- Preserve aspect ratio.
- Offer remove/replace.
- Do not upload it.

## 4.3 Client information

Fields:
- Client / company name
- Contact name
- Email
- Phone
- Billing address
- City, state, ZIP
- Optional notes

Client directory:
- Add, edit, search, select, delete.
- Selecting a client fills the document.
- Warn before deleting a client referenced by saved documents.
- Do not send client details to analytics.

## 4.4 Document metadata

Fields:
- Document number
- Issue date
- Due date (invoice)
- Valid-until date (estimate)
- Purchase/order/reference number (optional)
- Currency (USD default; multi-currency may be Pro only if actually implemented)
- Status (draft, sent, partially paid, paid, overdue, accepted, declined, converted)
- Document title/label

Numbering:
- Default sequential local numbering, e.g. `INV-0001`, `EST-0001`, `REC-0001`.
- Allow user to edit prefix and next number.
- Avoid duplicate numbers within the local dataset.
- Explain that local numbering is per browser/device and does not synchronize.
- Do not promise globally unique invoice numbers.

Date handling:
- Use local calendar dates without accidental UTC day shifts.
- Validate due date is not earlier than issue date unless user explicitly overrides.
- Show dates in a user-selected format.

## 4.5 Line items

Each line item:
- Description
- Quantity
- Unit (optional: hour, item, day, project)
- Unit price
- Optional discount per line (percentage or fixed amount)
- Line subtotal

Actions:
- Add row
- Remove row
- Reorder row if practical
- Duplicate row
- Select saved service/item
- Add optional description/notes

Validation:
- Quantity must be positive.
- Unit price cannot be negative.
- Discounts cannot exceed the applicable line amount.
- Prevent NaN and Infinity.
- Provide clear inline errors.
- Support decimal quantities such as 1.5 hours.

## 4.6 Totals and adjustments

Support:
- Subtotal
- Document-level discount (fixed or percentage)
- Shipping / expense / additional charge (optional, user-defined)
- Tax (user-entered rate or amount)
- Deposit / amount previously paid
- Amount paid
- Balance due
- Grand total

Tax:
- Do not automatically claim to calculate legally correct sales tax.
- Tax is user-configured.
- Allow a user-entered percentage and optionally a manually entered tax amount.
- Clearly label tax as user-provided.
- Do not fetch or infer a state/local rate.
- Do not present the tool as tax advice or a substitute for professional advice.
- Support tax-exempt display only as a user-controlled option, not as a legal determination.
- Allow line-level taxable toggles only if implemented consistently.
- Avoid applying tax twice.

Money calculations:
- Use integer minor units for currency where possible.
- For decimal quantities, use a reliable decimal arithmetic strategy.
- Define and test rounding at line and document level.
- Avoid binary floating-point arithmetic for money.
- Document the rounding policy.
- Ensure preview, saved data, totals, and PDF all use the same calculation result.

---

# 5. Estimate / quote functionality

Estimate uses most invoice fields, plus:
- Estimate number
- Valid-until date
- Scope of work
- Assumptions
- Exclusions
- Optional terms
- Customer acceptance name/date/signature line (visual acceptance area only; do not claim legally binding e-signature)

Actions:
- Download estimate PDF
- Print estimate
- Duplicate estimate
- Mark accepted / declined locally
- Convert accepted estimate to invoice

Conversion requirements:
- Create a new invoice with a new invoice number.
- Preserve line items and customer/business details.
- Preserve the estimate record.
- Store a reference from the new invoice to the estimate.
- Do not silently overwrite the estimate.
- Let user review the new invoice before saving/exporting.

---

# 6. Receipt functionality

Receipt fields:
- Receipt number
- Payment date
- Seller/business
- Customer
- Related invoice number (optional)
- Payment method label (cash, check, card, bank transfer, other)
- Amount received
- Reference / transaction ID (optional, entered by user)
- Notes

Important:
- Do not claim to process or verify a payment.
- Receipt confirms only that the user recorded a payment.
- Label it as a receipt generated from user-entered information.
- Allow full and partial payment receipts.
- If linked to an invoice, update the locally recorded paid amount and balance only after user confirmation.

---

# 7. Document management

`/documents` must provide:
- Search by document number, client name, or title locally.
- Filter by type and status.
- Sort by date, number, client, total.
- Open and edit.
- Duplicate.
- Download PDF again.
- Print.
- Delete with confirmation.
- Convert accepted estimate to invoice.
- Record payment for invoice.
- Export document data.

Do not display an overdue status unless the due date is in the past and the locally recorded balance is greater than zero. Explain that status is based on the user's local records, not a payment processor.

---

# 8. Local storage and backup

Use IndexedDB for persistent business records.

Persist:
- Business profile
- Clients
- Saved catalog items
- Invoices
- Estimates
- Receipts
- Numbering preferences
- User preferences
- Local license activation state (not as sole proof of entitlement)

Requirements:
- Version the local data schema.
- Implement safe migrations.
- Handle storage quota failures gracefully.
- Show a clear message if storage is unavailable.
- Never silently discard user data.
- Warn users that clearing browser data, private browsing, device loss, or browser profile loss may remove records.
- Provide JSON backup export and restore.
- Validate imported JSON schema and version before applying.
- Preview import counts and ask for confirmation.
- Avoid executing imported content as HTML or script.
- Offer merge vs replace only if both are correctly implemented; otherwise support safe replace with an explicit warning.
- Do not call local storage “cloud backup.”

Add a visible notice:
> Your documents are saved in this browser on this device. Export a backup regularly. They do not automatically sync to other devices.

---

# 9. PDF and print generation

## 9.1 PDF output

PDF must:
- Be a real downloadable PDF.
- Use a professional, readable layout.
- Support multiple pages.
- Repeat table headers on subsequent pages if the library supports it.
- Avoid splitting a line item awkwardly where possible.
- Show document number and page number.
- Include business and client details.
- Include subtotal, discount, tax, total, amount paid, and balance as applicable.
- Preserve decimal and currency formatting.
- Embed or safely render uploaded logo.
- Use selectable text where practical.
- Work without uploading document data to a server.

File names:
- `Invoice-INV-0001.pdf`
- `Estimate-EST-0001.pdf`
- `Receipt-REC-0001.pdf`

Sanitize file names.

## 9.2 Print

- Provide a print stylesheet.
- Hide editor controls and website navigation in print.
- Hide ads.
- Print only the document.
- Avoid clipped margins.
- Test Chrome, Safari, and Firefox print-to-PDF where available.

## 9.3 PDF quality acceptance tests

Test:
- Empty optional fields.
- Long company/client names.
- Long descriptions.
- 1, 10, 25, and 50 line items.
- Multiple pages.
- Logo absent and present.
- Large totals.
- Discounts and taxes.
- Partial payment.
- Negative/invalid input rejection.
- Mobile-triggered download where supported.

---

# 10. Pro pricing and feature gating

## 10.1 Pricing hypothesis

Start with:
- Free: $0
- Pro Lifetime: $29 one-time

Do not introduce monthly billing in the first release unless user research supports recurring value.

## 10.2 Free tier

Keep the core product genuinely useful:
- Create invoices, estimates, and receipts.
- Standard professional templates.
- Standard PDF export without watermark.
- Local storage for documents.
- Basic business profile.
- Basic client directory.
- Manual tax and discount fields.
- Print.

## 10.3 Pro tier

Only advertise features that are implemented. Candidate Pro features:
- Premium document templates.
- Additional brand color and layout controls.
- Multiple business profiles.
- Advanced document themes.
- CSV export.
- Batch PDF export if implemented and tested.
- Additional logo/branding options.
- No display ads.

Do not gate basic PDF export, basic document creation, or a user's ability to retrieve their own saved records.

## 10.4 Pricing page

Clearly state:
- One-time payment, not subscription (if configured as one-time).
- What is included.
- Whether future updates are included and for how long.
- Refund policy according to the seller/payment platform terms.
- License/device limitations.
- No account required for basic use.
- Local data does not automatically sync.
- Pro activation may require internet access.

Do not claim “lifetime” means lifetime of the buyer or business. Define it as access to the current product and updates under the published terms, subject to the stated product/license terms.

---

# 11. Gumroad checkout and license activation

Use Gumroad hosted checkout for this phase. Confirm current creator onboarding, payout eligibility, fees, taxes, and license features for an India-based creator before launch. Do not assume a particular payout method or availability.

Official resources to inspect before implementation:
- Gumroad: https://gumroad.com/
- Gumroad help center: https://help.gumroad.com/
- Gumroad license key documentation: https://gumroad.com/help

Do not copy an endpoint or request schema from memory. Read the current official documentation and implement its current requirements.

## 11.1 Checkout

- Create a one-time Pro product in Gumroad.
- Configure the product price in USD.
- Enable license keys if available for the product.
- Use Gumroad's hosted checkout URL.
- Open checkout through a normal user-initiated link/button.
- Never collect card details on this website.
- Do not claim payment succeeded merely because the user returned to the site.
- Do not unlock Pro based only on a query-string parameter or a success URL.

## 11.2 License activation

Activation page:
- License key field.
- Activate button.
- Loading state.
- Success and clear failure states.
- Link to purchase/receipt help.
- Privacy explanation.

Verification:
- Use the current official Gumroad license verification mechanism.
- Verify product identity where supported.
- Handle invalid key, revoked key, exhausted activation limit, network error, rate limit, and provider outage.
- Never log full license keys.
- Never send license keys to analytics.
- Do not place provider secrets in frontend code.
- If the provider requires a secret for a required operation, do not expose it. Reassess whether the desired flow can be done securely without a backend.
- Do not assume local activation state is tamper-proof.
- Provide a restore/re-verify action.
- Make reasonable revalidation behavior explicit.
- Avoid locking out a valid paying user during a temporary provider outage; retain a previously verified local entitlement for a clearly disclosed grace period, if compatible with provider terms.
- Do not support unlimited activations if provider terms or product settings do not permit it.

## 11.3 Honest security model

Because the app is static:
- Frontend Pro gates are convenience controls, not strong DRM.
- A user with developer tools may bypass local UI restrictions.
- Do not claim the license system is impossible to bypass.
- A backend would be required for stronger server-enforced entitlements, but is out of scope.

---

# 12. Google AdSense integration

AdSense is supplemental revenue, not a guaranteed income source. Apply only after the site has useful original content, working tools, clear navigation, and accurate legal/privacy disclosures.

Official policies and guidance:
- Program policies: https://support.google.com/adsense/answer/48182
- Ad placement policies: https://support.google.com/adsense/answer/1346295
- Ad implementation guidance: https://support.google.com/adsense/

Check current policies at implementation time.

## 12.1 Ad placement

Possible placements:
- Homepage: below the main value proposition or below useful explanatory content.
- Industry guide pages: within content, away from interactive controls.
- Template/resource pages: between meaningful content sections.
- Editor: preferably no ad inside the active editing area. If testing an ad below the editor, keep it clearly separated from Download, Print, Save, and Preview controls.
- Documents, activation, checkout, pricing purchase flow: no ads.
- Generated PDF and print output: never include ads.

Never:
- Place ads adjacent to buttons or controls in a way that could cause accidental clicks.
- Label ads as navigation or download buttons.
- Ask users to click ads.
- Use deceptive placements.
- Put ads in empty/low-value pages.
- Insert ads into PDFs.
- Make ads block or obscure the editor.
- Use ads to disguise content.

## 12.2 Pro users

If Pro is advertised as ad-free, implement that behavior consistently. Do not claim ad-free if ads can still appear due to third-party scripts or another placement.

## 12.3 Consent and privacy

Determine which consent and privacy requirements apply to the actual audience, advertising configuration, and jurisdictions. Do not assume one banner satisfies every legal requirement.

- Use Google's current consent tooling/guidance where required.
- Disclose advertising and relevant third-party technologies accurately.
- Do not send invoice/client fields to ad systems.
- Do not inject user document contents into page titles, URLs, or ad targeting.
- Test ad behavior on public pages and ensure ads do not break the editor.
- Do not show fake ads during development and represent them as live revenue.

## 12.4 AdSense launch checklist

- Original useful content exists.
- All core tools work.
- Navigation works.
- Privacy policy accurately describes ads and tracking.
- Terms and contact pages exist.
- No placeholder content.
- No copied/thin doorway pages.
- No deceptive ad placement.
- No policy violations.
- Site ownership and AdSense account setup are completed by the owner.
- Do not claim approval is guaranteed.

---

# 13. SEO strategy

SEO is a long-term acquisition channel, not a day-one revenue guarantee.

## 13.1 Core pages

Create strong pages for:
- Free invoice generator
- Free estimate maker
- Receipt maker
- Contractor invoice generator
- Handyman invoice template
- Cleaning service invoice template
- Landscaping invoice template
- Plumber invoice template
- Electrician invoice template
- Freelance designer invoice template
- Consultant invoice template
- Tutor invoice template

Do not publish a page unless it offers genuinely relevant examples, instructions, fields, and a working tool experience.

## 13.2 On-page SEO

Each page:
- Unique title and meta description.
- One clear H1.
- Useful headings.
- Original explanatory copy.
- A working relevant tool or template.
- Helpful FAQs based on real user questions.
- Contextual internal links.
- Canonical URL.
- Open Graph metadata.
- Descriptive image alt text.
- No keyword stuffing.
- No fake ratings or testimonials.
- No fabricated search volume or customer counts.

## 13.3 Technical SEO

- Generate XML sitemap.
- Configure robots.txt correctly.
- Canonicalize trailing slash and host variants consistently.
- HTTPS everywhere.
- Redirect noncanonical host to canonical host.
- Add favicon and social preview image.
- Avoid indexing app states, activation URLs with license keys, query-string variants, or private local-document views.
- Do not expose client data in URLs.
- Validate structured data only where content qualifies.
- Do not add fake review/rating schema.
- Use Search Console after launch.
- Monitor indexing, queries, page experience, and errors.

## 13.4 Content quality

Each industry page should include:
- Who the template is for.
- What fields are commonly included.
- A relevant example with clearly fictional data.
- Tips for describing work and materials.
- Payment terms explanation without legal guarantees.
- Link to the actual generator.
- Relevant FAQ.
- Clear limitation that tax and legal requirements vary and the user is responsible for their entries.

Do not create dozens of near-identical pages by swapping “handyman” for “plumber.”

---

# 14. Privacy, security, and legal content

This is a product specification, not legal advice. Have the owner review policies for their business and jurisdictions.

## 14.1 Privacy requirements

Explain accurately:
- What data is stored locally.
- What is sent to Gumroad during purchase/license verification.
- What page-level analytics collect.
- What AdSense/advertising technologies may collect.
- How users can delete local records.
- That clearing browser data may remove records.
- That local records do not sync automatically.
- How users can contact the operator.

Do not say “we collect no data” if analytics, ads, payment, or license verification involve data.

## 14.2 Security

- Sanitize user-entered text before rendering HTML.
- Avoid unsafe `dangerouslySetInnerHTML` or equivalent.
- Validate imported backup files.
- Validate uploaded images.
- Do not accept arbitrary HTML as document template content.
- Avoid storing secrets in frontend code.
- Do not include API secret keys in environment variables exposed to the browser.
- Use HTTPS.
- Apply a sensible Content Security Policy compatible with required scripts.
- Keep dependencies updated.
- Do not log client or invoice contents.
- Ensure errors do not expose local document data.

## 14.3 Contact

Use the official contact email:

**hello@flipfee.online**

Provide a working `mailto:hello@flipfee.online` link on:
- Contact page
- Footer
- Privacy policy
- Terms, where appropriate
- Correction/feedback instructions

Do not create a fake contact form.

## 14.4 Terms and disclaimers

Explain:
- Tool provides document-generation functionality, not accounting, tax, or legal advice.
- User is responsible for accuracy of information, tax rates, and document compliance.
- PDFs are generated from user-entered data.
- Local storage may be lost.
- No automatic cloud backup or sync.
- Payment and licensing are handled by the stated provider.
- Product limitations and support contact.
- Refund terms consistent with actual checkout and applicable law.

Do not invent a refund policy inconsistent with Gumroad configuration or applicable requirements.

---

# 15. Accessibility and usability

- Semantic HTML.
- Keyboard-accessible forms and menus.
- Visible focus states.
- Explicit labels for inputs.
- Helpful error text.
- Screen-reader announcements for totals and validation where appropriate.
- Do not rely on color alone for errors/status.
- Sufficient contrast.
- Respect reduced motion.
- Correct tab order.
- Accessible dialogs and confirmation prompts.
- Touch-friendly controls.
- Avoid tiny text in PDF output.

---

# 16. Performance and reliability

- Lazy-load noncritical content.
- Avoid shipping heavy editor/PDF libraries on every informational page if code splitting is possible.
- Optimize logos and screenshots.
- Avoid layout shifts from ads; reserve ad slots when ads are enabled.
- Do not load ads in the core editor if not necessary.
- Handle offline/network errors gracefully.
- Keep the app usable for core document creation when offline after assets have loaded, where the framework allows.
- Do not promise offline support until tested.
- Use error boundaries and clear recovery messages.
- Do not silently lose unsaved edits.
- Add unsaved-changes warning when appropriate.

---

# 17. Analytics

Track only non-sensitive, aggregate product events, for example:
- `page_view`
- `document_type_selected` (invoice / estimate / receipt only)
- `pdf_export_completed`
- `pro_pricing_viewed`
- `checkout_clicked`
- `license_activation_success` (boolean only)
- `license_activation_failure` (generic category only)

Never track:
- Client names
- Client email addresses
- Business names
- Addresses
- Phone numbers
- Invoice numbers
- Line-item descriptions
- Tax IDs
- Financial amounts
- Full document contents
- License keys
- Uploaded logo files

Ensure analytics tools do not automatically capture form field values or session-replay sensitive content. Disable or mask form capture for the editor.

---

# 18. Testing strategy

## 18.1 Unit tests

Test:
- Line subtotal.
- Quantity decimals.
- Percentage discount.
- Fixed discount.
- Document discount.
- Tax percentage.
- Manually entered tax.
- Partial payment.
- Balance due.
- Rounding.
- Invoice numbering.
- Due-date status.
- Estimate-to-invoice conversion.
- Receipt totals.
- Currency formatting.
- Imported backup validation.

Use deterministic fixtures and explicit expected values.

## 18.2 Integration tests

Test:
- Create invoice → preview → save → reopen → export PDF.
- Create client → select client → populate invoice.
- Create estimate → mark accepted → convert to invoice.
- Create invoice → record partial payment → generate receipt.
- Export backup → clear app data → import backup → verify restored records.
- Activate a valid Pro license using the real documented test/production process available from the provider.
- Handle invalid license.
- Handle network unavailable during verification.
- Confirm Pro state does not unlock from a forged URL parameter.

## 18.3 Browser tests

Test latest stable:
- Chrome desktop
- Safari desktop where available
- Firefox desktop
- Mobile Safari
- Mobile Chrome

Check:
- PDF download.
- Print.
- Logo upload.
- IndexedDB persistence.
- Browser refresh.
- Mobile keyboard behavior.
- No horizontal overflow.
- Ad placement.
- Checkout redirect.
- License activation.

## 18.4 Security/privacy tests

- Inspect network requests while entering client and invoice data.
- Confirm document data is not sent to analytics.
- Confirm no invoice data is sent to ad providers.
- Confirm uploaded logos are not uploaded.
- Confirm license key is not logged or tracked.
- Test malicious strings in names/descriptions.
- Test malformed backup JSON.
- Test oversized image upload.
- Inspect production bundle for exposed secrets.

## 18.5 Build checks

Run:
- Lint
- Type check
- Unit tests
- Integration/E2E tests
- Production build

Do not claim any command passed unless it was run and its result inspected.

---

# 19. Deployment and release

Deploy to Vercel using the existing project configuration.

Before deployment:
- Confirm production environment variables contain no secrets exposed to the client.
- Set canonical domain.
- Confirm HTTPS.
- Verify all routes.
- Verify 404 page.
- Verify sitemap and robots.
- Verify metadata.
- Verify contact email.
- Verify Gumroad checkout URL.
- Verify license activation.
- Verify privacy/terms reflect real behavior.
- Verify AdSense script only after account approval and correct configuration.
- Verify ads are absent from PDFs and sensitive workflows.

After deployment:
- Open every important route directly.
- Refresh every route.
- Test one invoice end-to-end.
- Test one estimate conversion.
- Test one receipt.
- Test backup/restore.
- Test a real low-value purchase or provider-approved test workflow before announcing paid launch.
- Check Vercel deployment logs and browser console.
- Monitor Search Console and analytics.

---

# 20. Recommended implementation phases

## Phase A — Core free product
- Homepage and navigation
- Invoice editor
- Estimate editor
- Receipt maker
- Live preview
- PDF and print
- Local storage
- Client and business profiles
- Document history
- Backup/restore
- Responsive and accessible UI

Acceptance: A user can create, save, reopen, print, and download all three document types without creating an account or paying.

## Phase B — Pro and payments
- Pricing page
- Gumroad product setup
- Hosted checkout
- License activation
- License revalidation
- Pro feature gating
- Ad-free Pro experience
- Payment/support documentation

Acceptance: A real purchase can be completed, the customer can activate the license, and invalid/network-failure cases are handled honestly.

## Phase C — SEO and content
- Core SEO pages
- Industry-specific pages with original content
- Internal linking
- Sitemap and robots
- Metadata and canonical URLs
- Search Console setup

Acceptance: All pages are useful, crawlable, non-duplicative, and technically valid.

## Phase D — AdSense
- Review current AdSense policies
- Complete site content and legal disclosures
- Apply for AdSense
- Implement approved ad code
- Test safe placements
- Confirm no ads in editor controls, checkout, activation, or PDFs
- Ensure Pro users receive the promised ad-free experience

Acceptance: Ads only appear where intended and do not interfere with the core product or violate policy.

## Phase E — Production hardening
- Full automated tests
- Browser compatibility
- Privacy/network inspection
- Accessibility checks
- Performance checks
- Deployment verification
- Backup/restore verification
- Final issue report

Acceptance: No critical or high-severity issues remain open. Any known limitations are documented.

---

# 21. Final acceptance checklist

The product is not ready to call production-ready until each applicable item is verified.

### Core product
- [ ] Invoice creation works.
- [ ] Estimate creation works.
- [ ] Receipt creation works.
- [ ] Live preview matches saved document.
- [ ] PDF export works.
- [ ] Print works.
- [ ] Multi-page PDF works.
- [ ] Client directory works.
- [ ] Business profile works.
- [ ] Document history works.
- [ ] Duplicate works.
- [ ] Estimate-to-invoice conversion works.
- [ ] Partial payment and receipt flow works.
- [ ] Numbering avoids local duplicates.
- [ ] Backup export works.
- [ ] Backup restore works.
- [ ] Storage limitations are disclosed.

### Money and document accuracy
- [ ] Money calculations use reliable decimal/cents logic.
- [ ] Rounding tests pass.
- [ ] Tax is user-configured.
- [ ] No unsupported automatic tax claims.
- [ ] Discounts work.
- [ ] Deposits and balances reconcile.
- [ ] PDF totals match editor totals.

### Payments and Pro
- [ ] Gumroad product configured.
- [ ] Hosted checkout works.
- [ ] License key activation works.
- [ ] Invalid license handled.
- [ ] Network error handled.
- [ ] No secrets exposed in frontend.
- [ ] No false unlock based on return URL.
- [ ] Pro limitations are disclosed.
- [ ] Pro ad-free behavior works if promised.

### AdSense
- [ ] Policies reviewed.
- [ ] Site content is useful and original.
- [ ] Legal disclosures match actual behavior.
- [ ] Ads do not sit beside action buttons.
- [ ] Ads do not appear in PDFs.
- [ ] Ads do not appear in checkout/activation.
- [ ] No accidental-click design.
- [ ] No guarantee of approval is stated.

### SEO and legal
- [ ] Unique titles and descriptions.
- [ ] Canonical URLs.
- [ ] Sitemap.
- [ ] Robots.txt.
- [ ] Useful industry pages.
- [ ] No thin duplicate pages.
- [ ] Privacy policy accurate.
- [ ] Terms accurate.
- [ ] Contact page works.
- [ ] `hello@flipfee.online` is correct.

### Production
- [ ] Type check passes.
- [ ] Lint passes.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Production build passes.
- [ ] Browser tests completed.
- [ ] No critical console errors.
- [ ] Network/privacy checks completed.
- [ ] All production routes tested.
- [ ] Vercel deployment verified.

---

# 22. Required final implementation report

At completion, provide:

1. Summary of features implemented.
2. Exact routes added or changed.
3. Dependencies added and why.
4. Local data schema and migration approach.
5. PDF library and multi-page behavior.
6. Gumroad configuration steps still requiring owner action.
7. License verification flow and its limitations.
8. AdSense setup steps still requiring owner action.
9. Privacy/network test results.
10. Automated test commands and actual results.
11. Production build result.
12. Remaining bugs and limitations.
13. Deployment instructions.
14. A clear `READY`, `NOT READY`, or `READY WITH LIMITATIONS` verdict.

Do not mark the project ready if a critical workflow is untested.

---

## Final instruction to the coding agent

First inspect the repository and report its current framework and existing functionality briefly. Then implement the phases in dependency order, preserving existing working behavior and visual identity. Do not stop after planning. Run the available tests and production build. Where a task requires account-owner action (Gumroad onboarding, product creation, AdSense approval, Search Console verification, or domain settings), implement the code-side integration and provide exact remaining owner steps. Never fabricate credentials, successful payments, policy verification, test results, or approval status.
