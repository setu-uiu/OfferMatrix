/**
 * ==========================================================================
 * OBHAI BANGLADESH - AUTHENTIC ENGINE WITH PERSISTENT REACTIVE PRICING
 * ==========================================================================
 */

// Default Pricing
const defaultObhaiPricing = {
  storeDiscount: 10,       // 10%
  couponCode: 'OBHAI10',   // OBHAI10
  bkashCashback: 150,      // ৳ 150
  shippingCost: 0,         // ৳ 0 Surge
  salePrice: 2050,         // ৳ 2,050
};

// Load saved pricing from LocalStorage
let initialObhaiPricing = { ...defaultObhaiPricing };
try {
  const saved = localStorage.getItem('obhai_admin_pricing');
  if (saved) initialObhaiPricing = { ...defaultObhaiPricing, ...JSON.parse(saved) };
} catch (e) {
  console.warn('Could not load saved OBHAI pricing', e);
}

// Initial Coupons Array with synced first entry
const defaultObhaiCoupons = [
  { code: initialObhaiPricing.couponCode, discount: initialObhaiPricing.storeDiscount, maxCap: initialObhaiPricing.bkashCashback, status: 'Active', title: `${initialObhaiPricing.storeDiscount}% ওভাই প্ল্যাটফর্ম ডিসকাউন্ট` },
  { code: 'CNG25', discount: 25, maxCap: 80, status: 'Active', title: '৳ ৮০ ডিজিটাল সিএনজি মিটার সেভার' },
  { code: 'MOTO50', discount: 50, maxCap: 60, status: 'Active', title: '৫০% প্রথম ওভাই বাইক রাইড' },
  { code: 'PRIME20', discount: 20, maxCap: 120, status: 'Active', title: '২০% এসি প্রাইম কার অফার' },
];

let initialObhaiCouponsList = [...defaultObhaiCoupons];
try {
  const savedCoupons = localStorage.getItem('obhai_coupons_list');
  if (savedCoupons) {
    initialObhaiCouponsList = JSON.parse(savedCoupons);
    if (initialObhaiCouponsList.length > 0) {
      initialObhaiCouponsList[0].code = initialObhaiPricing.couponCode;
      initialObhaiCouponsList[0].discount = initialObhaiPricing.storeDiscount;
      initialObhaiCouponsList[0].maxCap = initialObhaiPricing.bkashCashback;
    }
  }
} catch (e) {
  console.warn('Could not load saved OBHAI coupons', e);
}

// Global Application State
const appState = {
  currentScreen: 'auth', // 'auth', 'customer', 'driver', 'admin'
  selectedAuthRole: 'customer',
  theme: localStorage.getItem('obhai_theme') || 'light',

  // Company Admin Pricing Controls (Matching reference image)
  adminPricing: initialObhaiPricing,

  // Active Promo Campaigns
  coupons: initialObhaiCouponsList,

  // Passenger Profile & Wallet
  customer: {
    name: 'নাজমুস সাকিব',
    phone: '+৮৮০ ১৭১১-২৩৪৫৬৭',
    walletBalance: parseFloat(localStorage.getItem('obhai_customer_wallet')) || 450.00,
    appliedCoupon: null,
  },

  // Captain Profile & Earnings
  driver: {
    name: 'ক্যাপ্টেন আবুল কালাম',
    vehicle: 'ঢাকা-থ-১২-৩৪৫৬ (সবুজ সিএনজি)',
    isOnline: true,
    todayEarnings: parseFloat(localStorage.getItem('obhai_captain_earnings')) || 2850.00,
    tripsCompleted: parseInt(localStorage.getItem('obhai_captain_trips')) || 14,
  },

  // Passenger Complaints / Disputes
  disputes: [
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
  ],

  // Route & Fleet Pricing (Mirpur 10 to Farmgate)
  route: {
    pickup: { name: 'মিরপুর ১০ গোলচত্বর, ঢাকা', lat: 23.8069, lng: 90.3687 },
    dest: { name: 'ফার্মগেট ও কারওয়ান বাজার', lat: 23.7570, lng: 90.3900 },
    distanceKm: 7.8,
    durationMins: 22,
    selectedCar: 'cng',
  },

  isSearching: false,
};

// Base Rates for OBHAI Fleet (Government standard CNG meter base)
const vehicleBaseRates = {
  cng: { name: 'OBHAI CNG (সিএনজি)', base: 60, perKm: 18 },
  moto: { name: 'OBHAI Moto (বাইক)', base: 40, perKm: 12 },
  prime: { name: 'OBHAI Prime AC (কার)', base: 140, perKm: 28 },
  micro: { name: 'OBHAI Micro (মাইক্রোবাস)', base: 220, perKm: 45 },
  parcel: { name: 'Express Parcel (পার্সেল)', base: 50, perKm: 15 },
  seba: { name: 'OBHAI Seba (অ্যাম্বুলেন্স)', base: 500, perKm: 50 },
};

