"use client";

import { create } from "zustand";

export interface Notification {
  id: string;
  type:
    | "add-to-cart"
    | "order-placed"
    | "payment-confirmed"
    | "wishlist-added"
    | "coupon-applied"
    | "review-submitted"
    | "newsletter-signup"
    | "return-requested"
    | "account-created"
    | "quote-sent"
    | "affiliate-commission"
    | "social-proof"
    | "info"
    | "error"
    | "success";
  title: string;
  message: string;
  productName?: string;
  productImage?: string;
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  socialProofEnabled: boolean;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  setSocialProofEnabled: (enabled: boolean) => void;
}

let notifId = 0;

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  socialProofEnabled: true,

  addNotification: (notification) => {
    const id = `notif-${++notifId}-${Date.now()}`;
    const duration = notification.duration || 4000;

    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => set({ notifications: [] }),
  setSocialProofEnabled: (enabled) => set({ socialProofEnabled: enabled }),
}));
