import { getCustomerAccountClientId } from './config.js';
import { getShopifyDomain } from './client.js';

export const SHOPIFY_SHOP_ID = '78434730208';
export const SHOPIFY_CUSTOMER_API_VERSION = '2026-10';

export const DEFAULT_CUSTOMER_ACCOUNT_CONFIG = {
  shopId: SHOPIFY_SHOP_ID,
  authorizationEndpoint: `https://shopify.com/authentication/${SHOPIFY_SHOP_ID}/oauth/authorize`,
  tokenEndpoint: `https://shopify.com/authentication/${SHOPIFY_SHOP_ID}/oauth/token`,
  logoutEndpoint: `https://shopify.com/authentication/${SHOPIFY_SHOP_ID}/logout`,
  graphqlEndpoint: `https://shopify.com/${SHOPIFY_SHOP_ID}/account/customer/api/${SHOPIFY_CUSTOMER_API_VERSION}/graphql`,
  scopes: ['openid', 'email', 'customer-account-api:full'],
};

/**
 * Dynamically resolves discovery endpoints with safe fallback
 */
let cachedConfig = null;

export async function getCustomerAccountConfig() {
  if (cachedConfig) return cachedConfig;

  const domain = getShopifyDomain() || 'ssdsports.myshopify.com';
  const clientId = getCustomerAccountClientId();

  try {
    const [oidcRes, apiRes] = await Promise.allSettled([
      fetch(`https://${domain}/.well-known/openid-configuration`),
      fetch(`https://${domain}/.well-known/customer-account-api`),
    ]);

    let authEndpoint = DEFAULT_CUSTOMER_ACCOUNT_CONFIG.authorizationEndpoint;
    let tokenEndpoint = DEFAULT_CUSTOMER_ACCOUNT_CONFIG.tokenEndpoint;
    let logoutEndpoint = DEFAULT_CUSTOMER_ACCOUNT_CONFIG.logoutEndpoint;
    let graphqlEndpoint = DEFAULT_CUSTOMER_ACCOUNT_CONFIG.graphqlEndpoint;

    if (oidcRes.status === 'fulfilled' && oidcRes.value.ok) {
      const oidcData = await oidcRes.value.json();
      if (oidcData.authorization_endpoint) authEndpoint = oidcData.authorization_endpoint;
      if (oidcData.token_endpoint) tokenEndpoint = oidcData.token_endpoint;
      if (oidcData.end_session_endpoint) logoutEndpoint = oidcData.end_session_endpoint;
    }

    if (apiRes.status === 'fulfilled' && apiRes.value.ok) {
      const apiData = await apiRes.value.json();
      if (apiData.graphql_api) graphqlEndpoint = apiData.graphql_api;
    }

    cachedConfig = {
      clientId,
      authorizationEndpoint: authEndpoint,
      tokenEndpoint,
      logoutEndpoint,
      graphqlEndpoint,
      scopes: DEFAULT_CUSTOMER_ACCOUNT_CONFIG.scopes,
    };
    return cachedConfig;
  } catch (err) {
    console.warn('Failed to fetch Shopify discovery config, using known defaults:', err);
    cachedConfig = {
      clientId,
      ...DEFAULT_CUSTOMER_ACCOUNT_CONFIG,
    };
    return cachedConfig;
  }
}

/**
 * Returns the registered OAuth redirect URI
 */
export function getRedirectUri() {
  if (typeof window === 'undefined') return 'https://www.ssdsports.in/account/authorize';

  // If running on production or preview domain
  const origin = window.location.origin;
  if (origin.includes('ssdsports.in')) {
    return 'https://www.ssdsports.in/account/authorize';
  }

  // When developing locally, we can use the origin's /account/authorize
  // Note: ensure this origin is also added in Shopify Headless settings if testing locally
  return `${origin}/account/authorize`;
}

/**
 * Returns the registered logout redirect URI
 */
export function getLogoutRedirectUri() {
  if (typeof window === 'undefined') return 'https://www.ssdsports.in';
  const origin = window.location.origin;
  if (origin.includes('ssdsports.in')) {
    return 'https://www.ssdsports.in';
  }
  return origin;
}
