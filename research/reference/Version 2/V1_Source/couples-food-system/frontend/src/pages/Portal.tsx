import { useState } from 'react'
import { useAuthStore, createHousehold, joinHousehold } from '../lib/auth'
import { Onboarding } from './Onboarding'
import { MainApp } from './MainApp'

export default function Portal() {
  const { household, isLoading, setAuth } = useAuthStore()
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverInviteCode, setServerInviteCode] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!household) {
    return (
      <Onboarding
        onCreate={async (name) => {
          try {
            setError(null)
            const result = await createHousehold(name)
            setAuth(result.token, result.household, result.partner)
            setServerInviteCode(result.household.inviteCode || null)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create household')
          }
        }}
        onJoin={async (code, name) => {
          try {
            setError(null)
            const result = await joinHousehold(code, name)
            setAuth(result.token, result.household, result.partner)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid invite code')
          }
        }}
        error={error}
        isJoining={isJoining}
        setIsJoining={setIsJoining}
        serverInviteCode={serverInviteCode}
      />
    )
  }

  return <MainApp />
}
