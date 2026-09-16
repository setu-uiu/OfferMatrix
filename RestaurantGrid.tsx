import React from 'react';
import { Star, Clock, Truck, Heart } from 'lucide-react';
import { Restaurant } from '../types.js';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  favorites: number[];
  onSelectRestaurant: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export const RestaurantGrid: React.FC<RestaurantGridProps> = ({
  restaurants,
  favorites,
  onSelectRestaurant,
  onToggleFavorite,
}) => {
  if (restaurants.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
        <div className="text-5xl mb-3">🍽️</div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No restaurants found</h3>
        <p className="text-sm text-gray-500">
          Try searching for another dish or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {restaurants.map((restaurant) => {
        const isFav = favorites.includes(restaurant.id);
        return (
          <div
            key={restaurant.id}
            onClick={() => onSelectRestaurant(restaurant.id)}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 hover:border-red-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
          >
            {/* Image Wrap */}
            <div className="relative h-44 sm:h-48 overflow-hidden bg-gray-100">
              <img
                src={restaurant.img}
                alt={restaurant.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Promo Badge */}
              {restaurant.promo && (
                <span className="absolute top-3 left-3 bg-[#ef0909] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                  {restaurant.promo}
                </span>
              )}

              {/* Time Badge */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{restaurant.time}</span>
              </div>

              {/* Favorite Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(restaurant.id);
                }}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-md cursor-pointer ${
                  isFav
                    ? 'bg-white text-[#ef0909]'
                    : 'bg-white/80 hover:bg-white text-gray-400 hover:text-[#ef0909]'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-gray-900 group-hover:text-[#ef0909] transition-colors line-clamp-1">
                  {restaurant.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                  {restaurant.cuisine}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{restaurant.rating}</span>
                </div>

                <div className="flex items-center gap-1 text-gray-500 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-gray-400" />
                  <span>{restaurant.fee === 0 ? 'Free Delivery' : `৳${restaurant.fee} fee`}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
