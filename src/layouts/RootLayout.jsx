import React from 'react';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased selection:bg-red-600 selection:text-white">
      <Outlet />
    </div>
  );
}
