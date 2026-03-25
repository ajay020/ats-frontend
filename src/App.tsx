import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationsPage from './pages/ApplicationsPage';
import DashboardPage from './pages/DashboardPage';
import { useAuthStore } from './stores/auth.store';
import { useEffect } from 'react';
import { authApi } from './api/auth.api';
import CreateApplicationPage from './pages/CreateApplicationPage';
import EditApplicationPage from './pages/EditApplicationPage';
import MainLayout from './components/MainLayout';

function App() {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const user = await authApi.getMe();
        setAuth(user, token);
      } catch (err) {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route index path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/new" element={<CreateApplicationPage />} />
          <Route path="/applications/:id/edit" element={<EditApplicationPage />} />
        </Route>
      </Routes>
    </>

  )
}

export default App
