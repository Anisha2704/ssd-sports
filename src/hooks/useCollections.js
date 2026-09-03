import { useState, useEffect, useCallback } from 'react';
import { getCollections, isShopifyConfigured } from '../services/shopify';

/**
 * Hook for fetching Shopify Collections dynamically
 * 
 * @param {Object} options
 * @param {number} [options.first=25]
 * @returns {Object} { collections, loading, error, isConfigured, refetch }
 */
export function useCollections({ first = 25 } = {}) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const configured = isShopifyConfigured();

  const fetchCollections = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCollections({ first });
      setCollections(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch collections from Shopify Storefront API.');
    } finally {
      setLoading(false);
    }
  }, [configured, first]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return {
    collections,
    loading,
    error,
    isConfigured: configured,
    refetch: fetchCollections,
  };
}
