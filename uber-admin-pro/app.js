/**
 * ==========================================================================
 * UBER OFFICIAL 3-IN-1 APPLICATION ENGINE
 * 🧑‍💼 Customer | 👨‍✈️ Driver | 🛡️ Admin HQ with Dedicated Login Gate
 * ==========================================================================
 */

// Default Pricing Configuration
const defaultPricing = {
  storeDiscount: 10,       // 10%
  couponCode: 'KIREI10',   // KIREI10
  bkashCashback: 150,      // ৳ 150
  shippingCost: 0,         // ৳ 0 Surge
  salePrice: 2050,         // ৳ 2,050
};

// Load saved pricing from LocalStorage
let initialPricing = { ...defaultPricing };
try {
  const saved = localStorage.getItem('uber_admin_pricing');
  if (saved) initialPricing = { ...defaultPricing, ...JSON.parse(saved) };
} catch (e) {
  console.warn('Could not load saved pricing', e);
}

// Initial Coupons Array with synced first entry
const defaultCoupons = [
  { code: initialPricing.couponCode, discount: initialPricing.storeDiscount, maxCap: initialPricing.bkashCashback, status: 'Active', title: `${initialPricing.storeDiscount}% Platform Discount` },
  { code: 'UBER50', discount: 50, maxCap: 180, status: 'Active', title: '50% First Rides Offer' },
  { code: 'AIRPORT100', discount: 25, maxCap: 100, status: 'Active', title: '৳ 100 Airport Saver' },
  { code: 'COMFORT20', discount: 20, maxCap: 120, status: 'Active', title: '20% Luxury Comfort' },
  { code: 'MOTO30', discount: 30, maxCap: 50, status: 'Active', title: '৳ 30 Off Uber Moto' },
];

let initialCoupons = [...defaultCoupons];
try {
  const savedCoupons = localStorage.getItem('uber_coupons_list');
  if (savedCoupons) {
    initialCoupons = JSON.parse(savedCoupons);
    // Keep 1st coupon in sync with current pricing
    if (initialCoupons.length > 0) {
      initialCoupons[0].code = initialPricing.couponCode;
      initialCoupons[0].discount = initialPricing.storeDiscount;
      initialCoupons[0].maxCap = initialPricing.bkashCashback;
    }
  }
} catch (e) {
  console.warn('Could not load saved coupons', e);
}

// Global Application State
const appState = {
  currentScreen: 'auth', // 'auth', 'customer', 'driver', 'admin'
  selectedAuthRole: 'customer', // 'customer', 'driver', 'admin'
  theme: localStorage.getItem('uber_pro_theme') || 'light',

  // Company Admin Pricing Controls (Matching reference image)
  adminPricing: initialPricing,

  // Active Promo Campaigns (Synced with adminPricing)
  coupons: initialCoupons,

  // Customer Profile & Wallet
  customer: {
    name: 'Nazmus Sakib',
    phone: '+880 1711-234567',
    walletBalance: parseFloat(localStorage.getItem('uber_customer_wallet')) || 550.00,
    appliedCoupon: null,
  },

  // Driver Profile & Earnings
  driver: {
    name: 'Mohammad Rafiq',
    car: 'Silver Toyota Corolla (DHA-GA-11-8492)',
    isOnline: true,
    todayEarnings: parseFloat(localStorage.getItem('uber_driver_earnings')) || 3450.00,
    tripsCompleted: parseInt(localStorage.getItem('uber_driver_trips')) || 12,
  },

  // Customer Complaints / Disputes
  disputes: [
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
  ],

  // Route & Fleet Pricing
  route: {
    pickup: { name: 'Gulshan 2, Dhaka', lat: 23.7925, lng: 90.4078 },
    dest: { name: 'Hazrat Shahjalal Int. Airport', lat: 23.8433, lng: 90.4039 },
    distanceKm: 11.4,
    durationMins: 28,
    selectedCar: 'uberx',
  },

  isSearching: false,
};

