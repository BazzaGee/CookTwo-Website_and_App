import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, Clock, Flame, Plus, ShoppingBag, Sparkles, Loader2, Calendar, AlertTriangle, X } from 'lucide-react'
import { useCachedMealPlan, useGenerateMeal } from '../hooks/useMealPlan'
import { useHousehold } from '../hooks/useHousehold'
import { AnimatedCard, SlideUp } from '../components/AnimatedList'
import { WeekCalendar } from '../components/WeekCalendar'

export function MealPlanTab() {
  const { pantryItems, addItem, bulkAddItems } = useHousehold()
  const { data, isLoading } = useCachedMealPlan()
  const generateMeal = useGenerateMeal()
  const [showMissing, setShowMissing] = useState(false)
  const [mode, setMode] = useState<'single' | 'week'>('single')
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false)

  const meal = data?.meal
  const isGenerating = generateMeal.isPending

  const handleGenerate = () => {
    generateMeal.mutate(pantryItems.map((i) => ({ name: i.name, quantity: i.quantity })))
  }

  const handleGenerateWeek = async () => {
    setIsGeneratingWeek(true)
    try {
      for (let i = 0; i < 7; i++) {
        await generateMeal.mutateAsync(pantryItems.map((p) => ({ name: p.name, quantity: p.quantity })))
      }
    } finally {
      setIsGeneratingWeek(false)
    }
  }

  const handleAddMissing = () => {
    if (!meal) return
    const missing = meal.ingredients.filter((i) => !i.inPantry)
    for (const ingredient of missing) {
      addItem(ingredient.name, ingredient.quantity)
    }
    setShowMissing(false)
  }

  const handlePopulateGrocery = () => {
    if (!meal) return
    const missing = meal.ingredients.filter((i) => !i.inPantry)
    bulkAddItems(missing.map((i) => ({ name: i.name, quantity: i.quantity })))
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 pb-6">
      {/* Mode Toggle */}
      <SlideUp delay={0}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Meal Plan</h2>
          <div className="flex bg-white rounded-xl border border-border p-0.5">
            <button
              onClick={() => setMode('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'single' ? 'bg-sage text-white' : 'text-text-secondary'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 inline mr-1" />
              Single
            </button>
            <button
              onClick={() => setMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'week' ? 'bg-sage text-white' : 'text-text-secondary'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              Week
            </button>
          </div>
        </div>
      </SlideUp>

      {/* Error Banner */}
      <AnimatePresence>
        {generateMeal.isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 bg-error/10 border border-error/20 rounded-xl p-3 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-error font-medium">Could not generate meal</p>
              <p className="text-xs text-error/80 mt-0.5">{generateMeal.error?.message || 'Something went wrong'}</p>
            </div>
            <div className="flex gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                className="px-2 py-1 bg-error text-white rounded-lg text-xs font-medium"
              >
                Retry
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => generateMeal.reset()}
                className="p-1 text-error/60 hover:text-error"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {mode === 'single' && (
          <motion.div
            key="single"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {!meal && !isGenerating && (
              <div className="text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-sage/10 flex items-center justify-center"
                >
                  <ChefHat className="w-10 h-10 text-sage" />
                </motion.div>
                <h2 className="text-xl font-bold text-text-primary mb-2">What should we cook?</h2>
                <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">
                  We&apos;ll suggest a meal based on what you have and your dietary preferences
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  className="px-6 py-3.5 bg-sage text-white rounded-2xl font-medium flex items-center gap-2 mx-auto shadow-md"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate a Meal
                </motion.button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 mx-auto mb-4"
                >
                  <Loader2 className="w-12 h-12 text-sage" />
                </motion.div>
                <h2 className="text-lg font-semibold text-text-primary mb-1">Thinking of something delicious...</h2>
                <p className="text-text-secondary text-sm">This takes a few seconds</p>
              </div>
            )}

            {meal && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SlideUp delay={0}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-text-primary">Tonight&apos;s Dinner</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerate}
                      className="px-3 py-1.5 bg-sage/10 text-sage rounded-full text-xs font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      New
                    </motion.button>
                  </div>
                </SlideUp>

                <AnimatedCard delay={0.1}>
                  <div className="bg-white rounded-2xl border border-border overflow-hidden">
                    <div className="bg-gradient-to-br from-sage/20 to-terracotta/10 p-4">
                      <h3 className="text-lg font-bold text-text-primary">{meal.name}</h3>
                      <p className="text-sm text-text-secondary mt-1">{meal.description}</p>
                      <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <Clock className="w-3.5 h-3.5" />
                          {meal.timeEstimate} min
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                          <Flame className="w-3.5 h-3.5" />
                          {meal.caloriesPerServing} cal
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-b border-border">
                      <div className="p-3 text-center border-r border-border">
                        <p className="text-lg font-bold text-sage">{meal.protein}g</p>
                        <p className="text-xs text-text-secondary">Protein</p>
                      </div>
                      <div className="p-3 text-center border-r border-border">
                        <p className="text-lg font-bold text-terracotta">{meal.carbs}g</p>
                        <p className="text-xs text-text-secondary">Carbs</p>
                      </div>
                      <div className="p-3 text-center">
                        <p className="text-lg font-bold text-text-primary">{meal.fat}g</p>
                        <p className="text-xs text-text-secondary">Fat</p>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-text-primary text-sm">Ingredients</h4>
                        {meal.ingredients.some((i) => !i.inPantry) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowMissing(!showMissing)}
                            className="text-xs text-sage font-medium flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Missing: {meal.ingredients.filter((i) => !i.inPantry).length}
                          </motion.button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {meal.ingredients.map((ingredient, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${ingredient.inPantry ? 'bg-sage' : 'bg-terracotta'}`} />
                              <span className="text-text-primary">{ingredient.name}</span>
                            </div>
                            <span className="text-text-secondary text-xs">{ingredient.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <AnimatePresence>
                        {showMissing && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-border"
                          >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleAddMissing}
                              className="w-full py-2.5 bg-sage text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add Missing to Shopping List
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="p-4 border-t border-border">
                      <h4 className="font-semibold text-text-primary text-sm mb-3">Steps</h4>
                      <div className="space-y-3">
                        {meal.steps.map((step, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-sage">{idx + 1}</span>
                            </div>
                            <p className="text-sm text-text-secondary flex-1">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            )}
          </motion.div>
        )}

        {mode === 'week' && (
          <motion.div
            key="week"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <WeekCalendar
              weekPlan={null}
              onGenerateWeek={handleGenerateWeek}
              isGenerating={isGeneratingWeek}
              onPopulateGrocery={handlePopulateGrocery}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
