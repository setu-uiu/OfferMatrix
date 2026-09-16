import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, LogOut, Shield, User, Car } from 'lucide-react';

export const Navbar = () => {
  const { currentScreen, theme, toggleTheme, logOutToGate, customer, driver } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-black dark:text-white">Uber</span>
            {currentScreen === 'admin' && (
              <span className="rounded-full bg-black px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white dark:bg-white dark:text-black">
                ADMIN HQ
              </span>
            )}
            {currentScreen === 'driver' && (
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                DRIVER PARTNER
              </span>
            )}
            {currentScreen === 'customer' && (
              <span className="hidden rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 sm:inline-block dark:bg-neutral-800 dark:text-neutral-300">
                DHAKA PLATFORM
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            {currentScreen === 'admin' && (
              <>
                <Shield size={14} className="text-emerald-600" />
                <span>Super Admin</span>
              </>
            )}
            {currentScreen === 'driver' && (
              <>
                <Car size={14} className="text-blue-600" />
                <span>{driver.name} (★ 4.95)</span>
              </>
            )}
            {currentScreen === 'customer' && (
              <>
                <User size={14} className="text-black dark:text-white" />
                <span>{customer.name}</span>
              </>
            )}
          </div>

          {/* Log Out Button */}
          <button
            onClick={logOutToGate}
            className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60"
            title="Log Out to Auth Gate"
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>

        </div>
      </div>
    </header>
  );
};
