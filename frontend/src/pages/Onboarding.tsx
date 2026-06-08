import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHousehold, joinHousehold } from '../hooks/useAuth';
import { useAuthStore } from '../stores/authStore';
import { apiFetch } from '../lib/api';
import type { Diet, Goal } from '../hooks/useProfiles';

type Step = 'welcome' | 'name' | 'preferences' | 'goals' | 'pantry' | 'created' | 'join-code' | 'partner-check';

const DIETS: readonly Diet[] = ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'gluten-free'] as const;
const GOALS: readonly Goal[] = ['lose', 'maintain', 'gain', 'none'] as const;

const DIET_LABELS: Record<Diet, string> = {
  omnivore: 'No restrictions',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  keto: 'Keto',
  paleo: 'Paleo',
  'gluten-free': 'Gluten-free',
};

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose weight',
  maintain: 'Maintain weight',
  gain: 'Build muscle',
  none: 'Just eat well',
};

export default function Onboarding() {
  const navigate = useNavigate();
  const session = useAuthStore((s) => s.session);
  const setSession = useAuthStore((s) => s.setSession);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const initialStep = session ? 'welcome' : 'welcome';
  const [step, setStep] = useState<Step>(initialStep);
  const [displayName, setDisplayName] = useState('');
  const [inviteCodeDigits, setInviteCodeDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null);
  const [diet, setDiet] = useState<Diet>('omnivore');
  const [allergies, setAllergies] = useState('');
  const [goal, setGoal] = useState<Goal>('none');
  const [pantryInput, setPantryInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleJoin() {
    const code = inviteCodeDigits.join('');
    const name = displayName.trim();
    if (!/^\d{6}$/.test(code)) {
      setError("Your partner's code is 6 digits.");
      return;
    }
    if (!name) {
      setError('Tell us what to call you.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await joinHousehold({
        inviteCode: code,
        displayName: name,
        diet: diet === 'omnivore' ? undefined : diet,
        allergies: allergies.trim() || undefined,
        goal: goal === 'none' ? undefined : goal,
      });
      setSession(result);
      completeOnboarding();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error && 'message' in err ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handlePantryContinue() {
    const name = displayName.trim();
    if (!name) {
      setError('Tell us what to call you.');
      return;
    }
    setError(null);
    setStep('partner-check');
  }

  async function handleCreateHousehold() {
    const name = displayName.trim();
    if (!name) {
      setError('Tell us what to call you.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await createHousehold({
        displayName: name,
        diet: diet === 'omnivore' ? undefined : diet,
        allergies: allergies.trim() || undefined,
        goal: goal === 'none' ? undefined : goal,
      });
      setSession(result);
      setCreatedInviteCode(result.inviteCode ?? null);

      if (pantryInput.trim()) {
        const parts = pantryInput.split(/[,;]/).map((p) => p.trim()).filter((p) => p.length > 0);
        if (parts.length > 0) {
          try {
            await apiFetch(`/api/household/${result.householdId}/pantry/bulk`, {
              method: 'POST',
              body: {
                items: parts.map((p) => ({ name: p, quantity: '' })),
                addedByPartnerId: result.partner.id,
                addedByPartnerSlot: result.partner.slot,
              },
              token: result.token,
            });
          } catch {
            // pantry bulk is optional, don't block onboarding
          }
        }
      }

      setStep('created');
    } catch (err) {
      setError(err instanceof Error && 'message' in err ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinue() {
    completeOnboarding();
    navigate('/', { replace: true });
  }

  return (
    <main className="min-h-full bg-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {step === 'welcome' && (
            <WelcomeStep
              onCreate={() => setStep('name')}
            />
          )}

          {step === 'name' && (
            <NameStep
              displayName={displayName}
              onDisplayNameChange={(v) => {
                setDisplayName(v);
                if (error) setError(null);
              }}
              onSubmit={() => setStep('preferences')}
              onBack={() => setStep('welcome')}
              error={error}
            />
          )}

          {step === 'preferences' && (
            <PreferencesStep
              diet={diet}
              allergies={allergies}
              onDietChange={setDiet}
              onAllergiesChange={setAllergies}
              onNext={() => setStep('goals')}
              onBack={() => setStep('name')}
            />
          )}

          {step === 'goals' && (
            <GoalsStep
              goal={goal}
              onGoalChange={setGoal}
              onNext={() => setStep('pantry')}
              onBack={() => setStep('preferences')}
            />
          )}

          {step === 'pantry' && (
            <PantryStep
              pantryInput={pantryInput}
              onPantryInputChange={setPantryInput}
              onSubmit={handlePantryContinue}
              onSkip={handlePantryContinue}
              submitting={submitting}
              error={error}
            />
          )}

          {step === 'partner-check' && (
            <PartnerCheckStep
              onJoin={() => setStep('join-code')}
              onCreate={handleCreateHousehold}
              onBack={() => setStep('pantry')}
            />
          )}

          {step === 'join-code' && (
            <JoinCodeStep
              digits={inviteCodeDigits}
              onDigitsChange={(d) => {
                setInviteCodeDigits(d);
                if (error) setError(null);
              }}
              onSubmit={handleJoin}
              onBack={() => setStep('partner-check')}
              submitting={submitting}
              error={error}
            />
          )}

          {step === 'created' && (
            <CreatedStep
              inviteCode={createdInviteCode}
              onContinue={handleContinue}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function Wordmark() {
  return (
    <div className="text-center mb-12">
      <p className="text-sage text-xs font-medium tracking-[0.3em] uppercase">For two</p>
      <h1 className="text-text-primary text-3xl font-semibold tracking-tight mt-3">
        Couples Food System
      </h1>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-sage text-white font-medium py-4 px-6 rounded-2xl hover:bg-sage-dark active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-text-secondary hover:text-text-primary text-sm font-medium py-2 transition-colors"
    >
      {children}
    </button>
  );
}

function WelcomeStep({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col">
      <Wordmark />

      <div className="text-center mb-12">
        <h2 className="text-text-primary text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
          One dinner.
          <br />
          Two plates.
          <br />
          <span className="text-sage">Zero arguments.</span>
        </h2>
        <p className="text-text-secondary text-base mt-6 leading-relaxed max-w-sm mx-auto">
          A shared kitchen for the two of you. One grocery list, one plan, cooked together.
        </p>
      </div>

      <PrimaryButton onClick={onCreate}>Set up our kitchen</PrimaryButton>
    </div>
  );
}

function NameStep({
  displayName,
  onDisplayNameChange,
  onSubmit,
  onBack,
  error,
}: {
  displayName: string;
  onDisplayNameChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  error: string | null;
}) {
  return (
    <div className="flex flex-col">
      <Wordmark />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col"
      >
        <label
          htmlFor="displayName"
          className="text-text-primary text-sm font-medium mb-3 tracking-wide"
        >
          What should we call you?
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          placeholder="Your first name"
          autoFocus
          autoComplete="given-name"
          maxLength={32}
          className="w-full bg-white border border-border rounded-2xl px-5 py-4 text-text-primary text-lg placeholder:text-text-secondary/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
        />

        {error && (
          <p className="text-error text-sm mt-3" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8">
          <PrimaryButton type="submit">Continue</PrimaryButton>
        </div>
        <div className="mt-2 text-center">
          <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        </div>
      </form>
    </div>
  );
}

function PreferencesStep({
  diet,
  allergies,
  onDietChange,
  onAllergiesChange,
  onNext,
  onBack,
}: {
  diet: Diet;
  allergies: string;
  onDietChange: (v: Diet) => void;
  onAllergiesChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col">
      <Wordmark />

      <div className="mb-8">
        <h2 className="text-text-primary text-2xl font-semibold tracking-tight">
          Any dietary preferences?
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          This helps us suggest meals that work for you. Skip if you're not sure.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="diet" className="text-text-secondary text-xs font-medium tracking-wide block mb-2">
            Dietary preference
          </label>
          <select
            id="diet"
            value={diet}
            onChange={(e) => onDietChange(e.target.value as Diet)}
            className="w-full bg-white border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors appearance-none"
          >
            {DIETS.map((d) => (
              <option key={d} value={d}>
                {DIET_LABELS[d]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="allergies" className="text-text-secondary text-xs font-medium tracking-wide block mb-2">
            Allergies (optional)
          </label>
          <input
            id="allergies"
            type="text"
            value={allergies}
            onChange={(e) => onAllergiesChange(e.target.value)}
            placeholder="peanuts, shellfish, dairy…"
            className="w-full bg-white border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
          />
        </div>
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
      </div>
      <div className="mt-2 text-center">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
      </div>
    </div>
  );
}

function GoalsStep({
  goal,
  onGoalChange,
  onNext,
  onBack,
}: {
  goal: Goal;
  onGoalChange: (v: Goal) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col">
      <Wordmark />

      <div className="mb-8">
        <h2 className="text-text-primary text-2xl font-semibold tracking-tight">
          Any body goals?
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          This helps us adapt portions so you both hit your targets. Skip if you're not sure.
        </p>
      </div>

      <div className="space-y-3">
        {GOALS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onGoalChange(g)}
            className={`w-full text-left py-3 px-4 rounded-xl border transition-colors ${
              goal === g
                ? 'bg-sage/10 border-sage text-text-primary'
                : 'bg-white border-border text-text-secondary hover:bg-cream'
            }`}
          >
            <span className="text-sm font-medium">{GOAL_LABELS[g]}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onNext}>Continue</PrimaryButton>
      </div>
      <div className="mt-2 text-center">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
      </div>
    </div>
  );
}

function PantryStep({
  pantryInput,
  onPantryInputChange,
  onSubmit,
  onSkip,
  submitting,
  error,
}: {
  pantryInput: string;
  onPantryInputChange: (v: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-col">
      <Wordmark />

      <div className="mb-8">
        <h2 className="text-text-primary text-2xl font-semibold tracking-tight">
          What's in your kitchen?
        </h2>
        <p className="text-text-secondary text-sm mt-2">
          Type what you have — or skip and add later. This helps us suggest meals you can actually cook.
        </p>
      </div>

      <div className="space-y-3">
        <textarea
          value={pantryInput}
          onChange={(e) => onPantryInputChange(e.target.value)}
          placeholder="chicken, 2 cups rice, spinach, half an onion…"
          rows={3}
          className="w-full bg-white border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors resize-none"
        />
        {error && (
          <p className="text-error text-sm" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Setting the table…' : 'Continue'}
        </PrimaryButton>
      </div>
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={onSkip}
          className="text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function PartnerCheckStep({
  onJoin,
  onCreate,
  onBack,
}: {
  onJoin: () => void;
  onCreate: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col">
      <Wordmark />

      <div className="text-center mb-12">
        <h2 className="text-text-primary text-3xl font-semibold tracking-tight">
          Is your partner already set up?
        </h2>
        <p className="text-text-secondary text-base mt-3 leading-relaxed">
          If they've already created a kitchen, enter their code to join.
          If not, you'll get a code to share with them.
        </p>
      </div>

      <div className="space-y-3">
        <PrimaryButton onClick={onJoin}>Yes, I have their code</PrimaryButton>
        <button
          type="button"
          onClick={onCreate}
          className="w-full bg-transparent text-terracotta-dark font-medium py-4 px-6 rounded-2xl border border-terracotta/30 hover:bg-terracotta/5 transition-colors"
        >
          No, I'm setting up first
        </button>
      </div>
      <div className="mt-4 text-center">
        <SecondaryButton onClick={onBack}>Back</SecondaryButton>
      </div>
    </div>
  );
}

function CreatedStep({
  inviteCode,
  onContinue,
}: {
  inviteCode: string | null;
  onContinue: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  }

  return (
    <div className="flex flex-col">
      <Wordmark />

      <div className="text-center mb-8">
        <p className="text-sage text-sm font-medium tracking-wide uppercase">Your kitchen is ready</p>
        <h2 className="text-text-primary text-3xl font-semibold tracking-tight mt-3">
          Share this code with your partner
        </h2>
        <p className="text-text-secondary text-base mt-3 leading-relaxed">
          They enter it when they open the app, and your kitchens link up instantly.
        </p>
      </div>

      {inviteCode && (
        <div className="flex gap-2 justify-center mb-6">
          {inviteCode.split('').map((d, i) => (
            <div
              key={i}
              className="w-full aspect-square bg-white border border-border rounded-xl flex items-center justify-center text-text-primary text-2xl font-semibold"
            >
              {d}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleCopy}
        className={`w-full font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mb-6 ${
          copied
            ? 'bg-sage text-white'
            : 'bg-white border border-border text-text-primary hover:bg-cream-dark'
        }`}
      >
        {copied ? 'Copied!' : 'Copy code'}
      </button>

      <PrimaryButton onClick={onContinue}>Continue to our kitchen</PrimaryButton>
      <p className="text-text-secondary text-sm text-center mt-4">
        You can also share this code later from the app header.
      </p>
    </div>
  );
}

function JoinCodeStep({
  digits,
  onDigitsChange,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  digits: string[];
  onDigitsChange: (d: string[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
}) {
  function setDigit(index: number, value: string) {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    onDigitsChange(next);
    if (cleaned && index < 5) {
      const nextEl = document.getElementById(`code-${index + 1}`);
      nextEl?.focus();
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < text.length; i++) next[i] = text[i] ?? '';
    onDigitsChange(next);
    const focusIndex = Math.min(text.length, 5);
    document.getElementById(`code-${focusIndex}`)?.focus();
  }

  return (
    <div className="flex flex-col">
      <Wordmark />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col"
      >
        <label className="text-text-primary text-sm font-medium mb-3 tracking-wide">
          Your partner's code
        </label>
        <div className="flex gap-2 justify-between mb-8" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => handleDigitKeyDown(i, e)}
              autoFocus={i === 0}
              className="w-full aspect-square bg-white border border-border rounded-2xl text-center text-text-primary text-2xl font-semibold focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/20 transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="text-error text-sm mt-3" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8">
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Joining…' : 'Join our kitchen'}
          </PrimaryButton>
        </div>
        <div className="mt-2 text-center">
          <SecondaryButton onClick={onBack}>Back</SecondaryButton>
        </div>
      </form>
    </div>
  );
}
