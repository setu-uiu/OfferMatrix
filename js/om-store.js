/**
 * OfferMatrix Central Data Store (OMStore)
 * Manages state across Dashboard, Price Alerts, Orders, and Saved Deals.
 */
(function() {
  const STORE_KEY = 'offer_matrix_store_v1';

  const defaultState = {
    user: {
      name: localStorage.getItem('om_user_name') || 'Setu Meherunnesa',
      tier: 'Premium Member',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    savedDeals: [
      {
        id: 'sd-1',
        title: 'Chicken Biryani Combo Meal',
        store: 'Kacchi Bhai - Dhanmondi',
        category: 'food',
        price: 189,
        oldPrice: 270,
        discount: '30% OFF',
        rating: 4.8,
        reviews: 340,
        img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600',
        savedAt: '2026-08-28'
      },
      {
        id: 'sd-2',
        title: 'Uber Premier Airport Drop',
        store: 'Uber BD',
        category: 'ride',
        price: 450,
        oldPrice: 600,
        discount: '25% OFF',
        rating: 4.9,
        reviews: 1250,
        img: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=600',
        savedAt: '2026-08-27'
      },
      {
        id: 'sd-3',
        title: 'CeraVe Hydrating Cleanser 473ml',
        store: 'Beautybooth BD',
        category: 'skincare',
        price: 1250,
        oldPrice: 1650,
        discount: '24% OFF',
        rating: 4.9,
        reviews: 890,
        img: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
        savedAt: '2026-08-25'
      },
      {
        id: 'sd-4',
        title: 'Cheesy Pepperoni Pizza Large',
        store: 'Pizza Hut - Gulshan',
        category: 'food',
        price: 599,
        oldPrice: 850,
        discount: '29% OFF',
        rating: 4.7,
        reviews: 520,
        img: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600',
        savedAt: '2026-08-24'
      },
      {
        id: 'sd-5',
        title: 'The Ordinary Niacinamide 10%',
        store: 'Cosmetica BD',
        category: 'skincare',
        price: 950,
        oldPrice: 1200,
        discount: '21% OFF',
        rating: 4.8,
        reviews: 640,
        img: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600',
        savedAt: '2026-08-22'
      },
      {
        id: 'sd-6',
        title: 'Pathao Car Intercity Promo',
        store: 'Pathao Car',
        category: 'ride',
        price: 220,
        oldPrice: 300,
        discount: '27% OFF',
        rating: 4.6,
        reviews: 410,
        img: 'https://images.pexels.com/photos/38637/car-audi-auto-automotive-38637.jpeg?auto=compress&cs=tinysrgb&w=600',
        savedAt: '2026-08-20'
      }
    ],
    priceAlerts: [
      {
        id: 'pa-1',
        title: 'CeraVe Hydrating Cleanser 473ml',
        store: 'Beautybooth BD',
        category: 'skincare',
        currentPrice: 1250,
        targetPrice: 1200,
        oldPrice: 1650,
        status: 'active',
        drop: '24% Drop',
        img: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=200',
        createdAt: '2026-08-26'
      },
      {
        id: 'pa-2',
        title: 'Kacchi Bhai Platinum Thali',
        store: 'Kacchi Bhai',
        category: 'food',
        currentPrice: 240,
        targetPrice: 250,
        oldPrice: 320,
        status: 'triggered',
        drop: '৳10 Below Target!',
        img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200',
        createdAt: '2026-08-25'
      },
      {
        id: 'pa-3',
        title: 'Pathao Car Airport Route',
        store: 'Pathao Rides',
        category: 'ride',
        currentPrice: 350,
        targetPrice: 300,
        oldPrice: 420,
        status: 'active',
        drop: 'Waiting for Price Drop',
        img: 'https://images.pexels.com/photos/38637/car-audi-auto-automotive-38637.jpeg?auto=compress&cs=tinysrgb&w=200',
        createdAt: '2026-08-22'
      },
      {
        id: 'pa-4',
        title: 'Pixel 8 Pro 128GB Hazel',
        store: 'Gadget & Gear',
        category: 'tech',
        currentPrice: 78000,
        targetPrice: 75000,
        oldPrice: 85000,
        status: 'active',
        drop: 'Near Target',
        img: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=200',
        createdAt: '2026-08-18'
      },
      {
        id: 'pa-5',
        title: 'Pizza Hut Family Feast Combo',
        store: 'Pizza Hut',
        category: 'food',
        currentPrice: 1150,
        targetPrice: 999,
        oldPrice: 1450,
        status: 'active',
        drop: 'Waiting for Promo',
        img: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=200',
        createdAt: '2026-08-15'
      }
    ],
    orders: [
      {
        id: 'OM-8921',
        items: 'Chicken Biryani + Coca Cola 500ml',
        store: 'Kacchi Bhai - Dhanmondi',
        category: 'food',
        total: 299,
        status: 'in_transit',
        statusText: 'Preparing / In Transit',
        date: 'Today, 1:45 PM',
        logoBg: '#d70f64',
        logoText: 'KB',
        img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200'
      },
      {
        id: 'OM-8845',
        items: 'Pathao Car Airport Ride (Sedan)',
        store: 'Pathao Rides',
        category: 'ride',
        total: 450,
        status: 'completed',
        statusText: 'Completed',
        date: 'Yesterday, 6:30 PM',
        logoBg: '#111827',
        logoText: 'PT',
        img: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=200'
      },
      {
        id: 'OM-8790',
        items: 'CeraVe Cleanser + Sunscreen SPF50',
        store: 'Beautybooth BD',
        category: 'skincare',
        total: 2100,
        status: 'delivered',
        statusText: 'Delivered',
        date: '24 Aug 2026',
        logoBg: '#ec4899',
        logoText: 'BB',
        img: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=200'
      },
      {
        id: 'OM-8654',
        items: 'Cheesy Pepperoni Large + Garlic Bread',
        store: 'Pizza Hut',
        category: 'food',
        total: 650,
        status: 'completed',
        statusText: 'Completed',
        date: '20 Aug 2026',
        logoBg: '#d70f64',
        logoText: 'PH',
        img: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=200'
      },
      {
        id: 'OM-8512',
        items: 'Uber Intercity Dhaka to Chattogram',
        store: 'Uber BD',
        category: 'ride',
        total: 1850,
        status: 'completed',
        statusText: 'Completed',
        date: '15 Aug 2026',
        logoBg: '#111827',
        logoText: 'UB',
        img: 'https://images.pexels.com/photos/38637/car-audi-auto-automotive-38637.jpeg?auto=compress&cs=tinysrgb&w=200'
      },
      {
        id: 'OM-8401',
        items: 'The Ordinary Niacinamide 10% 30ml',
        store: 'Cosmetica BD',
        category: 'skincare',
        total: 950,
        status: 'completed',
        statusText: 'Completed',
        date: '10 Aug 2026',
        logoBg: '#ec4899',
        logoText: 'CS',
        img: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=200'
      }
    ]
  };

  class OMStoreManager {
    constructor() {
      this.state = this.loadState();
      this.syncUserName();
    }

    loadState() {
      try {
        const stored = localStorage.getItem(STORE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            user: { ...defaultState.user, ...(parsed.user || {}) },
            savedDeals: parsed.savedDeals || defaultState.savedDeals,
            priceAlerts: parsed.priceAlerts || defaultState.priceAlerts,
            orders: parsed.orders || defaultState.orders
          };
        }
      } catch (e) {
        console.error('Error reading OMStore state:', e);
      }
      this.saveState(defaultState);
      return defaultState;
    }

    saveState(stateToSave) {
      const s = stateToSave || this.state;
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(s));
      } catch (e) {
        console.error('Error saving OMStore state:', e);
      }
      this.updateBadges();
    }

    syncUserName() {
      const omUser = localStorage.getItem('om_user_name');
      if (omUser && omUser !== this.state.user.name) {
        this.state.user.name = omUser;
        this.saveState();
      }
    }

    // ── USER PROFILE ──
    getUser() {
      return this.state.user;
    }

    setUser(userObj) {
      this.state.user = { ...this.state.user, ...userObj };
      if (userObj.name) {
        localStorage.setItem('om_user_name', userObj.name);
      }
      this.saveState();
    }

    // ── SAVED DEALS ──
    getSavedDeals(category) {
      if (!category || category === 'all') return this.state.savedDeals;
      return this.state.savedDeals.filter(d => d.category === category);
    }

    isSaved(idOrTitle) {
      return this.state.savedDeals.some(d => d.id === idOrTitle || d.title === idOrTitle);
    }

    toggleSavedDeal(deal) {
      const idx = this.state.savedDeals.findIndex(d => d.id === deal.id || d.title === deal.title);
      if (idx >= 0) {
        this.state.savedDeals.splice(idx, 1);
        this.saveState();
        return false; // now unsaved
      } else {
        const newDeal = {
          id: deal.id || 'sd-' + Date.now(),
          title: deal.title || 'Saved Item',
          store: deal.store || 'OfferMatrix Partner',
          category: deal.category || 'food',
          price: Number(deal.price) || 0,
          oldPrice: Number(deal.oldPrice) || Number(deal.price) * 1.3,
          discount: deal.discount || '20% OFF',
          rating: deal.rating || 4.8,
          reviews: deal.reviews || 100,
          img: deal.img || 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=600',
          savedAt: new Date().toISOString().split('T')[0]
        };
        this.state.savedDeals.unshift(newDeal);
        this.saveState();
        return true; // now saved
      }
    }

    removeSavedDeal(id) {
      this.state.savedDeals = this.state.savedDeals.filter(d => d.id !== id);
      this.saveState();
    }

    // ── PRICE ALERTS ──
    getPriceAlerts(category) {
      if (!category || category === 'all') return this.state.priceAlerts;
      return this.state.priceAlerts.filter(a => a.category === category);
    }

    addPriceAlert(alert) {
      const newAlert = {
        id: 'pa-' + Date.now(),
        title: alert.title || 'New Price Alert',
        store: alert.store || 'Partner Store',
        category: alert.category || 'food',
        currentPrice: Number(alert.currentPrice) || 0,
        targetPrice: Number(alert.targetPrice) || 0,
        oldPrice: Number(alert.oldPrice) || Number(alert.currentPrice) * 1.25,
        status: 'active',
        drop: alert.drop || 'Tracking Active',
        img: alert.img || 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=200',
        createdAt: new Date().toISOString().split('T')[0]
      };
      this.state.priceAlerts.unshift(newAlert);
      this.saveState();
      return newAlert;
    }

    toggleAlertStatus(id) {
      const alert = this.state.priceAlerts.find(a => a.id === id);
      if (alert) {
        alert.status = alert.status === 'paused' ? 'active' : 'paused';
        this.saveState();
      }
    }

    deletePriceAlert(id) {
      this.state.priceAlerts = this.state.priceAlerts.filter(a => a.id !== id);
      this.saveState();
    }

    // ── ORDERS ──
    getOrders(filterStatus) {
      if (!filterStatus || filterStatus === 'all') return this.state.orders;
      if (filterStatus === 'active') return this.state.orders.filter(o => o.status === 'in_transit' || o.status === 'preparing');
      return this.state.orders.filter(o => o.status === filterStatus);
    }

    addOrder(order) {
      const newOrder = {
        id: 'OM-' + Math.floor(1000 + Math.random() * 9000),
        items: order.items || order.title || 'OfferMatrix Order',
        store: order.store || 'OfferMatrix Partner',
        category: order.category || 'food',
        total: Number(order.total || order.price) || 299,
        status: 'in_transit',
        statusText: 'Preparing / In Transit',
        date: 'Just now',
        logoBg: order.category === 'ride' ? '#111827' : (order.category === 'skincare' ? '#ec4899' : '#d70f64'),
        logoText: (order.store || 'OM').substring(0, 2).toUpperCase(),
        img: order.img || 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=200'
      };
      this.state.orders.unshift(newOrder);
      this.saveState();
      return newOrder;
    }

    reorder(orderId) {
      const prev = this.state.orders.find(o => o.id === orderId);
      if (prev) {
        return this.addOrder({
          items: prev.items,
          store: prev.store,
          category: prev.category,
          total: prev.total,
          img: prev.img
        });
      }
    }

    // ── BADGE SYNCHRONIZATION ──
    updateBadges() {
      const savedCount = this.state.savedDeals.length;
      const alertsCount = this.state.priceAlerts.length;
      const activeOrdersCount = this.state.orders.filter(o => o.status === 'in_transit' || o.status === 'preparing').length || this.state.orders.length;

      // Update sidebar & header badge elements across document
      document.querySelectorAll('.sb-badge-orders, #sb-badge-orders').forEach(el => el.textContent = activeOrdersCount);
      document.querySelectorAll('.sb-badge-alerts, #sb-badge-alerts').forEach(el => el.textContent = alertsCount);
      document.querySelectorAll('.sb-badge-saved, #sb-badge-saved').forEach(el => el.textContent = savedCount);

      // Generic update for older sidebar badges matching specific text
      document.querySelectorAll('.sb-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const badge = item.querySelector('.sb-badge');
        if (!badge) return;
        if (text.includes('orders')) {
          badge.textContent = activeOrdersCount;
        } else if (text.includes('price alerts')) {
          badge.textContent = alertsCount;
        } else if (text.includes('saved')) {
          badge.textContent = savedCount;
        }
      });

      // Update topbar saved button count if present
      const tbSaved = document.querySelector('.tb-saved');
      if (tbSaved) {
        tbSaved.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Saved (${savedCount})`;
      }

      // Update profile display names
      const name = this.state.user.name;
      const firstName = name.split(' ')[0];
      document.querySelectorAll('#tb-name, .tb-uname').forEach(el => el.textContent = name);
      document.querySelectorAll('#hero-fname, .hero-fname-ride, .dash-hi-fname, .dash-hi').forEach(el => {
        if (el.classList.contains('dash-hi')) {
          el.innerHTML = `Hey ${firstName}! &#128075;`;
        } else {
          el.textContent = firstName;
        }
      });
    }
  }

  // Initialize Global Store
  window.OMStore = new OMStoreManager();

  // Run on DOM loaded to sync UI badges and names
  document.addEventListener('DOMContentLoaded', () => {
    window.OMStore.updateBadges();
  });
})();
