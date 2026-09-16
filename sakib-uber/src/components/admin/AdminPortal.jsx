import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, Plus, Trash2, CheckCircle2, ShieldCheck, Tag, DollarSign, Users, AlertCircle, Info } from 'lucide-react';

export const AdminPortal = () => {
  const {
    adminPricing,
    updateAdminPricing,
    coupons,
    addCoupon,
    deleteCoupon,
    disputes,
    resolveDispute,
    showToast,
  } = useApp();

  // Controlled form state for Pricing Inputs
  const [formData, setFormData] = useState({
    storeDiscount: adminPricing.storeDiscount,
    couponCode: adminPricing.couponCode,
    bkashCashback: adminPricing.bkashCashback,
    shippingCost: adminPricing.shippingCost,
    salePrice: adminPricing.salePrice,
  });

  const [appliedAnim, setAppliedAnim] = useState(false);

  // New coupon form state
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newMaxCap, setNewMaxCap] = useState('');

  // Individual custom refund amounts for disputes
  const [refundAmounts, setRefundAmounts] = useState({
    'TKT-9201': 120,
  });

  // Handle live input typing in Pricing Card
  const handlePricingChange = (field, val) => {
    let parsedVal = val;
    if (field === 'couponCode') {
      parsedVal = val.toUpperCase();
    } else {
      parsedVal = parseFloat(val) || 0;
    }

    const updated = { ...formData, [field]: parsedVal };
    setFormData(updated);

    // Live update global context & sync with coupon table!
    updateAdminPricing(updated);
  };

  const handleApplyPricing = (e) => {
    e.preventDefault();
    updateAdminPricing(formData);
    setAppliedAnim(true);
    showToast(`✅ Pricing updated: ${formData.couponCode} (${formData.storeDiscount}% OFF, Max Cap ৳ ${formData.bkashCashback}) is now Live!`);
    setTimeout(() => {
      setAppliedAnim(false);
    }, 1800);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newDiscount) {
      showToast('Please enter coupon code and discount percentage', 'error');
      return;
    }
    addCoupon(newCode.trim(), newDiscount, newMaxCap || 150);
    setNewCode('');
    setNewDiscount('');
    setNewMaxCap('');
  };

  const pendingDisputesCount = disputes.filter(d => d.status === 'PENDING').length;

  return (
    <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        
        <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Gross Bookings</span>
            <div className="text-lg font-black text-gray-900 dark:text-white">৳ 1,48,250</div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ 18.4% vs last week</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Fleet</span>
            <div className="text-lg font-black text-gray-900 dark:text-white">342 Online</div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Dhaka North & South</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <Tag size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Campaign</span>
            <div className="text-sm font-black text-gray-900 truncate dark:text-white">
              {adminPricing.couponCode} ({adminPricing.storeDiscount}% OFF)
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
              ৳ {adminPricing.bkashCashback} bKash Cashback
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Customer Disputes</span>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">
              {pendingDisputesCount} Pending
            </div>
            <span className="text-[10px] font-bold text-gray-500">Requires review</span>
          </div>
        </div>

      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Column 1 (4 cols): Your Pricing Inputs (Company Control Panel) */}
        <div className="lg:col-span-4 rounded-3xl border-2 border-emerald-500 bg-white p-6 shadow-xl dark:border-emerald-600 dark:bg-neutral-900">
          
          <div className="mb-4">
            <h2 className="text-lg font-black text-emerald-700 dark:text-emerald-400 leading-tight">Your Pricing Inputs</h2>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">(Company Control Panel)</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Adjust your offer parameters</p>
          </div>

          <form onSubmit={handleApplyPricing} className="space-y-3.5">
            
            {/* Store Discount */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Store Discount</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.storeDiscount}
                  onChange={(e) => handlePricingChange('storeDiscount', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">%</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">Current: {formData.storeDiscount}% off</span>
            </div>

            {/* Coupon Code */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Coupon Code</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handlePricingChange('couponCode', e.target.value)}
                  className="w-full uppercase rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <span className="text-[10px] font-medium text-gray-400">Current: {formData.couponCode}</span>
            </div>

            {/* bKash Cashback */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>bKash Cashback</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.bkashCashback}
                  onChange={(e) => handlePricingChange('bkashCashback', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">৳</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">Current: ৳ {formData.bkashCashback}</span>
            </div>

            {/* Shipping Cost / Surge */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Shipping Cost / Surge</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.shippingCost}
                  onChange={(e) => handlePricingChange('shippingCost', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">৳</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">
                Current: {formData.shippingCost === 0 ? 'Free shipping / ৳ 0 Surge' : `৳ ${formData.shippingCost} Surge`}
              </span>
            </div>

            {/* Sale Price */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Sale Price (Optional)</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handlePricingChange('salePrice', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">৳</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">Current: ৳ {formData.salePrice.toLocaleString()}</span>
            </div>

            {/* Apply Button with confirmation animation */}
            <button
              type="submit"
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold text-white shadow-lg transition duration-200 ${
                appliedAnim ? 'bg-green-600 scale-[1.02]' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {appliedAnim ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>✅ Changes Applied & Saved!</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  <span>🔄 Apply Changes</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] font-medium text-gray-400">Changes reflect in real-time</p>
          </form>
        </div>

        {/* Column 2 (4 cols): Coupon & Promo Manager */}
        <div className="lg:col-span-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">🎟️ Coupon & Promo Manager</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Create and publish promo codes for all customers</p>
          </div>

          {/* Create New Promo Code Box */}
          <form onSubmit={handleCreateCoupon} className="mt-4 rounded-2xl bg-gray-50 p-3.5 space-y-2.5 dark:bg-neutral-800/60">
            <span className="text-[11px] font-bold text-gray-700 dark:text-neutral-300">+ Publish New Promo Code</span>
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="CODE (e.g. DHAKA25)"
                className="col-span-5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold uppercase dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <input
                type="number"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="Dis %"
                className="col-span-3 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <button
                type="submit"
                className="col-span-4 rounded-lg bg-black px-2 py-1.5 text-xs font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                + Publish
              </button>
            </div>
          </form>

          {/* Live Reactive Coupons Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:border-neutral-800">
                  <th className="pb-2">Code</th>
                  <th className="pb-2">Discount</th>
                  <th className="pb-2">Max Cap</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {coupons.map((c, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40">
                    <td className="py-2.5 font-mono font-bold text-gray-900 dark:text-white">{c.code}</td>
                    <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">{c.discount}% OFF</td>
                    <td className="py-2.5 font-semibold text-gray-600 dark:text-neutral-300">৳ {c.maxCap}</td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => deleteCoupon(idx)}
                        className="text-red-500 font-bold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 3 (4 cols): Customer Disputes & Refunds Inbox */}
        <div className="lg:col-span-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">🎧 Customer Disputes & Refunds</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400">Review customer complaints, issue refunds & credit wallets</p>
          </div>

          <div className="mt-4 space-y-3.5">
            {disputes.map(d => (
              <div
                key={d.id}
                className={`rounded-2xl border p-4 text-xs space-y-2.5 transition-all ${
                  d.status === 'RESOLVED'
                    ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-gray-200 bg-gray-50/70 dark:border-neutral-800 dark:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-gray-900 dark:text-white">👤 {d.userName}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      d.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>

                <div className="font-bold text-gray-700 dark:text-neutral-300">
                  Issue: <span className="text-black dark:text-white">{d.category}</span> • <span className="text-gray-400">{d.tripId}</span>
                </div>

                <p className="rounded-xl bg-white p-2.5 text-gray-600 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 italic">
                  "{d.details}"
                </p>

                {d.status === 'PENDING' ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-neutral-400">Credit Refund (৳):</label>
                      <input
                        type="number"
                        value={refundAmounts[d.id] ?? d.refundAmount}
                        onChange={(e) => setRefundAmounts({ ...refundAmounts, [d.id]: e.target.value })}
                        className="w-24 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-extrabold dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={() => resolveDispute(d.id, refundAmounts[d.id] ?? d.refundAmount)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={14} />
                      <span>Resolve & Credit ৳ {refundAmounts[d.id] ?? d.refundAmount} to Rider Wallet</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                    <CheckCircle2 size={13} />
                    <span>Resolved: ৳ {d.refundAmount.toFixed(2)} refunded to rider wallet.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
