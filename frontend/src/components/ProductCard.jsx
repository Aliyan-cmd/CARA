import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="glass" style={{ padding: '1rem', transition: 'var(--transition)', cursor: 'pointer' }}>
      <Link to={`/product/${product.id}`}>
        <div style={{ height: '300px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
          <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition)' }} className="product-image" />
        </div>
      </Link>
      <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>${product.price}</span>
        <button 
          className="btn btn-primary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
