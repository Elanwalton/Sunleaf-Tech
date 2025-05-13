import React from "react";
import styles from "./ProductCard.module.css";

type Product = {
  id: string;  // Changed to 'string' to match the 'id' in your products array
  name: string;
  price: number;
  image: string;
  rating: number;
};

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.name} className={styles.image} />
      <h3 className={styles.name}>{product.name}</h3>
      <div className={styles.rating}>⭐ {product.rating}</div>
      <div className={styles.price}>Ksh {product.price.toLocaleString()}</div>
      <div className={styles.actions}>
        <button className={styles.cartBtn}>Add to Cart</button>
        <button className={styles.buyBtn}>Buy Now</button>
      </div>
    </div>
  );
};

export default ProductCard;
