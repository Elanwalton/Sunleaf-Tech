// Footer.tsx
import styles from '../styles/Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.ctaSectionWrapper}>
        <div className={styles.ctaSection}>
          <div className={styles.ctaText}>
            <h2>Ready to Get Our New Stuff?</h2>
            <p>Be first to receive news and deals. Discover the latest in power and green tech, tailored for you.</p>
            <form className={styles.ctaForm}>
              <input type="email" placeholder="Your Email" />
              <button type="submit">Enroll</button>
            </form>
          </div>
        </div>
      </div>

      <div className={styles.linksContainer}>
        <div className={styles.linkColumn}>
          <h4>Support</h4>
          <ul>
            <li>Contact Us</li>
            <li>Meet Our Team</li>
            <li>Shipping</li>
            <li>Return</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className={styles.linkColumn}>
          <h4>Solutions</h4>
          <ul>
            <li>Solar Kits</li>
            <li>Battery Systems</li>
            <li>Inverters</li>
            <li>Eco Devices</li>
          </ul>
        </div>
        <div className={styles.linkColumn}>
          <h4>Social Media</h4>
          <div className={styles.socialIcons}>
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
            <FaYoutube />
          </div>
        </div>
      </div>

      <div className={styles.bottomNote}>
        &copy; {new Date().getFullYear()} Sunleaf Technology Solutions. Empowering Tomorrow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
