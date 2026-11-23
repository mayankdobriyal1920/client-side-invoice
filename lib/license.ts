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

export function getCachedLicenseStatus(): LicenseStatus | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("ebk_pro_license");
    if (!raw) return null;
    const val = JSON.parse(raw);
    const expiresAt = val.expiresAt ? new Date(val.expiresAt) : null;
    if (expiresAt && new Date() > expiresAt) {
      localStorage.removeItem("ebk_pro_license");
      return null;
    }
    return { authenticated: true, isPro: true, plan: val.plan ?? "lifetime_pro" };
  } catch {
    return null;
  }
}

export function setCachedLicenseStatus(token: string, expiresAt: string, plan: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ebk_pro_license", JSON.stringify({
    token,
    expiresAt,
    lastSeenAt: new Date().toISOString(),
    plan,
  }));
}

export function clearCachedLicenseStatus() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("ebk_pro_license");
}