"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import Topbar from "./topbar";
import NoticeBar from "./notice-bar";
import MainHeader from "./main-header";
import Navigation from "./navigation";
import Footer from "./footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [isSticky, setIsSticky] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 180);
      setShowScrollTop(scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAdmin]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Admin routes get no frontend chrome
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* 5-Layer Header */}
      <header>
        <Topbar />
        <NoticeBar />
        <MainHeader />
        <Navigation />
      </header>

      {/* Sticky Header (appears on scroll) */}
      {isSticky && (
        <div className="header-sticky">
          <MainHeader />
          <Navigation />
        </div>
      )}

      <main className="min-h-screen">{children}</main>

      <Footer />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-to-top w-11 h-11 rounded-full bg-blue text-white shadow-strong flex items-center justify-center hover:bg-blue-600 transition-colors ${
          showScrollTop ? "visible" : ""
        }`}
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} />
      </button>
    </>
  );
}
