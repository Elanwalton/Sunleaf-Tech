// CatNav.tsx
import React, { useState } from 'react';
import styles from '../styles/CategorySidebar.module.css';
import {
  FaBoxOpen, FaHome, FaMusic, FaMobileAlt,
  FaHdd, FaStar, FaSearch, FaPercent, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { useCategory } from '../context/CategoryContext'; // ✅ Import context

interface CatNavProps {
  onClose: () => void;
  onCategorySelect?: (category: string) => void;
}

const CatNav: React.FC<CatNavProps> = ({ onClose }) => {
  const [showSub, setShowSub] = useState(false);
  const { setSelectedCategory } = useCategory(); // ✅ Get setter from context

  const toggleSubItems = () => setShowSub(prev => !prev);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category); // ✅ Use context instead of prop
    onClose(); // ✅ Still close sidebar
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Category</h3>

      <div className={styles.section}>
        <div className={styles.item} onClick={toggleSubItems}>
          <FaBoxOpen />
          <span>All Product</span>
          <span className={styles.badge}>32</span>
          {showSub ? (
            <FaChevronUp className={styles.chevron} />
          ) : (
            <FaChevronDown className={styles.chevron} />
          )}
        </div>

        {showSub && (
          <>
            <div className={styles.subItem} onClick={() => handleCategoryClick("all")}>
              <FaHome />
              <span>All Categories</span>
            </div>
            <div className={styles.subItem} onClick={() => handleCategoryClick("music")}>
              <FaMusic />
              <span>For Music</span>
            </div>
            <div className={styles.subItem} onClick={() => handleCategoryClick("phone")}>
              <FaMobileAlt />
              <span>For Phone</span>
            </div>
            <div className={styles.subItem} onClick={() => handleCategoryClick("storage")}>
              <FaHdd />
              <span>For Storage</span>
            </div>
          </>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.item} onClick={() => handleCategoryClick("new")}>
          <FaSearch />
          <span>New Arrival</span>
        </div>
        <div className={styles.item} onClick={() => handleCategoryClick("best")}>
          <FaStar />
          <span>Best Seller</span>
        </div>
        <div className={styles.item} onClick={() => handleCategoryClick("discount")}>
          <FaPercent />
          <span>On Discount</span>
        </div>
      </div>
    </aside>
  );
};

export default CatNav;
