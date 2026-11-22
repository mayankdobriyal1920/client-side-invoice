import type { GuideContent } from "@/components/content/GuidePage";

export const guides: Record<string, GuideContent> = {
  contractor: {
    title: "Contractor Invoice Template",
    intro: "A contractor invoice should clearly separate labor, materials, and any subcontractor costs so the customer can see what they are paying for.",
    who: "General contractors, remodelers, and construction service providers.",
    fields: ["Business and client details", "Invoice number and dates", "Line items for labor (hours × rate)", "Materials with quantities and unit costs", "Subcontractor charges", "Permits/fees", "Tax (user-entered)", "Payment terms and due date"],
    tips: ["Break labor and materials into separate line items.", "Include a brief scope description in notes.", "State payment terms (e.g., Net 15) clearly.", "Attach or reference the original estimate number."],
    example: "Acme Contracting\nInvoice INV-0042 · Issued 10/01/2026 · Due 10/16/2026\nClient: Maple Street Renovation LLC\n\nLabor – framing (12 hrs @ $85)        $1,020.00\nMaterials – lumber & hardware        $640.00\nPermit fee                          $125.00\nSubtotal                            $1,785.00\nTax (8%)                            $142.80\nTotal                               $1,927.80",
    faq: [
      { q: "Should I include a deposit?", a: "Yes, record any deposit received in the 'Amount paid' field; the balance due updates automatically." },
      { q: "How do I handle change orders?", a: "Add them as additional line items and reference the change order number in the description." },
    ],
  },
  handyman: {
    title: "Handyman Invoice Template",
    intro: "Handyman invoices work best with clear, itemized small jobs and a single total that's easy for the homeowner to approve.",
    who: "Handymen and small repair/maintenance service providers.",
    fields: ["Business and client details", "Date of service", "Job description", "Labor hours and rate", "Parts/materials", "Minimum service charge (if any)", "Tax (user-entered)", "Payment method"],
    tips: ["Group small tasks under one line item with a combined price when appropriate.", "Note any warranty on parts or labor.", "Include a service call fee if applicable."],
    example: "QuickFix Handyman\nInvoice INV-0018 · Issued 10/05/2026\nClient: Jane Doe\n\nService call fee                     $45.00\nRepair leaky faucet (1.5 hrs)       $127.50\nReplacement parts                   $18.00\nTotal                               $190.50",
    faq: [
      { q: "Do I need to charge tax?", a: "Tax rules vary by location and service type. Enter the rate that applies to you; this tool does not determine taxability." },
    ],
  },
  cleaning: {
    title: "Cleaning Service Invoice Template",
    intro: "Cleaning invoices should distinguish recurring service from one-time deep cleans and list any add-ons.",
    who: "Residential and commercial cleaning businesses.",
    fields: ["Business and client details", "Service date(s)", "Service type (standard/deep/move-out)", "Square footage or hours", "Add-ons (oven, windows, etc.)", "Discounts", "Tax (user-entered)", "Recurring schedule note"],
    tips: ["Use consistent line items so repeat clients recognize charges.", "Offer a recurring discount as a document-level discount.", "Include a note about supplies included/excluded."],
    example: "Sparkle Clean Co.\nInvoice INV-0031 · Issued 10/10/2026\nClient: Oakview Apartments\n\nStandard cleaning (3 hrs)           $150.00\nDeep clean add-on                    $75.00\nWindow cleaning (interior)           $60.00\nTotal                               $285.00",
    faq: [
      { q: "How do I invoice a recurring client?", a: "Duplicate a previous invoice, update the date and number, and adjust any changed items." },
    ],
  },
  landscaping: {
    title: "Landscaping Invoice Template",
    intro: "Landscaping invoices often mix one-time installs with recurring maintenance; keep them clearly separated.",
    who: "Landscapers, lawn care, and outdoor maintenance providers.",
    fields: ["Business and client details", "Service date(s)", "Maintenance visits", "Installations/plantings", "Materials (mulch, sod, plants)", "Equipment rental", "Tax (user-entered)", "Seasonal notes"],
    tips: ["List each visit date for recurring maintenance.", "Separate materials from labor for clarity.", "Note weather-related delays if relevant."],
    example: "GreenScape LLC\nInvoice INV-0055 · Issued 10/12/2026\nClient: Hillside HOA\n\nWeekly mowing (4 visits)            $200.00\nMulch installation (2 cu yd)        $180.00\nShrub trimming                      $90.00\nTotal                               $470.00",
    faq: [
      { q: "Can I bill per visit?", a: "Yes, add one line item per visit or a single line with quantity = number of visits." },
    ],
  },
  plumbing: {
    title: "Plumber Invoice Template",
    intro: "Plumbing invoices should document the problem, work performed, and parts used, with clear labor time.",
    who: "Plumbers and plumbing contractors.",
    fields: ["Business and client details", "Service date", "Problem description", "Labor hours and rate", "Parts and materials", "Emergency/after-hours fee", "Warranty note", "Tax (user-entered)"],
    tips: ["Include a short description of the issue and fix.", "List parts with model numbers when possible.", "State warranty terms in the terms field."],
    example: "PipeRight Plumbing\nInvoice INV-0027 · Issued 10/15/2026\nClient: 42 Oak Ave\n\nService call                        $75.00\nLabor (2 hrs @ $95)                $190.00\nParts – faucet cartridge            $32.00\nTotal                               $297.00",
    faq: [
      { q: "Should I charge for diagnosis?", a: "If you charge a diagnostic fee, add it as a line item and note it may be waived if repair is performed." },
    ],
  },
  electrical: {
    title: "Electrician Invoice Template",
    intro: "Electrical invoices should itemize labor, materials, and any permit or inspection fees.",
    who: "Electricians and electrical contractors.",
    fields: ["Business and client details", "Service date", "Work description", "Labor hours and rate", "Materials (wire, fixtures, panels)", "Permit/inspection fees", "Tax (user-entered)", "Safety/compliance note"],
    tips: ["Reference the job or work order number.", "Note code compliance or inspection results.", "List materials with quantities."],
    example: "BrightSpark Electric\nInvoice INV-0063 · Issued 10/18/2026\nClient: Riverdale Office\n\nInstall 4 outlets (labor)          $240.00\nMaterials – wire, boxes, outlets    $110.00\nPermit fee                          $60.00\nTotal                               $410.00",
    faq: [
      { q: "Can I bill flat-rate jobs?", a: "Yes, use a single line item with quantity 1 and a flat unit price." },
    ],
  },
  "freelance-designer": {
    title: "Freelance Designer Invoice Template",
    intro: "Designer invoices should describe deliverables, revisions, and any licensing or usage rights.",
    who: "Graphic, web, and brand designers.",
    fields: ["Business and client details", "Project name", "Deliverables", "Hourly or flat fees", "Revisions (included/excess)", "Licensing/usage rights", "Expenses (stock, fonts)", "Tax (user-entered)"],
    tips: ["Reference the proposal or contract number.", "Clarify revision rounds included.", "Bill expenses separately with receipts."],
    example: "Pixel & Co. Design\nInvoice INV-0012 · Issued 10/20/2026\nClient: Bloom Bakery\n\nBrand identity package             $1,200.00\nLogo variations (3)                $300.00\nStock photo licensing               $45.00\nTotal                               $1,545.00",
    faq: [
      { q: "How do I handle rush fees?", a: "Add a separate line item labeled 'Rush fee' with the amount." },
    ],
  },
  consulting: {
    title: "Consultant Invoice Template",
    intro: "Consulting invoices should tie charges to a defined scope, period, or milestone.",
    who: "Management, IT, marketing, and independent consultants.",
    fields: ["Business and client details", "Engagement/project name", "Billing period or milestone", "Hours and rate or fixed fee", "Expenses (travel, software)", "Tax (user-entered)", "Payment terms"],
    tips: ["State the billing period clearly (e.g., Oct 1–15).", "Attach a brief summary of work performed.", "Use milestones for fixed-fee projects."],
    example: "Strategy North Consulting\nInvoice INV-0009 · Issued 10/22/2026\nClient: Acme Corp\n\nConsulting (24 hrs @ $150)         $3,600.00\nTravel expenses                    $180.00\nTotal                               $3,780.00",
    faq: [
      { q: "Should I bill in advance?", a: "If you require a retainer, record it as 'Amount paid' and show the balance due." },
    ],
  },
  tutoring: {
    title: "Tutor Invoice Template",
    intro: "Tutoring invoices should list sessions with dates, subjects, and duration.",
    who: "Tutors and independent educators.",
    fields: ["Business and client details", "Student name", "Session dates and durations", "Subject/topic", "Hourly rate", "Materials", "Discounts (siblings, packages)", "Tax (user-entered)"],
    tips: ["List each session with date and length.", "Offer package discounts as a document-level discount.", "Note cancellation policy in terms."],
    example: "BrightMind Tutoring\nInvoice INV-0007 · Issued 10/25/2026\nClient: Parent of Sam Lee\n\nMath tutoring (4 × 1 hr)           $240.00\nStudy materials                    $25.00\nTotal                               $265.00",
    faq: [
      { q: "Can I bill a package upfront?", a: "Yes, create one line item for the package and record payments as they are received." },
    ],
  },
};