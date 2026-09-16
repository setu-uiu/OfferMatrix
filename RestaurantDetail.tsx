import React from 'react';
import {
  ArrowLeft,
  Star,
  Clock,
  Truck,
  Heart,
  Plus,
  Minus,
  Flame,
  Info,
} from 'lucide-react';
import { Restaurant, MenuItem, CartItem } from '../types.js';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  cart: CartItem[];
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (restaurant: Restaurant, item: MenuItem) => void;
  onUpdateCartQty: (itemId: number, delta: number) => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  cart,
  isFavorite,
  onBack,
  onToggleFavorite,
  onAddToCart,
  onUpdateCartQty,
}) => {
  const getItemCartQty = (itemId: number) => {
    const found = cart.find((c) => c.itemId === itemId);
    return found ? found.qty : 0;
  };

  const popularItems = restaurant.menu.filter((m) => m.popular);
  const regularItems = restaurant.menu.filter((m) => !m.popular);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-[#ef0909] hover:text-[#d80707] transition cursor-pointer p-1 -ml-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Restaurants</span>
      </button>

      {/* Restaurant Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <div className="h-56 sm:h-72 w-full relative">
          <img
            src={restaurant.img}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Floating Details Card */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            {restaurant.promo && (
              <span className="inline-block bg-[#ef0909] text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {restaurant.promo}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {restaurant.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 font-medium">
              {restaurant.cuisine}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{restaurant.rating} Rating</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>{restaurant.time}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full font-bold">
                <Truck className="w-3.5 h-3.5" />
                <span>{restaurant.fee === 0 ? 'Free Delivery' : `৳${restaurant.fee} Delivery Fee`}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleFavorite(restaurant.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-lg shrink-0 ${
              isFavorite
                ? 'bg-white text-[#ef0909]'
                : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-xs'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-8 pt-2">
        {/* Popular Section */}
        {popularItems.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <Flame className="w-5 h-5 text-[#ef0909]" />
              <h3 className="text-lg font-bold text-gray-900">
                Most Popular Dishes
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  qty={getItemCartQty(item.id)}
                  onAdd={() => onAddToCart(restaurant, item)}
                  onUpdateQty={(d) => onUpdateCartQty(item.id, d)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Regular Menu Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <h3 className="text-lg font-bold text-gray-900">
              All Menu Items
            </h3>
            <span className="text-xs font-semibold text-gray-500">
              ({restaurant.menu.length} items)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(regularItems.length > 0 ? regularItems : restaurant.menu).map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                qty={getItemCartQty(item.id)}
                onAdd={() => onAddToCart(restaurant, item)}
                onUpdateQty={(d) => onUpdateCartQty(item.id, d)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onUpdateQty: (delta: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  qty,
  onAdd,
  onUpdateQty,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-md transition flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-bold text-gray-900">{item.name}</h4>
          {item.popular && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
              Bestseller
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {item.desc || 'Prepared freshly with authentic local spices.'}
        </p>
        <div className="text-base font-black text-[#ef0909] mt-2.5">
          ৳{item.price}
        </div>
      </div>

      <div className="shrink-0 flex items-center">
        {qty > 0 ? (
          <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => onUpdateQty(-1)}
              className="w-7 h-7 rounded-md bg-white hover:bg-red-50 text-gray-800 hover:text-[#ef0909] flex items-center justify-center cursor-pointer shadow-xs transition"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-gray-900">
              {qty}
            </span>
            <button
              onClick={() => onUpdateQty(1)}
              className="w-7 h-7 rounded-md bg-[#ef0909] hover:bg-[#d80707] text-white flex items-center justify-center cursor-pointer shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-lg bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-[#ef0909]/20 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
