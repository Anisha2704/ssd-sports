import { useState, useEffect } from 'react';
import { getHomepageFeature, isShopifyConfigured } from '../services/shopify';

/**
 * Custom React hook to fetch Homepage Feature Section metaobject data from Shopify
 * @returns {{ feature: Object|null, loading: boolean, error: Error|null }}
 */
export function useHomepageFeature() {
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeature() {
      if (!isShopifyConfigured()) {
        if (isMounted) {
          setFeature(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getHomepageFeature();
        if (isMounted) {
          setFeature(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch Homepage Feature metaobject:', err);
          setError(err);
          setFeature(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFeature();

    return () => {
      isMounted = false;
    };
  }, []);

  return { feature, loading, error };
}

export default useHomepageFeature;
