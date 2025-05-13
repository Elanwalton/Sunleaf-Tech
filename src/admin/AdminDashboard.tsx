import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/adminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.header}>Admin Dashboard</h1>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Overview</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>Products: 50</div>
          <div className={styles.statCard}>Orders: 120</div>
          <div className={styles.statCard}>Users: 200</div>
          <div className={styles.statCard}>Total Revenue: $5000</div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Quick Links</h3>
        <ul className={styles.quickLinks}>
          <li><Link to="/product-management">Product Management</Link></li>
          <li><Link to="/order-management">Order Management</Link></li>
          <li><Link to="/user-management">User Management</Link></li>
          <li><Link to="/payment-management">Payment Management</Link></li>
          <li><Link to="/reports">Reports & Analytics</Link></li>
          <li><Link to="/reviews">Reviews & Ratings</Link></li>
          <li><Link to="/messages">Messages/Support</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
