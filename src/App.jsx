import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import BulkOrderPage from './pages/BulkOrderPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

export default function App() {
  return (
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
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}
