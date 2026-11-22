"use client";

import { useState, useEffect } from "react";
import { setLicenseState } from "@/lib/storage/db";
import { fetchLicenseStatus } from "@/lib/license";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PurchaseSuccessModal({ open, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Restore last used email from IndexedDB if available
  useEffect(() => {
    const saved = localStorage.getItem("ebk_last_email");
    if (saved) setEmail(saved);
  }, []);

  const saveEmail = async (em: string) => {
    try { localStorage.setItem("ebk_last_email", em); } catch {}
    await setLicenseState({ verified: false, pro: false, keyMasked: em });
  };

  const requestCode = async () => {
    if (!email.includes("@")) { setMessage("Please enter a valid email."); return; }
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
      await saveEmail(email);
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
        // refresh server-confirmed status
        await fetchLicenseStatus();
        setSuccess(true);
        setTimeout(() => { onSuccess(); onClose(); }, 1200);
      } else {
        setMessage(data.error || "Verification failed.");
      }
    } catch {
      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const [success, setSuccess] = useState(false);

  return (
    <dialog className="glass-strong rounded-2xl p-6 max-w-sm w-full backdrop:bg-black/50 backdrop-blur-sm border border-white/70" open={open} onClose={onClose}>
      {success ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center mx-auto mb-3">✓</div>
          <h2 className="text-xl font-bold text-green-950">Pro activated!</h2>
          <p className="mt-2 text-sm text-muted">Thank you for purchasing EasyBillKit Pro.</p>
          <button onClick={onClose} className="mt-5 px-4 py-2 rounded-xl btn-primary font-medium w-full">Continue</button>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center mx-auto mb-3">✓</div>
            <h2 className="text-xl font-bold text-green-950">Purchase complete!</h2>
            <p className="mt-2 text-sm text-muted">Your order is placed. Enter your purchase email to unlock Pro.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (step === "email") requestCode(); else verifyCode(); }} className="space-y-3">
            {step === "email" && (
              <>
                <label className="block text-xs text-muted mb-1">Purchase email</label>
                <input
                  type="email"
                  className="glass-input w-full px-3 py-2 text-sm"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <button type="submit" disabled={loading} className="btn-primary px-5 py-2 rounded-xl font-medium w-full disabled:opacity-60">
                  {loading ? "Sending…" : "Send verification code"}
                </button>
              </>
            )}
            {step === "otp" && (
              <>
                <label className="block text-xs text-muted mb-1">6-digit code</label>
                <input
                  type="text"
                  className="glass-input w-full px-3 py-2 text-sm text-center font-mono"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  autoFocus
                />
                <button type="submit" disabled={loading} className="btn-primary px-5 py-2 rounded-xl font-medium w-full disabled:opacity-60">
                  {loading ? "Verifying…" : "Verify code"}
                </button>
                <button type="button" onClick={() => setStep("email")} className="mt-2 text-xs text-green-700 hover:underline block text-center">Change email</button>
              </>
            )}
          </form>
          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </>
      )}
    </dialog>
  );
}