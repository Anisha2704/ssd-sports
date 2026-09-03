import { shopifyFetch } from './client.js';
import { GET_PRODUCTS_QUERY, GET_PRODUCTS_PAGINATED_QUERY } from './queries/products.js';

/**
 * Fetch a list of products from Shopify Storefront API
 * 
 * @param {Object} options
 * @param {number} [options.first=10] - Number of products to fetch
 * @returns {Promise<Array>} List of product objects
 */
export async function getProducts({ first = 10 } = {}) {
  const data = await shopifyFetch({
    query: GET_PRODUCTS_QUERY,
    variables: { first },
  });

  return data?.products?.nodes || [];
}

/**
 * Fetch paginated products with sorting & filtering from Shopify Storefront API
 * 
 * @param {Object} options
 * @param {number} [options.first=12]
 * @param {string} [options.after=null]
 * @param {string} [options.sortOption='featured']
 * @param {string} [options.searchQuery='']
 * @returns {Promise<Object>} { products, pageInfo }
 */
export async function getPaginatedProducts({ first = 12, after = null, sortOption = 'featured', searchQuery = '' } = {}) {
  let sortKey = 'TITLE';
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
      sortKey = 'CREATED_AT';
      reverse = true;
      break;
    case 'title-asc':
      sortKey = 'TITLE';
      reverse = false;
      break;
    case 'featured':
    default:
      sortKey = 'BEST_SELLING';
      reverse = false;
      break;
  }

  const data = await shopifyFetch({
    query: GET_PRODUCTS_PAGINATED_QUERY,
    variables: {
      first,
      after,
      sortKey,
      reverse,
      query: searchQuery ? `title:*${searchQuery}*` : null,
    },
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo || { hasNextPage: false, endCursor: null };

  return {
    products,
    pageInfo,
  };
}
