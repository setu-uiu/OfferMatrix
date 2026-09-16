import { Restaurant, PromoCode, Rider, Order, User, MenuItem, PaymentMethod } from '../types.js';
import { INITIAL_RESTAURANTS, INITIAL_PROMOS, INITIAL_RIDERS } from '../data/initialData.js';

const STORAGE_KEYS = {
  USER: 'fbd_user',
  CART: 'fbd_cart',
  ORDER: 'fbd_order',
  HIST: 'fbd_history',
  FAV: 'fbd_favs',
  RESTAURANTS: 'fbd_restaurants',
  PROMOS: 'fbd_promos',
  RIDERS: 'fbd_riders',
  MODE: 'fbd_mode',
  LOCATION: 'fbd_location',
};

// LocalStorage helpers
export const storage = {
  get: <T>(key: string, defaultVal: T): T => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : defaultVal;
    } catch {
      return defaultVal;
    }
  },
  set: <T>(key: string, val: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // Storage quota or error
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
  KEYS: STORAGE_KEYS,
};

// API Client
export const api = {
  // Auth
  login: async (identifier: string, password = 'password', role: 'customer' | 'admin' = 'customer'): Promise<User> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role }),
      });
      if (res.ok) {
        const data = await res.json();
        storage.set(STORAGE_KEYS.USER, data.user);
        return data.user;
      }
    } catch {
      // Fallback
    }

    const fallbackUser: User = {
      id: role === 'admin' ? 'usr_admin_1' : 'usr_customer_' + Date.now(),
      name: role === 'admin' ? 'Admin Manager' : identifier.includes('@') ? identifier.split('@')[0] : 'Foodi User',
      email: identifier.includes('@') ? identifier : `${identifier}@foodi.bd`,
      phone: identifier.includes('@') ? '01700000000' : identifier,
      role,
    };
    storage.set(STORAGE_KEYS.USER, fallbackUser);
    return fallbackUser;
  },

  register: async (name: string, email: string, phone: string, role: 'customer' | 'admin' = 'customer'): Promise<User> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, role }),
      });
      if (res.ok) {
        const data = await res.json();
        storage.set(STORAGE_KEYS.USER, data.user);
        return data.user;
      }
    } catch {}

    const fallbackUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone,
      role,
    };
    storage.set(STORAGE_KEYS.USER, fallbackUser);
    return fallbackUser;
  },

  logout: async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    storage.remove(STORAGE_KEYS.USER);
  },

  // Restaurants
  getRestaurants: async (cat = 'All', q = ''): Promise<Restaurant[]> => {
    try {
      const params = new URLSearchParams();
      if (cat !== 'All') params.append('cat', cat);
      if (q) params.append('q', q);

      const res = await fetch(`/api/restaurants?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        storage.set(STORAGE_KEYS.RESTAURANTS, data.restaurants);
        return data.restaurants;
      }
    } catch {}

    let cached = storage.get<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    if (cat !== 'All') {
      cached = cached.filter((r) => r.cats.includes(cat));
    }
    if (q) {
      const query = q.toLowerCase();
      cached = cached.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.menu.some((m) => m.name.toLowerCase().includes(query))
      );
    }
    return cached;
  },

  getRestaurant: async (id: number): Promise<Restaurant | undefined> => {
    try {
      const res = await fetch(`/api/restaurants/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.restaurant;
      }
    } catch {}

    const cached = storage.get<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    return cached.find((r) => r.id === id);
  },

  addRestaurant: async (r: Partial<Restaurant>): Promise<Restaurant> => {
    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(r),
      });
      if (res.ok) {
        const data = await res.json();
        return data.restaurant;
      }
    } catch {}

    const list = storage.get<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    const newR: Restaurant = {
      id: Date.now(),
      name: r.name || 'New Restaurant',
      img: r.img || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      time: r.time || '20-30 min',
      fee: r.fee || 30,
      cats: r.cats || ['Burger'],
      cuisine: r.cuisine || 'Fast Food',
      menu: [],
    };
    list.unshift(newR);
    storage.set(STORAGE_KEYS.RESTAURANTS, list);
    return newR;
  },

  deleteRestaurant: async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/restaurants/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}

    const list = storage.get<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    const filtered = list.filter((r) => r.id !== id);
    storage.set(STORAGE_KEYS.RESTAURANTS, filtered);
    return true;
  },

  addMenuItem: async (restId: number, item: Partial<MenuItem>): Promise<MenuItem> => {
    try {
      const res = await fetch(`/api/restaurants/${restId}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const data = await res.json();
        return data.item;
      }
    } catch {}

    const list = storage.get<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    const r = list.find((x) => x.id === restId);
    const newItem: MenuItem = {
      id: Date.now(),
      name: item.name || 'Food Item',
      desc: item.desc || '',
      price: item.price || 150,
      popular: Boolean(item.popular),
    };
    if (r) {
      r.menu.push(newItem);
      storage.set(STORAGE_KEYS.RESTAURANTS, list);
    }
    return newItem;
  },

  deleteMenuItem: async (restId: number, itemId: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/restaurants/${restId}/menu/${itemId}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {}

    const list = storage.get<Restaurant[]>(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    const r = list.find((x) => x.id === restId);
    if (r) {
      r.menu = r.menu.filter((m) => m.id !== itemId);
      storage.set(STORAGE_KEYS.RESTAURANTS, list);
    }
    return true;
  },

  // Promos
  getPromos: async (): Promise<Record<string, PromoCode>> => {
    try {
      const res = await fetch('/api/promos');
      if (res.ok) {
        const data = await res.json();
        storage.set(STORAGE_KEYS.PROMOS, data.promos);
        return data.promos;
      }
    } catch {}
    return storage.get<Record<string, PromoCode>>(STORAGE_KEYS.PROMOS, INITIAL_PROMOS);
  },

  validatePromo: async (code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message?: string }> => {
    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      if (res.ok) {
        const data = await res.json();
        return { valid: true, discount: data.discount };
      } else {
        const err = await res.json();
        return { valid: false, discount: 0, message: err.message || 'Invalid promo code' };
      }
    } catch {}

    const allPromos = storage.get<Record<string, PromoCode>>(STORAGE_KEYS.PROMOS, INITIAL_PROMOS);
    const p = allPromos[code.toUpperCase().trim()];
    if (!p) return { valid: false, discount: 0, message: 'Invalid promo code' };
    if (p.minOrder && subtotal < p.minOrder) {
      return { valid: false, discount: 0, message: `Minimum order for ${code} is ৳${p.minOrder}` };
    }

    let discount = 0;
    if (p.pct) discount = Math.min(Math.round((subtotal * p.pct) / 100), p.max || 99999);
    else if (p.flat) discount = Math.min(p.flat, subtotal);
    else if (p.freeDelivery) discount = 40;
    return { valid: true, discount };
  },

  addPromo: async (promo: PromoCode): Promise<void> => {
    try {
      await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo),
      });
    } catch {}
    const list = storage.get<Record<string, PromoCode>>(STORAGE_KEYS.PROMOS, INITIAL_PROMOS);
    list[promo.code.toUpperCase()] = promo;
    storage.set(STORAGE_KEYS.PROMOS, list);
  },

  deletePromo: async (code: string): Promise<void> => {
    try {
      await fetch(`/api/promos/${code}`, { method: 'DELETE' });
    } catch {}
    const list = storage.get<Record<string, PromoCode>>(STORAGE_KEYS.PROMOS, INITIAL_PROMOS);
    delete list[code.toUpperCase()];
    storage.set(STORAGE_KEYS.PROMOS, list);
  },

  // Riders
  getRiders: async (): Promise<Rider[]> => {
    try {
      const res = await fetch('/api/riders');
      if (res.ok) {
        const data = await res.json();
        storage.set(STORAGE_KEYS.RIDERS, data.riders);
        return data.riders;
      }
    } catch {}
    return storage.get<Rider[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
  },

  addRider: async (rider: Partial<Rider>): Promise<Rider> => {
    try {
      const res = await fetch('/api/riders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rider),
      });
      if (res.ok) {
        const data = await res.json();
        return data.rider;
      }
    } catch {}

    const list = storage.get<Rider[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
    const newRider: Rider = {
      id: Date.now(),
      name: rider.name || 'New Rider',
      phone: rider.phone || '01700000000',
      vehicleNo: rider.vehicleNo || 'Dhaka Metro-Ha 99-1234',
      status: rider.status || 'online',
      totalDeliveries: 0,
      rating: 5.0,
    };
    list.push(newRider);
    storage.set(STORAGE_KEYS.RIDERS, list);
    return newRider;
  },

  deleteRider: async (id: number): Promise<void> => {
    try {
      await fetch(`/api/riders/${id}`, { method: 'DELETE' });
    } catch {}
    const list = storage.get<Rider[]>(STORAGE_KEYS.RIDERS, INITIAL_RIDERS);
    storage.set(STORAGE_KEYS.RIDERS, list.filter((r) => r.id !== id));
  },

  // Payment Processing
  processPayment: async (
    method: PaymentMethod,
    amount: number,
    accountOrCard: string,
    pinOrOtp = ''
  ): Promise<{ success: boolean; transactionId: string; message: string }> => {
    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, amount, accountOrCard, pinOrOtp }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 700));
    return {
      success: true,
      transactionId: `${method.toUpperCase()}-${Date.now().toString().slice(-8)}`,
      message:
        method === 'cod'
          ? 'Cash on Delivery confirmed'
          : `Payment of ৳${amount} confirmed via ${method.toUpperCase()}`,
    };
  },

  // Orders
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch {}

    const rider = INITIAL_RIDERS[0];
    const fallbackOrder: Order = {
      id: 'FBD-' + Math.floor(100000 + Math.random() * 900000),
      items: orderData.items || [],
      totals: orderData.totals || { sub: 0, fee: 30, vat: 0, disc: 0, total: 30 },
      address: orderData.address || 'Dhanmondi, Dhaka',
      notes: orderData.notes || '',
      payment: orderData.payment || 'bkash',
      paymentStatus: orderData.payment === 'cod' ? 'pending' : 'paid',
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      placedAt: new Date().toISOString(),
      estDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
      status: 0,
      rider,
      riderProgress: 5,
    };
    return fallbackOrder;
  },

  getOrder: async (id: string): Promise<Order | undefined> => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch {}
    const current = storage.get<Order | null>(STORAGE_KEYS.ORDER, null);
    if (current && current.id === id) return current;
    return undefined;
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        return data.orders;
      }
    } catch {}
    return [];
  },

  updateOrderStatus: async (id: string, status: number): Promise<Order | undefined> => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch {}
    return undefined;
  },
};
