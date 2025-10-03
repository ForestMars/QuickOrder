/**
 * useOrderStore.test.ts
 * 
 * Comprehensive tests for the Zustand order store (useOrderStore).
 * Covers:
 * - Cart operations (add, remove, clear, total calculation)
 * - Modal state management (payment modal, notifications)
 * - Storage operations (localStorage persistence)
 * - Payment processing and order creation
 * - Order management (load, update status, delete)
 * - Error handling and edge cases
 * 
 * Test coverage: 96.77% - Core state management logic
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrderStore } from '../store/useOrderStore';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useOrderStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useOrderStore.setState({
        cart: [],
        orders: [],
        showPaymentModal: false,
        showNotification: false,
      });
    });
    
    // Clear all mocks and reset localStorage mock implementations
    vi.clearAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
    localStorageMock.clear.mockReset();
  });

  describe('Cart Operations', () => {
    it('should add item to cart', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0]).toEqual({
        id: 1,
        name: 'Coffee',
        price: 3.5,
        quantity: 1,
      });
    });

    it('should increment quantity when adding existing item', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].quantity).toBe(2);
    });

    it('should remove item from cart when quantity is 1', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.removeFromCart(1);
      });

      expect(result.current.cart).toHaveLength(0);
    });

    it('should decrement quantity when removing existing item', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.removeFromCart(1);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].quantity).toBe(1);
    });

    it('should clear cart', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.clearCart();
      });

      expect(result.current.cart).toHaveLength(0);
    });

    it('should calculate total price correctly', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.addToCart({ id: 2, name: 'Tea', price: 2.5 });
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 }); // Increment quantity
      });

      expect(result.current.getTotalPrice()).toBe(9.5); // 3.5 + 2.5 + 3.5
    });
  });

  describe('Modal State', () => {
    it('should set showPaymentModal', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.setShowPaymentModal(true);
      });

      expect(result.current.showPaymentModal).toBe(true);
    });

    it('should set showNotification', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.setShowNotification(true);
      });

      expect(result.current.showNotification).toBe(true);
    });
  });

  describe('Storage Operations', () => {
    it('should load cart from localStorage', () => {
      const mockCart = [{ id: 1, name: 'Coffee', price: 3.5, quantity: 2 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCart));
      
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.loadFromStorage();
      });

      expect(result.current.cart).toEqual(mockCart);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('cart');
    });

    it('should save cart to localStorage', () => {
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.saveCartToStorage();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cart',
        JSON.stringify([{ id: 1, name: 'Coffee', price: 3.5, quantity: 1 }])
      );
    });

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const { result } = renderHook(() => useOrderStore());
      
      // Should not throw error
      expect(() => {
        act(() => {
          result.current.saveCartToStorage();
        });
      }).not.toThrow();
    });
  });

  describe('Payment Processing', () => {
    it('should process payment and create order', () => {
      const { result } = renderHook(() => useOrderStore());
      
      // Mock localStorage.getItem to return different values for different keys
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'orders') return JSON.stringify([]);
        return null;
      });
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
        result.current.addToCart({ id: 2, name: 'Tea', price: 2.5 });
      });

      let newOrder;
      act(() => {
        newOrder = result.current.processPayment();
      });

      expect(newOrder).toBeTruthy();
      expect(newOrder?.items).toHaveLength(2);
      expect(newOrder?.total).toBe(6.0);
      expect(newOrder?.status).toBe('pending');
      expect(result.current.cart).toHaveLength(0);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('orders', expect.any(String));
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cart');
    });

    it('should return null when cart is empty', () => {
      const { result } = renderHook(() => useOrderStore());
      
      let newOrder;
      act(() => {
        newOrder = result.current.processPayment();
      });

      expect(newOrder).toBeNull();
    });

    it('should handle payment processing errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.addToCart({ id: 1, name: 'Coffee', price: 3.5 });
      });

      let newOrder;
      act(() => {
        newOrder = result.current.processPayment();
      });

      expect(newOrder).toBeNull();
    });
  });

  describe('Orders Management', () => {
    it('should load orders from localStorage', () => {
      const mockOrders = [
        {
          id: 1,
          items: [{ id: 1, name: 'Coffee', price: 3.5, quantity: 1 }],
          total: 3.5,
          date: '2023-01-01T00:00:00.000Z',
          status: 'pending' as const,
        },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOrders));
      
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.loadOrders();
      });

      expect(result.current.orders).toEqual(mockOrders);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('orders');
    });

    it('should update order status', () => {
      const { result } = renderHook(() => useOrderStore());
      const mockOrders = [
        {
          id: 1,
          items: [{ id: 1, name: 'Coffee', price: 3.5, quantity: 1 }],
          total: 3.5,
          date: '2023-01-01T00:00:00.000Z',
          status: 'pending' as const,
        },
      ];
      
      act(() => {
        useOrderStore.setState({ orders: mockOrders });
        result.current.updateOrderStatus(1, 'completed');
      });

      expect(result.current.orders[0].status).toBe('completed');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('orders', expect.any(String));
    });

    it('should delete order', () => {
      const { result } = renderHook(() => useOrderStore());
      const mockOrders = [
        {
          id: 1,
          items: [{ id: 1, name: 'Coffee', price: 3.5, quantity: 1 }],
          total: 3.5,
          date: '2023-01-01T00:00:00.000Z',
          status: 'pending' as const,
        },
      ];
      
      act(() => {
        useOrderStore.setState({ orders: mockOrders });
        result.current.deleteOrder(1);
      });

      expect(result.current.orders).toHaveLength(0);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('orders', expect.any(String));
    });

    it('should handle empty orders gracefully', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useOrderStore());
      
      act(() => {
        result.current.loadOrders();
      });

      expect(result.current.orders).toEqual([]);
    });
  });
});
