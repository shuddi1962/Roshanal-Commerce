"use client";

import { useState } from "react";
import {
  Mail,
  Tag,
  Megaphone,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";

const marketingTabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "email", label: "Email Campaigns", icon: Mail },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "coupons", label: "Coupons & Discounts", icon: Tag },
  { id: "social", label: "Social Media", icon: Megaphone },
];

const campaigns = [
  { id: "1", name: "Easter Sale 2026", type: "email", status: "active", sent: 12500, opened: 4200, clicks: 890, revenue: "₦2.8M", startDate: "Mar 28" },
  { id: "2", name: "New Product Alert — Hikvision 8MP", type: "email", status: "draft", sent: 0, opened: 0, clicks: 0, revenue: "—", startDate: "Apr 5" },
  { id: "3", name: "Welcome Series (Automated)", type: "automation", status: "active", sent: 850, opened: 640, clicks: 210, revenue: "₦450K", startDate: "Jan 1" },
  { id: "4", name: "Abandoned Cart Recovery", type: "automation", status: "active", sent: 3200, opened: 1800, clicks: 620, revenue: "₦1.2M", startDate: "Jan 1" },
];

const coupons = [
  { code: "WELCOME10", type: "10% Off", usage: "234 / unlimited", status: "active", expires: "Dec 31, 2026" },
  { code: "ROSHANAL5", type: "₦5,000 Off", usage: "89 / 500", status: "active", expires: "Jun 30, 2026" },
  { code: "FREESHIP", type: "Free Shipping", usage: "567 / 1000", status: "active", expires: "May 31, 2026" },
  { code: "EASTER25", type: "25% Off", usage: "45 / 200", status: "expired", expires: "Apr 1, 2026" },
];

