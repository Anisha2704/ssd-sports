import { useState, useEffect } from 'react';
import { getHomepageHero, isShopifyConfigured } from '../services/shopify';

/**
 * Custom React hook to fetch Homepage Hero Section metaobject data from Shopify
 * @returns {{ hero: { logo: Object|null, desktopImages: Array, mobileImages: Array }|null, loading: boolean, error: Error|null }}
 */
export function useHomepageHero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHero() {
      if (!isShopifyConfigured()) {
        if (isMounted) {
          setHero(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getHomepageHero();
        if (isMounted) {
          setHero(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch Homepage Hero metaobject:', err);
          setError(err);
          setHero(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchHero();

    return () => {
      isMounted = false;
    };
  }, []);

  return { hero, loading, error };
}

export default useHomepageHero;
