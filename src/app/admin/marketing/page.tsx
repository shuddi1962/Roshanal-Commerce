"use client";

import { useState, useEffect } from "react";
import {
  Mail, Tag, Megaphone, Plus, Eye, Edit, BarChart3, Globe, X, Trash2,
  Copy, ToggleLeft, ToggleRight, Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

const marketingTabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "email", label: "Email Campaigns", icon: Mail },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "coupons", label: "Coupons & Discounts", icon: Tag },
  { id: "social", label: "Social Media", icon: Megaphone },
];

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  sent: number;
  opened: number;
  clicks: number;
  revenue: string;
  start_date: string;
  subject?: string;
  body?: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_label: string;
  usage_count: number;
  usage_limit: number | null;
  status: string;
  expires: string;
  min_order?: number | null;
}

interface SeoPage {
  id: string;
  page: string;
  title: string;
  meta_description?: string;
  score: number;
  indexed: boolean;
  issues: number;
}

const seedCampaigns: Omit<Campaign, "id">[] = [
  { name: "Easter Sale 2026", type: "email", status: "active", sent: 12500, opened: 4200, clicks: 890, revenue: "₦2.8M", start_date: "2026-03-28", subject: "Easter deals up to 40% off!", body: "Shop our Easter collection" },
  { name: "New Product Alert — Hikvision 8MP", type: "email", status: "draft", sent: 0, opened: 0, clicks: 0, revenue: "—", start_date: "2026-04-05", subject: "Introducing Hikvision 8MP cameras", body: "Premium surveillance just arrived" },
  { name: "Welcome Series (Automated)", type: "automation", status: "active", sent: 850, opened: 640, clicks: 210, revenue: "₦450K", start_date: "2026-01-01" },
  { name: "Abandoned Cart Recovery", type: "automation", status: "active", sent: 3200, opened: 1800, clicks: 620, revenue: "₦1.2M", start_date: "2026-01-01" },
];

const seedCoupons: Omit<Coupon, "id">[] = [
  { code: "WELCOME10", discount_type: "percentage", discount_label: "10% Off", usage_count: 234, usage_limit: null, status: "active", expires: "2026-12-31" },
  { code: "ROSHANAL5", discount_type: "fixed", discount_label: "₦5,000 Off", usage_count: 89, usage_limit: 500, status: "active", expires: "2026-06-30", min_order: 50000 },
  { code: "FREESHIP", discount_type: "free_shipping", discount_label: "Free Shipping", usage_count: 567, usage_limit: 1000, status: "active", expires: "2026-05-31" },
  { code: "EASTER25", discount_type: "percentage", discount_label: "25% Off", usage_count: 45, usage_limit: 200, status: "expired", expires: "2026-04-01" },
];

