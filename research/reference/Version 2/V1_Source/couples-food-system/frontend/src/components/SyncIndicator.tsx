import { motion } from 'framer-motion'
import { Check, RefreshCw } from 'lucide-react'

type SyncStatus = 'synced' | 'syncing' | 'offline'

interface SyncIndicatorProps {
  status: SyncStatus
}

export function SyncIndicator({ status }: SyncIndicatorProps) {
  if (status === 'synced') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-1.5 text-xs text-sage"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Check className="w-3.5 h-3.5" />
        </motion.div>
        <span>Synced</span>
      </motion.div>
    )
  }

  if (status === 'syncing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-1.5 text-xs text-terracotta"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </motion.div>
        <span>Syncing...</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-1.5 text-xs text-text-secondary"
    >
      <span className="w-2 h-2 rounded-full bg-gray-400" />
      <span>Offline</span>
    </motion.div>
  )
}
