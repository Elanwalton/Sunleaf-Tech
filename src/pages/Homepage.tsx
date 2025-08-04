import { Outlet } from "react-router-dom";
import Styles from "../styles/homePage.module.css";
import Footer from "../components/Footer";
import RecommendedProducts from "../components/RecommendedProducts";
const HomePage: React.FC = () => {
 
  return (
    <>
    <div className={Styles.productDisplay}>
      
      {/* If you're using routes */}
      <Outlet />
    </div>
    <div className={Styles.recomendationSection}>
 <RecommendedProducts /> {/* ✅ render here */}
    </div>
<Footer/>
</>
  );
};

export default HomePage;


