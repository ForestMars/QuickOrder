import React from 'react';
import { useNavigate } from 'react-router-dom';

const heroImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '1.5rem 0' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 800, fontSize: '2.2rem', margin: 0 }}>QuickOrder</h1>
      <div style={{ textAlign: 'center', color: '#555', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Cashierless ordering made simple
      </div>
      <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 2px 16px #0001', marginBottom: 24, position: 'relative' }}>
        <img src={heroImg} alt="Cafe" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.25)', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome to QuickOrder</div>
          <div style={{ fontSize: '1rem', fontWeight: 400 }}>Order ahead, skip the line</div>
        </div>
      </div>
      <button style={{ background: 'var(--accent)', fontSize: '1.1rem', marginBottom: 12 }} onClick={() => navigate('/menu')}>
        <span role="img" aria-label="utensils">🍽️</span> Start New Order
      </button>
      <button style={{ background: '#fff', color: 'var(--accent)', border: '2px solid var(--accent)', fontSize: '1.1rem', marginBottom: 24 }} onClick={() => navigate('/orders')}>
        <span role="img" aria-label="orders">💵</span> View My Orders
      </button>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <div style={{ background: '#f4f6fa', borderRadius: 16, padding: '1rem', flex: 1, textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.2rem' }}>2min</div>
          <div style={{ color: '#888', fontSize: '0.95rem' }}>Avg Wait</div>
        </div>
        <div style={{ background: '#f4f6fa', borderRadius: 16, padding: '1rem', flex: 1, textAlign: 'center' }}>
          <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.2rem' }}>4.8<span style={{ color: '#22c55e', marginLeft: 2 }}>★</span></div>
          <div style={{ color: '#888', fontSize: '0.95rem' }}>Rating</div>
        </div>
        <div style={{ background: '#f4f6fa', borderRadius: 16, padding: '1rem', flex: 1, textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.2rem' }}>100+</div>
          <div style={{ color: '#888', fontSize: '0.95rem' }}>Items</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 