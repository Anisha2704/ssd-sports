import { useState, useEffect, useCallback } from 'react';
import { getProducts, isShopifyConfigured } from '../services/shopify';

/**
 * Hook for fetching Shopify products with loading & error states
 * 
 * @param {Object} options
 * @param {number} [options.first=10]
 * @returns {Object} { products, loading, error, isConfigured, refetch }
 */
export function useProducts({ first = 10 } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const configured = isShopifyConfigured();

  const fetchProductsList = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getProducts({ first });
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch products from Shopify Storefront API.');
    } finally {
      setLoading(false);
    }
  }, [configured, first]);

  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  return {
    products,
    loading,
    error,
    isConfigured: configured,
    refetch: fetchProductsList,
  };
}
