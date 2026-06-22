import { useState, useEffect } from 'react'
import { ShoppingBag, Home, Calendar, UserCircle, Settings } from 'lucide-react'
import { ShoppingTab } from './ShoppingTab'
import { PantryTab } from './PantryTab'
import { ProfilesTab } from './ProfilesTab'
import { MealPlanTab } from './MealPlanTab'
import { useHousehold } from '../hooks/useHousehold'
import { useAuthStore } from '../lib/auth'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { InstallBanner } from '../components/InstallBanner'
import { OfflineBanner } from '../components/OfflineBanner'

export function MainApp() {
  const [activeTab, setActiveTab] = useState<'shopping' | 'pantry' | 'meal_plan' | 'profiles' | 'settings'>('shopping')
  const { isConnected, error, queuedCount } = useHousehold()
  const { partner } = useAuthStore()
  const { shouldShow, promptInstall, dismiss } = useInstallPrompt()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream

  const tabs = [
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'pantry', label: 'Pantry', icon: Home },
    { id: 'meal_plan', label: 'Meal Plan', icon: Calendar },
    { id: 'profiles', label: 'Profiles', icon: UserCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {shouldShow && (
        <InstallBanner onInstall={promptInstall} onDismiss={dismiss} isIOS={isIOS} />
      )}
      <OfflineBanner isOffline={!isOnline} queuedCount={queuedCount} />

      {/* Header */}
      <header className={`sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-border px-4 py-3 safe-top ${shouldShow ? 'mt-20' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-text-primary">Our Kitchen</h1>
            {isConnected ? (
              <span className="w-2 h-2 bg-sage rounded-full animate-pulse-sage" />
            ) : error ? (
              <span className="w-2 h-2 bg-error rounded-full" />
            ) : (
              <span className="w-2 h-2 bg-terracotta rounded-full animate-pulse" />
            )}
          </div>
          
          {partner && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="px-2 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium">
                {partner.name}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20" style={{ WebkitOverflowScrolling: 'touch' }}>
        {activeTab === 'shopping' && <ShoppingTab />}
        {activeTab === 'pantry' && <PantryTab />}
        {activeTab === 'meal_plan' && <MealPlanTab />}
        {activeTab === 'profiles' && <ProfilesTab />}
        {activeTab === 'settings' && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-secondary mb-1">Settings</h3>
            <p className="text-text-secondary text-sm">Coming in Phase 2</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border pb-safe">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isDisabled = tab.id === 'settings'

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id as typeof activeTab)}
                disabled={isDisabled}
                className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors"
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-sage stroke-[2.5px]' : isDisabled ? 'text-gray-300' : 'text-text-secondary stroke-2'}`} />
                <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
