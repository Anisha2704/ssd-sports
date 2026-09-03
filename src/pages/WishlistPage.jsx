import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Heading & Wishlist Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Items saved in your browser wishlist. Access them anytime on this device.
            </p>
          </div>

          {wishlistCount > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {wishlistCount} {wishlistCount === 1 ? 'Saved Item' : 'Saved Items'}
              </span>
              <button
                onClick={clearWishlist}
                className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1"
                title="Clear all saved wishlist items"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        {wishlistCount === 0 ? (
          /* Empty State */
          <div className="text-center py-16 space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 text-slate-400 mx-auto flex items-center justify-center">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Your Wishlist is Empty</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Save items while browsing our equipment catalog to easily find them later.
              </p>
            </div>

            <div>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore Equipment Catalog</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
