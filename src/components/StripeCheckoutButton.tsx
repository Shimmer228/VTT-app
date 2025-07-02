"use client";

import React from "react";

export default function StripeCheckoutButton() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/stripe/session", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Checkout session error:", await res.text());
        return;
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned from Stripe session");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Оплатити
    </button>
  );
}
