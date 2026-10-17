import { useState, useEffect } from 'react';
import { getHomepageHero, isShopifyConfigured } from '../services/shopify';

let cachedHero = null;

/**
 * Custom React hook to fetch Homepage Hero Section metaobject data from Shopify
 * @returns {{ hero: { logo: Object|null, desktopImages: Array, tabletImages: Array, mobileImages: Array, textSlider: Array|null, isTextSliderList: boolean }|null, loading: boolean, error: Error|null }}
 */
export function useHomepageHero() {
  const [hero, setHero] = useState(cachedHero);
  const [loading, setLoading] = useState(!cachedHero);
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
        if (!cachedHero) {
          setLoading(true);
        }
        const data = await getHomepageHero();
        cachedHero = data;
        if (isMounted) {
          setHero(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch Homepage Hero metaobject:', err);
          setError(err);
          if (!cachedHero) {
            setHero(null);
          }
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
