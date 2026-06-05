/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import { db } from './firebase/config';
import { doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CalendarView from './pages/CalendarView';
import Analytics from './pages/Analytics';
import AICoach from './pages/AICoach';
import Profile from './pages/Profile';
import WorldClockPage from './pages/WorldClockPage';
import AuthPage from './pages/AuthPage';
import About from './pages/About';
import MenuNavigation from './pages/MenuNavigation';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import TermsDisclaimer from './pages/TermsDisclaimer';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen w-screen flex justify-center items-center bg-[#0a0f1c] text-blue-500">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Layout />}>
          {/* Protected Main App Routes */}
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
          <Route path="clock" element={<ProtectedRoute><WorldClockPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Public Compliance & Hub Routes */}
          <Route path="menu" element={<MenuNavigation />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<TermsDisclaimer />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test connection to Firestore on initialization
        await getDocFromServer(doc(db, 'system', 'ping'));
        console.log("Firebase Connected: Momentum Backend is active.");
      } catch (error) {
        // We expect a permission-denied or no-such-document, but if it's a network error, we want to know
        if (error instanceof Error && error.message.includes('offline')) {
          console.error("Firebase Offline: Please check your configuration.");
        } else {
          console.log("Firebase Connectivity Verified.");
        }
      }
    };
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </AuthProvider>
  );
}

