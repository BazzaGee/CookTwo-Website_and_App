export interface BodyProfile {
  weightKg: number
  heightCm: number
  age: number
  gender: 'male' | 'female' | 'other'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose' | 'maintain' | 'gain'
}

const ACTIVITY_MULTIPLIERS: Record<BodyProfile['activityLevel'], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

const GOAL_ADJUSTMENTS: Record<BodyProfile['goal'], number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
}

export function calculateBMR(profile: BodyProfile): number {
  const { weightKg, heightCm, age, gender } = profile
  if (gender === 'female') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
}

export function calculateTDEE(profile: BodyProfile): number {
  const bmr = calculateBMR(profile)
  const tdee = bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel]
  return Math.round(tdee)
}

export function calculateTargetCalories(profile: BodyProfile): number {
  const tdee = calculateTDEE(profile)
  const adjustment = GOAL_ADJUSTMENTS[profile.goal]
  return Math.round(tdee + adjustment)
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}
