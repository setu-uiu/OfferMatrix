
# Product Requirements Document (PRD)

---

## 1. Executive Summary & Product Vision

### 1.1 Project Title
**Deal Comparison & Super-Aggregator Platform (Bangladesh)**[cite: 1]

### 1.2 Purpose & Scope
This platform serves as a unified deal comparison, fare estimation, and shopping intelligence super-aggregator tailored specifically to the Bangladeshi consumer market[cite: 1, 2]. The system eliminates the need for users to manually check multiple platforms by aggregating and standardizing data across E-commerce, Ride-Sharing, Food Delivery, Skincare & Cosmetics, Inter-city Travel, and Coupons/MFS Cashbacks[cite: 1, 2].

### 1.3 Core Value Proposition
* **Unified Intelligence:** One single search box to discover the best price across fragmented local marketplaces[cite: 1, 2].
* **True Net Cost Calculation:** Incorporating platform fees, delivery zones, VAT, active coupon codes, and MFS (bKash/Nagad)/Bank Card cashback rules to reflect actual out-of-pocket expenses[cite: 1, 2].
* **API Independence:** Operates using rule-based simulation engines, web scraping pipelines, and dummy app structures, eliminating reliance on closed proprietary third-party APIs[cite: 1].
* **Trust & Authenticity:** Specialized verification badges and ingredient-level intelligence for high-risk categories like skincare and electronics[cite: 1, 2].

---

## 2. User Roles & Access Control (RBAC)

### 2.1 The Consumer Role (Standard User)
* **Authentication:** Mobile number with OTP verification (via SMS gateways like SSL Wireless/Twilio) and Social OAuth (Google / Facebook)[cite: 2].
* **Profile & Settings:** Manage name, phone, avatar, and saved home/work/campus locations[cite: 1, 2].
* **Payment Arsenal Configuration:** Select owned payment methods (e.g., bKash, Nagad, BRAC Bank, City Bank AMEX) without storing sensitive card details[cite: 2].
* **Watchlist & Saved Items:** Universal multi-tab saved item drawer (Products, Rides, Coupons, Restaurants)[cite: 1, 2].
* **Deal Submission:** Submit community deals with store names, photos, descriptions, and branch locations[cite: 1, 2].

### 2.2 The Administrator Role
* **Authentication:** Email/Password with mandatory Two-Factor Authentication (2FA)[cite: 2].
* **Scraper & API Health Monitor:** Live tracking dashboard for all crawler jobs and simulated API endpoints (Daraz, Pickaboo, Foodpanda, Pathao)[cite: 1, 2].
* **Community Deals Moderation Queue:** Review, approve, or reject user-submitted deals with a single click[cite: 1, 2].
* **Affiliate & Voucher Engine:** Manage partner affiliate tracking parameters and publish exclusive platform promo codes[cite: 2].
* **Analytics:** Platform-wide metrics on top searches, trending routes, click-through rates, and active alert volumes[cite: 2].

### 2.3 The Merchant / Partner Role *(Future Expansion / Optional)*
* Self-service merchant portal allowing verified brand partners to upload, manage, and track performance of exclusive promotional discount vouchers[cite: 1, 2].

---

## 3. Detailed Functional Modules

### Module 1: E-Commerce & Deals Aggregator
* **Cross-Store Aggregated Search:** Single search bar returning comparative cards from platforms including Daraz, Pickaboo, Star Tech, Ryans, Cartup, Chaldal, and Rokomari[cite: 1, 2].
* **"Best Deal" Highlighting:** Automatic identification of the lowest price vendor with visual badge indicators[cite: 1, 2].
* **Price History Graphs:** Interactive visual price trend charts covering 30-day and 90-day intervals to verify whether marked discounts are authentic[cite: 1, 2].
* **Real-Time Stock & Deal Status:** Displays availability (`in_stock`, `out_of_stock`) and active promotional tags/ribbons (e.g., "🔥 Flash Sale")[cite: 1].
* **Price Drop Alerts:** Cron-driven notification trigger when an item drops below a user-defined target price threshold[cite: 1].

### Module 2: Skincare & Cosmetics Aggregator
* **Supported Vendors:** Shajgoj, BanglaShoppers, Ogerio, and Daraz Mall[cite: 2].
* **Authenticity & Trust Verification:** Flagship and authorized distributor verification tag ("100% Authentic Guarantee") to safeguard against counterfeit cosmetics[cite: 2].
* **Smart Ingredient & Concern Filtering:** Search/filter by skin type (Oily, Dry, Sensitive) and active ingredients (e.g., Niacinamide, Salicylic Acid, Centella Asiatica, Retinol)[cite: 2].
* **Cost-per-Volume Metric:** Computes exact price per milliliter (ml) or per gram (g) to identify optimal pack sizes[cite: 2].
* **Restock Notification Engine:** Alert queue for out-of-stock viral K-beauty or imported skincare items[cite: 2].

