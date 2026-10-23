/**
 * Service to fetch Homepage Feature Section Metaobject from Shopify Storefront API.
 */

import { shopifyFetch } from './client.js';
import { GET_HOMEPAGE_FEATURE_QUERY } from './queries/homepageFeature.js';
import { normalizeShopifyMediaUrl } from './videos.js';

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
    const videoField = findField('video');
    const buttonTextField = findField('button_text');

    // Parse stat_number
    let statNumber = 1000;
    if (statNumberField?.value) {
      const parsed = parseInt(statNumberField.value, 10);
      if (!isNaN(parsed)) {
        statNumber = parsed;
      }
    }

    // Parse video
    let primaryUrl = null;
    let posterUrl = null;
    let sources = [];
    let altText = 'SSD Sports Performance';

    if (videoField?.reference) {
      const ref = videoField.reference;

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

        // Combine with MP4s first so browser plays MP4 directly
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
    } else if (videoField?.value && typeof videoField.value === 'string' && videoField.value.startsWith('http')) {
      primaryUrl = normalizeShopifyMediaUrl(videoField.value);
    }

    return {
      statNumber,
      statLabel: statLabelField?.value || 'Happy Customers',
      statDescription: statDescField?.value || 'Explore more. Play better.',
      heading: headingField?.value || 'Crafted for Performance',
      description: descField?.value || '',
      video: primaryUrl ? { primaryUrl, posterUrl, sources, altText } : null,
      buttonText: buttonTextField?.value || 'Explore Our Gear',
    };
  } catch (error) {
    console.error('Error fetching Homepage Feature Section metaobject:', error);
    throw error;
  }
}
