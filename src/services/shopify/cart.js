import { shopifyFetch, getShopifyDomain } from './client.js';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  GET_CART_QUERY,
  UPDATE_CART_LINE_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from './queries/cart.js';

/**
 * Formats a Shopify checkout URL so that it points directly to the hosted
 * Shopify store domain (e.g. ssdsports.myshopify.com) with domain redirection
 * disabled (_fd=0). This prevents headless custom domains that point to Vercel
 * from intercepting the checkout route and redirecting users to the homepage.
 *
 * @param {string} [checkoutUrl]
 * @returns {string} Formatted checkout URL
 */
export function formatCheckoutUrl(checkoutUrl) {
  if (!checkoutUrl || typeof checkoutUrl !== 'string') return checkoutUrl;
  try {
    const shopifyDomain = getShopifyDomain();
    if (!shopifyDomain) return checkoutUrl;

    const url = new URL(checkoutUrl);
    url.hostname = shopifyDomain;
    url.protocol = 'https:';
    // _fd=0 disables Shopify primary_domain_redirection to the headless frontend domain
    url.searchParams.set('_fd', '0');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

/**
 * Normalizes cart object and ensures checkoutUrl points to the hosted Shopify checkout
 *
 * @param {Object|null} cart
 * @returns {Object|null}
 */
export function normalizeCart(cart) {
  if (!cart) return cart;
  if (cart.checkoutUrl) {
    return {
      ...cart,
      checkoutUrl: formatCheckoutUrl(cart.checkoutUrl),
    };
  }
  return cart;
}

/**
 * Create a new Shopify cart
 * 
 * @param {Array<{merchandiseId: string, quantity: number}>} [lines=[]]
 * @returns {Promise<Object>} Cart object
 */
export async function createCart(lines = []) {
  const data = await shopifyFetch({
    query: CREATE_CART_MUTATION,
    variables: { lines },
  });

  const cart = data?.cartCreate?.cart;
  const userErrors = data?.cartCreate?.userErrors;

  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(' | '));
  }

  return normalizeCart(cart);
}

/**
 * Add items to an existing Shopify cart
 * 
 * @param {string} cartId 
 * @param {Array<{merchandiseId: string, quantity: number}>} lines 
 * @returns {Promise<Object>} Cart object
 */
export async function addToCart(cartId, lines) {
  const data = await shopifyFetch({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
  });

  const cart = data?.cartLinesAdd?.cart;
  const userErrors = data?.cartLinesAdd?.userErrors;

  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(' | '));
  }

  return normalizeCart(cart);
}

/**
 * Fetch cart details by ID
 * 
 * @param {string} cartId 
 * @returns {Promise<Object|null>} Cart object or null
 */
export async function getCart(cartId) {
  if (!cartId) return null;

  try {
    const data = await shopifyFetch({
      query: GET_CART_QUERY,
      variables: { cartId },
    });

    return normalizeCart(data?.cart || null);
  } catch (err) {
    console.warn('Failed to fetch Shopify cart:', err);
    return null;
  }
}

/**
 * Update quantity of a line item in cart
 * 
 * @param {string} cartId 
 * @param {string} lineId 
 * @param {number} quantity 
 * @returns {Promise<Object>} Cart object
 */
export async function updateCartLine(cartId, lineId, quantity) {
  const data = await shopifyFetch({
    query: UPDATE_CART_LINE_MUTATION,
    variables: {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  });

  const cart = data?.cartLinesUpdate?.cart;
  const userErrors = data?.cartLinesUpdate?.userErrors;

  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(' | '));
  }

  return normalizeCart(cart);
}

/**
 * Remove line item from cart
 * 
 * @param {string} cartId 
 * @param {string} lineId 
 * @returns {Promise<Object>} Cart object
 */
export async function removeCartLine(cartId, lineId) {
  const data = await shopifyFetch({
    query: REMOVE_FROM_CART_MUTATION,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  });

  const cart = data?.cartLinesRemove?.cart;
  const userErrors = data?.cartLinesRemove?.userErrors;

  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(' | '));
  }

  return normalizeCart(cart);
}
