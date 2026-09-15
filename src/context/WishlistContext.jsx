import React, { createContext, useContext, useReducer, useCallback } from 'react'

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.some(i => i.id === action.product.id)
      return {
        ...state,
        items: exists
          ? state.items.filter(i => i.id !== action.product.id)
          : [...state.items, action.product],
      }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    default:
      return state
  }
}

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  const toggleWishlist = useCallback((product) => dispatch({ type: 'TOGGLE', product }), [])
  const removeFromWishlist = useCallback((id)  => dispatch({ type: 'REMOVE', id }), [])
  const isWishlisted   = useCallback((id) => state.items.some(i => i.id === id), [state.items])

  return (
    <WishlistContext.Provider value={{
      items: state.items,
      totalItems: state.items.length,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
