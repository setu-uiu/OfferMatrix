import React, { createContext, useContext, useReducer, useCallback } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
// action.type: 'ADD' | 'REMOVE' | 'UPDATE_QTY' | 'CLEAR'
// ADD payload: { product }
// REMOVE payload: { id }
// UPDATE_QTY payload: { id, qty }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id)
      const items = existing
        ? state.items.map(i =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...state.items, { ...action.product, qty: 1 }]
      return { ...state, items }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addToCart     = useCallback((product)      => dispatch({ type: 'ADD', product }), [])
  const removeFromCart = useCallback((id)          => dispatch({ type: 'REMOVE', id }), [])
  const updateQty     = useCallback((id, qty)      => dispatch({ type: 'UPDATE_QTY', id, qty }), [])
  const clearCart     = useCallback(()             => dispatch({ type: 'CLEAR' }), [])

  const totalItems    = state.items.reduce((s, i) => s + i.qty, 0)
  const subtotal      = state.items.reduce((s, i) => s + i.currentPrice * i.qty, 0)
  const isInCart      = useCallback((id) => state.items.some(i => i.id === id), [state.items])

  return (
    <CartContext.Provider value={{
      items: state.items,
      totalItems,
      subtotal,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
