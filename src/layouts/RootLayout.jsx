import React from 'react';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      <Outlet />
    </div>
  );
}