### Module 3: Ride-Sharing & Intercity Travel Fare Estimator
* **Intra-City Ride Comparators:** Real-time side-by-side fare matrix for Uber, Pathao, Shohoz, inDrive, and Obhai[cite: 1, 2].
* **Haversine Distance & Dhaka Traffic Model:** Distance calculation based on latitude/longitude pairs; traffic duration simulated via $Duration_{mins} = Distance_{km} \times 3$[cite: 1].
* **Vehicle Filtering:** Category breakdown across Bike, CNG, Car Economy, and Car Premium[cite: 2].
* **Surge Pricing Indicator:** Visual badge highlighting active surge multipliers[cite: 1, 2].
* **Intercity Travel:** Search schedules, operators (Green Line, Hanif, Shyamoli), boarding points, route types (Padma Bridge vs. Ferry), and prices across Shohoz, bdtickets, and Jatri[cite: 1, 2].
* **Boarding Point Proximity Logic:** Visual prioritization of bus stops closer to the user's location (e.g., Abdullahpur vs. Sayedabad for North Dhaka residents)[cite: 2].
* **Deep Linking:** Single click to launch target ride apps with pre-filled destination coordinates[cite: 2].

### Module 4: Food Delivery Aggregator
* **Platform Aggregation:** Cross-search across Foodpanda, Pathao Food, and Uber Eats equivalents[cite: 1, 2].
* **Item & Menu Cross-Search:** Search dish names (e.g., "Chicken Biryani") across delivery zones[cite: 1].
* **Total Landed Cost Formula:**
  $$\text{Final Food Cost} = (\text{Item Base Price} + \text{Zone Delivery Fee} + \text{VAT}) - \text{Active Promo Vouchers} - \text{MFS Cashback}$$[cite: 1, 2]$$
* **Delivery Zone Mapping:** Dynamic fee and duration estimations tailored by specific municipal neighborhoods[cite: 1].

### Module 5: Coupon & Payment Stacking Engine ("Payment Arsenal")
* **Automated Stacking Engine:** Cascades store-level discounts with payment gateway-level cashbacks[cite: 1].
* **Smart Payment Recommendation:** Evaluates user-configured payment options to explicitly prompt the optimal checkout choice (e.g., "Pay with Nagad for an extra ৳50 off")[cite: 1, 2].
* **Community Deal Stacking & Gamification:** Standard users submit discovered deals; verified deals earn the contributor trust points and community badges[cite: 1, 2].

### Module 6: Cross-Service & Platform Expansion Features
* **Cross-Service "Hangout Planner":** Combines Origin-to-Destination ride fare + Restaurant dining cost + Return trip ride fare into a single budget summary[cite: 2].
* **Headless Bot (WhatsApp / Telegram):** Natural language micro-service enabling quick chat prompts (e.g., "Cheapest bike from Mirpur to Gulshan")[cite: 2].
* **Browser Extension (Manifest V3):** Automated checkout DOM-scraper that auto-fills active coupon codes across partner e-commerce carts[cite: 1].
* **Smart Personalized Deal Feed:** Algorithmic recommendation feed weighting 30-day user search histories against active expiring deals[cite: 1].

---

## 4. Technical Architecture & Tech Stack

### 4.1 Recommended Tech Stack
* **Frontend Web:** React (Vite) / Laravel Blade Template[cite: 1, 2].
* **Mobile Client:** Flutter (iOS & Android)[cite: 1].
* **Backend API:** Node.js (Express) / Laravel REST Framework[cite: 1, 2].
* **Database:** MySQL Relational Database[cite: 1].
* **Authentication:** JWT (JSON Web Tokens) with Role-Based Middleware[cite: 1, 2].
* **Scheduled Tasks:** `node-cron` / Laravel Task Scheduler for hourly price checks and alert dispatches[cite: 1].

---

## 5. Consolidated Database Schema (MySQL DDL)

### 1. Authentication & Users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    role ENUM('user', 'merchant', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 2. Stores & E-Commerce Products

```sql
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(255),
    logo VARCHAR(255)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FULLTEXT(name)
);

CREATE TABLE product_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    store_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    stock_status ENUM('in_stock', 'out_of_stock') DEFAULT 'in_stock',
    deal_text VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    store_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

```

### 3. Ride & Intercity Transport

```sql
CREATE TABLE bd_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area VARCHAR(100),
    lat DECIMAL(10,6) NOT NULL,
    lng DECIMAL(10,6) NOT NULL
);

CREATE TABLE ride_pricing_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider ENUM('pathao', 'uber', 'shohoz', 'indrive', 'obhai') NOT NULL,
    base_fare DECIMAL(6,2) NOT NULL,
    per_km_rate DECIMAL(6,2) NOT NULL,
    per_min_rate DECIMAL(6,2) NOT NULL,
    surge_multiplier DECIMAL(3,2) DEFAULT 1.00
);

CREATE TABLE bus_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operator VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    duration_mins INT,
    departure_times TEXT
);

```

### 4. Coupons, MFS & Crowdsourced Deals

