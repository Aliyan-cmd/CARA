import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { ArrowRight, Send } from 'lucide-react';

const Hero = () => (
  <section id="home" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="fade-in">
      <h1 style={{ fontSize: '5rem', marginBottom: '1rem', color: 'var(--text-light)', fontFamily: "'Playfair Display', serif" }}>Elegance Defined.</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Discover our curated collection of premium apparel designed for the modern individual.</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
        <Link to="/about" className="btn btn-outline">Our Story</Link>
      </div>
    </div>
  </section>
);

const CategorySection = () => (
  <section style={{ padding: '100px 0', background: '#050505' }}>
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Browse Categories</h2>
        <p style={{ color: 'var(--text-muted)' }}>Explore our specialized collections.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[
          { name: 'Men', image: 'https://images.unsplash.com/photo-1488161628813-24479bdca245?auto=format&fit=crop&w=800&q=80', link: '/shop' },
          { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', link: '/shop' },
          { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', link: '/shop' }
        ].map((cat, i) => (
          <Link to={cat.link} key={i} className="glass" style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: '24px', display: 'block' }}>
            <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }} className="category-img" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2.5rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                Explore Collection <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const Newsletter = () => (
  <section style={{ padding: '100px 0' }}>
    <div className="container">
      <div className="glass" style={{ padding: '4rem', textAlign: 'center', background: 'linear-gradient(45deg, var(--glass), rgba(201, 166, 107, 0.05))' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Join the Inner Circle</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Subscribe to receive early access to new collections and exclusive invitations to brand events.</p>
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
