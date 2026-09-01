// ─── Brand Identity ───────────────────────────────────────────────────────────
export const brand = {
  name:        'Choice Legacy',
  tagline:     'Your ultimate beauty destination',
  description: 'Premium personal care — 100% authentic, dermatologist-approved, delivered across Bangladesh.',
  palette: {
    primary:   '#1A0A2E',   // deep plum
    secondary: '#C9A96E',   // gold
    accent:    '#9B1D6A',   // magenta-plum
    surface:   '#FAF7F2',   // warm ivory
    dark:      '#0D0618',   // near-black plum
    text:      '#1A0A2E',
    muted:     '#6B5E7A',
  },
}

// ─── Announcements ────────────────────────────────────────────────────────────
export const announcements = [
  { id: 1, text: '👑 Premium Sale — Up to 40% OFF on selected skincare & haircare brands!' },
  { id: 2, text: '💳 Nagad Cashback — Pay with Nagad & get ৳120 instant cashback on ৳1,500+' },
  { id: 3, text: '✨ New Arrivals — Exclusive bundles for body care & feminine hygiene now in stock' },
  { id: 4, text: '🚚 Free Delivery — Nationwide free shipping on all orders above ৳1,200' },
  { id: 5, text: '💄 Makeup Week — Buy 2 makeup items, get 1 beauty tool FREE' },
  { id: 6, text: '🌸 Feminine Care Special — 20% off on all intimate hygiene & period care products' },
]

// ─── Hero Slides ──────────────────────────────────────────────────────────────
export const heroSlides = [
  {
    id: 1,
    eyebrow:     'Premium Personal Care',
    heading:     'Authentic Beauty,\nDelivered.',
    subheading:  'Your trusted destination for genuine skincare, haircare & wellness across Bangladesh.',
    cta:         'Shop Now',
    ctaSecondary:'Explore Categories',
    badge:       'Up to 40% OFF',
    theme:       'dark',          // dark bg slide
    accent:      '#C9A96E',
    illustration:'bottles',
  },
  {
    id: 2,
    eyebrow:     'Makeup Collection',
    heading:     'Define Your\nSignature Look.',
    subheading:  'Foundations, tints, palettes and lip colours crafted for South Asian skin tones.',
    cta:         'Shop Makeup',
    ctaSecondary:'See Bundles',
    badge:       'New Season',
    theme:       'light',
    accent:      '#9B1D6A',
    illustration:'makeup',
  },
  {
    id: 3,
    eyebrow:     'Exclusive Bundles',
    heading:     'Smarter Care\nRoutines.',
    subheading:  'Curated combo sets for skincare, haircare and body care — save more, worry less.',
    cta:         'View Bundles',
    ctaSecondary:'All Combos',
    badge:       'Save up to 35%',
    theme:       'dark',
    accent:      '#C9A96E',
    illustration:'bundles',
  },
]

// ─── Navigation Categories ────────────────────────────────────────────────────
export const navCategories = [
  {
    label: 'Home',
    href: '#',
    children: [],
  },
  {
    label: 'Skincare',
    href: '#',
    children: [
      'Cleansers & Face Wash',
      'Toners & Mists',
      'Serums & Essences',
      'Moisturisers',
      'Sunscreen & SPF',
      'Eye Cream',
      'Face Masks',
    ],
  },
  {
    label: 'Haircare',
    href: '#',
    children: [
      'Shampoos',
      'Conditioners',
      'Hair Oils',
      'Hair Masks & Treatments',
      'Scalp Care',
      'Styling Products',
    ],
  },
  {
    label: 'Body Care',
    href: '#',
    children: [
      'Body Lotion & Butter',
      'Body Wash & Scrub',
      'Hand & Nail Care',
      'Foot Care',
      'Deodorant & Anti-perspirant',
    ],
  },
  {
    label: 'Makeup',
    href: '#',
    children: [
      'Foundation & Concealer',
      'Lip Colour & Tints',
      'Eye Makeup',
      'Blush & Highlighter',
      'Setting Powder & Spray',
      'Makeup Brushes',
    ],
  },
  {
    label: 'Intimate & Hygiene',
    href: '#',
    highlight: true,
    children: [
      'Feminine Hygiene',
      'Period Care',
      'Intimate Wash',
      'Intimate Apparel',
    ],
  },
  {
    label: 'Beauty Tools',
    href: '#',
    children: [
      'Facial Devices',
      'Hair Tools',
      'Makeup Tools',
      'Accessories',
    ],
  },
  {
    label: 'Offers',
    href: '#',
    highlight: true,
    children: [
      'Flash Sale',
      'Bundle Deals',
      'Clearance',
      'Nagad Cashback Deals',
    ],
  },
]

