"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";
import { setLicenseState } from "@/lib/storage/db";

function ActivateContent() {
  const { isPro, refresh } = useLicenseStatus();
  const [email, setEmail] = useState("");
  const searchParams = useSearchParams();
  const justPurchased = searchParams.get("purchased") === "1";
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/license/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || "If a licence exists, a code has been sent.");
      setStep("otp");
    } catch {
      setMessage("Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/license/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.isPro) {
        await setLicenseState({ verified: true, pro: true, verifiedAt: new Date().toISOString() });
        setMessage("Pro activated on this browser.");
        await refresh();
        // refresh the page so all components reflect the new state
        setTimeout(() => window.location.reload(), 800);
      } else {
        setMessage(data.error || "Verification failed.");
      }
    } catch {
      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/license/logout", { method: "POST", credentials: "include" });
    await refresh();
    setMessage("Signed out.");
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-950">Activate EasyBillKit Pro</h1>
      <div className="glass-card p-5 space-y-3 text-sm text-muted">
        {justPurchased && (
          <div className="text-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center mx-auto mb-2">✓</div>
            <h2 className="text-xl font-bold text-green-950">Purchase complete!</h2>
            <p className="mt-2 text-muted">Your order is placed. To unlock Pro on this browser, enter the email you used at checkout below and verify it with the code we send.</p>
          </div>
        )}
        {!justPurchased && <p>Already purchased? Enter the email used at checkout to receive a verification code.</p>}
        {isPro && <p className="text-green-700 font-medium">Pro is active on this browser.</p>}
        {step === "email" && (
          <>
            <input className="glass-input w-full px-3 py-2 text-sm" type="email" placeholder="Purchase email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={requestCode} disabled={loading} className="btn-primary px-5 py-2 rounded-xl font-medium disabled:opacity-60">
              {loading ? "Sending…" : "Send verification code"}
            </button>
          </>
        )}
        {step === "otp" && (
          <>
            <input className="glass-input w-full px-3 py-2 text-sm" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={verifyCode} disabled={loading} className="btn-primary px-5 py-2 rounded-xl font-medium disabled:opacity-60">
                {loading ? "Verifying…" : "Verify"}
              </button>
              <button onClick={() => setStep("email")} className="btn-ghost px-5 py-2 rounded-xl font-medium">Back</button>
            </div>
          </>
        )}
        {message && <p className="text-sm">{message}</p>}
        {isPro && (
          <button onClick={logout} className="btn-ghost px-4 py-2 rounded-xl text-sm font-medium">Sign out</button>
        )}
      </div>
    </section>
  );
}

export default function ActivatePage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-6">Loading activation…</div>}>
      <ActivateContent />
    </Suspense>
  );
}