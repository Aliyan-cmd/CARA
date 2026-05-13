import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Shield, Package, LogOut } from 'lucide-react';

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the demo user (ID 1)
    fetch('/api/users/1')
      .then(res => res.json())
      .then(data => {
        setUser(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div style={{ paddingTop: '200px', textAlign: 'center' }}>Loading your profile...</div>;
  if (!user) return <div style={{ paddingTop: '200px', textAlign: 'center' }}>User not found.</div>;

  return (
    <div style={{ paddingTop: '150px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          {/* Profile Sidebar */}
          <div className="glass" style={{ padding: '2rem', height: 'fit-content', textAlign: 'center' }}>
            <div style={{ width: '120px', height: '120px', background: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={60} color="var(--secondary)" />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>{user.username}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '2rem' }}>{user.role}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <Mail size={18} /> <span>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <MapPin size={18} /> <span>{user.location || 'Not specified'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                <Calendar size={18} /> <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
          
          {/* Main Content */}
          <div style={{ flex: 2 }}>
            <h1 style={{ marginBottom: '2rem' }}>Account Dashboard</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="glass" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Package size={24} color="var(--primary)" />
                  <h3 style={{ margin: 0 }}>Recent Orders</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't placed any orders yet. Start your journey with our latest collection.</p>
              </div>
              <div className="glass" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Shield size={24} color="var(--primary)" />
                  <h3 style={{ margin: 0 }}>Security</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Password last changed 3 months ago. Your account is secured with 2FA.</p>
              </div>
            </div>
            
            <div className="glass" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Username</label>
                  <input type="text" defaultValue={user.username} style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</label>
                  <input type="email" defaultValue={user.email} style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                </div>
                <div style={{ marginBottom: '1rem', gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location</label>
                  <input type="text" defaultValue={user.location} style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '8px', color: 'white' }} />
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Changes</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Account;
