import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import BulkOrderPage from './pages/BulkOrderPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AccountPage from './pages/AccountPage';
import AccountAuthorizePage from './pages/AccountAuthorizePage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { getShopifyDomain } from './services/shopify';

function ShopifyCheckoutRedirect() {
  useEffect(() => {
    const shopifyDomain = getShopifyDomain() || 'ssdsports.myshopify.com';
    const currentUrl = new URL(window.location.href);
    currentUrl.hostname = shopifyDomain;
    currentUrl.protocol = 'https:';
    currentUrl.searchParams.set('_fd', '0');
    window.location.replace(currentUrl.toString());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-[#10231A]">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#0B7A3B]">
        Redirecting to secure Shopify checkout...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <CustomerAuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="catalog/:collectionHandle" element={<CatalogPage />} />
                <Route path="products/:handle" element={<ProductDetailsPage />} />
                <Route path="bulk-order" element={<BulkOrderPage />} />
                <Route path="track-order" element={<TrackOrderPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="account/login" element={<AccountPage />} />
                <Route path="account/authorize" element={<AccountAuthorizePage />} />
                <Route path="account/orders" element={<AccountPage />} />
                <Route path="account/profile" element={<AccountPage />} />
                <Route path="account/addresses" element={<AccountPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="cart/c/*" element={<ShopifyCheckoutRedirect />} />
                <Route path="checkouts/*" element={<ShopifyCheckoutRedirect />} />
                <Route path="*" element={<HomePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </CustomerAuthProvider>
  );
}
