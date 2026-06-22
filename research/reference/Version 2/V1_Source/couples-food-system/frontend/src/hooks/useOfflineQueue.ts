import { useCallback, useRef } from 'react'

interface QueuedMessage {
  id: string
  message: unknown
  timestamp: number
}

const STORAGE_KEY = 'cfs-offline-queue'

function loadQueue(): QueuedMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveQueue(queue: QueuedMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
}

export function useOfflineQueue() {
  const queueRef = useRef<QueuedMessage[]>(loadQueue())

  const enqueue = useCallback((message: unknown) => {
    const item: QueuedMessage = {
      id: crypto.randomUUID(),
      message,
      timestamp: Date.now(),
    }
    queueRef.current.push(item)
    saveQueue(queueRef.current)
    return item.id
  }, [])

  const flush = useCallback((sendFn: (msg: unknown) => void) => {
    const queue = queueRef.current
    if (queue.length === 0) return

    const toSend = [...queue]
    queueRef.current = []
    saveQueue([])

    for (const item of toSend) {
      sendFn(item.message)
    }
  }, [])

  const getQueueLength = useCallback(() => {
    return queueRef.current.length
  }, [])

  return { enqueue, flush, getQueueLength }
}
