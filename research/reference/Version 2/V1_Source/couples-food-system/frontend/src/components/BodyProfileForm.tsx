import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'
import { useUpdateProfile } from '../hooks/useProfiles'

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, little exercise' },
  { value: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
  { value: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
  { value: 'active', label: 'Active', desc: 'Exercise 6-7 days/week' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise daily' },
]

const GOAL_OPTIONS = [
  { value: 'lose', label: 'Lose Weight', emoji: '📉' },
  { value: 'maintain', label: 'Maintain', emoji: '⚖️' },
  { value: 'gain', label: 'Gain Muscle', emoji: '💪' },
]

interface BodyProfileFormProps {
  profile: {
    id: string
    weightKg?: number
    heightCm?: number
    age?: number
    gender?: string
    activityLevel?: string
    goal?: string
    tdee?: number
    targetCalories?: number
  } | undefined
  partnerId: string
}

export function BodyProfileForm({ profile, partnerId }: BodyProfileFormProps) {
  const updateProfile = useUpdateProfile()
  const [isOpen, setIsOpen] = useState(false)
  const [weight, setWeight] = useState(profile?.weightKg?.toString() || '')
  const [height, setHeight] = useState(profile?.heightCm?.toString() || '')
  const [age, setAge] = useState(profile?.age?.toString() || '')
  const [gender, setGender] = useState(profile?.gender || '')
  const [activityLevel, setActivityLevel] = useState(profile?.activityLevel || 'moderate')
  const [goal, setGoal] = useState(profile?.goal || 'maintain')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!weight || !height || !age || !gender) return
    setIsSaving(true)
    try {
      await updateProfile.mutateAsync({
        partnerId,
        data: {
          weightKg: parseFloat(weight),
          heightCm: parseFloat(height),
          age: parseInt(age),
          gender,
          activityLevel,
          goal,
        },
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasBodyStats = profile?.weightKg && profile?.heightCm && profile?.age

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sage" />
          <div>
            <h3 className="font-semibold text-text-primary">Body Profile & Goals</h3>
            {hasBodyStats && profile?.targetCalories && (
              <p className="text-xs text-text-secondary">
                Target: {profile.targetCalories} cal/day
              </p>
            )}
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 space-y-4 border-t border-border pt-4"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:border-sage focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="170"
                className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:border-sage focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:border-sage focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:border-sage focus:outline-none bg-white"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">Activity Level</label>
            <div className="space-y-1.5">
              {ACTIVITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActivityLevel(opt.value)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    activityLevel === opt.value
                      ? 'border-sage bg-sage/5'
                      : 'border-border hover:border-sage/30'
                  }`}
                >
                  <span className="text-sm font-medium text-text-primary">{opt.label}</span>
                  <span className="text-xs text-text-secondary ml-2">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {GOAL_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGoal(opt.value)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    goal === opt.value
                      ? 'border-sage bg-sage/5'
                      : 'border-border hover:border-sage/30'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <span className="block text-xs font-medium text-text-primary mt-1">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* TDEE Display */}
          {hasBodyStats && (
            <div className="bg-sage/5 rounded-xl p-3">
              <p className="text-xs text-text-secondary">
                Your body burns approximately <span className="font-semibold text-sage">{profile?.tdee || '—'} calories</span> per day at rest
              </p>
            </div>
          )}

          {/* Save */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving || !weight || !height || !age || !gender}
            className="w-full py-2.5 bg-sage text-white rounded-xl text-sm font-medium disabled:opacity-50"
          >
            {isSaving ? 'Calculating...' : 'Calculate & Save'}
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
