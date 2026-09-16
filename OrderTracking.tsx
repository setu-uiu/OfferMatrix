import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Bike,
  ChefHat,
  Package,
  Phone,
  Bell,
  BellRing,
  RotateCcw,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { Order, OrderStatusStep } from '../types.js';
import {
  playNotificationChime,
  requestPushPermission,
  sendBrowserNotification,
} from '../lib/notifications.js';

interface OrderTrackingProps {
  order: Order | null;
  onOrderUpdated: (updatedOrder: Order) => void;
  onNavigateHome: () => void;
}

const STEP_LABELS = [
  { step: 0, label: 'Order Placed', desc: 'Order received and confirmed by kitchen', icon: Package },
  { step: 1, label: 'Kitchen Preparing', desc: 'Fresh ingredients being cooked hot', icon: ChefHat },
  { step: 2, label: 'On the Way', desc: 'Rider picked up and riding to your door', icon: Bike },
  { step: 3, label: 'Delivered', desc: 'Meal delivered hot! Enjoy your food', icon: CheckCircle2 },
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  order,
  onOrderUpdated,
  onNavigateHome,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('--:--');
  const [hasPushPermission, setHasPushPermission] = useState(false);

  // Check initial permission
  useEffect(() => {
    if ('Notification' in window) {
      setHasPushPermission(Notification.permission === 'granted');
    }
  }, []);

  // Connect to Real-Time SSE Stream
  useEffect(() => {
    if (!order) return;

    const eventSource = new EventSource(`/api/orders/${order.id}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.order) {
          const updated: Order = data.order;
          if (updated.status !== order.status) {
            // Status changed!
            playNotificationChime(updated.status === 3 ? 'delivered' : 'update');
            sendBrowserNotification(
              `Foodi Order #${updated.id}`,
              STEP_LABELS[updated.status]?.desc || 'Your order status was updated!'
            );
          }
          onOrderUpdated(updated);
        }
      } catch {}
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [order?.id, order?.status]);

  // Live Countdown Timer
  useEffect(() => {
    if (!order) return;

    const updateTimer = () => {
      const now = Date.now();
      const target = new Date(order.estDelivery).getTime();
      const diff = target - now;

      if (order.status === 3) {
        setTimeLeft('Delivered!');
        return;
      }

      if (diff <= 0) {
        setTimeLeft('Arriving now');
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order?.estDelivery, order?.status]);

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    setHasPushPermission(granted);
    if (granted) {
      playNotificationChime('update');
      sendBrowserNotification('Foodi Live Notifications Enabled', 'You will receive real-time order alerts right here!');
    }
  };

  if (!order) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 max-w-xl mx-auto p-8 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#ef0909] flex items-center justify-center mx-auto mb-4">
          <Navigation className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Order</h3>
        <p className="text-sm text-gray-500 mb-6">
          You do not have any live orders being prepared right now.
        </p>
        <button
          onClick={onNavigateHome}
          className="px-6 py-3 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-sm shadow-md shadow-[#ef0909]/20 transition cursor-pointer"
        >
          Order Food Now
        </button>
      </div>
    );
  }

  const riderProgress = order.riderProgress || (order.status === 0 ? 5 : order.status === 1 ? 25 : order.status === 2 ? 65 : 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#ef0909] to-[#ff6b35] text-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-red-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            Live Order Tracking
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            {order.status === 3 ? '🎉 Order Delivered!' : 'Order is On The Way!'}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-1">
            Order #{order.id} · Estimated delivery: {new Date(order.estDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Live Countdown Badge */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-white/80">Estimated Time</div>
          <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5 text-white">
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Push Notification Banner */}
      {!hasPushPermission && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Enable real-time push notifications to get alerted as soon as rider is nearby.</span>
          </div>
          <button
            onClick={handleEnablePush}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer shrink-0 transition"
          >
            Allow Notifications
          </button>
        </div>
      )}

      {/* Live Interactive Map with Moving Rider */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#ef0909]" />
            <h3 className="text-sm font-bold text-gray-900">Live GPS Rider Route</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Satellite Updates</span>
          </span>
        </div>

        {/* Live Delivery Route Map */}
        <div className="relative h-64 sm:h-80 bg-slate-100 overflow-hidden">
          {/* Map roads grid */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />
          
          {/* Main Road Highway */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 60 220 Q 200 80, 420 180 T 780 90"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 60 220 Q 200 80, 420 180 T 780 90"
              fill="none"
              stroke="#ef0909"
              strokeWidth="4"
              strokeDasharray="6 6"
              strokeLinecap="round"
              className="animate-pulse"
            />
          </svg>

          {/* Restaurant Origin Marker */}
          <div className="absolute left-10 sm:left-14 bottom-10 flex flex-col items-center">
            <div className="px-2 py-1 rounded bg-white shadow-md text-[10px] font-bold text-gray-700 mb-1">
              Kitchen (Restaurant)
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>

          {/* Moving Rider Motorcycle Icon */}
          <div
            className="absolute transition-all duration-700 ease-out z-20 flex flex-col items-center"
            style={{
              left: `calc(15% + ${riderProgress * 0.7}%)`,
              top: `calc(55% - ${Math.sin(riderProgress / 20) * 50}px)`,
            }}
          >
            <div className="px-2 py-0.5 rounded bg-[#ef0909] text-white text-[10px] font-extrabold shadow-md mb-1 whitespace-nowrap animate-pulse">
              {order.rider?.name || 'Rider on Bike'}
            </div>
            <div className="w-11 h-11 rounded-full bg-white border-2 border-[#ef0909] text-[#ef0909] flex items-center justify-center shadow-2xl">
              <Bike className="w-6 h-6" />
            </div>
          </div>

          {/* Customer Destination Marker */}
          <div className="absolute right-8 sm:right-16 top-10 flex flex-col items-center z-10">
            <div className="px-2.5 py-1 rounded bg-white shadow-md text-[10px] font-bold text-gray-800 mb-1 max-w-[150px] truncate">
              {order.address}
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-gray-900 mb-6">Delivery Milestones</h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {STEP_LABELS.map((s, idx) => {
            const Icon = s.icon;
            const isCompleted = order.status >= s.step;
            const isCurrent = order.status === s.step;

            return (
              <div
                key={s.step}
                className={`p-4 rounded-xl border-2 transition relative flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950'
                    : isCurrent
                    ? 'border-[#ef0909] bg-red-50/40 text-gray-900 shadow-xs'
                    : 'border-gray-200 bg-gray-50/50 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#ef0909] text-white animate-pulse'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold font-mono">0{idx + 1}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900">{s.label}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-normal">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rider & Delivery Contact Card */}
      {order.rider && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-red-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
              {order.rider.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-gray-900">{order.rider.name}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {order.rider.rating || 4.9} ★
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Foodi Delivery Partner · {order.rider.vehicleNo || 'Motorcycle'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={`tel:${order.rider.phone}`}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Phone className="w-4 h-4" />
              <span>Call Rider ({order.rider.phone})</span>
            </a>
          </div>
        </div>
      )}

      {/* Order Item Details */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Order Items &amp; Summary
        </h3>

        <div className="divide-y divide-gray-100">
          {order.items.map((it) => (
            <div key={it.itemId} className="py-2.5 flex items-center justify-between text-sm">
              <div>
                <span className="font-bold text-gray-900">{it.name}</span>
                <span className="text-gray-500 text-xs ml-2">× {it.qty}</span>
              </div>
              <span className="font-bold text-gray-900">৳{it.price * it.qty}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{order.totals.sub}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>৳{order.totals.fee}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (5%)</span>
            <span>৳{order.totals.vat}</span>
          </div>
          {order.totals.disc > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount</span>
              <span>-৳{order.totals.disc}</span>
            </div>
          )}
          <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-extrabold text-gray-900">
            <span>Total Paid ({order.payment.toUpperCase()})</span>
            <span className="text-[#ef0909]">৳{order.totals.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
