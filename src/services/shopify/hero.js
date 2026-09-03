/**
 * Service to fetch Homepage Hero Section Metaobject from Shopify Storefront API.
 */

import { shopifyFetch } from './client.js';
import { GET_HOMEPAGE_HERO_QUERY } from './queries/hero.js';

/**
 * Extract image details from a Storefront API reference object
 * @param {Object} ref
 * @returns {Object|null}
 */
function extractImageFromReference(ref) {
  if (!ref) return null;
  if (ref.image && ref.image.url) {
    return {
      url: ref.image.url,
      altText: ref.image.altText || 'SSD Sports Hero Image',
      width: ref.image.width,
      height: ref.image.height,
    };
  }
  if (ref.url) {
    return {
      url: ref.url,
      altText: 'SSD Sports Hero Image',
    };
  }
  return null;
}

/**
 * Fetch and process the Homepage Hero Section Metaobject
 * @returns {Promise<{logo: Object|null, desktopImages: Array, mobileImages: Array}>}
 */
export async function getHomepageHero() {
  try {
    const data = await shopifyFetch({
      query: GET_HOMEPAGE_HERO_QUERY,
    });

    const metaobjectNode = data?.metaobjects?.nodes?.[0];

    if (!metaobjectNode || !Array.isArray(metaobjectNode.fields)) {
      return {
        logo: null,
        desktopImages: [],
        mobileImages: [],
      };
    }

    const fields = metaobjectNode.fields;

    // Locate field for Logo (e.g. key 'logo')
    const logoField = fields.find(
      (f) => f.key.toLowerCase() === 'logo' || f.key.toLowerCase().includes('logo')
    );

    let logo = null;
    if (logoField) {
      if (logoField.reference) {
        logo = extractImageFromReference(logoField.reference);
      } else if (logoField.value && typeof logoField.value === 'string' && logoField.value.startsWith('http')) {
        logo = { url: logoField.value, altText: 'SSD Sports Logo' };
      }
    }

    // Locate field for Desktop Images (e.g. key 'desktop_image' or 'desktop_images' or containing 'desktop')
    const desktopField = fields.find((f) => {
      const k = f.key.toLowerCase();
      return k === 'desktop_image' || k === 'desktop_images' || k.includes('desktop');
    });

    const desktopImages = [];
    if (desktopField) {
      if (desktopField.references && Array.isArray(desktopField.references.nodes)) {
        desktopField.references.nodes.forEach((ref) => {
          const img = extractImageFromReference(ref);
          if (img) desktopImages.push(img);
        });
      } else if (desktopField.reference) {
        const img = extractImageFromReference(desktopField.reference);
        if (img) desktopImages.push(img);
      }
    }

    // Locate field for Mobile Images (e.g. key 'mobile_image' or 'mobile_images' or containing 'mobile')
    const mobileField = fields.find((f) => {
      const k = f.key.toLowerCase();
      return k === 'mobile_image' || k === 'mobile_images' || k.includes('mobile');
    });

    const mobileImages = [];
    if (mobileField) {
      if (mobileField.references && Array.isArray(mobileField.references.nodes)) {
        mobileField.references.nodes.forEach((ref) => {
          const img = extractImageFromReference(ref);
          if (img) mobileImages.push(img);
        });
      } else if (mobileField.reference) {
        const img = extractImageFromReference(mobileField.reference);
        if (img) mobileImages.push(img);
      }
    }

    return {
      logo,
      desktopImages,
      mobileImages,
    };
  } catch (error) {
    console.error('Error fetching Homepage Hero Section metaobject:', error);
    throw error;
  }
}
