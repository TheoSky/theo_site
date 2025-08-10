import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CyberBadge } from '@/components/ui/cyber-badge';
import { useAuth } from '@/contexts/auth-context';
import { Menu, X, Zap, BookOpen, User, Briefcase, Mail, PenTool, LogIn, LogOut } from 'lucide-react';
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
    { path: '/', label: '关于我', icon: <User className="w-4 h-4" /> },
    { path: '/projects', label: '项目', icon: <Briefcase className="w-4 h-4" /> },
    { path: '/blog', label: '博客', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/contact', label: '联系我', icon: <Mail className="w-4 h-4" /> },
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
            <span className="font-bold text-lg gradient-text">杨耸霄的个人网站</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`flex items-center gap-1.5 py-1.5 px-2 rounded-md transition-colors ${isActive(link.path) ? 'text-cyber-cyan' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/admin">
                    <CyberBadge variant="tech" className="flex items-center gap-1 cursor-pointer">
                      <PenTool className="w-3 h-3" />
                      管理博客
                    </CyberBadge>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    退出
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <LogIn className="w-4 h-4 mr-1" />
                    登录
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-foreground"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-cyber-cyan/20 py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${isActive(link.path) ? 'bg-muted text-cyber-cyan' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                onClick={closeMenu}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

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