// ─── Shop By Category ─────────────────────────────────────────────────────────
export const categories = [
  { id: 1, name: 'Skincare',          emoji: '💧', description: 'Cleanse, tone & moisturise',        color: '#EDE9F7' },
  { id: 2, name: 'Haircare',          emoji: '💆', description: 'Nourish & strengthen every strand',  color: '#F7E9F0' },
  { id: 3, name: 'Body Care',         emoji: '🧴', description: 'Head-to-toe moisture & glow',       color: '#FDF3E7' },
  { id: 4, name: 'Makeup',            emoji: '💄', description: 'Colour for every mood',             color: '#F7E9EC' },
  { id: 5, name: 'Feminine Hygiene',  emoji: '🌸', description: 'Gentle daily essentials',           color: '#F0EDF7' },
  { id: 6, name: 'Beauty Tools',      emoji: '🪄', description: 'Devices, brushes & accessories',   color: '#E9F0F7' },
  { id: 7, name: 'Bundle Deals',      emoji: '🎁', description: 'Curated sets & combo value',        color: '#F7F0E9' },
  { id: 8, name: 'New Arrivals',      emoji: '✨', description: 'Fresh launches this week',          color: '#EDF7F0' },
]

// ─── Featured Products ────────────────────────────────────────────────────────
export const featuredProducts = [
  {
    id: 201,
    brand: 'CeraVe',
    name: 'Hydrating Facial Cleanser for Normal to Dry Skin',
    category: 'Skincare',
    currentPrice: 1200,
    originalPrice: 1500,
    discount: 20,
    rating: 4.9,
    reviews: 724,
    badge: 'Bestseller',
    badgeColor: '#9B1D6A',
    cashback: 60,
    coupon: 'CL20',
    imageEmoji: '💧',
    imageColor: '#EDE9F7',
    inStock: true,
  },
  {
    id: 202,
    brand: 'Dove',
    name: 'Intensive Repair Shampoo for Damaged Hair',
    category: 'Haircare',
    currentPrice: 650,
    originalPrice: 780,
    discount: 17,
    rating: 4.7,
    reviews: 412,
    badge: 'Popular',
    badgeColor: '#1A0A2E',
    cashback: 0,
    coupon: '',
    imageEmoji: '💆',
    imageColor: '#F7E9F0',
    inStock: true,
  },
  {
    id: 203,
    brand: 'Neutrogena',
    name: 'Ultra Sheer Dry-Touch Sunscreen SPF 50+',
    category: 'Skincare',
    currentPrice: 1450,
    originalPrice: 1700,
    discount: 15,
    rating: 4.8,
    reviews: 538,
    badge: 'SPF Must-Have',
    badgeColor: '#C9A96E',
    cashback: 50,
    coupon: '',
    imageEmoji: '☀️',
    imageColor: '#FDF3E7',
    inStock: true,
  },
  {
    id: 204,
    brand: 'Maybelline',
    name: 'Fit Me Matte + Poreless Foundation',
    category: 'Makeup',
    currentPrice: 980,
    originalPrice: 1150,
    discount: 15,
    rating: 4.6,
    reviews: 289,
    badge: 'Editor\'s Pick',
    badgeColor: '#9B1D6A',
    cashback: 30,
    coupon: 'MAKEUP10',
    imageEmoji: '💄',
    imageColor: '#F7E9EC',
    inStock: true,
  },
  {
    id: 205,
    brand: 'Nivea',
    name: 'Soft Moisturising Cream — All Skin Types (200ml)',
    category: 'Body Care',
    currentPrice: 520,
    originalPrice: 620,
    discount: 16,
    rating: 4.8,
    reviews: 916,
    badge: 'Value Pick',
    badgeColor: '#1A0A2E',
    cashback: 0,
    coupon: '',
    imageEmoji: '🧴',
    imageColor: '#E9F0F7',
    inStock: true,
  },
  {
    id: 206,
    brand: 'L\'Oréal Paris',
    name: 'Elvive Total Repair 5 Extraordinary Oil',
    category: 'Haircare',
    currentPrice: 1350,
    originalPrice: 1600,
    discount: 16,
    rating: 4.7,
    reviews: 347,
    badge: 'Sale',
    badgeColor: '#9B1D6A',
    cashback: 40,
    coupon: 'LOREAL15',
    imageEmoji: '✨',
    imageColor: '#FDF3E7',
    inStock: true,
  },
  {
    id: 207,
    brand: 'Whisper',
    name: 'Ultra Soft Sanitary Pads — 30 Count',
    category: 'Feminine Hygiene',
    currentPrice: 390,
    originalPrice: 450,
    discount: 13,
    rating: 4.9,
    reviews: 1204,
    badge: 'Essential',
    badgeColor: '#1A0A2E',
    cashback: 0,
    coupon: '',
    imageEmoji: '🌸',
    imageColor: '#F0EDF7',
    inStock: true,
  },
  {
    id: 208,
    brand: 'Real Techniques',
    name: 'Expert Face Brush Set — 5 Piece',
    category: 'Beauty Tools',
    currentPrice: 1850,
    originalPrice: 2200,
    discount: 16,
    rating: 4.6,
    reviews: 178,
    badge: 'Pro Kit',
    badgeColor: '#C9A96E',
    cashback: 80,
    coupon: 'TOOLS10',
    imageEmoji: '🪄',
    imageColor: '#EDE9F7',
    inStock: true,
  },
]

