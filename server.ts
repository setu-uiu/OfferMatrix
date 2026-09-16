import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_RESTAURANTS, INITIAL_PROMOS, INITIAL_RIDERS } from './src/data/initialData.js';
import { Restaurant, MenuItem, PromoCode, Rider, Order, User, CartItem, OrderStatusStep } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory Database
  let users: User[] = [
    {
      id: 'usr_customer_1',
      name: 'Tanvir Ahmed',
      email: 'user@foodi.bd',
      phone: '01712345678',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 'usr_admin_1',
      name: 'Super Admin',
      email: 'admin@foodi.bd',
      phone: '01912345678',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
  ];

  let restaurants: Restaurant[] = JSON.parse(JSON.stringify(INITIAL_RESTAURANTS));
  let promos: Record<string, PromoCode> = JSON.parse(JSON.stringify(INITIAL_PROMOS));
  let riders: Rider[] = JSON.parse(JSON.stringify(INITIAL_RIDERS));
  let orders: Order[] = [];

  // Active SSE connections for order updates
  const sseClients = new Map<string, Set<Response>>();

  function broadcastOrderUpdate(order: Order, eventType = 'order_updated') {
    const clients = sseClients.get(order.id);
    if (clients) {
      const payload = JSON.stringify({ type: eventType, order });
      clients.forEach((res) => {
        try {
          res.write(`data: ${payload}\n\n`);
        } catch {
          clients.delete(res);
        }
      });
    }
  }

  // Automatic Order Progression Workflow
  setInterval(() => {
    orders.forEach((order) => {
      if (order.status < 3) {
        const now = Date.now();
        const elapsed = (now - new Date(order.placedAt).getTime()) / 1000;

        let newStatus: OrderStatusStep = order.status;
        if (elapsed > 45 && order.status === 2) {
          newStatus = 3; // Delivered
          order.riderProgress = 100;
        } else if (elapsed > 25 && order.status === 1) {
          newStatus = 2; // On the way
          order.riderProgress = 50;
        } else if (elapsed > 10 && order.status === 0) {
          newStatus = 1; // Preparing
          order.riderProgress = 15;
        }

        if (newStatus !== order.status) {
          order.status = newStatus;
          if (newStatus === 3 && order.paymentStatus === 'pending') {
            order.paymentStatus = 'paid';
          }
          broadcastOrderUpdate(order, 'order_status_change');
        } else if (order.status === 2) {
          // Increment rider progress
          order.riderProgress = Math.min(95, (order.riderProgress || 50) + 2);
          broadcastOrderUpdate(order, 'rider_location');
        }
      }
    });
  }, 3000);

  // ================= API ROUTES =================

  // Health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { identifier, password, role } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Email or phone and password are required' });
      return;
    }

    const trimmed = identifier.trim().toLowerCase();
    let found = users.find(
      (u) => u.email.toLowerCase() === trimmed || u.phone === trimmed
    );

    if (!found) {
      // Create user account if valid
      const isAd = role === 'admin' || trimmed.includes('admin');
      found = {
        id: 'usr_' + Date.now(),
        name: isAd ? 'Admin User' : trimmed.split('@')[0],
        email: trimmed.includes('@') ? trimmed : `${trimmed}@foodi.bd`,
        phone: trimmed.includes('@') ? '01700000000' : trimmed,
        role: isAd ? 'admin' : 'customer',
      };
      users.push(found);
    }

    res.json({ user: found, token: 'mock-jwt-token-' + found.id });
  });

  // Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone, role } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '01700000000',
      role: role === 'admin' ? 'admin' : 'customer',
    };
    users.push(newUser);
    res.json({ user: newUser, token: 'mock-jwt-token-' + newUser.id });
  });

  // Auth: Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Auth: Me
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.includes('usr_admin')) {
      res.json({ user: users.find((u) => u.role === 'admin') });
    } else {
      res.json({ user: users[0] });
    }
  });

  // Restaurants: List & Filter
  app.get('/api/restaurants', (req: Request, res: Response) => {
    const { cat, q } = req.query;
    let list = [...restaurants];

    if (cat && cat !== 'All') {
      list = list.filter((r) => r.cats.includes(String(cat)));
    }

    if (q) {
      const search = String(q).toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.cuisine.toLowerCase().includes(search) ||
          r.menu.some((m) => m.name.toLowerCase().includes(search))
      );
    }

    res.json({ restaurants: list });
  });

  // Restaurant: Single
  app.get('/api/restaurants/:id', (req: Request, res: Response) => {
    const r = restaurants.find((x) => x.id === Number(req.params.id));
    if (!r) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }
    res.json({ restaurant: r });
  });

  // Admin: Add Restaurant
  app.post('/api/restaurants', (req: Request, res: Response) => {
    const { name, img, cuisine, cats, fee, time } = req.body;
    if (!name || !cuisine) {
      res.status(400).json({ error: 'Restaurant name and cuisine are required' });
      return;
    }

    const newRest: Restaurant = {
      id: Date.now(),
      name: name.trim(),
      img: img?.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      rating: 4.5,
      time: time?.trim() || '20-30 min',
      fee: Number(fee) || 30,
      cats: Array.isArray(cats) ? cats : String(cats).split(',').map((s) => s.trim()).filter(Boolean),
      cuisine: cuisine.trim(),
      menu: [],
    };

    restaurants.unshift(newRest);
    res.status(201).json({ restaurant: newRest });
  });

  // Admin: Update Restaurant
  app.put('/api/restaurants/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const idx = restaurants.findIndex((r) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    restaurants[idx] = { ...restaurants[idx], ...req.body, id };
    res.json({ restaurant: restaurants[idx] });
  });

  // Admin: Delete Restaurant
  app.delete('/api/restaurants/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (restaurants.length <= 1) {
      res.status(400).json({ error: 'At least one restaurant must remain on platform' });
      return;
    }
    restaurants = restaurants.filter((r) => r.id !== id);
    res.json({ success: true, id });
  });

  // Admin: Add Menu Item
  app.post('/api/restaurants/:id/menu', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const r = restaurants.find((x) => x.id === id);
    if (!r) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    const { name, desc, price, popular, category } = req.body;
    if (!name || price === undefined) {
      res.status(400).json({ error: 'Name and price are required' });
      return;
    }

    const item: MenuItem = {
      id: Date.now(),
      name: name.trim(),
      desc: desc?.trim() || '',
      price: Number(price),
      popular: Boolean(popular),
      category: category?.trim() || 'Main',
    };

    r.menu.push(item);
    res.status(201).json({ item, restaurant: r });
  });

  // Admin: Delete Menu Item
  app.delete('/api/restaurants/:id/menu/:itemId', (req: Request, res: Response) => {
    const restId = Number(req.params.id);
    const itemId = Number(req.params.itemId);
    const r = restaurants.find((x) => x.id === restId);
    if (!r) {
      res.status(404).json({ error: 'Restaurant not found' });
      return;
    }

    r.menu = r.menu.filter((m) => m.id !== itemId);
    res.json({ success: true, itemId });
  });

  // Promos: List
  app.get('/api/promos', (req: Request, res: Response) => {
    res.json({ promos });
  });

  // Promos: Validate
  app.post('/api/promos/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    const key = String(code || '').trim().toUpperCase();
    const p = promos[key];

    if (!p) {
      res.status(400).json({ valid: false, message: 'Invalid promo code' });
      return;
    }

    if (p.minOrder && subtotal < p.minOrder) {
      res.status(400).json({
        valid: false,
        message: `Minimum order amount for ${key} is ৳${p.minOrder}`,
      });
      return;
    }

    let discount = 0;
    if (p.pct) {
      discount = Math.min(Math.round((subtotal * p.pct) / 100), p.max || 99999);
    } else if (p.flat) {
      discount = Math.min(p.flat, subtotal);
    } else if (p.freeDelivery) {
      discount = 40; // Free standard delivery
    }

    res.json({ valid: true, code: key, discount, promo: p });
  });

  // Admin: Add Promo
  app.post('/api/promos', (req: Request, res: Response) => {
    const { code, pct, flat, max, minOrder, freeDelivery } = req.body;
    const key = String(code || '').trim().toUpperCase();
    if (!key) {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    promos[key] = {
      code: key,
      pct: pct ? Number(pct) : undefined,
      flat: flat ? Number(flat) : undefined,
      max: max ? Number(max) : undefined,
      minOrder: minOrder ? Number(minOrder) : 0,
      freeDelivery: Boolean(freeDelivery),
    };

    res.status(201).json({ promo: promos[key] });
  });

  // Admin: Delete Promo
  app.delete('/api/promos/:code', (req: Request, res: Response) => {
    const key = String(req.params.code).toUpperCase();
    if (promos[key]) {
      delete promos[key];
      res.json({ success: true, code: key });
    } else {
      res.status(404).json({ error: 'Promo not found' });
    }
  });

  // Riders: List
  app.get('/api/riders', (req: Request, res: Response) => {
    res.json({ riders });
  });

  // Admin: Add Rider
  app.post('/api/riders', (req: Request, res: Response) => {
    const { name, phone, vehicleNo, status } = req.body;
    if (!name || !phone) {
      res.status(400).json({ error: 'Rider name and phone are required' });
      return;
    }

    const newRider: Rider = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      vehicleNo: vehicleNo?.trim() || 'Dhaka Metro-Ha 33-8821',
      status: status || 'online',
      totalDeliveries: 0,
      rating: 5.0,
      coords: { lat: 23.75 + Math.random() * 0.05, lng: 90.38 + Math.random() * 0.05 },
    };

    riders.push(newRider);
    res.status(201).json({ rider: newRider });
  });

  // Admin: Update Rider
  app.put('/api/riders/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const idx = riders.findIndex((r) => r.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Rider not found' });
      return;
    }

    riders[idx] = { ...riders[idx], ...req.body, id };
    res.json({ rider: riders[idx] });
  });

  // Admin: Delete Rider
  app.delete('/api/riders/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);
    riders = riders.filter((r) => r.id !== id);
    res.json({ success: true, id });
  });

  // Secure Payment Gateway Process
  app.post('/api/payments/process', async (req: Request, res: Response) => {
    const { method, amount, accountOrCard, pinOrOtp } = req.body;

    if (!method || !amount) {
      res.status(400).json({ error: 'Payment method and amount are required' });
      return;
    }

    // Payment gateway verification latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const txnPrefix =
      method === 'bkash'
        ? 'BKS'
        : method === 'nagad'
        ? 'NGD'
        : method === 'card'
        ? 'CRD'
        : 'COD';
    const txnId = `${txnPrefix}-${Date.now().toString().slice(-8)}`;

    res.json({
      success: true,
      transactionId: txnId,
      amount,
      method,
      status: method === 'cod' ? 'pending' : 'paid',
      timestamp: new Date().toISOString(),
      message:
        method === 'cod'
          ? 'Order confirmed. Please pay in cash or digital wallet upon delivery.'
          : `Payment of ৳${amount} verified successfully via ${method.toUpperCase()}.`,
    });
  });

  // Orders: List
  app.get('/api/orders', (req: Request, res: Response) => {
    res.json({ orders });
  });

  // Orders: Single
  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const o = orders.find((x) => x.id === req.params.id);
    if (!o) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ order: o });
  });

  // Orders: Create
  app.post('/api/orders', (req: Request, res: Response) => {
    const { items, totals, address, notes, payment, user } = req.body;

    if (!items || !items.length || !totals || !address) {
      res.status(400).json({ error: 'Items, totals and delivery address are required' });
      return;
    }

    const assignedRider =
      riders.find((r) => r.status === 'online') || riders[0];

    const newOrder: Order = {
      id: 'FBD-' + Math.floor(100000 + Math.random() * 900000),
      userId: user?.id || 'usr_customer_1',
      userName: user?.name || 'Foodi User',
      userPhone: user?.phone || '01XXXXXXXXX',
      items,
      totals,
      address,
      notes: notes || '',
      payment,
      paymentStatus: payment === 'cod' ? 'pending' : 'paid',
      transactionId: `${payment.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      placedAt: new Date().toISOString(),
      estDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
      status: 0,
      rider: assignedRider,
      riderProgress: 5,
      deliveryLocation: address,
    };

    orders.unshift(newOrder);

    // Update rider stats
    if (assignedRider) {
      assignedRider.status = 'on-delivery';
      assignedRider.totalDeliveries += 1;
    }

    res.status(201).json({ order: newOrder });
  });

  // Orders: Admin/System Status Update
  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    order.status = Number(status) as OrderStatusStep;
    if (order.status === 3) {
      order.riderProgress = 100;
      order.paymentStatus = 'paid';
      if (order.rider) order.rider.status = 'online';
    }

    broadcastOrderUpdate(order, 'order_status_change');
    res.json({ order });
  });

  // Real-Time Push Notification & Live Tracking Stream (SSE)
  app.get('/api/orders/:id/stream', (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    if (!sseClients.has(orderId)) {
      sseClients.set(orderId, new Set());
    }
    sseClients.get(orderId)!.add(res);

    // Send initial snapshot
    res.write(`data: ${JSON.stringify({ type: 'connected', order })}\n\n`);

    req.on('close', () => {
      const clients = sseClients.get(orderId);
      if (clients) {
        clients.delete(res);
        if (clients.size === 0) sseClients.delete(orderId);
      }
    });
  });

  // ================= VITE / STATIC SERVING =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Foodi Full-Stack Application running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
