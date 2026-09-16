import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Wallet, Tag, AlertTriangle, Plus, Check, Clock, ChevronRight, ShieldAlert } from 'lucide-react';

export const CustomerAccountModal = ({ isOpen, onClose, initialTab = 'coupons' }) => {
  const {
    customer,
    topupWallet,
    coupons,
    applyCoupon,
    disputes,
    submitComplaint,
    adminPricing,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [topupInput, setTopupInput] = useState('500');
  
  // Dispute Form
  const [disputeCategory, setDisputeCategory] = useState('CNG Meter Disconnected');
  const [disputeTripId, setDisputeTripId] = useState('OBHAI-CNG-8492 (মিরপুর ১০ ➔ ফার্মগেট)');
  const [disputeDetails, setDisputeDetails] = useState('');

  if (!isOpen) return null;

  const handleTopup = (e) => {
    e.preventDefault();
    const amt = parseFloat(topupInput);
    if (amt > 0) {
      topupWallet(amt);
      showToast(`৳ ${amt} ওয়ালেটে রিচার্জ সম্পন্ন হয়েছে!`);
    }
  };

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!disputeDetails.trim()) {
      showToast('অনুগ্রহ করে অভিযোগের বিস্তারিত লিখুন', 'error');
      return;
    }
    submitComplaint(disputeCategory, disputeTripId, disputeDetails);
    setDisputeDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="flex h-[90vh] max-h-[640px] w-full max-w-2xl flex-col rounded-3xl border border-emerald-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-100 px-6 py-4 dark:border-neutral-800 bg-emerald-50/50 dark:bg-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white font-black text-base shadow-sm">
              ও
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{customer.name}</h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400">{customer.phone} • ওভাই রিওয়ার্ডস: {customer.milesPoints} পয়েন্ট</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-emerald-100 px-6 bg-white dark:bg-neutral-900 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-black transition ${
              activeTab === 'coupons'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Tag size={15} />
            <span>প্রোমো ও কুপন ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-black transition ${
              activeTab === 'wallet'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Wallet size={15} />
            <span>ওভাই পে ওয়ালেট (৳ {Math.round(customer.walletBalance)})</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 text-xs font-black transition ${
              activeTab === 'disputes'
                ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle size={15} />
            <span>অভিযোগ ও রিফান্ড ({disputes.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Tab 1: Coupons */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">উপলব্ধ প্রোমো কোড ও ডিসকাউন্ট</h4>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">রাইড বুক করার আগে ডিসকাউন্ট কুপন যুক্ত করুন</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {adminPricing.storeDiscount}% সার্বজনীন ছাড়
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {coupons.map((c, i) => {
                  const isApplied = customer.appliedCoupon?.code === c.code;
                  return (
                    <div
                      key={i}
                      className={`relative flex flex-col justify-between rounded-2xl border p-4 transition ${
                        isApplied
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm dark:bg-emerald-950/40 dark:border-emerald-400'
                          : 'border-gray-200 bg-gray-50/60 hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-emerald-700 px-2 py-0.5 font-mono text-xs font-extrabold text-white">
                            {c.code}
                          </span>
                          <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                            {c.discount}% ছাড়
                          </span>
                        </div>
                        <h5 className="mt-2 text-xs font-extrabold text-gray-900 dark:text-white">{c.title}</h5>
                        <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                          সর্বোচ্চ সাশ্রয়: ৳ {c.maxCap} টাকা
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-gray-100 dark:border-neutral-700/60">
                        {isApplied ? (
                          <div className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white">
                            <Check size={14} /> কুপন সক্রিয় আছে
                          </div>
                        ) : (
                          <button
                            onClick={() => applyCoupon(c)}
                            className="w-full rounded-xl bg-gray-900 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 dark:bg-white dark:text-black dark:hover:bg-emerald-300"
                          >
                            কুপন যুক্ত করুন
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Wallet */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-neutral-900 p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">ওভাই পে ওয়ালেট ব্যালেন্স</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold">সক্রিয়</span>
                </div>
                <div className="mt-3 text-3xl font-black">
                  ৳ {customer.walletBalance.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-emerald-200">
                  বিকাশ ক্যাশব্যাক ৳ {adminPricing.bkashCashback} যেকোনো নতুন টপ-আপে প্রযোজ্য
                </p>
              </div>

              {/* Topup Form */}
              <form onSubmit={handleTopup} className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-neutral-300">
                  ওয়ালেট রিচার্জ করুন (bKash / Nagad / Card)
                </h4>
                
                <div className="flex gap-2">
                  {['200', '500', '1000', '2000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTopupInput(val)}
                      className={`flex-1 rounded-xl border py-2 text-xs font-extrabold transition ${
                        topupInput === val
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      ৳ {val}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="number"
                    value={topupInput}
                    onChange={(e) => setTopupInput(e.target.value)}
                    placeholder="টাকার পরিমাণ লিখুন..."
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-xl bg-emerald-700 px-5 py-2 text-xs font-extrabold text-white hover:bg-emerald-800 transition shadow-md"
                  >
                    <Plus size={14} /> রিচার্জ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Disputes */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              
              {/* Submit Form */}
              <form onSubmit={handleDisputeSubmit} className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} className="text-emerald-700 dark:text-emerald-400" />
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                    নতুন অভিযোগ দায়ের ও রিফান্ড আবেদন
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">অভিযোগের ধরন</label>
                    <select
                      value={disputeCategory}
                      onChange={(e) => setDisputeCategory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-bold text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    >
                      <option value="CNG Meter Disconnected">সিএনজি মিটার ব্যবহার করেনি (Meter Issue)</option>
                      <option value="Driver Overcharged">অতিরিক্ত ভাড়া দাবি করেছে (Overcharge)</option>
                      <option value="AC Broken">কার এসি চালু করেনি (AC Issue)</option>
                      <option value="Driver Behavior">চালকের অসদাচরণ (Behavior)</option>
                      <option value="Wrong Route">অহেতুক দীর্ঘ রুট নিয়েছে (Wrong Route)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">ট্রিপ আইডি ও রুট</label>
                    <input
                      type="text"
                      value={disputeTripId}
                      onChange={(e) => setDisputeTripId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-bold text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">বিস্তারিত বিবরণ</label>
                  <textarea
                    rows={2}
                    value={disputeDetails}
                    onChange={(e) => setDisputeDetails(e.target.value)}
                    placeholder="কি সমস্যা হয়েছিল বিস্তারিত লিখুন..."
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2 text-xs font-bold text-gray-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 px-5 py-2 text-xs font-extrabold text-white hover:bg-emerald-800 transition shadow-md"
                >
                  অভিযোগ দাখিল করুন
                </button>
              </form>

              {/* Tickets List */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">আপনার অভিযোগের স্ট্যাটাস ({disputes.length})</h4>
                {disputes.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-850"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-gray-500">{d.id}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          d.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {d.status === 'RESOLVED' ? 'সমাধানকৃত (RESOLVED)' : 'পর্যালোচনাধীন (PENDING)'}
                      </span>
                    </div>

                    <h5 className="mt-1 text-xs font-black text-gray-900 dark:text-white">{d.category} - {d.tripId}</h5>
                    <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">{d.details}</p>

                    {d.status === 'RESOLVED' && (
                      <div className="mt-2 rounded-xl bg-emerald-50 p-2 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {d.adminNote || `৳ ${d.refundAmount} রিফান্ড আপনার ওয়ালেটে জমা হয়েছে।`}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