// Leaflet Map Reference
let mapInstance = null;
let pickupMarker = null;
let destMarker = null;
let driverCarMarker = null;
let routePolyline = null;
let driverAnimInterval = null;

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAuthGate();
  initCustomerView();
  initDriverView();
  initAdminView();
});

// ==========================================================================
// AUTHENTICATION GATE
// ==========================================================================
function initAuthGate() {
  const roleCards = document.querySelectorAll('.obhai-role-item');
  const phoneInput = document.getElementById('login-phone-input');
  const inputLabel = document.getElementById('auth-input-label');
  const btnText = document.getElementById('login-btn-text');

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const role = card.getAttribute('data-role');
      appState.selectedAuthRole = role;

      if (role === 'customer') {
        if (inputLabel) inputLabel.textContent = 'মোবাইল নম্বর (Mobile Number)';
        if (phoneInput) phoneInput.value = '1711234567';
        if (btnText) btnText.textContent = 'যাত্রী হিসেবে লগইন করুন (Sign In as Passenger)';
      } else if (role === 'driver') {
        if (inputLabel) inputLabel.textContent = 'ক্যাপ্টেন আইডি / মোবাইল (Captain ID)';
        if (phoneInput) phoneInput.value = '1819556677';
        if (btnText) btnText.textContent = 'ক্যাপ্টেন হিসেবে প্রবেশ করুন (Sign In as Captain)';
      } else if (role === 'admin') {
        if (inputLabel) inputLabel.textContent = 'অ্যাডমিন ইউজারনেম (Admin Email/ID)';
        if (phoneInput) phoneInput.value = 'admin@obhai.com';
        if (btnText) btnText.textContent = 'ওভাই হেডকোয়ার্টারে প্রবেশ করুন (Admin HQ)';
      }
    });
  });
}

window.performLogin = function() {
  enterPortal(appState.selectedAuthRole);
};

window.quickLogin = function(role) {
  appState.selectedAuthRole = role;
  enterPortal(role);
};

function enterPortal(role) {
  const authScreen = document.getElementById('screen-auth');
  const custScreen = document.getElementById('screen-customer');
  const driverScreen = document.getElementById('screen-driver');
  const adminScreen = document.getElementById('screen-admin');

  if (authScreen) authScreen.style.display = 'none';
  if (custScreen) custScreen.style.display = role === 'customer' ? 'flex' : 'none';
  if (driverScreen) driverScreen.style.display = role === 'driver' ? 'flex' : 'none';
  if (adminScreen) adminScreen.style.display = role === 'admin' ? 'flex' : 'none';

  appState.currentScreen = role;

  if (role === 'customer') {
    showToast('স্বাগতম! ওভাই যাত্রী প্যানেলে প্রবেশ করেছেন।');
    if (!mapInstance) {
      setTimeout(() => { initMap(); }, 200);
    } else {
      setTimeout(() => { mapInstance.invalidateSize(); }, 200);
    }
    updateCustomerPricing();
    renderCustomerCoupons();
  } else if (role === 'driver') {
    showToast('ক্যাপ্টেন আবুল কালাম! ওভাই চালক ড্যাশবোর্ড সচল।');
  } else if (role === 'admin') {
    showToast('OBHAI HQ Admin Control Panel Active.');
    populateAdminInputs();
    syncPricingToCoupons();
    updateAdminPricingHints();
    renderAdminCouponsTable();
  }
}

window.logOutToGate = function() {
  const authScreen = document.getElementById('screen-auth');
  const custScreen = document.getElementById('screen-customer');
  const driverScreen = document.getElementById('screen-driver');
  const adminScreen = document.getElementById('screen-admin');

  if (custScreen) custScreen.style.display = 'none';
  if (driverScreen) driverScreen.style.display = 'none';
  if (adminScreen) adminScreen.style.display = 'none';
  if (authScreen) authScreen.style.display = 'flex';

  appState.currentScreen = 'auth';
  showToast('লগ আউট সম্পন্ন হয়েছে।');
};

// ==========================================================================
// 🧑‍💼 PASSENGER LOGIC & SERVICE BUBBLE SWITCHING
// ==========================================================================
function initCustomerView() {
  initServiceBubbles();
  initCustomerAccountModal();
  initCustomerVehicleSelector();
  initCustomerSimulation();
  renderCustomerCoupons();
  renderCustomerTickets();
  updateCustomerWalletUI();

  // Quick Chips
  document.querySelectorAll('.dhaka-chips-row .dhaka-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const dest = chip.getAttribute('data-dest');
      const destInput = document.getElementById('dest-input');
      if (destInput) destInput.value = dest;
      showToast(`গন্তব্য সিলেক্ট করা হয়েছে: ${dest}`);
      renderMapRoute();
      updateCustomerPricing();
    });
  });

  // Remove Coupon
  const removeCouponBtn = document.getElementById('remove-coupon-btn');
  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', () => {
      appState.customer.appliedCoupon = null;
      document.getElementById('applied-coupon-strip').style.display = 'none';
      updateCustomerPricing();
      showToast('Coupon removed');
    });
  }

  // Top Announcement Link
  const announceBtn = document.getElementById('announcement-view-coupons-btn');
  if (announceBtn) {
    announceBtn.addEventListener('click', () => {
      const modal = document.getElementById('customer-account-modal');
      if (modal) modal.classList.add('active');
    });
  }

  const openCouponsBtn = document.getElementById('customer-open-coupons-btn');
  if (openCouponsBtn) {
    openCouponsBtn.addEventListener('click', () => {
      const modal = document.getElementById('customer-account-modal');
      if (modal) modal.classList.add('active');
    });
  }
}

