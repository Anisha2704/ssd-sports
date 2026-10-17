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
      sortKey = searchQuery?.trim() ? 'RELEVANCE' : 'BEST_SELLING';
      reverse = false;
      break;
  }

  const trimmed = searchQuery?.trim();
  const queryParam = trimmed ? `(title:*${trimmed}* OR ${trimmed}*)` : null;

  const data = await shopifyFetch({
    query: GET_PRODUCTS_PAGINATED_QUERY,
    variables: {
      first,
      after,
      sortKey,
      reverse,
      query: queryParam,
    },
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo || { hasNextPage: false, endCursor: null };

  return {
    products,
    pageInfo,
  };
}

/**
 * Fast search helper for instant live search dropdown in header
 * 
 * @param {Object} options
 * @param {string} options.query - Search term
 * @param {number} [options.first=6] - Max results
 * @returns {Promise<Array>} Matching products
 */
export async function searchProducts({ query = '', first = 6 } = {}) {
  const trimmed = query?.trim();
  if (!trimmed) return [];

  const queryParam = `(title:*${trimmed}* OR ${trimmed}*)`;

  try {
    const data = await shopifyFetch({
      query: GET_PRODUCTS_PAGINATED_QUERY,
      variables: {
        first,
        after: null,
        sortKey: 'RELEVANCE',
        reverse: false,
        query: queryParam,
      },
    });

    return data?.products?.nodes || [];
  } catch (err) {
    console.error('Error during searchProducts:', err);
    return [];
  }
}
