import { create } from 'zustand';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category?: string;
  sizes?: string[];
  extras?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: string;
  selectedExtras?: string[];
  specialInstructions?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedExtras?: string[];
  specialInstructions?: string;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  estimatedReadyTime?: string;
}

interface OrderState {
  cart: CartItem[];
  orders: Order[];
  showPaymentModal: boolean;
  showNotification: boolean;
  showCustomizationModal: boolean;
  customizingItem: MenuItem | null;

  addToCart: (item: MenuItem, customization?: Partial<CartItem>) => void;
  removeFromCart: (itemId: number) => void;
  updateCartItem: (itemId: number, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  setShowPaymentModal: (open: boolean) => void;
  setShowNotification: (show: boolean) => void;
  setShowCustomizationModal: (open: boolean) => void;
  setCustomizingItem: (item: MenuItem | null) => void;

  loadFromStorage: () => void;
  saveCartToStorage: () => void;

  processPayment: () => Order | null;
  loadOrders: () => void;
  updateOrderStatus: (orderId: number, newStatus: Order['status']) => void;
  deleteOrder: (orderId: number) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  orders: [],
  showPaymentModal: false,
  showNotification: false,
  showCustomizationModal: false,
  customizingItem: null,

  addToCart: (item, customization = {}) =>
    set((state) => {
      const existingItem = state.cart.find(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.selectedSize === customization.selectedSize &&
          JSON.stringify(cartItem.selectedExtras?.sort()) === JSON.stringify(customization.selectedExtras?.sort()) &&
          cartItem.specialInstructions === customization.specialInstructions
      );
      
      if (existingItem) {
        return {
          cart: state.cart.map((ci) =>
            ci.id === existingItem.id && 
            ci.selectedSize === existingItem.selectedSize &&
            JSON.stringify(ci.selectedExtras?.sort()) === JSON.stringify(existingItem.selectedExtras?.sort()) &&
            ci.specialInstructions === existingItem.specialInstructions
              ? { ...ci, quantity: ci.quantity + 1 }
              : ci
          ),
        };
      }
      return { 
        cart: [...state.cart, { 
          ...item, 
          quantity: 1, 
          selectedSize: customization.selectedSize,
          selectedExtras: customization.selectedExtras || [],
          specialInstructions: customization.specialInstructions || ''
        }] 
      };
    }),

  removeFromCart: (itemId) =>
    set((state) => {
      const existingItem = state.cart.find((ci) => ci.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return {
          cart: state.cart.map((ci) =>
            ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
          ),
        };
      }
      return { cart: state.cart.filter((ci) => ci.id !== itemId) };
    }),

  updateCartItem: (itemId, updates) =>
    set((state) => ({
      cart: state.cart.map((ci) =>
        ci.id === itemId ? { ...ci, ...updates } : ci
      ),
    })),

  clearCart: () => set({ cart: [] }),

  getTotalPrice: () => {
    const state = get();
    return state.cart.reduce((total, item) => {
      let itemPrice = item.price;
      
      // Add size price adjustment
      if (item.selectedSize === 'Large') {
        itemPrice += 1.5;
      } else if (item.selectedSize === 'Extra Large') {
        itemPrice += 2.5;
      }
      
      // Add extras price
      if (item.selectedExtras) {
        item.selectedExtras.forEach(extra => {
          switch (extra) {
            case 'Extra Shot': itemPrice += 0.75; break;
            case 'Soy Milk': itemPrice += 0.5; break;
            case 'Almond Milk': itemPrice += 0.75; break;
            case 'Oat Milk': itemPrice += 0.75; break;
            case 'Whipped Cream': itemPrice += 0.5; break;
            case 'Caramel Syrup': itemPrice += 0.75; break;
            case 'Vanilla Syrup': itemPrice += 0.75; break;
            case 'Chocolate Syrup': itemPrice += 0.75; break;
          }
        });
      }
      
      return total + (itemPrice * item.quantity);
    }, 0);
  },

  setShowPaymentModal: (open) => set({ showPaymentModal: open }),
  setShowNotification: (show) => set({ showNotification: show }),
  setShowCustomizationModal: (open) => set({ showCustomizationModal: open }),
  setCustomizingItem: (item) => set({ customizingItem: item }),

  loadFromStorage: () => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        set({ cart: parsed });
      }
    } catch {
      // ignore
    }
  },

  saveCartToStorage: () => {
    try {
      const { cart } = get();
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  },

  processPayment: () => {
    const state = get();
    if (state.cart.length === 0) return null;
    
    const estimatedReadyTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    
    const newOrder: Order = {
      id: Date.now(),
      items: state.cart.map((c) => ({ ...c })),
      total: state.getTotalPrice(),
      date: new Date().toISOString(),
      status: 'pending',
      estimatedReadyTime,
    };

    try {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      const updatedOrders = [...orders, newOrder];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      set({ cart: [] });
      localStorage.removeItem('cart');
      return newOrder;
    } catch {
      return null;
    }
  },

  loadOrders: () => {
    try {
      const saved = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      set({ orders: saved });
    } catch {
      set({ orders: [] });
    }
  },

  updateOrderStatus: (orderId, newStatus) =>
    set((state) => {
      const updated = state.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem('orders', JSON.stringify(updated));
      return { orders: updated };
    }),

  deleteOrder: (orderId) =>
    set((state) => {
      const updated = state.orders.filter((o) => o.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updated));
      return { orders: updated };
    }),
}));
