import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ShoppingBag, UtensilsCrossed, Plane, Tag, RotateCcw } from 'lucide-react'

import OfferMatrixNavbar from './components/layout/OfferMatrixNavbar'
import Home              from './pages/Home'
import BeautyHub         from './pages/beauty/BeautyHub'
import Kirei             from './pages/kirei/Kirei'
import StubPage          from './pages/StubPage'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <OfferMatrixNavbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Beauty & Care */}
          <Route path="/beauty"        element={<BeautyHub />} />
          <Route path="/kirei" element={<Kirei />} />
          <Route path="/choice-legacy" element={
            <StubPage
              title="Choice Legacy"
              description="The Choice Legacy merchant page is coming soon."
              icon={null}
            />
          } />

          {/* Stubs */}
          <Route path="/shopping" element={
            <StubPage title="Shopping" icon={ShoppingBag} color="text-blue-600" bg="bg-blue-50"
              description="Price comparison across all major Bangladesh shopping platforms." />
          } />
          <Route path="/food" element={
            <StubPage title="Food" icon={UtensilsCrossed} color="text-orange-600" bg="bg-orange-50"
              description="Restaurant deals, food delivery offers and cashback." />
          } />
          <Route path="/travel" element={
            <StubPage title="Travel" icon={Plane} color="text-sky-600" bg="bg-sky-50"
              description="Flight deals, hotel discounts and travel package comparisons." />
          } />
          <Route path="/coupons" element={
            <StubPage title="Coupons" icon={Tag} color="text-violet-600" bg="bg-violet-50"
              description="Verified coupon codes updated daily for all major platforms." />
          } />
          <Route path="/cashback" element={
            <StubPage title="Cashback" icon={RotateCcw} color="text-green-600" bg="bg-green-50"
              description="Earn cashback on every purchase across partner stores." />
          } />

          {/* 404 */}
          <Route path="*" element={
            <StubPage title="Page Not Found" description="The page you're looking for doesn't exist." />
          } />
        </Routes>
      </div>
    </div>
  )
}
