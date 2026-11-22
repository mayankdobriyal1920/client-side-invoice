"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PurchaseSuccessModal from "@/components/pro/PurchaseSuccessModal";

declare global {
  interface Window {
    Paddle?: any;
  }
}

export default function PaddleCheckout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;
  const env = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";

  useEffect(() => {
    if (!clientToken) return;
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => {
      try {
        if (env === "sandbox") window.Paddle?.Environment?.set("sandbox");
        window.Paddle?.Initialize({ token: clientToken });
        setReady(true);
      } catch (e) {
        console.error("Paddle init failed", e);
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [clientToken, env]);

  useEffect(() => {
    if (purchaseComplete) {
      setShowModal(true);
      setPurchaseComplete(false);
    }
  }, [purchaseComplete]);

  const openCheckout = () => {
    if (!window.Paddle || !priceId) {
      alert("Paddle is not configured. Set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN and NEXT_PUBLIC_PADDLE_PRICE_ID.");
      return;
    }
    setLoading(true);
    setCheckoutOpen(true);
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      discountCode: discountCode.trim() || undefined,
      settings: {
        displayMode: "overlay",
        theme: "light",
      },
      customData: { source: "easybillkit" },
    });
    if (window.Paddle?.Checkout?.setEventCallback) {
      window.Paddle.Checkout.setEventCallback((data: any) => {
        if (data?.name === "checkout.completed") {
          setCheckoutOpen(false);
          setLoading(false);
          setDiscountCode("");
          setPurchaseComplete(true);
        }
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-muted block mb-1">Discount code (optional)</label>
        <input
          className="glass-input w-full px-3 py-2 text-sm"
          placeholder="Enter discount code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
      </div>
      <button onClick={openCheckout} disabled={!ready || loading} className="btn-primary px-5 py-3 rounded-xl font-medium disabled:opacity-60 w-full">
        {loading ? "Processing…" : ready ? "Buy Pro with Paddle" : "Loading checkout…"}
      </button>
      <PurchaseSuccessModal open={showModal} onClose={() => setShowModal(false)} onSuccess={() => router.push("/activate")} />
    </div>
  );
}