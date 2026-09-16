import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  MapPin,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Smartphone,
  Banknote,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { CartItem, PaymentMethod, PromoCode } from '../types.js';

interface CartViewProps {
  cart: CartItem[];
  currentLocation: string;
  onUpdateQty: (itemId: number, delta: number) => void;
  onRemoveItem: (itemId: number) => void;
  onClearCart: () => void;
  onApplyPromo: (code: string) => Promise<{ valid: boolean; discount: number; message?: string }>;
  onProceedToPayment: (details: {
    address: string;
    notes: string;
    payment: PaymentMethod;
    totals: { sub: number; fee: number; vat: number; disc: number; total: number };
  }) => void;
  onNavigateHome: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  currentLocation,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onApplyPromo,
  onProceedToPayment,
  onNavigateHome,
}) => {
  const [address, setAddress] = useState(currentLocation || 'Dhanmondi, Dhaka');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = cart.length > 0 ? Math.max(...cart.map((c) => c.fee)) : 0;
  const vat = Math.round(subtotal * 0.05);
  const discount = appliedPromo ? appliedPromo.discount : 0;
  const total = Math.max(0, subtotal + deliveryFee + vat - discount);

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setIsApplyingPromo(true);
    setPromoError('');

    try {
      const result = await onApplyPromo(code);
      if (result.valid) {
        setAppliedPromo({ code, discount: result.discount });
        setPromoError('');
      } else {
        setPromoError(result.message || 'Invalid promo code');
        setAppliedPromo(null);
      }
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleProceed = () => {
    if (!address.trim()) {
      alert('Please provide a delivery address');
      return;
    }
    onProceedToPayment({
      address: address.trim(),
      notes: notes.trim(),
      payment: paymentMethod,
      totals: {
        sub: subtotal,
        fee: deliveryFee,
        vat,
        disc: discount,
        total,
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 max-w-xl mx-auto p-8 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#ef0909] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h3>
        <p className="text-sm text-gray-500 mb-6">
          Explore top restaurants in Dhaka and add your favorite meals to get started!
        </p>
        <button
          onClick={onNavigateHome}
          className="px-6 py-3 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-sm shadow-md shadow-[#ef0909]/20 transition cursor-pointer"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2.5">
          <ShoppingBag className="w-6 h-6 text-[#ef0909]" />
          <span>Checkout &amp; Order</span>
        </h2>
        <button
          onClick={onClearCart}
          className="text-xs text-gray-500 hover:text-red-600 font-semibold cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cart Items & Delivery Details */}
        <div className="lg:col-span-7 space-y-5">
          {/* Cart Items Box */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Items ({cart.reduce((s, c) => s + c.qty, 0)})
            </h3>

            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.itemId} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{item.restName}</p>
                    <div className="text-sm font-bold text-[#ef0909] mt-1">
                      ৳{item.price * item.qty}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                      <button
                        onClick={() => onUpdateQty(item.itemId, -1)}
                        className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center hover:bg-red-50 hover:text-[#ef0909] transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-gray-900">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.itemId, 1)}
                        className="w-6 h-6 rounded bg-[#ef0909] text-white flex items-center justify-center hover:bg-[#d80707] transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.itemId)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-md transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Box */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#ef0909]" />
              <span>Delivery Address</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Exact Street / House / Area
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Road #, Area, City (e.g. House 14, Road 7, Dhanmondi, Dhaka)"
                className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span>Delivery Notes / Instructions (optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Floor number, lift instructions, landmark, or gate code..."
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none resize-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Payment Method</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'bkash'
                    ? 'border-[#e2136e] bg-[#e2136e]/5 text-[#e2136e] font-bold shadow-xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-bold">bKash</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'nagad'
                    ? 'border-[#f7941d] bg-[#f7941d]/5 text-[#f7941d] font-bold shadow-xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-bold">Nagad</span>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold shadow-xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Card</span>
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold shadow-xs'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold">Cash</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Summary & Promo Checkout */}
        <div className="lg:col-span-5 space-y-5">
          {/* Promo Box */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#ef0909]" />
              <span>Have a Promo Voucher?</span>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="e.g. WELCOME50, BOGOFOOD"
                className="flex-1 h-10 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold uppercase text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isApplyingPromo}
                className="px-4 h-10 rounded-xl bg-[#171717] hover:bg-gray-800 text-white text-xs font-bold cursor-pointer transition shrink-0"
              >
                {isApplyingPromo ? 'Checking...' : 'Apply'}
              </button>
            </div>

            {appliedPromo && (
              <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between text-xs text-green-800 font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>{appliedPromo.code} applied! Saved ৳{appliedPromo.discount}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(null)}
                  className="text-xs text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {promoError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-1.5 text-xs text-red-700 font-medium">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{promoError}</span>
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">৳{subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Standard Delivery Fee</span>
                <span className="font-bold text-gray-900">৳{deliveryFee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Government VAT (5%)</span>
                <span className="font-bold text-gray-900">৳{vat}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>Promo Discount</span>
                  <span>-৳{discount}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-base sm:text-lg font-black text-gray-900">
                <span>Total Amount</span>
                <span className="text-[#ef0909]">৳{total}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full h-13 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#ef0909]/25 transition cursor-pointer"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-[11px] text-center text-gray-400 font-medium">
              🔒 256-Bit SSL Encrypted &amp; Secure Payment Gateway
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
