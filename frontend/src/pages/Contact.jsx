import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif" }}>Get In Touch</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Whether you have a question about our collection, shipping, or just want to say hello, we're here to help.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', marginBottom: '100px' }}>
          {/* Contact Information */}
          <div className="fade-in">
            <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>Contact Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Mail size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Us</h4>
                  <p style={{ fontSize: '1.2rem' }}>concierge@cara-luxury.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Call Us</h4>
                  <p style={{ fontSize: '1.2rem' }}>+1 (888) 123-4567</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--glass)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Visit Our Atelier</h4>
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