```sql
CREATE TABLE coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    merchant_id INT NULL,
    code VARCHAR(50) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    discount_type ENUM('percent', 'flat') NOT NULL,
    discount_value DECIMAL(8,2) NOT NULL,
    min_order DECIMAL(8,2) DEFAULT 0.00,
    expires_at DATETIME NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    source ENUM('official', 'crowdsourced') DEFAULT 'official'
);

CREATE TABLE mfs_cashback_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider ENUM('bkash', 'nagad', 'bank_card') NOT NULL,
    applicable_platform VARCHAR(100) NOT NULL,
    min_spend DECIMAL(8,2) NOT NULL,
    cashback_type ENUM('percent', 'flat') NOT NULL,
    cashback_value DECIMAL(8,2) NOT NULL,
    cap_amount DECIMAL(8,2) NOT NULL,
    expires_at DATETIME NOT NULL
);

CREATE TABLE crowdsourced_deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_name VARCHAR(150) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    location VARCHAR(150),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```

### 5. Food Delivery

```sql
CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    area VARCHAR(100) NOT NULL,
    source_app ENUM('dummy_foodpanda', 'dummy_ubereats', 'dummy_pathaofood') NOT NULL
);

CREATE TABLE menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    category VARCHAR(100),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE TABLE delivery_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    zone_name VARCHAR(100) NOT NULL,
    delivery_fee DECIMAL(6,2) NOT NULL,
    min_order DECIMAL(8,2) NOT NULL,
    avg_delivery_time_mins INT,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

```

### 6. Alerts, Saved Items, Personalization & Merchants

```sql
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    target_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE saved_deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NULL,
    item_type ENUM('product', 'ride_route', 'coupon', 'restaurant') DEFAULT 'product',
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    query VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE merchants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(150) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```

---

## 6. Comprehensive API Endpoint Reference

| Method | Route / Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register standard user with hashed credentials

 | Public

 |
| `POST` | `/api/auth/login` | Login and obtain 7-day signed JWT

 | Public

 |
| `GET` | `/api/products` | Paginated product listing with category filter

 | Public

 |
| `GET` | `/api/search?q={term}` | Full-text multi-store search & best deal calculation

 | Public

 |
| `GET` | `/api/price-history/:productId?range=30` | Product price trends grouped by vendor

 | Public

 |
| `POST` | `/api/alerts` | Create new target price alert trigger

 | User JWT

 |
| `GET` | `/api/locations` | Autocomplete list of supported pickup/drop-off areas

 | Public

 |
| `POST` | `/api/rides/estimate` | Calculate Haversine distance, traffic ETA & fares

 | Public

 |
| `GET` | `/api/buses?origin=&destination=` | Query intercity bus departures and fares

 | Public

 |
| `POST` | `/api/checkout/calculate` | Compute promo code + MFS discount stacking

 | Public

 |
| `POST` | `/api/deals/submit` | Submit crowdsourced deal

 | User JWT

 |
| `PATCH` | `/api/deals/:id/verify` | Approve or reject pending community deal

 | Admin Role

 |
| `GET` | `/api/food/search?dish=&area=` | Aggregate food menu and delivery fees

 | Public

 |
| `GET` | `/api/users/me` | Retrieve profile, wallet setup, and preferences

 | User JWT

 |
| `POST` | `/api/merchant/offers` | Create partner merchant promotional coupon

 | Merchant Role

 |
| `GET` | `/api/feed/recommendations` | Personalized deals feed matching search history

 | User JWT

 |

---

## 7. Phased Implementation Roadmap

### Phase 1: Static Frontend Development (HTML/CSS)

Focus entirely on the user interface and user experience without worrying about backend logic.

* Design the core web architecture using raw HTML, CSS (e.g., Tailwind or Bootstrap), and standard JavaScript.
* Develop the user-facing static screens: Homepage, Cross-Store Search Results, Ride Compare Matrix, Food Compare Dashboard, and User Profile.
* Develop the administrator static screens: Admin Login, Scraper Health Hub, Affiliate Manager, and Deal Approval Queue.
* Ensure all static pages are fully responsive for mobile, tablet, and desktop views.

### Phase 2: Laravel Blade & Database Architecture

Transition the static assets into a dynamic framework and build the data foundation.

* Initialize the Laravel environment and convert all raw HTML files into dynamic Laravel Blade Templates (`.blade.php`) layout structures.


* Write Laravel Migration files to generate the complete MySQL database schema (Users, Stores, Products, Price History, Ride Rules, Coupons, etc.).
* Generate Eloquent Models for all database tables and define their relational mappings (e.g., One-to-Many for Stores to Products, Many-to-Many for Saved Deals).
* Implement Laravel Database Seeders to populate the tables with dummy data (e.g., sample electronics, dummy restaurants, test coupons) for testing.

### Phase 3: Controllers, Logic, and Finalization

Wire up the backend logic to make the platform fully functional.
 
* Develop the core Laravel Controllers to handle user authentication, form submissions, and data retrieval.
* Implement the aggregator logic: The Haversine distance calculator for rides, the multi-store search queries, and the net-cost coupon stacking engine.
* Integrate web scraping scripts to pull live data and populate the database dynamically.
* Configure the Laravel Task Scheduler (Cron) to run automated background jobs, such as checking for price drops and dispatching alerts.




## 7. Phase 1 Details:
