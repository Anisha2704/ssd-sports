/**
 * Service to fetch Homepage Feature Section Metaobject from Shopify Storefront API.
 */

import { shopifyFetch } from './client.js';
import { GET_HOMEPAGE_FEATURE_QUERY } from './queries/homepageFeature.js';

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
    let sources = [];

    if (videoField?.reference) {
      const ref = videoField.reference;
      if (Array.isArray(ref.sources) && ref.sources.length > 0) {
        sources = ref.sources;
        const mp4Sources = sources.filter(
          (s) => s.mimeType === 'video/mp4' || s.format === 'mp4'
        );
        if (mp4Sources.length > 0) {
          primaryUrl = mp4Sources[0].url;
        } else {
          primaryUrl = sources[0].url;
        }
      } else if (ref.url) {
        primaryUrl = ref.url;
      }
    } else if (videoField?.value && typeof videoField.value === 'string' && videoField.value.startsWith('http')) {
      primaryUrl = videoField.value;
    }

    return {
      statNumber,
      statLabel: statLabelField?.value || 'Happy Customers',
      statDescription: statDescField?.value || 'Explore more. Play better.',
      heading: headingField?.value || 'Crafted for Performance',
      description: descField?.value || '',
      video: primaryUrl ? { primaryUrl, sources } : null,
      buttonText: buttonTextField?.value || 'Explore Our Gear',
    };
  } catch (error) {
    console.error('Error fetching Homepage Feature Section metaobject:', error);
    throw error;
  }
}
