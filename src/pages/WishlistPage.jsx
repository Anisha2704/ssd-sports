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
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Heading & Wishlist Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#FF2E4D]">
              SAVED ITEMS
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black text-white uppercase tracking-wider mt-1">
              My Wishlist
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Items saved in your browser wishlist. Access them anytime on this device.
            </p>
          </div>

          {wishlistCount > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-full">
                {wishlistCount} {wishlistCount === 1 ? 'Saved Item' : 'Saved Items'}
              </span>
              <button
                onClick={clearWishlist}
                className="text-xs font-bold text-slate-400 hover:text-[#FF2E4D] transition-colors flex items-center gap-1 cursor-pointer"
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
            <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 text-slate-400 mx-auto flex items-center justify-center">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-black text-white uppercase tracking-wider">Your Wishlist is Empty</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Save items while browsing our equipment catalog to easily find them later.
              </p>
            </div>

            <div>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF2E4D] hover:bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Explore Catalog</span>
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

