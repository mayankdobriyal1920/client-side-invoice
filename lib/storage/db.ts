import { openDB, type IDBPDatabase } from "idb";
import type {
  BusinessProfile,
  Client,
  CatalogItem,
  BaseDocument,
  NumberingPrefs,
  UserPrefs,
  LicenseState,
} from "@/types";

const DB_NAME = "invoice-studio";
const DB_VERSION = 1;

export interface InvoiceDB {
  businessProfiles: BusinessProfile;
  clients: Client;
  catalogItems: CatalogItem;
  documents: BaseDocument;
  numberingPrefs: NumberingPrefs;
  userPrefs: UserPrefs;
  licenseState: LicenseState;
}

let dbPromise: Promise<IDBPDatabase<InvoiceDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<InvoiceDB>> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is only available in the browser."));
  }
  if (!dbPromise) {
    dbPromise = openDB<InvoiceDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("businessProfiles")) db.createObjectStore("businessProfiles", { keyPath: "id" });
        if (!db.objectStoreNames.contains("clients")) db.createObjectStore("clients", { keyPath: "id" });
        if (!db.objectStoreNames.contains("catalogItems")) db.createObjectStore("catalogItems", { keyPath: "id" });
        if (!db.objectStoreNames.contains("documents")) db.createObjectStore("documents", { keyPath: "id" });
        // singletons stored under a fixed key via separate stores would be complex; store as records with id
        if (!db.objectStoreNames.contains("numberingPrefs")) db.createObjectStore("numberingPrefs", { keyPath: "id" });
        if (!db.objectStoreNames.contains("userPrefs")) db.createObjectStore("userPrefs", { keyPath: "id" });
        if (!db.objectStoreNames.contains("licenseState")) db.createObjectStore("licenseState", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

// Singleton helpers using id "singleton"
export async function getNumberingPrefs(): Promise<NumberingPrefs> {
  const db = await getDB();
  const rec = await db.get("numberingPrefs", "singleton" as any);
  if (rec) return rec as any;
  const defaults: NumberingPrefs & { id: string } = {
    id: "singleton",
    invoicePrefix: "INV",
    estimatePrefix: "EST",
    receiptPrefix: "REC",
    nextInvoice: 1,
    nextEstimate: 1,
    nextReceipt: 1,
  };
  await db.put("numberingPrefs", defaults as any);
  const { id, ...rest } = defaults;
  return rest;
}

export async function setNumberingPrefs(prefs: NumberingPrefs): Promise<void> {
  const db = await getDB();
  await db.put("numberingPrefs", { id: "singleton", ...prefs } as any);
}

export async function getUserPrefs(): Promise<UserPrefs> {
  const db = await getDB();
  const rec = await db.get("userPrefs", "singleton" as any);
  if (rec) return rec as any;
  const defaults: UserPrefs & { id: string } = { id: "singleton", dateFormat: "MM/DD/YYYY", currency: "USD" };
  await db.put("userPrefs", defaults as any);
  const { id, ...rest } = defaults;
  return rest;
}

export async function setUserPrefs(prefs: UserPrefs): Promise<void> {
  const db = await getDB();
  await db.put("userPrefs", { id: "singleton", ...prefs } as any);
}

export async function getLicenseState(): Promise<LicenseState> {
  const db = await getDB();
  const rec = await db.get("licenseState", "singleton" as any);
  if (rec) return rec as any;
  const defaults: LicenseState & { id: string } = { id: "singleton", verified: false, pro: false };
  await db.put("licenseState", defaults as any);
  const { id, ...rest } = defaults;
  return rest;
}

export async function setLicenseState(state: LicenseState): Promise<void> {
  const db = await getDB();
  await db.put("licenseState", { id: "singleton", ...state } as any);
}

// Business profiles
export async function listBusinessProfiles(): Promise<BusinessProfile[]> {
  const db = await getDB();
  return db.getAll("businessProfiles");
}
export async function getBusinessProfile(id: string): Promise<BusinessProfile | undefined> {
  const db = await getDB();
  return db.get("businessProfiles", id);
}
export async function saveBusinessProfile(profile: BusinessProfile): Promise<void> {
  const db = await getDB();
  await db.put("businessProfiles", profile);
}
export async function deleteBusinessProfile(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("businessProfiles", id);
}

// Clients
export async function listClients(): Promise<Client[]> {
  const db = await getDB();
  return db.getAll("clients");
}
export async function getClient(id: string): Promise<Client | undefined> {
  const db = await getDB();
  return db.get("clients", id);
}
export async function saveClient(client: Client): Promise<void> {
  const db = await getDB();
  await db.put("clients", client);
}
export async function deleteClient(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("clients", id);
}

// Catalog items
export async function listCatalogItems(): Promise<CatalogItem[]> {
  const db = await getDB();
  return db.getAll("catalogItems");
}
export async function saveCatalogItem(item: CatalogItem): Promise<void> {
  const db = await getDB();
  await db.put("catalogItems", item);
}
export async function deleteCatalogItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("catalogItems", id);
}

// Documents
export async function listDocuments(): Promise<BaseDocument[]> {
  const db = await getDB();
  return db.getAll("documents");
}
export async function getDocument(id: string): Promise<BaseDocument | undefined> {
  const db = await getDB();
  return db.get("documents", id);
}
export async function saveDocument(doc: BaseDocument): Promise<void> {
  const db = await getDB();
  await db.put("documents", doc);
}
export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("documents", id);
}

// Backup
export async function exportBackup(): Promise<any> {
  const [businessProfiles, clients, catalogItems, documents, numberingPrefs, userPrefs, licenseState] = await Promise.all([
    listBusinessProfiles(),
    listClients(),
    listCatalogItems(),
    listDocuments(),
    getNumberingPrefs(),
    getUserPrefs(),
    getLicenseState(),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    businessProfiles,
    clients,
    catalogItems,
    documents,
    numberingPrefs,
    userPrefs,
    licenseState,
  };
}

export async function importBackup(data: any, mode: "replace" = "replace"): Promise<void> {
  const db = await getDB();
  // validate version
  if (!data || typeof data !== "object") throw new Error("Invalid backup file.");
  if (data.version !== 1) throw new Error("Unsupported backup version.");
  const tx = db.transaction(
    ["businessProfiles", "clients", "catalogItems", "documents", "numberingPrefs", "userPrefs", "licenseState"],
    "readwrite"
  );
  // clear
  await Promise.all([
    tx.objectStore("businessProfiles").clear(),
    tx.objectStore("clients").clear(),
    tx.objectStore("catalogItems").clear(),
    tx.objectStore("documents").clear(),
  ]);
  for (const p of data.businessProfiles ?? []) await tx.objectStore("businessProfiles").put(p);
  for (const c of data.clients ?? []) await tx.objectStore("clients").put(c);
  for (const i of data.catalogItems ?? []) await tx.objectStore("catalogItems").put(i);
  for (const d of data.documents ?? []) await tx.objectStore("documents").put(d);
  if (data.numberingPrefs) await tx.objectStore("numberingPrefs").put({ id: "singleton", ...data.numberingPrefs });
  if (data.userPrefs) await tx.objectStore("userPrefs").put({ id: "singleton", ...data.userPrefs });
  if (data.licenseState) await tx.objectStore("licenseState").put({ id: "singleton", ...data.licenseState });
  await tx.done;
}

export function isStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    return "indexedDB" in window;
  } catch {
    return false;
  }
}