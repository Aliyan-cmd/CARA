import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
          
          {/* Contact Info */}
          <div>
            <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Get in <span style={{ color: 'var(--primary)' }}>Touch.</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>
              Have questions about our collection or need assistance with an order? Our concierge team is here to help.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                  <Phone size={24} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Call Us</h4>
                  <p style={{ fontSize: '1.2rem' }}>+44 20 7946 0958</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                  <Mail size={24} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Us</h4>
                  <p style={{ fontSize: '1.2rem' }}>concierge@caraclo.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                  <MapPin size={24} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Visit Us</h4>
                  <p style={{ fontSize: '1.2rem' }}>123 Mayfair St, London, UK</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass" style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Send Message</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                <input type="text" placeholder="John Doe" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
                <input type="email" placeholder="john@example.com" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Message</label>
                <textarea rows="4" placeholder="How can we help you?" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none' }}></textarea>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Send Message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
