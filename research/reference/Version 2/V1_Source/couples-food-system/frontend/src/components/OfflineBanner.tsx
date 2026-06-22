import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Clock } from 'lucide-react'

interface OfflineBannerProps {
  isOffline: boolean
  queuedCount?: number
}

export function OfflineBanner({ isOffline, queuedCount = 0 }: OfflineBannerProps) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 safe-top"
        >
          <div className="mx-4 mt-2 bg-terracotta/90 backdrop-blur-sm rounded-xl shadow-md px-4 py-2.5 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-white text-xs font-medium flex-1">
              You&apos;re offline
              {queuedCount > 0 && (
                <span className="ml-1 opacity-80">
                  &middot; {queuedCount} change{queuedCount > 1 ? 's' : ''} queued
                </span>
              )}
            </span>
            <Clock className="w-3.5 h-3.5 text-white/70" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
