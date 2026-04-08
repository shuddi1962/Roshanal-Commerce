"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export type BannerTransition =
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down"
  | "zoom-in"
  | "zoom-out"
  | "flip-horizontal"
  | "flip-vertical"
  | "rotate"
  | "blur"
  | "swipe"
  | "curtain"
  | "bounce"
  | "elastic";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  gradient: string;
  image?: string;
  overlay?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  transition?: BannerTransition;
  interval?: number;
  autoPlay?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  height?: string;
}

const transitionVariants: Record<BannerTransition, { initial: any; animate: any; exit: any }> = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  "slide-left": { initial: { x: "100%", opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: "-100%", opacity: 0 } },
  "slide-right": { initial: { x: "-100%", opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: "100%", opacity: 0 } },
  "slide-up": { initial: { y: "100%", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "-100%", opacity: 0 } },
  "slide-down": { initial: { y: "-100%", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "100%", opacity: 0 } },
  "zoom-in": { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.2, opacity: 0 } },
  "zoom-out": { initial: { scale: 1.3, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.7, opacity: 0 } },
  "flip-horizontal": { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: -90, opacity: 0 } },
  "flip-vertical": { initial: { rotateX: 90, opacity: 0 }, animate: { rotateX: 0, opacity: 1 }, exit: { rotateX: -90, opacity: 0 } },
  rotate: { initial: { rotate: -15, scale: 0.8, opacity: 0 }, animate: { rotate: 0, scale: 1, opacity: 1 }, exit: { rotate: 15, scale: 0.8, opacity: 0 } },
  blur: { initial: { opacity: 0, filter: "blur(20px)" }, animate: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(20px)" } },
  swipe: { initial: { x: "100%", opacity: 0, skewX: -5 }, animate: { x: 0, opacity: 1, skewX: 0 }, exit: { x: "-100%", opacity: 0, skewX: 5 } },
  curtain: { initial: { scaleX: 0, opacity: 0, originX: 0 }, animate: { scaleX: 1, opacity: 1, originX: 0 }, exit: { scaleX: 0, opacity: 0, originX: 1 } },
  bounce: { initial: { y: 80, opacity: 0, scale: 0.9 }, animate: { y: 0, opacity: 1, scale: 1 }, exit: { y: -80, opacity: 0, scale: 0.9 } },
  elastic: { initial: { x: "100%", opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: "-100%", opacity: 0 } },
};

const transitionConfigs: Record<BannerTransition, object> = {
  fade: { duration: 0.8, ease: "easeInOut" },
  "slide-left": { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  "slide-right": { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  "slide-up": { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  "slide-down": { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  "zoom-in": { duration: 0.7, ease: "easeOut" },
  "zoom-out": { duration: 0.7, ease: "easeOut" },
  "flip-horizontal": { duration: 0.8, ease: "easeInOut" },
  "flip-vertical": { duration: 0.8, ease: "easeInOut" },
  rotate: { duration: 0.7, ease: [0.68, -0.6, 0.32, 1.6] },
  blur: { duration: 0.6, ease: "easeInOut" },
  swipe: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  curtain: { duration: 0.7, ease: "easeInOut" },
  bounce: { duration: 0.6, type: "spring", stiffness: 200, damping: 20 },
  elastic: { duration: 0.8, type: "spring", stiffness: 120, damping: 14 },
};

export default function HeroSlider({
  slides,
  transition = "fade",
  interval = 6000,
  autoPlay = true,
  showArrows = true,
  showDots = true,
  height = "480px",
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, interval, goToNext, slides.length]);

  const currentSlide = slides[currentIndex];
  const variants = transitionVariants[transition];
  const transitionConfig = transitionConfigs[transition];

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ height }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={transitionConfig}
          className="absolute inset-0"
          style={{ perspective: "1200px" }}
        >
          {/* Background Image */}
          {currentSlide.image ? (
            <>
              <Image
                src={currentSlide.image}
                alt={currentSlide.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/60 to-transparent" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`} />
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col justify-center px-8 lg:px-14">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-blue-300 text-xs font-semibold mb-3 tracking-[0.2em] uppercase"
            >
              Roshanal Global
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-bold text-3xl lg:text-[44px] text-white leading-[1.1] max-w-lg tracking-tight"
            >
              {currentSlide.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white/60 text-base lg:text-lg mt-4 max-w-md leading-relaxed"
            >
              {currentSlide.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex gap-3 mt-8"
            >
              <Link
                href={currentSlide.ctaLink}
                className="inline-flex items-center justify-center rounded-lg text-sm font-semibold h-12 px-7 bg-red text-white hover:bg-red-600 shadow-lg hover:shadow-xl transition-all"
              >
                {currentSlide.cta}
              </Link>
              {currentSlide.secondaryCta && currentSlide.secondaryCtaLink && (
                <Link
                  href={currentSlide.secondaryCtaLink}
                  className="inline-flex items-center justify-center rounded-lg text-sm font-semibold h-12 px-7 bg-white/15 border border-white/25 text-white hover:bg-white/25 backdrop-blur-sm transition-all"
                >
                  {currentSlide.secondaryCta}
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors z-10"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-5 left-8 lg:left-14 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-8 bg-white" : "w-3 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {autoPlay && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: interval / 1000, ease: "linear" }}
            className="h-full bg-white/40"
          />
        </div>
      )}
    </div>
  );
}
