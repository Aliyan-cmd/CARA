import React from 'react';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="glass" style={{ padding: '5rem 0 2rem', marginTop: '100px', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        <div>
          <div className="brand" style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>CARA</div>
          <p style={{ color: 'var(--text-muted)' }}>Premium fashion for the bold and the beautiful. Crafting excellence since 2024.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Instagram size={24} style={{ cursor: 'pointer' }} />
            <Twitter size={24} style={{ cursor: 'pointer' }} />
            <Facebook size={24} style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Newsletter</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="email" placeholder="Email Address" style={{ background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '50px', color: 'white', flex: 1 }} />
            <button className="btn btn-primary" style={{ padding: '0.8rem 1.2rem' }}><ArrowRight size={20} /></button>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; 2026 CARA Clothing Brand. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
