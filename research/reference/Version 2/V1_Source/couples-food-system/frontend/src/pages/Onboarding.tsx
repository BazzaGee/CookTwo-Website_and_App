import { useState } from 'react'
import { Heart, ArrowRight, Users, Copy, CheckCircle2 } from 'lucide-react'

type OnboardingProps = {
  onCreate: (name: string) => void
  onJoin: (code: string, name: string) => void
  error: string | null
  isJoining: boolean
  setIsJoining: (value: boolean) => void
  serverInviteCode: string | null
}

export function Onboarding({ onCreate, onJoin, error, isJoining, setIsJoining, serverInviteCode }: OnboardingProps) {
  const [step, setStep] = useState<'start' | 'name' | 'code' | 'waiting'>('start')
  const [name, setName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCreate = async () => {
    if (name.trim()) {
      await onCreate(name.trim())
      setStep('code')
    }
  }

  const handleJoin = async () => {
    if (joinCode.trim().length === 6 && name.trim()) {
      await onJoin(joinCode.trim().toUpperCase(), name.trim())
    }
  }

  const copyCode = () => {
    if (serverInviteCode) {
      navigator.clipboard.writeText(serverInviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (step === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 safe-top safe-bottom">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sage to-terracotta flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-text-primary">
            Couples Food System
          </h1>
          <p className="text-text-secondary text-center mb-12 text-sm">
            Collaborative meal planning & adaptive cooking
          </p>

          <div className="space-y-4">
            <button
              onClick={() => { setIsJoining(false); setStep('name'); }}
              className="w-full py-4 px-6 bg-sage text-white rounded-2xl font-semibold shadow-md hover:bg-sage-dark transition-colors flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              Create Your Kitchen
            </button>
            
            <button
              onClick={() => { setIsJoining(true); setStep('name'); }}
              className="w-full py-4 px-6 bg-white text-text-primary rounded-2xl font-semibold shadow-sm border border-border hover:bg-cream-dark transition-colors"
            >
              Join with Code
            </button>
          </div>

          {error && (
            <p className="mt-4 text-error text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    )
  }

  if (step === 'name') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 safe-top safe-bottom">
        <div className="w-full max-w-sm">
          <button
            onClick={() => setStep('start')}
            className="mb-6 text-text-secondary hover:text-text-primary"
          >
            ← Back
          </button>

          <h2 className="text-2xl font-bold mb-2 text-text-primary">
            {isJoining ? 'Join Your Kitchen' : 'Create Your Kitchen'}
          </h2>
          <p className="text-text-secondary mb-8 text-sm">
            {isJoining 
              ? 'Enter your name and the invite code from your partner'
              : 'Enter your name to create a shared kitchen'
            }
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex"
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-sage focus:outline-none bg-white"
                maxLength={20}
              />
            </div>

            {isJoining && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-sage focus:outline-none bg-white text-center tracking-widest font-mono text-lg"
                  maxLength={6}
                />
              </div>
            )}

            <button
              onClick={isJoining ? handleJoin : handleCreate}
              disabled={!name.trim() || (isJoining && joinCode.length !== 6)}
              className="w-full py-4 bg-sage text-white rounded-2xl font-semibold shadow-md hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isJoining ? 'Join Kitchen' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <p className="mt-4 text-error text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    )
  }

  if (step === 'code') {
    const displayCode = serverInviteCode || '—'

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 safe-top safe-bottom">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-2 text-text-primary text-center">
            Share This Code
          </h2>
          <p className="text-text-secondary mb-8 text-sm text-center">
            Your partner needs this code to join your kitchen
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-md border border-border mb-8">
            <div className="text-center">
              <span className="text-5xl font-mono font-bold text-sage tracking-widest">
                {displayCode.match(/.{1,3}/g)?.join(' ')}
              </span>
            </div>
            
            <button
              onClick={copyCode}
              disabled={!serverInviteCode}
              className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-sage font-medium hover:bg-sage/10 rounded-xl transition-colors disabled:opacity-50"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Code
                </>
              )}
            </button>
          </div>

          <div className="text-center text-text-secondary text-sm">
            <p>Waiting for your partner to join...</p>
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-4 border-sage border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
