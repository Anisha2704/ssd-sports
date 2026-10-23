/**
 * Service to fetch Homepage Video Section Metaobjects from Shopify Storefront API.
 */

import { shopifyFetch, getShopifyDomain } from './client.js';
import { GET_HOMEPAGE_VIDEOS_QUERY } from './queries/videos.js';

/**
 * Normalizes Shopify media/video URLs.
 * When a custom domain (like ssdsports.in) points to a decoupled React SPA,
 * requests to /cdn/shop/... hit the SPA router and return HTML index instead of media.
 * Mapping the hostname to *.myshopify.com ensures the real media file is fetched from Shopify's CDN.
 * 
 * @param {string} url
 * @returns {string}
 */
export function normalizeShopifyMediaUrl(url) {
  if (!url || typeof url !== 'string') return url;

  let cleanUrl = url.trim();
  if (cleanUrl.startsWith('//')) {
    cleanUrl = `https:${cleanUrl}`;
  }

  // Already directly on cdn.shopify.com
  if (cleanUrl.includes('cdn.shopify.com')) {
    return cleanUrl;
  }

  const shopifyDomain = getShopifyDomain() || 'ssdsports.myshopify.com';

  try {
    const parsed = new URL(cleanUrl);
    // If the path is /cdn/shop/... (Shopify CDN media asset)
    if (parsed.pathname.startsWith('/cdn/shop/')) {
      if (!parsed.hostname.endsWith('myshopify.com') && parsed.hostname !== 'cdn.shopify.com') {
        parsed.hostname = shopifyDomain;
        return parsed.toString();
      }
    }
  } catch (e) {
    // If URL parsing fails, return original
  }

  return cleanUrl;
}

/**
 * Fetch and parse Homepage Video Section metaobjects
 * @returns {Promise<Array<{id: string, handle: string, primaryUrl: string, posterUrl: string|null, sources: Array, altText: string}>>}
 */
export async function getHomepageVideos() {
  try {
    const data = await shopifyFetch({
      query: GET_HOMEPAGE_VIDEOS_QUERY,
    });

    const metaobjectNodes = data?.metaobjects?.nodes || [];

    const videos = [];

    metaobjectNodes.forEach((node) => {
      if (!node || !Array.isArray(node.fields)) return;

      const videoField = node.fields.find(
        (f) => f.key.toLowerCase() === 'video' || f.key.toLowerCase().includes('video')
      );

      if (!videoField) return;

      let primaryUrl = null;
      let posterUrl = null;
      let sources = [];
      let altText = 'SSD Sports Video';

      if (videoField.reference) {
        const ref = videoField.reference;

        // Extract thumbnail/preview poster if available
        if (ref.previewImage?.url) {
          posterUrl = normalizeShopifyMediaUrl(ref.previewImage.url);
        } else if (ref.image?.url) {
          posterUrl = normalizeShopifyMediaUrl(ref.image.url);
        }

        if (Array.isArray(ref.sources) && ref.sources.length > 0) {
          // Normalize all source URLs
          const normalizedSources = ref.sources.map((s) => ({
            ...s,
            url: normalizeShopifyMediaUrl(s.url),
          }));

          // Prioritize MP4 sources over HLS (.m3u8) for standard HTML5 <video> elements
          const mp4Sources = normalizedSources.filter(
            (s) => s.mimeType === 'video/mp4' || s.format === 'mp4'
          );

          // Sort MP4 sources by resolution/height descending (720p > 480p)
          mp4Sources.sort((a, b) => (b.height || 0) - (a.height || 0));

          const otherSources = normalizedSources.filter(
            (s) => s.mimeType !== 'video/mp4' && s.format !== 'mp4'
          );

          // Put MP4s first so browsers pick and play immediately
          sources = [...mp4Sources, ...otherSources];

          if (mp4Sources.length > 0) {
            primaryUrl = mp4Sources[0].url;
          } else if (sources.length > 0) {
            primaryUrl = sources[0].url;
          }

          if (ref.alt) {
            altText = ref.alt;
          }
        } else if (ref.url) {
          primaryUrl = normalizeShopifyMediaUrl(ref.url);
        }
      } else if (videoField.value && typeof videoField.value === 'string' && videoField.value.startsWith('http')) {
        primaryUrl = normalizeShopifyMediaUrl(videoField.value);
      }

      if (primaryUrl) {
        videos.push({
          id: node.id || node.handle,
          handle: node.handle,
          primaryUrl,
          posterUrl,
          sources,
          altText,
        });
      }
    });

    return videos;
  } catch (error) {
    console.error('Error fetching Homepage Video Section metaobjects:', error);
    throw error;
  }
}
