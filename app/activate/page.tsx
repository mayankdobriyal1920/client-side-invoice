"use client";

import { useState } from "react";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";

export default function ActivatePage() {
  const { isPro, refresh } = useLicenseStatus();
  const [email, setEmail] = useState("");
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
        setMessage("Pro activated on this browser.");
        await refresh();
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
        <p>Already purchased? Enter the email used at checkout to receive a verification code.</p>
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