function initServiceBubbles() {
  document.querySelectorAll('.obhai-services-bar .service-bubble-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.obhai-services-bar .service-bubble-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const service = card.getAttribute('data-service');
      appState.route.selectedCar = service;

      // Highlight vehicle in list if available
      const matchingVehicle = document.querySelector(`#vehicle-list .vehicle-item-row[data-car="${service}"]`);
      if (matchingVehicle) {
        document.querySelectorAll('#vehicle-list .vehicle-item-row').forEach(c => c.classList.remove('selected'));
        matchingVehicle.classList.add('selected');
      }

      showToast(`ওভাই ${service.toUpperCase()} সেবা সিলেক্ট করা হয়েছে`);
      updateCustomerPricing();
    });
  });
}

function updateCustomerWalletUI() {
  const cashAmount = document.getElementById('cust-cash-amount');
  const modalWallet = document.getElementById('modal-wallet-balance');
  const payLabel = document.getElementById('cust-payment-label');

  if (cashAmount) cashAmount.textContent = `৳ ${appState.customer.walletBalance.toFixed(2)}`;
  if (modalWallet) modalWallet.textContent = `৳ ${appState.customer.walletBalance.toFixed(2)}`;
  if (payLabel) {
    payLabel.textContent = `bKash (৳ ${appState.adminPricing.bkashCashback} ক্যাশব্যাক) / OBHAI Pay (৳ ${Math.round(appState.customer.walletBalance)})`;
  }
}

function updateCustomerPricing() {
  const p = appState.adminPricing;
  const dist = appState.route.distanceKm;

  // Update Announcement Banner
  const title = document.getElementById('announcement-offer-title');
  if (title) {
    title.textContent = `🎉 বিশেষ অফার: ${p.storeDiscount}% ওভাই ডিসকাউন্ট ও ৳ ${p.bkashCashback} bKash ক্যাশব্যাক চালু রয়েছে!`;
  }

  const sumCashback = document.getElementById('sum-cashback');
  if (sumCashback) sumCashback.textContent = `৳ ${p.bkashCashback}`;

  const payLabel = document.getElementById('cust-payment-label');
  if (payLabel) {
    payLabel.textContent = `bKash (৳ ${p.bkashCashback} ক্যাশব্যাক) / OBHAI Pay (৳ ${Math.round(appState.customer.walletBalance)})`;
  }

  const meterDiscountLabel = document.getElementById('meter-discount-label');
  if (meterDiscountLabel) {
    meterDiscountLabel.textContent = `- ${p.storeDiscount}% OFF`;
  }

  // Calculate Vehicle Fares
  document.querySelectorAll('#vehicle-list .vehicle-item-row').forEach(card => {
    const carKey = card.getAttribute('data-car');
    const rate = vehicleBaseRates[carKey];
    if (rate) {
      let originalFare = Math.round(rate.base + (dist * rate.perKm) + p.shippingCost);
      let discountAmt = Math.round(originalFare * (p.storeDiscount / 100));
      let finalFare = Math.max(30, originalFare - discountAmt);

      if (appState.customer.appliedCoupon) {
        const c = appState.customer.appliedCoupon;
        const extraDisc = Math.min(c.maxCap, Math.round(finalFare * (c.discount / 100)));
        finalFare = Math.max(25, finalFare - extraDisc);
      }

      const priceVal = card.querySelector('.price-val');
      const oldPrice = card.querySelector('.old-price-val');

      if (priceVal) priceVal.textContent = `৳ ${finalFare}`;
      if (oldPrice) {
        if (p.storeDiscount > 0 || appState.customer.appliedCoupon) {
          oldPrice.style.display = 'block';
          oldPrice.textContent = `৳ ${originalFare}`;
        } else {
          oldPrice.style.display = 'none';
        }
      }
      card.setAttribute('data-final-price', finalFare);
    }
  });

  updateMainRequestBtn();
}

