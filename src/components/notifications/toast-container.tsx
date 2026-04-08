"use client";

import { useNotificationStore } from "@/store/notification-store";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  CreditCard,
  Heart,
  Tag,
  Star,
  Mail,
  RotateCcw,
  UserPlus,
  FileText,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

const iconMap: Record<string, typeof ShoppingCart> = {
  "add-to-cart": ShoppingCart,
  "order-placed": Package,
  "payment-confirmed": CreditCard,
  "wishlist-added": Heart,
  "coupon-applied": Tag,
  "review-submitted": Star,
  "newsletter-signup": Mail,
  "return-requested": RotateCcw,
  "account-created": UserPlus,
  "quote-sent": FileText,
  "affiliate-commission": DollarSign,
  "social-proof": Users,
  info: Info,
  error: AlertCircle,
  success: CheckCircle,
};

const colorMap: Record<string, string> = {
  "add-to-cart": "bg-blue-50 text-blue border-blue/20",
  "order-placed": "bg-green-50 text-green-600 border-green-200",
  "payment-confirmed": "bg-green-50 text-green-600 border-green-200",
  "wishlist-added": "bg-red-50 text-red border-red/20",
  "coupon-applied": "bg-purple-50 text-purple-600 border-purple-200",
  "review-submitted": "bg-yellow-50 text-yellow-600 border-yellow-200",
  "newsletter-signup": "bg-blue-50 text-blue border-blue/20",
  "return-requested": "bg-orange-50 text-orange-600 border-orange-200",
  "account-created": "bg-green-50 text-green-600 border-green-200",
  "quote-sent": "bg-blue-50 text-blue border-blue/20",
  "affiliate-commission": "bg-green-50 text-green-600 border-green-200",
  "social-proof": "bg-white text-text-2 border-border",
  info: "bg-blue-50 text-blue border-blue/20",
  error: "bg-red-50 text-red border-red/20",
  success: "bg-green-50 text-green-600 border-green-200",
};

export default function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-[380px] w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => {
          const Icon = iconMap[notif.type] || Info;
          const colors = colorMap[notif.type] || colorMap.info;

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`pointer-events-auto rounded-xl border shadow-medium p-4 ${colors}`}
            >
              <div className="flex items-start gap-3">
                {notif.productImage ? (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={notif.productImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">
                    {notif.title}
                  </p>
                  <p className="text-xs opacity-70 mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notif.id)}
                  className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
