import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Default Constants for OBHAI
const DEFAULT_PRICING = {
  storeDiscount: 10,       // 10%
  couponCode: 'OBHAI10',   // OBHAI10
  bkashCashback: 150,      // ৳ 150
  shippingCost: 0,         // ৳ 0 Surge
  salePrice: 2050,         // ৳ 2,050
};

const DEFAULT_COUPONS = [
  { code: 'OBHAI10', discount: 10, maxCap: 150, status: 'Active', title: '১০% ওভাই প্ল্যাটফর্ম ডিসকাউন্ট' },
  { code: 'CNG25', discount: 25, maxCap: 80, status: 'Active', title: '৳ ৮০ ডিজিটাল সিএনজি মিটার সেভার' },
  { code: 'MOTO50', discount: 50, maxCap: 60, status: 'Active', title: '৫০% প্রথম ওভাই বাইক রাইড' },
  { code: 'PRIME20', discount: 20, maxCap: 120, status: 'Active', title: '২০% এসি প্রাইম কার অফার' },
  { code: 'SEBA100', discount: 15, maxCap: 200, status: 'Active', title: '৳ ২০০ ওভাই সেবা ইমার্জেন্সি রিবেট' },
];

export const DHAKA_LOCATIONS = [
  { id: 'mirpur10', name: 'Mirpur 10 Roundabout (মিরপুর ১০)', nameBn: 'মিরপুর ১০ গোলচত্বর', area: 'Mirpur Central', landmark: 'Mirpur 10 Metro Station & Stadium', lat: 23.8069, lng: 90.3687 },
  { id: 'farmgate', name: 'Farmgate & Karwan Bazar (ফার্মগেট)', nameBn: 'ফার্মগেট ও কারওয়ান বাজার', area: 'Tejgaon / Central', landmark: 'Farmgate Metro & Ananda Cinema', lat: 23.7570, lng: 90.3900 },
  { id: 'gulshan2', name: 'Gulshan 2 Circle (গুলশান ২)', nameBn: 'গুলশান ২ সার্কেল', area: 'Gulshan North', landmark: 'Gulshan 2 Circle & Diplomatic Zone', lat: 23.7925, lng: 90.4078 },
  { id: 'gulshan1', name: 'Gulshan 1 Circle (গুলশান ১)', nameBn: 'গুলশান ১ সার্কেল', area: 'Gulshan South', landmark: 'Gulshan 1 DCC Market & Police Plaza', lat: 23.7785, lng: 90.4172 },
  { id: 'banani11', name: 'Road 11, Banani (বনানী ১১)', nameBn: 'রোড ১১, বনানী', area: 'Banani C/A', landmark: 'Food Street, Kemal Ataturk Ave', lat: 23.7937, lng: 90.4048 },
  { id: 'dhanmondi27', name: 'Dhanmondi 27 (ধানমন্ডি ২৭)', nameBn: 'ধানমন্ডি ২৭ (পুরাতন)', area: 'Dhanmondi R/A', landmark: 'Old 27, Rapa Plaza & Mirpur Rd', lat: 23.7510, lng: 90.3768 },
  { id: 'dhanmondi32', name: 'Dhanmondi 32 (ধানমন্ডি ৩২)', nameBn: 'ধানমন্ডি ৩২ লেক', area: 'Dhanmondi Lake', landmark: 'Lake View & Metro Station', lat: 23.7525, lng: 90.3785 },
  { id: 'uttara3', name: 'Sector 3, Uttara (উত্তরা ৩)', nameBn: 'সেক্টর ৩, উত্তরা মডেল টাউন', area: 'Uttara Model Town', landmark: 'Friends Club & Rajlaxmi Complex', lat: 23.8681, lng: 90.3980 },
  { id: 'uttara7', name: 'Sector 7 / Jasimuddin, Uttara', nameBn: 'সেক্টর ৭ / জসীমউদ্দীন রোড', area: 'Uttara North', landmark: 'Jasimuddin Road Bus Stand', lat: 23.8720, lng: 90.3995 },
  { id: 'airport', name: 'Hazrat Shahjalal Int. Airport (বিমানবন্দর)', nameBn: 'শাহজালাল আন্তর্জাতিক বিমানবন্দর', area: 'Kurmitola / Airport Rd', landmark: 'Terminal 1 & 2 Departures', lat: 23.8433, lng: 90.4039 },
  { id: 'mohakhali', name: 'Mohakhali DOHS & Flyover (মহাখালী)', nameBn: 'মহাখালী ডিওএইচএস ও ফ্লাইওভার', area: 'Mohakhali C/A', landmark: 'Amtoli & DOHS Gate', lat: 23.7776, lng: 90.4005 },
  { id: 'bashundhara', name: 'Bashundhara R/A Gate (বসুন্ধরা)', nameBn: 'বসুন্ধরা আবাসিক এলাকা গেট', area: 'Bashundhara R/A', landmark: 'Evercare Hospital & NSU Campus', lat: 23.8151, lng: 90.4300 },
  { id: 'motijheel', name: 'Motijheel Commercial Area (মতিঝিল)', nameBn: 'মতিঝিল বাণিজ্যিক এলাকা', area: 'Motijheel C/A', landmark: 'Shapla Chattar & Bangladesh Bank', lat: 23.7330, lng: 90.4172 },
  { id: 'badda', name: 'Badda / Notun Bazar (বাড্ডা)', nameBn: 'নতুন বাজার / উত্তর বাড্ডা', area: 'North Badda', landmark: 'Notun Bazar 100 Feet Corner', lat: 23.7805, lng: 90.4267 },
  { id: 'olddhaka', name: 'Lalbagh Fort, Old Dhaka (পুরান ঢাকা)', nameBn: 'লালবাগ কেল্লা, পুরান ঢাকা', area: 'Old Dhaka / Lalbagh', landmark: 'Historical Lalbagh Fort Gate', lat: 23.7188, lng: 90.3882 },
  { id: 'shahbagh', name: 'Shahbagh & Dhaka University (শাহবাগ)', nameBn: 'শাহবাগ ও ঢাকা বিশ্ববিদ্যালয়', area: 'Shahbagh / DU', landmark: 'BSMMU, National Museum & Curzon Hall', lat: 23.7380, lng: 90.3955 },
  { id: 'hatirjheel', name: 'Hatirjheel / Rampura (হাতিরঝিল)', nameBn: 'হাতিরঝিল ও রামপুরা ব্রিজ', area: 'Hatirjheel Circle', landmark: 'Rampura Bridge & Water Taxi Station', lat: 23.7635, lng: 90.4180 },
  { id: 'khilkhet', name: 'Khilkhet / Nikunja 2 (খিলক্ষেত)', nameBn: 'খিলক্ষেত ও নিকুঞ্জ ২', area: 'Nikunja / Khilkhet', landmark: 'Nikunja Gate & Airport Highway', lat: 23.8290, lng: 90.4175 },
  { id: 'mirpur1', name: 'Mirpur 1 / Sony Cinema (মিরপুর ১)', nameBn: 'মিরপুর ১ / সনি স্কয়ার', area: 'Mirpur South', landmark: 'Sony Square & Mazar Road', lat: 23.7956, lng: 90.3537 },
  { id: 'panthapath', name: 'Panthapath / Bashundhara City (পান্থপথ)', nameBn: 'পান্থপথ ও বসুন্ধরা সিটি', area: 'Central Dhaka', landmark: 'Bashundhara City Shopping Mall', lat: 23.7515, lng: 90.3890 },
];

