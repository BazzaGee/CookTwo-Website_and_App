import { motion } from 'framer-motion'
import { UtensilsCrossed } from 'lucide-react'
import type { Meal } from '../hooks/useHousehold'

interface PlatingViewProps {
  meal: Meal & { id: string }
  partnerA: { name: string; targetCalories: number; portion?: string }
  partnerB: { name: string; targetCalories: number; portion?: string }
}

export function PlatingView({ meal, partnerA, partnerB }: PlatingViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <UtensilsCrossed className="w-5 h-5 text-terracotta" />
        <h3 className="font-bold text-text-primary">One Recipe, Two Plates</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Partner A */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-sage/10 to-sage/5 rounded-2xl p-4 border border-sage/20"
        >
          <div className="text-center mb-3">
            <h4 className="font-bold text-text-primary">{partnerA.name}&apos;s Plate</h4>
            <p className="text-xs text-text-secondary">
              Target: {partnerA.targetCalories} cal
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {meal.ingredients.map((ing, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-text-primary">{ing.name}</span>
                <span className="text-text-secondary text-xs">{ing.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-sage/20">
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              <div>
                <p className="font-bold text-sage">{meal.protein}g</p>
                <p className="text-text-secondary">Protein</p>
              </div>
              <div>
                <p className="font-bold text-sage">{meal.carbs}g</p>
                <p className="text-text-secondary">Carbs</p>
              </div>
              <div>
                <p className="font-bold text-sage">{meal.fat}g</p>
                <p className="text-text-secondary">Fat</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Partner B */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-terracotta/10 to-terracotta/5 rounded-2xl p-4 border border-terracotta/20"
        >
          <div className="text-center mb-3">
            <h4 className="font-bold text-text-primary">{partnerB.name}&apos;s Plate</h4>
            <p className="text-xs text-text-secondary">
              Target: {partnerB.targetCalories} cal
            </p>
          </div>
          <div className="space-y-2 text-sm">
            {meal.ingredients.map((ing, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-text-primary">{ing.name}</span>
                <span className="text-text-secondary text-xs">{ing.quantity}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-terracotta/20">
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              <div>
                <p className="font-bold text-terracotta-dark">{meal.protein}g</p>
                <p className="text-text-secondary">Protein</p>
              </div>
              <div>
                <p className="font-bold text-terracotta-dark">{meal.carbs}g</p>
                <p className="text-text-secondary">Carbs</p>
              </div>
              <div>
                <p className="font-bold text-terracotta-dark">{meal.fat}g</p>
                <p className="text-text-secondary">Fat</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
