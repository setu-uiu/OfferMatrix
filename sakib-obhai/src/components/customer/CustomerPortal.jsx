import React, { useState } from 'react';
import { useApp, VEHICLE_RATES, DHAKA_LOCATIONS } from '../../context/AppContext';
import { LiveMap } from './LiveMap';
import { LocationSearchInput } from './LocationSearchInput';
import { RideSimulationModal } from './RideSimulationModal';
import { CustomerAccountModal } from './CustomerAccountModal';
import { MapPin, Navigation, ArrowUpDown, Tag, ChevronRight, Gauge, ShieldCheck, Clock, Route as RouteIcon, Sparkles } from 'lucide-react';

export const CustomerPortal = () => {
  const { customer, adminPricing, removeCoupon, calculateFare, route, setRoute, updateRoutePoints, showToast } = useApp();
  const [selectedCar, setSelectedCar] = useState('cng');
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState('coupons');

  // Quick destination chips
  const popularChips = [
    { label: 'বিমানবন্দর (Airport)', id: 'airport' },
    { label: 'ফার্মগেট (Farmgate)', id: 'farmgate' },
    { label: 'ধানমন্ডি ২৭ (Dhanmondi)', id: 'dhanmondi27' },
    { label: 'গুলশান ২ (Gulshan 2)', id: 'gulshan2' },
    { label: 'উত্তরা ৩ (Uttara 3)', id: 'uttara3' },
    { label: 'মিরপুর ১০ (Mirpur 10)', id: 'mirpur10' },
    { label: 'মতিঝিল (Motijheel)', id: 'motijheel' },
    { label: 'পুরান ঢাকা (Old Dhaka)', id: 'olddhaka' },
  ];

  const handleSelectPickup = (loc) => {
    updateRoutePoints(loc, route.dest);
    showToast(`📍 পিকআপ লোকেশন: ${loc.name}`);
  };

  const handleSelectDest = (loc) => {
    updateRoutePoints(route.pickup, loc);
    showToast(`🏁 গন্তব্যস্থল: ${loc.name}`);
  };

  const handleChipClick = (chip) => {
    const loc = DHAKA_LOCATIONS.find(l => l.id === chip.id);
    if (loc) {
      updateRoutePoints(route.pickup, loc);
      showToast(`🏁 গন্তব্য নির্বাচিত: ${loc.name} (${route.distanceKm} কিমি)`);
    }
  };

  const handleSwap = () => {
    updateRoutePoints(route.dest, route.pickup);
    showToast('🔄 লোকেশন অদলবদল করা হয়েছে!');
  };

  const handleUseCurrentLocation = () => {
    const current = DHAKA_LOCATIONS[0]; // Mirpur 10
    updateRoutePoints(current, route.dest);
    showToast('📍 জিপিএস লোকেশন সনাক্ত হয়েছে: মিরপুর ১০ গোলচত্বর');
  };

  const selectedVehicleRate = VEHICLE_RATES[selectedCar] || VEHICLE_RATES.cng;
  const fareDetails = calculateFare(selectedCar);

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Top Announcement Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-600/15 via-emerald-600/5 to-transparent border border-emerald-500/30 p-3.5 px-5 dark:border-emerald-500/40 shadow-sm">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-neutral-200">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>
            ওভাই মেগা অফার: <strong className="text-emerald-700 dark:text-emerald-400">{adminPricing.storeDiscount}% ফ্ল্যাট ডিসকাউন্ট</strong> এবং <strong className="text-emerald-700 dark:text-emerald-400">৳ {adminPricing.bkashCashback} বিকাশ ক্যাশব্যাক</strong>!
          </span>
        </div>
        <button
          onClick={() => {
            setAccountTab('coupons');
            setIsAccountModalOpen(true);
          }}
          className="flex items-center gap-1 text-xs font-black text-emerald-700 hover:underline dark:text-emerald-400"
        >
          <span>সব কুপন দেখুন</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* 6 OBHAI Services Category Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {Object.keys(VEHICLE_RATES).map((key) => {
          const v = VEHICLE_RATES[key];
          const isSelected = selectedCar === key;
          const { finalFare } = calculateFare(key);
          return (
            <button
              key={key}
              onClick={() => setSelectedCar(key)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-500/20 dark:bg-emerald-950/50 dark:border-emerald-400'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-neutral-800 dark:bg-neutral-900'
              }`}
            >
              <span className="text-2xl mb-1">{v.icon}</span>
              <span className="text-[11px] font-extrabold text-gray-900 dark:text-white truncate w-full">{v.name.split('(')[0]}</span>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">৳ {finalFare}</span>
            </button>
          );
        })}
      </div>

      {/* Main Booking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px] w-full">
        
        {/* Left Booking Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  লাইভ সার্চ ও ভাড়া
                </span>
                <span className="text-xs font-bold text-gray-400">ঢাকা মেট্রো রুট</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">কোথায় যেতে চান? লোকেশন সার্চ করুন</h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400">পিকআপ ও গন্তব্য লিখলেই রুট দূরত্ব ও সঠিক ভাড়া দেখা যাবে।</p>
            </div>

            {/* Location Search Inputs with Autocomplete */}
            <div className="space-y-2.5 relative">
              
              {/* Pickup */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">📍 পিকআপ লোকেশন</span>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 dark:text-emerald-400"
                  >
                    <Navigation size={10} /> বর্তমান জিপিএস লোকেশন
                  </button>
                </div>
                <LocationSearchInput
                  placeholder="পিকআপ লোকেশন লিখুন (যেমন: মিরপুর, ধানমন্ডি, গুলশান)..."
                  selectedLocation={route.pickup}
                  onSelectLocation={handleSelectPickup}
                  isPickup={true}
                />
              </div>

              {/* Swap Button Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-emerald-100 dark:border-neutral-800" />
                <button
                  type="button"
                  onClick={handleSwap}
                  className="absolute bg-white border border-emerald-200 rounded-full p-1.5 text-emerald-700 hover:bg-emerald-50 shadow-sm transition dark:bg-neutral-800 dark:border-neutral-700 dark:text-emerald-400"
                  title="পিকআপ ও গন্তব্য অদলবদল করুন"
                >
                  <ArrowUpDown size={13} />
                </button>
              </div>

              {/* Destination */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">🏁 গন্তব্য লোকেশন</span>
                <LocationSearchInput
                  placeholder="গন্তব্য লোকেশন লিখুন (যেমন: ফার্মগেট, বিমানবন্দর, উত্তরা)..."
                  selectedLocation={route.dest}
                  onSelectLocation={handleSelectDest}
                  isPickup={false}
                  referenceLocation={route.pickup}
                />
              </div>

            </div>

            {/* Popular Dhaka Quick Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">জনপ্রিয় গন্তব্যসমূহ:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularChips.map((chip) => {
                  const isSelected = route.dest.id === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => handleChipClick(chip)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-700 text-white font-bold'
                          : 'border-emerald-100 bg-emerald-50/50 text-emerald-900 hover:border-emerald-600 hover:bg-emerald-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Digital CNG Meter Simulation Box */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-neutral-900 p-3.5 text-white shadow-md border border-emerald-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge size={16} className="text-emerald-400" />
                  <span className="text-xs font-extrabold tracking-wide uppercase text-emerald-300">
                    ডিজিটাল মিটার সিমুলেটর
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-400/30">
                  বিআরটিএ অনুমোদিত রেট
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2 rounded-xl bg-black/40 p-2.5 text-center border border-white/5 font-mono">
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">বেস ফেয়ার</span>
                  <strong className="text-xs text-amber-300">৳ {selectedVehicleRate.base}</strong>
                </div>
                <div className="border-x border-white/10">
                  <span className="block text-[9px] text-gray-400 uppercase">দূরত্ব ({route.distanceKm} km)</span>
                  <strong className="text-xs text-emerald-300">৳ {Math.round(route.distanceKm * selectedVehicleRate.perKm)}</strong>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">মোট প্রাক্কলন</span>
                  <strong className="text-sm font-black text-white">৳ {fareDetails.finalFare}</strong>
                </div>
              </div>
            </div>

            {/* Applied Coupon Strip */}
            {customer.appliedCoupon && (
              <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-500 bg-emerald-50 p-2.5 px-3.5 text-xs dark:bg-emerald-950/40">
                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-emerald-700 dark:text-emerald-400" />
                  <div>
                    <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">
                      {customer.appliedCoupon.code} কুপন সক্রিয়
                    </strong>
                    <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      {customer.appliedCoupon.discount}% ডিসকাউন্ট (সর্বোচ্চ ৳ {customer.appliedCoupon.maxCap})
                    </span>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="rounded-full p-1 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Vehicle Options List with Live Dynamic Calculated Fares */}
            <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1">
              {Object.keys(VEHICLE_RATES).map((key) => {
                const v = VEHICLE_RATES[key];
                const { originalFare, finalFare: fare, baseFare, ratePerKm } = calculateFare(key);
                const isSelected = selectedCar === key;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedCar(key)}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-sm dark:border-emerald-400 dark:bg-neutral-800'
                        : 'border-transparent bg-gray-50/70 hover:bg-emerald-50/40 dark:bg-neutral-800/40 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{v.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">{v.name}</h4>
                          <span className="text-[10px] text-gray-400 font-semibold">{v.capacity}</span>
                        </div>
                        <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                          {v.eta} • <span className="text-gray-400 font-normal">৳ {ratePerKm}/কিমি</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {originalFare > fare && (
                        <span className="block text-[10px] text-gray-400 line-through">৳ {originalFare}</span>
                      )}
                      <strong className="text-sm font-black text-emerald-800 dark:text-emerald-400">৳ {fare}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-4 border-t border-emerald-100 pt-4 space-y-3 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-600 dark:text-neutral-400">
                ওভাই পে ওয়ালেট: <strong>৳ {Math.round(customer.walletBalance)}</strong>
              </span>
              <button
                onClick={() => {
                  setAccountTab('coupons');
                  setIsAccountModalOpen(true);
                }}
                className="font-bold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                🎟️ প্রোমো কোড
              </button>
            </div>

            <button
              onClick={() => setIsSimModalOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-emerald-700 py-4 px-6 text-sm font-extrabold text-white shadow-xl transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <span>{selectedVehicleRate?.name.split('(')[0]} রিকোয়েস্ট করুন ({route.distanceKm} কিমি)</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                ৳ {fareDetails.finalFare}
              </span>
            </button>
          </div>

        </div>

        {/* Right Live Map */}
        <div className="lg:col-span-7 h-full">
          <LiveMap isSimulating={isSimModalOpen} />
        </div>

      </div>

      {/* Ride Simulation Modal */}
      <RideSimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        selectedVehicle={selectedCar}
      />

      {/* Customer Account & Coupons Modal */}
      <CustomerAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        initialTab={accountTab}
      />

    </div>
  );
};
