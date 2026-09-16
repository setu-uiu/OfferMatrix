import React, { useState, useRef, useEffect } from 'react';
import { DHAKA_LOCATIONS, calculateRouteDistance } from '../../context/AppContext';
import { Search, MapPin, Navigation, X, Check } from 'lucide-react';

export const LocationSearchInput = ({
  label,
  placeholder,
  selectedLocation,
  onSelectLocation,
  isPickup = false,
  referenceLocation = null, // for distance badge in destination search
}) => {
  const [query, setQuery] = useState(selectedLocation?.name || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(selectedLocation?.name || '');
  }, [selectedLocation]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter locations
  const filtered = DHAKA_LOCATIONS.filter(loc => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      (loc.nameBn && loc.nameBn.includes(q)) ||
      loc.area.toLowerCase().includes(q) ||
      loc.landmark.toLowerCase().includes(q)
    );
  });

  const handleSelect = (loc) => {
    setQuery(loc.name);
    setIsOpen(false);
    onSelectLocation(loc);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      
      {/* Input Box */}
      <div
        onClick={() => setIsOpen(true)}
        className={`flex items-center rounded-xl border bg-emerald-50/40 px-3 py-2.5 transition-all ${
          isOpen
            ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 dark:border-emerald-400 dark:bg-neutral-800 dark:ring-emerald-400/20'
            : 'border-emerald-100 hover:border-emerald-300 dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:border-neutral-600'
        }`}
      >
        <div className="mr-2.5 flex h-4 w-4 items-center justify-center flex-shrink-0">
          {isPickup ? (
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-800" />
          ) : (
            <span className="h-2.5 w-2.5 rounded bg-rose-500 ring-2 ring-rose-200 dark:ring-rose-900" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-xs font-extrabold text-gray-900 focus:outline-none dark:text-white placeholder:text-gray-400"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-neutral-700 dark:hover:text-white mr-1"
          >
            <X size={12} />
          </button>
        )}

        <Search size={14} className="text-emerald-600/70 dark:text-emerald-400 flex-shrink-0" />
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-2 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 animate-in fade-in zoom-in-95">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            {isPickup ? '📍 পিকআপ পয়েন্ট নির্বাচন করুন' : '🏁 গন্তব্যস্থল নির্বাচন করুন'} ({filtered.length} locations)
          </div>

          <div className="space-y-1 mt-1">
            {filtered.map(loc => {
              const isCurrent = selectedLocation?.id === loc.id;
              
              // Calculate estimated distance if reference location is provided
              let distBadge = null;
              if (referenceLocation && !isPickup && referenceLocation.id !== loc.id) {
                const { distanceKm } = calculateRouteDistance(referenceLocation.lat, referenceLocation.lng, loc.lat, loc.lng);
                distBadge = `${distanceKm} কিমি`;
              }

              return (
                <div
                  key={loc.id}
                  onClick={() => handleSelect(loc)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                    isCurrent
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'hover:bg-emerald-50 text-gray-800 dark:text-neutral-200 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin
                      size={14}
                      className={isCurrent ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}
                    />
                    <div className="min-w-0">
                      <div className="font-extrabold truncate">{loc.name}</div>
                      <div className={`text-[10px] truncate ${isCurrent ? 'text-emerald-100' : 'text-gray-500 dark:text-neutral-400'}`}>
                        {loc.landmark} • <span className="font-semibold">{loc.area}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {distBadge && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {distBadge}
                      </span>
                    )}
                    {isCurrent && <Check size={14} />}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-4 text-center text-xs text-gray-500">
                কোন লোকেশন পাওয়া যায়নি। "মিরপুর", "ফার্মগেট", "গুলশান", "উত্তরা", "ধানমন্ডি" লিখে খুঁজুন।
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