function updateMainRequestBtn() {
  const selectedCard = document.querySelector('#vehicle-list .vehicle-item-row.selected');
  const price = selectedCard ? selectedCard.getAttribute('data-final-price') : 198;
  const carName = selectedCard ? selectedCard.querySelector('.v-name').textContent : 'OBHAI CNG';

  const btnText = document.getElementById('request-btn-text');
  const btnPrice = document.getElementById('btn-price-display');

  if (btnText) btnText.textContent = `Request ${carName} (বুক করুন)`;
  if (btnPrice) btnPrice.textContent = `৳ ${price}`;
}

function initCustomerVehicleSelector() {
  document.querySelectorAll('#vehicle-list .vehicle-item-row').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#vehicle-list .vehicle-item-row').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const carKey = card.getAttribute('data-car');
      
      // Update top service bubble
      document.querySelectorAll('.obhai-services-bar .service-bubble-card').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-service') === carKey);
      });

      updateMainRequestBtn();
    });
  });
}

function renderCustomerCoupons() {
  const container = document.getElementById('customer-coupons-container');
  if (!container) return;

  container.innerHTML = '';
  appState.coupons.forEach(c => {
    const card = document.createElement('div');
    card.className = 'coupon-card';
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:800;">
        <span style="font-family:monospace; background:var(--bg-subtle); padding:2px 6px; border-radius:4px;">${c.code}</span>
        <span style="color:var(--obhai-green-dark);">${c.discount}% OFF</span>
      </div>
      <div style="font-size:12px; color:var(--text-sub);">${c.title} • সর্বোচ্চ ছাড় ৳ ${c.maxCap}</div>
      <button class="btn-apply-coupon">Apply to Ride</button>
    `;

    card.querySelector('.btn-apply-coupon').addEventListener('click', () => {
      appState.customer.appliedCoupon = c;
      const strip = document.getElementById('applied-coupon-strip');
      const codeTxt = document.getElementById('active-coupon-code-text');
      const descTxt = document.getElementById('active-coupon-desc-text');

      if (strip) strip.style.display = 'flex';
      if (codeTxt) codeTxt.textContent = c.code;
      if (descTxt) descTxt.textContent = `${c.discount}% ডিসকাউন্ট কুপন যুক্ত হয়েছে (সর্বোচ্চ ৳ ${c.maxCap})`;

      document.getElementById('customer-account-modal').classList.remove('active');
      updateCustomerPricing();
      showToast(`🎉 কুপন ${c.code} আপনার ওভাই রাইডে যুক্ত হয়েছে!`);
    });

    container.appendChild(card);
  });
}

function renderCustomerTickets() {
  const container = document.getElementById('customer-tickets-container');
  if (!container) return;

  container.innerHTML = '';
  appState.disputes.forEach(d => {
    const item = document.createElement('div');
    item.className = 'ticket-item';
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:700;">
        <span>${d.id} • ${d.category}</span>
        <span class="table-status-pill ${d.status === 'RESOLVED' ? 'status-active' : ''}">${d.status}</span>
      </div>
      <div style="color:var(--text-sub);">"${d.details}"</div>
      ${d.status === 'RESOLVED' ? `
        <div style="color:var(--obhai-green-dark); font-weight:700; margin-top:4px;">
          ✓ অ্যাডমিন রিফান্ড: ৳ ${d.refundAmount.toFixed(2)} আপনার ওভাই ওয়ালেটে যুক্ত হয়েছে!
        </div>
      ` : `
        <div style="color:#b45309; font-weight:700; margin-top:4px;">
          ⏳ ওভাই হেডকোয়ার্টারে পর্যালোচনাধীন রয়েছে।
        </div>
      `}
    `;
    container.appendChild(item);
  });
}

window.customerSubmitComplaint = function() {
  const issueSelect = document.getElementById('cust-issue-select');
  const tripInp = document.getElementById('cust-trip-id');
  const textInp = document.getElementById('cust-complaint-text');

  const newTicket = {
    id: `OBHAI-TKT-${Math.floor(1000 + Math.random() * 9000)}`,
    userName: appState.customer.name,
    userPhone: appState.customer.phone,
    tripId: tripInp.value,
    category: issueSelect.value,
    details: textInp.value.trim(),
    status: 'PENDING',
    refundAmount: 130.00,
    adminNote: '',
    date: 'এইমাত্র'
  };

  appState.disputes.unshift(newTicket);
  textInp.value = '';

  renderCustomerTickets();
  renderAdminDisputes();
  showToast('✅ আপনার অভিযোগ ওভাই অ্যাডমিন ইনবক্সে পাঠানো হয়েছে।');
};