// Base Vehicle Rate Constants
const vehicleBaseRates = {
  uberx: { name: 'UberX', base: 120, perKm: 24 },
  comfort: { name: 'Uber Comfort', base: 160, perKm: 32 },
  uberxl: { name: 'UberXL', base: 220, perKm: 42 },
  black: { name: 'Uber Black', base: 350, perKm: 55 },
  moto: { name: 'Uber Moto', base: 50, perKm: 10 },
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
// AUTHENTICATION GATE (SCREEN 1)
// ==========================================================================
function initAuthGate() {
  const roleCards = document.querySelectorAll('.role-login-card');
  const emailInput = document.getElementById('login-email-input');
  const btnText = document.getElementById('login-btn-text');

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const role = card.getAttribute('data-role');
      appState.selectedAuthRole = role;

      if (role === 'customer') {
        if (emailInput) emailInput.value = '+880 1711-234567';
        if (btnText) btnText.textContent = 'Sign In as Customer (Passenger)';
      } else if (role === 'driver') {
        if (emailInput) emailInput.value = '+880 1819-987654';
        if (btnText) btnText.textContent = 'Sign In as Driver (Partner)';
      } else if (role === 'admin') {
        if (emailInput) emailInput.value = 'admin@uber.com';
        if (btnText) btnText.textContent = 'Sign In to Uber HQ Admin Panel';
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
    showToast('Welcome Nazmus! Logged in as Customer (Passenger).');
    if (!mapInstance) {
      setTimeout(() => { initMap(); }, 200);
    } else {
      setTimeout(() => { mapInstance.invalidateSize(); }, 200);
    }
    updateCustomerPricing();
    renderCustomerCoupons();
  } else if (role === 'driver') {
    showToast('Welcome Mohammad Rafiq! Driver portal online.');
  } else if (role === 'admin') {
    showToast('Welcome Super Admin! Company HQ Control Panel active.');
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
  showToast('Logged out successfully. Returned to sign in.');
};

// ==========================================================================
// 🧑‍💼 CUSTOMER VIEW LOGIC (SCREEN 2)
// ==========================================================================
function initCustomerView() {
  initCustomerAccountModal();
  initCustomerVehicleSelector();
  initCustomerSimulation();
  renderCustomerCoupons();
  renderCustomerTickets();
  updateCustomerWalletUI();

  // Quick Chips
  document.querySelectorAll('.quick-chips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const dest = chip.getAttribute('data-dest');
      const destInput = document.getElementById('dest-input');
      if (destInput) destInput.value = dest;
      showToast(`Destination: ${dest}`);
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

function updateCustomerWalletUI() {
  const cashAmount = document.getElementById('cust-cash-amount');
  const modalWallet = document.getElementById('modal-wallet-balance');
  const payLabel = document.getElementById('cust-payment-label');

  if (cashAmount) cashAmount.textContent = `৳ ${appState.customer.walletBalance.toFixed(2)}`;
  if (modalWallet) modalWallet.textContent = `৳ ${appState.customer.walletBalance.toFixed(2)}`;
  if (payLabel) {
    payLabel.textContent = `bKash (৳ ${appState.adminPricing.bkashCashback} Cashback) / Uber Cash (৳ ${Math.round(appState.customer.walletBalance)})`;
  }
}

function updateCustomerPricing() {
  const p = appState.adminPricing;
  const dist = appState.route.distanceKm;

  // Update Announcement Banner
  const title = document.getElementById('announcement-offer-title');
  if (title) {
    title.textContent = `Special Offer Active: ${p.storeDiscount}% Store Discount & ৳ ${p.bkashCashback} bKash Cashback!`;
  }

  const sumCashback = document.getElementById('sum-cashback');
  if (sumCashback) sumCashback.textContent = `৳ ${p.bkashCashback}`;

  const payLabel = document.getElementById('cust-payment-label');
  if (payLabel) {
    payLabel.textContent = `bKash (৳ ${p.bkashCashback} Cashback) / Uber Cash (৳ ${Math.round(appState.customer.walletBalance)})`;
  }

  // Calculate Vehicle Fares
  document.querySelectorAll('#vehicle-list .vehicle-card').forEach(card => {
    const carKey = card.getAttribute('data-car');
    const rate = vehicleBaseRates[carKey];
    if (rate) {
      let originalFare = Math.round(rate.base + (dist * rate.perKm) + p.shippingCost);
      let discountAmt = Math.round(originalFare * (p.storeDiscount / 100));
      let finalFare = Math.max(40, originalFare - discountAmt);

      if (appState.customer.appliedCoupon) {
        const c = appState.customer.appliedCoupon;
        const extraDisc = Math.min(c.maxCap, Math.round(finalFare * (c.discount / 100)));
        finalFare = Math.max(30, finalFare - extraDisc);
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
  const selectedCard = document.querySelector('#vehicle-list .vehicle-card.selected');
  const price = selectedCard ? selectedCard.getAttribute('data-final-price') : 342;
  const carName = selectedCard ? selectedCard.querySelector('.vehicle-name').textContent : 'UberX';

  const btnText = document.getElementById('request-btn-text');
  const btnPrice = document.getElementById('btn-price-display');

  if (btnText) btnText.textContent = `Request ${carName}`;
  if (btnPrice) btnPrice.textContent = `৳ ${price}`;
}

function initCustomerVehicleSelector() {
  document.querySelectorAll('#vehicle-list .vehicle-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('#vehicle-list .vehicle-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
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
        <span style="color:var(--accent-green-dark);">${c.discount}% OFF</span>
      </div>
      <div style="font-size:12px; color:var(--text-secondary);">${c.title} • Max ৳ ${c.maxCap}</div>
      <button class="btn-apply-coupon">Apply to Ride</button>
    `;

    card.querySelector('.btn-apply-coupon').addEventListener('click', () => {
      appState.customer.appliedCoupon = c;
      const strip = document.getElementById('applied-coupon-strip');
      const codeTxt = document.getElementById('active-coupon-code-text');
      const descTxt = document.getElementById('active-coupon-desc-text');

      if (strip) strip.style.display = 'flex';
      if (codeTxt) codeTxt.textContent = c.code;
      if (descTxt) descTxt.textContent = `${c.discount}% Discount Applied (Max ৳ ${c.maxCap})`;

      document.getElementById('customer-account-modal').classList.remove('active');
      updateCustomerPricing();
      showToast(`🎉 Coupon ${c.code} applied to your ride!`);
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
      <div style="color:var(--text-secondary);">"${d.details}"</div>
      ${d.status === 'RESOLVED' ? `
        <div style="color:var(--accent-green-dark); font-weight:700; margin-top:4px;">
          ✓ Admin Refund: ৳ ${d.refundAmount.toFixed(2)} Credited to your Uber Cash!
        </div>
      ` : `
        <div style="color:#b45309; font-weight:700; margin-top:4px;">
          ⏳ Under review by Company Admin HQ.
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
    id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
    userName: appState.customer.name,
    userPhone: appState.customer.phone,
    tripId: tripInp.value,
    category: issueSelect.value,
    details: textInp.value.trim(),
    status: 'PENDING',
    refundAmount: 120.00,
    adminNote: '',
    date: 'Just now'
  };

  appState.disputes.unshift(newTicket);
  textInp.value = '';

  renderCustomerTickets();
  renderAdminDisputes();
  showToast('✅ Complaint submitted! Admin HQ will review and credit refund.');
};

function initCustomerAccountModal() {
  const modal = document.getElementById('customer-account-modal');
  const walletNavBtn = document.getElementById('customer-wallet-nav-btn');
  const profileNavBtn = document.getElementById('customer-profile-nav-btn');
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
  if (profileNavBtn) profileNavBtn.addEventListener('click', () => openAccount('coupons'));
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
      localStorage.setItem('uber_customer_wallet', appState.customer.walletBalance);
      updateCustomerWalletUI();
      showToast('৳ 500.00 added to your Uber Cash balance!');
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
        showToast('Driver Matched: Mohammad Rafiq is arriving in a Silver Toyota Corolla.');
      }, 2400);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      appState.isSearching = false;
      modal.classList.remove('active');
      showToast('Ride request cancelled');
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
      showToast('Trip completed. Thank you for riding with Uber!');
    });
  }
}

function startDriverTracking() {
  if (!mapInstance) return;
  let dLat = appState.route.pickup.lat + 0.009;
  let dLng = appState.route.pickup.lng + 0.007;

  const carIcon = L.divIcon({
    className: 'custom-car-marker',
    html: '<span>🚖</span>',
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
// 👨‍✈️ DRIVER VIEW LOGIC (SCREEN 3)
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
        statusText.textContent = 'ONLINE';
        toggleBtn.textContent = 'Go Offline';
        showToast('You are now ONLINE and receiving trip requests.');
      } else {
        statusText.textContent = 'OFFLINE';
        toggleBtn.textContent = 'Go Online';
        showToast('You are now OFFLINE.');
      }
    });
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      showToast('Trip Accepted! Navigating to pick up Nazmus Sakib (Gulshan 2)...');
      appState.driver.todayEarnings += 342.00;
      appState.driver.tripsCompleted += 1;
      localStorage.setItem('uber_driver_earnings', appState.driver.todayEarnings);
      localStorage.setItem('uber_driver_trips', appState.driver.tripsCompleted);
      
      const navEarnings = document.getElementById('driver-nav-earnings');
      const bodyEarnings = document.getElementById('driver-today-earnings-val');
      const tripsCount = document.getElementById('driver-completed-trips-count');

      if (navEarnings) navEarnings.textContent = `৳ ${appState.driver.todayEarnings.toFixed(2)}`;
      if (bodyEarnings) bodyEarnings.textContent = `৳ ${appState.driver.todayEarnings.toFixed(2)}`;
      if (tripsCount) tripsCount.textContent = `${appState.driver.tripsCompleted} Completed Trips`;
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      showToast('Trip declined.');
    });
  }
}

