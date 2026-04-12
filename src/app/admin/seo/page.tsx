"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Search, Globe, TrendingUp, FileText, Link2, AlertTriangle,
  Check, X, BarChart3, ExternalLink, RefreshCw,
  Zap, Code, Loader2, Save, ToggleLeft, ToggleRight,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "pages", label: "Page SEO", icon: FileText },
  { id: "keywords", label: "Keywords", icon: Search },
  { id: "sitemap", label: "Sitemap", icon: Globe },
  { id: "schema", label: "Schema Markup", icon: Code },
  { id: "performance", label: "Performance", icon: Zap },
];

interface PageAudit {
  id?: string;
  url: string;
  title: string;
  score: number;
  issues: number;
  title_tag: string;
  meta_desc: boolean;
  h1: boolean;
  images_alt: string;
  canonical: boolean;
}

interface Keyword {
  id?: string;
  keyword: string;
  volume: number;
  position: number;
  trend: string;
  difficulty: number;
}

interface SitemapConfig {
  auto_generate: boolean;
  include_products: boolean;
  include_categories: boolean;
  include_blog: boolean;
  update_frequency: string;
}

interface SchemaItem {
  name: string;
  desc: string;
  active: boolean;
}

const defaultPageAudits: PageAudit[] = [
  { url: "/", title: "Homepage", score: 92, issues: 1, title_tag: "Roshanal Global — Security Systems, Marine, Safety", meta_desc: true, h1: true, images_alt: "23/24", canonical: true },
  { url: "/shop", title: "Shop", score: 78, issues: 3, title_tag: "Shop All Products | Roshanal Global", meta_desc: true, h1: true, images_alt: "18/24", canonical: true },
  { url: "/categories/cctv-cameras", title: "CCTV Cameras", score: 85, issues: 2, title_tag: "CCTV Cameras & Surveillance | Roshanal Global", meta_desc: true, h1: true, images_alt: "12/12", canonical: false },
  { url: "/product/hikvision-4mp", title: "Hikvision 4MP Camera", score: 68, issues: 4, title_tag: "Missing", meta_desc: false, h1: true, images_alt: "3/5", canonical: false },
  { url: "/about", title: "About Us", score: 55, issues: 5, title_tag: "About | Roshanal", meta_desc: false, h1: false, images_alt: "2/6", canonical: false },
];

const defaultKeywords: Keyword[] = [
  { keyword: "CCTV cameras Nigeria", volume: 8100, position: 3, trend: "up", difficulty: 42 },
  { keyword: "fire alarm system Lagos", volume: 2400, position: 7, trend: "up", difficulty: 35 },
  { keyword: "marine accessories Port Harcourt", volume: 1200, position: 1, trend: "stable", difficulty: 28 },
  { keyword: "boat engines Nigeria", volume: 3600, position: 5, trend: "down", difficulty: 48 },
  { keyword: "Yamaha outboard engine price", volume: 5400, position: 12, trend: "up", difficulty: 55 },
  { keyword: "security systems installation", volume: 4800, position: 8, trend: "stable", difficulty: 52 },
  { keyword: "access control systems", volume: 2900, position: 15, trend: "up", difficulty: 45 },
  { keyword: "kitchen equipment Nigeria", volume: 1800, position: 4, trend: "up", difficulty: 30 },
];

const defaultSchemas: SchemaItem[] = [
  { name: "Organization", desc: "Company info, logo, contact", active: true },
  { name: "Product", desc: "Product pages with price, availability, reviews", active: true },
  { name: "BreadcrumbList", desc: "Navigation breadcrumbs", active: true },
  { name: "LocalBusiness", desc: "Branch locations with hours", active: false },
  { name: "FAQPage", desc: "FAQ sections with questions/answers", active: false },
  { name: "Review / AggregateRating", desc: "Customer reviews and ratings", active: true },
];

