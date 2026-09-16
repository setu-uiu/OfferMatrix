import React from 'react';
import { MapPin, Crosshair, ArrowRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  currentLocation: string;
  onOpenLocationModal: () => void;
  onFindFoodClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLocation,
  onOpenLocationModal,
  onFindFoodClick,
}) => {
  return (
    <div className="relative mb-6 sm:mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-white via-white to-red-50/50 border border-gray-200/80 shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-10 lg:p-12">
        {/* Left Copy */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-[#ef0909] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#ef0909]" />
            <span>Foodi Bangladesh #1 Food Delivery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
            <span className="text-[#ef0909]">Fast, Fresh</span> &amp; <br className="hidden sm:block" />
            Right To Your Door
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
            Order authentic Kacchi Biriyani, crispy smashed burgers, hot stone pizzas, and traditional Bengali delicacies delivered in 30 minutes.
          </p>

          {/* Location / Find Food Search Box */}
          <div className="p-2 bg-white rounded-2xl border-2 border-red-200 shadow-lg shadow-red-100/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
            <div
              onClick={onOpenLocationModal}
              className="flex-1 flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-xl transition"
            >
              <MapPin className="w-5 h-5 text-[#ef0909] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase font-bold text-gray-400">Delivering to</div>
                <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                  {currentLocation}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="px-3 py-2 text-xs font-bold text-[#ef0909] hover:bg-red-50 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Locate Me</span>
              </button>
              <button
                type="button"
                onClick={onFindFoodClick}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-sm shadow-md shadow-[#ef0909]/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Find Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Art / Food Imagery */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md h-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
              alt="Foodi Hot Meals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5 text-white">
              <div>
                <span className="bg-[#ef0909] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                  🔥 Foodi Rescue
                </span>
                <div className="text-base font-bold mt-1">Cancels Rescued at 50% Off</div>
                <div className="text-xs text-white/80">Fresh restaurant meals preserved piping hot</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
