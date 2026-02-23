import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-polar))] flex flex-col">
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full">
           {/* Outlet renders the child route's element */}
           <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};