/**
 * Service to fetch Homepage Feature Section Metaobject from Shopify Storefront API.
 */

import { shopifyFetch } from './client.js';
import { GET_HOMEPAGE_FEATURE_QUERY } from './queries/homepageFeature.js';
import { normalizeShopifyMediaUrl } from './videos.js';

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
 * Extract media object (image or video) from Shopify field reference or value
 * @param {Object} field
 * @returns {Object|null}
 */
function extractMedia(field) {
  if (!field) return null;

  const ref = field.reference || field.references?.nodes?.[0];

  // 1. Reference is present (GraphQL MediaImage, Video, or GenericFile)
  if (ref) {
    const typeName = ref.__typename;

    // Check if definitely a Video
    const hasSources = Array.isArray(ref.sources) && ref.sources.length > 0;
    const isExplicitVideo = typeName === 'Video' || hasSources;

    // Check if definitely an Image
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

      return {
        type: 'video',
        url: primaryUrl,
        primaryUrl,
        posterUrl,
        sources,
        altText: ref.alt || 'SSD Sports Craftsmanship & Performance Video',
      };
    }

    if (isExplicitImage) {
      const imageUrl = normalizeShopifyMediaUrl(ref.image.url);
      return {
        type: 'image',
        url: imageUrl,
        primaryUrl: imageUrl,
        posterUrl: null,
        sources: [],
        altText: ref.image.altText || ref.alt || 'SSD Sports Craftsmanship & Performance',
        width: ref.image.width || null,
        height: ref.image.height || null,
      };
    }

    // GenericFile reference or fallback with ref.url
    if (ref.url) {
      const normalizedUrl = normalizeShopifyMediaUrl(ref.url);
      if (isVideoUrl(normalizedUrl)) {
        return {
          type: 'video',
          url: normalizedUrl,
          primaryUrl: normalizedUrl,
          posterUrl: ref.previewImage?.url ? normalizeShopifyMediaUrl(ref.previewImage.url) : null,
          sources: [{ url: normalizedUrl, mimeType: 'video/mp4' }],
          altText: ref.alt || 'SSD Sports Craftsmanship & Performance Video',
        };
      }
      return {
        type: 'image',
        url: normalizedUrl,
        primaryUrl: normalizedUrl,
        posterUrl: null,
        sources: [],
        altText: ref.alt || 'SSD Sports Craftsmanship & Performance',
        width: null,
        height: null,
      };
    }
  }

  // 2. Fallback: string URL value in field.value
  if (field.value && typeof field.value === 'string' && (field.value.startsWith('http') || field.value.startsWith('//'))) {
    const normalizedUrl = normalizeShopifyMediaUrl(field.value);
    if (isVideoUrl(normalizedUrl)) {
      return {
        type: 'video',
        url: normalizedUrl,
        primaryUrl: normalizedUrl,
        posterUrl: null,
        sources: [{ url: normalizedUrl, mimeType: 'video/mp4' }],
        altText: 'SSD Sports Craftsmanship & Performance Video',
      };
    }
    return {
      type: 'image',
      url: normalizedUrl,
      primaryUrl: normalizedUrl,
      posterUrl: null,
      sources: [],
      altText: 'SSD Sports Craftsmanship & Performance',
      width: null,
      height: null,
    };
  }

  return null;
}

/**
 * Fetch and parse the Homepage Feature Section metaobject
 * @returns {Promise<Object|null>}
 */
export async function getHomepageFeature() {
  try {
    const data = await shopifyFetch({
      query: GET_HOMEPAGE_FEATURE_QUERY,
    });

    const metaobjectNode = data?.metaobjects?.nodes?.[0];

    if (!metaobjectNode || !Array.isArray(metaobjectNode.fields)) {
      return null;
    }

    const fields = metaobjectNode.fields;

    const findField = (key) => fields.find((f) => f.key.toLowerCase() === key.toLowerCase());

    const statNumberField = findField('stat_number');
    const statLabelField = findField('stat_label');
    const statDescField = findField('stat_description');
    const headingField = findField('heading');
    const descField = findField('description');
    const buttonTextField = findField('button_text');

    // Find media field: either 'video', 'media', 'image', 'photo', etc., or any field containing media reference
    const mediaField =
      findField('video') ||
      findField('media') ||
      findField('image') ||
      findField('photo') ||
      findField('feature_video') ||
      findField('feature_image') ||
      findField('feature_media') ||
      fields.find((f) => f.reference || f.references?.nodes?.length > 0) ||
      fields.find((f) => typeof f.value === 'string' && (isVideoUrl(f.value) || isImageUrl(f.value)));

    // Parse stat_number
    let statNumber = 1000;
    if (statNumberField?.value) {
      const parsed = parseInt(statNumberField.value, 10);
      if (!isNaN(parsed)) {
        statNumber = parsed;
      }
    }

    // Parse media (supports both video and photo/image)
    const media = extractMedia(mediaField);
    const isVideo = media?.type === 'video';
    const isImage = media?.type === 'image';

    return {
      statNumber,
      statLabel: statLabelField?.value || 'Happy Customers',
      statDescription: statDescField?.value || 'Explore more. Play better.',
      heading: headingField?.value || 'Crafted for Performance',
      description: descField?.value || '',
      media: media || null,
      video: isVideo ? media : null,
      image: isImage ? media : null,
      buttonText: buttonTextField?.value || 'Explore Our Gear',
    };
  } catch (error) {
    console.error('Error fetching Homepage Feature Section metaobject:', error);
    throw error;
  }
}

