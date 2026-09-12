import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatters';

export default function ProductModal({ product, onClose }) {
  const variantList = product?.variants?.nodes || [];
  const [selectedVariant, setSelectedVariant] = useState(variantList[0] || null);

  // Close modal on escape key press
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const {
    title,
    handle,
    description,
    featuredImage,
    priceRange,
    compareAtPriceRange,
  } = product;

  const activePrice = selectedVariant?.price?.amount || priceRange?.minVariantPrice?.amount;
  const currencyCode = selectedVariant?.price?.currencyCode || priceRange?.minVariantPrice?.currencyCode || 'INR';

  const compareAtPrice = selectedVariant?.compareAtPrice?.amount || compareAtPriceRange?.minVariantPrice?.amount;
  const hasCompareAt = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(activePrice || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Modal Card */}
      <div
        className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 text-slate-100 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-red-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700 hover:border-red-500"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 bg-slate-950 relative min-h-[300px] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-800">
          {featuredImage?.url ? (
            <img
              src={featuredImage.url}
              alt={featuredImage.altText || title}
              className="max-h-[360px] w-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-slate-600 text-xs font-mono">No Image Available</div>
          )}
          {selectedVariant && (
            <span
              className={`absolute top-4 left-4 text-[10px] uppercase tracking-wider font-mono font-semibold px-2.5 py-1 rounded-full ${
                selectedVariant.availableForSale
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-red-950 text-red-400 border border-red-800'
              }`}
            >
              {selectedVariant.availableForSale ? 'Available in Stock' : 'Currently Unavailable'}
            </span>
          )}
        </div>

        {/* Details Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Shopify Handle: <code className="text-red-400">{handle}</code>
              </span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-snug">
                {title}
              </h2>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">
                {formatPrice(activePrice, currencyCode)}
              </span>
              {hasCompareAt && (
                <span className="text-sm text-slate-500 line-through">
                  {formatPrice(compareAtPrice, currencyCode)}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Product Details</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {description}
                </p>
              </div>
            )}

            {/* Variants Selector */}
            {variantList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Select Variant Option ({variantList.length})
                </span>
                <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                  {variantList.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-red-950/60 border-red-600 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate max-w-[180px]">{v.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span>{formatPrice(v.price?.amount, v.price?.currencyCode)}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              v.availableForSale
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-red-950 text-red-400'
                            }`}
                          >
                            {v.availableForSale ? 'In Stock' : 'Sold Out'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              Close Quick View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
