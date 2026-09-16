import React, { useState } from 'react';
import { X, MapPin, Crosshair, Check } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

const POPULAR_LOCATIONS = [
  'Dhanmondi, Dhaka',
  'Gulshan 1, Dhaka',
  'Gulshan 2, Dhaka',
  'Banani, Dhaka',
  'Uttara Sector 7, Dhaka',
  'Bashundhara R/A, Dhaka',
  'Mirpur 10, Dhaka',
  'Old Dhaka (Puran Dhaka)',
  'Mohakhali DOHS, Dhaka',
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [selected, setSelected] = useState(currentLocation);
  const [customInput, setCustomInput] = useState(currentLocation);

  if (!isOpen) return null;

  const handleLocateMe = () => {
    const loc = 'Bashundhara R/A, Dhaka';
    setSelected(loc);
    setCustomInput(loc);
  };

  const handleSave = () => {
    const finalLoc = customInput.trim() || selected || 'Dhanmondi, Dhaka';
    onSelectLocation(finalLoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-extrabold text-gray-900 mb-1">
          Select Delivery Location
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Choose your exact address in Dhaka to view nearby restaurants and accurate delivery times.
        </p>

        {/* Location Search Input */}
        <div className="flex items-center gap-2 p-2 border-2 border-[#ef0909]/40 focus-within:border-[#ef0909] rounded-xl bg-white shadow-xs mb-4">
          <MapPin className="w-5 h-5 text-[#ef0909] shrink-0 ml-1" />
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type your area, road, or house..."
            className="flex-1 text-sm text-gray-900 outline-none font-medium"
          />
          <button
            onClick={handleLocateMe}
            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#ef0909] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Locate Me</span>
          </button>
        </div>

        {/* Dhaka Interactive Map */}
        <div className="relative h-48 sm:h-56 bg-slate-100 rounded-xl overflow-hidden border border-gray-200 mb-4 flex items-center justify-center shadow-inner">
          {/* Map Grid and Roads */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute w-[120%] h-5 bg-white -rotate-12 top-1/3 -left-6 shadow-xs" />
          <div className="absolute w-[120%] h-4 bg-white rotate-6 bottom-1/4 -left-6 shadow-xs" />
          <div className="absolute h-[120%] w-5 bg-white rotate-45 left-1/2 -top-6 shadow-xs" />

          {/* Landmarks */}
          <div className="absolute top-6 left-8 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 shadow-xs">
            Bashundhara R/A
          </div>
          <div className="absolute bottom-6 right-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-gray-600 shadow-xs">
            Jamuna Future Park
          </div>
          <div className="absolute top-12 right-12 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-[#ef0909] shadow-xs">
            Gulshan 2 Circle
          </div>

          {/* Location Pin */}
          <div className="relative z-10 flex flex-col items-center animate-bounce">
            <div className="w-10 h-10 rounded-full bg-[#ef0909] text-white flex items-center justify-center shadow-xl shadow-red-500/40">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="w-4 h-1.5 bg-black/30 rounded-full blur-[1px] mt-1" />
          </div>
        </div>

        {/* Popular Areas in Dhaka */}
        <div className="mb-5">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Popular Areas in Dhaka
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  setSelected(loc);
                  setCustomInput(loc);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  customInput === loc
                    ? 'bg-[#ef0909] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {customInput === loc && <Check className="w-3.5 h-3.5" />}
                <span>{loc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full h-12 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-sm shadow-md shadow-[#ef0909]/30 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Confirm & Deliver Here</span>
        </button>
      </div>
    </div>
  );
};