export default function SEOToolsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageAudits, setPageAudits] = useState<PageAudit[]>(defaultPageAudits);
  const [keywords, setKeywords] = useState<Keyword[]>(defaultKeywords);
  const [sitemapConfig, setSitemapConfig] = useState<SitemapConfig>({
    auto_generate: true,
    include_products: true,
    include_categories: true,
    include_blog: true,
    update_frequency: "Daily",
  });
  const [schemas, setSchemas] = useState<SchemaItem[]>(defaultSchemas);

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    try {
      const { data: settingsData } = await insforge.database.from("settings").select("*");
      if (settingsData) {
        for (const row of settingsData) {
          const val = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
          switch (row.key) {
            case "seo_page_audits": setPageAudits(val); break;
            case "seo_keywords": setKeywords(val); break;
            case "seo_sitemap_config": setSitemapConfig(val); break;
            case "seo_schemas": setSchemas(val); break;
          }
        }
      }
    } catch (e) {
      console.error("Failed to load SEO data:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: unknown) => {
    setSaving(true);
    try {
      const { data: existing } = await insforge.database.from("settings").select("*").eq("key", key);
      if (existing && existing.length > 0) {
        await insforge.database.from("settings").update({ value: JSON.stringify(value), updated_at: new Date().toISOString() }).eq("key", key);
      } else {
        await insforge.database.from("settings").insert({ key, value: JSON.stringify(value) });
      }
    } catch (e) {
      console.error("Failed to save:", e);
    } finally {
      setSaving(false);
    }
  };

  const toggleSchema = (index: number) => {
    const updated = [...schemas];
    updated[index] = { ...updated[index], active: !updated[index].active };
    setSchemas(updated);
    saveSetting("seo_schemas", updated);
  };

  const avgScore = pageAudits.length > 0 ? Math.round(pageAudits.reduce((s, p) => s + p.score, 0) / pageAudits.length) : 0;
  const totalIssues = pageAudits.reduce((s, p) => s + p.issues, 0);

  if (loading) {
    return (
      <AdminShell title="SEO Tools" subtitle="Search engine optimization & site health">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue" size={32} />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="SEO Tools" subtitle="Search engine optimization & site health">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto bg-white rounded-xl p-1 border border-gray-200 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-blue text-white" : "text-text-3 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "SEO Score", value: `${avgScore}/100`, color: avgScore >= 80 ? "text-green-600" : "text-yellow-600", icon: TrendingUp },
              { label: "Total Issues", value: totalIssues, color: "text-red", icon: AlertTriangle },
              { label: "Indexed Pages", value: pageAudits.length.toString(), color: "text-blue", icon: Globe },
              { label: "Backlinks", value: "156", color: "text-purple-600", icon: Link2 },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-text-4 uppercase tracking-wider font-semibold">{card.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                  </div>
                  <card.icon size={20} className={card.color} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Fixes */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <h3 className="font-semibold text-text-1 mb-3 flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" />
              Quick Fixes
            </h3>
            <div className="space-y-2">
              {(() => {
                const fixes: { issue: string; severity: string; fix: string }[] = [];
                const missingMeta = pageAudits.filter(p => !p.meta_desc).length;
                const missingH1 = pageAudits.filter(p => !p.h1).length;
                const missingCanonical = pageAudits.filter(p => !p.canonical).length;
                if (missingMeta > 0) fixes.push({ issue: `${missingMeta} page${missingMeta > 1 ? "s" : ""} missing meta descriptions`, severity: "high", fix: "Auto-generate" });
                if (missingCanonical > 0) fixes.push({ issue: `${missingCanonical} page${missingCanonical > 1 ? "s" : ""} missing canonical URL`, severity: "medium", fix: "Add Canonical" });
                if (missingH1 > 0) fixes.push({ issue: `${missingH1} page${missingH1 > 1 ? "s" : ""} missing H1 tag`, severity: "low", fix: "Fix Now" });
                if (fixes.length === 0) fixes.push({ issue: "No critical issues found", severity: "none", fix: "" });
                return fixes.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        item.severity === "high" ? "bg-red" : item.severity === "medium" ? "bg-yellow-500" : item.severity === "low" ? "bg-blue" : "bg-green-500"
                      }`} />
                      <span className="text-sm text-text-2">{item.issue}</span>
                    </div>
                    {item.fix && <button className="text-xs text-blue font-semibold hover:underline">{item.fix}</button>}
                  </div>
                ));
              })()}
            </div>
          </div>
        </>
      )}

      {activeTab === "pages" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-text-1">Page-by-Page Audit</h3>
            <button onClick={() => { saveSetting("seo_page_audits", pageAudits); }} className="flex items-center gap-1.5 text-xs text-blue font-semibold hover:underline">
              <RefreshCw size={12} />
              Re-scan All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 text-text-4 font-medium">Page</th>
                  <th className="text-left p-3 text-text-4 font-medium">Score</th>
                  <th className="text-left p-3 text-text-4 font-medium">Title Tag</th>
                  <th className="text-center p-3 text-text-4 font-medium">Meta Desc</th>
                  <th className="text-center p-3 text-text-4 font-medium">H1</th>
                  <th className="text-left p-3 text-text-4 font-medium">Images Alt</th>
                  <th className="text-center p-3 text-text-4 font-medium">Canonical</th>
                  <th className="text-left p-3 text-text-4 font-medium">Issues</th>
                </tr>
              </thead>
              <tbody>
                {pageAudits.map((page) => (
                  <tr key={page.url} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium text-text-1 text-xs">{page.title}</p>
                      <p className="text-[10px] text-text-4 font-mono">{page.url}</p>
                    </td>
                    <td className="p-3">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        page.score >= 80 ? "bg-green-50 text-green-600" : page.score >= 60 ? "bg-yellow-50 text-yellow-600" : "bg-red/10 text-red"
                      }`}>
                        {page.score}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-text-3 max-w-[200px] truncate">{page.title_tag}</td>
                    <td className="p-3 text-center">
                      {page.meta_desc ? <Check size={14} className="text-green-600 mx-auto" /> : <X size={14} className="text-red mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {page.h1 ? <Check size={14} className="text-green-600 mx-auto" /> : <X size={14} className="text-red mx-auto" />}
                    </td>
                    <td className="p-3 text-xs text-text-3">{page.images_alt}</td>
                    <td className="p-3 text-center">
                      {page.canonical ? <Check size={14} className="text-green-600 mx-auto" /> : <X size={14} className="text-red mx-auto" />}
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-semibold text-red">{page.issues}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "keywords" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-text-1">Keyword Rankings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 text-text-4 font-medium">Keyword</th>
                  <th className="text-left p-3 text-text-4 font-medium">Volume</th>
                  <th className="text-left p-3 text-text-4 font-medium">Position</th>
                  <th className="text-left p-3 text-text-4 font-medium">Trend</th>
                  <th className="text-left p-3 text-text-4 font-medium">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw) => (
                  <tr key={kw.keyword} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-3 font-medium text-text-1 text-xs">{kw.keyword}</td>
                    <td className="p-3 text-xs text-text-3">{kw.volume.toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        kw.position <= 3 ? "bg-green-50 text-green-600" : kw.position <= 10 ? "bg-yellow-50 text-yellow-600" : "bg-red/10 text-red"
                      }`}>
                        #{kw.position}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-medium ${
                        kw.trend === "up" ? "text-green-600" : kw.trend === "down" ? "text-red" : "text-text-4"
                      }`}>
                        {kw.trend === "up" ? "↑ Rising" : kw.trend === "down" ? "↓ Falling" : "→ Stable"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${kw.difficulty <= 30 ? "bg-green-500" : kw.difficulty <= 50 ? "bg-yellow-500" : "bg-red"}`}
                            style={{ width: `${kw.difficulty}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-text-4">{kw.difficulty}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "sitemap" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h3 className="font-bold text-text-1 mb-4">Sitemap Configuration</h3>
          <div className="space-y-4">
            {[
              { key: "auto_generate" as const, label: "Auto-generate Sitemap", desc: "Automatically update sitemap.xml on content changes" },
              { key: "include_products" as const, label: "Include Product Pages", desc: "Add all product URLs to sitemap" },
              { key: "include_categories" as const, label: "Include Category Pages", desc: "Add category URLs to sitemap" },
              { key: "include_blog" as const, label: "Include Blog Posts", desc: "Add blog post URLs to sitemap" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-text-1">{item.label}</p>
                  <p className="text-xs text-text-4">{item.desc}</p>
                </div>
                <button onClick={() => {
                  const updated = { ...sitemapConfig, [item.key]: !sitemapConfig[item.key] };
                  setSitemapConfig(updated);
                  saveSetting("seo_sitemap_config", updated);
                }}>
                  {sitemapConfig[item.key] ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                </button>
              </div>
            ))}
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Update Frequency</label>
              <select
                value={sitemapConfig.update_frequency}
                onChange={(e) => {
                  const updated = { ...sitemapConfig, update_frequency: e.target.value };
                  setSitemapConfig(updated);
                  saveSetting("seo_sitemap_config", updated);
                }}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => saveSetting("seo_sitemap_config", sitemapConfig)}
                className="h-10 px-5 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Regenerate Sitemap
              </button>
              <button className="h-10 px-5 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <ExternalLink size={14} />
                View sitemap.xml
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "schema" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h3 className="font-bold text-text-1 mb-4">Structured Data / Schema Markup</h3>
          <div className="space-y-3">
            {schemas.map((schema, idx) => (
              <div key={schema.name} className="flex items-center justify-between py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-text-1">{schema.name}</p>
                  <p className="text-xs text-text-4">{schema.desc}</p>
                </div>
                <button onClick={() => toggleSchema(idx)}>
                  {schema.active ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "performance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "LCP", value: "1.8s", status: "good", desc: "Largest Contentful Paint" },
              { label: "FID", value: "45ms", status: "good", desc: "First Input Delay" },
              { label: "CLS", value: "0.08", status: "needs-improvement", desc: "Cumulative Layout Shift" },
              { label: "TTFB", value: "320ms", status: "good", desc: "Time to First Byte" },
            ].map((metric) => (
              <div key={metric.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-[10px] text-text-4 uppercase tracking-wider font-semibold">{metric.desc}</p>
                <p className={`text-2xl font-bold mt-1 ${
                  metric.status === "good" ? "text-green-600" : metric.status === "needs-improvement" ? "text-yellow-600" : "text-red"
                }`}>
                  {metric.value}
                </p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  metric.status === "good" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                }`}>
                  {metric.status === "good" ? "Good" : "Needs Work"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
