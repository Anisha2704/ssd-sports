import { useState, useEffect } from 'react';
import { getHomepageVideos, isShopifyConfigured } from '../services/shopify';

/**
 * Custom React hook to fetch Homepage Video Section metaobject data from Shopify
 * @returns {{ videos: Array, loading: boolean, error: Error|null }}
 */
export function useHomepageVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchVideos() {
      if (!isShopifyConfigured()) {
        if (isMounted) {
          setVideos([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getHomepageVideos();
        if (isMounted) {
          setVideos(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch Homepage Video metaobjects:', err);
          setError(err);
          setVideos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  return { videos, loading, error };
}

export default useHomepageVideos;
