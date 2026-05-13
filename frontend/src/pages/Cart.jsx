import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ paddingTop: '200px', textAlign: 'center' }} className="container">
        <ShoppingBag size={80} style={{ color: 'var(--glass-border)', marginBottom: '2rem' }} />
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="btn btn-primary">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container">
        <h2 style={{ fontSize: '3rem', marginBottom: '3rem' }}>Your Shopping Bag</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{item.name}</h4>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${item.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--glass-border)', borderRadius: '50px' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>-</button>
                    <span style={{ padding: '0 0.5rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
                  </div>
                  <Trash2 size={20} color="#ff4d4d" style={{ cursor: 'pointer' }} onClick={() => removeFromCart(item.id)} />
                </div>
              </div>
            ))}
            <button onClick={clearCart} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.9rem' }}>Clear All Items</button>
          </div>
          
          <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ color: '#00ff88' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.2rem' }}>
              Checkout <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
