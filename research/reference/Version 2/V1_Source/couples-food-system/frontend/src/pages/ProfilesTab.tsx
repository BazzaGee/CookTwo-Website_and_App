import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserCircle, Heart, AlertTriangle, Check } from 'lucide-react'
import { useProfiles, useUpdateProfile } from '../hooks/useProfiles'
import { useAuthStore } from '../lib/auth'
import { AnimatedCard, SlideUp } from '../components/AnimatedList'
import { BodyProfileForm } from '../components/BodyProfileForm'

const DIET_OPTIONS = [
  { value: 'none', label: 'No Specific Diet', emoji: '✨' },
  { value: 'omnivore', label: 'Omnivore', emoji: '🍽️' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'pescatarian', label: 'Pescatarian', emoji: '🐟' },
  { value: 'keto', label: 'Keto', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', emoji: '🥩' },
  { value: 'gluten_free', label: 'Gluten Free', emoji: '🌾' },
  { value: 'custom', label: 'Custom', emoji: '✏️' },
]

const COMMON_ALLERGIES = [
  'Shellfish', 'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs',
  'Wheat', 'Soy', 'Fish', 'Sesame',
]

export function ProfilesTab() {
  const { partner } = useAuthStore()
  const { data, isLoading } = useProfiles()
  const updateProfile = useUpdateProfile()

  const profiles = data?.profiles || []
  const myProfile = profiles.find((p) => p.id === partner?.id)
  const otherProfile = profiles.find((p) => p.id !== partner?.id)

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 pb-6 space-y-6">
      {/* My Profile */}
      <SlideUp delay={0}>
        <h2 className="text-lg font-bold text-text-primary mb-1">Your Profile</h2>
        <p className="text-sm text-text-secondary mb-4">Tell us about your dietary needs</p>
      </SlideUp>

      <AnimatedCard delay={0.1}>
        <ProfileForm
          profile={myProfile}
          partnerId={partner?.id || ''}
          updateProfile={updateProfile}
        />
      </AnimatedCard>

      <AnimatedCard delay={0.15}>
        <BodyProfileForm
          profile={myProfile}
          partnerId={partner?.id || ''}
        />
      </AnimatedCard>

      {/* Partner's Profile */}
      {otherProfile && (
        <AnimatedCard delay={0.2}>
          <div className="bg-white rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <UserCircle className="w-5 h-5 text-terracotta" />
              <h3 className="font-semibold text-text-primary">{otherProfile.name}&apos;s Profile</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-sage" />
                <span className="text-text-secondary">
                  Diet: <span className="text-text-primary font-medium">{otherProfile.diet}</span>
                </span>
              </div>
              {otherProfile.allergies.length > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-error" />
                  <span className="text-text-secondary">
                    Allergies: <span className="text-error font-medium">{otherProfile.allergies.join(', ')}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </AnimatedCard>
      )}
    </div>
  )
}

interface ProfileFormProps {
  profile: { id: string; name: string; diet: string; allergies: string[] } | undefined
  partnerId: string
  updateProfile: ReturnType<typeof useUpdateProfile>
}

function ProfileForm({ profile, partnerId, updateProfile }: ProfileFormProps) {
  const [diet, setDiet] = useState(profile?.diet || 'none')
  const [customDiet, setCustomDiet] = useState(profile?.diet && !DIET_OPTIONS.find((o) => o.value === profile?.diet) ? profile.diet : '')
  const [allergies, setAllergies] = useState<string[]>(profile?.allergies || [])
  const [customAllergy, setCustomAllergy] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const dietValue = diet === 'custom' ? customDiet : diet
    try {
      await updateProfile.mutateAsync({
        partnerId,
        data: { diet: dietValue, allergies },
      })
    } finally {
      setIsSaving(false)
    }
  }

  const toggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    )
  }

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies((prev) => [...prev, customAllergy.trim()])
      setCustomAllergy('')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-border space-y-4">
      {/* Diet Selection */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Dietary Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {DIET_OPTIONS.map((option) => (
            <motion.button
              key={option.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDiet(option.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                diet === option.value
                  ? 'border-sage bg-sage/5'
                  : 'border-border hover:border-sage/30'
              }`}
            >
              <span className="text-lg">{option.emoji}</span>
              <span className="block text-sm font-medium text-text-primary mt-1">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
        {diet === 'custom' && (
          <input
            type="text"
            value={customDiet}
            onChange={(e) => setCustomDiet(e.target.value)}
            placeholder="Describe your diet (e.g., low-carb, halal, dairy-free)"
            className="w-full mt-3 px-3 py-2.5 border border-border rounded-xl text-sm focus:border-sage focus:outline-none"
          />
        )}
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Allergies & Intolerances
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {COMMON_ALLERGIES.map((allergy) => (
            <motion.button
              key={allergy}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAllergy(allergy)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                allergies.includes(allergy)
                  ? 'bg-error/10 text-error border border-error/30'
                  : 'bg-gray-50 text-text-secondary border border-border hover:border-error/30'
              }`}
            >
              {allergies.includes(allergy) && <Check className="w-3 h-3 inline mr-1" />}
              {allergy}
            </motion.button>
          ))}
        </div>

        {/* Custom Allergy Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="Add custom allergy..."
            className="flex-1 px-3 py-2 border border-border rounded-xl text-sm focus:border-sage focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addCustomAllergy()}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addCustomAllergy}
            disabled={!customAllergy.trim()}
            className="px-4 py-2 bg-sage/10 text-sage rounded-xl text-sm font-medium disabled:opacity-50"
          >
            Add
          </motion.button>
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Profile'}
      </motion.button>
    </div>
  )
}
