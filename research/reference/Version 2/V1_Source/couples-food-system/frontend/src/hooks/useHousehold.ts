import { useEffect, useRef, useCallback, useState } from 'react'
import { useAuthStore } from '../lib/auth'
import { useOfflineQueue } from './useOfflineQueue'

export type GroceryItem = {
  id: string
  name: string
  quantity?: string
  category: string
  checked: boolean
  addedBy: string
  position: number
}

export type PantryItem = {
  id: string
  name: string
  quantity?: string
  category: string
  addedBy: string
  addedAt: number
}

export type PartnerProfile = {
  id: string
  name: string
  slot: 1 | 2
  age: number
  gender: 'male' | 'female' | 'other'
  weightKg: number
  heightCm: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose' | 'maintain' | 'gain'
  diet: string
  allergies: string[]
  calculatedTDEE: number
  targetCalories: number
}

export type MealIngredient = {
  name: string
  quantity: string
  inPantry: boolean
}

export type Meal = {
  id: string
  name: string
  description: string
  timeEstimate: number
  caloriesPerServing: number
  protein?: number
  carbs?: number
  fat?: number
  ingredients: MealIngredient[]
  steps: string[]
}

type WSMessage =
  | { type: 'SYNC_STATE'; items: GroceryItem[]; pantryItems: PantryItem[] }
  | { type: 'ITEM_ADDED'; item: GroceryItem }
  | { type: 'ITEM_UPDATED'; item: GroceryItem }
  | { type: 'ITEM_DELETED'; id: string }
  | { type: 'ITEMS_REORDERED'; items: GroceryItem[] }
  | { type: 'PANTRY_ADDED'; item: PantryItem }
  | { type: 'PANTRY_DELETED'; id: string }
  | { type: 'BULK_ITEMS_ADDED'; items: GroceryItem[] }
  | { type: 'ERROR'; message: string }

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8787'

export function useHousehold() {
  const { household, partner, token } = useAuthStore()
  const [items, setItems] = useState<GroceryItem[]>([])
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { enqueue, flush, getQueueLength } = useOfflineQueue()

  const sendRaw = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  const connect = useCallback(() => {
    if (!household?.id || !token) return

    const ws = new WebSocket(`${WS_URL}/ws/${household.id}?token=${token}&partner=${encodeURIComponent(partner?.name || 'Unknown')}`)
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      setError(null)
      flush(sendRaw)
    }

    ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data)

        switch (message.type) {
          case 'SYNC_STATE':
            setItems(message.items)
            setPantryItems(message.pantryItems || [])
            setIsSyncing(false)
            break
          case 'ITEM_ADDED':
            setItems((prev) => [...prev, message.item])
            break
          case 'ITEM_UPDATED':
            setItems((prev) =>
              prev.map((item) => (item.id === message.item.id ? message.item : item))
            )
            break
          case 'ITEM_DELETED':
            setItems((prev) => prev.filter((item) => item.id !== message.id))
            break
          case 'ITEMS_REORDERED':
            setItems(message.items)
            break
          case 'BULK_ITEMS_ADDED':
            setItems((prev) => [...prev, ...message.items])
            break
          case 'PANTRY_ADDED':
            setPantryItems((prev) => [...prev, message.item])
            break
          case 'PANTRY_DELETED':
            setPantryItems((prev) => prev.filter((item) => item.id !== message.id))
            break
          case 'ERROR':
            setError(message.message)
            break
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    ws.onclose = () => {
      setIsConnected(false)
      reconnectTimeoutRef.current = setTimeout(connect, 3000)
    }

    ws.onerror = () => {
      setError('Connection error')
    }
  }, [household?.id, token, flush, sendRaw])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
    }
  }, [])

  useEffect(() => {
    connect()
    return disconnect
  }, [connect, disconnect])

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      enqueue(message)
    }
  }, [enqueue])

  const addItem = useCallback(
    (name: string, quantity?: string, category: string = 'Other') => {
      sendMessage({
        type: 'ADD_ITEM',
        name,
        quantity,
        category,
        addedBy: partner?.name || 'Unknown',
      })
    },
    [sendMessage, partner?.name]
  )

  const checkItem = useCallback(
    (id: string, checked: boolean) => {
      sendMessage({
        type: 'CHECK_ITEM',
        id,
        checked,
        checkedBy: partner?.name || 'Unknown',
      })
    },
    [sendMessage, partner?.name]
  )

  const deleteItem = useCallback(
    (id: string) => {
      sendMessage({ type: 'DELETE_ITEM', id })
    },
    [sendMessage]
  )

  const reorderItems = useCallback(
    (itemIds: string[]) => {
      sendMessage({ type: 'REORDER_ITEMS', itemIds })
    },
    [sendMessage]
  )

  const addPantryItem = useCallback(
    (name: string, quantity?: string, category: string = 'Other') => {
      sendMessage({
        type: 'ADD_PANTRY',
        name,
        quantity,
        category,
      })
    },
    [sendMessage]
  )

  const deletePantryItem = useCallback(
    (id: string) => {
      sendMessage({ type: 'DELETE_PANTRY', id })
    },
    [sendMessage]
  )

  const moveToPantry = useCallback(
    (groceryId: string) => {
      sendMessage({ type: 'MOVE_TO_PANTRY', groceryId })
    },
    [sendMessage]
  )

  const bulkAddItems = useCallback(
    (newItems: { name: string; quantity?: string; category?: string }[]) => {
      sendMessage({ type: 'BULK_ADD_ITEMS', items: newItems })
    },
    [sendMessage]
  )

  return {
    items,
    pantryItems,
    isConnected,
    isSyncing,
    error,
    addItem,
    checkItem,
    deleteItem,
    reorderItems,
    addPantryItem,
    deletePantryItem,
    moveToPantry,
    bulkAddItems,
    queuedCount: getQueueLength(),
  }
}
