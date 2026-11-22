"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Paddle?: any;
  }
}

export default function PaddleCheckout() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const openCheckout = () => {
    if (!window.Paddle || !priceId) {
      alert("Paddle is not configured. Set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN and NEXT_PUBLIC_PADDLE_PRICE_ID.");
      return;
    }
    setLoading(true);
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        displayMode: "overlay",
        theme: "light",
      },
      customData: { source: "easybillkit" },
    });
    // Paddle.js emits events via Paddle.Checkout; we listen via eventCallback if available
    if (window.Paddle?.Checkout?.setEventCallback) {
      window.Paddle.Checkout.setEventCallback((data: any) => {
        if (data?.name === "checkout.completed") {
          setLoading(false);
          alert("Purchase received. Check your email to activate EasyBillKit Pro.");
          router.push("/activate");
        }
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <button onClick={openCheckout} disabled={!ready || loading} className="btn-primary px-5 py-3 rounded-xl font-medium disabled:opacity-60">
      {loading ? "Processing…" : ready ? "Buy Pro with Paddle" : "Loading checkout…"}
    </button>
  );
}