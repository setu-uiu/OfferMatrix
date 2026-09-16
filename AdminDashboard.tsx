import React, { useState } from 'react';
import {
  Store,
  Utensils,
  Tag,
  Bike,
  DollarSign,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Clock,
  MapPin,
  Flame,
  Shield,
  Phone,
  Eye,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { Restaurant, MenuItem, PromoCode, Rider, Order, OrderStatusStep } from '../types.js';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  promos: Record<string, PromoCode>;
  riders: Rider[];
  orders: Order[];
  onAddRestaurant: (r: Partial<Restaurant>) => Promise<Restaurant>;
  onDeleteRestaurant: (id: number) => Promise<boolean>;
  onAddMenuItem: (restId: number, item: Partial<MenuItem>) => Promise<MenuItem>;
  onDeleteMenuItem: (restId: number, itemId: number) => Promise<boolean>;
  onAddPromo: (promo: PromoCode) => Promise<void>;
  onDeletePromo: (code: string) => Promise<void>;
  onAddRider: (rider: Partial<Rider>) => Promise<Rider>;
  onUpdateRider: (id: number, updates: Partial<Rider>) => Promise<void>;
  onDeleteRider: (id: number) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatusStep) => Promise<void>;
  onSwitchToCustomerView: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants,
  promos,
  riders,
  orders,
  onAddRestaurant,
  onDeleteRestaurant,
  onAddMenuItem,
  onDeleteMenuItem,
  onAddPromo,
  onDeletePromo,
  onAddRider,
  onUpdateRider,
  onDeleteRider,
  onUpdateOrderStatus,
  onSwitchToCustomerView,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'menu' | 'promos' | 'riders' | 'orders'>('restaurants');
  const [selectedRestId, setSelectedRestId] = useState<number>(restaurants[0]?.id || 1);

  // Form states: New Restaurant
  const [newRestName, setNewRestName] = useState('');
  const [newRestCuisine, setNewRestCuisine] = useState('');
  const [newRestCats, setNewRestCats] = useState('Burger, Street Food');
  const [newRestFee, setNewRestFee] = useState(30);
  const [newRestTime, setNewRestTime] = useState('20-30 min');
  const [newRestImg, setNewRestImg] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80');

  // Form states: New Food Item
  const [foodName, setFoodName] = useState('');
  const [foodDesc, setFoodDesc] = useState('');
  const [foodPrice, setFoodPrice] = useState(250);
  const [foodPopular, setFoodPopular] = useState(false);

  // Form states: New Promo
  const [promoCode, setPromoCode] = useState('');
  const [promoType, setPromoType] = useState<'pct' | 'flat'>('pct');
  const [promoVal, setPromoVal] = useState(20);
  const [promoMax, setPromoMax] = useState(100);
  const [promoMin, setPromoMin] = useState(200);

  // Form states: New Rider
  const [riderName, setRiderName] = useState('');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderVehicle, setRiderVehicle] = useState('Dhaka Metro-Ha 77-2101');
  const [riderStatus, setRiderStatus] = useState<'online' | 'offline' | 'on-delivery'>('online');

  // Success / Action feedback
  const [message, setMessage] = useState('');

  const showFeedback = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Calculations for stats
  const totalMenuItems = restaurants.reduce((sum, r) => sum + r.menu.length, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totals.total, 0);

  const currentRestaurant = restaurants.find((r) => r.id === selectedRestId) || restaurants[0];

  // Handler: Add Restaurant
  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim() || !newRestCuisine.trim()) return;

    await onAddRestaurant({
      name: newRestName.trim(),
      cuisine: newRestCuisine.trim(),
      cats: newRestCats.split(',').map((s) => s.trim()).filter(Boolean),
      fee: Number(newRestFee),
      time: newRestTime.trim(),
      img: newRestImg.trim(),
    });

    setNewRestName('');
    setNewRestCuisine('');
    showFeedback('Restaurant added to Foodi platform successfully!');
  };

  // Handler: Add Menu Item
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !foodPrice || !currentRestaurant) return;

    await onAddMenuItem(currentRestaurant.id, {
      name: foodName.trim(),
      desc: foodDesc.trim(),
      price: Number(foodPrice),
      popular: foodPopular,
    });

    setFoodName('');
    setFoodDesc('');
    setFoodPrice(200);
    setFoodPopular(false);
    showFeedback(`Added "${foodName}" to ${currentRestaurant.name}`);
  };

  // Handler: Add Promo
  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    await onAddPromo({
      code,
      pct: promoType === 'pct' ? Number(promoVal) : undefined,
      flat: promoType === 'flat' ? Number(promoVal) : undefined,
      max: Number(promoMax) || undefined,
      minOrder: Number(promoMin) || 0,
    });

    setPromoCode('');
    showFeedback(`Promo code "${code}" created and active!`);
  };

  // Handler: Add Rider
  const handleCreateRider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderName.trim() || !riderPhone.trim()) return;

    await onAddRider({
      name: riderName.trim(),
      phone: riderPhone.trim(),
      vehicleNo: riderVehicle.trim(),
      status: riderStatus,
    });

    setRiderName('');
    setRiderPhone('');
    showFeedback(`Rider "${riderName}" added to fleet!`);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-[#1a1a2e] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-amber-400 text-[#1a1a2e] flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Foodi Platform Operations</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage restaurants, dish catalogs, promo vouchers, and delivery riders in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onSwitchToCustomerView}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#1a1a2e] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-md shrink-0"
          >
            <Store className="w-4 h-4 text-[#ef0909]" />
            <span>Customer View</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-md shrink-0"
              title="Log out and exit from Admin panel"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Notification Toast */}
      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Restaurants</span>
            <Store className="w-4 h-4 text-[#ef0909]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{restaurants.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Food Items</span>
            <Utensils className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalMenuItems}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Promo Codes</span>
            <Tag className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">{Object.keys(promos).length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Delivery Fleet</span>
            <Bike className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">{riders.length}</div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-gray-900">৳{totalRevenue}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2 pb-1 scrollbar-none">
        {[
          { key: 'restaurants', label: 'Restaurants', icon: Store },
          { key: 'menu', label: 'Food Items', icon: Utensils },
          { key: 'promos', label: 'Promos & Offers', icon: Tag },
          { key: 'riders', label: 'Riders Fleet', icon: Bike },
          { key: 'orders', label: `Live Orders (${orders.length})`, icon: Clock },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition select-none shrink-0 ${
                isActive
                  ? 'bg-[#ef0909] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: RESTAURANTS MANAGEMENT */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Restaurants */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>Active Restaurants ({restaurants.length})</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {restaurants.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={r.img}
                      alt={r.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{r.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{r.cuisine}</p>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {r.menu.length} items · ৳{r.fee} fee · {r.time}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteRestaurant(r.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title="Delete restaurant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Restaurant Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#ef0909]" />
              <span>Add New Restaurant</span>
            </h3>

            <form onSubmit={handleCreateRestaurant} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  required
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  placeholder="e.g. Madchef Burgers"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cuisine Description</label>
                <input
                  type="text"
                  required
                  value={newRestCuisine}
                  onChange={(e) => setNewRestCuisine(e.target.value)}
                  placeholder="e.g. Gourmet Burgers · Shakes · Fries"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Categories (comma-separated)</label>
                <input
                  type="text"
                  value={newRestCats}
                  onChange={(e) => setNewRestCats(e.target.value)}
                  placeholder="Burger, Street Food"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery Fee (৳)</label>
                  <input
                    type="number"
                    value={newRestFee}
                    onChange={(e) => setNewRestFee(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Est. Time</label>
                  <input
                    type="text"
                    value={newRestTime}
                    onChange={(e) => setNewRestTime(e.target.value)}
                    placeholder="20-30 min"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={newRestImg}
                  onChange={(e) => setNewRestImg(e.target.value)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Restaurant</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: MENU ITEMS MANAGEMENT */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            {/* Restaurant Selector */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 gap-3">
              <h3 className="text-sm font-bold text-gray-700">Select Restaurant:</h3>
              <select
                value={selectedRestId}
                onChange={(e) => setSelectedRestId(Number(e.target.value))}
                className="h-9 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 outline-none max-w-[240px]"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {currentRestaurant.menu.length > 0 ? (
                currentRestaurant.menu.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 flex items-center justify-between gap-3"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">{item.name}</span>
                        {item.popular && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-black text-[#ef0909]">৳{item.price}</span>
                      <button
                        onClick={() => onDeleteMenuItem(currentRestaurant.id, item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition cursor-pointer"
                        title="Delete food item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  No food items added for this restaurant yet.
                </div>
              )}
            </div>
          </div>

          {/* Add Menu Item Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#ef0909]" />
              <span>Add Food to {currentRestaurant.name}</span>
            </h3>

            <form onSubmit={handleCreateMenuItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Special Mutton Tehari"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Price (৳)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={foodPrice}
                  onChange={(e) => setFoodPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={foodDesc}
                  onChange={(e) => setFoodDesc(e.target.value)}
                  placeholder="Ingredients and serving details..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="popular"
                  checked={foodPopular}
                  onChange={(e) => setFoodPopular(e.target.checked)}
                  className="rounded text-[#ef0909] focus:ring-[#ef0909]"
                />
                <label htmlFor="popular" className="text-xs font-bold text-gray-700">
                  Mark as Popular / Bestseller 🔥
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item to Menu</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: PROMO CODES */}
      {activeTab === 'promos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Active Promo Vouchers ({Object.keys(promos).length})
            </h3>

            <div className="space-y-3">
              {(Object.values(promos) as PromoCode[]).map((p) => (
                <div
                  key={p.code}
                  className="p-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-mono font-black text-sm text-[#ef0909] tracking-wider">
                      {p.code}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.freeDelivery
                        ? 'Free Delivery'
                        : p.pct
                        ? `${p.pct}% Discount (Max ৳${p.max || 'Unlimited'})`
                        : `৳${p.flat} Flat Discount`}
                      {p.minOrder ? ` · Min order ৳${p.minOrder}` : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeletePromo(p.code)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title="Delete promo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Promo Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#ef0909]" />
              <span>Create New Promo Voucher</span>
            </h3>

            <form onSubmit={handleCreatePromo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. EATFOODI30"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono font-black uppercase text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={promoType}
                    onChange={(e) => setPromoType(e.target.value as any)}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 outline-none"
                  >
                    <option value="pct">Percentage (%)</option>
                    <option value="flat">Flat Taka (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Value {promoType === 'pct' ? '(%)' : '(৳)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={promoVal}
                    onChange={(e) => setPromoVal(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max Discount (৳)</label>
                  <input
                    type="number"
                    value={promoMax}
                    onChange={(e) => setPromoMax(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Min Order (৳)</label>
                  <input
                    type="number"
                    value={promoMin}
                    onChange={(e) => setPromoMin(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Promo Voucher</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: RIDERS FLEET */}
      {activeTab === 'riders' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Delivery Fleet ({riders.length})
            </h3>

            <div className="space-y-3">
              {riders.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{r.name}</h4>
                      <p className="text-xs text-gray-500">
                        {r.phone} · {r.vehicleNo}
                      </p>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {r.totalDeliveries} deliveries completed · {r.rating || 5.0} ★
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={r.status}
                      onChange={(e) => onUpdateRider(r.id, { status: e.target.value as any })}
                      className={`text-xs font-bold px-2.5 py-1 rounded-md border outline-none ${
                        r.status === 'online'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : r.status === 'on-delivery'
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                    >
                      <option value="online">Online</option>
                      <option value="on-delivery">On Delivery</option>
                      <option value="offline">Offline</option>
                    </select>

                    <button
                      onClick={() => onDeleteRider(r.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition cursor-pointer"
                      title="Remove rider"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Rider Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#ef0909]" />
              <span>Enroll New Delivery Rider</span>
            </h3>

            <form onSubmit={handleCreateRider} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rider Full Name</label>
                <input
                  type="text"
                  required
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  placeholder="e.g. Mehedi Hasan"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={riderPhone}
                  onChange={(e) => setRiderPhone(e.target.value)}
                  placeholder="+88019XXXXXXXX"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Motorcycle Number Plate</label>
                <input
                  type="text"
                  value={riderVehicle}
                  onChange={(e) => setRiderVehicle(e.target.value)}
                  placeholder="Dhaka Metro-Ha 77-2101"
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Initial Status</label>
                <select
                  value={riderStatus}
                  onChange={(e) => setRiderStatus(e.target.value as any)}
                  className="w-full h-10 px-3 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 outline-none"
                >
                  <option value="online">Online (Available)</option>
                  <option value="offline">Offline</option>
                  <option value="on-delivery">On Delivery</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Register Delivery Partner</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE ORDERS MONITOR */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
            <span>Customer Orders Queue ({orders.length})</span>
            <span className="text-xs text-gray-500 font-normal">
              Click status to advance or update in real-time
            </span>
          </h3>

          {orders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {orders.map((o) => (
                <div key={o.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-gray-900">#{o.id}</span>
                      <span className="text-xs font-bold text-gray-600">· {o.userName || 'Customer'}</span>
                      <span className="text-xs text-gray-400">({o.userPhone || '01XXXXXXXXX'})</span>
                    </div>

                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{o.items.map((it) => `${it.name} (x${it.qty})`).join(', ')}</span>
                      <span>· Deliver to: {o.address}</span>
                      <span>· Paid via: {o.payment.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-base font-black text-[#ef0909]">৳{o.totals.total}</div>
                      <div className="text-[11px] text-gray-400">
                        {new Date(o.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Status Advance Controls */}
                    <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
                      {([0, 1, 2, 3] as OrderStatusStep[]).map((stepVal) => {
                        const isCurrent = o.status === stepVal;
                        const label = ['Placed', 'Kitchen', 'On Way', 'Delivered'][stepVal];
                        return (
                          <button
                            key={stepVal}
                            onClick={() => onUpdateOrderStatus(o.id, stepVal)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                              isCurrent
                                ? 'bg-[#ef0909] text-white shadow-xs'
                                : 'text-gray-600 hover:bg-white'
                            }`}
                            title={`Set status to ${label}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-gray-400">
              No orders placed in this session yet. Orders placed by customers will appear here live!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
