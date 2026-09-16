import React from 'react';
import { useApp } from '../../context/AppContext';
import { Power, MapPin, Navigation, Award, DollarSign, CheckCircle2, Star, Gauge } from 'lucide-react';

export const DriverPortal = () => {
  const { driver, toggleDriverOnline, acceptDriverTrip, route } = useApp();

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-2xl text-white shadow-md">
            👨‍✈️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{driver.name}</h2>
              <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                <Star size={12} fill="currentColor" /> 4.95
              </span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold">
              {driver.vehicle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">বর্তমান অবস্থা</span>
            <div className={`text-sm font-extrabold ${driver.isOnline ? 'text-emerald-600' : 'text-gray-400'}`}>
              {driver.isOnline ? '● অনলাইন (সক্রিয়)' : '○ অফলাইন'}
            </div>
          </div>

          <button
            onClick={toggleDriverOnline}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black text-white shadow-lg transition ${
              driver.isOnline
                ? 'bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Power size={15} />
            <span>{driver.isOnline ? 'অফলাইনে যান' : 'অনলাইন চালু করুন'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* Left: Incoming Request Queue */}
        <div className="flex flex-col justify-between rounded-3xl border border-emerald-100 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4 dark:border-neutral-800">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">লাইভ রাইড রাডার</h3>
              {driver.isOnline ? (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                  নতুন রিকোয়েস্ট আসছে
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                  অফলাইন
                </span>
              )}
            </div>

            {driver.isOnline ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-5 dark:bg-emerald-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-white font-bold">
                        👤
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900 dark:text-white">নাজমুস সাকিব (Nazmus Sakib)</h4>
                        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">★ ৪.৯০ • ওভাই পে / ক্যাশ</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">প্রাক্কলিত মিটার ভাড়া</span>
                      <strong className="block text-xl font-black text-emerald-700 dark:text-emerald-400">৳ ১৯৪.০০</strong>
                    </div>
                  </div>

                  {/* Route details */}
                  <div className="mt-4 space-y-2 rounded-xl bg-white p-3 text-xs font-semibold shadow-sm dark:bg-neutral-800 border border-emerald-100 dark:border-neutral-700">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="text-gray-700 dark:text-neutral-200">পিকআপ: {route.pickup.name.split('(')[0]} (০.৩ কিমি দূরে)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded bg-rose-500" />
                      <span className="text-gray-700 dark:text-neutral-200">গন্তব্য: {route.dest.name.split('(')[0]}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => acceptDriverTrip(194.00)}
                      className="rounded-xl bg-emerald-700 py-3 text-xs font-black text-white shadow-md transition hover:bg-emerald-800"
                    >
                      ট্রিপ গ্রহণ করুন (৳ ১৯৪)
                    </button>
                    <button
                      onClick={() => {}}
                      className="rounded-xl border border-gray-200 bg-white py-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      প্রত্যাখ্যান
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl">🛺</span>
                <h4 className="mt-3 text-sm font-extrabold text-gray-700 dark:text-neutral-300">আপনি বর্তমানে অফলাইনে আছেন</h4>
                <p className="mt-1 text-xs text-gray-400">রাইড রিকোয়েস্ট পেতে উপরের "অনলাইন চালু করুন" বাটনে চাপুন।</p>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-emerald-100 pt-4 text-xs font-medium text-emerald-800 dark:text-emerald-400 dark:border-neutral-800">
            নিরাপত্তা টিপস: যাত্রা শুরুর পূর্বে ডিজিটাল মিটার অন করতে ভুলবেন না।
          </div>
        </div>

        {/* Right: Earnings & Quest Dashboard */}
        <div className="space-y-6">
          
          {/* Today's Earnings Card */}
          <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 p-6 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">আজকের মোট আয়</span>
            <div className="mt-1 text-4xl font-black tracking-tight">৳ {driver.todayEarnings.toFixed(2)}</div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-emerald-100">
              <span>{driver.tripsCompleted} টি সফল ট্রিপ সম্পন্ন</span>
              <span>অনলাইন: ৫ ঘণ্টা ৪০ মিনিট</span>
            </div>
          </div>

          {/* Daily Quest Card */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                  <Award size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">দৈনিক ক্যাপ্টেন্স টার্গেট</h4>
                  <p className="text-[11px] text-gray-400">আজকে ১৫ টি ট্রিপ সম্পন্ন করুন</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">+ ৳ ৫০০ বোনাস</span>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-neutral-400 mb-1.5">
                <span>অগ্রগতি</span>
                <span>{driver.tripsCompleted} / ১৫ ট্রিপ</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, (driver.tripsCompleted / 15) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Vehicle Telemetry & Support */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">যানবাহন ও লাইসেন্স ডকুমেন্টস</h4>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-500">সিএনজি রেজি নং:</span>
                <span className="text-gray-900 dark:text-white font-bold">ঢাকা-থ-১২-৩৪৫৬ (মেয়াদ ২০২৭)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-500">ডিজিটাল মিটার সিল:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">বিএসটিআই ভেরিফাইড</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-500">ড্রাইভার লাইসেন্স:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">বিআরটিএ অনুমোদিত</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
