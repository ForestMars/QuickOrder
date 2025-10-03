import React, { useEffect, useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';

// Use placeholder images from Unsplash instead of missing local images
const menuData = [
  {
    category: 'Drinks',
    items: [
      { id: 1, name: 'Coffee', price: 3.5, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop&crop=center' },
      { id: 2, name: 'Tea', price: 2.5, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100&h=100&fit=crop&crop=center' },
      { id: 3, name: 'Latte', price: 4.5, image: 'https://images.unsplash.com/photo-1561043433-9265f73e685f?w=100&h=100&fit=crop&crop=center' },
      { id: 4, name: 'Cappuccino', price: 4.0, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop&crop=center' },
    ],
  },
  {
    category: 'Snacks',
    items: [
      { id: 5, name: 'Muffin', price: 2.0, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center' },
      { id: 6, name: 'Cookie', price: 1.5, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=100&h=100&fit=crop&crop=center' },
      { id: 7, name: 'Croissant', price: 3.0, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop&crop=center' },
      { id: 8, name: 'Bagel', price: 2.5, image: 'https://images.unsplash.com/photo-1603046891744-76e6300df9e9?w=100&h=100&fit=crop&crop=center' },
    ],
  },
];

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const {
    cart,
    addToCart,
    removeFromCart,
    getTotalPrice,
    showPaymentModal,
    setShowPaymentModal,
    showNotification,
    setShowNotification,
    loadFromStorage,
    saveCartToStorage,
    processPayment,
  } = useOrderStore();

  // Load cart from localStorage on component mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage();
  }, [cart, saveCartToStorage]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const onProcessPayment = () => {
    const order = processPayment();
    if (!order) return;
    setShowPaymentModal(false);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      navigate('/orders');
    }, 1500);
  };

  const filteredMenuData = useMemo(() => {
    return menuData
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }))
      .filter(category => 
        selectedCategory === 'All' || category.category === selectedCategory
      )
      .filter(category => category.items.length > 0);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: '#22c55e',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✅</span>
          <span>Order placed successfully!</span>
        </div>
      )}
      
      <div className="menu-layout" style={{ 
        display: 'flex', 
        gap: '2rem', 
        padding: '1rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
      }}>
        {/* Menu Section */}
        <div className="menu-section" style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '1.5rem', 
                cursor: 'pointer',
                marginRight: '1rem',
                color: 'var(--accent)'
              }}
            >
              ←
            </button>
            <h2 style={{ color: 'var(--accent)', margin: 0 }}>Menu</h2>
          </div>

          {/* Search and Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCategory('All')}
                style={{
                  background: selectedCategory === 'All' ? 'var(--accent)' : '#e2e8f0',
                  color: selectedCategory === 'All' ? 'white' : 'var(--text)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem'
                }}
              >
                All
              </button>
              {menuData.map(cat => (
                <button
                  key={cat.category}
                  onClick={() => setSelectedCategory(cat.category)}
                  style={{
                    background: selectedCategory === cat.category ? 'var(--accent)' : '#e2e8f0',
                    color: selectedCategory === cat.category ? 'white' : 'var(--text)',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>

          {filteredMenuData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3>No items found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredMenuData.map((cat) => (
              <div key={cat.category} style={{ marginBottom: '2rem' }}>
                <h3 style={{ margin: '1rem 0 0.5rem 0' }}>{cat.category}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cat.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 4px #0001', padding: '0.5rem 1rem' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: 56, height: 56, borderRadius: '0.5rem', marginRight: '1rem', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://via.placeholder.com/56x56?text=${encodeURIComponent(item.name.charAt(0))}`;
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ color: '#888', fontSize: '1rem' }}>${item.price.toFixed(2)}</div>
                      </div>
                      <button 
                        style={{ maxWidth: 120 }}
                        onClick={() => addToCart(item)}
                      >
                        Add to Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Section */}
        <div className="cart-sidebar" style={{ 
          width: 350, 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '1rem', 
          height: 'fit-content', 
          position: 'sticky',
          top: '1rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent)' }}>Your Order</h3>
          
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '2rem 0' }}>
              No items in cart
            </div>
          ) : (
            <>
              <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ color: '#888', fontSize: '0.8rem' }}>${item.price.toFixed(2)} × {item.quantity}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ 
                          background: '#ff4757', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: 28, 
                          height: 28, 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                        aria-label="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                      <span style={{ minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        style={{ 
                          background: 'var(--accent)', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: 24, 
                          height: 24, 
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.1rem' }}>
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                style={{ width: '100%', background: '#22c55e' }}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Payment Details</h3>
            <p>Total Amount: ${getTotalPrice().toFixed(2)}</p>
            <p>Payment Method: (Mock Payment)</p>
            <button 
                onClick={onProcessPayment}
              style={{ width: '100%', background: 'var(--accent)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}
            >
              Process Payment
            </button>
            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{ width: '100%', background: '#ff4757', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuPage;