// ─── New Arrivals ─────────────────────────────────────────────────────────────
export const newArrivals = [
  {
    id: 301,
    brand: 'The Ordinary',
    name: 'Hyaluronic Acid 2% + B5 Hydration Support',
    category: 'Skincare',
    currentPrice: 1100,
    originalPrice: 1300,
    discount: 15,
    rating: 4.8,
    reviews: 63,
    badge: 'New',
    badgeColor: '#059669',
    cashback: 40,
    coupon: '',
    imageEmoji: '🔬',
    imageColor: '#EDE9F7',
    inStock: true,
  },
  {
    id: 302,
    brand: 'OGX',
    name: 'Argan Oil of Morocco Shampoo (385ml)',
    category: 'Haircare',
    currentPrice: 1750,
    originalPrice: 1950,
    discount: 10,
    rating: 4.7,
    reviews: 44,
    badge: 'New',
    badgeColor: '#059669',
    cashback: 0,
    coupon: 'OGX10',
    imageEmoji: '💆',
    imageColor: '#F7E9F0',
    inStock: true,
  },
  {
    id: 303,
    brand: 'NYX Professional',
    name: 'Soft Matte Lip Cream — 6-Shade Collection',
    category: 'Makeup',
    currentPrice: 2400,
    originalPrice: 2800,
    discount: 14,
    rating: 4.6,
    reviews: 31,
    badge: 'New',
    badgeColor: '#059669',
    cashback: 100,
    coupon: '',
    imageEmoji: '💋',
    imageColor: '#F7E9EC',
    inStock: true,
  },
  {
    id: 304,
    brand: 'Palmer\'s',
    name: 'Cocoa Butter Formula Body Lotion (400ml)',
    category: 'Body Care',
    currentPrice: 890,
    originalPrice: 1050,
    discount: 15,
    rating: 4.8,
    reviews: 52,
    badge: 'New',
    badgeColor: '#059669',
    cashback: 30,
    coupon: '',
    imageEmoji: '🧴',
    imageColor: '#FDF3E7',
    inStock: true,
  },
]

