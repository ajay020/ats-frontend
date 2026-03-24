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

function App() {
  const { token, setAuth, setLoading } = useAuthStore((state) => state);

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
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications/new"
          element={
            <ProtectedRoute>
              <CreateApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>

  )
}

export default App
