import { useState, useEffect } from 'react';
import { getFooterSettings, isShopifyConfigured } from '../services/shopify';

/**
 * Custom React hook to fetch Footer Settings metaobject data from Shopify
 * @returns {{
 *   footerSettings: {
 *     address: string|null,
 *     phone: string|null,
 *     email: string|null,
 *     instagramUrl: string|null,
 *     facebookUrl: string|null,
 *     youtubeUrl: string|null
 *   }|null,
 *   loading: boolean,
 *   error: Error|null
 * }}
 */
export function useFooter() {
  const [footerSettings, setFooterSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchFooter() {
      if (!isShopifyConfigured()) {
        if (isMounted) {
          setFooterSettings(null);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const data = await getFooterSettings();
        if (isMounted) {
          setFooterSettings(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch Footer Settings metaobject:', err);
          setError(err);
          setFooterSettings(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFooter();

    return () => {
      isMounted = false;
    };
  }, []);

  return { footerSettings, loading, error };
}

export default useFooter;
