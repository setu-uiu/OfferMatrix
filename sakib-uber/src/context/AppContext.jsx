import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Default Constants
const DEFAULT_PRICING = {
  storeDiscount: 10,       // 10%
  couponCode: 'KIREI10',   // KIREI10
  bkashCashback: 150,      // ৳ 150
  shippingCost: 0,         // ৳ 0 Surge
  salePrice: 2050,         // ৳ 2,050
};

const DEFAULT_COUPONS = [
  { code: 'KIREI10', discount: 10, maxCap: 150, status: 'Active', title: '10% Platform Discount' },
  { code: 'UBER50', discount: 50, maxCap: 180, status: 'Active', title: '50% First Rides Offer' },
  { code: 'AIRPORT100', discount: 25, maxCap: 100, status: 'Active', title: '৳ 100 Airport Saver' },
  { code: 'COMFORT20', discount: 20, maxCap: 120, status: 'Active', title: '20% Luxury Comfort' },
  { code: 'MOTO30', discount: 30, maxCap: 50, status: 'Active', title: '৳ 30 Off Uber Moto' },
];

export const DHAKA_LOCATIONS = [
  { id: 'gulshan2', name: 'Gulshan 2, Dhaka', area: 'Gulshan North', landmark: 'Gulshan 2 Circle & Diplomatic Zone', lat: 23.7925, lng: 90.4078 },
  { id: 'airport', name: 'Hazrat Shahjalal Int. Airport', area: 'Kurmitola / Airport Rd', landmark: 'Terminal 1 & 2 Departures', lat: 23.8433, lng: 90.4039 },
  { id: 'dhanmondi27', name: 'Dhanmondi 27, Dhaka', area: 'Dhanmondi R/A', landmark: 'Old 27, Rapa Plaza & Mirpur Rd', lat: 23.7510, lng: 90.3768 },
  { id: 'dhanmondi32', name: 'Dhanmondi 32, Dhaka', area: 'Dhanmondi Lake', landmark: 'Lake View & Metro Station', lat: 23.7525, lng: 90.3785 },
  { id: 'banani11', name: 'Road 11, Banani', area: 'Banani C/A', landmark: 'Food Street, Kemal Ataturk Ave', lat: 23.7937, lng: 90.4048 },
  { id: 'gulshan1', name: 'Gulshan 1 Circle, Dhaka', area: 'Gulshan South', landmark: 'Gulshan 1 DCC Market', lat: 23.7785, lng: 90.4172 },
  { id: 'uttara3', name: 'Sector 3, Uttara', area: 'Uttara Model Town', landmark: 'Friends Club & Rajlaxmi Complex', lat: 23.8681, lng: 90.3980 },
  { id: 'uttara7', name: 'Sector 7 / Jasimuddin, Uttara', area: 'Uttara North', landmark: 'Jasimuddin Road Bus Stand', lat: 23.8720, lng: 90.3995 },
  { id: 'mirpur10', name: 'Mirpur 10 Roundabout', area: 'Mirpur Central', landmark: 'Mirpur 10 Metro Station & Stadium', lat: 23.8069, lng: 90.3687 },
  { id: 'mirpur1', name: 'Mirpur 1 / Sony Cinema', area: 'Mirpur South', landmark: 'Sony Square & Mazar Road', lat: 23.7956, lng: 90.3537 },
  { id: 'mohakhali', name: 'Mohakhali DOHS & Flyover', area: 'Mohakhali C/A', landmark: 'Amtoli & DOHS Gate', lat: 23.7776, lng: 90.4005 },
  { id: 'farmgate', name: 'Farmgate & Karwan Bazar', area: 'Tejgaon / Central', landmark: 'Farmgate Metro & Ananda Cinema', lat: 23.7570, lng: 90.3900 },
  { id: 'bashundhara', name: 'Bashundhara R/A Gate', area: 'Bashundhara R/A', landmark: 'Evercare Hospital & NSU Campus', lat: 23.8151, lng: 90.4300 },
  { id: 'motijheel', name: 'Motijheel Commercial Area', area: 'Motijheel C/A', landmark: 'Shapla Chattar & Bangladesh Bank', lat: 23.7330, lng: 90.4172 },
  { id: 'badda', name: 'Badda / Notun Bazar', area: 'North Badda', landmark: 'Notun Bazar 100 Feet Corner', lat: 23.7805, lng: 90.4267 },
  { id: 'olddhaka', name: 'Lalbagh Fort, Old Dhaka', area: 'Old Dhaka / Lalbagh', landmark: 'Historical Lalbagh Fort Gate', lat: 23.7188, lng: 90.3882 },
  { id: 'shahbagh', name: 'Shahbagh & Dhaka University', area: 'Shahbagh / DU', landmark: 'BSMMU & Curzon Hall', lat: 23.7380, lng: 90.3955 },
  { id: 'hatirjheel', name: 'Hatirjheel / Rampura', area: 'Hatirjheel Circle', landmark: 'Rampura Bridge & Water Taxi', lat: 23.7635, lng: 90.4180 },
  { id: 'khilkhet', name: 'Khilkhet / Nikunja 2', area: 'Nikunja / Khilkhet', landmark: 'Nikunja Gate & Airport Highway', lat: 23.8290, lng: 90.4175 },
];

