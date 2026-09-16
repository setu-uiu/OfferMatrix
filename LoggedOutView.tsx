import React from 'react';
import { User, Shield, ArrowRight, CheckCircle2, Lock, UtensilsCrossed } from 'lucide-react';
import { FoodiLogo } from './FoodiLogo.js';

interface LoggedOutViewProps {
  onSelectCustomerLogin: () => void;
  onSelectAdminLogin: () => void;
  onBrowseAsGuest: () => void;
}

export const LoggedOutView: React.FC<LoggedOutViewProps> = ({
  onSelectCustomerLogin,
  onSelectAdminLogin,
  onBrowseAsGuest,
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden p-6 sm:p-10 text-center">
        {/* Real Foodi Logo */}
        <div className="flex justify-center mb-6">
          <FoodiLogo size="lg" variant="full" withTagline={true} />
        </div>

        {/* Signed Out Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#ef0909] text-xs font-bold uppercase tracking-wider mb-4">
          <CheckCircle2 className="w-4 h-4 text-[#ef0909]" />
          <span>You Have Been Logged Out</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          Signed Out of Foodi
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
          Your session has safely ended. Please select which account type you would like to use to sign back in:
        </p>

        {/* Two Separate Options: Customer vs Admin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
          {/* Option 1: Customer Portal */}
          <div className="relative group border-2 border-red-100 hover:border-[#ef0909] rounded-2xl p-5 bg-gradient-to-b from-white to-red-50/30 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#ef0909] text-white flex items-center justify-center shadow-md shadow-[#ef0909]/30 mb-4">
                <User className="w-6 h-6" />
              </div>

              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-[#ef0909] mb-1.5">
                Food Delivery
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Customer Sign In
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Order biryani, burgers &amp; pizzas from top Dhaka restaurants. Track your rider on live GPS and enjoy fast delivery.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={onSelectCustomerLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#ef0909]/20 cursor-pointer transition"
              >
                <span>Sign In as Customer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-2 text-center text-[10px] text-gray-400 font-mono">
                Account: user@foodi.bd / foodi123
              </div>
            </div>
          </div>

          {/* Option 2: Admin Portal */}
          <div className="relative group border-2 border-gray-200 hover:border-[#1a1a2e] rounded-2xl p-5 bg-gradient-to-b from-white to-gray-50/50 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] text-white flex items-center justify-center shadow-md shadow-black/20 mb-4">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>

              <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 text-gray-800 mb-1.5">
                Operations &amp; Control
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Admin Portal Sign In
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Full administrative access to manage restaurants, menus, dishes, discount vouchers, delivery fleet, and live order queues.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={onSelectAdminLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-black/15 cursor-pointer transition"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In as Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-2 text-center text-[10px] text-gray-400 font-mono">
                Account: admin@foodi.bd / admin123
              </div>
            </div>
          </div>
        </div>

        {/* Guest fallback option */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-center">
          <button
            type="button"
            onClick={onBrowseAsGuest}
            className="text-xs font-semibold text-gray-600 hover:text-[#ef0909] flex items-center gap-1.5 transition cursor-pointer py-1 px-3 rounded-lg hover:bg-gray-50"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Continue browsing food catalog as guest</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
