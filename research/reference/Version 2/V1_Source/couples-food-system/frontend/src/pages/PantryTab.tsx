import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Package } from 'lucide-react'
import { useHousehold, type PantryItem } from '../hooks/useHousehold'
import { AnimatedList, SlideUp } from '../components/AnimatedList'
import { SyncIndicator } from '../components/SyncIndicator'

const categories = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Other']

export function PantryTab() {
  const { pantryItems, isConnected, addPantryItem, deletePantryItem } = useHousehold()
  const [newItem, setNewItem] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showAddForm && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showAddForm])

  const handleAdd = () => {
    if (newItem.trim()) {
      const parsed = parseNaturalInput(newItem.trim())
      for (const item of parsed) {
        addPantryItem(item.name, item.quantity, categorizeItem(item.name))
      }
      setNewItem('')
      setShowAddForm(false)
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    setTimeout(() => {
      deletePantryItem(id)
      setDeletingId(null)
    }, 300)
  }

  const grouped = groupByCategory(pantryItems)

  const syncStatus = isConnected ? 'synced' : 'offline'

  return (
    <div className="p-4 pb-6">
      <SlideUp className="flex items-center justify-between mb-4" delay={0}>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-text-primary">Our Kitchen</h2>
          <SyncIndicator status={syncStatus} />
        </div>
        {pantryItems.length > 0 && (
          <motion.span
            key={pantryItems.length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm text-text-secondary bg-white px-2 py-1 rounded-full"
          >
            {pantryItems.length} items
          </motion.span>
        )}
      </SlideUp>

      <SlideUp delay={0.1}>
        <AnimatePresence mode="wait">
          {!showAddForm ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="w-full py-3.5 px-4 bg-sage text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-sage-dark transition-colors mb-4 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Ingredients
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white rounded-2xl p-4 border border-border shadow-lg mb-4"
            >
              <div className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder='e.g., "chicken, 2 cups rice, spinach"'
                  className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd()
                    if (e.key === 'Escape') setShowAddForm(false)
                  }}
                />
                <p className="text-xs text-text-secondary">
                  Separate items with commas to add multiple at once
                </p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    disabled={!newItem.trim()}
                    className="flex-1 py-2.5 bg-sage text-white rounded-xl font-medium hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-2 text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SlideUp>

      <div className="space-y-4">
        {categories.map((category, catIndex) => {
          const categoryItems = grouped[category]
          if (!categoryItems || categoryItems.length === 0) return null

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + catIndex * 0.1 }}
            >
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 px-1">
                {category}
              </h3>
              <div className="space-y-2">
                <AnimatedList
                  items={categoryItems}
                  keyExtractor={(item) => item.id}
                  renderItem={(item) => (
                    <PantryItemCard
                      item={item}
                      onDelete={() => handleDelete(item.id)}
                      isDeleting={deletingId === item.id}
                    />
                  )}
                />
              </div>
            </motion.div>
          )
        })}

        {pantryItems.length === 0 && !showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-sage/10 flex items-center justify-center"
            >
              <Package className="w-10 h-10 text-sage" />
            </motion.div>
            <p className="text-lg font-medium text-text-primary mb-1">
              Your pantry is empty
            </p>
            <p className="text-text-secondary text-sm">
              Add ingredients you already have at home
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface PantryItemCardProps {
  item: PantryItem
  onDelete: () => void
  isDeleting?: boolean
}

function PantryItemCard({ item, onDelete, isDeleting }: PantryItemCardProps) {
  return (
    <motion.div
      layout
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-3 p-3.5 bg-white rounded-xl border border-border hover:border-sage/30 hover:shadow-sm transition-all ${
        isDeleting ? 'opacity-0' : ''
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
        <Package className="w-4 h-4 text-sage" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary truncate">{item.name}</p>
        {item.quantity && (
          <p className="text-xs text-text-secondary">{item.quantity}</p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDelete}
        className="p-1.5 text-text-secondary hover:text-error opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

function parseNaturalInput(input: string): { name: string; quantity?: string }[] {
  const parts = input.split(',').map((p) => p.trim()).filter(Boolean)
  return parts.map((part) => {
    const match = part.match(/^(\d+(?:\.\d+)?\s*(?:cups?|tbsp|tsp|lbs?|oz|kg|g|ml|l)?\s*)?(.+)?/)
    if (match && match[2]) {
      return { name: match[2].trim(), quantity: match[1]?.trim() || undefined }
    }
    return { name: part }
  })
}

function categorizeItem(name: string): string {
  const lower = name.toLowerCase()

  if (['chicken', 'beef', 'pork', 'salmon', 'tuna', 'steak', 'turkey', 'meat'].some((m) => lower.includes(m))) {
    return 'Meat'
  }
  if (['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs'].some((d) => lower.includes(d))) {
    return 'Dairy'
  }
  if (['spinach', 'tomato', 'lettuce', 'carrot', 'onion', 'garlic', 'avocado', 'pepper', 'cucumber', 'broccoli', 'banana', 'apple', 'fruit', 'vegetable', 'rice', 'rice,', 'spin'].some((p) => lower.includes(p))) {
    return 'Produce'
  }
  if (['rice', 'pasta', 'quinoa', 'flour', 'sugar', 'oil', 'sauce', 'spice', 'cereal', 'bread', 'coffee'].some((p) => lower.includes(p))) {
    return 'Pantry'
  }

  return 'Other'
}

function groupByCategory(items: PantryItem[]) {
  const grouped: Record<string, PantryItem[]> = {}
  items.forEach((item) => {
    const category = item.category || 'Other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
  })
  return grouped
}
