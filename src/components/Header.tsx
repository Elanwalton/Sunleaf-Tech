import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import LogoutButton from "../components/LogoutButton";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { userRole } = useContext(AuthContext); // Access userRole from context

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <section className={styles["section-one"]}>
        <header className={styles.navWrapper}>
          <div className={styles.logo}>Sunleaf~Tech</div>
          <nav
            className={`${styles.desktop_nav} ${
              isMobileOpen ? styles.hidden : ""
            }`}
          >
            <ul className={styles.navList}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/cart">
                  <FaShoppingCart size={24} />
                </Link>
              </li>
              {userRole ? (
                <li>
                  <LogoutButton />
                </li>
              ) : (
                <li>
                  <Link to="/login">
                    <button className="login-btn">Login</button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <button className={styles.menuToggle} onClick={toggleMobileMenu}>
            ☰
          </button>
        </header>

        <div className={styles["bottom-deco"]}>
          <input
            type="text"
            className={styles["search-container"]}
            placeholder="Search in Sunleaf-tech"
          />
          <button className={styles["search-button"]}>Search</button>
        </div>
      </section>

      {/* Mobile Navigation */}
      <section className={styles["section"]}>
        <header
          className={`${styles.mobile_nav} ${
            isMobileOpen ? styles.active : ""
          }`}
        >
          <button className={styles.closeMenu} onClick={toggleMobileMenu}>
            Close Menu
          </button>
          <nav>
            <ul className={styles.navList}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/cart">
                  <FaShoppingCart size={24} />
                </Link>
              </li>
              {userRole ? (
                <li>
                  <LogoutButton />
                </li>
              ) : (
                <li>
                  <Link to="/login">
                    <button className="login-btn">Login</button>
                  </Link>
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