function initCustomerAccountModal() {
  const modal = document.getElementById('customer-account-modal');
  const walletNavBtn = document.getElementById('open-wallet-btn');
  const footerHelpBtn = document.getElementById('footer-help-btn');
  const closeBtn = document.getElementById('customer-account-close-btn');
  const topupBtn = document.getElementById('modal-topup-btn');

  const openAccount = (tab = 'coupons') => {
    if (modal) modal.classList.add('active');
    document.querySelectorAll('.dash-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-cust-tab') === tab);
    });
    document.querySelectorAll('.cust-dash-panel').forEach(p => {
      p.classList.toggle('active', p.id === `cust-panel-${tab}`);
    });
  };

  if (walletNavBtn) walletNavBtn.addEventListener('click', () => openAccount('coupons'));
  if (footerHelpBtn) {
    footerHelpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAccount('complaints');
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  document.querySelectorAll('.dash-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-cust-tab');
      document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.cust-dash-panel').forEach(p => {
        p.classList.toggle('active', p.id === `cust-panel-${tab}`);
      });
    });
  });

  if (topupBtn) {
    topupBtn.addEventListener('click', () => {
      appState.customer.walletBalance += 500.00;
      localStorage.setItem('obhai_customer_wallet', appState.customer.walletBalance);
      updateCustomerWalletUI();
      showToast('৳ ৫০০.০০ ওভাই পে ওয়ালেটে যোগ করা হয়েছে!');
    });
  }
}

function initCustomerSimulation() {
  const reqBtn = document.getElementById('request-ride-btn');
  const modal = document.getElementById('ride-modal-overlay');
  const cancelBtn = document.getElementById('cancel-search-btn');
  const completeBtn = document.getElementById('complete-sim-trip-btn');
  const finishBtn = document.getElementById('finish-modal-btn');

  const stageSearch = document.getElementById('stage-searching');
  const stageMatched = document.getElementById('stage-matched');
  const stageCompleted = document.getElementById('stage-completed');

  if (reqBtn) {
    reqBtn.addEventListener('click', () => {
      stageSearch.classList.add('active');
      stageMatched.classList.remove('active');
      stageCompleted.classList.remove('active');
      modal.classList.add('active');
      appState.isSearching = true;

      setTimeout(() => {
        if (!appState.isSearching) return;
        stageSearch.classList.remove('active');
        stageMatched.classList.add('active');
        startDriverTracking();
        showToast('ক্যাপ্টেন আবুল কালাম সবুজ সিএনজি নিয়ে রওনা হয়েছেন!');
      }, 2400);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      appState.isSearching = false;
      modal.classList.remove('active');
      showToast('রাইড রিকোয়েস্ট বাতিল করা হয়েছে');
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      clearInterval(driverAnimInterval);
      stageMatched.classList.remove('active');
      stageCompleted.classList.add('active');
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      showToast('ওভাই দিয়ে ভ্রমণ করার জন্য ধন্যবাদ!');
    });
  }
}

function startDriverTracking() {
  if (!mapInstance) return;
  let dLat = appState.route.pickup.lat + 0.008;
  let dLng = appState.route.pickup.lng + 0.006;

  const carIcon = L.divIcon({
    className: 'custom-car-marker',
    html: '<span>🛺</span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  if (driverCarMarker) mapInstance.removeLayer(driverCarMarker);
  driverCarMarker = L.marker([dLat, dLng], { icon: carIcon }).addTo(mapInstance);

  let steps = 0;
  const total = 15;
  clearInterval(driverAnimInterval);
  driverAnimInterval = setInterval(() => {
    steps++;
    const progress = steps / total;
    const curLat = dLat + (appState.route.pickup.lat - dLat) * progress;
    const curLng = dLng + (appState.route.pickup.lng - dLng) * progress;
    if (driverCarMarker) driverCarMarker.setLatLng([curLat, curLng]);
    if (steps >= total) clearInterval(driverAnimInterval);
  }, 1200);
}

// ==========================================================================
// 👨‍✈️ DRIVER / CAPTAIN LOGIC
// ==========================================================================
function initDriverView() {
  const toggleBtn = document.getElementById('toggle-online-btn');
  const statusText = document.getElementById('driver-status-text');
  const acceptBtn = document.getElementById('driver-accept-btn');
  const declineBtn = document.getElementById('driver-decline-btn');

  if (toggleBtn && statusText) {
    toggleBtn.addEventListener('click', () => {
      appState.driver.isOnline = !appState.driver.isOnline;
      if (appState.driver.isOnline) {
        statusText.textContent = 'অনলাইন আছেন (ONLINE)';
        toggleBtn.textContent = 'অফলাইন যান';
        showToast('আপনি এখন অনলাইন আছেন।');
      } else {
        statusText.textContent = 'অফলাইন আছেন (OFFLINE)';
        toggleBtn.textContent = 'অনলাইন যান';
        showToast('আপনি অফলাইনে গেছেন।');
      }
    });
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      showToast('ট্রিপ গ্রহণ করা হয়েছে! মিরপুর ১০ গোলচত্বরে পৌঁছান...');
      appState.driver.todayEarnings += 198.00;
      appState.driver.tripsCompleted += 1;
      localStorage.setItem('obhai_captain_earnings', appState.driver.todayEarnings);
      localStorage.setItem('obhai_captain_trips', appState.driver.tripsCompleted);
      
      const navEarnings = document.getElementById('driver-nav-earnings');
      const bodyEarnings = document.getElementById('driver-today-earnings-val');
      const tripsCount = document.getElementById('driver-completed-trips-count');

      if (navEarnings) navEarnings.textContent = `৳ ${appState.driver.todayEarnings.toFixed(2)}`;
      if (bodyEarnings) bodyEarnings.textContent = `৳ ${appState.driver.todayEarnings.toFixed(2)}`;
      if (tripsCount) tripsCount.textContent = `${appState.driver.tripsCompleted}টি সফল ট্রিপ সম্পন্ন`;
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      showToast('ট্রিপ রিকোয়েস্ট বাতিল করা হয়েছে।');
    });
  }
}

