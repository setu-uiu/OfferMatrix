import React from 'react';
import { INITIAL_CATEGORIES } from '../data/initialData.js';

interface CategoryListProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  All: '🍽️',
  Biriyani: '🍚',
  Bengali: '🐟',
  Kebab: '🍢',
  Burger: '🍔',
  Pizza: '🍕',
  Chinese: '🥡',
  Thai: '🍜',
  Sushi: '🍣',
  Dessert: '🍰',
  Healthy: '🥗',
  Paratha: '🫓',
  Mughlai: '👑',
  'Street Food': '🥪',
};

export const CategoryList: React.FC<CategoryListProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          Browse by Category
        </h3>
        <span className="text-xs font-semibold text-gray-500">
          {INITIAL_CATEGORIES.length} Cuisines
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {INITIAL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border select-none ${
                isActive
                  ? 'bg-[#ef0909] text-white border-[#ef0909] shadow-md shadow-red-500/20 scale-[1.02]'
                  : 'bg-white text-gray-700 hover:text-gray-900 border-gray-200 hover:border-gray-300'
              }`}
            >
              <span>{CATEGORY_ICONS[cat] || '🍲'}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
