import { useState, useEffect, useCallback } from 'react';
import {
  getProductByHandle,
  getRelatedProducts,
  isShopifyConfigured,
} from '../services/shopify';

/**
 * Custom hook to fetch a single product and related products by handle
 * 
 * @param {string} handle 
 * @returns {Object} { product, relatedProducts, loading, error, isConfigured, refetch }
 */
export function useProduct(handle) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const configured = isShopifyConfigured();

  const fetchProductData = useCallback(async () => {
    if (!handle) {
      setProduct(null);
      setRelatedProducts([]);
      setLoading(false);
      return;
    }

    if (!configured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedProduct = await getProductByHandle(handle);
      setProduct(fetchedProduct);

      if (fetchedProduct) {
        const collectionHandle = fetchedProduct.collections?.nodes?.[0]?.handle || null;
        const fetchedRelated = await getRelatedProducts({
          handle,
          collectionHandle,
          first: 4,
        });
        setRelatedProducts(fetchedRelated);
      } else {
        setRelatedProducts([]);
      }
    } catch (err) {
      console.error(`Failed to fetch product [${handle}]:`, err);
      setError(err.message || 'Failed to load product details from Shopify Storefront API.');
    } finally {
      setLoading(false);
    }
  }, [handle, configured]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  return {
    product,
    relatedProducts,
    loading,
    error,
    isConfigured: configured,
    refetch: fetchProductData,
  };
}
