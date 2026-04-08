import { create } from "zustand";

interface UIStore {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  compareItems: string[];
  wishlistItems: string[];
  recentlyViewed: string[];
  noticeBarDismissed: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  toggleCompare: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  addRecentlyViewed: (productId: string) => void;
  dismissNoticeBar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  compareItems: [],
  wishlistItems: [],
  recentlyViewed: [],
  noticeBarDismissed: false,

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),

  toggleCompare: (productId) => {
    set((state) => {
      const exists = state.compareItems.includes(productId);
      return {
        compareItems: exists
          ? state.compareItems.filter((id) => id !== productId)
          : [...state.compareItems.slice(-3), productId],
      };
    });
  },

  toggleWishlist: (productId) => {
    set((state) => {
      const exists = state.wishlistItems.includes(productId);
      return {
        wishlistItems: exists
          ? state.wishlistItems.filter((id) => id !== productId)
          : [...state.wishlistItems, productId],
      };
    });
  },

  addRecentlyViewed: (productId) => {
    set((state) => {
      const filtered = state.recentlyViewed.filter((id) => id !== productId);
      return { recentlyViewed: [productId, ...filtered].slice(0, 20) };
    });
  },

  dismissNoticeBar: () => set({ noticeBarDismissed: true }),
}));