// ==========================================================================
// 🛡️ ADMIN VIEW LOGIC (SCREEN 4) - COMPLETE AUTO-SYNC WITH COUPONS TABLE
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

/**
 * Ensures that the first coupon in the Coupon Manager table ALWAYS reflects
 * the Coupon Code, Store Discount, and bKash Cashback set in the Pricing card!
 */
function syncPricingToCoupons() {
  const p = appState.adminPricing;
  if (appState.coupons.length > 0) {
    appState.coupons[0].code = p.couponCode;
    appState.coupons[0].discount = p.storeDiscount;
    appState.coupons[0].maxCap = p.bkashCashback;
    appState.coupons[0].title = `${p.storeDiscount}% Platform Discount`;
    appState.coupons[0].status = 'Active';
  } else {
    appState.coupons.unshift({
      code: p.couponCode,
      discount: p.storeDiscount,
      maxCap: p.bkashCashback,
      status: 'Active',
      title: `${p.storeDiscount}% Platform Discount`
    });
  }

  localStorage.setItem('uber_coupons_list', JSON.stringify(appState.coupons));
}

function bindRealtimePricingInputs() {
  const storeInput = document.getElementById('admin-store-discount');
  const couponInput = document.getElementById('admin-coupon-code');
  const bkashInput = document.getElementById('admin-bkash-cashback');
  const shippingInput = document.getElementById('admin-shipping-cost');
  const saleInput = document.getElementById('admin-sale-price');

  const syncAll = () => {
    appState.adminPricing.storeDiscount = parseFloat(storeInput?.value) || 0;
    appState.adminPricing.couponCode = couponInput?.value.trim().toUpperCase() || 'KIREI10';
    appState.adminPricing.bkashCashback = parseFloat(bkashInput?.value) || 0;
    appState.adminPricing.shippingCost = parseFloat(shippingInput?.value) || 0;
    appState.adminPricing.salePrice = parseFloat(saleInput?.value) || 2050;

    // 1. Sync to coupons list
    syncPricingToCoupons();

    // 2. Save to LocalStorage
    localStorage.setItem('uber_admin_pricing', JSON.stringify(appState.adminPricing));

    // 3. Update all UI elements in real time
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
  appState.adminPricing.couponCode = couponInput?.value.trim().toUpperCase() || 'KIREI10';
  appState.adminPricing.bkashCashback = parseFloat(bkashInput?.value) || 0;
  appState.adminPricing.shippingCost = parseFloat(shippingInput?.value) || 0;
  appState.adminPricing.salePrice = parseFloat(saleInput?.value) || 2050;

  // Sync to Coupons list and persist
  syncPricingToCoupons();
  localStorage.setItem('uber_admin_pricing', JSON.stringify(appState.adminPricing));

  updateAdminPricingHints();
  renderAdminCouponsTable();
  renderCustomerCoupons();
  updateCustomerPricing();

  // Visual button confirmation animation
  const applyBtn = document.getElementById('btn-ccp-apply');
  if (applyBtn) {
    const originalHTML = applyBtn.innerHTML;
    applyBtn.innerHTML = `<span>✅ Changes Applied & Saved!</span>`;
    applyBtn.style.backgroundColor = '#16a34a';
    setTimeout(() => {
      applyBtn.innerHTML = originalHTML;
      applyBtn.style.backgroundColor = '';
    }, 1800);
  }

  showToast(`✅ Pricing updated: ${appState.adminPricing.couponCode} (${appState.adminPricing.storeDiscount}% OFF, Max Cap ৳ ${appState.adminPricing.bkashCashback}) is now Live!`);
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
      localStorage.setItem('uber_coupons_list', JSON.stringify(appState.coupons));
      renderAdminCouponsTable();
      renderCustomerCoupons();
      showToast(`Coupon ${c.code} deleted`);
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
        showToast('Please enter coupon code and discount percentage', 'error');
        return;
      }

      appState.coupons.unshift({
        code: code,
        discount: disc,
        maxCap: max,
        status: 'Active',
        title: `${disc}% Promo Discount`
      });

      localStorage.setItem('uber_coupons_list', JSON.stringify(appState.coupons));

      codeInp.value = '';
      discInp.value = '';
      if (maxInp) maxInp.value = '';

      renderAdminCouponsTable();
      renderCustomerCoupons();
      showToast(`🎟️ New coupon "${code}" published!`);
    });
  }
}

