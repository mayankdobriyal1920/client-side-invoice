export type DocumentType = "invoice" | "estimate" | "receipt";
export type DocumentStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "accepted"
  | "declined"
  | "converted";

export type MoneyCents = number; // integer minor units

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  logoDataUrl?: string;
  website?: string;
  taxId?: string;
  isDefault?: boolean;
}

export interface Client {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  unitPriceCents: MoneyCents;
  taxable?: boolean;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number; // decimal
  unit?: string;
  unitPriceCents: MoneyCents;
  discountType?: "none" | "percent" | "fixed";
  discountValue?: number; // percent 0-100 or cents
  taxable?: boolean;
  notes?: string;
}

export interface DocumentTotals {
  subtotalCents: MoneyCents;
  lineDiscountCents: MoneyCents;
  documentDiscountCents: MoneyCents;
  shippingCents: MoneyCents;
  taxCents: MoneyCents;
  totalCents: MoneyCents;
  paidCents: MoneyCents;
  balanceCents: MoneyCents;
}

export interface BaseDocument {
  id: string;
  type: DocumentType;
  number: string;
  title?: string;
  issueDate: string; // ISO date (YYYY-MM-DD)
  dueDate?: string;
  status: DocumentStatus;
  businessId?: string;
  businessSnapshot?: BusinessProfile;
  clientSnapshot?: Client;
  clientId?: string;
  lineItems: LineItem[];
  currency: string; // "USD"
  // adjustments
  documentDiscountType?: "none" | "percent" | "fixed";
  documentDiscountValue?: number;
  shippingLabel?: string;
  shippingCents?: MoneyCents;
  taxRatePercent?: number; // user-entered
  taxMode?: "rate" | "manual";
  taxManualCents?: MoneyCents;
  taxExempt?: boolean;
  depositCents?: MoneyCents;
  amountPaidCents?: MoneyCents;
  notes?: string;
  terms?: string;
  // estimate
  validUntil?: string;
  scopeOfWork?: string;
  assumptions?: string;
  exclusions?: string;
  // receipt
  paymentDate?: string;
  paymentMethod?: "cash" | "check" | "card" | "bank_transfer" | "other";
  relatedInvoiceNumber?: string;
  transactionReference?: string;
  // meta
  convertedFromEstimateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NumberingPrefs {
  invoicePrefix: string;
  estimatePrefix: string;
  receiptPrefix: string;
  nextInvoice: number;
  nextEstimate: number;
  nextReceipt: number;
}

export interface UserPrefs {
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  currency: string;
}

export interface LicenseState {
  keyMasked?: string;
  verified: boolean;
  verifiedAt?: string;
  graceUntil?: string;
  pro: boolean;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  businessProfiles: BusinessProfile[];
  clients: Client[];
  catalogItems: CatalogItem[];
  documents: BaseDocument[];
  numberingPrefs: NumberingPrefs;
  userPrefs: UserPrefs;
  licenseState: LicenseState;
}