import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call to place order
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1, // Demo user
          total_price: cartTotal,
          shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}`,
          items: cartItems
        })
      });

      if (response.ok) {
        setTimeout(() => {
          setIsProcessing(false);
          setStep(3);
          clearCart();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ paddingTop: '150px', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '4rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 1 ? 'var(--primary)' : 'var(--text-muted)' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: step >= 1 ? 'var(--primary)' : 'var(--text-muted)' }}>1</div>
            <span>Shipping</span>
          </div>
          <div style={{ width: '50px', height: '1px', background: 'var(--glass-border)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 2 ? 'var(--primary)' : 'var(--text-muted)' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: step >= 2 ? 'var(--primary)' : 'var(--text-muted)' }}>2</div>
            <span>Payment</span>
          </div>
          <div style={{ width: '50px', height: '1px', background: 'var(--glass-border)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: step >= 3 ? 'var(--primary)' : 'var(--text-muted)' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: step >= 3 ? 'var(--primary)' : 'var(--text-muted)' }}>3</div>
            <span>Complete</span>
          </div>
        </div>

        {step === 1 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Shipping Details</h2>
            <div className="glass" style={{ padding: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Shipping Address</label>
                  <input name="address" value={formData.address} onChange={handleInputChange} type="text" style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>City</label>
                  <input name="city" value={formData.city} onChange={handleInputChange} type="text" style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>ZIP Code</label>
                  <input name="zip" value={formData.zip} onChange={handleInputChange} type="text" style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem' }}>Continue to Payment</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Payment Method</h2>
            <div className="glass" style={{ padding: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Card Number</label>
                  <div style={{ position: 'relative' }}>
                    <input name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} type="text" placeholder="**** **** **** ****" style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                    <CreditCard size={20} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Expiry Date</label>
                  <input name="expiry" value={formData.expiry} onChange={handleInputChange} type="text" placeholder="MM/YY" style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>CVV</label>
                  <input name="cvv" value={formData.cvv} onChange={handleInputChange} type="text" placeholder="***" style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', color: 'white' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem' }}>
                  <span>Total Due</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                  <button onClick={handleSubmit} disabled={isProcessing} className="btn btn-primary" style={{ flex: 2 }}>
                    {isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <CheckCircle size={100} color="#00ff88" style={{ marginBottom: '2rem' }} />
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Order Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
              Thank you for choosing CARA. Your order has been placed successfully and will be delivered shortly.
            </p>
            <button onClick={() => navigate('/shop')} className="btn btn-primary">Continue Shopping</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