function renderAdminDisputes() {
  const container = document.getElementById('admin-disputes-list');
  const pendingCountDisplay = document.getElementById('admin-pending-disputes-count');
  if (!container) return;

  const pendingCount = appState.disputes.filter(d => d.status === 'PENDING').length;
  if (pendingCountDisplay) pendingCountDisplay.textContent = `${pendingCount} Pending`;

  container.innerHTML = '';
  appState.disputes.forEach((d, idx) => {
    const item = document.createElement('div');
    item.className = `dispute-admin-item ${d.status === 'RESOLVED' ? 'resolved' : ''}`;
    item.innerHTML = `
      <div class="dispute-top-bar">
        <span>👤 ${d.userName} (${d.userPhone})</span>
        <span class="table-status-pill ${d.status === 'RESOLVED' ? 'status-active' : ''}">${d.status}</span>
      </div>
      <div style="font-size:12px; font-weight:700; color:var(--text-primary);">
        Issue: ${d.category} • <span style="color:var(--text-muted);">${d.tripId}</span>
      </div>
      <div class="dispute-user-note">"${d.details}"</div>

      ${d.status === 'PENDING' ? `
        <div class="dispute-resolution-controls">
          <div class="refund-input-row">
            <label>Credit Refund (৳):</label>
            <input type="number" class="refund-num-input" id="refund-input-${d.id}" value="${d.refundAmount}">
          </div>
          <button class="btn-resolve-credit" id="resolve-btn-${d.id}">
            ✅ Resolve & Credit ৳ ${d.refundAmount} to Rider Wallet
          </button>
        </div>
      ` : `
        <div style="font-size:11px; font-weight:700; color:var(--accent-green-dark); background:var(--accent-green-light); padding:6px 10px; border-radius:var(--radius-sm);">
          ✓ Resolved: ৳ ${d.refundAmount.toFixed(2)} refunded to rider wallet.
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
        localStorage.setItem('uber_customer_wallet', appState.customer.walletBalance);
        updateCustomerWalletUI();

        renderAdminDisputes();
        renderCustomerTickets();
        showToast(`✅ Dispute resolved! ৳ ${customRefund} credited to customer wallet.`);
      });
    }

    container.appendChild(item);
  });
}

