import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Restaurant } from '../types.js';
import { RestaurantGrid } from './RestaurantGrid.js';

interface FavoritesViewProps {
  restaurants: Restaurant[];
  favorites: number[];
  onSelectRestaurant: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onBackHome: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  restaurants,
  favorites,
  onSelectRestaurant,
  onToggleFavorite,
  onBackHome,
}) => {
  const favoriteRestaurants = restaurants.filter((r) => favorites.includes(r.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ef0909] hover:underline mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-[#ef0909] fill-[#ef0909]" />
            <span>My Favorite Restaurants ({favoriteRestaurants.length})</span>
          </h2>
        </div>
      </div>

      {favoriteRestaurants.length > 0 ? (
        <RestaurantGrid
          restaurants={favoriteRestaurants}
          favorites={favorites}
          onSelectRestaurant={onSelectRestaurant}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#ef0909] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Favorites Saved Yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            Tap the heart icon on any restaurant to save it here for fast re-ordering.
          </p>
          <button
            onClick={onBackHome}
            className="px-6 py-3 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-sm shadow-md shadow-[#ef0909]/20 transition cursor-pointer"
          >
            Browse Restaurants
          </button>
        </div>
      )}
    </div>
  );
};
