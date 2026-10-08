import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function formatINR(amount) {
  if (amount === undefined || amount === null || amount === '') return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    return `₹${num.toFixed(2)}`;
  }
}

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const lineItems = cart?.lines?.nodes || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount || 0;
  const checkoutUrl = cart?.checkoutUrl;

  return (
    <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:py-16 space-y-8">
        <div className="space-y-2 border-b border-[#D8E8DD] pb-6 text-center sm:text-left">
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#0B7A3B] bg-[#EAF7EE] border border-[#0B7A3B]/20 px-3 py-1 rounded-full">
            YOUR SELECTIONS
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#10231A] uppercase tracking-wider mt-1">
            Shopping Cart
          </h1>
          <p className="text-[#52645A] text-xs sm:text-sm">
            Review your selected cricket equipment before proceeding to direct Shopify checkout.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 space-y-4">
            <RefreshCw className="w-8 h-8 text-[#0B7A3B] animate-spin mx-auto" />
            <p className="text-[#7B8A82] text-xs">Syncing cart with Shopify...</p>
          </div>
        ) : lineItems.length === 0 ? (
          /* Empty Cart View */
          <div className="text-center space-y-6 py-16 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#EAF7EE] border border-[#D8E8DD] text-[#0B7A3B] mx-auto flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-black text-[#10231A] uppercase tracking-wider">Your Cart is Empty</h2>
              <p className="text-[#52645A] text-xs leading-relaxed">
                Add items from our live catalog to view price summaries and instant checkout options.
              </p>
            </div>

            <div>
              <Link
                to="/catalog"
                className="inline-block px-8 py-3.5 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0B7A3B]/20 hover:-translate-y-0.5"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Cart View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List (Span 8) */}
            <div className="lg:col-span-8 space-y-4">
              {lineItems.map((item) => {
                const variant = item.merchandise;
                const product = variant?.product;
                const image = variant?.image?.url || product?.featuredImage?.url;
                const lineTotal = item.cost?.totalAmount?.amount;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#D8E8DD] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-[#F5FAF6] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 border border-[#D8E8DD]">
                      {image ? (
                        <img
                          src={image}
                          alt={product?.title || 'Product'}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-[#7B8A82]" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <Link
                        to={product?.handle ? `/products/${product.handle}` : '/catalog'}
                        className="font-bold text-[#10231A] text-sm sm:text-base hover:text-[#0B7A3B] transition-colors line-clamp-1"
                      >
                        {product?.title || 'Product Item'}
                      </Link>
                      
                      {variant?.title && variant.title !== 'Default Title' && (
                        <p className="text-xs text-[#7B8A82]">{variant.title}</p>
                      )}

                      <p className="text-xs font-mono text-[#0B7A3B] font-bold pt-1">
                        {formatINR(variant?.price?.amount)}
                      </p>
                    </div>

                    {/* Quantity & Controls */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <div className="flex items-center bg-[#F5FAF6] border border-[#D8E8DD] rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded bg-white border border-[#D8E8DD] hover:bg-[#0B7A3B] hover:text-white text-[#10231A] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs font-mono text-[#10231A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded bg-white border border-[#D8E8DD] hover:bg-[#0B7A3B] hover:text-white text-[#10231A] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold font-mono text-sm text-[#0B7A3B] block">
                          {formatINR(lineTotal)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#7B8A82] hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary (Span 4) */}
            <div className="lg:col-span-4 bg-[#F5FAF6] border border-[#D8E8DD] rounded-2xl p-6 space-y-6 sticky top-24 shadow-lg">
              <h3 className="font-heading text-lg font-black text-[#10231A] uppercase tracking-wider border-b border-[#D8E8DD] pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#52645A]">
                  <span>Subtotal</span>
                  <span className="font-bold font-mono text-[#10231A]">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7B8A82]">
                  <span>Taxes &amp; Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-[#D8E8DD] pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#10231A] uppercase tracking-wider">Total</span>
                <span className="text-xl font-black text-[#0B7A3B] font-mono">{formatINR(subtotal)}</span>
              </div>

              {checkoutUrl ? (
                <a
                  href={checkoutUrl}
                  className="w-full py-4 px-6 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0B7A3B]/25 flex items-center justify-center gap-2 text-center cursor-pointer hover:-translate-y-0.5"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-4 px-6 bg-slate-100 text-slate-400 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed text-center border border-slate-200"
                >
                  Checkout Unavailable
                </button>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

