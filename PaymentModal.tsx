import React, { useState } from 'react';
import {
  X,
  Lock,
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod } from '../types.js';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  method: PaymentMethod;
  amount: number;
  onPaymentSuccess: (paymentData: {
    method: PaymentMethod;
    transactionId: string;
    accountOrCard: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  method,
  amount,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'input' | 'otp' | 'processing' | 'success'>('input');
  const [walletPhone, setWalletPhone] = useState('01712345678');
  const [pin, setPin] = useState('1234');
  const [otp, setOtp] = useState('123456');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('889');
  const [cardName, setCardName] = useState('Tanvir Ahmed');

  if (!isOpen) return null;

  const handleFormatCard = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 16);
    const formatted = clean.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleFormatExp = (val: string) => {
    let clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length >= 3) {
      clean = clean.substring(0, 2) + '/' + clean.substring(2);
    }
    setCardExp(clean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ((method === 'bkash' || method === 'nagad') && step === 'input') {
      setStep('otp');
      return;
    }

    setStep('processing');

    setTimeout(() => {
      setStep('success');

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      const prefix = method === 'bkash' ? 'BKS' : method === 'nagad' ? 'NGD' : method === 'card' ? 'CRD' : 'COD';
      const txnId = `${prefix}-${Date.now().toString().slice(-8)}`;

      setTimeout(() => {
        onPaymentSuccess({
          method,
          transactionId: txnId,
          accountOrCard: method === 'card' ? cardNumber : walletPhone,
        });
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Branding */}
        <div
          className={`p-5 text-white flex items-center justify-between ${
            method === 'bkash'
              ? 'bg-[#e2136e]'
              : method === 'nagad'
              ? 'bg-[#f7941d]'
              : method === 'card'
              ? 'bg-blue-600'
              : 'bg-emerald-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              {method === 'card' ? (
                <CreditCard className="w-4 h-4" />
              ) : method === 'cod' ? (
                <Banknote className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-base font-extrabold capitalize">
                {method === 'bkash'
                  ? 'bKash Merchant Gateway'
                  : method === 'nagad'
                  ? 'Nagad Payment Gateway'
                  : method === 'card'
                  ? 'Secure Card Gateway'
                  : 'Cash on Delivery'}
              </h4>
              <p className="text-xs text-white/80">Total Payable: ৳{amount}</p>
            </div>
          </div>

          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'processing' ? (
            <div className="py-10 text-center space-y-3">
              <Loader2 className="w-12 h-12 text-[#ef0909] animate-spin mx-auto" />
              <h4 className="text-base font-bold text-gray-900">
                Verifying Secure Transaction...
              </h4>
              <p className="text-xs text-gray-500">
                Connecting to Bangladesh banking gateway. Please do not close this window.
              </p>
            </div>
          ) : step === 'success' ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Payment Verified!</h4>
              <p className="text-xs text-gray-500">
                Transaction confirmed. Loading your live order tracking...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* bKash / Nagad Flow */}
              {(method === 'bkash' || method === 'nagad') && (
                <>
                  {step === 'input' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {method === 'bkash' ? 'bKash' : 'Nagad'} Account Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={walletPhone}
                          onChange={(e) => setWalletPhone(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                        />
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          You will receive a 6-digit verification code.
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Enter Verification Code (OTP)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-center font-mono font-bold text-base tracking-widest text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                        />
                        <span className="text-[11px] text-green-600 font-medium mt-1 block">
                          Verification OTP: 123456
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Account PIN
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={5}
                          value={pin}
                          onChange={(e) => setPin(e.target.value)}
                          placeholder="****"
                          className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-center font-mono font-bold text-base tracking-widest text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Credit/Debit Card Flow */}
              {method === 'card' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => handleFormatCard(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono font-bold text-gray-900 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => handleFormatExp(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-center text-sm font-mono font-bold text-gray-900 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-center text-sm font-mono font-bold text-gray-900 focus:bg-white focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Full Name as on card"
                      className="w-full h-11 px-3.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>
                </>
              )}

              {/* COD Flow */}
              {method === 'cod' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Pay ৳{amount} upon Delivery</span>
                  </div>
                  <p className="text-emerald-700 leading-relaxed">
                    Our verified delivery rider will bring your hot meal. You can pay with cash or digital bKash QR scan when the package arrives.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full h-12 rounded-xl text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2 ${
                  method === 'bkash'
                    ? 'bg-[#e2136e] hover:bg-[#c40f5f]'
                    : method === 'nagad'
                    ? 'bg-[#f7941d] hover:bg-[#e07f0f]'
                    : method === 'card'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>
                  {step === 'otp'
                    ? 'Verify & Confirm Payment'
                    : `Confirm & Pay ৳${amount}`}
                </span>
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-end encrypted secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
