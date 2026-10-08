import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#10231A] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="border-b border-[#D8E8DD] pb-6 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#0B7A3B]">
            REAL-TIME TRACKING
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-[#10231A] uppercase tracking-wider mt-1">
            Track Your Order
          </h1>
          <p className="text-[#52645A] text-xs sm:text-sm mt-1 font-medium">
            Enter your order number and email to check real-time order status.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
          className="bg-white border border-[#D8E8DD] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#10231A] uppercase tracking-wider block">Order Number</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. #SSD-1001"
              className="w-full bg-[#F5FAF6] border border-[#D8E8DD] rounded-xl p-3.5 text-sm text-[#10231A] placeholder-[#7B8A82] focus:outline-none focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/20 font-mono transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#10231A] uppercase tracking-wider block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used during checkout"
              className="w-full bg-[#F5FAF6] border border-[#D8E8DD] rounded-xl p-3.5 text-sm text-[#10231A] placeholder-[#7B8A82] focus:outline-none focus:border-[#0B7A3B] focus:ring-2 focus:ring-[#0B7A3B]/20 transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#0B7A3B] hover:bg-[#075E2D] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#0B7A3B]/20 cursor-pointer"
          >
            Check Status
          </button>
        </form>

        {searched && (
          <div className="bg-[#F5FAF6] border border-[#D8E8DD] rounded-2xl p-6 text-center space-y-2 animate-fadeIn shadow-xs">
            <span className="text-xs font-mono text-[#7B8A82]">Order Inquiry: <code className="text-[#0B7A3B] font-bold">{orderNumber}</code></span>
            <p className="text-xs text-[#52645A] font-medium">
              Orders placed on SSD Sports are processed through Shopify. Order status notifications are sent directly to <code className="text-[#10231A] font-bold">{email}</code>.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

