import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import ProductManagement from './admin/ProductManagement';
// import OrderManagement from './admin/OrderManagement';
// import UserManagement from './admin/UserManagement';
// import PaymentManagement from './admin/PaymentManagement';
// import Reports from './admin/Reports';
// import Reviews from './admin/Reviews';
// import Messages from './admin/Messages';
import Header from './components/Header';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FullPageSpinner } from './components/FullPageSpinner';
const App: React.FC = () => {
  const { userRole, isLoading, userData } = useContext(AuthContext); // Use isLoading
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;
  // Routes where header should be hidden
  const hideHeaderRoutes = [
    "/signup", 
    "/login",
    "/unauthorized"
  ];

  // All admin routes for cleaner code
  const adminRoutes = [
    "/admin-dashboard",
    "/product-management",
    "/order-management",
    "/user-management",
    "/payment-management",
    "/reports",
    "/reviews",
    "/messages"
  ];

  if (isLoading) return <FullPageSpinner />;

  return (
    <>
      {/* Show header except on auth pages */}
      {!hideHeaderRoutes.includes(location.pathname) && !adminRoutes.includes(location.pathname) && (
        <Header />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={
          userData.id ? <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/'} replace /> : <SignUp />
        } />
        <Route path="/login" element={
          userData.id ? <Navigate to={userRole === 'admin' ? '/admin-dashboard' : '/'} replace /> : <Login />
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" state={{ from: location }} replace />
        } />
        <Route path="/product-management" element={
          userRole === 'admin' ? <ProductManagement /> : <Navigate to="/login" state={{ from: location }} replace />
        } />
        {/* Other admin routes... */}

        {/* Customer Routes */}
        {/* <Route path="/" element={
          userData.id ? <Home /> : <Navigate to="/login" state={{ from: location }} replace />
        } />

        {/* Redirect to login for unknown routes when not authenticated */}
        {/* <Route path="*" element={
          userData.id ? <NotFound /> : <Navigate to="/login" state={{ from: location }} replace />
        } /> */} 
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;