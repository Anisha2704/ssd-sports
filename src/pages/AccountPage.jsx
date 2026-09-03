import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight">Customer Account</h1>
          <p className="text-slate-500 text-xs">Access your SSD Sports orders &amp; profile</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="button"
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-600/20"
          >
            Sign In
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
