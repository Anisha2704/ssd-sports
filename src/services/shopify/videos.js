/**
 * Service to fetch Homepage Video Section Metaobjects from Shopify Storefront API.
 */

import { shopifyFetch } from './client.js';
import { GET_HOMEPAGE_VIDEOS_QUERY } from './queries/videos.js';

/**
 * Fetch and parse Homepage Video Section metaobjects
 * @returns {Promise<Array<{id: string, handle: string, primaryUrl: string, sources: Array, altText: string}>>}
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
      let sources = [];
      let altText = 'SSD Sports Video';

      if (videoField.reference) {
        const ref = videoField.reference;

        if (Array.isArray(ref.sources) && ref.sources.length > 0) {
          sources = ref.sources;
          // Filter for mp4 sources first
          const mp4Sources = sources.filter(
            (s) => s.mimeType === 'video/mp4' || s.format === 'mp4'
          );

          if (mp4Sources.length > 0) {
            // Pick highest quality mp4 or first mp4
            primaryUrl = mp4Sources[0].url;
          } else {
            primaryUrl = sources[0].url;
          }

          if (ref.alt) {
            altText = ref.alt;
          }
        } else if (ref.url) {
          primaryUrl = ref.url;
        }
      } else if (videoField.value && typeof videoField.value === 'string' && videoField.value.startsWith('http')) {
        primaryUrl = videoField.value;
      }

      if (primaryUrl) {
        videos.push({
          id: node.id || node.handle,
          handle: node.handle,
          primaryUrl,
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
