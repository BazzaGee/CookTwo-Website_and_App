import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export default function UpgradeReturn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = useAuthStore((s) => s.session);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session) {
      navigate('/onboarding', { replace: true });
      return;
    }

    const upgraded = searchParams.get('upgraded');
    const sessionId = searchParams.get('session_id');

    if (upgraded !== 'true') {
      navigate('/onboarding', { replace: true });
      return;
    }

    const householdId = session.householdId;
    const token = session.token;
    let cancelled = false;

    async function handleUpgradeReturn() {

      if (sessionId && householdId) {
        try {
          await apiFetch(`/api/household/${householdId}/billing/verify-session`, {
            method: 'POST',
            token,
            body: { sessionId },
          });
        } catch (err) {
          console.error('[upgrade-return] verify-session failed:', err);
        }
      }

      const maxAttempts = 15;
      for (let i = 0; i < maxAttempts; i++) {
        if (cancelled) return;
        try {
          const usage = await apiFetch<{ tier: string }>(`/api/household/${householdId}/usage`, { token });
          if (usage.tier === 'premium') break;
        } catch {}
        await new Promise((r) => setTimeout(r, 2000));
      }

      if (cancelled) return;

      queryClient.invalidateQueries({ queryKey: ['usage', householdId] });
      completeOnboarding();
      navigate('/shopping', { replace: true });
    }

    handleUpgradeReturn();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-full bg-cream flex items-center justify-center">
      <p className="text-text-secondary text-sm animate-pulse">Activating your Premium…</p>
    </div>
  );
}
