/**
 * OfferMatrix Central Data Store (OMStore)
 * Manages state across Dashboard, Price Alerts, Orders, Saved Deals, Coupons, Community Reviews, and Category Complain Modules.
 */
(function() {
  const STORE_KEY = 'offer_matrix_store_v4';

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
    ],
    coupons: [
      {
        id: 'cpn-1',
        code: 'BKASH20',
        title: 'bKash 20% Instant Cashback',
        discount: '20% Cashback (Max ৳100)',
        minSpend: 300,
        app: 'foodpanda & Pathao',
        paymentMethod: 'bKash',
        category: 'payment',
        expiry: '30 Sep 2026',
        verified: true,
        bg: '#d12053',
        usedCount: 4200
      },
      {
        id: 'cpn-2',
        code: 'NAGAD150',
        title: 'Nagad Flat ৳150 Off Ride',
        discount: '৳150 OFF',
        minSpend: 500,
        app: 'Uber & Pathao Car',
        paymentMethod: 'Nagad',
        category: 'payment',
        expiry: '15 Oct 2026',
        verified: true,
        bg: '#f97316',
        usedCount: 3100
      },
      {
        id: 'cpn-3',
        code: 'ROCKET10',
        title: 'Rocket 10% Extra Savings',
        discount: '10% OFF (Max ৳150)',
        minSpend: 400,
        app: 'Beautybooth & Choice Legacy',
        paymentMethod: 'Rocket',
        category: 'payment',
        expiry: '20 Sep 2026',
        verified: true,
        bg: '#8b5cf6',
        usedCount: 1850
      },
      {
        id: 'cpn-4',
        code: 'FOODPANDA50',
        title: 'foodpanda Flat ৳50 Off Meal',
        discount: '৳50 OFF',
        minSpend: 250,
        app: 'foodpanda',
        paymentMethod: 'All Payment Methods',
        category: 'food',
        expiry: '10 Sep 2026',
        verified: true,
        bg: '#d70f64',
        usedCount: 8900
      },
      {
        id: 'cpn-5',
        code: 'PATHAORIDE',
        title: 'Pathao Car 25% Off Ride',
        discount: '25% OFF',
        minSpend: 200,
        app: 'Pathao',
        paymentMethod: 'bKash / Nagad',
        category: 'ride',
        expiry: '25 Sep 2026',
        verified: true,
        bg: '#ef4444',
        usedCount: 5400
      },
      {
        id: 'cpn-6',
        code: 'SKINCARE15',
        title: 'Beautybooth 15% Skincare Fest',
        discount: '15% OFF',
        minSpend: 1000,
        app: 'Beautybooth BD',
        paymentMethod: 'All Cards & MFS',
        category: 'skincare',
        expiry: '30 Sep 2026',
        verified: true,
        bg: '#ec4899',
        usedCount: 2300
      },
      {
        id: 'cpn-7',
        code: 'VISAOFFER',
        title: 'Visa Cards 15% Extra Discount',
        discount: '15% OFF',
        minSpend: 800,
        app: 'Pizza Hut & Sultan\'s Kacchi',
        paymentMethod: 'Visa Card',
        category: 'payment',
        expiry: '31 Oct 2026',
        verified: true,
        bg: '#1d4ed8',
        usedCount: 1400
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Tanvir Ahmed',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        itemTitle: 'Kacchi Bhai Sultan Thali',
        appName: 'foodpanda',
        category: 'food',
        rating: 5.0,
        sentiment: 'best',
        title: 'Best Biryani Value & bKash Cashback in Dhanmondi!',
        reviewText: 'The portion size was generous and the mutton meat was tender and fragrant. Combined with bKash 20% cashback, it only cost ৳180 net! Best food deal right now.',
        pros: ['Tender Mutton', 'Generous Rice', '20% bKash Cashback'],
        cons: ['Packaging container could be sturdier'],
        upvotes: 24,
        date: '2 hours ago',
        replies: [
          {
            id: 'rep-1',
            userName: 'Setu Meherunnesa',
            text: 'Totally agree! The bKash cashback makes this dish super affordable.',
            date: '1 hour ago'
          }
        ]
      },
      {
        id: 'rev-2',
        userName: 'Sadia Islam',
        userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        itemTitle: 'Uber Intercity Airport Trip',
        appName: 'Uber BD',
        category: 'ride',
        rating: 1.5,
        sentiment: 'worst',
        title: 'Driver Cancelled 3 Times & Asked Extra Cash',
        reviewText: 'App wait time was shown as 5 mins but driver called and demanded ৳200 extra cash over app fare to go to Airport. When refused, he cancelled. Very frustrating during peak hours!',
        pros: ['App UI is fast'],
        cons: ['Driver Refused App Fare', 'Demanded Extra Cash', '3 Cancellations'],
        upvotes: 45,
        date: 'Yesterday',
        replies: [
          {
            id: 'rep-2',
            userName: 'Rafiq Hassan',
            text: 'Pathao Car or InDrive is much more reliable for Airport routes right now.',
            date: 'Yesterday'
          }
        ]
      }
    ],
    // ── FOOD ITEMS WITH MULTI-APP PRICING ──
    foodItems: [
      {
        id: 'fi-1',
        name: 'Chicken Biryani',
        restaurant: 'Bismillah Biryani House',
        img: 'https://images.pexels.com/photos/7394819/pexels-photo-7394819.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.6,
        reviews: '2.3k',
        deliveryTime: '30-40 min',
        category: 'Biryani',
        apps: [
          { app: 'foodpanda', icon: '🐼', color: '#d70f64', originalPrice: 269, discount: 26, finalPrice: 199, deliveryFee: 0, badge: 'Best Price' },
          { app: 'Pathao Food', icon: '🛵', color: '#ef4444', originalPrice: 269, discount: 18, finalPrice: 220, deliveryFee: 29, badge: '' },
          { app: 'Foodi', icon: '🍽', color: '#f97316', originalPrice: 269, discount: 15, finalPrice: 229, deliveryFee: 39, badge: '' },
          { app: 'Hungry Naki', icon: '🍴', color: '#f97316', originalPrice: 269, discount: 12, finalPrice: 237, deliveryFee: 49, badge: '' }
        ]
      },
      {
        id: 'fi-2',
        name: 'Farmhouse Pizza',
        restaurant: 'Pizza Hut',
        img: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.5,
        reviews: '1.8k',
        deliveryTime: '25-35 min',
        category: 'Pizza',
        apps: [
          { app: 'Foodi', icon: '🍽', color: '#f97316', originalPrice: 499, discount: 30, finalPrice: 349, deliveryFee: 0, badge: 'Best Price' },
          { app: 'foodpanda', icon: '🐼', color: '#d70f64', originalPrice: 499, discount: 25, finalPrice: 374, deliveryFee: 39, badge: '' },
          { app: 'Pathao Food', icon: '🛵', color: '#ef4444', originalPrice: 499, discount: 22, finalPrice: 389, deliveryFee: 29, badge: '' },
          { app: 'Hungry Naki', icon: '🍴', color: '#f97316', originalPrice: 499, discount: 18, finalPrice: 409, deliveryFee: 49, badge: '' }
        ]
      },
      {
        id: 'fi-3',
        name: 'Beef Burger Meal',
        restaurant: 'Burger King',
        img: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.4,
        reviews: '987',
        deliveryTime: '20-30 min',
        category: 'Burger',
        apps: [
          { app: 'Pathao Food', icon: '🛵', color: '#ef4444', originalPrice: 429, discount: 30, finalPrice: 299, deliveryFee: 0, badge: 'Best Price' },
          { app: 'foodpanda', icon: '🐼', color: '#d70f64', originalPrice: 429, discount: 25, finalPrice: 322, deliveryFee: 29, badge: '' },
          { app: 'Foodi', icon: '🍽', color: '#f97316', originalPrice: 429, discount: 20, finalPrice: 343, deliveryFee: 39, badge: '' },
          { app: 'Hungry Naki', icon: '🍴', color: '#f97316', originalPrice: 429, discount: 15, finalPrice: 365, deliveryFee: 49, badge: '' }
        ]
      },
      {
        id: 'fi-4',
        name: 'Chicken Chowmein',
        restaurant: 'Chowking',
        img: 'https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg?auto=compress&cs=tinysrgb&w=600',
        rating: 4.3,
        reviews: '756',
        deliveryTime: '20-30 min',
        category: 'Chinese',
        apps: [
          { app: 'Hungry Naki', icon: '🍴', color: '#f97316', originalPrice: 269, discount: 33, finalPrice: 179, deliveryFee: 0, badge: 'Best Price' },
          { app: 'foodpanda', icon: '🐼', color: '#d70f64', originalPrice: 269, discount: 28, finalPrice: 194, deliveryFee: 29, badge: '' },
          { app: 'Foodi', icon: '🍽', color: '#f97316', originalPrice: 269, discount: 22, finalPrice: 210, deliveryFee: 39, badge: '' },
          { app: 'Pathao Food', icon: '🛵', color: '#ef4444', originalPrice: 269, discount: 18, finalPrice: 221, deliveryFee: 49, badge: '' }
        ]
      }
    ],

    // ── PAYMENT METHODS WITH DISCOUNTS ──
    paymentMethods: [
      { id: 'bkash', name: 'bKash', icon: '💳', color: '#e2136e', discountType: 'cashback', discountPct: 10, maxDiscount: 50, minOrder: 0, label: 'Extra 10% Cashback (max ৳50)' },
      { id: 'nagad', name: 'Nagad', icon: '💳', color: '#f6921e', discountType: 'cashback', discountPct: 5, maxDiscount: 30, minOrder: 0, label: 'Extra 5% Cashback (max ৳30)' },
      { id: 'rocket', name: 'Rocket', icon: '🚀', color: '#8b2d8b', discountType: 'flat', discountFlat: 25, maxDiscount: 25, minOrder: 300, label: 'Extra ৳25 OFF on orders ৳300+' },
      { id: 'brac', name: 'BRAC Bank Card', icon: '🏦', color: '#003366', discountType: 'percent', discountPct: 15, maxDiscount: 100, minOrder: 0, label: 'Extra 15% OFF (max ৳100)' },
      { id: 'city', name: 'City Bank Card', icon: '🏦', color: '#006738', discountType: 'percent', discountPct: 10, maxDiscount: 80, minOrder: 0, label: 'Extra 10% OFF (max ৳80)' },
      { id: 'ebl', name: 'EBL Card', icon: '🏦', color: '#1a237e', discountType: 'percent', discountPct: 12, maxDiscount: 60, minOrder: 0, label: 'Extra 12% OFF (max ৳60)' },
      { id: 'visa', name: 'Visa / Mastercard', icon: '💳', color: '#1a1f71', discountType: 'none', discountPct: 0, maxDiscount: 0, minOrder: 0, label: 'No extra discount' },
      { id: 'cod', name: 'Cash on Delivery', icon: '💵', color: '#4b5563', discountType: 'none', discountPct: 0, maxDiscount: 0, minOrder: 0, label: 'No extra discount' }
    ],

    // ── SKINCARE FRAUD DATA ──
    skincareFraud: [
      {
        id: 'sk-frd-1',
        brandName: 'Shajgoj Limited (Jamuna Branch & Online)',
        socialWebLinks: 'shajgoj.com | fb.com/shajgojbd',
        confiscatedProducts: ['120 Units Imported Sunscreen (Expired Relabeled)', '50 Units Fake CeraVe Foaming Cleanser'],
        violations: 'Missing BSTI barcode certification sticker & relabeled manufacturing dates',
        magistrateDetails: 'Executive Magistrate Sarwar Alam (Mobile Court Unit #4)',
        penaltyFine: '৳50,000 Court Fine Imposed',
        operationalStatus: 'Fined & Relabeled Stock Sealed',
        date: '26 Aug 2026',
        img: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'sk-frd-2',
        brandName: 'CosmoCare BD (Facebook Page Seller)',
        socialWebLinks: 'fb.com/cosmocarebd.official',
        confiscatedProducts: ['450 Bottles Counterfeit CeraVe & The Ordinary', 'Diluted Chemical Mixing Drums'],
        violations: 'Operating unauthorized packaging warehouse & mixing toxic chemical solutions',
        magistrateDetails: 'DNCC Executive Mobile Court Raid',
        penaltyFine: '৳2,00,000 Fine & Warehouse Sealed',
        operationalStatus: 'Sealed & Page Admin Arrested',
        date: '20 Aug 2026',
        img: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],

    // ── FOOD VIRAL RESTAURANT RAIDS ──
    foodRaids: [
      {
        id: 'fd-rd-1',
        restaurantName: 'Sultan\'s Kacchi',
        branchLocation: 'Dhanmondi 27 Branch',
        viralFoodItem: 'Mutton Sultan Thali (Viral Biryani)',
        inspectionFindings: ['Unhygienic kitchen floor with uncovered cooked meat', 'No staff hairnets & stale oil reused'],
        magistrateReport: 'Executive Magistrate Sarwar Alam (Safe Food Mobile Unit #3)',
        fineAmount: '৳1,00,000 Fine Imposed',
        closureNotice: '7-Day Hygiene Remediation Notice Issued',
        date: '25 Aug 2026',
        img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'fd-rd-2',
        restaurantName: 'Kacchi Bhai',
        branchLocation: 'Gulshan-2 Circle',
        viralFoodItem: 'Kacchi Platter Combo',
        inspectionFindings: ['Rusted ghee oil drums stored near main stoves', 'Expired spices batch #982'],
        magistrateReport: 'DNCC Mobile Court Inspection Report',
        fineAmount: '৳50,000 Court Penalty',
        closureNotice: 'Fine Paid & Kitchen Re-inspected',
        date: '18 Aug 2026',
        img: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'fd-rd-3',
        restaurantName: 'Star Kabab & Restaurant',
        branchLocation: 'Banani Outlet',
        viralFoodItem: 'Star Special Mutton Leg Roast',
        inspectionFindings: ['Stale cooked gravies stored in non-freezer room', 'Unhygienic washing sinks'],
        magistrateReport: 'Bangladesh Safe Food Authority Inspector Team',
        fineAmount: '৳1,50,000 Fine Imposed',
        closureNotice: 'Warned & Action Plan Initiated',
        date: '12 Aug 2026',
        img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'fd-rd-4',
        restaurantName: 'Chillox',
        branchLocation: 'Uttara Sector 11',
        viralFoodItem: 'Cheesy Beef Burger (Viral Deal)',
        inspectionFindings: ['Expired mayonnaise batch #34 used in sauces', 'Substandard cold room storage temperature'],
        magistrateReport: 'DNCC Executive Magistrate Court Unit #2',
        fineAmount: '৳80,000 Penalty Fine',
        closureNotice: 'Fined & Staff Training Ordered',
        date: '05 Aug 2026',
        img: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],

    // ── RIDE RIDER COMPLAIN ──
    rideComplaints: [
      {
        id: 'rd-cmp-1',
        incidentType: 'Meter Tampering & Extra Cash Extortion',
        driverName: 'Rider #8492 (Abdul Karim)',
        driverID: 'UBER-DRV-8492',
        licensePlate: 'Dhaka Metro-Ga 24-8910',
        serviceZone: 'Airport - Uttara Route',
        details: 'Demanded ৳250 extra cash over app fare near Airport road and threatened to cancel ride mid-highway.',
        driverPhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        escalationStatus: 'Suspended 30 Days & BRTA Escalated',
        date: '27 Aug 2026'
      },
      {
        id: 'rd-cmp-2',
        incidentType: 'Reckless Overspeeding & Misbehavior',
        driverName: 'Rider #3104 (Kamrul Hasan)',
        driverID: 'PATHAO-DRV-3104',
        licensePlate: 'Dhaka Metro-Ha 12-4521',
        serviceZone: 'Farmgate Overpass Route',
        details: 'Rider drove aggressively over speed limits and engaged in verbal misbehavior during evening rush hour.',
        driverPhoto: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=200',
        escalationStatus: 'Platform Ban & ID Blacklisted',
        date: '22 Aug 2026'
      }
    ],

    // ── DASHBOARD ALL COMPLAIN ISSUES ──
    dashboardIssues: [
      {
        id: 'db-iss-1',
        issueCategory: 'Coupon & Promotion Error',
        promoCode: 'FOODPANDA50',
        headline: 'Promo Code FOODPANDA50 Failed at Checkout',
        details: 'Code failed during checkout, causing order #OM-8921 to be placed without applying valid ৳50 discount.',
        trackerStatus: 'Refund Issued',
        date: 'Today',
        img: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'db-iss-2',
        issueCategory: 'Food Safety Raid',
        promoCode: 'N/A',
        headline: 'Sultan\'s Kacchi Unhygienic Kitchen Penalty',
        details: 'Mobile court fined Sultan\'s Kacchi ৳1,00,000 for unhygienic food storage and expired ingredients.',
        trackerStatus: 'Magistrate Escalated',
        date: '25 Aug 2026',
        img: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300'
      },
      {
        id: 'db-iss-3',
        issueCategory: 'Rider Misconduct',
        promoCode: 'N/A',
        headline: 'Rider Extortion Attempt Near Airport Route',
        details: 'Rider #8492 demanded ৳250 extra cash over app fare. Account suspended for 30 days.',
        trackerStatus: 'Resolved',
        date: '27 Aug 2026',
        img: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=300'
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
            orders: parsed.orders || defaultState.orders,
            coupons: parsed.coupons || defaultState.coupons,
            reviews: parsed.reviews || defaultState.reviews,
            skincareFraud: parsed.skincareFraud || defaultState.skincareFraud,
            foodRaids: parsed.foodRaids || defaultState.foodRaids,
            rideComplaints: parsed.rideComplaints || defaultState.rideComplaints,
            dashboardIssues: parsed.dashboardIssues || defaultState.dashboardIssues
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
      if (!s) return;
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
    getUser() { return this.state.user; }

    setUser(userObj) {
      this.state.user = { ...this.state.user, ...userObj };
      if (userObj.name) localStorage.setItem('om_user_name', userObj.name);
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
        return false;
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
        return true;
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

    // ── COUPONS ──
    getCoupons(category) {
      if (!category || category === 'all') return this.state.coupons;
      if (category === 'payment') return this.state.coupons.filter(c => c.category === 'payment' || c.paymentMethod !== 'All Payment Methods');
      return this.state.coupons.filter(c => c.category === category);
    }

    // ── REVIEWS ──
    getReviews(filter) {
      if (!filter || filter === 'all') return this.state.reviews;
      if (filter === 'best') return this.state.reviews.filter(r => r.rating >= 4.0 || r.sentiment === 'best');
      if (filter === 'worst') return this.state.reviews.filter(r => r.rating <= 2.5 || r.sentiment === 'worst');
      return this.state.reviews.filter(r => r.category === filter);
    }

    addReview(review) {
      const newReview = {
        id: 'rev-' + Date.now(),
        userName: this.state.user.name,
        userAvatar: this.state.user.avatar,
        itemTitle: review.itemTitle || 'OfferMatrix Service',
        appName: review.appName || 'OfferMatrix App',
        category: review.category || 'food',
        rating: Number(review.rating) || 5.0,
        sentiment: review.sentiment || (Number(review.rating) >= 4.0 ? 'best' : 'worst'),
        title: review.title || 'User Community Review',
        reviewText: review.reviewText || '',
        pros: Array.isArray(review.pros) ? review.pros : (review.pros ? review.pros.split(',').map(s => s.trim()) : []),
        cons: Array.isArray(review.cons) ? review.cons : (review.cons ? review.cons.split(',').map(s => s.trim()) : []),
        upvotes: 1,
        date: 'Just now',
        replies: []
      };
      this.state.reviews.unshift(newReview);
      this.saveState();
      return newReview;
    }

    addReply(reviewId, text) {
      const rev = this.state.reviews.find(r => r.id === reviewId);
      if (rev) {
        if (!rev.replies) rev.replies = [];
        const newReply = {
          id: 'rep-' + Date.now(),
          userName: this.state.user.name,
          text: text,
          date: 'Just now'
        };
        rev.replies.push(newReply);
        this.saveState();
        return newReply;
      }
    }

    upvoteReview(reviewId) {
      const rev = this.state.reviews.find(r => r.id === reviewId);
      if (rev) {
        rev.upvotes = (rev.upvotes || 0) + 1;
        this.saveState();
        return rev.upvotes;
      }
    }
    // ── FOOD ITEMS & PAYMENT METHODS ──
    getFoodItems() {
      return defaultState.foodItems;
    }

    getFoodItemById(id) {
      return defaultState.foodItems.find(f => f.id === id);
    }

    getPaymentMethods() {
      return defaultState.paymentMethods;
    }

    // ── SKINCARE FRAUD PAGES ──
    getSkincareFraud() {
      return this.state.skincareFraud || defaultState.skincareFraud;
    }

    submitFakeProductReport(data) {
      const newReport = {
        id: 'sk-frd-' + Date.now(),
        brandName: data.brandName || 'Reported Cosmetics Seller',
        socialWebLinks: data.socialWebLinks || 'Reported via User Submission',
        confiscatedProducts: Array.isArray(data.confiscatedProducts) ? data.confiscatedProducts : [data.productName || 'Suspicious Cosmetic Item'],
        violations: data.violations || 'User reported counterfeit formula & unverified packaging',
        magistrateDetails: 'OfferMatrix Legal Cell Escalated',
        penaltyFine: 'Under Investigation',
        operationalStatus: 'Warned',
        date: 'Just now',
        img: data.img || 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400'
      };
      this.state.skincareFraud.unshift(newReport);
      this.saveState();
      return newReport;
    }

    // ── FOOD VIRAL RESTAURANT RAIDS ──
    getFoodRaids() {
      return this.state.foodRaids || defaultState.foodRaids;
    }

    fileFoodSafetyComplain(data) {
      const newComplain = {
        id: 'fd-rd-' + Date.now(),
        restaurantName: data.restaurantName || 'Reported Eatery',
        branchLocation: data.branchLocation || 'Dhaka Outlet',
        viralFoodItem: data.viralFoodItem || 'Featured Dish',
        inspectionFindings: Array.isArray(data.findings) ? data.findings : [data.description || 'Spoiled food item / Hygiene issue'],
        magistrateReport: 'Reported to Consumer Right Protection',
        fineAmount: 'Inspection Pending',
        closureNotice: 'Under Verification',
        date: 'Just now',
        img: data.img || 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400'
      };
      this.state.foodRaids.unshift(newComplain);
      this.saveState();
      return newComplain;
    }

    // ── RIDE RIDER COMPLAIN ──
    getRideComplaints() {
      return this.state.rideComplaints || defaultState.rideComplaints;
    }

    lodgeRiderComplain(data) {
      const newRiderComplain = {
        id: 'rd-cmp-' + Date.now(),
        incidentType: data.incidentType || 'Misbehavior / Overcharging',
        driverName: data.driverName || 'Reported Driver',
        driverID: data.driverID || 'DRV-' + Math.floor(1000 + Math.random() * 9000),
        licensePlate: data.licensePlate || 'Dhaka Metro-Ga XX-XXXX',
        serviceZone: data.serviceZone || 'Dhaka Metropolitan Route',
        details: data.details || 'Passenger submitted incident report.',
        driverPhoto: data.driverPhoto || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
        escalationStatus: data.emergency ? '🚨 Emergency Authorities Escalated' : 'Platform Escalated & Ticket Opened',
        date: 'Just now'
      };
      this.state.rideComplaints.unshift(newRiderComplain);
      this.saveState();
      return newRiderComplain;
    }

    // ── DASHBOARD ALL COMPLAIN ISSUES ──
    getDashboardIssues() {
      return this.state.dashboardIssues || defaultState.dashboardIssues;
    }

    raiseSupportTicket(data) {
      const newTicket = {
        id: 'db-iss-' + Date.now(),
        issueCategory: data.issueCategory || 'Coupon / System Bug',
        promoCode: data.promoCode || 'N/A',
        headline: data.headline || 'User Raised Issue Ticket',
        details: data.details || 'System ticket submitted by user.',
        trackerStatus: 'Under Review',
        date: 'Just now',
        img: data.img || 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=300'
      };
      this.state.dashboardIssues.unshift(newTicket);
      this.saveState();
      return newTicket;
    }

    // ── BADGE SYNCHRONIZATION ──
    updateBadges() {
      if (!this.state || !this.state.savedDeals) return;
      const savedCount = (this.state.savedDeals || []).length;
      const alertsCount = (this.state.priceAlerts || []).length;
      const activeOrdersCount = ((this.state.orders || []).filter(o => o.status === 'in_transit' || o.status === 'preparing').length) || (this.state.orders || []).length;

      document.querySelectorAll('.sb-badge-orders, #sb-badge-orders').forEach(el => el.textContent = activeOrdersCount);
      document.querySelectorAll('.sb-badge-alerts, #sb-badge-alerts').forEach(el => el.textContent = alertsCount);
      document.querySelectorAll('.sb-badge-saved, #sb-badge-saved').forEach(el => el.textContent = savedCount);

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

      const tbSaved = document.querySelector('.tb-saved');
      if (tbSaved) {
        tbSaved.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Saved (${savedCount})`;
      }

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

  document.addEventListener('DOMContentLoaded', () => {
    window.OMStore.updateBadges();
  });
})();
