import React, { useState, useEffect } from 'react';
import { Link, Send } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Hero = () => (
  <section style={{ height: '90vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zInitialize: -1 }}>
      <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80" alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to right, rgba(10,10,10,0.9), transparent)' }}></div>
    </div>
    <div className="container fade-in">
      <div style={{ maxWidth: '700px' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '1rem' }}>New Collection 2026</p>
        <h1 style={{ fontSize: '5rem', lineHeight: '1.1', marginBottom: '2rem' }}>Elegance in Every <span style={{ color: 'var(--primary)' }}>Stitch.</span></h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.8' }}>Discover our curated selection of premium apparel designed for those who value sophistication and timeless style.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
          <Link to="/about" className="btn btn-outline">Our Story</Link>
        </div>
      </div>
    </div>
  </section>
);

const CategorySection = () => (
  <section style={{ padding: '100px 0', background: 'rgba(255,255,255,0.02)' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[
          { name: 'Men', img: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80' },
          { name: 'Women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80' },
          { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' }
        ].map(cat => (
          <div key={cat.name} style={{ height: '400px', position: 'relative', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer' }}>
            <img src={cat.img} alt={cat.name} className="category-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
              <h3 style={{ fontSize: '2.5rem', color: 'white' }}>{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Newsletter = () => (
  <section style={{ padding: '100px 0' }}>
    <div className="container">
      <div className="glass" style={{ padding: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Join the Inner Circle</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>Subscribe to receive exclusive access to new collections, private sales, and fashion insights.</p>
        <form style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '1rem' }} onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder="Your email address" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '1rem 1.5rem', borderRadius: '50px', color: 'white', outline: 'none' }} />
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Join <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products/featured')
      .then(res => res.json())
      .then(data => {
        setProducts(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <Hero />
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Featured Collection</h2>
            <div style={{ width: '60px', height: '3px', background: 'var(--primary)', margin: '0 auto' }}></div>
          </div>
          
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading elegance...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>
      <CategorySection />
      <Newsletter />
    </div>
  );
};

export default Home;
