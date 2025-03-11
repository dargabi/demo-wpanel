import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Clients from './pages/clients/Clients';
import ClientDetail from './pages/clients/ClientDetail';
import Reports from './pages/reports/Reports';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Config
import theme from './config/theme';
import store from './redux/store';

/**
 * Protected Route component to secure routes based on authentication status
 * @param {Object} props - Component properties
 * @returns {JSX.Element} Protected route or redirect to login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Main App component that sets up routing and global providers
 * @returns {JSX.Element} The application with routing structure
 */
function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <AuthProvider>
            <Routes>
              {/* Auth routes */}
              <Route path="/" element={<AuthLayout />}>
                <Route path="login" element={<Login />} />
                <Route index element={<Navigate to="/login" />} />
              </Route>
              
              {/* Protected dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientDetail />} />
                <Route path="reports" element={<Reports />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App
