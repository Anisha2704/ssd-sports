import { getCustomerAccountClientId } from './config.js';
import {
  getCustomerAccountConfig,
  getRedirectUri,
  getLogoutRedirectUri,
} from './customerConfig.js';

const AUTH_STORAGE_KEY = 'ssd_customer_auth_state';
const SESSION_STORAGE_KEY = 'ssd_customer_session';

const getCrypto = () => {
  if (typeof window !== 'undefined' && window.crypto) return window.crypto;
  if (typeof globalThis !== 'undefined' && globalThis.crypto) return globalThis.crypto;
  throw new Error('Web Crypto API is not available');
};

/**
 * Base64URL encode a buffer or Uint8Array
 */
function base64UrlEncode(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generate a cryptographically secure random string
 */
export function generateRandomString(length = 43) {
  const array = new Uint8Array(length);
  getCrypto().getRandomValues(array);
  return base64UrlEncode(array).slice(0, length);
}

/**
 * Generate a PKCE Code Verifier (43-128 chars)
 */
export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  getCrypto().getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Generate a PKCE S256 Code Challenge from Code Verifier
 */
export async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await getCrypto().subtle.digest('SHA-256', data);
  return base64UrlEncode(digest);
}

/**
 * Store temporary OAuth state before redirecting to Shopify
 */
export function saveTemporaryAuthState(data) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.warn('SessionStorage unavailable, fallback to memory', e);
  }
}

/**
 * Retrieve temporary OAuth state
 */
export function getTemporaryAuthState() {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Clear temporary OAuth state
 */
export function clearTemporaryAuthState() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {}
}

/**
 * Store authenticated customer session (tokens)
 */
export function saveCustomerSession(tokens) {
  try {
    const sessionData = {
      ...tokens,
      saved_at: Date.now(),
      expires_at: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : null,
    };
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }
  } catch (e) {
    console.warn('Failed to save customer session to storage', e);
  }
}

/**
 * Retrieve authenticated customer session
 */
export function getCustomerSession() {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Clear authenticated customer session
 */
export function clearCustomerSession() {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {}
}

/**
 * Initialize login flow: generate PKCE & return Shopify OAuth authorization URL
 */
export async function initiateCustomerLogin({ returnTo = '/account' } = {}) {
  const clientId = getCustomerAccountClientId();
  if (!clientId) {
    throw new Error(
      'VITE_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID is missing in your environment variables.'
    );
  }

  const config = await getCustomerAccountConfig();
  const redirectUri = getRedirectUri();

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);
  const nonce = generateRandomString(32);

  // Persist PKCE verifier and state for verification in callback
  saveTemporaryAuthState({
    codeVerifier,
    state,
    nonce,
    returnTo,
    timestamp: Date.now(),
  });

  const url = new URL(config.authorizationEndpoint);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', config.scopes.join(' '));
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('code_challenge', codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');

  return url.toString();
}

/**
 * Handle OAuth callback: validate state, exchange authorization code for tokens
 */
export async function handleCustomerAuthCallback(urlSearchParams) {
  const code = urlSearchParams.get('code');
  const state = urlSearchParams.get('state');
  const error = urlSearchParams.get('error');
  const errorDescription = urlSearchParams.get('error_description');

  if (error) {
    throw new Error(`Shopify Authentication Error: ${errorDescription || error}`);
  }

  if (!code) {
    throw new Error('Authorization code missing from Shopify callback.');
  }

  const savedState = getTemporaryAuthState();
  if (!savedState || !savedState.state) {
    throw new Error('OAuth session expired or missing state. Please try logging in again.');
  }

  if (state !== savedState.state) {
    clearTemporaryAuthState();
    throw new Error('Invalid OAuth state detected (CSRF protection failure). Please log in again.');
  }

  const clientId = getCustomerAccountClientId();
  const config = await getCustomerAccountConfig();
  const redirectUri = getRedirectUri();

  // Exchange code using PKCE verifier
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
    code_verifier: savedState.codeVerifier,
  });

  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    clearTemporaryAuthState();
    throw new Error(`Token exchange failed (${response.status}): ${errorText}`);
  }

  const tokens = await response.json();
  clearTemporaryAuthState();
  saveCustomerSession(tokens);

  return {
    tokens,
    returnTo: savedState.returnTo || '/account',
  };
}

/**
 * Refresh access token using refresh_token
 */
export async function refreshCustomerToken(currentRefreshToken) {
  const clientId = getCustomerAccountClientId();
  const config = await getCustomerAccountConfig();

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: currentRefreshToken,
  });

  const response = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    clearCustomerSession();
    throw new Error('Session expired. Please log in again.');
  }

  const newTokens = await response.json();
  saveCustomerSession(newTokens);
  return newTokens;
}

/**
 * Build secure logout URL
 */
export async function buildCustomerLogoutUrl(idToken = '') {
  const config = await getCustomerAccountConfig();
  const postLogoutRedirectUri = getLogoutRedirectUri();

  const url = new URL(config.logoutEndpoint);
  if (idToken) {
    url.searchParams.set('id_token_hint', idToken);
  }
  url.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri);

  return url.toString();
}
