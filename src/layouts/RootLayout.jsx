import React from 'react';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-[#10231A] font-sans antialiased selection:bg-[#0B7A3B] selection:text-white">
      <Outlet />
    </div>
  );
}