// ==========================================================================
// 🛡️ ADMIN VIEW LOGIC - COMPLETE SYNC WITH COUPONS
// ==========================================================================
function initAdminView() {
  populateAdminInputs();
  bindRealtimePricingInputs();
  syncPricingToCoupons();
  renderAdminCouponsTable();
  renderAdminDisputes();
}

function populateAdminInputs() {
  const p = appState.adminPricing;
  const storeInput = document.getElementById('admin-store-discount');
  const couponInput = document.getElementById('admin-coupon-code');
  const bkashInput = document.getElementById('admin-bkash-cashback');
  const shippingInput = document.getElementById('admin-shipping-cost');
  const saleInput = document.getElementById('admin-sale-price');

  if (storeInput) storeInput.value = p.storeDiscount;
  if (couponInput) couponInput.value = p.couponCode;
  if (bkashInput) bkashInput.value = p.bkashCashback;
  if (shippingInput) shippingInput.value = p.shippingCost;
  if (saleInput) saleInput.value = p.salePrice;

  updateAdminPricingHints();
}

function syncPricingToCoupons() {
  const p = appState.adminPricing;
  if (appState.coupons.length > 0) {
    appState.coupons[0].code = p.couponCode;
    appState.coupons[0].discount = p.storeDiscount;
    appState.coupons[0].maxCap = p.bkashCashback;
    appState.coupons[0].title = `${p.storeDiscount}% ওভাই প্ল্যাটফর্ম ডিসকাউন্ট`;
    appState.coupons[0].status = 'Active';
  } else {
    appState.coupons.unshift({
      code: p.couponCode,
      discount: p.storeDiscount,
      maxCap: p.bkashCashback,
      status: 'Active',
      title: `${p.storeDiscount}% ওভাই প্ল্যাটফর্ম ডিসকাউন্ট`
    });
  }

  localStorage.setItem('obhai_coupons_list', JSON.stringify(appState.coupons));
}

function bindRealtimePricingInputs() {
  const storeInput = document.getElementById('admin-store-discount');
  const couponInput = document.getElementById('admin-coupon-code');
  const bkashInput = document.getElementById('admin-bkash-cashback');
  const shippingInput = document.getElementById('admin-shipping-cost');
  const saleInput = document.getElementById('admin-sale-price');

  const syncAll = () => {
    appState.adminPricing.storeDiscount = parseFloat(storeInput?.value) || 0;
    appState.adminPricing.couponCode = couponInput?.value.trim().toUpperCase() || 'OBHAI10';
    appState.adminPricing.bkashCashback = parseFloat(bkashInput?.value) || 0;
    appState.adminPricing.shippingCost = parseFloat(shippingInput?.value) || 0;
    appState.adminPricing.salePrice = parseFloat(saleInput?.value) || 2050;

    // 1. Sync to coupons list
    syncPricingToCoupons();

    // 2. Save to LocalStorage
    localStorage.setItem('obhai_admin_pricing', JSON.stringify(appState.adminPricing));

    // 3. Update all UI elements
    updateAdminPricingHints();
    renderAdminCouponsTable();
    renderCustomerCoupons();
    updateCustomerPricing();
  };

  [storeInput, couponInput, bkashInput, shippingInput, saleInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', syncAll);
      inp.addEventListener('change', syncAll);
    }
  });
}

function updateAdminPricingHints() {
  const p = appState.adminPricing;
  const hintStore = document.getElementById('hint-store-discount');
  const hintCoupon = document.getElementById('hint-coupon-code');
  const hintBkash = document.getElementById('hint-bkash-cashback');
  const hintShipping = document.getElementById('hint-shipping-cost');
  const hintSale = document.getElementById('hint-sale-price');

  if (hintStore) hintStore.textContent = `${p.storeDiscount}% off`;
  if (hintCoupon) hintCoupon.textContent = p.couponCode;
  if (hintBkash) hintBkash.textContent = `৳ ${p.bkashCashback}`;
  if (hintShipping) hintShipping.textContent = p.shippingCost === 0 ? 'Free shipping / ৳ 0 Surge' : `৳ ${p.shippingCost} Surge`;
  if (hintSale) hintSale.textContent = `৳ ${p.salePrice.toLocaleString()}`;

  const campaignMetric = document.getElementById('admin-active-campaign-metric');
  if (campaignMetric) {
    campaignMetric.textContent = `${p.couponCode} (${p.storeDiscount}% OFF)`;
    if (campaignMetric.nextElementSibling) {
      campaignMetric.nextElementSibling.textContent = `৳ ${p.bkashCashback} bKash Cashback`;
    }
  }
}

