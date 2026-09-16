import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.js';
import { HeroBanner } from './components/HeroBanner.js';
import { PromoSlider } from './components/PromoSlider.js';
import { CategoryList } from './components/CategoryList.js';
import { RestaurantGrid } from './components/RestaurantGrid.js';
import { RestaurantDetail } from './components/RestaurantDetail.js';
import { CartView } from './components/CartView.js';
import { PaymentModal } from './components/PaymentModal.js';
import { OrderTracking } from './components/OrderTracking.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { ProfileView } from './components/ProfileView.js';
import { FavoritesView } from './components/FavoritesView.js';
import { LocationModal } from './components/LocationModal.js';
import { AuthModal } from './components/AuthModal.js';
import { BottomNav } from './components/BottomNav.js';
import { NotificationToast, ToastMessage } from './components/NotificationToast.js';
import { LoggedOutView } from './components/LoggedOutView.js';
import { FoodiLogo } from './components/FoodiLogo.js';
import { Shield, Lock } from 'lucide-react';
import {
  User,
  Restaurant,
  MenuItem,
  CartItem,
  Order,
  PaymentMethod,
  PromoCode,
  Rider,
  OrderStatusStep,
  OrderHistoryItem,
} from './types.js';
import { api, storage } from './lib/api.js';
import {
  playNotificationChime,
  sendBrowserNotification,
} from './lib/notifications.js';

