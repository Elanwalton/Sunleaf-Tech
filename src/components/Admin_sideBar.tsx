import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';

const Sidebar: React.FC = () => {

  const menuItems = [
    { label: 'Dashboard', path: '/admin-dashboard' },
    { label: 'Products', path: '/admin-dashboard/product-management' },
    { label: 'Order Management', path: '/admin-dashboard/order-management' },
    { label: 'Administration', path: '/admin-dashboard/user-management' },
    { label: 'Payment', path: '/admin-dashboard/payment-management' },
    { label: 'Reviews', path: '/admin-dashboard/reviews' },
    { label: 'View Quote', path: '/admin-dashboard/view-quote' },
    { label: 'Setting', path: '/admin-dashboard/settings' }

  ];

  return (
    <div className={styles.sidebar}>
 <h1 className={styles.sidebarLogo}>
      <img 
        
  src="src/assets/remove background.svg" 
  alt="Company Logo"
  className={styles.logoSvg}
/>
      
    </h1>
      <nav className={styles.sidebarNav}>
        <ul className={styles.sidebarMenu}>
          {menuItems.map((item) => (
            <li key={item.label} className={styles.sidebarItem}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