const seoPages = [
  { page: "/shop", title: "Shop All Products", score: 92, indexed: true, issues: 0 },
  { page: "/category/surveillance", title: "Surveillance & CCTV", score: 88, indexed: true, issues: 1 },
  { page: "/services/cctv-installation", title: "CCTV Installation Service", score: 85, indexed: true, issues: 0 },
  { page: "/services/boat-building", title: "Boat Building Service", score: 78, indexed: false, issues: 2 },
  { page: "/blog", title: "Blog", score: 90, indexed: true, issues: 0 },
];

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminShell title="Marketing" subtitle="Campaigns, SEO, and promotions">
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne font-700 text-2xl text-text-1">Marketing</h1>
          <p className="text-sm text-text-3 mt-1">Campaigns, SEO, coupons, and social media</p>
        </div>
        <Button variant="default" size="sm">
          <Plus className="w-3 h-3 mr-1" /> New Campaign
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6">
        {marketingTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-blue text-white" : "text-text-3 hover:bg-off-white"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="font-syne font-700 text-2xl text-blue">4</p>
              <p className="text-xs text-text-3 mt-1">Active Campaigns</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="font-syne font-700 text-2xl text-success">₦4.4M</p>
              <p className="text-xs text-text-3 mt-1">Campaign Revenue</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="font-syne font-700 text-2xl text-text-1">33.6%</p>
              <p className="text-xs text-text-3 mt-1">Email Open Rate</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="font-syne font-700 text-2xl text-warning">3</p>
              <p className="text-xs text-text-3 mt-1">Active Coupons</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => setActiveTab("email")} className="bg-white rounded-xl border border-border p-5 text-left hover:border-blue/30 group">
              <Mail className="w-6 h-6 text-blue mb-3" />
              <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-blue">Email Campaigns</h3>
              <p className="text-xs text-text-3 mt-1">4 campaigns active</p>
            </button>
            <button onClick={() => setActiveTab("seo")} className="bg-white rounded-xl border border-border p-5 text-left hover:border-blue/30 group">
              <Globe className="w-6 h-6 text-success mb-3" />
              <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-blue">SEO & Indexing</h3>
              <p className="text-xs text-text-3 mt-1">85 avg. SEO score</p>
            </button>
            <button onClick={() => setActiveTab("coupons")} className="bg-white rounded-xl border border-border p-5 text-left hover:border-blue/30 group">
              <Tag className="w-6 h-6 text-warning mb-3" />
              <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-blue">Coupons & Discounts</h3>
              <p className="text-xs text-text-3 mt-1">3 active coupons</p>
            </button>
          </div>
        </div>
      )}

      {/* Email Campaigns */}
      {activeTab === "email" && (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-off-white border-b border-border">
                <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Campaign</th>
                <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
                <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Sent</th>
                <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Opened</th>
                <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Clicks</th>
                <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Revenue</th>
                <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-border hover:bg-off-white/50">
                  <td className="p-3">
                    <p className="text-sm font-medium text-text-1">{c.name}</p>
                    <p className="text-xs text-text-4">{c.type} · Started {c.startDate}</p>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === "active" ? "bg-green-50 text-success" : "bg-yellow-50 text-warning"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-center text-sm text-text-2">{c.sent.toLocaleString()}</td>
                  <td className="p-3 text-center text-sm text-text-2">{c.opened.toLocaleString()}</td>
                  <td className="p-3 text-center text-sm text-text-2">{c.clicks.toLocaleString()}</td>
                  <td className="p-3 text-right font-syne font-600 text-sm text-text-1">{c.revenue}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Edit className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SEO */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="font-syne font-700 text-2xl text-success">85</p>
              <p className="text-xs text-text-3 mt-1">Avg. SEO Score</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="font-syne font-700 text-2xl text-blue">{seoPages.filter((p) => p.indexed).length}/{seoPages.length}</p>
              <p className="text-xs text-text-3 mt-1">Pages Indexed</p>
            </div>
            <div className="bg-white rounded-xl border border-border p-4">
              <p className="font-syne font-700 text-2xl text-warning">{seoPages.reduce((a, b) => a + b.issues, 0)}</p>
              <p className="text-xs text-text-3 mt-1">SEO Issues</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-off-white border-b border-border">
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Page</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Score</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Indexed</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Issues</th>
                </tr>
              </thead>
              <tbody>
                {seoPages.map((page) => (
                  <tr key={page.page} className="border-b border-border hover:bg-off-white/50">
                    <td className="p-3">
                      <p className="text-sm font-medium text-text-1">{page.title}</p>
                      <p className="text-xs text-text-4 font-mono">{page.page}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-syne font-700 text-sm ${page.score >= 85 ? "text-success" : page.score >= 70 ? "text-warning" : "text-red"}`}>
                        {page.score}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs font-medium ${page.indexed ? "text-success" : "text-red"}`}>
                        {page.indexed ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-3 text-center text-sm text-text-2">{page.issues}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupons */}
      {activeTab === "coupons" && (
        <div>
          <div className="flex justify-end mb-4">
            <Button variant="default" size="sm"><Plus className="w-3 h-3 mr-1" /> Create Coupon</Button>
          </div>
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-off-white border-b border-border">
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Code</th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Discount</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Usage</th>
                  <th className="p-3 text-center text-xs font-syne font-600 text-text-3 uppercase">Status</th>
                  <th className="p-3 text-left text-xs font-syne font-600 text-text-3 uppercase">Expires</th>
                  <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.code} className="border-b border-border hover:bg-off-white/50">
                    <td className="p-3 font-mono text-sm font-medium text-text-1">{coupon.code}</td>
                    <td className="p-3 text-sm text-text-2">{coupon.type}</td>
                    <td className="p-3 text-center text-sm text-text-3">{coupon.usage}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${coupon.status === "active" ? "bg-green-50 text-success" : "bg-red-50 text-red"}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-text-3">{coupon.expires}</td>
                    <td className="p-3 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Edit className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Social */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[
              { platform: "Instagram", followers: "12.5K", posts: 234, engagement: "4.2%" },
              { platform: "Facebook", followers: "8.3K", posts: 156, engagement: "3.1%" },
              { platform: "Twitter / X", followers: "5.8K", posts: 412, engagement: "2.8%" },
              { platform: "LinkedIn", followers: "2.1K", posts: 89, engagement: "5.6%" },
            ].map((p) => (
              <div key={p.platform} className="bg-white rounded-xl border border-border p-4">
                <h3 className="font-syne font-600 text-sm text-text-1 mb-3">{p.platform}</h3>
                <p className="font-syne font-700 text-xl text-text-1">{p.followers}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-text-3">
                  <span>{p.posts} posts</span>
                  <span className="text-success">{p.engagement} eng.</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <Megaphone className="w-8 h-8 text-blue mx-auto mb-3" />
            <h3 className="font-syne font-700 text-text-1 mb-2">Auto-Post Content</h3>
            <p className="text-sm text-text-3 mb-4">Automatically generate and schedule social media posts when products or blog articles are published.</p>
            <Button variant="default" size="sm">Configure Auto-Posting</Button>
          </div>
        </div>
      )}
    </div>
    </AdminShell>
  );
}
