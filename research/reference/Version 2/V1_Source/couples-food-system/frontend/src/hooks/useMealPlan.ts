import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore, getAuthHeaders } from '../lib/auth'
import type { Meal } from '../hooks/useHousehold'

export function useCachedMealPlan() {
  const { household, token } = useAuthStore()

  return useQuery<{ meal: Meal & { id: string; createdAt: number } | null }, Error>({
    queryKey: ['meal-plan', household?.id],
    queryFn: async () => {
      const res = await fetch(`/api/meal-plan/${household?.id}`, {
        headers: getAuthHeaders(token),
      })
      if (!res.ok) throw new Error('Failed to fetch meal plan')
      return res.json()
    },
    enabled: !!household?.id,
    staleTime: 1000 * 60 * 30,
  })
}

export function useGenerateMeal() {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (pantryItems: { name: string; quantity?: string }[]) => {
      const res = await fetch('/api/meal-plan/generate', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ pantryItems }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Failed to generate meal (${res.status})`)
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-plan'] })
    },
  })
}
