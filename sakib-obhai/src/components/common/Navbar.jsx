import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, LogOut, Shield, User, Car } from 'lucide-react';

export const Navbar = () => {
  const { currentScreen, theme, toggleTheme, logOutToGate, customer, driver } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-700 text-white font-black text-sm shadow-sm">
              ও
            </div>
            <span className="text-xl font-black tracking-tight text-emerald-950 dark:text-white">OBHAI ওভাই</span>
            {currentScreen === 'admin' && (
              <span className="rounded-full bg-emerald-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                HQ অ্যাডমিন
              </span>
            )}
            {currentScreen === 'driver' && (
              <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                ক্যাপ্টেন ড্যাশবোর্ড
              </span>
            )}
            {currentScreen === 'customer' && (
              <span className="hidden rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 sm:inline-block dark:bg-emerald-950 dark:text-emerald-300">
                ঢাকা মেট্রো রাইড
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/50 text-emerald-800 transition hover:bg-emerald-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-3 py-1 text-xs font-semibold text-emerald-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            {currentScreen === 'admin' && (
              <>
                <Shield size={14} className="text-emerald-700 dark:text-emerald-400" />
                <span>Super Admin</span>
              </>
            )}
            {currentScreen === 'driver' && (
              <>
                <span className="text-amber-600 font-bold">👨‍✈️</span>
                <span>{driver.name.split('(')[0]} (★ ৪.৯৫)</span>
              </>
            )}
            {currentScreen === 'customer' && (
              <>
                <User size={14} className="text-emerald-700 dark:text-emerald-400" />
                <span>{customer.name.split('(')[0]}</span>
              </>
            )}
          </div>

          {/* Log Out Button */}
          <button
            onClick={logOutToGate}
            className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60"
            title="লগ আউট"
          >
            <LogOut size={13} />
            <span>লগ আউট</span>
          </button>

        </div>
      </div>
    </header>
  );
};
