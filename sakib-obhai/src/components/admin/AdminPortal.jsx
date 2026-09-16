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
    'OBHAI-TKT-7401': 130,
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
    showToast(`✅ ওভাই প্রাইসিং আপডেট সম্পন্ন: ${formData.couponCode} (${formData.storeDiscount}% ডিসকাউন্ট, সর্বোচ্চ ৳ ${formData.bkashCashback}) সচল করা হয়েছে!`);
    setTimeout(() => {
      setAppliedAnim(false);
    }, 1800);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCode.trim() || !newDiscount) {
      showToast('অনুগ্রহ করে কুপন কোড ও ডিসকাউন্ট শতাংশ লিখুন', 'error');
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
        
        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-black">
            ৳
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">মোট ট্রিপ বুকিং</span>
            <div className="text-lg font-black text-gray-900 dark:text-white">৳ ১,৬৪,৩৫০</div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">↑ ২২.৪% বৃদ্ধি</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">সক্রিয় ওভাই বহর</span>
            <div className="text-lg font-black text-gray-900 dark:text-white">৪১৮ টি গাড়ি অনলাইন</div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">সিএনজি, বাইক ও প্রাইম</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <Tag size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">সক্রিয় মেগা অফার</span>
            <div className="text-sm font-black text-gray-900 truncate dark:text-white">
              {adminPricing.couponCode} ({adminPricing.storeDiscount}% OFF)
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
              ৳ {adminPricing.bkashCashback} বিকাশ ক্যাশব্যাক
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">যাত্রী অভিযোগ ও বিরোধ</span>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">
              {pendingDisputesCount} টি অমীমাংসিত
            </div>
            <span className="text-[10px] font-bold text-gray-500">রিভিউ প্রয়োজন</span>
          </div>
        </div>

      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Column 1 (4 cols): Your Pricing Inputs (Company Control Panel) */}
        <div className="lg:col-span-4 rounded-3xl border-2 border-emerald-600 bg-white p-6 shadow-xl dark:border-emerald-500 dark:bg-neutral-900">
          
          <div className="mb-4">
            <h2 className="text-lg font-black text-emerald-800 dark:text-emerald-400 leading-tight">Your Pricing Inputs</h2>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">(Company Control Panel)</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Adjust your offer parameters</p>
          </div>

          <form onSubmit={handleApplyPricing} className="space-y-3.5">
            
            {/* Store Discount */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Store Discount (ডিসকাউন্ট)</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.storeDiscount}
                  onChange={(e) => handlePricingChange('storeDiscount', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">%</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">বর্তমান: {formData.storeDiscount}% off</span>
            </div>

            {/* Coupon Code */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Coupon Code (কুপন কোড)</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handlePricingChange('couponCode', e.target.value)}
                  className="w-full uppercase rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <span className="text-[10px] font-medium text-gray-400">বর্তমান: {formData.couponCode}</span>
            </div>

            {/* bKash Cashback */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>bKash Cashback (বিকাশ ক্যাশব্যাক)</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.bkashCashback}
                  onChange={(e) => handlePricingChange('bkashCashback', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">৳</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">বর্তমান: ৳ {formData.bkashCashback}</span>
            </div>

            {/* Shipping Cost / Surge */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Shipping Cost / Surge (সার্জ চার্জ)</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.shippingCost}
                  onChange={(e) => handlePricingChange('shippingCost', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">৳</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">
                বর্তমান: {formData.shippingCost === 0 ? 'ফ্রি ডেলিভারি / ৳ ০ সার্জ' : `৳ ${formData.shippingCost} সার্জ চার্জ`}
              </span>
            </div>

            {/* Sale Price */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-neutral-300">
                <label>Sale Price (রেফারেন্স প্যাকেজ)</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="relative mt-1">
                <input
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handlePricingChange('salePrice', e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-xs font-extrabold text-gray-900 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <span className="absolute right-3.5 top-2 text-xs font-bold text-gray-400">৳</span>
              </div>
              <span className="text-[10px] font-medium text-gray-400">বর্তমান: ৳ {formData.salePrice.toLocaleString()}</span>
            </div>

            {/* Apply Button with confirmation animation */}
            <button
              type="submit"
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold text-white shadow-lg transition duration-200 ${
                appliedAnim ? 'bg-green-600 scale-[1.02]' : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              {appliedAnim ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>✅ সফলভাবে সংরক্ষিত ও সচল হয়েছে!</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  <span>🔄 পরিবর্তনগুলো প্রয়োগ করুন (Apply Changes)</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] font-medium text-gray-400">রিয়েল-টাইমে যাত্রী প্যানেলে আপডেট হবে</p>
          </form>
        </div>

        {/* Column 2 (4 cols): Coupon & Promo Manager */}
        <div className="lg:col-span-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">🎟️ কুপন ও প্রোমো ম্যানেজার</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400">সকল যাত্রীদের জন্য নতুন ডিসকাউন্ট কোড তৈরি ও নিয়ন্ত্রণ করুন</p>
          </div>

          {/* Create New Promo Code Box */}
          <form onSubmit={handleCreateCoupon} className="mt-4 rounded-2xl bg-emerald-50/50 p-3.5 space-y-2.5 dark:bg-neutral-800/60 border border-emerald-100 dark:border-neutral-700">
            <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300">+ নতুন প্রোমো কোড পাবলিশ করুন</span>
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="কুপন (e.g. DHAKA25)"
                className="col-span-5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold uppercase dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <input
                type="number"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="ছাড় %"
                className="col-span-3 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-bold dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <button
                type="submit"
                className="col-span-4 rounded-lg bg-emerald-700 px-2 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800 shadow-sm"
              >
                + পাবলিশ
              </button>
            </div>
          </form>

          {/* Live Reactive Coupons Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:border-neutral-800">
                  <th className="pb-2">কোড</th>
                  <th className="pb-2">ছাড়</th>
                  <th className="pb-2">সর্বোচ্চ</th>
                  <th className="pb-2">স্ট্যাটাস</th>
                  <th className="pb-2 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {coupons.map((c, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/30 dark:hover:bg-neutral-800/40">
                    <td className="py-2.5 font-mono font-bold text-gray-900 dark:text-white">{c.code}</td>
                    <td className="py-2.5 font-bold text-emerald-700 dark:text-emerald-400">{c.discount}% OFF</td>
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
                        মুছুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 3 (4 cols): Customer Disputes & Refunds Inbox */}
        <div className="lg:col-span-4 rounded-3xl border border-emerald-100 bg-white p-6 shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white">🎧 কাস্টমার বিরোধ ও রিফান্ড ইনবক্স</h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400">অভিযোগ যাচাই করুন এবং সরাসরি ওয়ালেটে টাকা রিফান্ড দিন</p>
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
                  সমস্যা: <span className="text-emerald-800 dark:text-emerald-400 font-extrabold">{d.category}</span> • <span className="text-gray-400">{d.tripId}</span>
                </div>

                <p className="rounded-xl bg-white p-2.5 text-gray-600 shadow-sm dark:bg-neutral-900 dark:text-neutral-300 italic border border-gray-100 dark:border-neutral-800">
                  "{d.details}"
                </p>

                {d.status === 'PENDING' ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-neutral-400">রিফান্ড পরিমাণ (৳):</label>
                      <input
                        type="number"
                        value={refundAmounts[d.id] ?? d.refundAmount}
                        onChange={(e) => setRefundAmounts({ ...refundAmounts, [d.id]: e.target.value })}
                        className="w-24 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-extrabold dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={() => resolveDispute(d.id, refundAmounts[d.id] ?? d.refundAmount)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-700 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-emerald-800"
                    >
                      <CheckCircle2 size={14} />
                      <span>সমাধান করুন ও ৳ {refundAmounts[d.id] ?? d.refundAmount} রিফান্ড দিন</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 pt-1">
                    <CheckCircle2 size={13} />
                    <span>সমাধানকৃত: ৳ {d.refundAmount.toFixed(2)} যাত্রীর ওয়ালেটে যুক্ত হয়েছে।</span>
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