// ─── Special Offers ───────────────────────────────────────────────────────────
export const specialOffers = [
  {
    id: 1,
    title: 'Premium Skincare Bundle',
    description: 'Cleanser + serum + moisturiser + SPF — the complete AM/PM routine at one price.',
    discount: '35% OFF',
    code: 'SKINROUTINE',
    expires: '4 days left',
    cashback: '৳120 Nagad cashback',
    tags: ['CeraVe', 'Neutrogena', 'The Ordinary', 'Bioderma'],
    bg: 'from-[#1A0A2E] to-[#2D1654]',
    accent: '#C9A96E',
    dark: true,
  },
  {
    id: 2,
    title: 'Haircare Power Set',
    description: 'Buy any shampoo + conditioner + oil combo and save big on professional salon care.',
    discount: 'Buy 2 Get 1',
    code: 'HAIRCOMBO',
    expires: '6 days left',
    cashback: '',
    tags: ['Dove', 'L\'Oréal', 'OGX', 'Pantene'],
    bg: 'from-[#FAF7F2] to-[#F0EBE0]',
    accent: '#9B1D6A',
    dark: false,
  },
  {
    id: 3,
    title: 'Makeup Starter Kit',
    description: 'Everything you need to build a complete everyday makeup look — curated by our experts.',
    discount: '25% OFF',
    code: 'MAKEUPKIT',
    expires: '5 days left',
    cashback: '',
    tags: ['Maybelline', 'NYX', 'L\'Oréal', 'Revlon'],
    bg: 'from-[#F7E9EC] to-[#F0D9E3]',
    accent: '#9B1D6A',
    dark: false,
  },
]

// ─── OfferMatrix Intelligence — Smart Deal ────────────────────────────────────
export const smartDealData = {
  product:          'CeraVe Hydrating Facial Cleanser (236ml)',
  dealScore:        89,
  priceDrop:        14,
  potentialSavings: 480,
  bestPriceAlert:   true,
  lowestIn30Days:   true,
}

// ─── Price Comparison ─────────────────────────────────────────────────────────
export const priceComparisonData = {
  product: 'CeraVe Hydrating Facial Cleanser (236ml)',
  stores: [
    {
      name: 'Choice Legacy',
      logo: '👑',
      currentPrice: 1200,
      originalPrice: 1500,
      discount: 20,
      coupon: 'CL20',
      couponDiscount: 120,
      cashback: 60,
      shipping: 0,
      isBest: true,
    },
    {
      name: 'Kirei',
      logo: '🌸',
      currentPrice: 1280,
      originalPrice: 1500,
      discount: 15,
      coupon: '',
      couponDiscount: 0,
      cashback: 40,
      shipping: 0,
      isBest: false,
    },
    {
      name: 'Other Store',
      logo: '🛒',
      currentPrice: 1450,
      originalPrice: 1500,
      discount: 3,
      coupon: '',
      couponDiscount: 0,
      cashback: 0,
      shipping: 60,
      isBest: false,
    },
  ],
}

// ─── Coupon Stacking ──────────────────────────────────────────────────────────
export const couponStackData = {
  product:   'CeraVe Hydrating Facial Cleanser (236ml)',
  basePrice: 1500,
  steps: [
    { label: 'Store Discount (20%)',      amount: 300, type: 'discount' },
    { label: 'Coupon Code CL20 (10%)',    amount: 120, type: 'coupon'   },
    { label: 'Nagad Cashback',            amount:  60, type: 'cashback' },
    { label: 'OfferMatrix Reward',        amount:  20, type: 'reward'   },
  ],
}

