
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { GeneratePage } from './pages/GeneratePage';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { MentionsLegalesPage } from './pages/MentionsLegalesPage';
import { CGVPage } from './pages/CGVPage';
import { ConfidentialitePage } from './pages/ConfidentialitePage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { AppRoute } from './types';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppRoute>(AppRoute.HOME);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash.startsWith(AppRoute.GENERATE)) {
        setCurrentPage(AppRoute.GENERATE);
      } else if (hash === AppRoute.PRICING) {
        setCurrentPage(AppRoute.PRICING);
      } else if (hash === AppRoute.CONTACT) {
        setCurrentPage(AppRoute.CONTACT);
      } else if (hash === AppRoute.LOGIN) {
        setCurrentPage(AppRoute.LOGIN);
      } else if (hash === AppRoute.MENTIONS_LEGALES) {
        setCurrentPage(AppRoute.MENTIONS_LEGALES);
      } else if (hash === AppRoute.CGV) {
        setCurrentPage(AppRoute.CGV);
      } else if (hash === AppRoute.CONFIDENTIALITE) {
        setCurrentPage(AppRoute.CONFIDENTIALITE);
      } else if (hash.startsWith(AppRoute.PAYMENT_SUCCESS)) {
        setCurrentPage(AppRoute.PAYMENT_SUCCESS);
      } else {
        setCurrentPage(AppRoute.HOME);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: AppRoute, params: string = '') => {
    window.location.hash = page + params;
  };

  return (
    <AuthProvider>
      <Layout currentPage={currentPage} onNavigate={(page) => navigate(page, '')}>
        {currentPage === AppRoute.HOME && (
          <LandingPage onNavigate={navigate} />
        )}

        {currentPage === AppRoute.GENERATE && (
          <GeneratePage />
        )}

        {currentPage === AppRoute.PRICING && (
          <PricingPage onNavigate={navigate} />
        )}

        {currentPage === AppRoute.CONTACT && (
          <ContactPage />
        )}

        {currentPage === AppRoute.LOGIN && (
          <LoginPage onNavigate={navigate} />
        )}

        {currentPage === AppRoute.MENTIONS_LEGALES && (
          <MentionsLegalesPage />
        )}

        {currentPage === AppRoute.CGV && (
          <CGVPage />
        )}

        {currentPage === AppRoute.CONFIDENTIALITE && (
          <ConfidentialitePage />
        )}

        {currentPage === AppRoute.PAYMENT_SUCCESS && (
          <PaymentSuccessPage onNavigate={navigate} />
        )}
      </Layout>
    </AuthProvider>
  );
};

export default App;
