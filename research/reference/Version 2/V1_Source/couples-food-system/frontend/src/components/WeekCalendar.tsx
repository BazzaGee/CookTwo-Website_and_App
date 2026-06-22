import { motion } from 'framer-motion'
import { ChevronRight, ChefHat } from 'lucide-react'
import type { Meal } from '../hooks/useHousehold'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MEALS = ['Breakfast', 'Lunch', 'Dinner']

interface WeekPlan {
  [day: string]: {
    [meal: string]: Meal & { id: string }
  }
}

interface WeekCalendarProps {
  weekPlan: WeekPlan | null
  onGenerateWeek: () => void
  isGenerating: boolean
  onPopulateGrocery: () => void
}

export function WeekCalendar({ weekPlan, onGenerateWeek, isGenerating, onPopulateGrocery }: WeekCalendarProps) {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))

  const weekDates = DAYS.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  if (!weekPlan && !isGenerating) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage/10 flex items-center justify-center"
        >
          <ChefHat className="w-8 h-8 text-sage" />
        </motion.div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Plan Your Week</h3>
        <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">
          Generate a full week of meals based on your pantry and preferences
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGenerateWeek}
          className="px-6 py-3 bg-sage text-white rounded-2xl font-medium shadow-md"
        >
          Generate Week
        </motion.button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 mx-auto mb-4"
        >
          <ChevronRight className="w-10 h-10 text-sage" />
        </motion.div>
        <p className="text-text-primary font-medium">Generating your week...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Week Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {weekDates.map((d, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs ${
                d.toDateString() === today.toDateString()
                  ? 'bg-sage text-white font-bold'
                  : 'bg-white text-text-secondary'
              }`}
            >
              <span className="text-[10px] uppercase">{DAYS[i]}</span>
              <span>{d.getDate()}</span>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPopulateGrocery}
          className="px-3 py-2 bg-terracotta/10 text-terracotta-dark rounded-xl text-xs font-medium"
        >
          Populate List
        </motion.button>
      </div>

      {/* Meal Grid */}
      <div className="space-y-2">
        {MEALS.map((mealType) => (
          <div key={mealType}>
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1 px-1">
              {mealType}
            </h4>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((day) => {
                const meal = weekPlan?.[day]?.[mealType]
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg p-1 flex items-center justify-center text-center text-xs ${
                      meal
                        ? 'bg-sage/10 text-text-primary cursor-pointer'
                        : 'bg-gray-50 text-gray-300'
                    }`}
                  >
                    {meal ? (
                      <span className="line-clamp-2 leading-tight truncate">
                        {meal.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    ) : (
                      <span className="text-lg">+</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
