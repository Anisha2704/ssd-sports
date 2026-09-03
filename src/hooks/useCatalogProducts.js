import { useState, useEffect, useCallback } from 'react';
import { getPaginatedProducts, getCollectionByHandle, isShopifyConfigured } from '../services/shopify';

/**
 * Hook for managing catalog products with collection filtering, sorting & cursor pagination
 */
export function useCatalogProducts({ collectionHandle = null, sortOption = 'featured', searchQuery = '', first = 12 } = {}) {
  const [products, setProducts] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const configured = isShopifyConfigured();

  // Primary fetch for initial load or filter/sort changes
  const fetchInitialProducts = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (collectionHandle) {
        const result = await getCollectionByHandle({
          handle: collectionHandle,
          first,
          after: null,
          sortOption,
        });
        setActiveCollection(result.collection);
        setProducts(result.products);
        setPageInfo(result.pageInfo);
      } else {
        setActiveCollection(null);
        const result = await getPaginatedProducts({
          first,
          after: null,
          sortOption,
          searchQuery,
        });
        setProducts(result.products);
        setPageInfo(result.pageInfo);
      }
    } catch (err) {
      console.error('Error fetching catalog products:', err);
      setError('Unable to load products. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [configured, collectionHandle, sortOption, searchQuery, first]);

  useEffect(() => {
    fetchInitialProducts();
  }, [fetchInitialProducts]);

  // Load More cursor pagination handler
  const loadMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor || loadingMore) return;

    setLoadingMore(true);

    try {
      if (collectionHandle) {
        const result = await getCollectionByHandle({
          handle: collectionHandle,
          first,
          after: pageInfo.endCursor,
          sortOption,
        });
        setProducts((prev) => [...prev, ...result.products]);
        setPageInfo(result.pageInfo);
      } else {
        const result = await getPaginatedProducts({
          first,
          after: pageInfo.endCursor,
          sortOption,
          searchQuery,
        });
        setProducts((prev) => [...prev, ...result.products]);
        setPageInfo(result.pageInfo);
      }
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    products,
    activeCollection,
    pageInfo,
    loading,
    loadingMore,
    error,
    isConfigured: configured,
    hasMore: pageInfo.hasNextPage,
    loadMore,
    refetch: fetchInitialProducts,
  };
}
