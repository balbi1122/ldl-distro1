export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

export const isStripeConfigured = STRIPE_PUBLISHABLE_KEY.length > 0;

/**
 * Redirects to Stripe Checkout.
 * Requires a backend endpoint at /api/create-checkout-session to create
 * the Stripe session and return the URL.
 */
export async function redirectToCheckout(
  priceId: string,
  userId: string,
  userEmail: string,
): Promise<void> {
  if (!isStripeConfigured) {
    alert(
      "Payment processing is not yet configured. Please contact the administrator.",
    );
    return;
  }

  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, userId, userEmail }),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  const { url } = await response.json();
  window.location.href = url;
}

/**
 * Redirects to Stripe Customer Portal for managing subscriptions.
 */
export async function redirectToPortal(customerId: string): Promise<void> {
  if (!isStripeConfigured) {
    alert(
      "Subscription management is not yet configured. Please contact the administrator.",
    );
    return;
  }

  const response = await fetch("/api/create-portal-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create portal session");
  }

  const { url } = await response.json();
  window.location.href = url;
}
