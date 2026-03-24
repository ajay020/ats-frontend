import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicationsPage from './pages/ApplicationsPage';
import DashboardPage from './pages/DashboardPage';

function App() {

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

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>

  )
}

export default App
