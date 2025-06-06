import React, { useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import ProductManagement from './admin/ProductManagement';
import OrderManagement from './admin/OrderManagement';
import UserManagement from './admin/UserManagement';
import PaymentManagement from './admin/PaymentManagement';
import Reports from './admin/Reports';
import Reviews from './admin/Reviews';
import Messages from './admin/Messages';
import Header from './components/Header';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FullPageSpinner } from './components/FullPageSpinner';
// import Shop from './customer/Shop';
// import AddToCartButton from './components/Cart';    //TO CHANGE LATER
// import Home from './pages/Home';
// import Unauthorized from './pages/Unauthorized';
// import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const { userRole, loading } = useContext(AuthContext);
  const location = useLocation();

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

  if (loading) return <FullPageSpinner />;

  return (
    <>
      {/* Show header except on auth pages */}
      {!hideHeaderRoutes.includes(location.pathname) && !adminRoutes.includes(location.pathname) && (
        <Header />
      )}

      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/unauthorized" replace />
        } />
        <Route path="/product-management" element={
          userRole === 'admin' ? <ProductManagement /> : <Navigate to="/unauthorized" replace />
        } />
        <Route path="/order-management" element={
          userRole === 'admin' ? <OrderManagement /> : <Navigate to="/unauthorized" replace />
        } />
        <Route path="/user-management" element={
          userRole === 'admin' ? <UserManagement /> : <Navigate to="/unauthorized" replace />
        } />
        <Route path="/payment-management" element={
          userRole === 'admin' ? <PaymentManagement /> : <Navigate to="/unauthorized" replace />
        } />
        <Route path="/reports" element={
          userRole === 'admin' ? <Reports /> : <Navigate to="/unauthorized" replace />
        } />
        <Route path="/reviews" element={
          userRole === 'admin' ? <Reviews /> : <Navigate to="/unauthorized" replace />
        } />
        <Route path="/messages" element={
          userRole === 'admin' ? <Messages /> : <Navigate to="/unauthorized" replace />
        } />

        {/* Customer Routes */}
        {/* <Route path="/shop" element={
          userRole === 'customer' || userRole === 'admin' ? <Shop /> : <Navigate to="/login" replace />
        } /> */}
        {/* <Route path="/cart" element={
          userRole === 'customer' || userRole === 'admin' ? <AddToCartButton /> : <Navigate to="/login" replace />
        } /> */}

        {/* Catch-all Route */}
        {/* <Route path="*" element={<NotFound />} /> */}
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
