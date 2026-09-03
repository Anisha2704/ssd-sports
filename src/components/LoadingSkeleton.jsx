import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div
          key={idx}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse space-y-4 shadow-lg"
        >
          <div className="w-full h-56 bg-slate-800 rounded-lg"></div>
          <div className="h-6 bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-800/70 rounded w-full"></div>
            <div className="h-3 bg-slate-800/70 rounded w-5/6"></div>
          </div>
          <div className="pt-4 flex justify-between items-center border-t border-slate-800">
            <div className="h-6 bg-slate-800 rounded w-24"></div>
            <div className="h-6 bg-slate-800 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
