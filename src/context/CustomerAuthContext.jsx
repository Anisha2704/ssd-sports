import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  initiateCustomerLogin,
  handleCustomerAuthCallback,
  refreshCustomerToken,
  buildCustomerLogoutUrl,
  getCustomerSession,
  clearCustomerSession,
} from '../services/shopify/customerAuth.js';
import {
  fetchCustomerProfile,
  updateCustomerProfile,
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from '../services/shopify/customerApi.js';

const CustomerAuthContext = createContext({
  customer: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
  updateProfile: async () => {},
  addAddress: async () => {},
  editAddress: async () => {},
  removeAddress: async () => {},
  getValidAccessToken: async () => null,
});

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshingRef = useRef(false);

  /**
   * Returns a valid access token, auto-refreshing if close to expiration
   */
  const getValidAccessToken = useCallback(async () => {
    const currentSession = session || getCustomerSession();
    if (!currentSession?.access_token) return null;

    // Check if token expires within 2 minutes
    const now = Date.now();
    const expiresAt = currentSession.expires_at;
    const isExpiredOrClose = expiresAt && expiresAt - now < 120000;

    if (!isExpiredOrClose) {
      return currentSession.access_token;
    }

    if (!currentSession.refresh_token) {
      return currentSession.access_token;
    }

    if (refreshingRef.current) {
      // Avoid parallel refresh calls
      return currentSession.access_token;
    }

    try {
      refreshingRef.current = true;
      const newTokens = await refreshCustomerToken(currentSession.refresh_token);
      setSession(newTokens);
      return newTokens.access_token;
    } catch (err) {
      console.warn('Silent token refresh failed:', err);
      clearCustomerSession();
      setSession(null);
      setCustomer(null);
      return null;
    } finally {
      refreshingRef.current = false;
    }
  }, [session]);

  /**
   * Fetch latest customer profile using valid access token
   */
  const refreshProfile = useCallback(async () => {
    try {
      const token = await getValidAccessToken();
      if (!token) {
        setCustomer(null);
        return null;
      }
      const profile = await fetchCustomerProfile(token);
      setCustomer(profile);
      return profile;
    } catch (err) {
      console.error('Failed to load customer profile:', err);
      setError(err.message);
      return null;
    }
  }, [getValidAccessToken]);

  /**
   * Initialize authentication state on load
   */
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const stored = getCustomerSession();
        if (stored?.access_token) {
          setSession(stored);
          const token = stored.access_token;
          try {
            const profile = await fetchCustomerProfile(token);
            if (isMounted) setCustomer(profile);
          } catch (fetchErr) {
            // If token rejected, try refreshing
            if (stored.refresh_token) {
              try {
                const refreshed = await refreshCustomerToken(stored.refresh_token);
                if (isMounted) {
                  setSession(refreshed);
                  const profile = await fetchCustomerProfile(refreshed.access_token);
                  setCustomer(profile);
                }
              } catch (refreshErr) {
                clearCustomerSession();
                if (isMounted) {
                  setSession(null);
                  setCustomer(null);
                }
              }
            } else {
              clearCustomerSession();
              if (isMounted) {
                setSession(null);
                setCustomer(null);
              }
            }
          }
        }
      } catch (e) {
        console.error('Failed to initialize customer auth:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Initiate customer login flow
   */
  const login = useCallback(async (returnTo = '/account') => {
    setError(null);
    try {
      const authUrl = await initiateCustomerLogin({ returnTo });
      window.location.href = authUrl;
    } catch (err) {
      console.error('Login initiation failed:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Handle logout: clear local session and redirect through Shopify logout endpoint
   */
  const logout = useCallback(async () => {
    const idToken = session?.id_token || getCustomerSession()?.id_token;
    clearCustomerSession();
    setSession(null);
    setCustomer(null);

    try {
      const logoutUrl = await buildCustomerLogoutUrl(idToken);
      window.location.href = logoutUrl;
    } catch (err) {
      console.warn('Failed to construct Shopify logout URL, fallback to homepage:', err);
      window.location.href = '/';
    }
  }, [session]);

  /**
   * Update profile information
   */
  const updateProfile = useCallback(async (input) => {
    const token = await getValidAccessToken();
    if (!token) throw new Error('You must be logged in to update your profile.');
    await updateCustomerProfile(token, input);
    await refreshProfile();
  }, [getValidAccessToken, refreshProfile]);

  /**
   * Add new address
   */
  const addAddress = useCallback(async (address, isDefault = false) => {
    const token = await getValidAccessToken();
    if (!token) throw new Error('You must be logged in to add an address.');
    await createCustomerAddress(token, address, isDefault);
    await refreshProfile();
  }, [getValidAccessToken, refreshProfile]);

  /**
   * Update address
   */
  const editAddress = useCallback(async (addressId, address, isDefault = false) => {
    const token = await getValidAccessToken();
    if (!token) throw new Error('You must be logged in to update an address.');
    await updateCustomerAddress(token, addressId, address, isDefault);
    await refreshProfile();
  }, [getValidAccessToken, refreshProfile]);

  /**
   * Remove address
   */
  const removeAddress = useCallback(async (addressId) => {
    const token = await getValidAccessToken();
    if (!token) throw new Error('You must be logged in to remove an address.');
    await deleteCustomerAddress(token, addressId);
    await refreshProfile();
  }, [getValidAccessToken, refreshProfile]);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated: Boolean(customer && session?.access_token),
        session,
        loading,
        error,
        login,
        logout,
        refreshProfile,
        updateProfile,
        addAddress,
        editAddress,
        removeAddress,
        getValidAccessToken,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}

