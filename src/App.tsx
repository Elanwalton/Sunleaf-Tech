import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

const App: React.FC = () => {
  const { userRole, loading } = useContext(AuthContext);
  const location = useLocation();

  const hideHeaderRoutes = ["/signup", "/login"];

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}

      <Routes>
        {/* Admin Routes */}
        {userRole === 'admin' && (
          <>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/order-management" element={<OrderManagement />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/payment-management" element={<PaymentManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/messages" element={<Messages />} />
          </>
        )}

        {/* Customer Routes */}
        {userRole === 'customer' && (
          <>
            <Route path="/shop" element={<h1>Shop Page</h1>} />
            <Route path="/cart" element={<h1>Cart Page</h1>} />
          </>
        )}

        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Catch-all */}
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
