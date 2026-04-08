"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, User, Tag } from "lucide-react";

const blogPosts = [
  {
    id: "1", slug: "complete-guide-cctv-installation-nigeria",
    title: "Complete Guide to CCTV Installation in Nigeria (2026)",
    excerpt: "Everything you need to know about setting up a professional surveillance system for your home or business in Nigeria.",
    category: "Security", author: "Roshanal Team", date: "Apr 1, 2026", readTime: "8 min read",
    featured: true,
  },
  {
    id: "2", slug: "choosing-right-boat-engine-horsepower",
    title: "How to Choose the Right Boat Engine Horsepower",
    excerpt: "A practical guide to selecting the perfect outboard engine for your vessel type, size, and usage requirements.",
    category: "Marine", author: "Roshanal Team", date: "Mar 25, 2026", readTime: "6 min read",
    featured: true,
  },
  {
    id: "3", slug: "fire-alarm-system-types-comparison",
    title: "Fire Alarm System Types: Conventional vs Addressable vs Wireless",
    excerpt: "Compare different fire alarm technologies to determine which system is right for your building.",
    category: "Safety", author: "Roshanal Team", date: "Mar 18, 2026", readTime: "7 min read",
  },
  {
    id: "4", slug: "top-10-security-cameras-2026",
    title: "Top 10 Security Cameras for Businesses in 2026",
    excerpt: "Our expert picks for the best commercial security cameras — from budget-friendly to enterprise-grade.",
    category: "Security", author: "Roshanal Team", date: "Mar 12, 2026", readTime: "10 min read",
  },
  {
    id: "5", slug: "kitchen-installation-guide-nigeria",
    title: "Kitchen Installation Guide: Indoor, Outdoor & Commercial",
    excerpt: "Step-by-step guide to planning and installing kitchens for homes, restaurants, and commercial facilities.",
    category: "Installation", author: "Roshanal Team", date: "Mar 5, 2026", readTime: "9 min read",
  },
  {
    id: "6", slug: "solar-power-system-sizing-calculation",
    title: "How to Size Your Solar Power System: Complete Calculation Guide",
    excerpt: "Learn how to calculate the right solar panel and battery setup for your home or office in Nigeria.",
    category: "Solar & Power", author: "Roshanal Team", date: "Feb 28, 2026", readTime: "11 min read",
  },
  {
    id: "7", slug: "access-control-biometric-vs-card",
    title: "Biometric vs Card Access Control: Which is Better?",
    excerpt: "Pros and cons of fingerprint, facial recognition, and card-based access control systems.",
    category: "Security", author: "Roshanal Team", date: "Feb 20, 2026", readTime: "5 min read",
  },
  {
    id: "8", slug: "boat-building-process-explained",
    title: "The Boat Building Process: From Design to Launch",
    excerpt: "An inside look at how custom boats are built — materials, construction stages, and timeline.",
    category: "Marine", author: "Roshanal Team", date: "Feb 14, 2026", readTime: "12 min read",
  },
];

const categories = ["All", "Security", "Marine", "Safety", "Installation", "Solar & Power"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const featured = blogPosts.filter((p) => p.featured);
  const filtered = blogPosts.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <span className="text-text-1 font-medium">Blog</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-navy to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-syne font-800 text-3xl mb-3">Roshanal Blog</h1>
          <p className="text-blue-200 mb-6">Expert insights on security, marine, safety, and technology</p>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg text-sm text-text-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue/30"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured */}
        {!searchQuery && activeCategory === "All" && (
          <section className="mb-12">
            <h2 className="font-syne font-700 text-xl text-text-1 mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-xl border border-border overflow-hidden hover:border-blue/30 transition-colors group">
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <Tag className="w-12 h-12 text-blue/20" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-blue bg-blue-50 px-2 py-1 rounded-full">{post.category}</span>
                    <h3 className="font-syne font-700 text-lg text-text-1 group-hover:text-blue mt-3 mb-2">{post.title}</h3>
                    <p className="text-sm text-text-3 line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-text-4">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat ? "bg-blue text-white" : "bg-white border border-border text-text-2 hover:border-blue/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* All Articles */}
        <div className="space-y-4">
          {filtered.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-xl border border-border p-5 flex gap-5 hover:border-blue/30 transition-colors group">
              <div className="w-32 h-24 bg-off-white rounded-lg flex-shrink-0 flex items-center justify-center">
                <Tag className="w-8 h-8 text-text-4/20" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-blue bg-blue-50 px-2 py-0.5 rounded-full">{post.category}</span>
                  <span className="text-xs text-text-4">{post.readTime}</span>
                </div>
                <h3 className="font-syne font-700 text-text-1 group-hover:text-blue mb-1 line-clamp-1">{post.title}</h3>
                <p className="text-sm text-text-3 line-clamp-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-4">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-border">
            <Search className="w-12 h-12 text-text-4/30 mx-auto mb-3" />
            <h3 className="font-syne font-600 text-text-1 mb-1">No articles found</h3>
            <p className="text-sm text-text-3">Try different keywords or browse all categories</p>
          </div>
        )}
      </div>
    </div>
  );
}
