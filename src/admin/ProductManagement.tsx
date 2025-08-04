import { useState, useEffect } from "react";
import styles from "../styles/AdmProduct.module.css";
import { Star } from "lucide-react";
import CreateProductModal from "../components/CreateProduct";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  status: string;
  revenue: number;
  price: number;
  quantity: number;
  rating: number;
}

const ProductManagement = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats data
  const stats = [
    { label: "Selling Product", value: 2456, change: "+2.79%", color: "green" },
    { label: "Top Products", value: 1238, change: "-2.10%", color: "red" },
    { label: "Reorder Product", value: 3132, change: "+4.23%", color: "green" },
    { label: "Highest Product", value: 4345, change: "+5.23%", color: "green" }
  ];

  // Fetch products from PHP API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost/Sunleaf-Tech/api/getproduct.php');
        const data = await response.json();
        
        if (!data.success) throw new Error(data.message);
        setProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Helper functions
  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      'Stock OK': 'statusPink',
      'Reorder': 'statusPurple',
      'Low Stock': 'statusYellow'
    };
    return statusClasses[status] || 'statusDefault';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'Ksh'
    }).format(amount);
  };

  // Handle new product addition from modal
  const handleProductAdded = async (newProduct: Omit<Product, 'id'>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost/Sunleaf-Tech/api/addproduct.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Product creation failed');
      }

      // Create new product with temporary ID and default values
      const addedProduct: Product = {
        id: Date.now(), // Temporary local ID
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        status: newProduct.status || 'Stock OK',
        revenue: Number(newProduct.revenue || 0),
        price: Number(newProduct.price || 0),
        quantity: Number(newProduct.quantity || 0),
        rating: Number(newProduct.rating || 0),
      };

      // Update state and close modal
      setProducts(prev => [...prev, addedProduct]);
      setTimeout(() => setIsModalOpen(false), 150);

    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to add product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const processedProducts = products.map(product => ({
    ...product,
    statusClass: getStatusClass(product.status),
    revenue: formatCurrency(Number(product.revenue)),
    price: formatCurrency(Number(product.price)),
    rating: Number(product.rating),
  }));

  const filteredProducts = processedProducts
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'name') return a.name.localeCompare(b.name);
      if (sortField === 'price') {
        const priceA = Number(a.price.replace(/[^0-9.-]+/g, ""));
        const priceB = Number(b.price.replace(/[^0-9.-]+/g, ""));
        return priceA - priceB;
      }
      if (sortField === 'revenue') {
        const revenueA = Number(a.revenue.replace(/[^0-9.-]+/g, ""));
        const revenueB = Number(b.revenue.replace(/[^0-9.-]+/g, ""));
        return revenueA - revenueB;
      }
      if (sortField === 'rating') return b.rating - a.rating;
      return 0;
    });

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Top Product</h2>
      <p className={styles.subtitle}>
        Track your finances and achieve your financial goals
      </p>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.card}>
            <p className={styles.label}>{stat.label}</p>
            <p className={styles.value}>{stat.value}</p>
            <p className={`${styles.change} ${styles[stat.color]}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search product..."
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="revenue">Revenue</option>
          <option value="rating">Rating</option>
        </select>
        <button 
          className={styles.button} 
          onClick={() => setIsModalOpen(true)}
          disabled={isSubmitting}
        >
          + Add Product
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <CreateProductModal 
          onClose={() => !isSubmitting && setIsModalOpen(false)}
          onProductAdded={handleProductAdded}
          isSubmitting={isSubmitting}
        />
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Total Revenue</th>
              <th>Product Price</th>
              <th>Quantity</th>
              <th>Customer Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productDescription}>
                    {product.description}
                  </div>
                </td>
                <td>{product.category}</td>
                <td>
                  <span className={`${styles.status} ${styles[getStatusClass(product.status)]}`}>
                    {product.status}
                  </span>
                </td>
                <td>{product.revenue}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td className={styles.ratingCell}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? styles.starActive
                          : styles.starInactive
                      }
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className={styles.ratingValue}>({product.rating.toFixed(1)})</span>
                </td>
                <td>
                  <button className={styles.actionButton}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;