# Uber Pro - Dual Role Rider Experience & Company Admin Control Panel

A complete, high-fidelity Web Application combining both the **Rider (Customer) Experience** and the **Company Admin HQ Control Panel** (featuring the custom **Your Pricing Inputs** card with real-time syncing).

---

## 🌟 Key Highlights

### 1. 🛡️ Dual Role Architecture (Rider vs Admin HQ)
- **Role Selector Login Modal**: Switch seamlessly between Rider and Admin HQ.
- **Floating Role Switcher**: Quick toggle button floating at bottom-left to jump back and forth instantly.

### 2. 🎛️ Your Pricing Inputs (Company Control Panel)
*Designed precisely matching the reference image:*
- **Store Discount**: Adjust global platform discount (`10%`, `20%`, etc.).
- **Coupon Code**: Change primary campaign promo code (`KIREI10`, etc.).
- **bKash Cashback**: Set instant wallet cashback (`৳ 150`, etc.).
- **Shipping / Base Surge Cost**: Adjust base delivery or peak surge fee.
- **Sale Price / Rate Modifier**: Adjust fixed price ceilings or per km rates.
- **"🔄 Apply Changes"**: Real-time update that instantly recalculates all active rider fares and promo banners without refreshing!

### 3. 🎟️ Coupon & Promo Manager
- Admin can create new custom coupons (`Code`, `Discount %`, `Max Cap ৳`).
- View and manage existing promo campaigns in a clean table.
- Instantly available for riders to apply in their booking view.

### 4. 🎧 Customer Disputes & Refund Resolution Inbox
- View real-time complaints submitted by riders.
- Review issue details and input custom refund amount (৳).
- Click **"✅ Resolve & Credit User Wallet"** $\rightarrow$ instantly updates the rider's Uber Cash balance in real time!

### 5. 🚗 Complete Rider Experience
- Interactive Leaflet map with routing & simulated driver arrival.
- Multi-tier fleet selector (UberX, Comfort, XL, Black, Moto) showing live discounts.
- Rider Account & Wallet modal to file complaints, top-up balance, and apply vouchers.

---

## 🚀 How to Run in VS Code / Browser

### Option 1: Open Standalone File
Open `uber-admin-pro-standalone.html` directly in your browser.

### Option 2: Run Local Server in VS Code
```bash
cd /Users/smnazmus11gmail.com/.gemini/antigravity/scratch/uber-admin-pro
python3 -m http.server 4000
```
Then visit: `http://localhost:4000`
