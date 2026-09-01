import React from 'react'

// Kirei merchant chrome
import AnnouncementBar  from './components/AnnouncementBar'
import KireiHeader      from './components/KireiHeader'
import KireiNav         from './components/KireiNav'

// Kirei shopping sections
import HeroBanner       from './components/HeroBanner'
import ShopByCategory   from './components/ShopByCategory'
import FeaturedProducts from './components/FeaturedProducts'
import SpecialOffers    from './components/SpecialOffers'
import NewArrivals      from './components/NewArrivals'

// OfferMatrix intelligence layer
import SmartDeal        from './components/SmartDeal'
import PriceComparison  from './components/PriceComparison'
import CouponStacking   from './components/CouponStacking'
import PriceHistory     from './components/PriceHistory'
import FakeDiscountAlert from './components/FakeDiscountAlert'
import SellerTrust      from './components/SellerTrust'

// Kirei discovery & footer
import DiscoverKirei    from './components/DiscoverKirei'
import KireiFooter      from './components/KireiFooter'

export default function Kirei() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── Section 1: Announcement bar ────────────────────────── */}
      <AnnouncementBar />

      {/* ── Section 2: Kirei header ─────────────────────────────── */}
      <div className="sticky top-0 z-40 shadow-sm">
        <KireiHeader />

        {/* ── Section 3: Kirei navigation ─────────────────────── */}
        <KireiNav />
      </div>

      <main className="flex-1">

        {/* ── Section 4: Hero banner carousel ─────────────────── */}
        <HeroBanner />

        {/* ── Section 5: Shop by category ─────────────────────── */}
        <ShopByCategory />

        {/* ── Section 6: Featured products ────────────────────── */}
        <FeaturedProducts />

        {/* ── Section 7: Special offers ───────────────────────── */}
        <SpecialOffers />

        {/* ── Section 8: New arrivals ──────────────────────────── */}
        <NewArrivals />

        {/* ── OfferMatrix intelligence divider ────────────────── */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#4F46E5] to-[#0891B2] py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 text-white text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              ⚡ OFFERMATRIX INTELLIGENCE LAYER
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-blue-200">Price comparison · Deal scoring · Authenticity checks · Savings engine</span>
          </div>
        </div>

        {/* ── Company Control Panel ──────────────────────────── */}
        <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F0EBE0] py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <CompanyControlPanel
              onDataSubmit={handleDataSubmit}
              brandColor={Kirei_ACCENT}
              companyName="Kirei"
            />

            {/* Show instruction if no data submitted */}
            {!companyData && (
              <div className="text-center mt-8 p-6 bg-white/50 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-600 font-medium">
                  👆 Fill in the control panel above to generate OfferMatrix analysis for your product
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* ── Section 9: Smart deal metrics ───────────────────── */}
        <SmartDeal />

        {/* ── Section 10: Price comparison ────────────────────── */}
        <PriceComparison />

        {/* ── Section 11: Coupon stacking ─────────────────────── */}
        <CouponStacking />

        {/* ── Section 12: Price history chart ─────────────────── */}
        <div id="price-history-section">
          <PriceHistory />
        </div>

        {/* ── Section 13: Fake discount alert ─────────────────── */}
        <FakeDiscountAlert />

        {/* ── Section 14: Seller trust score ──────────────────── */}
        <SellerTrust />

        {/* ── Section 15: Discover Kirei ──────────────────────── */}
        <DiscoverKirei />

      </main>

      {/* ── Section 16: Kirei footer ─────────────────────────── */}
      <KireiFooter />

    </div>
  )
}
