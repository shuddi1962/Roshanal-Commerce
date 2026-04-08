"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { products, categories, brands } from "@/lib/demo-data";
import type { Product, Category, Brand } from "@/types";

// --- Scoring helpers ---

function scoreMatch(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase().trim();
  if (!q || !t) return 0;

  // Exact match
  if (t === q) return 100;

  // Starts with
  if (t.startsWith(q)) return 80;

  // Word starts with query
  const words = t.split(/\s+/);
  if (words.some((w) => w.startsWith(q))) return 60;

  // Contains
  if (t.includes(q)) return 40;

  // Multi-word: check if all query words appear somewhere
  const queryWords = q.split(/\s+/);
  if (queryWords.length > 1 && queryWords.every((qw) => t.includes(qw))) return 30;

  return 0;
}

// --- Search functions ---

export interface ProductSearchResult {
  product: Product;
  score: number;
}

export interface CategorySearchResult {
  category: Category;
  score: number;
}

export interface BrandSearchResult {
  brand: Brand;
  score: number;
}

export interface SearchResults {
  products: ProductSearchResult[];
  categories: CategorySearchResult[];
  brands: BrandSearchResult[];
  query: string;
}

export function searchProducts(query: string, limit = 8): ProductSearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();

  const scored: ProductSearchResult[] = [];

  for (const product of products) {
    let bestScore = 0;

    // Name (highest weight)
    bestScore = Math.max(bestScore, scoreMatch(q, product.name) * 1.0);

    // Brand name
    bestScore = Math.max(bestScore, scoreMatch(q, product.brand.name) * 0.8);

    // Category name
    bestScore = Math.max(bestScore, scoreMatch(q, product.category.name) * 0.7);

    // Tags
    for (const tag of product.tags) {
      bestScore = Math.max(bestScore, scoreMatch(q, tag) * 0.6);
    }

    // Short description
    bestScore = Math.max(bestScore, scoreMatch(q, product.shortDescription) * 0.3);

    // SKU exact
    if (product.sku.toLowerCase() === q) bestScore = Math.max(bestScore, 90);

    if (bestScore > 0) {
      scored.push({ product, score: bestScore });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function searchCategories(query: string, limit = 3): CategorySearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const scored: CategorySearchResult[] = [];

  for (const category of categories) {
    const score = scoreMatch(query, category.name);
    if (score > 0) {
      scored.push({ category, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function searchBrands(query: string, limit = 3): BrandSearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const scored: BrandSearchResult[] = [];

  for (const brand of brands) {
    const score = scoreMatch(query, brand.name);
    if (score > 0) {
      scored.push({ brand, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function searchAll(query: string): SearchResults {
  return {
    products: searchProducts(query),
    categories: searchCategories(query),
    brands: searchBrands(query),
    query,
  };
}

// --- Recent searches (localStorage) ---

const RECENT_SEARCHES_KEY = "roshanal-recent-searches";
const MAX_RECENT = 5;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === "undefined" || !query.trim()) return;
  try {
    const recent = getRecentSearches().filter(
      (s) => s.toLowerCase() !== query.toLowerCase().trim()
    );
    recent.unshift(query.trim());
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT))
    );
  } catch {
    // silently fail
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // silently fail
  }
}

// --- useSearch hook with debounce ---

export function useSearch(debounceMs = 200) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    (q: string) => {
      setQuery(q);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (!q || q.trim().length < 2) {
        setResults(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      timerRef.current = setTimeout(() => {
        const r = searchAll(q);
        setResults(r);
        setIsSearching(false);
      }, debounceMs);
    },
    [debounceMs]
  );

  const clear = useCallback(() => {
    setQuery("");
    setResults(null);
    setIsSearching(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { query, results, isSearching, search, clear };
}