export default function App() {
  // Authentication & Perspective
  const [user, setUser] = useState<User | null>(() =>
    storage.get<User | null>(storage.KEYS.USER, null)
  );
  const [appMode, setAppMode] = useState<'customer' | 'admin'>(() =>
    storage.get<'customer' | 'admin'>(storage.KEYS.MODE, 'customer')
  );

  // Views & Routing
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedRestId, setSelectedRestId] = useState<number | null>(null);

  // Delivery Location
  const [currentLocation, setCurrentLocation] = useState<string>(() =>
    storage.get<string>(storage.KEYS.LOCATION, 'Dhanmondi, Dhaka')
  );

  // Data Collections
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [promos, setPromos] = useState<Record<string, PromoCode>>({});
  const [riders, setRiders] = useState<Rider[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Cart & Orders State
  const [cart, setCart] = useState<CartItem[]>(() =>
    storage.get<CartItem[]>(storage.KEYS.CART, [])
  );
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() =>
    storage.get<Order | null>(storage.KEYS.ORDER, null)
  );
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>(() =>
    storage.get<OrderHistoryItem[]>(storage.KEYS.HIST, [])
  );
  const [favorites, setFavorites] = useState<number[]>(() =>
    storage.get<number[]>(storage.KEYS.FAV, [1, 2, 5])
  );

  // Modals & Popups
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<'customer' | 'admin'>('customer');
  const [authModalStep, setAuthModalStep] = useState<'choose-role' | 'form'>('choose-role');

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{
    address: string;
    notes: string;
    payment: PaymentMethod;
    totals: { sub: number; fee: number; vat: number; disc: number; total: number };
  } | null>(null);

  // Floating Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to Storage
  useEffect(() => {
    storage.set(storage.KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    storage.set(storage.KEYS.FAV, favorites);
  }, [favorites]);

  useEffect(() => {
    storage.set(storage.KEYS.LOCATION, currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    storage.set(storage.KEYS.MODE, appMode);
  }, [appMode]);

  // Initial Data Fetch
  const loadInitialData = useCallback(async () => {
    try {
      const [restData, promoData, riderData, ordersData] = await Promise.all([
        api.getRestaurants(),
        api.getPromos(),
        api.getRiders(),
        api.getOrders(),
      ]);
      setRestaurants(restData);
      setPromos(promoData);
      setRiders(riderData);
      setAllOrders(ordersData);
    } catch {
      // Handled by api fallbacks
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Dedicated Open Auth Modal with role and step selection
  const handleOpenAuthModal = (
    role: 'customer' | 'admin' = 'customer',
    step: 'choose-role' | 'form' = 'choose-role'
  ) => {
    setAuthModalRole(role);
    setAuthModalStep(step);
    setIsAuthModalOpen(true);
  };

  // Dedicated Logout Handler: safely ends session and "outs" user from the app
  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    storage.remove(storage.KEYS.USER);
    setUser(null);
    setAppMode('customer');
    setCurrentView('logged-out');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('You have been logged out from Foodi', 'info');
  };

  // Handle Mode Change
  const handleToggleAppMode = () => {
    if (appMode === 'customer') {
      if (user?.role === 'admin') {
        setAppMode('admin');
        setCurrentView('admin');
        showToast('Switched to Foodi Admin Operations Panel', 'info');
      } else {
        // Prompt for Admin login
        handleOpenAuthModal('admin', 'form');
      }
    } else {
      setAppMode('customer');
      setCurrentView('home');
      showToast('Switched to Foodi Customer Marketplace', 'info');
    }
  };

  // Add Item to Cart
  const handleAddToCart = (restaurant: Restaurant, item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.itemId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          restId: restaurant.id,
          restName: restaurant.name,
          name: item.name,
          price: item.price,
          qty: 1,
          fee: restaurant.fee,
        },
      ];
    });

    playNotificationChime('add');
    showToast(`Added ${item.name} to cart! 🛒`, 'success');
  };

  // Update Cart Item Quantity
  const handleUpdateCartQty = (itemId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.itemId === itemId) {
            const nextQty = c.qty + delta;
            return nextQty > 0 ? { ...c, qty: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (itemId: number) => {
    setCart((prev) => prev.filter((c) => c.itemId !== itemId));
    showToast('Item removed from cart', 'info');
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((f) => f !== id);
      }
      showToast('Added to favorites! ❤️', 'success');
      return [...prev, id];
    });
  };

  // Select Restaurant
  const handleSelectRestaurant = (id: number) => {
    setSelectedRestId(id);
    setCurrentView('restaurant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proceed to Payment
  const handleProceedToPayment = (details: {
    address: string;
    notes: string;
    payment: PaymentMethod;
    totals: { sub: number; fee: number; vat: number; disc: number; total: number };
  }) => {
    setPendingPayment(details);
    setIsPaymentModalOpen(true);
  };

  // Complete Payment & Place Order
  const handlePaymentSuccess = async (paymentResult: {
    method: PaymentMethod;
    transactionId: string;
  }) => {
    if (!pendingPayment) return;

    try {
      const orderPayload: Partial<Order> = {
        items: cart,
        address: pendingPayment.address || currentLocation,
        userPhone: user?.phone || '01712345678',
        payment: paymentResult.method,
        transactionId: paymentResult.transactionId,
        notes: pendingPayment.notes,
        totals: pendingPayment.totals,
      };

      const placedOrder = await api.createOrder(orderPayload);

      // Save order state
      setCurrentOrder(placedOrder);
      storage.set(storage.KEYS.ORDER, placedOrder);

      // Add to user history
      const historyItem: OrderHistoryItem = {
        id: placedOrder.id,
        restaurantName: cart[0]?.restName || 'Foodi Restaurant',
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        total: placedOrder.totals.total,
        count: cart.reduce((sum, c) => sum + c.qty, 0),
        status: 'delivered',
        items: cart.map((c) => `${c.qty}x ${c.name}`),
      };

      const nextHist = [historyItem, ...orderHistory];
      setOrderHistory(nextHist);
      storage.set(storage.KEYS.HIST, nextHist);

      // Clear Cart
      setCart([]);

      // Switch to Live Tracking View
      setCurrentView('tracking');
      setIsPaymentModalOpen(false);
      setPendingPayment(null);

      playNotificationChime('placed');
      showToast('Order confirmed! Tracking live rider on GPS 🛵', 'success');
      sendBrowserNotification(
        'Foodi Order Placed!',
        `Order #${placedOrder.id} has been received by the kitchen.`
      );
    } catch {
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  // Admin Actions: Add Restaurant
  const handleAddRestaurant = async (r: Partial<Restaurant>) => {
    const created = await api.addRestaurant(r);
    setRestaurants((prev) => [created, ...prev]);
    return created;
  };

  // Admin Actions: Delete Restaurant
  const handleDeleteRestaurant = async (id: number) => {
    await api.deleteRestaurant(id);
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    showToast('Restaurant deleted from platform', 'error');
    return true;
  };

  // Admin Actions: Add Menu Item
  const handleAddMenuItem = async (restId: number, item: Partial<MenuItem>) => {
    const created = await api.addMenuItem(restId, item);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restId ? { ...r, menu: [...r.menu, created] } : r))
    );
    return created;
  };

  // Admin Actions: Delete Menu Item
  const handleDeleteMenuItem = async (restId: number, itemId: number) => {
    await api.deleteMenuItem(restId, itemId);
    setRestaurants((prev) =>
      prev.map((r) =>
        r.id === restId ? { ...r, menu: r.menu.filter((m) => m.id !== itemId) } : r
      )
    );
    showToast('Dish removed from menu', 'error');
    return true;
  };

  // Admin Actions: Add Promo
  const handleAddPromo = async (promo: PromoCode) => {
    await api.addPromo(promo);
    setPromos((prev) => ({ ...prev, [promo.code.toUpperCase()]: promo }));
  };

  // Admin Actions: Delete Promo
  const handleDeletePromo = async (code: string) => {
    await api.deletePromo(code);
    setPromos((prev) => {
      const next = { ...prev };
      delete next[code.toUpperCase()];
      return next;
    });
    showToast(`Promo ${code} deleted`, 'info');
  };

  // Admin Actions: Add Rider
  const handleAddRider = async (riderData: Partial<Rider>) => {
    const created = await api.addRider(riderData);
    setRiders((prev) => [...prev, created]);
    return created;
  };

  // Admin Actions: Update Rider
  const handleUpdateRider = async (id: number, updates: Partial<Rider>) => {
    await api.addRider({ id, ...updates });
    setRiders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    showToast('Rider status updated', 'success');
  };

  // Admin Actions: Delete Rider
  const handleDeleteRider = async (id: number) => {
    await api.deleteRider(id);
    setRiders((prev) => prev.filter((r) => r.id !== id));
    showToast('Rider removed from delivery fleet', 'info');
  };

  // Admin Actions: Update Order Status
  const handleAdminUpdateOrderStatus = async (orderId: string, status: OrderStatusStep) => {
    await api.updateOrderStatus(orderId, status);
    setAllOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Order status updated to stage 0${status + 1}`, 'success');
  };

  // Active restaurant for detail view
  const currentSelectedRestaurant =
    restaurants.find((r) => r.id === selectedRestId) || restaurants[0];

  const cartItemCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <div className="min-h-screen bg-[#f8f8fa] flex flex-col font-['Poppins',sans-serif] text-[#171717]">
      {/* Toast Notifications Container */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />

      {/* Global Header */}
      <Header
        user={user}
        appMode={appMode}
        cartCount={cartItemCount}
        favCount={favorites.length}
        currentLocation={currentLocation}
        restaurants={restaurants}
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onToggleAppMode={handleToggleAppMode}
        onSelectRestaurant={handleSelectRestaurant}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
        {/* VIEW: LOGGED OUT / OUT OF APP */}
        {currentView === 'logged-out' && (
          <LoggedOutView
            onSelectCustomerLogin={() => handleOpenAuthModal('customer', 'form')}
            onSelectAdminLogin={() => handleOpenAuthModal('admin', 'form')}
            onBrowseAsGuest={() => {
              setCurrentView('home');
              showToast('Browsing Foodi as guest', 'info');
            }}
          />
        )}

        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <div className="space-y-6">
            <HeroBanner
              currentLocation={currentLocation}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onFindFoodClick={() => {
                const el = document.getElementById('restaurant-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <PromoSlider
              onCopyCode={(code) => {
                navigator.clipboard.writeText(code);
                showToast(`Promo code "${code}" copied! Paste at checkout.`, 'success');
              }}
            />

            <CategoryList
              activeCategory={activeCategory}
              onSelectCategory={(cat) => setActiveCategory(cat)}
            />

            <div id="restaurant-catalog">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {activeCategory === 'All' ? 'Popular Restaurants' : `${activeCategory} Restaurants`}
                </h3>
                <span className="text-xs font-bold text-gray-500">
                  {restaurants.filter((r) => activeCategory === 'All' || r.cats.includes(activeCategory)).length} Places Available
                </span>
              </div>

              <RestaurantGrid
                restaurants={restaurants.filter(
                  (r) => activeCategory === 'All' || r.cats.includes(activeCategory)
                )}
                favorites={favorites}
                onSelectRestaurant={handleSelectRestaurant}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          </div>
        )}

        {/* VIEW: RESTAURANT DETAIL */}
        {currentView === 'restaurant' && currentSelectedRestaurant && (
          <RestaurantDetail
            restaurant={currentSelectedRestaurant}
            cart={cart}
            isFavorite={favorites.includes(currentSelectedRestaurant.id)}
            onBack={() => setCurrentView('home')}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
          />
        )}

        {/* VIEW: CART */}
        {currentView === 'cart' && (
          <CartView
            cart={cart}
            currentLocation={currentLocation}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={() => {
              setCart([]);
              showToast('Cart cleared', 'info');
            }}
            onApplyPromo={(code) => {
              const sub = cart.reduce((s, c) => s + c.price * c.qty, 0);
              return api.validatePromo(code, sub);
            }}
            onProceedToPayment={handleProceedToPayment}
            onNavigateHome={() => setCurrentView('home')}
          />
        )}

        {/* VIEW: ORDER TRACKING */}
        {currentView === 'tracking' && (
          <OrderTracking
            order={currentOrder}
            onOrderUpdated={(updated) => {
              setCurrentOrder(updated);
              storage.set(storage.KEYS.ORDER, updated);
            }}
            onNavigateHome={() => setCurrentView('home')}
          />
        )}

        {/* VIEW: FAVORITES */}
        {currentView === 'favorites' && (
          <FavoritesView
            restaurants={restaurants}
            favorites={favorites}
            onSelectRestaurant={handleSelectRestaurant}
            onToggleFavorite={handleToggleFavorite}
            onBackHome={() => setCurrentView('home')}
          />
        )}

        {/* VIEW: PROFILE */}
        {currentView === 'profile' && (
          <ProfileView
            user={user}
            orderHistory={orderHistory}
            favCount={favorites.length}
            onNavigate={(v) => setCurrentView(v)}
            onLogout={handleLogout}
            onTrackOrder={(id) => {
              const match = allOrders.find((o) => o.id === id) || currentOrder;
              if (match) {
                setCurrentOrder(match);
                setCurrentView('tracking');
              }
            }}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {/* VIEW: ADMIN CONSOLE */}
        {currentView === 'admin' && (
          user?.role === 'admin' ? (
            <AdminDashboard
              restaurants={restaurants}
              promos={promos}
              riders={riders}
              orders={allOrders}
              onAddRestaurant={handleAddRestaurant}
              onDeleteRestaurant={handleDeleteRestaurant}
              onAddMenuItem={handleAddMenuItem}
              onDeleteMenuItem={handleDeleteMenuItem}
              onAddPromo={handleAddPromo}
              onDeletePromo={handleDeletePromo}
              onAddRider={handleAddRider}
              onUpdateRider={handleUpdateRider}
              onDeleteRider={handleDeleteRider}
              onUpdateOrderStatus={handleAdminUpdateOrderStatus}
              onSwitchToCustomerView={() => {
                setAppMode('customer');
                setCurrentView('home');
                showToast('Viewing customer marketplace', 'info');
              }}
              onLogout={handleLogout}
            />
          ) : (
            /* Admin Protection Gate */
            <div className="max-w-md mx-auto py-14 px-4 text-center">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-[#1a1a2e] text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/20">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Admin Access Required</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  You must be logged in as a Foodi Administrator to access the operations dashboard and rider fleet.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleOpenAuthModal('admin', 'form')}
                    className="w-full py-3 px-4 rounded-xl bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
                  >
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Sign In as Admin</span>
                  </button>
                  <button
                    onClick={() => {
                      setAppMode('customer');
                      setCurrentView('home');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs cursor-pointer transition"
                  >
                    Return to Food Catalog
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer Branding with Real Foodi Logo */}
      <footer className="bg-white border-t border-gray-200/80 py-8 px-4 text-center text-xs text-gray-500 space-y-3 mt-auto">
        <div className="flex justify-center mb-1">
          <FoodiLogo size="sm" variant="full" withTagline={true} />
        </div>
        <p>© 2026 Foodi Online Food Delivery. Fast, fresh meals delivered across Dhaka.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-gray-400 pt-1">
          <span>Dhanmondi</span>
          <span>•</span>
          <span>Gulshan</span>
          <span>•</span>
          <span>Banani</span>
          <span>•</span>
          <span>Uttara</span>
          <span>•</span>
          <span>Mirpur</span>
          <span>•</span>
          <span>Bashundhara R/A</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentView={currentView}
        cartCount={cartItemCount}
        appMode={appMode}
        onNavigate={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Auth Modal with Role Selection Option */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          if (loggedInUser.role === 'admin') {
            setAppMode('admin');
            setCurrentView('admin');
            showToast('Welcome to Admin Operations Portal! 🛡️', 'success');
          } else {
            setAppMode('customer');
            if (currentView === 'logged-out') {
              setCurrentView('home');
            }
            showToast(`Welcome back, ${loggedInUser.name}! 🍕`, 'success');
          }
        }}
        defaultRole={authModalRole}
        initialStep={authModalStep}
      />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          showToast(`Delivering to ${loc}`, 'success');
        }}
      />

      {/* Payment Gateway Modal */}
      {pendingPayment && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          method={pendingPayment.payment}
          amount={pendingPayment.totals.total}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
