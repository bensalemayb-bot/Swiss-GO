import React, { useState, useEffect } from 'react';
import { Briefcase, ChevronRight, Menu, X, Globe, User, LogOut } from 'lucide-react';
import { AppRoute } from '../types';
import { FloatingBackground } from './FloatingBackground';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: AppRoute;
  onNavigate: (page: AppRoute) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { language, setLanguage, t } = useLanguage();
  const { user, cvCredits, lmCredits, signOut } = useAuth(); // Utilisation de l'Auth

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = (page: AppRoute) =>
    `text-sm font-medium tracking-wide transition-all duration-300 relative group ${currentPage === page
      ? 'text-luxury-gold'
      : 'text-gray-300 hover:text-white'
    }`;

  const handleLogout = async () => {
    await signOut();
    onNavigate(AppRoute.HOME);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-luxury-black text-gray-100 relative">
      <div className="print:hidden">
        <FloatingBackground />
      </div>

      {/* HEADER */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 border-b print:hidden ${scrolled
          ? 'bg-luxury-black/90 backdrop-blur-md border-white/10 py-3'
          : 'bg-transparent border-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => onNavigate(AppRoute.HOME)}
            >
              <div className="border border-luxury-gold p-2 mr-3 group-hover:bg-luxury-gold/10 transition duration-500">
                <Briefcase size={20} className="text-luxury-gold" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xl tracking-tight text-white">
                  Swiss<span className="text-luxury-gold">Go</span>
                </span>
                <span className="text-[0.6rem] text-gray-400 tracking-[0.2em] uppercase hidden sm:block">
                  Excellence & Carrière
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              {[
                { route: AppRoute.HOME, label: t('nav_home') },
                { route: AppRoute.PRICING, label: t('nav_pricing') },
                { route: AppRoute.CONTACT, label: t('nav_contact') },
              ].map((item) => (
                <button
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={navLinkClass(item.route)}
                >
                  {item.label}
                  <span className={`absolute -bottom-2 left-1/2 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full group-hover:left-0 ${currentPage === item.route ? 'w-full left-0' : ''}`}></span>
                </button>
              ))}

              {/* Show "Générer" link if user has credits */}
              {user && (cvCredits > 0 || lmCredits > 0) && (
                <button
                  onClick={() => onNavigate(AppRoute.GENERATE)}
                  className={navLinkClass(AppRoute.GENERATE)}
                >
                  Générer
                  <span className={`absolute -bottom-2 left-1/2 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full group-hover:left-0 ${currentPage === AppRoute.GENERATE ? 'w-full left-0' : ''}`}></span>
                </button>
              )}

              {/* Language Selector */}
              <div className="flex items-center space-x-2 border-l border-white/10 pl-6 h-6">
                <button
                  onClick={() => setLanguage('FR')}
                  className={`text-[10px] font-bold transition-colors ${language === 'FR' ? 'text-luxury-gold scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                  FR
                </button>
                <span className="text-gray-700 text-[10px]">|</span>
                <button
                  onClick={() => setLanguage('EN')}
                  className={`text-[10px] font-bold transition-colors ${language === 'EN' ? 'text-luxury-gold scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                  EN
                </button>
                <span className="text-gray-700 text-[10px]">|</span>
                <button
                  onClick={() => setLanguage('DE')}
                  className={`text-[10px] font-bold transition-colors ${language === 'DE' ? 'text-luxury-gold scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                  DE
                </button>
                <span className="text-gray-700 text-[10px]">|</span>
                <button
                  onClick={() => setLanguage('IT')}
                  className={`text-[10px] font-bold transition-colors ${language === 'IT' ? 'text-luxury-gold scale-110' : 'text-gray-500 hover:text-white'}`}
                >
                  IT
                </button>
              </div>

              {/* AUTH BUTTONS */}
              {user ? (
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-xs text-luxury-gold font-bold truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-white transition" title="Déconnexion">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate(AppRoute.LOGIN)}
                  className="ml-4 text-xs font-bold uppercase tracking-wider text-white hover:text-luxury-gold transition flex items-center"
                >
                  <User size={14} className="mr-2" /> Se connecter
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-luxury-gold">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-luxury-black border-t border-white/10 px-4 pt-4 pb-8 space-y-2 absolute w-full z-50 shadow-2xl">
            {[
              { route: AppRoute.HOME, label: t('nav_home') },
              { route: AppRoute.PRICING, label: t('nav_pricing') },
              { route: AppRoute.CONTACT, label: t('nav_contact') },
            ].map((item) => (
              <button
                key={item.route}
                onClick={() => { onNavigate(item.route); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-luxury-gold hover:bg-white/5 border-l-2 border-transparent hover:border-luxury-gold transition-all"
              >
                {item.label}
              </button>
            ))}

            {/* Show "Générer" link if user has credits */}
            {user && (cvCredits > 0 || lmCredits > 0) && (
              <button
                onClick={() => { onNavigate(AppRoute.GENERATE); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:text-luxury-gold hover:bg-white/5 border-l-2 border-transparent hover:border-luxury-gold transition-all"
              >
                Générer
              </button>
            )}

            <div className="border-t border-white/10 my-2 pt-2">
              {user ? (
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:bg-white/5">
                  Déconnexion ({user.email?.split('@')[0]})
                </button>
              ) : (
                <button onClick={() => { onNavigate(AppRoute.LOGIN); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-sm font-medium text-white hover:text-luxury-gold">
                  Se connecter
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow relative z-10 print:w-full print:h-full print:absolute print:top-0 print:left-0 print:bg-white">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 bg-luxury-black border-t border-white/5 pt-16 pb-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-[11px] text-gray-500">
            <button
              onClick={() => onNavigate(AppRoute.MENTIONS_LEGALES)}
              className="hover:text-luxury-gold transition-colors duration-300"
            >
              Mentions Légales
            </button>
            <span className="text-gray-700">•</span>
            <button
              onClick={() => onNavigate(AppRoute.CGV)}
              className="hover:text-luxury-gold transition-colors duration-300"
            >
              CGV
            </button>
            <span className="text-gray-700">•</span>
            <button
              onClick={() => onNavigate(AppRoute.CONFIDENTIALITE)}
              className="hover:text-luxury-gold transition-colors duration-300"
            >
              Confidentialité
            </button>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-medium tracking-wide uppercase">
            <div>&copy; {new Date().getFullYear()} SwissGo.</div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <span>Swiss Made Excellence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
