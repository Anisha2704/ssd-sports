import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomCursor from '../components/CustomCursor';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans antialiased selection:bg-[#FF2E4D] selection:text-white">
      <CustomCursor />
      <Outlet />
    </div>
  );
}
