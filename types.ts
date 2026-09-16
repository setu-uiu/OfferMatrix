export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  desc: string;
  price: number;
  popular?: boolean;
  category?: string;
  image?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  img: string;
  rating: number;
  time: string;
  fee: number;
  cats: string[];
  cuisine: string;
  promo?: string;
  menu: MenuItem[];
}

export interface CartItem {
  itemId: number;
  restId: number;
  restName: string;
  name: string;
  price: number;
  qty: number;
  fee: number;
}

export type PaymentMethod = 'bkash' | 'nagad' | 'card' | 'cod';

export interface Rider {
  id: number;
  name: string;
  phone: string;
  vehicleNo?: string;
  status: 'online' | 'offline' | 'on-delivery';
  totalDeliveries: number;
  rating?: number;
  coords?: { lat: number; lng: number };
}

export interface PromoCode {
  code: string;
  pct?: number;
  flat?: number;
  max?: number;
  freeDelivery?: boolean;
  minOrder?: number;
}

export type OrderStatusStep = 0 | 1 | 2 | 3;
// 0: Placed & Confirmed
// 1: Kitchen is Preparing
// 2: Rider on the way
// 3: Delivered

export interface Order {
  id: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  items: CartItem[];
  totals: {
    sub: number;
    fee: number;
    vat: number;
    disc: number;
    total: number;
  };
  address: string;
  notes?: string;
  payment: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'cod';
  transactionId?: string;
  placedAt: string;
  estDelivery: string;
  status: OrderStatusStep;
  rider?: Rider;
  riderProgress?: number; // 0% to 100% along route
  deliveryLocation?: string;
}

export interface OrderHistoryItem {
  id: string;
  restaurantName?: string;
  date: string;
  total: number;
  count: number;
  status: 'delivered' | 'in-progress' | 'cancelled';
  items?: string[] | CartItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  timestamp: string;
  read?: boolean;
}
