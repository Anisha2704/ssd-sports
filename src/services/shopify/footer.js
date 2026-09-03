/**
 * Service to fetch Footer Metaobject from Shopify Storefront API.
 */

import { shopifyFetch } from './client.js';
import { GET_FOOTER_SETTINGS_QUERY } from './queries/footer.js';

/**
 * Helper to match and extract field value from metaobject fields array
 * @param {Array} fields 
 * @param {Array<string>} targetKeys 
 * @returns {string|null}
 */
function getFieldValue(fields, targetKeys) {
  if (!Array.isArray(fields)) return null;

  for (const targetKey of targetKeys) {
    const targetClean = targetKey.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundField = fields.find((f) => {
      if (!f || !f.key) return false;
      const keyClean = f.key.toLowerCase().replace(/[^a-z0-9]/g, '');
      return keyClean === targetClean || keyClean.includes(targetClean);
    });

    if (foundField && foundField.value && typeof foundField.value === 'string') {
      const val = foundField.value.trim();
      if (val) return val;
    }
  }

  return null;
}

/**
 * Fetch and process Footer Metaobject
 * @returns {Promise<{
 *   address: string|null,
 *   phone: string|null,
 *   email: string|null,
 *   instagramUrl: string|null,
 *   facebookUrl: string|null,
 *   youtubeUrl: string|null
 * }>}
 */
export async function getFooterSettings() {
  try {
    const data = await shopifyFetch({
      query: GET_FOOTER_SETTINGS_QUERY,
    });

    // Check 'footer' type node first, then 'footer_settings' type node fallback
    const metaobjectNode =
      data?.footerMetaobjects?.nodes?.[0] ||
      data?.footerSettingsMetaobjects?.nodes?.[0];

    if (!metaobjectNode || !Array.isArray(metaobjectNode.fields)) {
      return {
        address: null,
        phone: null,
        email: null,
        instagramUrl: null,
        facebookUrl: null,
        youtubeUrl: null,
      };
    }

    const fields = metaobjectNode.fields;

    const address = getFieldValue(fields, ['address', 'store_address', 'contact_address', 'location']);
    const phone = getFieldValue(fields, ['phone', 'phone_number', 'contact_phone', 'mobile']);
    const email = getFieldValue(fields, ['email', 'email_address', 'contact_email']);
    const instagramUrl = getFieldValue(fields, ['instagram_url', 'instagram', 'instagram_link']);
    const facebookUrl = getFieldValue(fields, ['facebook_url', 'facebook', 'facebook_link']);
    const youtubeUrl = getFieldValue(fields, ['youtube_url', 'youtube', 'youtube_link']);

    return {
      address,
      phone,
      email,
      instagramUrl,
      facebookUrl,
      youtubeUrl,
    };
  } catch (error) {
    console.error('Error fetching Footer Settings metaobject:', error);
    throw error;
  }
}
