import React, { useState } from 'react';
import { useApp, VEHICLE_RATES, DHAKA_LOCATIONS } from '../../context/AppContext';
import { LiveMap } from './LiveMap';
import { LocationSearchInput } from './LocationSearchInput';
import { RideSimulationModal } from './RideSimulationModal';
import { CustomerAccountModal } from './CustomerAccountModal';
import { MapPin, Navigation, ArrowUpDown, Tag, ChevronRight, Info, Clock, Route as RouteIcon } from 'lucide-react';

export const CustomerPortal = () => {
  const { customer, adminPricing, removeCoupon, calculateFare, route, setRoute, updateRoutePoints, showToast } = useApp();
  const [selectedCar, setSelectedCar] = useState('uberx');
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState('coupons');

  // Quick destination chips
  const popularChips = [
    { label: 'Airport (DAC)', id: 'airport' },
    { label: 'Dhanmondi 27', id: 'dhanmondi27' },
    { label: 'Banani 11', id: 'banani11' },
    { label: 'Uttara 3', id: 'uttara3' },
    { label: 'Mirpur 10', id: 'mirpur10' },
    { label: 'Bashundhara', id: 'bashundhara' },
    { label: 'Motijheel', id: 'motijheel' },
  ];

  const handleSelectPickup = (loc) => {
    updateRoutePoints(loc, route.dest);
    showToast(`📍 Pickup set to: ${loc.name}`);
  };

  const handleSelectDest = (loc) => {
    updateRoutePoints(route.pickup, loc);
    showToast(`🏁 Destination set to: ${loc.name}`);
  };

  const handleChipClick = (chip) => {
    const loc = DHAKA_LOCATIONS.find(l => l.id === chip.id);
    if (loc) {
      updateRoutePoints(route.pickup, loc);
      showToast(`🏁 Route updated to ${loc.name} (${route.distanceKm} km)`);
    }
  };

  const handleSwap = () => {
    updateRoutePoints(route.dest, route.pickup);
    showToast('🔄 Locations swapped!');
  };

  const handleUseCurrentLocation = () => {
    const current = DHAKA_LOCATIONS[0]; // Gulshan 2
    updateRoutePoints(current, route.dest);
    showToast('📍 GPS Location detected: Gulshan 2, Dhaka');
  };

  const selectedVehicleRate = VEHICLE_RATES[selectedCar];
  const fareDetails = calculateFare(selectedCar);

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Top Announcement Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-3.5 px-5 dark:border-emerald-500/30">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-neutral-200">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 pulse-green-dot" />
          <span>
            Special Offer Active: <strong className="text-emerald-700 dark:text-emerald-400">{adminPricing.storeDiscount}% Store Discount</strong> & <strong className="text-emerald-700 dark:text-emerald-400">৳ {adminPricing.bkashCashback} bKash Cashback</strong>!
          </span>
        </div>
        <button
          onClick={() => {
            setAccountTab('coupons');
            setIsAccountModalOpen(true);
          }}
          className="flex items-center gap-1 text-xs font-black text-emerald-700 hover:underline dark:text-emerald-400"
        >
          <span>View All Coupons</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Main Booking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px] w-full">
        
        {/* Left Booking Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Where to? Search & Check Fares</h2>
              <p className="text-xs text-gray-500 dark:text-neutral-400">Select any pickup and drop-off to see real-time calculated fares.</p>
            </div>

            {/* Location Search Inputs with Autocomplete */}
            <div className="space-y-2.5 relative">
              
              {/* Pickup */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">Pickup Location</span>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 dark:text-emerald-400"
                  >
                    <Navigation size={10} /> Use GPS Location
                  </button>
                </div>
                <LocationSearchInput
                  placeholder="Search pickup spot (e.g. Gulshan, Banani, Mirpur)..."
                  selectedLocation={route.pickup}
                  onSelectLocation={handleSelectPickup}
                  isPickup={true}
                />
              </div>

              {/* Swap Button Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="w-full border-t border-gray-100 dark:border-neutral-800" />
                <button
                  type="button"
                  onClick={handleSwap}
                  className="absolute bg-white border border-gray-200 rounded-full p-1.5 text-gray-600 hover:bg-gray-100 shadow-sm transition dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300"
                  title="Swap Pickup & Destination"
                >
                  <ArrowUpDown size={13} />
                </button>
              </div>

              {/* Destination */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400 block mb-1">Destination Location</span>
                <LocationSearchInput
                  placeholder="Search destination spot (e.g. Airport, Dhanmondi, Uttara)..."
                  selectedLocation={route.dest}
                  onSelectLocation={handleSelectDest}
                  isPickup={false}
                  referenceLocation={route.pickup}
                />
              </div>

            </div>

            {/* Popular Dhaka Quick Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Popular Quick Destinations:</span>
              <div className="flex flex-wrap gap-1.5">
                {popularChips.map((chip) => {
                  const isSelected = route.dest.id === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => handleChipClick(chip)}
                      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                        isSelected
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-black hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-white'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Calculated Route Summary Strip */}
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-3 text-xs dark:bg-neutral-800/80 dark:border-neutral-700">
              <div className="flex items-center justify-between font-extrabold text-gray-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <RouteIcon size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Calculated Route</span>
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {route.distanceKm} km • ~{route.durationMins} mins
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500 dark:text-neutral-400">
                <span className="truncate max-w-[170px]">📍 {route.pickup.name}</span>
                <span>➔</span>
                <span className="truncate max-w-[170px]">🏁 {route.dest.name}</span>
              </div>
            </div>

            {/* Applied Coupon Strip */}
            {customer.appliedCoupon && (
              <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-500 bg-emerald-50 p-2.5 px-3.5 text-xs dark:bg-emerald-950/40">
                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-emerald-700 dark:text-emerald-400" />
                  <div>
                    <strong className="font-extrabold text-emerald-800 dark:text-emerald-300">
                      {customer.appliedCoupon.code} Applied
                    </strong>
                    <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                      {customer.appliedCoupon.discount}% Discount (Max ৳ {customer.appliedCoupon.maxCap})
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
            <div className="space-y-2 pt-1 max-h-52 overflow-y-auto pr-1">
              {Object.keys(VEHICLE_RATES).map((key) => {
                const v = VEHICLE_RATES[key];
                const { originalFare, finalFare: fare, baseFare, distanceFare, ratePerKm } = calculateFare(key);
                const isSelected = selectedCar === key;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedCar(key)}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-3 transition-all ${
                      isSelected
                        ? 'border-black bg-gray-50 shadow-sm dark:border-white dark:bg-neutral-800'
                        : 'border-transparent bg-gray-50/50 hover:bg-gray-100 dark:bg-neutral-800/40 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{v.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">{v.name}</h4>
                          <span className="text-[10px] text-gray-400 font-semibold">{v.capacity}</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {v.eta} • <span className="text-gray-400 font-normal">৳ {ratePerKm}/km</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {originalFare > fare && (
                        <span className="block text-[10px] text-gray-400 line-through">৳ {originalFare}</span>
                      )}
                      <strong className="text-sm font-black text-gray-900 dark:text-white">৳ {fare}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-3 dark:border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-600 dark:text-neutral-400">
                bKash (৳ {adminPricing.bkashCashback} Cashback) / Uber Cash (৳ {Math.round(customer.walletBalance)})
              </span>
              <button
                onClick={() => {
                  setAccountTab('coupons');
                  setIsAccountModalOpen(true);
                }}
                className="font-bold text-black hover:underline dark:text-white"
              >
                🎟️ Coupons
              </button>
            </div>

            <button
              onClick={() => setIsSimModalOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-black py-4 px-6 text-sm font-extrabold text-white shadow-xl transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <span>Request {selectedVehicleRate?.name} ({route.distanceKm} km)</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs dark:bg-black/20 font-black">
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
