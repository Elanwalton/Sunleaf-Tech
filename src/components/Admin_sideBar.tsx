import React from 'react';
import styles from '../styles/Sidebar.module.css';
import { Link } from 'react-router-dom';

import {
  FaTachometerAlt,
  FaMedal,
  FaTruck,
  FaUserShield,
  FaBook,
  FaMapMarkedAlt,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>LOGO</div>
      <nav className={styles.menu}>
      <ul>
  <li>
    <Link to="/admin-dashboard">
      <FaTachometerAlt /> <span>Dashboard</span>
    </Link>
  </li>
  <li>
    <Link to="/product-management">
      <FaMedal /> <span>Leaderboard</span>
    </Link>
  </li>
  <li>
    <Link to="/order-management">
      <FaTruck /> <span>Shipment</span>
    </Link>
  </li>
  <li>
    <Link to="/user-management">
      <FaUserShield /> <span>Administration</span>
    </Link>
  </li>
  <li>
    <Link to="/payment-management">
      <FaBook /> <span>Library</span>
    </Link>
  </li>
  <li>
    <Link to="/reports">
      <FaMapMarkedAlt /> <span>Maps</span>
    </Link>                                                                                

  </li>
  <li>
    <Link to="/reviews">
      <FaQuestionCircle /> <span>Reviews</span>
    </Link>
  </li>
</ul>

      </nav>
      <div className={styles.bottomMenu}>
        <ul>
  <li>
    <Link to="/settings">
      <FaCog /> <span>Setting</span>
    </Link>
  </li>
  <li>
    <Link to="/logout">
      <FaSignOutAlt /> <span>Log Out</span>
    </Link>
  </li>
</ul>

      </div>
    </div>
  );
};

export default Sidebar;