const seedSeoPages: Omit<SeoPage, "id">[] = [
  { page: "/shop", title: "Shop All Products", meta_description: "Browse all products at Roshanal Global", score: 92, indexed: true, issues: 0 },
  { page: "/category/surveillance", title: "Surveillance & CCTV", score: 88, indexed: true, issues: 1 },
  { page: "/services/cctv-installation", title: "CCTV Installation Service", score: 85, indexed: true, issues: 0 },
  { page: "/services/boat-building", title: "Boat Building Service", score: 78, indexed: false, issues: 2 },
  { page: "/blog", title: "Blog", score: 90, indexed: true, issues: 0 },
];

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [seoPages, setSeoPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);
  const [campaignForm, setCampaignForm] = useState({ name: "", type: "email", subject: "", body: "", status: "draft" });

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState({ code: "", discount_type: "percentage", discount_label: "", usage_limit: "", expires: "", min_order: "" });

  const [showSeoModal, setShowSeoModal] = useState(false);
  const [editSeo, setEditSeo] = useState<SeoPage | null>(null);
  const [seoForm, setSeoForm] = useState({ title: "", meta_description: "" });

  const [showAutoPostModal, setShowAutoPostModal] = useState(false);
  const [autoPostSettings, setAutoPostSettings] = useState({ instagram: true, facebook: true, twitter: false, linkedin: false, on_product: true, on_blog: true });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [cRes, cpRes, sRes] = await Promise.all([
        insforge.database.from("marketing_campaigns").select("*").order("start_date", { ascending: false }),
        insforge.database.from("coupons").select("*").order("created_at", { ascending: false }),
        insforge.database.from("seo_pages").select("*").order("score", { ascending: false }),
      ]);

      if (cRes.data && cRes.data.length > 0) setCampaigns(cRes.data);
      else {
        for (const c of seedCampaigns) await insforge.database.from("marketing_campaigns").insert(c);
        const { data } = await insforge.database.from("marketing_campaigns").select("*");
        if (data) setCampaigns(data);
      }

      if (cpRes.data && cpRes.data.length > 0) setCoupons(cpRes.data);
      else {
        for (const c of seedCoupons) await insforge.database.from("coupons").insert(c);
        const { data } = await insforge.database.from("coupons").select("*");
        if (data) setCoupons(data);
      }

      if (sRes.data && sRes.data.length > 0) setSeoPages(sRes.data);
      else {
        for (const s of seedSeoPages) await insforge.database.from("seo_pages").insert(s);
        const { data } = await insforge.database.from("seo_pages").select("*");
        if (data) setSeoPages(data);
      }
    } catch (err) {
      console.error("Marketing load error:", err);
      setCampaigns(seedCampaigns.map((c, i) => ({ ...c, id: String(i + 1) })));
      setCoupons(seedCoupons.map((c, i) => ({ ...c, id: String(i + 1) })));
      setSeoPages(seedSeoPages.map((s, i) => ({ ...s, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  };

  // Campaign CRUD
  const saveCampaign = async () => {
    try {
      if (editCampaign) {
        await insforge.database.from("marketing_campaigns").update(campaignForm).eq("id", editCampaign.id);
        setCampaigns((prev) => prev.map((c) => c.id === editCampaign.id ? { ...c, ...campaignForm } : c));
      } else {
        const { data } = await insforge.database.from("marketing_campaigns").insert({
          ...campaignForm, sent: 0, opened: 0, clicks: 0, revenue: "—", start_date: new Date().toISOString().split("T")[0],
        }).select();
        if (data) setCampaigns((prev) => [data[0], ...prev]);
      }
      setShowCampaignModal(false);
      setEditCampaign(null);
    } catch (err) { console.error(err); }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await insforge.database.from("marketing_campaigns").delete().eq("id", id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const toggleCampaignStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    try {
      await insforge.database.from("marketing_campaigns").update({ status: newStatus }).eq("id", campaign.id);
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? { ...c, status: newStatus } : c));
    } catch (err) { console.error(err); }
  };

  // Coupon CRUD
  const saveCoupon = async () => {
    try {
      const payload = {
        code: couponForm.code.toUpperCase(),
        discount_type: couponForm.discount_type,
        discount_label: couponForm.discount_label,
        usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit) : null,
        expires: couponForm.expires,
        min_order: couponForm.min_order ? parseInt(couponForm.min_order) : null,
      };
      if (editCoupon) {
        await insforge.database.from("coupons").update(payload).eq("id", editCoupon.id);
        setCoupons((prev) => prev.map((c) => c.id === editCoupon.id ? { ...c, ...payload } : c));
      } else {
        const { data } = await insforge.database.from("coupons").insert({ ...payload, usage_count: 0, status: "active" }).select();
        if (data) setCoupons((prev) => [data[0], ...prev]);
      }
      setShowCouponModal(false);
      setEditCoupon(null);
    } catch (err) { console.error(err); }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await insforge.database.from("coupons").delete().eq("id", id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // SEO Edit
  const saveSeo = async () => {
    if (!editSeo) return;
    try {
      await insforge.database.from("seo_pages").update({ title: seoForm.title, meta_description: seoForm.meta_description }).eq("id", editSeo.id);
      setSeoPages((prev) => prev.map((s) => s.id === editSeo.id ? { ...s, ...seoForm } : s));
      setShowSeoModal(false);
      setEditSeo(null);
    } catch (err) { console.error(err); }
  };

  // Auto-post save
  const saveAutoPost = async () => {
    try {
      await insforge.database.from("settings").upsert({ key: "auto_post_settings", value: autoPostSettings });
      setShowAutoPostModal(false);
    } catch (err) { console.error(err); }
  };

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const activeCoupons = coupons.filter((c) => c.status === "active").length;
  const avgSeo = seoPages.length > 0 ? Math.round(seoPages.reduce((a, b) => a + b.score, 0) / seoPages.length) : 0;

  return (
    <AdminShell title="Marketing" subtitle="Campaigns, SEO, and promotions">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-syne font-700 text-2xl text-text-1">Marketing</h1>
            <p className="text-sm text-text-3 mt-1">Campaigns, SEO, coupons, and social media</p>
          </div>
          <Button variant="default" size="sm" onClick={() => { setEditCampaign(null); setCampaignForm({ name: "", type: "email", subject: "", body: "", status: "draft" }); setShowCampaignModal(true); }}>
            <Plus className="w-3 h-3 mr-1" /> New Campaign
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6">
          {marketingTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-blue text-white" : "text-text-3 hover:bg-off-white"}`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-4 text-sm">Loading marketing data...</div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl border border-border p-4">
                    <p className="font-syne font-700 text-2xl text-blue">{activeCampaigns}</p>
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
                    <p className="font-syne font-700 text-2xl text-warning">{activeCoupons}</p>
                    <p className="text-xs text-text-3 mt-1">Active Coupons</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <button onClick={() => setActiveTab("email")} className="bg-white rounded-xl border border-border p-5 text-left hover:border-blue/30 group">
                    <Mail className="w-6 h-6 text-blue mb-3" />
                    <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-blue">Email Campaigns</h3>
                    <p className="text-xs text-text-3 mt-1">{activeCampaigns} campaigns active</p>
                  </button>
                  <button onClick={() => setActiveTab("seo")} className="bg-white rounded-xl border border-border p-5 text-left hover:border-blue/30 group">
                    <Globe className="w-6 h-6 text-success mb-3" />
                    <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-blue">SEO & Indexing</h3>
                    <p className="text-xs text-text-3 mt-1">{avgSeo} avg. SEO score</p>
                  </button>
                  <button onClick={() => setActiveTab("coupons")} className="bg-white rounded-xl border border-border p-5 text-left hover:border-blue/30 group">
                    <Tag className="w-6 h-6 text-warning mb-3" />
                    <h3 className="font-syne font-600 text-sm text-text-1 group-hover:text-blue">Coupons & Discounts</h3>
                    <p className="text-xs text-text-3 mt-1">{activeCoupons} active coupons</p>
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
                          <p className="text-xs text-text-4">{c.type} · Started {c.start_date}</p>
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => toggleCampaignStatus(c)}>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${c.status === "active" ? "bg-green-50 text-success" : c.status === "paused" ? "bg-gray-100 text-text-4" : "bg-yellow-50 text-warning"}`}>
                              {c.status}
                            </span>
                          </button>
                        </td>
                        <td className="p-3 text-center text-sm text-text-2">{(c.sent || 0).toLocaleString()}</td>
                        <td className="p-3 text-center text-sm text-text-2">{(c.opened || 0).toLocaleString()}</td>
                        <td className="p-3 text-center text-sm text-text-2">{(c.clicks || 0).toLocaleString()}</td>
                        <td className="p-3 text-right font-syne font-600 text-sm text-text-1">{c.revenue}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewCampaign(c)} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="View"><Eye className="w-3.5 h-3.5" /></button>
                            <button onClick={() => { setEditCampaign(c); setCampaignForm({ name: c.name, type: c.type, subject: c.subject || "", body: c.body || "", status: c.status }); setShowCampaignModal(true); }} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteCampaign(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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
                    <p className="font-syne font-700 text-2xl text-success">{avgSeo}</p>
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
                        <th className="p-3 text-right text-xs font-syne font-600 text-text-3 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seoPages.map((page) => (
                        <tr key={page.id} className="border-b border-border hover:bg-off-white/50">
                          <td className="p-3">
                            <p className="text-sm font-medium text-text-1">{page.title}</p>
                            <p className="text-xs text-text-4 font-mono">{page.page}</p>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`font-syne font-700 text-sm ${page.score >= 85 ? "text-success" : page.score >= 70 ? "text-warning" : "text-red"}`}>{page.score}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`text-xs font-medium ${page.indexed ? "text-success" : "text-red"}`}>{page.indexed ? "Yes" : "No"}</span>
                          </td>
                          <td className="p-3 text-center text-sm text-text-2">{page.issues}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => { setEditSeo(page); setSeoForm({ title: page.title, meta_description: page.meta_description || "" }); setShowSeoModal(true); }} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Edit className="w-3.5 h-3.5" /></button>
                          </td>
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
                  <Button variant="default" size="sm" onClick={() => { setEditCoupon(null); setCouponForm({ code: "", discount_type: "percentage", discount_label: "", usage_limit: "", expires: "", min_order: "" }); setShowCouponModal(true); }}>
                    <Plus className="w-3 h-3 mr-1" /> Create Coupon
                  </Button>
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
                        <tr key={coupon.id} className="border-b border-border hover:bg-off-white/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium text-text-1">{coupon.code}</span>
                              <button onClick={() => copyCouponCode(coupon.code)} className="p-1 hover:bg-off-white rounded text-text-4 hover:text-blue" title="Copy"><Copy size={12} /></button>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-text-2">{coupon.discount_label}</td>
                          <td className="p-3 text-center text-sm text-text-3">{coupon.usage_count} / {coupon.usage_limit || "∞"}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${coupon.status === "active" ? "bg-green-50 text-success" : "bg-red-50 text-red"}`}>{coupon.status}</span>
                          </td>
                          <td className="p-3 text-sm text-text-3">{coupon.expires}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditCoupon(coupon); setCouponForm({ code: coupon.code, discount_type: coupon.discount_type, discount_label: coupon.discount_label, usage_limit: coupon.usage_limit ? String(coupon.usage_limit) : "", expires: coupon.expires, min_order: coupon.min_order ? String(coupon.min_order) : "" }); setShowCouponModal(true); }} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Edit className="w-3.5 h-3.5" /></button>
                              <button onClick={() => deleteCoupon(coupon.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
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
                  <Button variant="default" size="sm" onClick={() => setShowAutoPostModal(true)}>Configure Auto-Posting</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Campaign Create/Edit Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCampaignModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{editCampaign ? "Edit Campaign" : "New Campaign"}</h2>
              <button onClick={() => setShowCampaignModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Campaign Name</label>
                <input value={campaignForm.name} onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Type</label>
                  <select value={campaignForm.type} onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    <option value="email">Email</option><option value="sms">SMS</option><option value="automation">Automation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Status</label>
                  <select value={campaignForm.status} onChange={(e) => setCampaignForm({ ...campaignForm, status: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    <option value="draft">Draft</option><option value="active">Active</option><option value="paused">Paused</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Subject Line</label>
                <input value={campaignForm.subject} onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Body</label>
                <textarea value={campaignForm.body} onChange={(e) => setCampaignForm({ ...campaignForm, body: e.target.value })} className="w-full h-24 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-blue resize-none" />
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowCampaignModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveCampaign} disabled={!campaignForm.name}><Save size={14} className="mr-1" /> {editCampaign ? "Update" : "Create"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* View Campaign Modal */}
      {viewCampaign && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewCampaign(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{viewCampaign.name}</h2>
              <button onClick={() => setViewCampaign(null)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Type</p><p className="text-sm text-text-1 mt-0.5">{viewCampaign.type}</p></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Status</p><span className={`text-xs font-medium ${viewCampaign.status === "active" ? "text-success" : "text-warning"}`}>{viewCampaign.status}</span></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Sent</p><p className="text-sm font-semibold">{(viewCampaign.sent || 0).toLocaleString()}</p></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Opened</p><p className="text-sm font-semibold">{(viewCampaign.opened || 0).toLocaleString()}</p></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Clicks</p><p className="text-sm font-semibold">{(viewCampaign.clicks || 0).toLocaleString()}</p></div>
                <div><p className="text-[10px] text-text-4 uppercase font-semibold">Revenue</p><p className="text-sm font-semibold">{viewCampaign.revenue}</p></div>
              </div>
              {viewCampaign.subject && <div><p className="text-[10px] text-text-4 uppercase font-semibold">Subject</p><p className="text-sm text-text-1 mt-0.5">{viewCampaign.subject}</p></div>}
              {viewCampaign.body && <div><p className="text-[10px] text-text-4 uppercase font-semibold">Body</p><p className="text-sm text-text-2 mt-0.5 bg-off-white p-3 rounded-lg">{viewCampaign.body}</p></div>}
            </div>
          </div>
        </div>
      )}

      {/* Coupon Create/Edit Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCouponModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{editCoupon ? "Edit Coupon" : "Create Coupon"}</h2>
              <button onClick={() => setShowCouponModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Coupon Code</label>
                <input value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="w-full h-10 px-3 rounded-lg border border-border text-sm font-mono focus:outline-none focus:border-blue" placeholder="e.g. SUMMER20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Type</label>
                  <select value={couponForm.discount_type} onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    <option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option><option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Discount Label</label>
                  <input value={couponForm.discount_label} onChange={(e) => setCouponForm({ ...couponForm, discount_label: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="e.g. 20% Off" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Usage Limit</label>
                  <input type="number" value={couponForm.usage_limit} onChange={(e) => setCouponForm({ ...couponForm, usage_limit: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="Unlimited" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Min Order (₦)</label>
                  <input type="number" value={couponForm.min_order} onChange={(e) => setCouponForm({ ...couponForm, min_order: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="No minimum" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Expires</label>
                <input type="date" value={couponForm.expires} onChange={(e) => setCouponForm({ ...couponForm, expires: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowCouponModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveCoupon} disabled={!couponForm.code || !couponForm.discount_label}>{editCoupon ? "Update Coupon" : "Create Coupon"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* SEO Edit Modal */}
      {showSeoModal && editSeo && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowSeoModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">Edit SEO — {editSeo.page}</h2>
              <button onClick={() => setShowSeoModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Page Title</label>
                <input value={seoForm.title} onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Meta Description</label>
                <textarea value={seoForm.meta_description} onChange={(e) => setSeoForm({ ...seoForm, meta_description: e.target.value })} className="w-full h-24 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-blue resize-none" placeholder="SEO meta description..." />
                <p className="text-[10px] text-text-4 mt-1">{seoForm.meta_description.length}/160 characters</p>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowSeoModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveSeo}>Save SEO</Button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Post Config Modal */}
      {showAutoPostModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowAutoPostModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[420px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">Auto-Post Settings</h2>
              <button onClick={() => setShowAutoPostModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-text-2 mb-2">Platforms</p>
                {(["instagram", "facebook", "twitter", "linkedin"] as const).map((p) => (
                  <label key={p} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-text-1 capitalize">{p}</span>
                    <button onClick={() => setAutoPostSettings((prev) => ({ ...prev, [p]: !prev[p] }))}>
                      {autoPostSettings[p] ? <ToggleRight size={24} className="text-success" /> : <ToggleLeft size={24} className="text-text-4" />}
                    </button>
                  </label>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-text-2 mb-2">Triggers</p>
                <label className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-text-1">New Product Published</span>
                  <button onClick={() => setAutoPostSettings((prev) => ({ ...prev, on_product: !prev.on_product }))}>
                    {autoPostSettings.on_product ? <ToggleRight size={24} className="text-success" /> : <ToggleLeft size={24} className="text-text-4" />}
                  </button>
                </label>
                <label className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-1">New Blog Post Published</span>
                  <button onClick={() => setAutoPostSettings((prev) => ({ ...prev, on_blog: !prev.on_blog }))}>
                    {autoPostSettings.on_blog ? <ToggleRight size={24} className="text-success" /> : <ToggleLeft size={24} className="text-text-4" />}
                  </button>
                </label>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowAutoPostModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveAutoPost}><Save size={14} className="mr-1" /> Save Settings</Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
