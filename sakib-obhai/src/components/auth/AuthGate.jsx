import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Car, ShieldCheck, ArrowRight, Sun, Moon, Check, Sparkles } from 'lucide-react';

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
      setAccountInput('admin@obhai.com');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    enterPortal(selectedAuthRole);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-emerald-50 via-gray-50 to-gray-100 p-4 sm:p-6 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      
      {/* Top Floating Theme Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-sm transition hover:bg-emerald-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="w-full max-w-lg space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white font-black text-xl shadow-md">
              ও
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-950 dark:text-white">
              OBHAI <span className="text-emerald-700 dark:text-emerald-400">ওভাই</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-neutral-400">
            ডিজিটাল সিএনজি মিটার, বাইক, প্রাইম কার ও জরুরি সেবা • ঢাকা
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl sm:p-8 dark:border-neutral-800 dark:bg-neutral-900">
          
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">আপনার পোর্টাল নির্বাচন করুন</h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400">লগইন করতে যেকোনো একটি রোল নির্বাচন করুন:</p>
          </div>

          {/* Role Cards */}
          <div className="space-y-3">
            
            {/* 1. Customer */}
            <div
              onClick={() => handleRoleSelect('customer')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 transition-all ${
                selectedAuthRole === 'customer'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm dark:border-emerald-400 dark:bg-neutral-800'
                  : 'border-gray-200 bg-white hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white font-bold text-lg shadow-sm">
                  👤
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">ওভাই যাত্রী (Passenger)</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">সিএনজি ও কার বুকিং, প্রোমো কোড ও ওয়ালেট</p>
                </div>
              </div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${selectedAuthRole === 'customer' ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-gray-300'}`}>
                {selectedAuthRole === 'customer' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

            {/* 2. Driver Partner */}
            <div
              onClick={() => handleRoleSelect('driver')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 transition-all ${
                selectedAuthRole === 'driver'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm dark:border-emerald-400 dark:bg-neutral-800'
                  : 'border-gray-200 bg-white hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-600 text-white font-bold text-lg shadow-sm">
                  👨‍✈️
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">ওভাই ক্যাপ্টেন / চালক</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">ট্রিপ গ্রহণ, ডিজিটাল মিটার ও দৈনিক ইনকাম</p>
                </div>
              </div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${selectedAuthRole === 'driver' ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-gray-300'}`}>
                {selectedAuthRole === 'driver' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

            {/* 3. Company Admin HQ */}
            <div
              onClick={() => handleRoleSelect('admin')}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3.5 transition-all ${
                selectedAuthRole === 'admin'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm dark:border-emerald-400 dark:bg-neutral-800'
                  : 'border-gray-200 bg-white hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white font-bold text-lg shadow-sm dark:bg-emerald-950">
                  🛡️
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">ওভাই হেডকোয়ার্টার অ্যাডমিন</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">প্রাইসিং কন্ট্রোল, কুপন তৈরি ও রিফান্ড ম্যানেজমেন্ট</p>
                </div>
              </div>
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${selectedAuthRole === 'admin' ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-gray-300'}`}>
                {selectedAuthRole === 'admin' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300">
                {selectedAuthRole === 'admin' ? 'অ্যাডমিন ইমেইল / ইউজারনেম' : 'মোবাইল নম্বর'}
              </label>
              <input
                type="text"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-neutral-300">
                সিকিউরিটি পিন কোড
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                maxLength={6}
                required
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <span>
                {selectedAuthRole === 'customer' && 'যাত্রী হিসেবে প্রবেশ করুন'}
                {selectedAuthRole === 'driver' && 'ক্যাপ্টেন ড্যাশবোর্ডে প্রবেশ করুন'}
                {selectedAuthRole === 'admin' && 'অ্যাডমিন হেডকোয়ার্টারে প্রবেশ করুন'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* 1-Click Fast Demo Logins */}
          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-neutral-800">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
              ⚡ এক-ক্লিকে সরাসরি ডেমো লগইন:
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => enterPortal('customer')}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-700 hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                🧑‍💼 যাত্রী লগইন
              </button>
              <button
                type="button"
                onClick={() => enterPortal('driver')}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 transition hover:bg-amber-600 hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                👨‍✈️ ক্যাপ্টেন লগইন
              </button>
              <button
                type="button"
                onClick={() => enterPortal('admin')}
                className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-800 transition hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                🛡️ অ্যাডমিন HQ
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
