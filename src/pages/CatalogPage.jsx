import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import ProductSkeleton from '../components/ProductSkeleton';
import CollectionFilter from '../components/CollectionFilter';
import SortDropdown from '../components/SortDropdown';
import FilterDrawer from '../components/FilterDrawer';
import { useCollections } from '../hooks/useCollections';
import { useCatalogProducts } from '../hooks/useCatalogProducts';

export default function CatalogPage() {
  const { collectionHandle: routeCollectionHandle } = useParams();
  const [searchParams] = useSearchParams();
  const queryCollectionHandle = searchParams.get('collection');
  const activeHandle = routeCollectionHandle || queryCollectionHandle || null;

  const [sortOption, setSortOption] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch dynamic collections from Shopify
  const { collections } = useCollections({ first: 25 });

  // Fetch catalog products from Shopify based on collection handle & sort option
  const {
    products,
    activeCollection,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  } = useCatalogProducts({
    collectionHandle: activeHandle,
    sortOption,
    first: 12,
  });

  const pageTitle = activeCollection ? activeCollection.title : 'Shop All Products';
  const pageDescription =
    activeCollection?.description ||
    'Explore our complete range of official SSD Sports equipment built for performance and durability.';

  return (
    <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
      {/* Header Navigation */}
      <Header />

      {/* Main Catalog Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Compact Breadcrumb & Page Banner */}
        <div className="space-y-3 border-b border-[#D8E8DD] pb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs font-semibold text-[#52645A] space-x-1.5">
            <Link to="/" className="hover:text-[#0B7A3B] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#7B8A82]" />
            <Link
              to="/catalog"
              className={!activeHandle ? 'text-[#0B7A3B] font-bold' : 'hover:text-[#0B7A3B] transition-colors'}
            >
              Catalog
            </Link>
            {activeCollection && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#7B8A82]" />
                <span className="text-[#0B7A3B] font-bold truncate max-w-[200px]">
                  {activeCollection.title}
                </span>
              </>
            )}
          </nav>

          {/* Page Heading & Description */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#0B7A3B]">
                PRO EQUIPMENT CATALOG
              </span>
              <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#10231A] uppercase tracking-wider">
                {pageTitle}
              </h1>
              <p className="text-[#52645A] text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-medium">
                {pageDescription}
              </p>
            </div>
            
            {/* Dynamic Product Count */}
            {!loading && !error && (
              <span className="text-xs font-mono font-bold text-[#10231A] bg-[#F5FAF6] border border-[#D8E8DD] px-3.5 py-1.5 rounded-full shrink-0">
                {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
              </span>
            )}
          </div>
        </div>

        {/* Filter Bar & Sort Controls Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D8E8DD]">
          
          {/* Desktop Collections Filter Pills */}
          <div className="hidden md:block flex-1 max-w-3xl">
            <CollectionFilter collections={collections} activeHandle={activeHandle} />
          </div>

          {/* Mobile Filter & Sort Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center justify-between w-full py-2.5 px-4 bg-[#F5FAF6] border border-[#D8E8DD] rounded-xl text-[#10231A] text-xs font-bold shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B7A3B]" />
              <span>Filter &amp; Sort</span>
            </div>
            <span className="text-[11px] font-mono text-[#7B8A82]">
              {activeHandle ? activeCollection?.title || 'Collection' : 'All'}
            </span>
          </button>

          {/* Desktop Sort Dropdown */}
          <div className="hidden sm:flex items-center justify-end">
            <SortDropdown value={sortOption} onChange={(val) => setSortOption(val)} />
          </div>

        </div>

        {/* Main Product Grid Body */}
        {loading ? (
          <ProductSkeleton count={12} />
        ) : error ? (
          /* Error State */
          <div className="text-center py-16 bg-[#F5FAF6] border border-[#D8E8DD] rounded-2xl p-8 space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#EAF7EE] text-[#0B7A3B] border border-[#D8E8DD] mx-auto flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#10231A]">Unable to load products</h3>
            <p className="text-[#52645A] text-xs">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-2.5 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty Collection State */
          <div className="text-center py-16 bg-[#F5FAF6] border border-[#D8E8DD] rounded-2xl p-8 space-y-4 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#10231A]">No products found</h3>
            <p className="text-[#52645A] text-xs">
              No equipment found in the "{pageTitle}" collection at this moment.
            </p>
            {activeHandle && (
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>View All Products</span>
              </Link>
            )}
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Load More Pagination Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white border border-[#D8E8DD] hover:border-[#0B7A3B] text-[#10231A] hover:bg-[#0B7A3B] hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {loadingMore ? 'Loading More Products...' : 'Load More Products'}
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Mobile Filter & Sort Drawer */}
      <FilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        collections={collections}
        activeHandle={activeHandle}
        sortOption={sortOption}
        onSortChange={(opt) => setSortOption(opt)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

