import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore, getAuthHeaders } from '../lib/auth'

export interface Profile {
  id: string
  householdId: string
  slot: 1 | 2
  name: string
  diet: string
  allergies: string[]
  weightKg?: number
  heightCm?: number
  age?: number
  gender?: string
  activityLevel?: string
  goal?: string
  tdee?: number
  targetCalories?: number
  updatedAt: number | null
}

export function useProfiles() {
  const { household, token } = useAuthStore()

  return useQuery<{ profiles: Profile[] }, Error>({
    queryKey: ['profiles', household?.id],
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${household?.id}`, {
        headers: getAuthHeaders(token),
      })
      if (!res.ok) throw new Error('Failed to fetch profiles')
      return res.json()
    },
    enabled: !!household?.id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateProfile() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ partnerId, data }: { partnerId: string; data: { diet?: string; allergies?: string[]; name?: string; weightKg?: number; heightCm?: number; age?: number; gender?: string; activityLevel?: string; goal?: string } }) => {
      const res = await fetch(`/api/profiles/${partnerId}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Failed to update profile (${res.status})`)
      }
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      return data
    },
  })
}
