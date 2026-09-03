/**
 * Service to fetch Homepage Instagram Gallery Metaobject from Shopify Storefront API.
 */

import { shopifyFetch } from './client.js';
import { GET_INSTAGRAM_GALLERY_QUERY } from './queries/instagramGallery.js';

/**
 * Fetch and parse the Homepage Instagram Gallery metaobject
 * @returns {Promise<{images: Array, instagramUrl: string}|null>}
 */
export async function getInstagramGallery() {
  try {
    const data = await shopifyFetch({
      query: GET_INSTAGRAM_GALLERY_QUERY,
    });

    const metaobjectNode = data?.metaobjects?.nodes?.[0];

    if (!metaobjectNode || !Array.isArray(metaobjectNode.fields)) {
      return null;
    }

    const fields = metaobjectNode.fields;

    const findField = (key) => fields.find((f) => f.key.toLowerCase() === key.toLowerCase());

    const imagesField = findField('images');
    const urlField = findField('instagram_url');

    const images = [];

    if (imagesField) {
      if (imagesField.references && Array.isArray(imagesField.references.nodes)) {
        imagesField.references.nodes.forEach((ref) => {
          if (ref?.image?.url) {
            images.push({
              id: ref.id,
              url: ref.image.url,
              altText: ref.image.altText || 'SSD Sports Community Instagram',
              width: ref.image.width,
              height: ref.image.height,
            });
          } else if (ref?.url) {
            images.push({
              id: ref.id,
              url: ref.url,
              altText: 'SSD Sports Community Instagram',
            });
          }
        });
      } else if (imagesField.reference) {
        const ref = imagesField.reference;
        if (ref?.image?.url) {
          images.push({
            id: ref.id,
            url: ref.image.url,
            altText: ref.image.altText || 'SSD Sports Community Instagram',
            width: ref.image.width,
            height: ref.image.height,
          });
        }
      }
    }

    const instagramUrl = urlField?.value || 'https://www.instagram.com/';

    return {
      images,
      instagramUrl,
    };
  } catch (error) {
    console.error('Error fetching Homepage Instagram Gallery metaobject:', error);
    throw error;
  }
}
