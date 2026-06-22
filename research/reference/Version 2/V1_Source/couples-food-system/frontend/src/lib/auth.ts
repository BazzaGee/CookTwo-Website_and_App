import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Partner {
  id: string
  name: string
  slot: 1 | 2
}

interface Household {
  id: string
  inviteCode?: string
  partner: Partner
}

interface AuthState {
  token: string | null
  household: Household | null
  partner: Partner | null
  isLoading: boolean
  setAuth: (token: string, household: Household, partner: Partner) => void
  clearAuth: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      household: null,
      partner: null,
      isLoading: true,

      setAuth: (token, household, partner) => {
        set({ token, household, partner, isLoading: false })
      },

      clearAuth: () => {
        set({ token: null, household: null, partner: null, isLoading: false })
      },

      initAuth: () => {
        const state = get()
        set({ ...state, isLoading: false })
      },
    }),
    {
      name: 'cfs-auth-storage',
    }
  )
)

export async function createHousehold(name: string): Promise<{ token: string; household: Household; partner: Partner }> {
  const response = await fetch('/api/auth/create-household', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error('Failed to create household')
  }

  return response.json()
}

export async function joinHousehold(code: string, name: string): Promise<{ token: string; household: Household; partner: Partner }> {
  const response = await fetch(`/api/auth/join/${code}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error('Invalid invite code')
  }

  return response.json()
}

export function getAuthHeaders(token: string | null): HeadersInit {
  if (!token) return { 'Content-Type': 'application/json' }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}
