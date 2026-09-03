/**
 * Centralized Shopify Storefront API Configuration
 */

export const SHOPIFY_API_VERSION = '2026-07';

export const getEnv = (key) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env?.[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // Ignore error in non-Vite environments
  }
  try {
    if (typeof process !== 'undefined' && process?.env?.[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore error
  }
  return '';
};

export const getRawShopifyDomain = () => getEnv('VITE_SHOPIFY_STORE_DOMAIN');
export const getShopifyStorefrontToken = () => getEnv('VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN');

export const RAW_SHOPIFY_DOMAIN = getRawShopifyDomain();
export const SHOPIFY_STOREFRONT_ACCESS_TOKEN = getShopifyStorefrontToken();
