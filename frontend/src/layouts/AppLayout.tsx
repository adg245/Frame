import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300">
      <Navigation />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