export const VEHICLE_RATES = {
  uberx: { name: 'UberX', base: 120, perKm: 24, capacity: '4 seats', eta: '3 mins away', icon: '🚗', desc: 'Affordable, everyday reliable rides' },
  comfort: { name: 'Uber Comfort', base: 160, perKm: 32, capacity: '4 seats', eta: '5 mins away', icon: '🚙', desc: 'Newer cars with extra legroom & top drivers' },
  uberxl: { name: 'UberXL', base: 220, perKm: 42, capacity: '6 seats', eta: '6 mins away', icon: '🚐', desc: 'Spacious SUVs for groups up to 6' },
  black: { name: 'Uber Black', base: 350, perKm: 55, capacity: '4 seats', eta: '8 mins away', icon: '🚘', desc: 'Premium luxury rides with professional chauffeurs' },
  moto: { name: 'Uber Moto', base: 50, perKm: 10, capacity: '1 seat', eta: '2 mins away', icon: '🏍️', desc: 'Fast, affordable motorbike trips through traffic' },
};

// Calculate real distance using Haversine with Dhaka road detour multiplier
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
  const [theme, setTheme] = useState(() => localStorage.getItem('uber_react_theme') || 'light');
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [selectedAuthRole, setSelectedAuthRole] = useState('customer');

  const [adminPricing, setAdminPricing] = useState(() => {
    try {
      const saved = localStorage.getItem('uber_react_pricing');
      return saved ? { ...DEFAULT_PRICING, ...JSON.parse(saved) } : DEFAULT_PRICING;
    } catch {
      return DEFAULT_PRICING;
    }
  });

  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('uber_react_coupons');
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

  const [customer, setCustomer] = useState(() => ({
    name: 'Nazmus Sakib',
    phone: '+880 1711-234567',
    walletBalance: parseFloat(localStorage.getItem('uber_react_wallet')) || 550.00,
    appliedCoupon: null,
  }));

  const [driver, setDriver] = useState(() => ({
    name: 'Mohammad Rafiq',
    car: 'Silver Toyota Corolla (DHA-GA-11-8492)',
    isOnline: true,
    todayEarnings: parseFloat(localStorage.getItem('uber_react_driver_earnings')) || 3450.00,
    tripsCompleted: parseInt(localStorage.getItem('uber_react_driver_trips')) || 12,
  }));

  const [disputes, setDisputes] = useState(() => [
    {
      id: 'TKT-9201',
      userName: 'Nazmus Sakib (Customer)',
      userPhone: '+880 1711-234567',
      tripId: 'TRIP-8492 (Gulshan ➔ Airport)',
      category: 'Driver Overcharged',
      details: 'Driver took Mohakhali flyover traffic route instead of expressway and charged extra ৳ 120.',
      status: 'PENDING',
      refundAmount: 120.00,
      adminNote: '',
      date: '10 mins ago'
    },
    {
      id: 'TKT-8842',
      userName: 'Tanvir Ahmed (Customer)',
      userPhone: '+880 1819-987654',
      tripId: 'TRIP-7921 (Dhanmondi ➔ Banani)',
      category: 'AC Broken',
      details: 'Car AC was completely non-functional on Uber Comfort.',
      status: 'RESOLVED',
      refundAmount: 80.00,
      adminNote: 'Verified vehicle AC telemetry. Refunded ৳ 80 to rider wallet.',
      date: 'Yesterday'
    }
  ]);

  // Dynamic Route with accurate coordinates
  const [route, setRoute] = useState({
    pickup: DHAKA_LOCATIONS[0], // Gulshan 2
    dest: DHAKA_LOCATIONS[1],   // Airport
    distanceKm: 11.4,
    durationMins: 28,
    selectedCar: 'uberx',
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('uber_react_theme', theme);
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
    showToast(`Switched to ${theme === 'light' ? 'DARK' : 'LIGHT'} mode`);
  };

  const enterPortal = (role) => {
    setSelectedAuthRole(role);
    setCurrentScreen(role);
    if (role === 'customer') {
      showToast('Welcome Nazmus! Logged in as Customer (Passenger).');
    } else if (role === 'driver') {
      showToast('Welcome Mohammad Rafiq! Driver portal online.');
    } else if (role === 'admin') {
      showToast('Welcome Super Admin! Company HQ Control Panel active.');
    }
  };

  const logOutToGate = () => {
    setCurrentScreen('auth');
    showToast('Logged out successfully.');
  };

  const updateAdminPricing = (newPricing) => {
    setAdminPricing(newPricing);
    localStorage.setItem('uber_react_pricing', JSON.stringify(newPricing));

    setCoupons(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[0] = {
          ...updated[0],
          code: newPricing.couponCode,
          discount: newPricing.storeDiscount,
          maxCap: newPricing.bkashCashback,
          title: `${newPricing.storeDiscount}% Platform Discount`
        };
      }
      localStorage.setItem('uber_react_coupons', JSON.stringify(updated));
      return updated;
    });
  };

  const addCoupon = (code, discount, maxCap) => {
    const newCoupon = {
      code: code.toUpperCase(),
      discount: parseFloat(discount),
      maxCap: parseFloat(maxCap) || 150,
      status: 'Active',
      title: `${discount}% Promo Discount`
    };
    setCoupons(prev => {
      const updated = [newCoupon, ...prev];
      localStorage.setItem('uber_react_coupons', JSON.stringify(updated));
      return updated;
    });
    showToast(`🎟️ New coupon "${code.toUpperCase()}" published!`);
  };

  const deleteCoupon = (index) => {
    setCoupons(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('uber_react_coupons', JSON.stringify(updated));
      return updated;
    });
    showToast('Coupon deleted');
  };

  const applyCoupon = (coupon) => {
    setCustomer(prev => ({ ...prev, appliedCoupon: coupon }));
    showToast(`🎉 Coupon ${coupon.code} applied to your ride!`);
  };

  const removeCoupon = () => {
    setCustomer(prev => ({ ...prev, appliedCoupon: null }));
    showToast('Coupon removed');
  };

  const topupWallet = (amount) => {
    setCustomer(prev => {
      const newBal = prev.walletBalance + amount;
      localStorage.setItem('uber_react_wallet', newBal);
      return { ...prev, walletBalance: newBal };
    });
    showToast(`৳ ${amount.toFixed(2)} added to your Uber Cash balance!`);
  };

  const submitComplaint = (category, tripId, details) => {
    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: customer.name,
      userPhone: customer.phone,
      tripId: tripId || 'TRIP-8492 (Gulshan ➔ Airport)',
      category,
      details,
      status: 'PENDING',
      refundAmount: 120.00,
      adminNote: '',
      date: 'Just now'
    };
    setDisputes(prev => [newTicket, ...prev]);
    showToast('✅ Complaint submitted! Admin HQ will review and credit refund.');
  };

  const resolveDispute = (ticketId, customRefund) => {
    const refund = parseFloat(customRefund) || 0;
    setDisputes(prev => prev.map(d => (d.id === ticketId ? { ...d, status: 'RESOLVED', refundAmount: refund } : d)));
    
    setCustomer(prev => {
      const newBal = prev.walletBalance + refund;
      localStorage.setItem('uber_react_wallet', newBal);
      return { ...prev, walletBalance: newBal };
    });

    showToast(`✅ Dispute resolved! ৳ ${refund} credited to customer wallet.`);
  };

  const toggleDriverOnline = () => {
    setDriver(prev => {
      const nextOnline = !prev.isOnline;
      showToast(nextOnline ? 'You are now ONLINE' : 'You are now OFFLINE');
      return { ...prev, isOnline: nextOnline };
    });
  };

  const acceptDriverTrip = (fare = 342.00) => {
    setDriver(prev => {
      const newEarnings = prev.todayEarnings + fare;
      const newTrips = prev.tripsCompleted + 1;
      localStorage.setItem('uber_react_driver_earnings', newEarnings);
      localStorage.setItem('uber_react_driver_trips', newTrips);
      return { ...prev, todayEarnings: newEarnings, tripsCompleted: newTrips };
    });
    showToast('Trip Accepted! Navigating to pick up passenger...');
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
    const rate = VEHICLE_RATES[carKey];
    if (!rate) return { originalFare: 0, finalFare: 0, baseFare: 0, distanceFare: 0, discountAmt: 0 };

    const dist = customDistanceKm !== null ? customDistanceKm : route.distanceKm;
    const p = adminPricing;
    
    const baseFare = rate.base;
    const distanceFare = Math.round(dist * rate.perKm);
    const originalFare = Math.round(baseFare + distanceFare + p.shippingCost);
    let discountAmt = Math.round(originalFare * (p.storeDiscount / 100));
    let finalFare = Math.max(40, originalFare - discountAmt);

    if (customer.appliedCoupon) {
      const c = customer.appliedCoupon;
      const extraDisc = Math.min(c.maxCap, Math.round(finalFare * (c.discount / 100)));
      discountAmt += extraDisc;
      finalFare = Math.max(30, finalFare - extraDisc);
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
