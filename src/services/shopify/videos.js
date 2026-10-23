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
/**
 * Detects whether a URL or extension corresponds to a video format
 * @param {string} url
 * @returns {boolean}
 */
function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /\.(mp4|webm|mov|m4v|ogv|ogg|m3u8)($|\?)/i.test(url);
}

/**
 * Detects whether a URL or extension corresponds to an image format
 * @param {string} url
 * @returns {boolean}
 */
function isImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /\.(jpe?g|png|webp|avif|gif|svg|bmp|heic|tiff)($|\?)/i.test(url);
}

/**
 * Extract media object from a Shopify field reference or value
 * @param {Object} field
 * @returns {Object|null}
 */
function extractMediaFromField(field) {
  if (!field) return null;

  const ref = field.reference || field.references?.nodes?.[0];

  // 1. Reference present
  if (ref) {
    const typeName = ref.__typename;
    const hasSources = Array.isArray(ref.sources) && ref.sources.length > 0;
    const isExplicitVideo = typeName === 'Video' || hasSources;
    const hasImageObj = Boolean(ref.image && ref.image.url);
    const isExplicitImage = typeName === 'MediaImage' || hasImageObj;

    if (isExplicitVideo) {
      let posterUrl = null;
      if (ref.previewImage?.url) {
        posterUrl = normalizeShopifyMediaUrl(ref.previewImage.url);
      } else if (ref.image?.url) {
        posterUrl = normalizeShopifyMediaUrl(ref.image.url);
      }

      const normalizedSources = (ref.sources || []).map((s) => ({
        ...s,
        url: normalizeShopifyMediaUrl(s.url),
      }));

      const mp4Sources = normalizedSources.filter(
        (s) => s.mimeType === 'video/mp4' || s.format === 'mp4'
      );
      mp4Sources.sort((a, b) => (b.height || 0) - (a.height || 0));

      const otherSources = normalizedSources.filter(
        (s) => s.mimeType !== 'video/mp4' && s.format !== 'mp4'
      );

      const sources = [...mp4Sources, ...otherSources];
      const primaryUrl = mp4Sources[0]?.url || sources[0]?.url || (ref.url ? normalizeShopifyMediaUrl(ref.url) : null);

      if (primaryUrl) {
        return {
          type: 'video',
          primaryUrl,
          url: primaryUrl,
          posterUrl,
          sources,
          altText: ref.alt || 'SSD Sports Pro Video Highlight',
          width: null,
          height: null,
        };
      }
    }

    if (isExplicitImage) {
      const imageUrl = normalizeShopifyMediaUrl(ref.image.url);
      return {
        type: 'image',
        primaryUrl: imageUrl,
        url: imageUrl,
        posterUrl: null,
        sources: [],
        altText: ref.image.altText || ref.alt || 'SSD Sports Pro Gear Highlight',
        width: ref.image.width || null,
        height: ref.image.height || null,
      };
    }

    if (ref.url) {
      const normalizedUrl = normalizeShopifyMediaUrl(ref.url);
      if (isVideoUrl(normalizedUrl)) {
        return {
          type: 'video',
          primaryUrl: normalizedUrl,
          url: normalizedUrl,
          posterUrl: ref.previewImage?.url ? normalizeShopifyMediaUrl(ref.previewImage.url) : null,
          sources: [{ url: normalizedUrl, mimeType: 'video/mp4' }],
          altText: ref.alt || 'SSD Sports Pro Video Highlight',
          width: null,
          height: null,
        };
      }
      return {
        type: 'image',
        primaryUrl: normalizedUrl,
        url: normalizedUrl,
        posterUrl: null,
        sources: [],
        altText: ref.alt || 'SSD Sports Pro Gear Highlight',
        width: null,
        height: null,
      };
    }
  }

  // 2. Direct string URL in field.value
  if (field.value && typeof field.value === 'string' && (field.value.startsWith('http') || field.value.startsWith('//'))) {
    const normalizedUrl = normalizeShopifyMediaUrl(field.value);
    if (isVideoUrl(normalizedUrl)) {
      return {
        type: 'video',
        primaryUrl: normalizedUrl,
        url: normalizedUrl,
        posterUrl: null,
        sources: [{ url: normalizedUrl, mimeType: 'video/mp4' }],
        altText: 'SSD Sports Pro Video Highlight',
        width: null,
        height: null,
      };
    }
    return {
      type: 'image',
      primaryUrl: normalizedUrl,
      url: normalizedUrl,
      posterUrl: null,
      sources: [],
      altText: 'SSD Sports Pro Gear Highlight',
      width: null,
      height: null,
    };
  }

  return null;
}

/**
 * Fetch and parse Homepage Video Section metaobjects
 * Supports both videos and photos/images
 * @returns {Promise<Array<{id: string, handle: string, type: string, primaryUrl: string, url: string, posterUrl: string|null, sources: Array, altText: string, width: number|null, height: number|null}>>}
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

      // Locate media field (video, media, image, photo, or any field with reference)
      const mediaField =
        node.fields.find(
          (f) =>
            f.key.toLowerCase() === 'video' ||
            f.key.toLowerCase() === 'media' ||
            f.key.toLowerCase() === 'image' ||
            f.key.toLowerCase() === 'photo' ||
            f.key.toLowerCase().includes('video') ||
            f.key.toLowerCase().includes('media') ||
            f.key.toLowerCase().includes('image')
        ) ||
        node.fields.find((f) => f.reference || f.references?.nodes?.length > 0) ||
        node.fields.find((f) => typeof f.value === 'string' && (isVideoUrl(f.value) || isImageUrl(f.value)));

      if (!mediaField) return;

      const media = extractMediaFromField(mediaField);

      if (media && media.primaryUrl) {
        videos.push({
          id: node.id || node.handle,
          handle: node.handle,
          type: media.type,
          primaryUrl: media.primaryUrl,
          url: media.url,
          posterUrl: media.posterUrl,
          sources: media.sources,
          altText: media.altText,
          width: media.width,
          height: media.height,
        });
      }
    });

    return videos;
  } catch (error) {
    console.error('Error fetching Homepage Video Section metaobjects:', error);
    throw error;
  }
}

