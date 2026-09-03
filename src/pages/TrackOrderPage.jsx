import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="border-b border-slate-100 pb-4 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">
            Track Your Order
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Enter your order number and email to check real-time order status.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Order Number</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. #SSD-1001"
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600 font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email used during checkout"
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            Check Status
          </button>
        </form>

        {searched && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2 animate-fadeIn">
            <span className="text-xs font-mono text-slate-500">Order Inquiry: <code className="text-slate-900 font-bold">{orderNumber}</code></span>
            <p className="text-xs text-slate-600">
              Orders placed on SSD Sports are processed through Shopify. Order status notifications are sent directly to <code className="text-slate-900 font-bold">{email}</code>.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
