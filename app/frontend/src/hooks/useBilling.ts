import { useState } from 'react';
import { apiFetch, ApiError } from '../lib/api';
import { useAuthStore } from '../stores/authStore';

export type BillingPlan = 'monthly' | 'yearly';

export class BillingError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = 'BillingError';
    this.code = code;
  }
}

export function useBilling() {
  const session = useAuthStore((s) => s.session);
  const householdId = session?.householdId ?? '';
  const token = session?.token ?? '';
  const [checkingOut, setCheckingOut] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [stripeAvailable, setStripeAvailable] = useState<boolean | null>(null);

  async function checkStripeStatus() {
    try {
      const res = await apiFetch<{ configured: boolean }>('/api/billing/status');
      setStripeAvailable(res.configured);
      return res.configured;
    } catch {
      setStripeAvailable(false);
      return false;
    }
  }

  async function checkout(plan: BillingPlan) {
    if (!householdId || !token) return;
    setCheckingOut(true);
    try {
      const res = await apiFetch<{ url: string }>(
        `/api/household/${householdId}/billing/checkout`,
        {
          method: 'POST',
          token,
          body: { plan },
        },
      );
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      console.error('[billing] checkout failed:', err);
      if (err instanceof ApiError) {
        const body = err.body as { error?: string; code?: string } | undefined;
        const msg = body?.error ?? err.message;
        const code = body?.code ?? 'checkout_error';
        throw new BillingError(msg, code);
      }
      throw new BillingError('Checkout failed. Please try again.', 'checkout_error');
    } finally {
      setCheckingOut(false);
    }
  }

  async function openPortal() {
    if (!householdId || !token) return;
    setPortalLoading(true);
    try {
      const res = await apiFetch<{ url: string }>(
        `/api/household/${householdId}/billing/portal`,
        {
          method: 'POST',
          token,
        },
      );
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      console.error('[billing] portal failed:', err);
      throw new BillingError('No portal available. You may not have an active subscription.', 'portal_error');
    } finally {
      setPortalLoading(false);
    }
  }

  return {
    checkingOut,
    portalLoading,
    stripeAvailable,
    checkStripeStatus,
    checkout,
    openPortal,
  };
}
