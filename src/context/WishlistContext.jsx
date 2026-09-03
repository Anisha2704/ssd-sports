import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WISHLIST_STORAGE_KEY = 'ssd_sports_wishlist_items';

const WishlistContext = createContext({
  wishlistItems: [],
  wishlistCount: 0,
  toggleWishlist: () => {},
  isInWishlist: () => false,
  removeFromWishlist: () => {},
  clearWishlist: () => {},
});

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load stored wishlist items from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse stored wishlist items:', e);
    }
  }, []);

  // Save to localStorage whenever wishlistItems state changes
  const saveItems = (items) => {
    setWishlistItems(items);
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wishlist items to localStorage:', e);
    }
  };

  /**
   * Check if product ID is in wishlist
   */
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlistItems.some((item) => item.id === productId);
    },
    [wishlistItems]
  );

  /**
   * Toggle product in/out of wishlist
   */
  const toggleWishlist = useCallback(
    (product) => {
      if (!product || !product.id) return;
      setWishlistItems((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        let next;
        if (exists) {
          next = prev.filter((item) => item.id !== product.id);
        } else {
          next = [...prev, product];
        }
        try {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error('Failed to save wishlist to localStorage:', e);
        }
        return next;
      });
    },
    []
  );

  /**
   * Remove item from wishlist by ID
   */
  const removeFromWishlist = useCallback((productId) => {
    if (!productId) return;
    setWishlistItems((prev) => {
      const next = prev.filter((item) => item.id !== productId);
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save wishlist to localStorage:', e);
      }
      return next;
    });
  }, []);

  /**
   * Clear all items from wishlist
   */
  const clearWishlist = useCallback(() => {
    saveItems([]);
  }, []);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
