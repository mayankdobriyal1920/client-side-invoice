import { pgTable, uuid, text, timestamp, integer, varchar, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  paddleCustomerId: text("paddle_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  emailIdx: uniqueIndex("customers_email_idx").on(t.email),
}));

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  paddleTransactionId: text("paddle_transaction_id").notNull().unique(),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  paddlePriceId: text("paddle_price_id").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(),
  purchasedAt: timestamp("purchased_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  txIdx: uniqueIndex("transactions_paddle_tx_idx").on(t.paddleTransactionId),
  customerIdx: index("transactions_customer_idx").on(t.customerId),
}));

export const licenses = pgTable("licenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").notNull().references(() => customers.id),
  transactionId: uuid("transaction_id").notNull().references(() => transactions.id).unique(),
  licenseKeyHash: text("license_key_hash").unique(),
  plan: text("plan").notNull().default("lifetime_pro"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  customerIdx: index("licenses_customer_idx").on(t.customerId),
  statusIdx: index("licenses_status_idx").on(t.status),
  licenseKeyIdx: uniqueIndex("licenses_license_key_hash_idx").on(t.licenseKeyHash),
}));

export const activations = pgTable("activations", {
  id: uuid("id").defaultRandom().primaryKey(),
  licenseId: uuid("license_id").notNull().references(() => licenses.id),
  tokenHash: text("token_hash").notNull().unique(),
  deviceLabel: text("device_label"),
  deviceHash: text("device_hash"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  tokenIdx: uniqueIndex("activations_token_hash_idx").on(t.tokenHash),
  licenseIdx: index("activations_license_idx").on(t.licenseId),
  deviceHashIdx: index("activations_device_hash_idx").on(t.deviceHash),
}));

export const otpChallenges = pgTable("otp_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  otpHash: text("otp_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  attempts: integer("attempts").notNull().default(0),
  consumedAt: timestamp("consumed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  emailIdx: index("otp_email_idx").on(t.email),
}));

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  paddleEventId: text("paddle_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  eventIdx: uniqueIndex("webhook_events_paddle_event_idx").on(t.paddleEventId),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  transactions: many(transactions),
  licenses: many(licenses),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  customer: one(customers, { fields: [transactions.customerId], references: [customers.id] }),
  license: one(licenses, { fields: [transactions.id], references: [licenses.transactionId] }),
}));

export const licensesRelations = relations(licenses, ({ one, many }) => ({
  customer: one(customers, { fields: [licenses.customerId], references: [customers.id] }),
  transaction: one(transactions, { fields: [licenses.transactionId], references: [transactions.id] }),
  activations: many(activations),
}));