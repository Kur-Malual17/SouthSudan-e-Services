import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import api from './lib/api';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import PassportFirstTime from './pages/applications/PassportFirstTime';
import PassportReplacement from './pages/applications/PassportReplacement';
import NationalIdFirstTime from './pages/applications/NationalIdFirstTime';
import NationalIdReplacement from './pages/applications/NationalIdReplacement';
import NationalIdCorrection from './pages/applications/NationalIdCorrection';
import VisaApplication from './pages/applications/VisaApplication';
import PermitApplication from './pages/applications/PermitApplication';
import EmergencyTravelDocument from './pages/applications/EmergencyTravelDocument';
import MyApplications from './pages/MyApplications';
import Payment from './pages/Payment';
import PaymentVerify from './pages/PaymentVerify';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import ApplicationDetail from './pages/admin/ApplicationDetail';
import Contact from './pages/Contact';
import Help from './pages/Help';
import NewsDetail from './pages/NewsDetail';
import BlogDetail from './pages/BlogDetail';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user && ['admin', 'officer', 'supervisor'].includes(user.role) ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" />
  );
};

function App() {
  // Fetch CSRF token on app load
  useEffect(() => {
    api.get('/csrf/').catch(() => {
      // Silently fail if CSRF endpoint is not available
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
        <Route path="payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="payment/verify" element={<ProtectedRoute><PaymentVerify /></ProtectedRoute>} />
        
        <Route path="apply/passport-first" element={<ProtectedRoute><PassportFirstTime /></ProtectedRoute>} />
        <Route path="apply/passport-replacement" element={<ProtectedRoute><PassportReplacement /></ProtectedRoute>} />
        <Route path="apply/nationalid-first" element={<ProtectedRoute><NationalIdFirstTime /></ProtectedRoute>} />
        <Route path="apply/nationalid-replacement" element={<ProtectedRoute><NationalIdReplacement /></ProtectedRoute>} />
        <Route path="apply/nationalid-correction" element={<ProtectedRoute><NationalIdCorrection /></ProtectedRoute>} />
        <Route path="apply/visa" element={<ProtectedRoute><VisaApplication /></ProtectedRoute>} />
        <Route path="apply/permit" element={<ProtectedRoute><PermitApplication /></ProtectedRoute>} />
        <Route path="apply/emergency-travel" element={<ProtectedRoute><EmergencyTravelDocument /></ProtectedRoute>} />
        
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
        <Route path="admin/applications/:id" element={<AdminRoute><ApplicationDetail /></AdminRoute>} />
        
        <Route path="contact" element={<Contact />} />
        <Route path="help" element={<Help />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="blog/:id" element={<BlogDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
