import React, { useState, useEffect } from 'react';
import { useApp, VEHICLE_RATES } from '../../context/AppContext';
import { CheckCircle, X, Shield, Star, Car } from 'lucide-react';

export const RideSimulationModal = ({ isOpen, onClose, selectedVehicle, onTripComplete }) => {
  const { driver, calculateFare } = useApp();
  const [stage, setStage] = useState('searching'); // 'searching', 'matched', 'completed'

  useEffect(() => {
    if (isOpen) {
      setStage('searching');
      const timer = setTimeout(() => {
        setStage('matched');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const vehicleInfo = VEHICLE_RATES[selectedVehicle] || VEHICLE_RATES.uberx;
  const { finalFare } = calculateFare(selectedVehicle);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        
        {/* Stage 1: Searching */}
        {stage === 'searching' && (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full border-2 border-black/30 dark:border-white/30" />
              <div className="absolute h-16 w-16 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
              <span className="text-3xl">{vehicleInfo.icon}</span>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Connecting to nearby drivers...</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">Finding the highest rated driver near Gulshan 2</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full border border-gray-300 px-6 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Cancel Request
            </button>
          </div>
        )}

        {/* Stage 2: Matched */}
        {stage === 'matched' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-neutral-800">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Arriving in 3 mins
              </span>
              <span className="text-xs font-bold text-gray-500">{vehicleInfo.name}</span>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-200 text-2xl dark:bg-neutral-700">
                👨‍✈️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-gray-900 dark:text-white">{driver.name}</h4>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                    <Star size={12} fill="currentColor" /> 4.95
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-600 dark:text-neutral-300 font-medium">
                  {driver.car}
                </div>
                <div className="mt-1 inline-block rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-black">
                  DHA-GA-11-8492
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs dark:border-neutral-800">
              <span className="font-semibold text-gray-600 dark:text-neutral-400">Total Trip Fare:</span>
              <strong className="text-sm font-extrabold text-gray-900 dark:text-white">৳ {finalFare}</strong>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setStage('completed');
                  if (onTripComplete) onTripComplete();
                }}
                className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white shadow-lg transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                Complete Ride (Simulate Drop-off)
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                Close View
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Completed */}
        {stage === 'completed' && (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">You've Arrived!</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
              Fare of ৳ {finalFare} paid via bKash / Uber Cash.
            </p>

            <div className="my-4 w-full rounded-2xl bg-gray-50 p-4 text-left text-xs space-y-1.5 dark:bg-neutral-800">
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Pickup:</span>
                <span className="font-bold text-gray-800 dark:text-neutral-200">Gulshan 2</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-gray-500">Destination:</span>
                <span className="font-bold text-gray-800 dark:text-neutral-200">Airport Terminal 1</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 font-bold dark:border-neutral-700">
                <span>Total Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400">৳ {finalFare}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white shadow-lg transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Done & Rate 5 Stars ★
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
