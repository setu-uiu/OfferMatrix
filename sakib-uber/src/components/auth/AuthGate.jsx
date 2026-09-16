import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Car, ShieldCheck, ArrowRight, Sun, Moon, Check } from 'lucide-react';

export const AuthGate = () => {
  const { selectedAuthRole, setSelectedAuthRole, enterPortal, theme, toggleTheme } = useApp();
  const [accountInput, setAccountInput] = useState('+880 1711-234567');
  const [pinInput, setPinInput] = useState('1234');

  const handleRoleSelect = (role) => {
    setSelectedAuthRole(role);
    if (role === 'customer') {
      setAccountInput('+880 1711-234567');
    } else if (role === 'driver') {
      setAccountInput('+880 1819-987654');
    } else if (role === 'admin') {
      setAccountInput('admin@uber.com');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    enterPortal(selectedAuthRole);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-100 to-gray-50 p-4 sm:p-6 dark:from-neutral-950 dark:to-neutral-900">
      
      {/* Top Floating Theme Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="w-full max-w-lg space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-black dark:text-white">Uber</h1>
          <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-neutral-400">
            Go anywhere, get anything • Ride, Drive & Company HQ
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
          
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Select Your Portal</h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Choose how you want to sign in to the platform:</p>
          </div>

          {/* Role Cards */}
          <div className="space-y-3">
            
            {/* 1. Customer */}
            <div
              onClick={() => handleRoleSelect('customer')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 transition-all ${
                selectedAuthRole === 'customer'
                  ? 'border-black bg-gray-50 shadow-sm dark:border-white dark:bg-neutral-800'
                  : 'border-gray-200 bg-white hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Customer (Passenger)</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Book rides, apply promo codes & manage wallet</p>
                </div>
              </div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${selectedAuthRole === 'customer' ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-300'}`}>
                {selectedAuthRole === 'customer' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

            {/* 2. Driver Partner */}
            <div
              onClick={() => handleRoleSelect('driver')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 transition-all ${
                selectedAuthRole === 'driver'
                  ? 'border-black bg-gray-50 shadow-sm dark:border-white dark:bg-neutral-800'
                  : 'border-gray-200 bg-white hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Car size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Driver Partner</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Accept ride requests, track earnings & quest bonus</p>
                </div>
              </div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${selectedAuthRole === 'driver' ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-300'}`}>
                {selectedAuthRole === 'driver' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

            {/* 3. Company Admin HQ */}
            <div
              onClick={() => handleRoleSelect('admin')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 transition-all ${
                selectedAuthRole === 'admin'
                  ? 'border-black bg-gray-50 shadow-sm dark:border-white dark:bg-neutral-800'
                  : 'border-gray-200 bg-white hover:border-gray-400 dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Company Admin HQ</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">Pricing inputs, coupon manager & dispute refunds</p>
                </div>
              </div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${selectedAuthRole === 'admin' ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' : 'border-gray-300'}`}>
                {selectedAuthRole === 'admin' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300">
                {selectedAuthRole === 'admin' ? 'Admin Email / Username' : 'Mobile Number'}
              </label>
              <input
                type="text"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-900 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300">
                Security PIN Code
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={6}
                required
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-900 focus:border-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <span>
                {selectedAuthRole === 'customer' && 'Sign In as Customer (Passenger)'}
                {selectedAuthRole === 'driver' && 'Sign In as Driver Partner'}
                {selectedAuthRole === 'admin' && 'Sign In to Uber HQ Admin Panel'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* 1-Click Fast Demo Logins */}
          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-neutral-800">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              ⚡ 1-Click Fast Quick Demo Login:
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => enterPortal('customer')}
                className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-black hover:bg-black hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
              >
                🧑‍💼 Passenger Login
              </button>
              <button
                type="button"
                onClick={() => enterPortal('driver')}
                className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white"
              >
                👨‍✈️ Driver Login
              </button>
              <button
                type="button"
                onClick={() => enterPortal('admin')}
                className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-500 dark:hover:text-white"
              >
                🛡️ Admin HQ Login
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
