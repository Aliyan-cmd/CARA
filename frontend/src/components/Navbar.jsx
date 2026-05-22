import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();

  return (
    <nav className="glass" style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1200px', zIndex: 1000, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" className="brand" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', letterSpacing: '2px' }}>CARA</Link>
      <ul style={{ display: 'flex', gap: '2rem', fontWeight: '500' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/admin" style={{ color: 'var(--primary)', fontWeight: '600' }}>Admin</Link></li>
      </ul>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/cart" style={{ position: 'relative' }}>
          <ShoppingBag size={20} style={{ cursor: 'pointer' }} />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'var(--secondary)', fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '50%' }}>
              {cartCount}
            </span>
          )}
        </Link>
        <Link to="/account">
          <User size={20} style={{ cursor: 'pointer' }} />
        </Link>
        <Menu size={20} style={{ cursor: 'pointer' }} className="mobile-only" />
      </div>
    </nav>
  );
};

export default Navbar;