export const VEHICLE_RATES = {
  cng: {
    id: 'cng',
    name: 'OBHAI CNG (সিএনজি)',
    badge: 'ডিজিটাল মিটার',
    badgeColor: 'bg-emerald-600 text-white',
    base: 60,
    perKm: 18,
    capacity: '৩ সিট',
    eta: '২ মিনিট দূরে',
    icon: '🛺',
    desc: 'সরকারি নির্ধারিত ডিজিটাল মিটার রেট ও সর্বোচ্চ নিরাপত্তা'
  },
  moto: {
    id: 'moto',
    name: 'OBHAI Moto (বাইক)',
    badge: 'দ্রুততম রাইড',
    badgeColor: 'bg-amber-600 text-white',
    base: 40,
    perKm: 12,
    capacity: '১ সিট',
    eta: '১ মিনিট দূরে',
    icon: '🏍️',
    desc: 'যানজট এড়িয়ে সবচেয়ে দ্রুত ও সাশ্রয়ী গন্তব্যে পৌঁছান'
  },
  prime: {
    id: 'prime',
    name: 'OBHAI Prime AC (কার)',
    badge: 'ফুল এসি আরাম',
    badgeColor: 'bg-blue-600 text-white',
    base: 140,
    perKm: 28,
    capacity: '৪ সিট',
    eta: '৪ মিনিট দূরে',
    icon: '🚗',
    desc: 'প্রিমিয়াম প্রি-কুলড এসি প্রাইভেট সেডান কার'
  },
  micro: {
    id: 'micro',
    name: 'OBHAI Micro (মাইক্রোবাস)',
    badge: '৭ সিটার ফ্যামিলি',
    badgeColor: 'bg-purple-600 text-white',
    base: 220,
    perKm: 45,
    capacity: '৭ সিট',
    eta: '৬ মিনিট দূরে',
    icon: '🚙',
    desc: 'পারিবারিক ভ্রমণ, বিমানবন্দর ও দলগত যাত্রার জন্য বড় গাড়ি'
  },
  parcel: {
    id: 'parcel',
    name: 'Express Parcel (পার্সেল)',
    badge: 'সেম ডে ডেলিভারি',
    badgeColor: 'bg-orange-600 text-white',
    base: 50,
    perKm: 15,
    capacity: '১০ কেজি পর্যন্ত',
    eta: '৫ মিনিট দূরে',
    icon: '📦',
    desc: 'জরুরি ডকুমেন্ট ও পার্সেল দ্রুত ও নিরাপদে ডেলিভারি'
  },
  seba: {
    id: 'seba',
    name: 'OBHAI Seba (অ্যাম্বুলেন্স)',
    badge: '২৪/৭ জরুরি মেডিকেল',
    badgeColor: 'bg-rose-600 text-white animate-pulse',
    base: 500,
    perKm: 50,
    capacity: 'জরুরি রোগী সেবা',
    eta: '৩ মিনিট দূরে',
    icon: '🚑',
    desc: 'জরুরি অক্সিজেন ও প্যারামেডিক সাপোর্টসহ মেডিকেল পরিবহন'
  },
};

