import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Landmark, HeartHandshake } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/report', label: 'File Grievance' },
    { to: '/track', label: 'Track' },
    { to: '/resources', label: 'Resources' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 font-sans">
      {/* Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded-md shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Main Header */}
      <header className="sticky top-0 bg-white border-b border-neutral-200 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand Logo - Plain text, no government emblems to respect disclaimers */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-primary-900">SunoGov</span>
                <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider -mt-1">EPFO Support Hub</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6" aria-label="Primary Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `
                    text-sm font-semibold transition-colors duration-150 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${isActive 
                      ? 'text-primary-700 font-bold border-b-2 border-primary-500 rounded-b-none' 
                      : 'text-neutral-600 hover:text-neutral-900'
                    }
                  `}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
                className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden border-t border-neutral-200 bg-white"
            aria-label="Mobile Navigation"
          >
            <div className="px-2 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    block px-3 py-2.5 rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }
                  `}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
        <Outlet />
      </main>

      {/* Trust & Prototype Disclaimer Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-neutral-400" />
              <span className="text-sm font-semibold text-neutral-500">SunoGov Hackathon Project</span>
            </div>

            <div className="text-center md:text-right max-w-md">
              <p className="text-xs text-neutral-400 font-medium">
                SunoGov is a simulated dashboard prototype. It does NOT submit real forms or requests to the Employees' Provident Fund Organisation (EPFO).
              </p>
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1.5">
                NO live EPFO connection • Synthetic data only
              </p>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};
