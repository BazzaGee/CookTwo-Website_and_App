import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, X, Sparkles, Package } from 'lucide-react'
import { useHousehold, type GroceryItem } from '../hooks/useHousehold'
import { useAuthStore } from '../lib/auth'
import { quickAddItems, categories } from '../lib/mockData'

const QUANTITY_UNITS = ['L', 'kg', 'lb', 'dozen', 'pack', 'can', 'bottle', 'bag']
import { AnimatedList, SlideUp } from '../components/AnimatedList'
import { SyncIndicator } from '../components/SyncIndicator'

export function ShoppingTab() {
  const { items, isConnected, addItem, checkItem, deleteItem, moveToPantry } = useHousehold()
  const { partner } = useAuthStore()
  const [newItem, setNewItem] = useState('')
  const [newQuantity, setNewQuantity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Other')
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
      addItem(parsed.name, newQuantity || parsed.quantity, selectedCategory)
      setNewItem('')
      setNewQuantity('')
      setSelectedCategory('Other')
      setShowAddForm(false)
    }
  }

  const handleQuickAdd = (name: string) => {
    addItem(name, undefined, categorizeItem(name))
  }

  const handleCheck = (id: string, checked: boolean) => {
    // Add haptic feedback if available
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50)
    }
    checkItem(id, checked)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    // Wait for animation then delete
    setTimeout(() => {
      deleteItem(id)
      setDeletingId(null)
    }, 300)
  }

  const uncheckedItems = items.filter(item => !item.checked)
  const checkedItems = items.filter(item => item.checked)

  const groupedUnchecked = groupByCategory(uncheckedItems)

  const syncStatus = isConnected ? 'synced' : 'offline'

  return (
    <div className="p-4 pb-6">
      {/* Header with Sync Status */}
      <SlideUp className="flex items-center justify-between mb-4" delay={0}>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-text-primary">Our Shopping List</h2>
          <SyncIndicator status={syncStatus} />
        </div>
        {uncheckedItems.length > 0 && (
          <motion.span 
            key={uncheckedItems.length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-sm text-text-secondary bg-white px-2 py-1 rounded-full"
          >
            {uncheckedItems.length} items
          </motion.span>
        )}
      </SlideUp>

      {/* Quick Add Chips */}
      <SlideUp className="flex flex-wrap gap-2 mb-4" delay={0.1}>
        {quickAddItems.slice(0, 6).map((item, index) => (
          <motion.button
            key={item}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAdd(item)}
            className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-text-primary hover:border-sage hover:text-sage transition-colors shadow-sm"
          >
            + {item}
          </motion.button>
        ))}
      </SlideUp>

      {/* Add Item Button */}
      <SlideUp delay={0.15}>
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
              Add Item
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
                  placeholder="What do we need?"
                  className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd()
                    if (e.key === 'Escape') setShowAddForm(false)
                  }}
                />

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">Quantity</label>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center bg-gray-50 rounded-xl border border-border">
                      <button
                        onClick={() => {
                          const n = parseInt(newQuantity) || 1
                          if (n > 1) setNewQuantity(String(n - 1))
                        }}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-sage transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        value={newQuantity || '1'}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        className="w-12 h-10 text-center text-sm border-0 focus:outline-none bg-transparent"
                      />
                      <button
                        onClick={() => {
                          const n = parseInt(newQuantity) || 1
                          setNewQuantity(String(n + 1))
                        }}
                        className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-sage transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {QUANTITY_UNITS.map((unit) => (
                        <motion.button
                          key={unit}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setNewQuantity(`${newQuantity || '1'} ${unit}`)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            newQuantity?.includes(unit)
                              ? 'bg-sage text-white'
                              : 'bg-gray-50 text-text-secondary border border-border hover:border-sage/30'
                          }`}
                        >
                          {unit}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  {newQuantity && newQuantity !== '1' && (
                    <p className="text-xs text-sage">
                      Quantity: {newQuantity}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-border rounded-xl focus:border-sage focus:outline-none text-sm bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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

      {/* Shopping List */}
      <div className="space-y-4">
        {categories.map((category, catIndex) => {
          const categoryItems = groupedUnchecked[category]
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
                    <ShoppingItemCard
                      item={item}
                      isCurrentUser={item.addedBy === partner?.name}
                      onCheck={() => handleCheck(item.id, !item.checked)}
                      onDelete={() => handleDelete(item.id)}
                      onMoveToPantry={() => moveToPantry(item.id)}
                      isDeleting={deletingId === item.id}
                    />
                  )}
                />
              </div>
            </motion.div>
          )
        })}

        {/* Empty State */}
        {uncheckedItems.length === 0 && !showAddForm && (
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
              <Sparkles className="w-10 h-10 text-sage" />
            </motion.div>
            <p className="text-lg font-medium text-text-primary mb-1">
              Your list is empty!
            </p>
            <p className="text-text-secondary text-sm">
              Add something you need to get started
            </p>
          </motion.div>
        )}

        {/* Checked Items Section */}
        <AnimatePresence>
          {checkedItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-border"
            >
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2 px-1">
                Checked ({checkedItems.length})
              </h3>
              <div className="space-y-2">
                {checkedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <ShoppingItemCard
                      item={item}
                      isCurrentUser={item.addedBy === partner?.name}
                      onCheck={() => handleCheck(item.id, !item.checked)}
                      onDelete={() => handleDelete(item.id)}
                      checked
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface ShoppingItemCardProps {
  item: GroceryItem
  isCurrentUser: boolean
  onCheck: () => void
  onDelete: () => void
  onMoveToPantry?: () => void
  checked?: boolean
  isDeleting?: boolean
}

function ShoppingItemCard({ item, isCurrentUser, onCheck, onDelete, onMoveToPantry, checked, isDeleting }: ShoppingItemCardProps) {
  return (
    <motion.div
      layout
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-3 p-3.5 bg-white rounded-xl border transition-all ${
        checked 
          ? 'border-border/50 bg-gray-50/50' 
          : 'border-border hover:border-sage/30 hover:shadow-sm'
      } ${isDeleting ? 'opacity-0' : ''}`}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onCheck}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          item.checked
            ? 'bg-sage border-sage'
            : 'border-border hover:border-sage'
        }`}
      >
        {item.checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check className="w-3.5 h-3.5 text-white" />
          </motion.div>
        )}
      </motion.button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate transition-all ${item.checked ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
          {item.name}
        </p>
        {item.quantity && (
          <p className={`text-xs ${item.checked ? 'text-text-secondary/60' : 'text-text-secondary'}`}>
            {item.quantity}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={`text-xs px-2 py-0.5 rounded-full ${
            isCurrentUser
              ? 'bg-sage/10 text-sage'
              : 'bg-terracotta/10 text-terracotta-dark'
          }`}
        >
          {item.addedBy === 'Unknown' ? 'You' : item.addedBy}
        </motion.span>
        {item.checked && onMoveToPantry && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onMoveToPantry}
            className="p-1.5 text-sage hover:text-sage-dark opacity-0 group-hover:opacity-100 transition-all"
            title="Move to pantry"
          >
            <Package className="w-4 h-4" />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-1.5 text-text-secondary hover:text-error opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

// Helper functions
function parseNaturalInput(input: string): { name: string; quantity?: string } {
  const match = input.match(/^(\d+(?:\.\d+)?)\s*(.+)/)
  if (match) {
    return { name: match[2].trim(), quantity: match[1] }
  }
  return { name: input }
}

function categorizeItem(name: string): string {
  const lower = name.toLowerCase()
  
  if (['chicken', 'beef', 'pork', 'salmon', 'tuna', 'steak', 'turkey', 'meat'].some(m => lower.includes(m))) {
    return 'Meat'
  }
  if (['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs'].some(d => lower.includes(d))) {
    return 'Dairy'
  }
  if (['spinach', 'tomato', 'lettuce', 'carrot', 'onion', 'garlic', 'avocado', 'pepper', 'cucumber', 'broccoli', 'banana', 'apple', 'fruit', 'vegetable'].some(p => lower.includes(p))) {
    return 'Produce'
  }
  if (['rice', 'pasta', 'quinoa', 'flour', 'sugar', 'oil', 'sauce', 'spice', 'cereal', 'bread', 'coffee'].some(p => lower.includes(p))) {
    return 'Pantry'
  }
  
  return 'Other'
}

function groupByCategory(items: GroceryItem[]) {
  const grouped: Record<string, GroceryItem[]> = {}
  items.forEach((item: GroceryItem) => {
    const category = item.category || 'Other'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
  })
  return grouped
}
