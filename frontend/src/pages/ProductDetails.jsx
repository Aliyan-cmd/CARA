import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div style={{ paddingTop: '200px', textAlign: 'center' }}>Loading details...</div>;
  if (!product) return <div style={{ paddingTop: '200px', textAlign: 'center' }}>Product not found.</div>;

  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container">
        <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          <ChevronLeft size={20} /> Back to Shop
        </Link>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          <div className="glass" style={{ padding: '1rem', borderRadius: '20px', overflow: 'hidden' }}>
            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: 'auto', borderRadius: '12px' }} />
          </div>
          
          <div className="fade-in">
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{product.name}</h1>
            <p style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>${product.price}</p>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>Product Description</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>{product.description}. This premium piece is crafted with the highest quality materials, ensuring both comfort and longevity. A perfect addition to any modern wardrobe.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.2rem' }}
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>
            
            <div className="glass" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <ShieldCheck size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure Checkout</p>
              </div>
              <div>
                <Truck size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Free Shipping</p>
              </div>
              <div>
                <RotateCcw size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
