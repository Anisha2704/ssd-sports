import { shopifyFetch } from './client.js';
import { GET_COLLECTIONS_QUERY, GET_COLLECTION_PRODUCTS_QUERY } from './queries/collections.js';

/**
 * Fetch all Shopify collections dynamically
 * 
 * @param {Object} options
 * @param {number} [options.first=25]
 * @returns {Promise<Array>} List of collection nodes
 */
export async function getCollections({ first = 25 } = {}) {
  const data = await shopifyFetch({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
  });

  return data?.collections?.nodes || [];
}

/**
 * Fetch products inside a specific Shopify collection by handle
 * 
 * @param {Object} options
 * @param {string} options.handle - Shopify collection handle
 * @param {number} [options.first=12]
 * @param {string} [options.after=null] - Cursor for pagination
 * @param {string} [options.sortOption='featured'] - Sort option key
 * @returns {Promise<Object>} { collection, products, pageInfo }
 */
export async function getCollectionByHandle({ handle, first = 12, after = null, sortOption = 'featured' } = {}) {
  let sortKey = 'COLLECTION_DEFAULT';
  let reverse = false;

  switch (sortOption) {
    case 'price-asc':
      sortKey = 'PRICE';
      reverse = false;
      break;
    case 'price-desc':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'newest':
      sortKey = 'CREATED';
      reverse = true;
      break;
    case 'title-asc':
      sortKey = 'TITLE';
      reverse = false;
      break;
    case 'featured':
    default:
      sortKey = 'COLLECTION_DEFAULT';
      reverse = false;
      break;
  }

  const data = await shopifyFetch({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first, after, sortKey, reverse },
  });

  const collection = data?.collection || null;
  const products = collection?.products?.nodes || [];
  const pageInfo = collection?.products?.pageInfo || { hasNextPage: false, endCursor: null };

  return {
    collection,
    products,
    pageInfo,
  };
}
