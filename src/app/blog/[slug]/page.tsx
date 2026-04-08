"use client";

import Link from "next/link";
import { Clock, User, Calendar, ArrowLeft, Share2, MessageCircle, Send, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const title = params.slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-off-white min-h-screen">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-text-3">
          <Link href="/" className="hover:text-blue">Home</Link><span>/</span>
          <Link href="/blog" className="hover:text-blue">Blog</Link><span>/</span>
          <span className="text-text-1 font-medium line-clamp-1">{title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-text-3 hover:text-blue mb-6">
          <ArrowLeft className="w-3 h-3" /> Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-medium text-blue bg-blue-50 px-2.5 py-1 rounded-full">Security</span>
          <h1 className="font-syne font-800 text-3xl sm:text-4xl text-text-1 mt-4 mb-4 leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-3">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Roshanal Team</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Apr 1, 2026</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 8 min read</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="w-full h-64 sm:h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-8 flex items-center justify-center">
          <Tag className="w-20 h-20 text-blue/15" />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-border p-8 sm:p-12">
          <div className="prose prose-sm max-w-none text-text-2 leading-relaxed space-y-6">
            <p className="text-lg text-text-1 font-medium">
              Security is a top priority for every home and business owner. With crime rates fluctuating
              and the need for constant vigilance, investing in a quality CCTV system is no longer optional —
              it&apos;s essential.
            </p>

            <h2 className="font-syne font-700 text-xl text-text-1 mt-8">Why You Need CCTV</h2>
            <p>
              A professional surveillance system does more than record footage. It deters criminals,
              provides evidence in case of incidents, monitors employee productivity, and gives you
              peace of mind whether you&apos;re at home or away.
            </p>

            <h2 className="font-syne font-700 text-xl text-text-1 mt-8">Types of CCTV Systems</h2>
            <p>
              There are several types of CCTV systems available in the Nigerian market, each suited
              for different applications:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Analog HD (HDCVI/HDTVI)</strong> — Cost-effective, uses coaxial cable, suitable for small to medium setups.</li>
              <li><strong>IP Cameras</strong> — Network-based, higher resolution (4MP–8MP), advanced features like AI analytics.</li>
              <li><strong>Wireless</strong> — Easy installation, suitable for locations where cable routing is difficult.</li>
              <li><strong>PTZ (Pan-Tilt-Zoom)</strong> — Remote-controllable cameras ideal for large areas like warehouses and parking lots.</li>
            </ul>

            <h2 className="font-syne font-700 text-xl text-text-1 mt-8">Choosing the Right System</h2>
            <p>
              The right system depends on your specific needs: coverage area, number of cameras,
              storage requirements, and budget. We recommend consulting with a professional installer
              who can survey your property and recommend the optimal configuration.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 my-8">
              <h3 className="font-syne font-700 text-text-1 mb-2">Need Professional Help?</h3>
              <p className="text-sm text-text-3 mb-4">
                Roshanal Global offers professional CCTV installation services across Nigeria.
                Get a free site survey and quote.
              </p>
              <Link href="/services/cctv-installation">
                <Button variant="default" size="sm">Book Installation</Button>
              </Link>
            </div>

            <h2 className="font-syne font-700 text-xl text-text-1 mt-8">Cost Breakdown</h2>
            <p>
              A basic 4-camera home system starts from ₦350,000 including installation.
              Business systems with 8–16 cameras range from ₦650,000 to ₦1,200,000.
              Enterprise solutions are custom-quoted based on requirements.
            </p>

            <h2 className="font-syne font-700 text-xl text-text-1 mt-8">Conclusion</h2>
            <p>
              Investing in a quality CCTV system is one of the smartest decisions you can make for
              your property&apos;s security. Whether you choose a basic analog system or a full IP
              setup with AI analytics, professional installation ensures your system works
              reliably from day one.
            </p>
          </div>
        </div>

        {/* Share & Tags */}
        <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-border p-5">
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-3 mr-2">Tags:</span>
            {["CCTV", "Security", "Installation", "Nigeria"].map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-off-white text-xs text-text-3 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-3 mr-1">Share:</span>
            <button className="w-8 h-8 rounded-full bg-off-white flex items-center justify-center text-text-4 hover:text-blue hover:bg-blue-50">
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-off-white flex items-center justify-center text-text-4 hover:text-blue hover:bg-blue-50">
              <Send className="w-3.5 h-3.5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-off-white flex items-center justify-center text-text-4 hover:text-blue hover:bg-blue-50">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12">
          <h2 className="font-syne font-700 text-xl text-text-1 mb-6">Related Articles</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Top 10 Security Cameras for Businesses in 2026", slug: "top-10-security-cameras-2026", cat: "Security" },
              { title: "Fire Alarm System Types: Comparison", slug: "fire-alarm-system-types-comparison", cat: "Safety" },
              { title: "Biometric vs Card Access Control", slug: "access-control-biometric-vs-card", cat: "Security" },
            ].map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-white rounded-xl border border-border p-4 hover:border-blue/30 group">
                <div className="h-24 bg-off-white rounded-lg mb-3 flex items-center justify-center">
                  <Tag className="w-6 h-6 text-text-4/20" />
                </div>
                <span className="text-xs text-blue">{post.cat}</span>
                <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-blue mt-1 line-clamp-2">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
