import React from 'react';

export default function ProductSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-[#D8E8DD] rounded-2xl p-4 animate-pulse space-y-4 shadow-sm">
          <div className="bg-[#F5FAF6] aspect-square rounded-2xl w-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-[#F5FAF6] rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-[#F5FAF6] rounded w-1/2 mx-auto"></div>
          </div>
          <div className="h-10 bg-[#EAF7EE] rounded-xl w-3/4 mx-auto"></div>
        </div>
      ))}
    </div>
  );
}
