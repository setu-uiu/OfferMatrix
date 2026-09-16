import React from 'react';
import { Home, Heart, ShoppingBag, MapPin, User as UserIcon, Shield } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  cartCount: number;
  appMode: 'customer' | 'admin';
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  cartCount,
  appMode,
  onNavigate,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onNavigate(appMode === 'admin' ? 'admin' : 'home')}
        className={`flex flex-col items-center gap-0.5 p-1 text-xs font-bold transition cursor-pointer ${
          currentView === 'home' || currentView === 'restaurant'
            ? 'text-[#ef0909]'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => onNavigate('favorites')}
        className={`flex flex-col items-center gap-0.5 p-1 text-xs font-bold transition cursor-pointer ${
          currentView === 'favorites' ? 'text-[#ef0909]' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px]">Favorites</span>
      </button>

      <button
        onClick={() => onNavigate('cart')}
        className={`flex flex-col items-center gap-0.5 p-1 text-xs font-bold transition cursor-pointer relative ${
          currentView === 'cart' ? 'text-[#ef0909]' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#ef0909] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Cart</span>
      </button>

      <button
        onClick={() => onNavigate('tracking')}
        className={`flex flex-col items-center gap-0.5 p-1 text-xs font-bold transition cursor-pointer ${
          currentView === 'tracking' ? 'text-[#ef0909]' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[10px]">Track</span>
      </button>

      {appMode === 'admin' ? (
        <button
          onClick={() => onNavigate('admin')}
          className={`flex flex-col items-center gap-0.5 p-1 text-xs font-bold transition cursor-pointer ${
            currentView === 'admin' ? 'text-amber-500' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      ) : (
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center gap-0.5 p-1 text-xs font-bold transition cursor-pointer ${
            currentView === 'profile' ? 'text-[#ef0909]' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      )}
    </nav>
  );
};
