import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { useAuth } from '@/contexts/auth-context';
import { Menu, X, Zap, BookOpen, User, Briefcase, Mail, PenTool, LogIn, LogOut, BarChart3, ChevronDown, Home } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import heroAvatar from '@/assets/hero-avatar.jpg';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: '首页', icon: <Home className="w-4 h-4" /> },
    { path: '/projects', label: '项目', icon: <Briefcase className="w-4 h-4" /> },
    { path: '/blog', label: '博客', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/contact', label: '联系我', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-cyber-cyan/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={heroAvatar} alt="杨耸霄" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg gradient-text">Theo's website</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`flex items-center gap-1.5 py-2 px-3 rounded-md transition-colors font-medium ${isActive(link.path) ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-foreground hover:text-cyber-cyan hover:bg-cyber-cyan/5'}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* User Menu Dropdown */}
              <div className="relative group">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground flex items-center"
                >
                  <Menu className="w-4 h-4" />
                </Button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-background/95 backdrop-blur-md border border-cyber-cyan/20 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {user ? (
                      <>
                        <Link 
                          to="/admin" 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                        >
                          <PenTool className="w-4 h-4" />
                          管理博客
                        </Link>
                        <Link 
                          to="/analytics" 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                        >
                          <BarChart3 className="w-4 h-4" />
                          访问统计
                        </Link>
                        <hr className="my-1 border-cyber-cyan/20" />
                        <button 
                           onClick={logout}
                           className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors w-full text-left"
                         >
                           <LogOut className="w-4 h-4" />
                           退出
                         </button>
                       </>
                     ) : (
                       <Link 
                         to="/login" 
                         className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-cyber-cyan/10 hover:text-cyber-cyan transition-colors"
                       >
                         <LogIn className="w-4 h-4" />
                         登录
                       </Link>
                     )}
                   </div>
                 </div>
               </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          {isMobile && (
            <div className="flex items-center gap-2">
              {/* Quick Access Links */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${isActive(link.path) ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-muted-foreground hover:text-cyber-cyan hover:bg-cyber-cyan/5'}`}
                    title={link.label}
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
              
              {/* Menu Button for User Functions */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                className="text-foreground ml-2"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile User Menu */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-cyber-cyan/20 py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <Link 
                  to="/admin"
                  className="flex items-center gap-2 py-2 px-3 rounded-md bg-gradient-to-r from-cyber-cyan/10 to-cyber-purple/10 text-cyber-cyan"
                  onClick={closeMenu}
                >
                  <PenTool className="w-4 h-4" />
                  管理博客
                </Link>
                <Link 
                  to="/analytics"
                  className="flex items-center gap-2 py-2 px-3 rounded-md bg-gradient-to-r from-cyber-purple/10 to-cyber-pink/10 text-cyber-purple"
                  onClick={closeMenu}
                >
                  <BarChart3 className="w-4 h-4" />
                  访问统计
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { logout(); closeMenu(); }}
                  className="justify-start text-muted-foreground hover:text-foreground w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出
                </Button>
              </>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 py-2 px-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={closeMenu}
              >
                <LogIn className="w-4 h-4" />
                登录
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};