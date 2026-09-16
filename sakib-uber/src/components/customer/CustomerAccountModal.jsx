import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Tag, ShieldAlert, Wallet, Plus, CheckCircle2, Clock } from 'lucide-react';

export const CustomerAccountModal = ({ isOpen, onClose, initialTab = 'coupons' }) => {
  const { customer, coupons, applyCoupon, topupWallet, disputes, submitComplaint, adminPricing } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Dispute form state
  const [category, setCategory] = useState('Driver Overcharged');
  const [tripId, setTripId] = useState('TRIP-8492 (Gulshan ➔ Airport)');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmitDispute = (e) => {
    e.preventDefault();
    if (!details.trim()) return;
    submitComplaint(category, tripId, details);
    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl text-white dark:bg-white dark:text-black">
              👤
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{customer.name}</h3>
              <p className="text-xs font-semibold text-gray-500 dark:text-neutral-400">{customer.phone} • Verified Passenger</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Uber Cash</span>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                ৳ {customer.walletBalance.toFixed(2)}
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 px-6 pt-2 dark:border-neutral-800">
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'coupons'
                ? 'border-black text-black dark:border-white dark:text-white'
                : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-neutral-300'
            }`}
          >
            <Tag size={15} />
            <span>Promo Coupons & Discounts</span>
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'wallet'
                ? 'border-black text-black dark:border-white dark:text-white'
                : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-neutral-300'
            }`}
          >
            <Wallet size={15} />
            <span>Uber Cash & Top Up</span>
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold transition-all ${
              activeTab === 'disputes'
                ? 'border-black text-black dark:border-white dark:text-white'
                : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-neutral-300'
            }`}
          >
            <ShieldAlert size={15} />
            <span>Disputes & Help Inbox</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Tab 1: Coupons */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Active Promo Coupons</h4>
                  <p className="text-xs text-gray-500">Apply a coupon to get discounts on your ride fares</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {coupons.length} Active Codes
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {coupons.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 transition-all hover:border-black dark:border-neutral-700 dark:bg-neutral-800/60 dark:hover:border-white"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-black px-2 py-0.5 font-mono text-xs font-extrabold text-white dark:bg-white dark:text-black">
                          {c.code}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          {c.discount}% OFF
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-gray-700 dark:text-neutral-200">{c.title}</p>
                      <p className="text-[11px] text-gray-400">Max savings up to ৳ {c.maxCap}</p>
                    </div>

                    <button
                      onClick={() => {
                        applyCoupon(c);
                        onClose();
                      }}
                      className="mt-3 w-full rounded-xl bg-black py-2 text-xs font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                      Apply to Ride
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Wallet */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 text-white shadow-lg dark:border-neutral-700">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Available Balance</span>
                <div className="mt-1 text-3xl font-black">৳ {customer.walletBalance.toFixed(2)}</div>
                <p className="mt-2 text-xs text-gray-300">Auto-applied to rides and dispute refunds are credited directly here.</p>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Quick Top-Up Options</h4>
                <p className="text-xs text-gray-500">Add funds instantly using bKash, Nagad or Card</p>

                <div className="mt-3 flex flex-wrap gap-3">
                  {[200, 500, 1000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => topupWallet(amt)}
                      className="flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-xs font-bold text-gray-800 transition hover:border-black hover:bg-black hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                    >
                      <Plus size={14} />
                      <span>Top Up ৳ {amt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Disputes */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Submit a Complaint / Request Refund</h4>
                <p className="text-xs text-gray-500">Our Admin HQ will review and credit refund directly to your Uber Cash</p>

                <form onSubmit={handleSubmitDispute} className="mt-4 space-y-3 rounded-2xl bg-gray-50 p-4 dark:bg-neutral-800">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 dark:text-neutral-400">Issue Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                      >
                        <option value="Driver Overcharged">Driver Overcharged</option>
                        <option value="AC Broken / Non-functional">AC Broken / Non-functional</option>
                        <option value="Route Deviation / Delay">Route Deviation / Delay</option>
                        <option value="Rude Behavior">Rude Behavior</option>
                        <option value="Wrong Pickup Location">Wrong Pickup Location</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600 dark:text-neutral-400">Trip Reference</label>
                      <input
                        type="text"
                        value={tripId}
                        onChange={(e) => setTripId(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-600 dark:text-neutral-400">Details</label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Describe what happened during your trip..."
                      rows={2}
                      required
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-black py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    Submit Dispute to Admin HQ
                  </button>
                </form>
              </div>

              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Ticket History</h4>
                <div className="mt-2.5 space-y-2">
                  {disputes.map(d => (
                    <div
                      key={d.id}
                      className="rounded-2xl border border-gray-200 p-3.5 text-xs dark:border-neutral-800"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-gray-900 dark:text-white">{d.id} • {d.category}</span>
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
                      <p className="mt-1 text-gray-600 dark:text-neutral-300">"{d.details}"</p>
                      {d.status === 'RESOLVED' ? (
                        <div className="mt-2 flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={13} />
                          <span>Admin Refund of ৳ {d.refundAmount.toFixed(2)} Credited to Uber Cash!</span>
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                          <Clock size={13} />
                          <span>Under review by Company Admin HQ</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
