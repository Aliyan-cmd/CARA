import React from 'react';

const About = () => {
  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container">
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '100px' }}>
          <div className="fade-in">
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', fontFamily: "'Playfair Display', serif" }}>Crafting Excellence Since 2024.</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              CARA was born out of a desire to redefine luxury. We believe that true elegance lies in the details—the choice of fabric, the precision of a stitch, and the timelessness of a silhouette.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Our mission is to provide sophisticated individuals with a wardrobe that transcends trends, focusing on quality over quantity and sustainability over fast fashion.
            </p>
            <div style={{ display: 'flex', gap: '3rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>10k+</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Happy Clients</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>50+</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Global Partners</p>
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>100%</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Organic Cotton</p>
              </div>
            </div>
          </div>
          <div className="glass" style={{ padding: '1rem', borderRadius: '24px', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80" 
              alt="Tailoring" 
              style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '16px' }} 
            />
          </div>
        </section>

        <section style={{ textAlign: 'center', marginBottom: '100px' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '4rem' }}>Our Values</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2.5rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Sustainability</h3>
              <p style={{ color: 'var(--text-muted)' }}>We are committed to reducing our environmental footprint through ethically sourced materials.</p>
            </div>
            <div className="glass" style={{ padding: '2.5rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Artisanship</h3>
              <p style={{ color: 'var(--text-muted)' }}>Every piece is handcrafted by master tailors with decades of experience in the industry.</p>
            </div>
            <div className="glass" style={{ padding: '2.5rem' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Innovation</h3>
              <p style={{ color: 'var(--text-muted)' }}>We blend traditional techniques with modern technology to create superior apparel.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
