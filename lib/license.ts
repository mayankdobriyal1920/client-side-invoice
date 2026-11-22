export interface LicenseStatus {
  authenticated: boolean;
  isPro: boolean;
  plan?: string;
}

export async function fetchLicenseStatus(): Promise<LicenseStatus> {
  try {
    const res = await fetch("/api/license/status", { credentials: "include", cache: "no-store" });
    if (!res.ok) return { authenticated: false, isPro: false };
    return await res.json();
  } catch {
    return { authenticated: false, isPro: false };
  }
}