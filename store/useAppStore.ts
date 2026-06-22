import { create } from 'zustand';

interface UserProfile {
  id: string;
  email?: string;
  phone: string;
  full_name: string;
  role: 'admin' | 'broker' | 'business_owner' | 'normal_user';
}

interface AppState {
  user: UserProfile | null;
  favorites: string[];
  filters: {
    type: string | null;
    transaction: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    bedrooms: number | null;
  };
  setUser: (user: UserProfile | null) => void;
  toggleFavorite: (propertyId: string) => void;
  setFilters: (newFilters: Partial<AppState['filters']>) => void;
  resetFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  favorites: [],
  filters: {
    type: null,
    transaction: null,
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
  },
  setUser: (user) => set({ user }),
  toggleFavorite: (propertyId) => set((state) => {
    const isFav = state.favorites.includes(propertyId);
    return {
      favorites: isFav
        ? state.favorites.filter((id) => id !== propertyId)
        : [...state.favorites, propertyId]
    };
  }),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  resetFilters: () => set({
    filters: {
      type: null,
      transaction: null,
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
    }
  }),
}));