// Calculate real distance using Haversine with Dhaka road detour multiplier (~1.32x)
export function calculateRouteDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  
  // Real road factor for Dhaka city traffic & turns (~1.32x)
  const roadKm = straightKm * 1.32;
  const finalKm = Math.max(1.5, Math.round(roadKm * 10) / 10);
  const estMins = Math.max(6, Math.round(finalKm * 2.4 + 4));
  return { distanceKm: finalKm, durationMins: estMins };
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('obhai_react_theme') || 'light');
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [selectedAuthRole, setSelectedAuthRole] = useState('customer');

  // Admin Pricing with localStorage persistence
  const [adminPricing, setAdminPricing] = useState(() => {
    try {
      const saved = localStorage.getItem('obhai_react_pricing');
      return saved ? { ...DEFAULT_PRICING, ...JSON.parse(saved) } : DEFAULT_PRICING;
    } catch {
      return DEFAULT_PRICING;
    }
  });

  // Coupons List with localStorage persistence and synced first coupon
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('obhai_react_coupons');
      const list = saved ? JSON.parse(saved) : DEFAULT_COUPONS;
      if (list.length > 0) {
        list[0].code = adminPricing.couponCode;
        list[0].discount = adminPricing.storeDiscount;
        list[0].maxCap = adminPricing.bkashCashback;
      }
      return list;
    } catch {
      return DEFAULT_COUPONS;
    }
  });

  // Passenger Profile & Wallet
  const [customer, setCustomer] = useState(() => ({
    name: 'নাজমুস সাকিব (Nazmus Sakib)',
    phone: '+৮৮০ ১৭১১-২৩৪৫৬৭',
    walletBalance: parseFloat(localStorage.getItem('obhai_react_wallet')) || 650.00,
    milesPoints: 840,
    appliedCoupon: null,
  }));

  // Captain Profile & Earnings
  const [driver, setDriver] = useState(() => ({
    name: 'ক্যাপ্টেন আবুল কালাম (Abul Kalam)',
    vehicle: 'ঢাকা-থ-১২-৩৪৫৬ (সবুজ সিএনজি)',
    isOnline: true,
    todayEarnings: parseFloat(localStorage.getItem('obhai_react_captain_earnings')) || 2850.00,
    tripsCompleted: parseInt(localStorage.getItem('obhai_react_captain_trips')) || 14,
  }));

  // Disputes & Passenger Complaints
  const [disputes, setDisputes] = useState(() => [
    {
      id: 'OBHAI-TKT-7401',
      userName: 'নাজমুস সাকিব (যাত্রী)',
      userPhone: '+880 1711-234567',
      tripId: 'OBHAI-CNG-8492 (মিরপুর ১০ ➔ ফার্মগেট)',
      category: 'CNG Meter Disconnected',
      details: 'সিএনজি ক্যাপ্টেন মিটার ব্যবহার করতে অস্বীকার করেছে এবং অতিরিক্ত ভাড়া দাবি করেছে।',
      status: 'PENDING',
      refundAmount: 130.00,
      adminNote: '',
      date: '১৫ মিনিট আগে'
    },
    {
      id: 'OBHAI-TKT-6921',
      userName: 'কাজী ফারহান (যাত্রী)',
      userPhone: '+880 1912-334455',
      tripId: 'OBHAI-PRIME-4410 (বনানী ➔ ধানমন্ডি)',
      category: 'Driver Overcharged',
      details: 'প্রাইম কার ড্রাইভার ভুল করে অতিরিক্ত পার্কিং চার্জ নিয়েছে।',
      status: 'RESOLVED',
      refundAmount: 70.00,
      adminNote: 'ওভাই পে ওয়ালেটে ৳ ৭০ রিফান্ড যোগ করা হয়েছে।',
      date: 'গতকাল'
    }
  ]);

  // Dynamic Route with accurate coordinates
  const [route, setRoute] = useState({
    pickup: DHAKA_LOCATIONS[0], // Mirpur 10
    dest: DHAKA_LOCATIONS[1],   // Farmgate
    distanceKm: 7.8,
    durationMins: 22,
    selectedCar: 'cng',
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('obhai_react_theme', theme);
  }, [theme]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(theme === 'light' ? 'ডার্ক মোড চালু হয়েছে' : 'লাইট মোড চালু হয়েছে');
  };

  const enterPortal = (role) => {
    setSelectedAuthRole(role);
    setCurrentScreen(role);
    if (role === 'customer') {
      showToast('স্বাগতম! ওভাই যাত্রী প্যানেলে প্রবেশ করেছেন।');
    } else if (role === 'driver') {
      showToast('স্বাগতম ক্যাপ্টেন আবুল কালাম! ওভাই চালক ড্যাশবোর্ড সচল।');
    } else if (role === 'admin') {
      showToast('OBHAI HQ Admin Control Panel Active.');
    }
  };

  const logOutToGate = () => {
    setCurrentScreen('auth');
    showToast('লগ আউট সম্পন্ন হয়েছে।');
  };

  const updateAdminPricing = (newPricing) => {
    setAdminPricing(newPricing);
    localStorage.setItem('obhai_react_pricing', JSON.stringify(newPricing));

    setCoupons(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          code: newPricing.couponCode,
          discount: newPricing.storeDiscount,
          maxCap: newPricing.bkashCashback,
          title: `${newPricing.storeDiscount}% ওভাই প্ল্যাটফর্ম ডিসকাউন্ট`
        };
      }
      localStorage.setItem('obhai_react_coupons', JSON.stringify(updated));
      return updated;
    });
  };

  const addCoupon = (code, discount, maxCap) => {
    const newCoupon = {
      code: code.toUpperCase(),
      discount: parseFloat(discount),
      maxCap: parseFloat(maxCap) || 150,
      status: 'Active',
      title: `${discount}% ওভাই প্রোমো ছাড়`
    };
    setCoupons(prev => {
      const updated = [newCoupon, ...prev];
      localStorage.setItem('obhai_react_coupons', JSON.stringify(updated));
      return updated;
    });
    showToast(`🎟️ নতুন কুপন "${code.toUpperCase()}" পাবলিশ হয়েছে!`);
  };

  const deleteCoupon = (index) => {
    setCoupons(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('obhai_react_coupons', JSON.stringify(updated));
      return updated;
    });
    showToast('কুপন ডিলিট করা হয়েছে');
  };

  const applyCoupon = (coupon) => {
    setCustomer(prev => ({ ...prev, appliedCoupon: coupon }));
    showToast(`🎉 কুপন ${coupon.code} যুক্ত হয়েছে!`);
  };

  const removeCoupon = () => {
    setCustomer(prev => ({ ...prev, appliedCoupon: null }));
    showToast('কুপন রিমুভ করা হয়েছে');
  };

  const topupWallet = (amount) => {
    setCustomer(prev => {
      const newBal = prev.walletBalance + amount;
      localStorage.setItem('obhai_react_wallet', newBal);
      return { ...prev, walletBalance: newBal };
    });
    showToast(`৳ ${amount.toFixed(2)} ওভাই পে ওয়ালেটে জমা হয়েছে!`);
  };

  const submitComplaint = (category, tripId, details) => {
    const newTicket = {
      id: `OBHAI-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: customer.name,
      userPhone: customer.phone,
      tripId: tripId || 'OBHAI-CNG-8492 (মিরপুর ১০ ➔ ফার্মগেট)',
      category,
      details,
      status: 'PENDING',
      refundAmount: 130.00,
      adminNote: '',
      date: 'এইমাত্র'
    };
    setDisputes(prev => [newTicket, ...prev]);
    showToast('✅ অভিযোগ ওভাই অ্যাডমিন ইনবক্সে পাঠানো হয়েছে।');
  };

  const resolveDispute = (ticketId, customRefund) => {
    const refund = parseFloat(customRefund) || 0;
    setDisputes(prev => prev.map(d => (d.id === ticketId ? { ...d, status: 'RESOLVED', refundAmount: refund } : d)));
    
    setCustomer(prev => {
      const newBal = prev.walletBalance + refund;
      localStorage.setItem('obhai_react_wallet', newBal);
      return { ...prev, walletBalance: newBal };
    });

    showToast(`✅ অভিযোগ সমাধান হয়েছে! ৳ ${refund} যাত্রীর ওয়ালেটে যুক্ত হয়েছে।`);
  };

  const toggleDriverOnline = () => {
    setDriver(prev => {
      const nextOnline = !prev.isOnline;
      showToast(nextOnline ? 'আপনি এখন অনলাইন আছেন' : 'আপনি অফলাইনে গেছেন');
      return { ...prev, isOnline: nextOnline };
    });
  };

  const acceptDriverTrip = (fare = 198.00) => {
    setDriver(prev => {
      const newEarnings = prev.todayEarnings + fare;
      const newTrips = prev.tripsCompleted + 1;
      localStorage.setItem('obhai_react_captain_earnings', newEarnings);
      localStorage.setItem('obhai_react_captain_trips', newTrips);
      return { ...prev, todayEarnings: newEarnings, tripsCompleted: newTrips };
    });
    showToast('ট্রিপ গ্রহণ করা হয়েছে! যাত্রীর অবস্থানের দিকে রওনা হন...');
  };

  // Set new pickup & destination with automatic distance/fare recalculation
  const updateRoutePoints = (newPickup, newDest) => {
    const p = newPickup || route.pickup;
    const d = newDest || route.dest;
    const { distanceKm, durationMins } = calculateRouteDistance(p.lat, p.lng, d.lat, d.lng);
    setRoute(prev => ({
      ...prev,
      pickup: p,
      dest: d,
      distanceKm,
      durationMins,
    }));
  };

  // Compute live vehicle fares dynamically based on exact route distance & admin pricing
  const calculateFare = (carKey, customDistanceKm = null) => {
    const rate = VEHICLE_RATES[carKey] || VEHICLE_RATES.cng;
    const dist = customDistanceKm !== null ? customDistanceKm : route.distanceKm;
    const p = adminPricing;
    
    const baseFare = rate.base;
    const distanceFare = Math.round(dist * rate.perKm);
    const originalFare = Math.round(baseFare + distanceFare + p.shippingCost);
    let discountAmt = Math.round(originalFare * (p.storeDiscount / 100));
    let finalFare = Math.max(30, originalFare - discountAmt);

    if (customer.appliedCoupon) {
      const c = customer.appliedCoupon;
      const extraDisc = Math.min(c.maxCap, Math.round(finalFare * (c.discount / 100)));
      discountAmt += extraDisc;
      finalFare = Math.max(25, finalFare - extraDisc);
    }

    return { originalFare, finalFare, baseFare, distanceFare, discountAmt, ratePerKm: rate.perKm };
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentScreen,
        selectedAuthRole,
        setSelectedAuthRole,
        enterPortal,
        logOutToGate,
        adminPricing,
        updateAdminPricing,
        coupons,
        addCoupon,
        deleteCoupon,
        customer,
        applyCoupon,
        removeCoupon,
        topupWallet,
        submitComplaint,
        driver,
        toggleDriverOnline,
        acceptDriverTrip,
        disputes,
        resolveDispute,
        route,
        setRoute,
        updateRoutePoints,
        calculateFare,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