window.applyAdminPricingChanges = function() {
  const storeInput = document.getElementById('admin-store-discount');
  const couponInput = document.getElementById('admin-coupon-code');
  const bkashInput = document.getElementById('admin-bkash-cashback');
  const shippingInput = document.getElementById('admin-shipping-cost');
  const saleInput = document.getElementById('admin-sale-price');

  appState.adminPricing.storeDiscount = parseFloat(storeInput?.value) || 0;
  appState.adminPricing.couponCode = couponInput?.value.trim().toUpperCase() || 'OBHAI10';
  appState.adminPricing.bkashCashback = parseFloat(bkashInput?.value) || 0;
  appState.adminPricing.shippingCost = parseFloat(shippingInput?.value) || 0;
  appState.adminPricing.salePrice = parseFloat(saleInput?.value) || 2050;

  // Sync to Coupons list and persist
  syncPricingToCoupons();
  localStorage.setItem('obhai_admin_pricing', JSON.stringify(appState.adminPricing));

  updateAdminPricingHints();
  renderAdminCouponsTable();
  renderCustomerCoupons();
  updateCustomerPricing();

  // Visual button animation
  const applyBtn = document.getElementById('btn-ccp-apply');
  if (applyBtn) {
    const originalHTML = applyBtn.innerHTML;
    applyBtn.innerHTML = `<span>✅ পরিবর্তন সংরক্ষিত হয়েছে!</span>`;
    applyBtn.style.backgroundColor = '#008746';
    setTimeout(() => {
      applyBtn.innerHTML = originalHTML;
      applyBtn.style.backgroundColor = '';
    }, 1800);
  }

  showToast(`✅ ওভাই প্রাইসিং আপডেট হয়েছে: ${appState.adminPricing.couponCode} (${appState.adminPricing.storeDiscount}% OFF, সর্বোচ্চ ছাড় ৳ ${appState.adminPricing.bkashCashback}) লাইভ সক্রিয়!`);
};

function renderAdminCouponsTable() {
  const tbody = document.getElementById('admin-coupons-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  appState.coupons.forEach((c, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="coupon-table-code">${c.code}</span></td>
      <td><strong>${c.discount}% OFF</strong></td>
      <td>৳ ${c.maxCap}</td>
      <td><span class="table-status-pill status-active">${c.status}</span></td>
      <td><button class="btn-delete-row" data-idx="${idx}">Delete</button></td>
    `;

    tr.querySelector('.btn-delete-row').addEventListener('click', () => {
      appState.coupons.splice(idx, 1);
      localStorage.setItem('obhai_coupons_list', JSON.stringify(appState.coupons));
      renderAdminCouponsTable();
      renderCustomerCoupons();
      showToast(`কুপন ${c.code} ডিলিট করা হয়েছে`);
    });

    tbody.appendChild(tr);
  });

  const addCouponBtn = document.getElementById('admin-create-coupon-btn');
  const codeInp = document.getElementById('new-code-input');
  const discInp = document.getElementById('new-discount-input');
  const maxInp = document.getElementById('new-max-input');

  if (addCouponBtn && !addCouponBtn.dataset.bound) {
    addCouponBtn.dataset.bound = "true";
    addCouponBtn.addEventListener('click', () => {
      const code = codeInp.value.trim().toUpperCase();
      const disc = parseFloat(discInp.value);
      const max = parseFloat(maxInp.value) || 150;

      if (!code || isNaN(disc)) {
        showToast('অনুগ্রহ করে কুপন কোড ও ডিসকাউন্ট শতকরা লিখুন', 'error');
        return;
      }

      appState.coupons.unshift({
        code: code,
        discount: disc,
        maxCap: max,
        status: 'Active',
        title: `${disc}% ওভাই প্রোমো ছাড়`
      });

      localStorage.setItem('obhai_coupons_list', JSON.stringify(appState.coupons));

      codeInp.value = '';
      discInp.value = '';
      if (maxInp) maxInp.value = '';

      renderAdminCouponsTable();
      renderCustomerCoupons();
      showToast(`🎟️ নতুন কুপন "${code}" পাবলিশ হয়েছে!`);
    });
  }
}

function renderAdminDisputes() {
  const container = document.getElementById('admin-disputes-list');
  const pendingCountDisplay = document.getElementById('admin-pending-disputes-count');
  if (!container) return;

  const pendingCount = appState.disputes.filter(d => d.status === 'PENDING').length;
  if (pendingCountDisplay) pendingCountDisplay.textContent = `${pendingCount}টি অপেক্ষমান`;

  container.innerHTML = '';
  appState.disputes.forEach((d, idx) => {
    const item = document.createElement('div');
    item.className = `dispute-admin-item ${d.status === 'RESOLVED' ? 'resolved' : ''}`;
    item.innerHTML = `
      <div class="dispute-top-bar">
        <span>👤 ${d.userName} (${d.userPhone})</span>
        <span class="table-status-pill ${d.status === 'RESOLVED' ? 'status-active' : ''}">${d.status}</span>
      </div>
      <div style="font-size:12px; font-weight:700; color:var(--text-main);">
        বিষয়: ${d.category} • <span style="color:var(--text-muted);">${d.tripId}</span>
      </div>
      <div class="dispute-user-note">"${d.details}"</div>

      ${d.status === 'PENDING' ? `
        <div class="dispute-resolution-controls">
          <div class="refund-input-row">
            <label>রিফান্ড অ্যামাউন্ট (৳):</label>
            <input type="number" class="refund-num-input" id="refund-input-${d.id}" value="${d.refundAmount}">
          </div>
          <button class="btn-resolve-credit" id="resolve-btn-${d.id}">
            ✅ রিফান্ড অনুমোদন করুন ও যাত্রীর ওয়ালেটে ৳ ${d.refundAmount} জমা দিন
          </button>
        </div>
      ` : `
        <div style="font-size:11px; font-weight:700; color:var(--obhai-green-dark); background:var(--obhai-green-light); padding:6px 10px; border-radius:var(--radius-sm);">
          ✓ সমাধান সম্পন্ন: ৳ ${d.refundAmount.toFixed(2)} যাত্রীর ওয়ালেটে যুক্ত করা হয়েছে।
        </div>
      `}
    `;

    const resolveBtn = item.querySelector(`#resolve-btn-${d.id}`);
    if (resolveBtn) {
      resolveBtn.addEventListener('click', () => {
        const refundInp = item.querySelector(`#refund-input-${d.id}`);
        const customRefund = parseFloat(refundInp.value) || d.refundAmount;

        d.status = 'RESOLVED';
        d.refundAmount = customRefund;

        appState.customer.walletBalance += customRefund;
        localStorage.setItem('obhai_customer_wallet', appState.customer.walletBalance);
        updateCustomerWalletUI();

        renderAdminDisputes();
        renderCustomerTickets();
        showToast(`✅ অভিযোগ সমাধান হয়েছে! ৳ ${customRefund} যাত্রীর ওয়ালেটে যুক্ত হয়েছে।`);
      });
    }

    container.appendChild(item);
  });
}

