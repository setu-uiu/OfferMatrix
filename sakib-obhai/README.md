# Sakib OBHAI (ওভাই) - React Edition with Live Search & Dynamic Fare Calculation

An authentic, modern React web application for **OBHAI (ওভাই)** featuring full **Live Location Search (Search Option)** across 20+ major Dhaka hubs, real-time dynamic road distance & duration computation, and automatic fare calculation across all 6 OBHAI fleets.

---

## 🌟 Key Features

1. **Live Location Search & Dynamic Fare Calculation**:
   - Autocomplete search inputs for both **পিকআপ (Pickup)** and **গন্তব্য (Destination)** with Bengali and English location indexing.
   - Comprehensive Dhaka database (Mirpur 10, Farmgate, Gulshan 1 & 2, Banani 11, Dhanmondi 27 & 32, Uttara 3 & 7, Airport, Mohakhali, Bashundhara, Motijheel, Old Dhaka, etc.).
   - Dynamic real-time road distance ($km$) and travel duration ($mins$) calculations using the Dhaka detour traffic factor ($1.32\times$).

2. **6 OBHAI Fleet Options with Real-Time Rates**:
   - 🛺 **OBHAI CNG (সিএনজি)** - Base ৳ 60 + ৳ 18/km (Government Digital Meter BRTA standard)
   - 🏍️ **OBHAI Moto (বাইক)** - Base ৳ 40 + ৳ 12/km (Fastest ride)
   - 🚗 **OBHAI Prime AC (কার)** - Base ৳ 140 + ৳ 28/km (Full AC sedan)
   - 🚙 **OBHAI Micro (মাইক্রোবাস)** - Base ৳ 220 + ৳ 45/km (7-seater family)
   - 📦 **Express Parcel (পার্সেল)** - Base ৳ 50 + ৳ 15/km (Same-day delivery)
   - 🚑 **OBHAI Seba (অ্যাম্বুলেন্স)** - Base ৳ 500 + ৳ 50/km (24/7 Emergency medical)

3. **Digital CNG Meter Simulation Box**:
   - Real-time display of Base Fare + Calculated Distance Fare + Discount Breakdown according to BRTA regulations.

4. **3-in-1 Role Portals**:
   - **Customer Portal**: Search locations, view dynamic vehicle fares, live Leaflet map, coupon manager, and bKash wallet top-up.
   - **Captain / Driver Portal**: Go online/offline, accept real-time simulated ride requests, and track daily earnings.
   - **Super Admin HQ**: Live Pricing Inputs control panel, coupon publisher, and customer dispute resolution with direct wallet refund credit.

---

## 🚀 How to Run

### Option 1: Standalone 1-Click File (No Installation Required)
Simply double-click or open `sakib-obhai.html` in any modern web browser (Chrome, Safari, Edge, Firefox).

### Option 2: Full React Vite Dev Server
```bash
cd /Users/smnazmus11gmail.com/.gemini/antigravity/scratch/sakib-obhai
npm install
npm run dev
```
