import React from "react";
import styles from "../styles/ProductCard.module.css";

interface ProductCardProps {
  image: string;
  title: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  price,
  category,
  rating,
  reviews,
}) => {
  return (
    <div className={styles.card}>
      <span className={styles.category}>{category}</span>
      <img src={image} alt={title} className={styles.image} />

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.price}>Ksh{price}</p>

      <div className={styles.rating}>
        {'★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))}
        <span className={styles.review}>({reviews} reviews)</span>
      </div>

      <div className={styles.buttons}>
        <button className={styles.cartBtn}>Add to Cart</button>
        <button className={styles.buyBtn}>Buy Now</button>
      </div>
    </div>
  );
};

export default ProductCard;
