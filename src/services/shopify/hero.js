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

// Cache in-flight promise to deduplicate concurrent requests across components
let inFlightHeroPromise = null;

/**
 * Fetch and process the Homepage Hero Section Metaobject
 * @returns {Promise<{logo: Object|null, desktopImages: Array, tabletImages: Array, mobileImages: Array, textSlider: Array|null, isTextSliderList: boolean}>}
 */
export async function getHomepageHero() {
  if (inFlightHeroPromise) {
    return inFlightHeroPromise;
  }

  inFlightHeroPromise = (async () => {
    try {
      const data = await shopifyFetch({
        query: GET_HOMEPAGE_HERO_QUERY,
      });

      const metaobjectNode = data?.metaobjects?.nodes?.[0];

      if (!metaobjectNode || !Array.isArray(metaobjectNode.fields)) {
        return {
          logo: null,
          desktopImages: [],
          tabletImages: [],
          mobileImages: [],
          textSlider: null,
          isTextSliderList: false,
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

      // Locate field for Tablet Images (e.g. key 'tablet_image' or 'tablet_images' or containing 'tablet')
      const tabletField = fields.find((f) => {
        const k = f.key.toLowerCase();
        return k === 'tablet_image' || k === 'tablet_images' || k.includes('tablet');
      });

      const tabletImages = [];
      if (tabletField) {
        if (tabletField.references && Array.isArray(tabletField.references.nodes)) {
          tabletField.references.nodes.forEach((ref) => {
            const img = extractImageFromReference(ref);
            if (img) tabletImages.push(img);
          });
        } else if (tabletField.reference) {
          const img = extractImageFromReference(tabletField.reference);
          if (img) tabletImages.push(img);
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

      // Locate field for Text Slider (actual Shopify API handle: 'text_slider')
      const textSliderField = fields.find((f) => {
        const k = f.key?.toLowerCase();
        return k === 'text_slider' || k === 'text-slider' || k === 'textslider';
      });

      let textSlider = null;
      let isTextSliderList = false;

      if (textSliderField && textSliderField.value) {
        const rawVal = textSliderField.value;
        const fieldType = textSliderField.type || '';

        if (typeof rawVal === 'string') {
          const trimmed = rawVal.trim();
          // Check if field is a list type or JSON-formatted array
          if (fieldType.startsWith('list.') || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
              const parsed = JSON.parse(trimmed);
              if (Array.isArray(parsed)) {
                isTextSliderList = true;
                const items = parsed
                  .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
                  .filter(Boolean);
                if (items.length > 0) {
                  textSlider = items;
                }
              } else if (parsed) {
                const single = String(parsed).trim();
                if (single) {
                  textSlider = [single];
                  isTextSliderList = false;
                }
              }
            } catch {
              // Fallback: If not valid JSON, treat as single text value without splitting arbitrarily
              if (trimmed) {
                textSlider = [trimmed];
                isTextSliderList = false;
              }
            }
          } else {
            // Single text value (e.g. single_line_text_field, multi_line_text_field)
            // Do not split ordinary text arbitrarily
            if (trimmed) {
              textSlider = [trimmed];
              isTextSliderList = false;
            }
          }
        } else if (Array.isArray(rawVal)) {
          isTextSliderList = true;
          const items = rawVal
            .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
            .filter(Boolean);
          if (items.length > 0) {
            textSlider = items;
          }
        }
      }

      return {
        logo,
        desktopImages,
        tabletImages,
        mobileImages,
        textSlider,
        isTextSliderList,
      };
    } catch (error) {
      console.error('Error fetching Homepage Hero Section metaobject:', error);
      throw error;
    } finally {
      // Clear after brief window to deduplicate concurrent calls while allowing fresh data on subsequent navigation/reload
      setTimeout(() => {
        inFlightHeroPromise = null;
      }, 3000);
    }
  })();

  return inFlightHeroPromise;
}
