import { ShoppingBag } from 'lucide-react';
import { CATEGORIES, type GroceryItem } from '../types/grocery';
import { CategorySection } from './CategorySection';

interface Props {
  items: GroceryItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveToPantry: () => void;
  isMovingToPantry: boolean;
}

export function ShoppingList({ items, onToggle, onDelete, onMoveToPantry, isMovingToPantry }: Props) {
  const checkedItems = items.filter((i) => i.isChecked);
  const checkedFoodCount = checkedItems.filter((i) => i.isFood).length;
  const checkedNonFoodCount = checkedItems.filter((i) => !i.isFood).length;

  return (
    <div>
      {CATEGORIES.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        if (categoryItems.length === 0) return null;
        return (
          <CategorySection
            key={category}
            category={category}
            items={categoryItems}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        );
      })}

      {checkedItems.length > 0 && (
        <div className="mt-4 mb-2">
          <button
            type="button"
            onClick={onMoveToPantry}
            disabled={isMovingToPantry}
            className="w-full flex items-center justify-center gap-2 bg-sage/10 border border-sage/20 text-sage-dark rounded-2xl px-5 py-3 text-base font-medium hover:bg-sage/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <ShoppingBag size={18} />
            {isMovingToPantry ? (
              'Moving items…'
            ) : (
              <>
                Done shopping
                {checkedFoodCount > 0 && ` · ${checkedFoodCount} food item${checkedFoodCount > 1 ? 's' : ''} → pantry`}
                {checkedNonFoodCount > 0 && ` · ${checkedNonFoodCount} non-food removed`}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
