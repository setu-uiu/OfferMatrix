import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Crosshair, MapPin, Navigation, Clock } from 'lucide-react';
import L from 'leaflet';

export const LiveMap = ({ isSimulating, onDriverArrive }) => {
  const { route, adminPricing } = useApp();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const animIntervalRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([23.8103, 90.4125], 13);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    map.invalidateSize();

    // Clear previous layers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const p = route.pickup;
    const d = route.dest;

    // Custom pickup & dest markers
    const pickupIcon = L.divIcon({
      className: 'custom-map-pin pin-pickup',
      html: '<div style="background:#059669;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;box-shadow:0 0 10px rgba(5,150,105,0.6);border:2px solid #fff;">●</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const destIcon = L.divIcon({
      className: 'custom-map-pin pin-dest',
      html: '<div style="background:#e11d48;color:#fff;width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:bold;box-shadow:0 0 10px rgba(225,29,72,0.6);border:2px solid #fff;">■</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const pMarker = L.marker([p.lat, p.lng], { icon: pickupIcon }).addTo(map);
    pMarker.bindPopup(`<b>পিকআপ:</b> ${p.name}`);

    const dMarker = L.marker([d.lat, d.lng], { icon: destIcon }).addTo(map);
    dMarker.bindPopup(`<b>গন্তব্য:</b> ${d.name}`);

    // Midpoint curve for realistic route display
    const midLat = (p.lat + d.lat) / 2 + 0.004;
    const midLng = (p.lng + d.lng) / 2 - 0.005;

    L.polyline([[p.lat, p.lng], [midLat, midLng], [d.lat, d.lng]], {
      color: '#059669',
      weight: 5,
      dashArray: '6, 6',
    }).addTo(map);

    const bounds = L.latLngBounds([[p.lat, p.lng], [d.lat, d.lng]]);
    map.fitBounds(bounds, { padding: [55, 55], maxZoom: 15 });

  }, [route]);

  // Handle Driver Animation on Simulation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isSimulating) {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      if (driverMarkerRef.current && map) {
        map.removeLayer(driverMarkerRef.current);
        driverMarkerRef.current = null;
      }
      return;
    }

    let dLat = route.pickup.lat + 0.008;
    let dLng = route.pickup.lng + 0.006;

    const carIcon = L.divIcon({
      className: 'custom-car-marker',
      html: '<div style="font-size:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">🛺</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    if (driverMarkerRef.current) map.removeLayer(driverMarkerRef.current);
    driverMarkerRef.current = L.marker([dLat, dLng], { icon: carIcon }).addTo(map);

    let steps = 0;
    const total = 14;
    clearInterval(animIntervalRef.current);

    animIntervalRef.current = setInterval(() => {
      steps++;
      const progress = steps / total;
      const curLat = dLat + (route.pickup.lat - dLat) * progress;
      const curLng = dLng + (route.pickup.lng - dLng) * progress;

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setLatLng([curLat, curLng]);
      }

      if (steps >= total) {
        clearInterval(animIntervalRef.current);
        if (onDriverArrive) onDriverArrive();
      }
    }, 1200);

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [isSimulating, route]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    const bounds = L.latLngBounds([
      [route.pickup.lat, route.pickup.lng],
      [route.dest.lat, route.dest.lng],
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div className="relative h-full min-h-[580px] w-full overflow-hidden rounded-3xl border border-emerald-100 shadow-md dark:border-neutral-800">
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Floating Status Bar */}
      <div className="pointer-events-none absolute top-4 left-4 right-4 z-[400] flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-4 py-2 text-xs font-bold text-gray-900 shadow-md backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>রুট: {route.pickup.name.split('(')[0]} ➔ {route.dest.name.split('(')[0]}</span>
        </div>

        <button
          onClick={handleRecenter}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-800 shadow-md transition hover:bg-emerald-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
          title="রুট সেন্টারিং"
        >
          <Crosshair size={16} />
        </button>
      </div>

      {/* Dynamic Trip Info Strip */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] flex items-center justify-around rounded-2xl border border-emerald-100 bg-white/95 py-3 px-4 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">মোট দূরত্ব</span>
          <strong className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400">{route.distanceKm} কিমি</strong>
        </div>
        <div className="h-7 w-px bg-gray-200 dark:bg-neutral-800" />
        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">আনুমানিক সময়</span>
          <strong className="text-sm font-extrabold text-gray-900 dark:text-white">~{route.durationMins} মিনিট</strong>
        </div>
        <div className="h-7 w-px bg-gray-200 dark:bg-neutral-800" />
        <div className="text-center">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">বিকাশ ক্যাশব্যাক</span>
          <strong className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">৳ {adminPricing.bkashCashback}</strong>
        </div>
      </div>
    </div>
  );
};
