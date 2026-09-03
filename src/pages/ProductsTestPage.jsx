import React from 'react';
import Navbar from '../components/Navbar';
import CredentialsNotice from '../components/CredentialsNotice';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';
import ProductCardTest from '../components/ProductCardTest';
import { useProducts } from '../hooks/useProducts';
import { SHOPIFY_API_VERSION } from '../services/shopify';

export default function ProductsTestPage() {
  const { products, loading, error, isConfigured, refetch } = useProducts({ first: 12 });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/80 px-2.5 py-1 rounded-full">
              <span>GraphQL Storefront API Testbed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              SSD Sports Shopify Integration Test Page
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              This temporary test page communicates directly with the Shopify Storefront API to verify product queries, prices, images, and variant availability in real-time.
            </p>
          </div>

          {isConfigured && (
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={refetch}
                disabled={loading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </button>
            </div>
          )}
        </section>

        {/* Content Body */}
        {!isConfigured ? (
          <CredentialsNotice />
        ) : loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorAlert message={error} onRetry={refetch} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center text-xl font-bold">
              0
            </div>
            <h3 className="text-lg font-bold text-slate-200">No Products Returned from Shopify</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Your Shopify Storefront API connected successfully, but no products were returned. Make sure your products are published to the <strong className="text-slate-200">Headless / Storefront API sales channel</strong> in your Shopify Admin.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-3">
              <span>Fetched <strong className="text-emerald-400">{products.length}</strong> products from Shopify API</span>
              <span>API Version: {SHOPIFY_API_VERSION}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCardTest key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-xs">
        SSD Sports Headless Front-End &bull; Connected via Shopify Storefront API
      </footer>
    </div>
  );
}
