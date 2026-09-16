import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Store,
  Sparkles,
  Check,
} from 'lucide-react';
import { User as UserType, UserRole } from '../types.js';
import { FoodiLogo } from './FoodiLogo.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  defaultRole?: UserRole;
  initialStep?: 'choose-role' | 'form';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultRole = 'customer',
  initialStep = 'choose-role',
}) => {
  const [step, setStep] = useState<'choose-role' | 'form'>(initialStep);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('user@foodi.bd');
  const [loginPassword, setLoginPassword] = useState('foodi123');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync props on opening
  useEffect(() => {
    if (isOpen) {
      setRole(defaultRole);
      setStep(initialStep);
      setErrorMsg('');
      if (defaultRole === 'admin') {
        setLoginIdentifier('admin@foodi.bd');
        setLoginPassword('admin123');
        setTab('login');
      } else {
        setLoginIdentifier('user@foodi.bd');
        setLoginPassword('foodi123');
      }
    }
  }, [isOpen, defaultRole, initialStep]);

  if (!isOpen) return null;

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('form');
    setErrorMsg('');
    if (selectedRole === 'admin') {
      setLoginIdentifier('admin@foodi.bd');
      setLoginPassword('admin123');
      setTab('login');
    } else {
      setLoginIdentifier('user@foodi.bd');
      setLoginPassword('foodi123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter email/phone and password');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
          role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user);
        onClose();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Login failed. Please check your credentials.');
      }
    } catch {
      // Offline fallback
      const fallbackUser: UserType = {
        id: role === 'admin' ? 'usr_admin_1' : 'usr_customer_' + Date.now(),
        name: role === 'admin' ? 'Super Admin' : loginIdentifier.split('@')[0],
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@foodi.bd`,
        phone: loginIdentifier.includes('@') ? '01712345678' : loginIdentifier,
        role,
      };
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          role,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user);
        onClose();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Registration failed.');
      }
    } catch {
      const fallbackUser: UserType = {
        id: 'usr_' + Date.now(),
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim() || '01712345678',
        role,
      };
      onLoginSuccess(fallbackUser);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow-md flex items-center justify-center cursor-pointer transition"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Visual Cover with Authentic Foodi Logo */}
        <div
          className={`md:col-span-5 relative p-6 sm:p-8 flex flex-col justify-between text-white ${
            role === 'admin' && step === 'form'
              ? 'bg-gradient-to-br from-[#1a1a2e] via-[#2d2d44] to-[#ef0909]'
              : 'bg-gradient-to-br from-[#ef0909] via-[#d80707] to-[#1a1a2e]'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80')",
            }}
          />

          <div className="relative z-10">
            {/* Real Foodi App Logo in White on Red */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#ef0909] flex items-center justify-center shadow-lg p-2">
                <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                  <circle cx="24" cy="24" r="20" stroke="#ef0909" strokeWidth="4" />
                  <path
                    d="M18 12V21C18 23.5 20.2 25.5 22.7 25.5H25.3C27.8 25.5 30 23.5 30 21V12"
                    stroke="#ef0909"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <line x1="24" y1="12" x2="24" y2="25" stroke="#ef0909" strokeWidth="3" strokeLinecap="round" />
                  <line x1="24" y1="25.5" x2="24" y2="36" stroke="#ef0909" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className="text-3xl font-black tracking-tighter text-white">
                  foodi
                </span>
                <span className="block text-[10px] text-white/80 font-bold uppercase tracking-widest -mt-1">
                  Bangladesh
                </span>
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs mb-3">
              {step === 'choose-role'
                ? '✨ Select Portal'
                : role === 'admin'
                ? '🛡️ Foodi Admin Console'
                : '🍔 Customer Marketplace'}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
              {step === 'choose-role'
                ? 'Welcome to Foodi Delivery'
                : role === 'admin'
                ? 'Operations & Fleet Command'
                : 'Delicious Food Delivered Fast'}
            </h2>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {step === 'choose-role'
                ? 'Select whether you are ordering delicious food as a customer, or managing restaurants, riders and orders as an administrator.'
                : role === 'admin'
                ? 'Direct management of restaurant catalog, dish menus, active order queue, driver assignments, and promo discounts.'
                : 'Access 100+ authentic restaurants across Dhaka. Fast doorstep delivery, real-time GPS rider tracking, and verified reviews.'}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-2 pt-6 border-t border-white/20 mt-6 text-center">
            <div>
              <div className="text-base sm:text-lg font-black">5,000+</div>
              <div className="text-[10px] text-white/80">Restaurants</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black">2M+</div>
              <div className="text-[10px] text-white/80">Customers</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black">30 min</div>
              <div className="text-[10px] text-white/80">Live Delivery</div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          {/* STEP 1: BEFORE SIGN IN - CHOOSE SEPARATE OPTION (CUSTOMER VS ADMIN) */}
          {step === 'choose-role' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  Choose Account Type
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Select your role to access the Foodi platform:
                </p>
              </div>

              {/* Two Prominent Separate Option Cards */}
              <div className="space-y-3.5">
                {/* Option 1: Customer Card */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('customer')}
                  className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-red-100 hover:border-[#ef0909] bg-gradient-to-r from-white to-red-50/40 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#ef0909] text-white flex items-center justify-center shadow-md shadow-[#ef0909]/20 shrink-0 group-hover:scale-105 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#ef0909] transition-colors">
                          Customer Portal
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-100 text-[#ef0909]">
                          Food Delivery
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Order food, browse restaurants, track rider delivery via live GPS, and pay with bKash, Nagad, or Cash.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-100 text-[#ef0909] flex items-center justify-center shrink-0 group-hover:bg-[#ef0909] group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Option 2: Admin Card */}
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-gray-200 hover:border-[#1a1a2e] bg-gradient-to-r from-white to-gray-50/70 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] text-white flex items-center justify-center shadow-md shadow-black/20 shrink-0 group-hover:scale-105 transition-transform">
                      <Shield className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#1a1a2e] transition-colors">
                          Admin Operations Portal
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-gray-200 text-gray-800">
                          Manager Access
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Manage restaurants &amp; menus, monitor the incoming customer order queue, manage riders, and create vouchers.
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-[#1a1a2e] group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Quick Account Selection */}
              <div className="pt-2 text-center text-xs text-gray-500">
                <span>Select an account type above to continue with Customer or Administrator access.</span>
              </div>
            </div>
          ) : (
            /* STEP 2: SIGN IN / REGISTER FORM */
            <div>
              {/* Back to Role Selection Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep('choose-role')}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 transition cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role ({role === 'admin' ? 'Admin' : 'Customer'})</span>
                </button>

                <div className="flex items-center gap-1 text-xs">
                  <span className="text-gray-400">Selected:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase ${
                      role === 'admin'
                        ? 'bg-gray-100 text-[#1a1a2e]'
                        : 'bg-red-50 text-[#ef0909]'
                    }`}
                  >
                    {role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                  </span>
                </div>
              </div>

              {/* Role Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => handleSelectRole('customer')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    role === 'customer'
                      ? 'bg-white text-[#ef0909] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    role === 'admin'
                      ? 'bg-[#1a1a2e] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Portal</span>
                </button>
              </div>

              {/* Heading */}
              <div className="mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {role === 'admin'
                    ? 'Admin Portal Sign In'
                    : tab === 'login'
                    ? 'Customer Sign In'
                    : 'Create Customer Account'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {role === 'admin'
                    ? 'Enter administrator credentials to access platform controls'
                    : tab === 'login'
                    ? 'Sign in to order food and track deliveries'
                    : 'Create your Foodi account in seconds'}
                </p>
              </div>

              {/* Customer Mode: Sign In / Register Tab Toggle */}
              {role === 'customer' && (
                <div className="flex border-b border-gray-200 mb-4">
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className={`pb-2 px-4 font-bold text-xs sm:text-sm cursor-pointer border-b-2 transition ${
                      tab === 'login'
                        ? 'border-[#ef0909] text-[#ef0909]'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    className={`pb-2 px-4 font-bold text-xs sm:text-sm cursor-pointer border-b-2 transition ${
                      tab === 'register'
                        ? 'border-[#ef0909] text-[#ef0909]'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    New Register
                  </button>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Content */}
              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {role === 'admin' ? 'Admin Email' : 'Email or Phone Number'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder={role === 'admin' ? 'admin@foodi.bd' : 'user@foodi.bd or 017XXXXXXXX'}
                        className="w-full h-10.5 pl-10 pr-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] focus:ring-2 focus:ring-red-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          if (role === 'admin') {
                            setLoginIdentifier('admin@foodi.bd');
                            setLoginPassword('admin123');
                          } else {
                            setLoginIdentifier('user@foodi.bd');
                            setLoginPassword('foodi123');
                          }
                        }}
                        className="text-[11px] text-[#ef0909] hover:underline font-bold"
                      >
                        Auto-Fill
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full h-10.5 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] focus:ring-2 focus:ring-red-100 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-11 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-md ${
                      role === 'admin'
                        ? 'bg-[#1a1a2e] hover:bg-[#2d2d44] shadow-black/15'
                        : 'bg-[#ef0909] hover:bg-[#d80707] shadow-[#ef0909]/25'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>
                      {isLoading
                        ? 'Signing In...'
                        : role === 'admin'
                        ? 'Enter Admin Operations Panel'
                        : 'Sign In to Foodi'}
                    </span>
                  </button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Asif Mahmud"
                        className="w-full h-10 pl-10 pr-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full h-10 pl-10 pr-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full h-10 pl-10 pr-3.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full h-10 pl-10 pr-10 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#ef0909] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10.5 rounded-xl bg-[#ef0909] hover:bg-[#d80707] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-[#ef0909]/25"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isLoading ? 'Creating...' : 'Create Account'}</span>
                  </button>
                </form>
              )}

              {/* Quick Sign-In Accounts */}
              <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Registered Sign-In Accounts</span>
                  <span className="text-[9px] text-green-700 font-bold bg-green-100 px-1.5 py-0.2 rounded">
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('customer');
                      setLoginIdentifier('user@foodi.bd');
                      setLoginPassword('foodi123');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#ef0909] text-xs font-semibold text-gray-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-3 h-3 text-green-600" />
                    <span>Customer: user@foodi.bd</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('admin');
                      setLoginIdentifier('admin@foodi.bd');
                      setLoginPassword('admin123');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#1a1a2e] text-xs font-semibold text-gray-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Shield className="w-3 h-3 text-amber-500" />
                    <span>Admin: admin@foodi.bd</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
