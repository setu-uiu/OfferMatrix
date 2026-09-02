import React, { useRef, useState } from 'react'

// ── Choice Legacy brand chrome ────────────────────────────────────────────────
import CLAnnouncementBar  from '../../components/choiceLegacy/CLAnnouncementBar'
import CLHeader           from '../../components/choiceLegacy/CLHeader'
import CLNavigation       from '../../components/choiceLegacy/CLNavigation'
import CLHero             from '../../components/choiceLegacy/CLHero'
import CLCategories       from '../../components/choiceLegacy/CLCategories'
import CLFeaturedProducts from '../../components/choiceLegacy/CLFeaturedProducts'
import CLSpecialOffers    from '../../components/choiceLegacy/CLSpecialOffers'
import CLNewArrivals      from '../../components/choiceLegacy/CLNewArrivals'
import CLFooter           from '../../components/choiceLegacy/CLFooter'

// ── Shared OfferMatrix intelligence layer ─────────────────────────────────────
import CompanyControlPanel from '../../components/offermatrix/CompanyControlPanel'
import DealScore          from '../../components/offermatrix/DealScore'
import TrustScore         from '../../components/offermatrix/TrustScore'
import PriceComparison    from '../../components/offermatrix/PriceComparison'
import PriceHistory       from '../../components/offermatrix/PriceHistory'
import CouponStack        from '../../components/offermatrix/CouponStack'
import CashbackCalculator from '../../components/offermatrix/CashbackCalculator'
import SavingsSummary     from '../../components/offermatrix/SavingsSummary'
import FakeDiscountAlert  from '../../components/offermatrix/FakeDiscountAlert'

// ── Data ──────────────────────────────────────────────────────────────────────
import {
  smartDealData,
  priceComparisonData,
  couponStackData,
  couponStackTips,
  priceHistoryData,
  sellerTrustData,
  fakeDiscountData,
  cashbackMethods,
  savingsSummaryData,
} from '../../data/choiceLegacyData'

// CL gold — passed as accentColor to DealScore ring
const CL_GOLD    = '#C9A96E'
const CL_ACCENT  = '#9B1D6A'

export default function ChoiceLegacyPage() {
  const priceHistoryRef = useRef(null)
  const [companyData,    setCompanyData]    = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  function scrollToPriceHistory() {
    priceHistoryRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handler for company data submission
  const handleDataSubmit = (data) => {
    setCompanyData(data)
    if (data) {
      // Build a minimal product shape the intelligence sections expect
      setSelectedProduct({
        brand:         data.brandName,
        name:          data.productName,
        currentPrice:  data.salePrice,
        originalPrice: data.originalPrice,
      })
      const intelligenceSection = document.getElementById('offermatrix-intelligence')
      intelligenceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      setSelectedProduct(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">

      {/* ── 1. Announcement bar ─────────────────────────────── */}
      <CLAnnouncementBar />

      {/* ── 2 & 3. Header + Navigation — sticky ─────────────── */}
      <div className="sticky top-0 z-40">
        <CLHeader />
        <CLNavigation />
      </div>

      <main className="flex-1">

          {/* ── Hero wrapper — relative for its own absolute controls ─── */}
          <div className="relative overflow-hidden">
            <CLHero />
          </div>

        {/* ── 5. Shop by category ───────────────────────────── */}
        <CLCategories />

        {/* ── 6. Featured products ──────────────────────────── */}
        <CLFeaturedProducts />

        {/* ── 7. Special offers ─────────────────────────────── */}
        <CLSpecialOffers />

        {/* ── 8. New arrivals ───────────────────────────────── */}
        <CLNewArrivals />

        {/* ── OfferMatrix intelligence divider ─────────────── */}
        <div id="offermatrix-intelligence" className="bg-[#1A0A2E] py-3">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center
            justify-center gap-2 text-xs font-semibold text-white">
            <span className="flex items-center gap-1.5">
              <span className="text-[#F02D7D]">%</span>
              OFFERMATRIX INTELLIGENCE LAYER
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30 hidden sm:block" />
            <span className="text-[#9B7FBF]">
              Price comparison · Deal scoring · Authenticity checks · Savings engine
            </span>
          </div>
        </div>

        {/* ── Company Control Panel ──────────────────────────── */}
        <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F0EBE0] py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <CompanyControlPanel
              onDataSubmit={handleDataSubmit}
              brandColor={CL_ACCENT}
              companyName="Choice Legacy"
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

        {/* ── 9. Deal Score ─────────────────────────────────── */}
        {companyData && (
          <DealScore
            data={{
              ...smartDealData,
              product: `${companyData.brandName} ${companyData.productName}`,
            }}
            accentColor={CL_ACCENT}
          />
        )}

        {/* ── 10. Price Comparison ──────────────────────────── */}
        {selectedProduct && (
          <div className="bg-white">
            <PriceComparison data={{
              ...priceComparisonData,
              product: `${selectedProduct.brand} ${selectedProduct.name}`,
            }} />
          </div>
        )}

        {/* ── 11. Coupon Stack + Cashback Calculator side-by-side */}
        {selectedProduct && (
          <div className="bg-gray-50 py-10 md:py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Coupon stacking waterfall */}
                <div>
                  <CouponStack
                    data={{
                      ...couponStackData,
                      product: `${selectedProduct.brand} ${selectedProduct.name}`,
                      basePrice: selectedProduct.originalPrice || selectedProduct.currentPrice,
                    }}
                    tips={couponStackTips}
                  />
                </div>

                {/* Cashback calculator + savings summary */}
                <div className="flex flex-col gap-5">
                  <CashbackCalculator
                    methods={cashbackMethods}
                    defaultPrice={selectedProduct.currentPrice}
                  />
                  <SavingsSummary
                    breakdown={savingsSummaryData.breakdown}
                    originalPrice={selectedProduct.originalPrice || selectedProduct.currentPrice}
                    finalPrice={selectedProduct.currentPrice}
                    ctaLabel="GET THIS DEAL AT CHOICE LEGACY"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 12. Price History chart ───────────────────────── */}
        {selectedProduct && (
          <div ref={priceHistoryRef} id="price-history-section">
            <PriceHistory
              data={{
                ...priceHistoryData,
                product: `${selectedProduct.brand} ${selectedProduct.name}`,
                currentPrice: selectedProduct.currentPrice,
              }}
              lineColor={CL_ACCENT}
            />
          </div>
        )}

        {/* ── 13. Fake Discount Alert ───────────────────────── */}
        {selectedProduct && (
          <FakeDiscountAlert
            data={fakeDiscountData}
            onViewHistory={scrollToPriceHistory}
          />
        )}

        {/* ── 14. Trust Score ───────────────────────────────── */}
        {selectedProduct && (
          <TrustScore
            data={sellerTrustData}
            merchantName="Choice Legacy"
          />
        )}

      </main>

      {/* ── 15. Footer ────────────────────────────────────── */}
      <CLFooter />

    </div>
  )
}
