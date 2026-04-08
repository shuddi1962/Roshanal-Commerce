"use client";

import { X } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useState, useEffect } from "react";

const notices = [
  "Free Shipping on orders over ₦100,000 — Use code: FREESHIP",
  "New Year Sale: Up to 40% Off Security Systems — Shop Now!",
  "Professional Installation Available Nationwide — Book Today",
];

export default function NoticeBar() {
  const { noticeBarDismissed, dismissNoticeBar } = useUIStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (noticeBarDismissed) return null;

  return (
    <div className="shimmer-bg animate-shimmer h-9 flex items-center justify-center relative text-white text-xs font-medium tracking-wide">
      <div className="flex items-center gap-2">
        <span className="animate-fade-in" key={currentIndex}>
          {notices[currentIndex]}
        </span>
      </div>
      <button
        onClick={dismissNoticeBar}
        className="absolute right-4 hover:bg-white/20 rounded p-1 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