// ==========================================================================
// LEAFLET MAP
// ==========================================================================
function initMap() {
  const mapElement = document.getElementById('obhai-map');
  if (!mapElement || typeof L === 'undefined') return;

  mapInstance = L.map('obhai-map', { zoomControl: false, attributionControl: false }).setView([23.7800, 90.3800], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19, subdomains: 'abcd' }).addTo(mapInstance);
  renderMapRoute();

  const recenterBtn = document.getElementById('map-recenter-btn');
  if (recenterBtn) {
    recenterBtn.addEventListener('click', () => {
      const bounds = L.latLngBounds([
        [appState.route.pickup.lat, appState.route.pickup.lng],
        [appState.route.dest.lat, appState.route.dest.lng]
      ]);
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
      showToast('ম্যাপ সেন্টারে আনা হয়েছে');
    });
  }
}

function renderMapRoute() {
  if (!mapInstance) return;
  const p = appState.route.pickup;
  const d = appState.route.dest;

  const pickupIcon = L.divIcon({ className: 'custom-map-pin pin-pickup', html: '●', iconSize: [22, 22] });
  const destIcon = L.divIcon({ className: 'custom-map-pin pin-dest', html: '■', iconSize: [22, 22] });

  if (pickupMarker) mapInstance.removeLayer(pickupMarker);
  if (destMarker) mapInstance.removeLayer(destMarker);
  if (routePolyline) mapInstance.removeLayer(routePolyline);

  pickupMarker = L.marker([p.lat, p.lng], { icon: pickupIcon }).addTo(mapInstance);
  destMarker = L.marker([d.lat, d.lng], { icon: destIcon }).addTo(mapInstance);

  const midLat = (p.lat + d.lat) / 2 + 0.005;
  const midLng = (p.lng + d.lng) / 2 - 0.005;

  routePolyline = L.polyline([[p.lat, p.lng], [midLat, midLng], [d.lat, d.lng]], {
    color: '#00a859',
    weight: 5,
    dashArray: '6, 6'
  }).addTo(mapInstance);

  const bounds = L.latLngBounds([[p.lat, p.lng], [d.lat, d.lng]]);
  mapInstance.fitBounds(bounds, { padding: [50, 50] });
}

// ==========================================================================
// THEME & TOAST
// ==========================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', appState.theme);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '✓'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => { toast.remove(); }, 3200);
}
