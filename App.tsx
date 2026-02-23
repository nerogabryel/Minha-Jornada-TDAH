import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { JournalProvider } from './context/JournalContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { DashboardHome } from './components/DashboardHome';
import { ModulesList } from './components/ModulesList';
import { ActivityView } from './components/ActivityView';
import { JournalView } from './components/JournalView';
import { ProfileView } from './components/ProfileView';
import { JourneyMap } from './components/JourneyMap';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';
import { Loader2 } from 'lucide-react';

import { NotFound } from './components/NotFound';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-polar))]">
        <Loader2 className="h-10 w-10 text-[rgb(var(--color-macaw))] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="journey" element={<JourneyMap />} />
        <Route path="modules" element={<ModulesList />} />
        <Route path="activity/:activityId" element={<ActivityView />} />
        <Route path="journal" element={<JournalView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          <JournalProvider>
            <HashRouter>
              <AppRoutes />
              <ToastContainer />
            </HashRouter>
          </JournalProvider>
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;