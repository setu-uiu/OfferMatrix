import React from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Clock,
  LogOut,
  Heart,
  MapPin,
  Shield,
  ShoppingBag,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { User, OrderHistoryItem } from '../types.js';
import { FoodiLogo } from './FoodiLogo.js';

interface ProfileViewProps {
  user: User | null;
  orderHistory: OrderHistoryItem[];
  favCount: number;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onTrackOrder: (orderId: string) => void;
  onOpenAuthModal?: (role?: 'customer' | 'admin', step?: 'choose-role' | 'form') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  orderHistory,
  favCount,
  onNavigate,
  onLogout,
  onTrackOrder,
  onOpenAuthModal,
}) => {
  // If user is not logged in, show clear Sign In Portal gate
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg">
          <div className="flex justify-center mb-5">
            <FoodiLogo size="md" variant="full" withTagline={true} />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#ef0909] flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Please sign in to view your profile details, past orders, and saved addresses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => onOpenAuthModal?.('customer', 'form')}
              className="p-3.5 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#ef0909]/20 transition"
            >
              <UserIcon className="w-4 h-4" />
              <span>Customer Sign In</span>
            </button>

            <button
              onClick={() => onOpenAuthModal?.('admin', 'form')}
              className="p-3.5 rounded-xl bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-black/15 transition"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="text-xs text-gray-500 hover:text-gray-900 font-semibold cursor-pointer underline"
          >
            Return to browse restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        {/* Cover Artwork */}
        <div className="h-28 bg-gradient-to-r from-[#ef0909] via-[#ff6b35] to-[#1a1a2e]" />

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg shrink-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#ef0909] to-[#ff6b35] text-white font-extrabold text-2xl flex items-center justify-center">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-gray-900">
                    {user.name || 'Foodi Member'}
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-red-50 text-[#ef0909]'
                    }`}
                  >
                    {user.role === 'admin' ? '🛡️ Administrator' : '👤 Customer'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Dhaka, Bangladesh</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-4 py-2 rounded-xl bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#ef0909] font-bold text-xs flex items-center gap-2 cursor-pointer transition shrink-0"
                title="Log out and exit from Foodi"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user.email || 'user@foodi.bd'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{user.phone || '01712345678'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('favorites')}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-red-200 hover:shadow-md transition text-left cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#ef0909] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Saved Favorites</div>
              <div className="text-xs text-gray-500">{favCount} restaurants saved</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('cart')}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-red-200 hover:shadow-md transition text-left cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Shopping Cart</div>
              <div className="text-xs text-gray-500">View active items</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('tracking')}
          className="p-4 rounded-xl bg-white border border-gray-200 hover:border-red-200 hover:shadow-md transition text-left cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Live Delivery</div>
              <div className="text-xs text-gray-500">Track current order on GPS</div>
            </div>
          </div>
        </button>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#ef0909]" />
          <span>Past Orders ({orderHistory.length})</span>
        </h3>

        {orderHistory.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orderHistory.map((item) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {item.restaurantName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      Delivered
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.items.join(', ')}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                    Order #{item.id} · {item.date}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-gray-900">
                    ৳{item.total}
                  </span>
                  <button
                    onClick={() => onTrackOrder(item.id)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#ef0909] text-xs font-bold text-gray-700 hover:text-[#ef0909] transition cursor-pointer flex items-center gap-1"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 text-xs">
            No past orders recorded yet. Order your first meal to see your receipt history here!
          </div>
        )}
      </div>
    </div>
  );
};
