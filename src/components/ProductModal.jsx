import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/formatters';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const {
    title,
    handle,
    description,
    featuredImage,
    priceRange,
    compareAtPriceRange,
    variants,
  } = product;

  const variantList = variants?.nodes || [];
  const [selectedVariant, setSelectedVariant] = useState(variantList[0] || null);

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const activePrice = selectedVariant?.price?.amount || priceRange?.minVariantPrice?.amount;
  const currencyCode = selectedVariant?.price?.currencyCode || priceRange?.minVariantPrice?.currencyCode || 'INR';

  const compareAtPrice = selectedVariant?.compareAtPrice?.amount || compareAtPriceRange?.minVariantPrice?.amount;
  const hasCompareAt = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(activePrice || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Modal Card */}
      <div
        className="relative bg-white border border-[#D8E8DD] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 text-[#10231A] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-[#0B7A3B] text-slate-500 hover:text-white flex items-center justify-center transition-colors border border-slate-200"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Image Column */}
        <div className="md:w-1/2 bg-[#F5FAF6] relative min-h-[300px] flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#D8E8DD]">
          {featuredImage?.url ? (
            <img
              src={featuredImage.url}
              alt={featuredImage.altText || title}
              className="max-h-[360px] w-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-[#7B8A82] text-xs font-mono">No Image Available</div>
          )}
          {selectedVariant && (
            <span
              className={`absolute top-4 left-4 text-[10px] uppercase tracking-wider font-mono font-semibold px-2.5 py-1 rounded-full ${
                selectedVariant.availableForSale
                  ? 'bg-[#EAF7EE] text-[#0B7A3B] border border-[#0B7A3B]/30'
                  : 'bg-red-50 text-red-700 border border-red-200'
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
              <span className="text-[11px] font-mono text-[#7B8A82] uppercase tracking-widest">
                Shopify Handle: <code className="text-[#0B7A3B] font-bold">{handle}</code>
              </span>
              <h2 className="text-2xl font-black text-[#10231A] uppercase tracking-tight leading-snug">
                {title}
              </h2>
            </div>

            {/* Price Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#0B7A3B] tracking-tight">
                {formatPrice(activePrice, currencyCode)}
              </span>
              {hasCompareAt && (
                <span className="text-sm text-[#7B8A82] line-through">
                  {formatPrice(compareAtPrice, currencyCode)}
                </span>
              )}
            </div>

            {/* Description */}
            {description && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-[#7B8A82] uppercase tracking-wider">Product Details</span>
                <p className="text-xs text-[#52645A] leading-relaxed bg-[#F5FAF6] p-3 rounded-lg border border-[#D8E8DD]">
                  {description}
                </p>
              </div>
            )}

            {/* Variants Selector */}
            {variantList.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#10231A] uppercase tracking-wider block">
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
                            ? 'bg-[#EAF7EE] border-[#0B7A3B] text-[#0B7A3B] font-semibold'
                            : 'bg-white border-[#D8E8DD] text-[#52645A] hover:border-[#0B7A3B]/40'
                        }`}
                      >
                        <span className="truncate max-w-[180px]">{v.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span>{formatPrice(v.price?.amount, v.price?.currencyCode)}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              v.availableForSale
                                ? 'bg-[#EAF7EE] text-[#0B7A3B]'
                                : 'bg-red-50 text-red-600'
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

          <div className="pt-4 border-t border-[#D8E8DD] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#0B7A3B] hover:bg-[#075E2D] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md shadow-[#0B7A3B]/20"
            >
              Close Quick View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
