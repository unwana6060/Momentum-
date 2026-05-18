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
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="coach" element={<AICoach />} />
          <Route path="clock" element={<WorldClockPage />} />
          <Route path="profile" element={<Profile />} />
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

