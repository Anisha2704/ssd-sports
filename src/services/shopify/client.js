/**
 * Custom fetch utility for communicating with the Shopify Storefront API.
 */

import {
  SHOPIFY_API_VERSION,
  getRawShopifyDomain,
  getShopifyStorefrontToken,
} from './config.js';

/**
 * Clean and normalize the domain string
 */
export const getShopifyDomain = () => {
  const rawDomain = getRawShopifyDomain();
  if (!rawDomain) return '';
  return rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

/**
 * Check if the Shopify credentials are set in environment variables
 */
export const isShopifyConfigured = () => {
  const domain = getShopifyDomain();
  const token = getShopifyStorefrontToken().trim();
  return Boolean(domain && token);
};

/**
 * Execute a GraphQL query against the Shopify Storefront API
 * 
 * @param {Object} options
 * @param {string} options.query - GraphQL query string
 * @param {Object} [options.variables] - GraphQL variables object
 * @returns {Promise<any>} Response data object
 */
export async function shopifyFetch({ query, variables = {} }) {
  if (!isShopifyConfigured()) {
    throw new Error(
      'SHOPIFY_CREDENTIALS_MISSING: VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN must be configured in your .env file.'
    );
  }

  const domain = getShopifyDomain();
  const token = getShopifyStorefrontToken().trim();
  const endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Shopify Storefront API HTTP Error (${response.status} ${response.statusText}): ${errorText}`
      );
    }

    const json = await response.json();

    if (json.errors && json.errors.length > 0) {
      const messages = json.errors.map((e) => e.message).join(' | ');
      throw new Error(`Shopify GraphQL Error: ${messages}`);
    }

    return json.data;
  } catch (error) {
    console.error('Shopify API Request Failed:', error);
    throw error;
  }
}
