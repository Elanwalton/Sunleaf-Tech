// components/CatButton.tsx
import styles from "../styles/CategoriesButton.module.css";
import catIcon from "../assets/categorization.svg";

type CatButtonProps = {
  onClick: () => void;
};

export const CatButton: React.FC<CatButtonProps> = ({ onClick }) => {
  return (
    <button className={styles["cat-button"]} onClick={onClick}>
      <img 
        src={catIcon} 
        alt="Categories Icon" 
        className={styles["cat-icon"]} 
      />
      Categories
    </button>
  );
};
