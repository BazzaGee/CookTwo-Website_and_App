import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'

interface InstallBannerProps {
  onInstall: () => void
  onDismiss: () => void
  isIOS?: boolean
}

export function InstallBanner({ onInstall, onDismiss, isIOS }: InstallBannerProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 safe-top"
      >
        <div className="mx-4 mt-2 bg-white rounded-2xl shadow-lg border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-sage" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary text-sm">
                {isIOS ? 'Install Couples Food System' : 'Add to Home Screen'}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {isIOS
                  ? 'Tap the Share button, then "Add to Home Screen"'
                  : 'Install for quick access and offline support'}
              </p>
              {!isIOS && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onInstall}
                  className="mt-2 px-4 py-1.5 bg-sage text-white text-xs font-medium rounded-full flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install
                </motion.button>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onDismiss}
              className="p-1 text-text-secondary hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
