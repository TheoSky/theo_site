import React from 'react';
import { Navbar } from './navbar';
import { useLocation } from 'react-router-dom';
import VisitorStats from '../ui/visitor-stats';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Don't show navbar on admin pages and login page
  const isAdminPage = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';
  const showNavbar = !isAdminPage && !isLoginPage;

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className={`flex-grow ${showNavbar ? 'pt-16' : ''}`}>
        {children}
      </main>
      {showNavbar && (
        <footer className="bg-background border-t border-cyber-cyan/20 py-6">
          <div className="container mx-auto px-4 text-center">
            {/* 访问统计 */}
            <div className="mb-4">
              <VisitorStats />
            </div>
            {/* 版权信息 */}
            <div className="text-muted-foreground">
              <p>© {new Date().getFullYear()} HoloSpark. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};