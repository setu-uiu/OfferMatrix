import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  ChevronDown,
  Search,
  Heart,
  ShoppingCart,
  Shield,
  User as UserIcon,
  LogOut,
  Utensils,
  Store,
  X,
  Lock,
} from 'lucide-react';
import { User, Restaurant, MenuItem } from '../types.js';
import { FoodiLogo } from './FoodiLogo.js';

interface HeaderProps {
  user: User | null;
  appMode: 'customer' | 'admin';
  cartCount: number;
  favCount: number;
  currentLocation: string;
  restaurants: Restaurant[];
  onNavigate: (view: string) => void;
  onOpenLocationModal: () => void;
  onOpenAuthModal: (role?: 'customer' | 'admin', step?: 'choose-role' | 'form') => void;
  onToggleAppMode: () => void;
  onSelectRestaurant: (id: number) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  appMode,
  cartCount,
  favCount,
  currentLocation,
  restaurants,
  onNavigate,
  onOpenLocationModal,
  onOpenAuthModal,
  onToggleAppMode,
  onSelectRestaurant,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results for restaurants and food items
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Array<
      | { type: 'restaurant'; restaurant: Restaurant }
      | { type: 'food'; restaurant: Restaurant; item: MenuItem }
    > = [];

    restaurants.forEach((r) => {
      if (r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)) {
        results.push({ type: 'restaurant', restaurant: r });
      }
      r.menu.forEach((m) => {
        if (m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)) {
          results.push({ type: 'food', restaurant: r, item: m });
        }
      });
    });

    return results.slice(0, 8);
  }, [searchQuery, restaurants]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200/80 shadow-xs">
      {/* Foodi Business Top Bar */}
      <div className="bg-[#ef0909] text-white text-xs sm:text-sm font-medium py-1.5 px-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-bold">Foodi Bangladesh:</span>
          <span>Fast food and grocery delivery across Dhaka &amp; beyond.</span>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/90 hidden md:inline">Choose Portal:</span>
              <button
                onClick={() => onOpenAuthModal('customer', 'form')}
                className="bg-white/20 hover:bg-white text-white hover:text-[#ef0909] transition px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer"
              >
                Customer Sign In
              </button>
              <button
                onClick={() => onOpenAuthModal('admin', 'form')}
                className="bg-black/30 hover:bg-black text-amber-300 transition px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                <span>Admin Portal</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/90">
                Active: <strong className="uppercase">{user.role}</strong> ({user.name})
              </span>
              <button
                onClick={onLogout}
                className="bg-white/20 hover:bg-white text-white hover:text-[#ef0909] transition px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer flex items-center gap-1"
                title="Log out and exit session"
              >
                <LogOut className="w-3 h-3" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Real Foodi Logo */}
        <div
          onClick={() => onNavigate(user?.role === 'admin' ? 'admin' : 'home')}
          className="cursor-pointer select-none shrink-0"
          title="Foodi Home"
        >
          <FoodiLogo size="md" variant="full" />
        </div>

        {/* Location Picker */}
        <button
          onClick={onOpenLocationModal}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition cursor-pointer text-left shrink-0 max-w-[210px]"
          title="Change delivery location"
        >
          <div className="w-8 h-8 rounded-full bg-red-50 text-[#ef0909] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Deliver To</div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 truncate flex items-center gap-1">
              <span className="truncate">{currentLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </div>
          </div>
        </button>

        {/* Search Bar with live autocomplete */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-1 sm:mx-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search restaurants, biriyani, burger..."
              className="w-full h-10 sm:h-11 pl-10 pr-9 bg-gray-100/80 hover:bg-gray-100 focus:bg-white text-sm text-gray-900 rounded-full border border-gray-200 focus:border-[#ef0909] focus:ring-2 focus:ring-red-100 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectRestaurant(item.restaurant.id);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-red-50/60 transition cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-[#ef0909]">
                        {item.type === 'restaurant' ? (
                          <Store className="w-4 h-4" />
                        ) : (
                          <Utensils className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {item.type === 'restaurant' ? item.restaurant.name : item.item.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {item.type === 'restaurant'
                            ? `${item.restaurant.cuisine} · ${item.restaurant.rating} ★`
                            : `${item.restaurant.name} · ৳${item.item.price}`}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No matching restaurants or dishes found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Favorites Button */}
          <button
            onClick={() => onNavigate('favorites')}
            className="relative p-2 sm:p-2.5 rounded-full hover:bg-red-50 text-gray-700 hover:text-[#ef0909] transition cursor-pointer"
            title="My Favorites"
          >
            <Heart className="w-5 h-5" />
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ef0909] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 sm:p-2.5 rounded-full hover:bg-red-50 text-gray-700 hover:text-[#ef0909] transition cursor-pointer"
            title="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ef0909] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* BEFORE SIGN IN: SEPARATE OPTIONS FOR CUSTOMER AND ADMIN */}
          {!user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Option 1: Customer Sign In */}
              <button
                onClick={() => onOpenAuthModal('customer', 'form')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-sm shadow-[#ef0909]/20"
                title="Sign in as customer to order food"
              >
                <UserIcon className="w-4 h-4" />
                <span>Customer</span>
              </button>

              {/* Option 2: Admin Portal */}
              <button
                onClick={() => onOpenAuthModal('admin', 'form')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-sm border border-[#2d2d44]"
                title="Sign in to Admin Operations Console"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          ) : (
            /* AFTER SIGN IN: USER PROFILE & LOGOUT CONTROLS */
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer border ${
                    appMode === 'admin'
                      ? 'bg-[#1a1a2e] text-white border-[#1a1a2e] shadow-xs'
                      : 'bg-white text-gray-700 hover:text-[#ef0909] border-gray-200'
                  }`}
                  title="Admin Operations Console"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              )}

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ef0909] to-[#ff6b35] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="mt-1.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-50 text-[#ef0909]'
                          }`}
                        >
                          {user.role === 'admin' ? '🛡️ Administrator' : '👤 Customer'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span>My Profile &amp; Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('favorites');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-gray-400" />
                        <span>Favorite Restaurants</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('tracking');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Track Active Order</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            onNavigate('admin');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs sm:text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2.5 cursor-pointer font-bold"
                        >
                          <Shield className="w-4 h-4 text-amber-500" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer font-bold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out &amp; Exit</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
