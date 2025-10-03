import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore, type Order } from '../store/useOrderStore';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, loadOrders, updateOrderStatus, deleteOrder } = useOrderStore();

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'completed': return '#22c55e';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusEmoji = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
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
        <h1 style={{ color: 'var(--accent)', margin: 0 }}>My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No orders yet</h3>
          <p style={{ color: '#888', marginBottom: '2rem' }}>Start by placing your first order!</p>
          <button onClick={() => navigate('/menu')} style={{ background: 'var(--accent)' }}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ 
              background: '#fff', 
              borderRadius: '1rem', 
              padding: '1.5rem', 
              boxShadow: '0 2px 8px #0001',
              border: `2px solid ${getStatusColor(order.status)}20`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Order #{order.id.toString().slice(-6)}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    {formatDate(order.date)}
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: `${getStatusColor(order.status)}20`,
                  color: getStatusColor(order.status),
                  borderRadius: '2rem',
                  fontWeight: 600
                }}>
                  <span>{getStatusEmoji(order.status)}</span>
                  <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                {order.items.map((item) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                        × {item.quantity}
                      </span>
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTop: '2px solid #f0f0f0',
                paddingTop: '1rem'
              }}>
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                  Total: ${order.total.toFixed(2)}
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {order.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        style={{ 
                          background: '#22c55e', 
                          fontSize: '0.8rem',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        Mark Complete
                      </button>
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        style={{ 
                          background: '#ef4444', 
                          fontSize: '0.8rem',
                          padding: '0.5rem 1rem'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    style={{ 
                      background: '#6b7280', 
                      fontSize: '0.8rem',
                      padding: '0.5rem 1rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 