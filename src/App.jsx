import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Toaster } from '@/components/ui/toaster';
import HomePage from '@/pages/HomePage';
import FindRidePage from '@/pages/FindRidePage';
import OfferRidePage from '@/pages/OfferRidePage';
import ProfilePage from '@/pages/ProfilePage';
import RideDetailsPage from '@/pages/RideDetailsPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import EditProfilePage from '@/pages/EditProfilePage';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function AppContent() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [theme, setTheme] = useState(user?.theme || 'light');

  useEffect(() => {
    setTheme(user?.theme || 'light');
  }, [user?.theme]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title>{t('app.title')}</title>
        <meta name="description" content={t('app.description')} />
      </Helmet>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-ride" element={<FindRidePage />} />
          <Route path="/offer-ride" element={<OfferRidePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ride/:id" element={<RideDetailsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
        <Toaster />
        <footer className="text-center py-4 text-sm text-gray-500">
          This Website is developed by Bhavya Prakash
        </footer>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
