"use client";

import { useState, useEffect } from "react";
import { useLicenseStatus } from "@/hooks/useLicenseStatus";

export default function ActivatePage() {
  const { isPro, refresh } = useLicenseStatus();
  const [licenseKey, setLicenseKey] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isProLocal, setIsProLocal] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<Array<{ activation_id: string; device_name: string; activated_at: string; last_validated_at: string; status: string }>>([]);
  const [maxDevices, setMaxDevices] = useState(3);
  const [recoveryStatus, setRecoveryStatus] = useState("");

  useEffect(() => {
    setIsProLocal(isPro);
  }, [isPro]);

  async function handleActivate() {
    if (!licenseKey.trim() || !deviceName.trim()) {
      setStatus("License key and device name required.");
      return;
    }
    setLoading(true);
    setStatus("");

    // Generate a device hash (stable per device)
    let deviceHash = localStorage.getItem("ebk_device_hash");
    if (!deviceHash) {
      deviceHash = crypto.randomUUID();
      localStorage.setItem("ebk_device_hash", deviceHash);
    }

    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim(), deviceName: deviceName.trim(), deviceHash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Activation failed");

      // Store Pro entitlement in local storage like pooltechtools
      localStorage.setItem("ebk_pro_license", JSON.stringify({
        token: data.signedToken,
        expiresAt: data.expiresAt,
        lastSeenAt: new Date().toISOString(),
      }));

      setStatus("Activated! Pro features unlocked.");
      setIsProLocal(true);
      await refresh();
      await loadDevices();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setStatus("Error: " + (err.message || "unknown"));
      setIsProLocal(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadDevices() {
    if (!licenseKey.trim()) return;
    try {
      const res = await fetch("/api/license/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setDevices(data.devices || []);
      setMaxDevices(data.maxActivations || 3);
    } catch {}
  }

  async function deactivate(activationId: string, devName: string) {
    if (!confirm(`Deactivate "${devName}"?`)) return;
    let deviceHash = localStorage.getItem("ebk_device_hash");
    if (!deviceHash) {
      deviceHash = crypto.randomUUID();
      localStorage.setItem("ebk_device_hash", deviceHash);
    }
    try {
      const res = await fetch("/api/license/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim(), deviceHash }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Device deactivated.");
        await loadDevices();
      } else {
        setStatus("Error: " + (data?.error?.message || "failed"));
      }
    } catch (err: any) {
      setStatus("Error: " + (err.message || "unknown"));
    }
  }

  async function requestRecovery() {
    if (!recoveryEmail.trim()) {
      setRecoveryStatus("Enter your email.");
      return;
    }
    try {
      const res = await fetch("/api/license/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecoveryStatus("If an account exists, recovery instructions have been sent.");
      } else {
        setRecoveryStatus("Error: " + (data?.error?.message || "failed"));
      }
    } catch (err: any) {
      setRecoveryStatus("Error: " + (err.message || "unknown"));
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-950">Activate Pro</h1>
        <p className="mt-2 text-green-950">Enter your license key to unlock Pro features.</p>
        {isProLocal && <span className="mt-2 inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Pro active</span>}
      </div>

      {/* Activate Card */}
      <div className="glass-card p-6 mb-6">
        <div className="space-y-4">
          <input
            className="glass-input w-full px-3 py-2 text-sm"
            placeholder="EBK-XXXX-XXXX-XXXX-XXXX"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
            maxLength={23}
          />
          <input
            className="glass-input w-full px-3 py-2 text-sm"
            placeholder="e.g. Sam's iPhone"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
          <button onClick={handleActivate} disabled={loading} className="btn-primary w-full py-2 rounded-xl font-medium disabled:opacity-60">
            {loading ? "Activating…" : "Activate"}
          </button>
          {status && <p className="mt-3 text-sm text-green-950">{status}</p>}
        </div>
      </div>

      {/* Devices Card */}
      {licenseKey.trim() && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-bold text-green-950">Activated Devices ({devices.length}/{maxDevices})</h2>
          <button onClick={loadDevices} className="btn-ghost px-3 py-1 rounded-lg text-sm text-green-700 hover:text-green-800 mt-2">
            Load Devices
          </button>
          <div className="mt-4 space-y-2">
            {devices.map((d) => (
              <div key={d.activation_id} className="glass p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-950">{d.device_name}</div>
                  <div className="text-xs text-muted">
                    {d.status} · activated {new Date(d.activated_at).toLocaleDateString()}
                  </div>
                </div>
                {d.status === "active" && (
                  <button
                    className="text-xs text-red-500 hover:text-red-700 underline"
                    onClick={() => deactivate(d.activation_id, d.device_name)}
                  >
                    Deactivate
                  </button>
                )}
              </div>
            ))}
            {devices.length === 0 && <p className="text-sm text-muted">No devices loaded. Click &quot;Load Devices&quot;.</p>}
          </div>
        </div>
      )}

      {/* Recovery Card */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-green-950">Lost Your License Key?</h2>
        <p className="mt-2 text-sm text-muted">Enter your purchase email to receive recovery instructions.</p>
        <div className="mt-4 space-y-3">
          <input
            className="glass-input w-full px-3 py-2 text-sm"
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button onClick={requestRecovery} className="btn-ghost w-full py-2 rounded-lg text-sm font-medium">
            Send Recovery Email
          </button>
          {recoveryStatus && <p className="mt-3 text-sm text-green-950">{recoveryStatus}</p>}
        </div>
      </div>
    </div>
  );
}