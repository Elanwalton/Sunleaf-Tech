import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCategory } from '../context/CategoryContext';

interface Product {
  id: number;
  image: string;
  title: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>(''); // 👈 Jump input
  const pageSize = 10;

  const { selectedCategory } = useCategory();

  useEffect(() => {
    fetch(`/api/getProductsClients.php?page=${currentPage}&limit=${pageSize}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const mappedProducts = data.data.map((item: any) => ({
            id: Number(item.id),
            image: `http://localhost/Sunleaf-Tech/${item.main_image_url}`,
            title: item.name,
            price: item.price,
            category: item.category || 'uncategorized',
            rating: parseFloat(item.rating),
            reviews: parseInt(item.review_count),
          }));

          setProducts(mappedProducts);
          setTotalPages(data.totalPages || 1);
        } else {
          console.error("API responded but success was false");
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [currentPage]);

  useEffect(() => {
    if (!selectedCategory || selectedCategory.toLowerCase() === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product =>
          product.category?.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }
  }, [selectedCategory, products]);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleJump = () => {
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setPageInput('');
    } else {
      alert(`Please enter a number between 1 and ${totalPages}`);
    }
  };

  return (
    <div style={{ flex: 1 }}>
      {/* Product Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            category={product.category}
            rating={product.rating}
            reviews={product.reviews}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageClick(i + 1)}
            style={{
              fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
              backgroundColor: currentPage === i + 1 ? '#700000' : '#eee',
              color: currentPage === i + 1 ? 'white' : 'black',
              padding: '5px 10px',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
      </div>

      {/* Jump to Page Input */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '0.5rem' }}>
        <input
          type="number"
          placeholder="Go to page"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleJump();
          }}
          style={{ width: '100px', padding: '6px' }}
          min={1}
          max={totalPages}
        />
        <button onClick={handleJump} disabled={pageInput.trim() === ''}>Go</button>
      </div>
    </div>
  );
};

export default ProductList;
