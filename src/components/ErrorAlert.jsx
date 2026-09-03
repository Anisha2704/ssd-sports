import React from 'react';

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="max-w-2xl mx-auto my-8 bg-red-950/40 border border-red-800/80 rounded-xl p-6 shadow-xl text-red-200">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-red-900/60 rounded-lg text-red-300 shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-2 flex-1">
          <h3 className="font-semibold text-lg text-red-100">Shopify API Connection Error</h3>
          <p className="text-sm leading-relaxed text-red-300 font-mono bg-slate-950/80 p-3 rounded border border-red-900/50 overflow-x-auto">
            {message}
          </p>
          <div className="pt-2 flex items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white font-medium text-xs rounded-lg transition-colors shadow"
              >
                Retry Connection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
