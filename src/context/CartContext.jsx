import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle, ShoppingBag, X } from 'lucide-react';
import {
  createCart,
  addToCart,
  getCart,
  updateCartLine,
  removeCartLine,
  isShopifyConfigured,
} from '../services/shopify';

const CART_STORAGE_KEY = 'ssd_sports_shopify_cart_id';

const CartContext = createContext({
  cart: null,
  cartCount: 0,
  loading: false,
  addingItem: false,
  error: null,
  toast: null,
  showToast: () => {},
  addItemToCart: async () => {},
  buyNow: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingItem, setAddingItem] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto hide toast after 3.5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback(({ type = 'success', title, message }) => {
    setToast({ type, title, message });
  }, []);

  // Initialize or fetch stored cart from localStorage
  const initCart = useCallback(async () => {
    if (!isShopifyConfigured()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const existingCartId = localStorage.getItem(CART_STORAGE_KEY);

    if (existingCartId) {
      const fetchedCart = await getCart(existingCartId);
      if (fetchedCart) {
        setCart(fetchedCart);
        setLoading(false);
        return;
      }
      localStorage.removeItem(CART_STORAGE_KEY);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    initCart();
  }, [initCart]);

  /**
   * Add a merchandise variant to cart
   */
  const addItemToCart = async (variantId, quantity = 1, productTitle = '') => {
    if (!variantId) return null;
    setAddingItem(true);
    setError(null);

    try {
      let updatedCart = null;
      const currentCartId = cart?.id || localStorage.getItem(CART_STORAGE_KEY);

      if (currentCartId) {
        try {
          updatedCart = await addToCart(currentCartId, [
            { merchandiseId: variantId, quantity },
          ]);
        } catch (e) {
          updatedCart = await createCart([
            { merchandiseId: variantId, quantity },
          ]);
        }
      } else {
        updatedCart = await createCart([
          { merchandiseId: variantId, quantity },
        ]);
      }

      if (updatedCart?.id) {
        localStorage.setItem(CART_STORAGE_KEY, updatedCart.id);
        setCart(updatedCart);
      }

      showToast({
        type: 'success',
        title: 'Added to Cart!',
        message: productTitle ? `${productTitle} (x${quantity}) added to your cart` : 'Item successfully added to your cart',
      });

      return updatedCart;
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError(err.message || 'Could not add item to cart.');
      showToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to add item to cart.',
      });
      throw err;
    } finally {
      setAddingItem(false);
    }
  };

  /**
   * Buy Now
   */
  const buyNow = async (variantId, quantity = 1) => {
    const updatedCart = await addItemToCart(variantId, quantity);
    if (updatedCart?.checkoutUrl) {
      window.location.href = updatedCart.checkoutUrl;
    } else if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  /**
   * Update item quantity in cart
   */
  const updateQuantity = async (lineId, quantity) => {
    if (!cart?.id || !lineId) return;
    setLoading(true);
    try {
      if (quantity <= 0) {
        const updated = await removeCartLine(cart.id, lineId);
        setCart(updated);
      } else {
        const updated = await updateCartLine(cart.id, lineId, quantity);
        setCart(updated);
      }
    } catch (err) {
      console.error('Failed to update cart quantity:', err);
      setError(err.message || 'Could not update quantity.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove item from cart
   */
  const removeItem = async (lineId) => {
    if (!cart?.id || !lineId) return;
    setLoading(true);
    try {
      const updated = await removeCartLine(cart.id, lineId);
      setCart(updated);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      setError(err.message || 'Could not remove item.');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.totalQuantity || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addingItem,
        error,
        toast,
        showToast,
        addItemToCart,
        buyNow,
        updateQuantity,
        removeItem,
      }}
    >
      {children}

      {/* Floating Global Toast Alert Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-bounce-short">
          <div className="flex items-center gap-3">
            {toast.type === 'error' || toast.type === 'warning' ? (
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            )}
            <div>
              <p className="font-extrabold text-xs text-white">{toast.title}</p>
              {toast.message && <p className="text-slate-300 text-[11px] mt-0.5">{toast.message}</p>}
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
