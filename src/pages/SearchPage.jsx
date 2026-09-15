import React, { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { featuredProducts, newArrivals } from '../data/kireiData'
import { featuredProducts as clFeaturedProducts } from '../data/choiceLegacyData'
import ProductCard from '../components/shared/ProductCard'

// Combine all products from both stores
const kireiItems = [...featuredProducts, ...newArrivals].map(p => ({ ...p, store: 'kirei' }))
const clProducts  = (clFeaturedProducts || []).map(p => ({ ...p, store: 'choice-legacy' }))
const ALL_PRODUCTS = [...kireiItems, ...clProducts]

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  const { addToCart } = useCart()

  const results = useMemo(() => {
    if (!q.trim()) return []
    const term = q.toLowerCase()
    return ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    )
  }, [q])

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition mb-4">
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search size={22} className="text-gray-400" />
          {q ? (
            <>Results for "<span className="text-[#1E3A8A]">{q}</span>"</>
          ) : (
            'Search'
          )}
        </h1>
        {q && (
          <p className="text-sm text-gray-400 mt-1">
            {results.length} product{results.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {!q.trim() && (
        <div className="text-center py-20 text-gray-400">
          <Search size={48} className="mx-auto mb-4 opacity-20" />
          <p>Type something in the search bar to find products.</p>
        </div>
      )}

      {q.trim() && results.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium text-gray-600">No products found for "{q}"</p>
          <p className="text-sm mt-1">Try a different keyword — brand name, category or product type.</p>
          <div className="flex gap-3 justify-center mt-6">
            <Link to="/kirei"
              className="px-5 py-2 rounded-full bg-[#D4527A] text-white text-sm font-semibold hover:bg-[#b8416a] transition">
              Browse Kirei
            </Link>
            <Link to="/choice-legacy"
              className="px-5 py-2 rounded-full bg-[#1A0A2E] text-white text-sm font-semibold hover:bg-[#2D1654] transition">
              Browse Choice Legacy
            </Link>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map(product => (
            <ProductCard key={`${product.store}-${product.id}`} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
