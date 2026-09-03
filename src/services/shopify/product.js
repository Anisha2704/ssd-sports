import { shopifyFetch } from './client.js';
import {
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_RELATED_PRODUCTS_QUERY,
} from './queries/product.js';

/**
 * Fetch a single product by handle from Shopify Storefront API
 * 
 * @param {string} handle - Product handle string
 * @returns {Promise<Object|null>} Product object or null
 */
export async function getProductByHandle(handle) {
  if (!handle) return null;

  const data = await shopifyFetch({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  return data?.product || null;
}

/**
 * Fetch related products from Shopify Storefront API
 * 
 * @param {Object} options
 * @param {string} [options.handle] - Current product handle to exclude
 * @param {string} [options.collectionHandle] - Collection handle to filter by
 * @param {number} [options.first=4] - Number of products
 * @returns {Promise<Array>} List of related product objects
 */
export async function getRelatedProducts({ handle, collectionHandle, first = 4 } = {}) {
  let query = null;
  if (collectionHandle) {
    query = `collection:${collectionHandle}`;
  }

  const data = await shopifyFetch({
    query: GET_RELATED_PRODUCTS_QUERY,
    variables: {
      first: first + 2, // Fetch a couple extra to account for filtering current product
      query,
    },
  });

  const rawProducts = data?.products?.nodes || [];
  
  // Filter out the current product by handle
  const filtered = rawProducts.filter((p) => p.handle !== handle);

  return filtered.slice(0, first);
}