export const couponStackTips = [
  'Apply coupon CL20 at checkout for an extra 10% off',
  'Pay with Nagad to unlock ৳60 instant cashback',
  'OfferMatrix rewards accumulate with every order',
]

// ─── Price History ────────────────────────────────────────────────────────────
export const priceHistoryData = {
  product:       'CeraVe Hydrating Facial Cleanser (236ml)',
  currentPrice:  1200,
  thirtyDayAvg:  1380,
  ninetyDayAvg:  1410,
  sixMonthAvg:   1450,
  allTimeHigh:   1700,
  allTimeLow:    1150,
  '30days': {
    labels: Array.from({ length: 30 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (29 - i))
      return `${d.getDate()}/${d.getMonth() + 1}`
    }),
    data: [
      1650,1620,1600,1580,1560,1540,1520,1500,1480,1460,
      1450,1440,1430,1420,1410,1400,1380,1360,1340,1320,
      1310,1300,1290,1280,1270,1260,1240,1220,1210,1200,
    ],
  },
  '90days': {
    labels: Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (89 - i * 7))
      return `${d.getDate()}/${d.getMonth() + 1}`
    }),
    data: [1700,1650,1600,1550,1500,1460,1420,1380,1340,1300,1250,1200],
  },
  '6months': {
    labels: ['Mar','Apr','May','Jun','Jul','Aug','Sep'],
    data:   [1700, 1650, 1580, 1500, 1420, 1320, 1200],
  },
}

// ─── Seller Trust ─────────────────────────────────────────────────────────────
export const sellerTrustData = {
  score: 94,
  badges: [
    { label: 'Verified Seller'           },
    { label: 'Official Brand Partner'    },
    { label: 'Authorized Distributor'    },
    { label: 'Consistent Price History'  },
    { label: 'Fast Nationwide Dispatch'  },
    { label: '100% Authentic Products'   },
  ],
  stats: {
    totalOrders:  '18,700+',
    returnRate:   '1.4%',
    avgDelivery:  '2.1 days',
    responseTime: '< 1.5 hrs',
  },
}

// ─── Fake Discount Detection ──────────────────────────────────────────────────
export const fakeDiscountData = {
  product:        'Premium Vitamin C Brightening Serum (Example)',
  trueBasePrice:  1600,
  inflatedPrice:  2400,
  salePriceShown: 1950,
  inflationDate:  '10 Aug 2026',
  saleDate:       '25 Aug 2026',
  verdict:        'Inflated Before Sale',
  message:        'The listed price was raised by ৳800 (50%) just 15 days before this sale. The current "sale" price of ৳1,950 is still ৳350 above the original price of ৳1,600.',
}

// ─── Cashback Methods ─────────────────────────────────────────────────────────
export const cashbackMethods = [
  { id: 'nagad',   name: 'Nagad',   logo: '💚', rate: 5, maxCap: 120, minOrder: 1200 },
  { id: 'bkash',   name: 'bKash',   logo: '📱', rate: 4, maxCap: 100, minOrder: 1500 },
  { id: 'rocket',  name: 'Rocket',  logo: '🚀', rate: 3, maxCap:  80, minOrder: 1000 },
  { id: 'card',    name: 'Visa/MC', logo: '💳', rate: 2, maxCap:  60, minOrder:  500 },
]

// ─── Savings Summary ──────────────────────────────────────────────────────────
export const savingsSummaryData = {
  originalPrice: 1500,
  finalPrice:    1020,
  breakdown: [
    { type: 'discount', label: 'Store Discount (20%)',   amount: 300 },
    { type: 'coupon',   label: 'Coupon CL20',            amount: 120 },
    { type: 'cashback', label: 'Nagad Cashback',         amount:  60 },
  ],
}
