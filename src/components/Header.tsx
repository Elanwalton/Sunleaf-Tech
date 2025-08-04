import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { useState, useContext, useRef, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import LogoutButton from "../components/LogoutButton";
import { AuthContext } from "../context/AuthContext";
import { CatButton } from "./CategoriesButton";
import Catnav from "./ProductCatNav";
// import ProductList from '../BridgeComponents/ProductList';
import { useCategory } from "../context/CategoryContext";


type HeaderProps = {
  onCatButtonClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ onCatButtonClick }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { setSelectedCategory } = useCategory();
  const [isCatOpen, setIsCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const { userRole } = useContext(AuthContext);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleCatClick = () => {
    setIsCatOpen((prev) => !prev);
    onCatButtonClick?.(); // call optional handler from parent
  };

  // ✅ Detect click outside to close category sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setIsCatOpen(false);
      }
    };

    if (isCatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCatOpen]);

  return (
    <>
      <section className={styles["section-one"]}>
        <header className={styles.navWrapper}>
          <div className={styles.logo}>Sunleaf~Tech</div>
          <nav className={`${styles.desktop_nav} ${isMobileOpen ? styles.hidden : ""}`}>
            <ul className={styles.navList}>
              <li><Link to="/Home">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/cart"><FaShoppingCart size={24} /></Link></li>
              {userRole ? (
                <li><LogoutButton /></li>
              ) : (
                <li>
                  <Link to="/login"><button className="login-btn">Login</button></Link>
                </li>
              )}
            </ul>
          </nav>
          <button className={styles.menuToggle} onClick={toggleMobileMenu}>☰</button>
        </header>

        {/* ✅ Category Button + Search */}
        <div className={styles["bottom-deco"]}>
          <CatButton onClick={handleCatClick} />
          <input
            type="text"
            className={styles["search-container"]}
            placeholder="Search in Sunleaf-tech"
          />
          <button className={styles["search-button"]}>Search</button>
        </div>
      </section>

      {/* ✅ Catnav wrapper with outside click support */}
      {isCatOpen && (
        <Catnav
  onClose={() => setIsCatOpen(false)}
  onCategorySelect={(category) => {
    setIsCatOpen(false);
    setSelectedCategory(category); // from context
    console.log("Category selected:", category);
  }}
/>

      )}

      {/* ✅ Mobile Navigation */}
      <section className={styles["section"]}>
        <header className={`${styles.mobile_nav} ${isMobileOpen ? styles.active : ""}`}>
          <button className={styles.closeMenu} onClick={toggleMobileMenu}>
            Close Menu
          </button>
          <nav>
            <ul className={styles.navList}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/cart"><FaShoppingCart size={24} /></Link></li>
              {userRole ? (
                <li><LogoutButton /></li>
              ) : (
                <li>
                  <Link to="/login"><button className="logout-button">Login</button></Link>
                </li>
              )}
            </ul>
          </nav>
        </header>
      </section>
    </>
  );
};

export default Header;
