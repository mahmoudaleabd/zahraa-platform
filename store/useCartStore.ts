import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  businessId: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>, businessId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  businessId: null,

  addItem: (item, businessId) => {
    const state = get();
    
    // إذا تغير المطعم، نفرغ السلة
    if (state.businessId && state.businessId !== businessId) {
      set({
        items: [{ ...item, quantity: 1 }],
        businessId,
      });
      return;
    }

    // التحقق من وجود الصنف في السلة
    const existingItemIndex = state.items.findIndex((i) => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // تحديث الكمية إذا كان الصنف موجوداً
      set({
        items: state.items.map((i, index) =>
          index === existingItemIndex
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
        businessId,
      });
    } else {
      // إضافة صنف جديد
      set({
        items: [...state.items, { ...item, quantity: 1 }],
        businessId,
      });
    }
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({
      items: [],
      businessId: null,
    });
  },

  totalPrice: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  totalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },
}));