// ==========================================================================
// LEAFLET MAP ENGINE
// ==========================================================================
function initMap() {
  const mapElement = document.getElementById('uber-map');
  if (!mapElement || typeof L === 'undefined') return;

  mapInstance = L.map('uber-map', { zoomControl: false, attributionControl: false }).setView([23.8103, 90.4125], 13);
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
      showToast('Map recentered');
    });
  }
}

function renderMapRoute() {
  if (!mapInstance) return;
  const p = appState.route.pickup;
  const d = appState.route.dest;

  const pickupIcon = L.divIcon({ className: 'custom-map-pin pin-pickup', html: '●', iconSize: [20, 20] });
  const destIcon = L.divIcon({ className: 'custom-map-pin pin-dest', html: '■', iconSize: [20, 20] });

  if (pickupMarker) mapInstance.removeLayer(pickupMarker);
  if (destMarker) mapInstance.removeLayer(destMarker);
  if (routePolyline) mapInstance.removeLayer(routePolyline);

  pickupMarker = L.marker([p.lat, p.lng], { icon: pickupIcon }).addTo(mapInstance);
  destMarker = L.marker([d.lat, d.lng], { icon: destIcon }).addTo(mapInstance);

  const midLat = (p.lat + d.lat) / 2 + 0.006;
  const midLng = (p.lng + d.lng) / 2 - 0.008;

  routePolyline = L.polyline([[p.lat, p.lng], [midLat, midLng], [d.lat, d.lng]], {
    color: '#000000',
    weight: 5,
    dashArray: '5, 5'
  }).addTo(mapInstance);

  const bounds = L.latLngBounds([[p.lat, p.lng], [d.lat, d.lng]]);
  mapInstance.fitBounds(bounds, { padding: [50, 50] });
}

// ==========================================================================
// THEME & TOAST
// ==========================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', appState.theme);
  const toggles = [
    document.getElementById('auth-theme-toggle'),
    document.getElementById('customer-theme-toggle'),
    document.getElementById('admin-theme-toggle')
  ];

  toggles.forEach(toggle => {
    if (toggle) {
      toggle.addEventListener('click', () => {
        appState.theme = appState.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', appState.theme);
        localStorage.setItem('uber_pro_theme', appState.theme);
        showToast(`Switched to ${appState.theme.toUpperCase()} mode`);
      });
    }
  });
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
