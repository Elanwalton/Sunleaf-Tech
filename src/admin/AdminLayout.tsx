// AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../styles/adminDashboard.module.css';
import Sidebar from '../components/Admin_sideBar';
import Profile from '../MinorComponents/Admin_topbar';

const AdminLayout: React.FC = () => {
  return (
    <div className={styles.adminRootContainer}>
      {/* Background layer - only visible for admin */}
      <div className={styles.adminBackground}></div>
      <Sidebar/>    
      <div className={styles.topBar}>Admin Dashboard
        <Profile/>
      </div>
      
      <div className={styles.dashboardContainer}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
