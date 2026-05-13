import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 8;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const offset = (currentPage - 1) * itemsPerPage;
    const baseUrl = selectedCategory ? `/api/products/category/${selectedCategory}` : '/api/products';
    const url = `${baseUrl}?limit=${itemsPerPage}&offset=${offset}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCategory, currentPage]);

  const fetchTotalCount = useCallback(() => {
    const url = selectedCategory ? `/api/products/total?category_id=${selectedCategory}` : '/api/products/total';
    fetch(url)
      .then(res => res.json())
      .then(data => setTotalProducts(data.total || 0))
      .catch(err => console.error(err));
  }, [selectedCategory]);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.data || []))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchTotalCount();
  }, [fetchProducts, fetchTotalCount]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '5rem' }}>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.8rem', borderRadius: '50%', cursor: 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={20} />
        </button>
        
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            style={{ 
              width: '45px', 
              height: '45px', 
              borderRadius: '50%', 
              border: '1px solid',
              borderColor: currentPage === i + 1 ? 'var(--primary)' : 'var(--glass-border)',
              background: currentPage === i + 1 ? 'var(--primary)' : 'var(--glass)',
              color: currentPage === i + 1 ? 'var(--secondary)' : 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}

        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'white', padding: '0.8rem', borderRadius: '50%', cursor: 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px' }}>
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif" }}>Our Collection</h2>
          <p style={{ color: 'var(--text-muted)' }}>Meticulously crafted for the discerning eye.</p>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
            onClick={() => handleCategoryClick(null)}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p>Refining selection...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {products.length > 0 ? (
                products.map(product => (
                  <div key={product.id} className="fade-in">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', gridColumn: 'span 3', color: 'var(--text-muted)' }}>No products found in this category.</p>
              )}
            </div>
            {renderPagination()}
          </>
        )}
      </section>
    </div>
  );
};

export default Shop;
