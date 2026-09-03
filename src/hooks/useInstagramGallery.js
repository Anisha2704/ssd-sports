import { useState, useEffect } from 'react';
import { getInstagramGallery, isShopifyConfigured } from '../services/shopify';

/**
 * Custom React hook to fetch Homepage Instagram Gallery metaobject data from Shopify
 * @returns {{ gallery: { images: Array, instagramUrl: string }|null, loading: boolean, error: Error|null }}
 */
export function useInstagramGallery() {
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchGallery() {
      if (!isShopifyConfigured()) {
        if (isMounted) {
          setGallery(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getInstagramGallery();
        if (isMounted) {
          setGallery(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch Homepage Instagram Gallery metaobject:', err);
          setError(err);
          setGallery(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  return { gallery, loading, error };
}

export default useInstagramGallery;
