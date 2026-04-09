"use client";

import { useState } from "react";
import {
  Bot,
  Brain,
  Mic,
  Shield,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Play,
  RefreshCw,
  Video,
  Code,
  BarChart3,
  Eye,
  Plug,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "overview", label: "AI Overview" },
  { id: "research", label: "Research Agent" },
  { id: "competitor", label: "Competitor Monitor" },
  { id: "voice", label: "Voice Agent" },
  { id: "chat", label: "AI Chat" },
  { id: "ugc", label: "UGC Video" },
  { id: "plugins", label: "Plugin Builder" },
  { id: "flags", label: "Feature Flags" },
  { id: "doctor", label: "Site Doctor" },
];

const featureFlags = [
  { id: "voice-agent", name: "AI Voice Shopping Agent", enabled: true, desc: "Vapi.ai voice interaction" },
  { id: "voice-payment", name: "Voice Payment", enabled: false, desc: "Card payment via voice (optional)" },
  { id: "ai-chat", name: "AI Support Chat", enabled: true, desc: "4-persona AI chat support" },
  { id: "research-agent", name: "Daily Research Agent", enabled: true, desc: "Niche research at midnight" },
  { id: "competitor-monitor", name: "Competitor Price Monitor", enabled: true, desc: "Apify scraping every 6h" },
  { id: "ugc-video", name: "AI UGC Video Creator", enabled: false, desc: "Kie.ai video generation" },
  { id: "auto-indexing", name: "Google Auto-Indexing", enabled: true, desc: "Instant URL indexing" },
  { id: "bing-indexing", name: "Bing Auto-Indexing", enabled: true, desc: "Bing URL submission" },
  { id: "social-posting", name: "Auto Social Posting", enabled: true, desc: "Draft posts on publish" },
  { id: "abandoned-cart", name: "Abandoned Cart Recovery", enabled: true, desc: "Email→SMS→WhatsApp sequence" },
  { id: "marketplace", name: "Multivendor Marketplace", enabled: false, desc: "Full vendor marketplace" },
  { id: "pos", name: "POS System", enabled: true, desc: "Point of sale terminal" },
  { id: "rental", name: "Rental Module", enabled: false, desc: "Product rental system" },
  { id: "subscription", name: "Subscription Module", enabled: true, desc: "Recurring orders" },
  { id: "dropshipping", name: "CJ Dropshipping", enabled: false, desc: "CJ integration" },
];

const doctorChecks = [
  { name: "Broken Links", interval: "Every 6h", lastRun: "2h ago", status: "healthy", issues: 0, autoFix: "Auto-redirect" },
  { name: "API Health", interval: "Every 30min", lastRun: "12min ago", status: "healthy", issues: 0, autoFix: "Auto-disable/re-enable" },
  { name: "Database Health", interval: "Every 2h", lastRun: "45min ago", status: "healthy", issues: 0, autoFix: "Clean orphans/dupes" },
  { name: "Product Integrity", interval: "Every 4h", lastRun: "1h ago", status: "warning", issues: 3, autoFix: "AI queue" },
  { name: "Order Pipeline", interval: "Every 15min", lastRun: "8min ago", status: "healthy", issues: 0, autoFix: "Auto-retry" },
  { name: "Performance", interval: "Every 1h", lastRun: "30min ago", status: "healthy", issues: 0, autoFix: "Image compress" },
  { name: "SEO Health", interval: "Every 12h", lastRun: "4h ago", status: "warning", issues: 2, autoFix: "Sitemap refresh" },
  { name: "Security", interval: "Every 1h", lastRun: "20min ago", status: "healthy", issues: 0, autoFix: "Alert + block" },
  { name: "Feature Consistency", interval: "Every 6h", lastRun: "3h ago", status: "healthy", issues: 0, autoFix: "Disable feature" },
  { name: "Content Quality", interval: "Every 24h", lastRun: "8h ago", status: "warning", issues: 5, autoFix: "AI generation queue" },
];

const plugins = [
  { name: "WhatsApp Floating Button", source: "built-in", enabled: true, version: "1.0.0" },
  { name: "Google Shopping Feed", source: "built-in", enabled: true, version: "1.2.0" },
  { name: "Social Proof Popups", source: "built-in", enabled: true, version: "1.0.0" },
  { name: "Exit Intent Popup", source: "ai-generated", enabled: true, version: "1.0.0" },
  { name: "Price Alert System", source: "ai-generated", enabled: false, version: "0.9.0" },
  { name: "Bulk Order Table", source: "built-in", enabled: true, version: "1.1.0" },
];

export default function AIPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [flags, setFlags] = useState(featureFlags);

  const toggleFlag = (id: string) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const healthScore = Math.round(
    ((doctorChecks.filter((c) => c.status === "healthy").length) / doctorChecks.length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-text-1">AI & Automation</h1>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
            healthScore >= 90 ? "bg-green-50 text-green-700" : healthScore >= 70 ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red"
          }`}>
            <Shield size={12} /> Site Health: {healthScore}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? "bg-blue text-white" : "bg-white text-text-3 border border-border hover:bg-off-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "AI Actions Today", value: "142", icon: Zap, color: "bg-blue-50 text-blue" },
              { label: "Voice Sessions", value: "23", icon: Mic, color: "bg-green-50 text-green-600" },
              { label: "Chat Sessions", value: "67", icon: Bot, color: "bg-purple-50 text-purple-600" },
              { label: "Auto-fixes Applied", value: "8", icon: CheckCircle, color: "bg-orange-50 text-orange-600" },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bg-white rounded-xl border border-border p-4">
                  <div className={`w-9 h-9 rounded-lg ${kpi.color} flex items-center justify-center mb-2`}>
                    <Icon size={16} />
                  </div>
                  <p className="text-xl font-bold text-text-1">{kpi.value}</p>
                  <p className="text-xs text-text-4">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text-1 mb-4">Automation Status</h3>
              <div className="space-y-3">
                {[
                  { name: "RAG Sync (Voice + Chat)", time: "Last: 12:00 AM WAT", status: "completed" },
                  { name: "Daily Research Agent", time: "Last: 12:00 AM WAT → Report: 7:00 AM", status: "completed" },
                  { name: "Competitor Price Check", time: "Last: 6:00 AM WAT", status: "running" },
                  { name: "Currency Rate Update", time: "Last: 1 hour ago", status: "completed" },
                  { name: "SEO Sitemap Refresh", time: "Last: 8:00 PM WAT", status: "completed" },
                  { name: "Abandoned Cart Sequence", time: "3 active sequences", status: "running" },
                ].map((auto) => (
                  <div key={auto.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text-1">{auto.name}</p>
                      <p className="text-xs text-text-4">{auto.time}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      auto.status === "completed" ? "bg-green-50 text-green-700" :
                      auto.status === "running" ? "bg-blue-50 text-blue" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>{auto.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text-1 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Run Research Now", icon: Brain, action: "research" },
                  { label: "Retrain Voice RAG", icon: Mic, action: "voice" },
                  { label: "Retrain Chat RAG", icon: Bot, action: "chat" },
                  { label: "Check Competitors", icon: BarChart3, action: "competitor" },
                  { label: "Run Site Doctor", icon: Shield, action: "doctor" },
                  { label: "Build Plugin", icon: Code, action: "plugin" },
                ].map((qa) => {
                  const Icon = qa.icon;
                  return (
                    <button key={qa.label} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-off-white transition-colors text-left">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-blue" />
                      </div>
                      <span className="text-sm font-medium text-text-1">{qa.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Research Agent */}
      {activeTab === "research" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-1 flex items-center gap-2">
                <Brain size={18} /> Daily Research Report — April 8, 2026
              </h3>
              <Button size="sm" className="gap-1.5"><RefreshCw size={14} /> Run Now</Button>
            </div>
            <p className="text-xs text-text-4 mb-4">Auto-runs midnight WAT · Report delivered 7:00 AM · Covers: Security, Marine, Safety, Dredging, Kitchen, Boat Building, Engines</p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-text-1 mb-2">Top 5 Trending Products</h4>
                <div className="space-y-2">
                  {["Hikvision DS-2CD2387G2-LU 4K ColorVu", "Yamaha F200 V6 Offshore", "ZKTeco SpeedFace-V5L", "DJI Dock 2 Remote Drone Station", "Victron MultiPlus-II 5000VA"].map((p, i) => (
                    <div key={p} className="flex items-center justify-between py-2 px-3 rounded-lg bg-off-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-4 w-5">{i + 1}.</span>
                        <span className="text-sm text-text-1">{p}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm">Add Product</Button>
                        <Button variant="outline" size="sm">View Source</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-1 mb-2">Blog Topics Suggested</h4>
                <div className="space-y-2">
                  {["Top 10 CCTV Trends for Nigerian Businesses in 2026", "Complete Guide to Boat Engine Maintenance", "Fire Safety Compliance: What Nigerian Companies Must Know", "AI-Powered Access Control: The Future of Security", "Choosing the Right Dredging Equipment"].map((t) => (
                    <div key={t} className="flex items-center justify-between py-2 px-3 rounded-lg bg-off-white">
                      <span className="text-sm text-text-1">{t}</span>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm">Create Post</Button>
                        <Button variant="outline" size="sm" className="text-text-4">Ignore</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-1 mb-2">Rising Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {["4K security camera Nigeria", "outboard engine price", "fire alarm system installation", "boat building Port Harcourt", "solar inverter 10kva", "access control biometric"].map((kw) => (
                    <span key={kw} className="px-3 py-1.5 rounded-full bg-blue-50 text-blue text-xs font-medium">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Monitor */}
      {activeTab === "competitor" && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
            <Eye size={18} /> Competitor Price Monitor
          </h3>
          <p className="text-xs text-text-4 mb-4">Apify scrapes every 6 hours · Last check: 2h ago · Monitoring 45 products across 8 competitors</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-off-white">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-text-4">Product</th>
                  <th className="text-right px-4 py-3 font-medium text-text-4">Our Price</th>
                  <th className="text-right px-4 py-3 font-medium text-text-4">Competitor</th>
                  <th className="text-right px-4 py-3 font-medium text-text-4">Their Price</th>
                  <th className="text-center px-4 py-3 font-medium text-text-4">Diff</th>
                  <th className="text-center px-4 py-3 font-medium text-text-4">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { product: "Hikvision 4MP Dome", ours: 85000, competitor: "JumiaTech", theirs: 82000, diff: -3.5 },
                  { product: "Yamaha F150 Outboard", ours: 4500000, competitor: "MarineNG", theirs: 4750000, diff: 5.3 },
                  { product: "ZKTeco ProFace X", ours: 450000, competitor: "KongaTech", theirs: 445000, diff: -1.1 },
                  { product: "Bosch Fire Panel", ours: 320000, competitor: "SecurityPro", theirs: 335000, diff: 4.5 },
                  { product: "TP-Link EAP670", ours: 108000, competitor: "JumiaTech", theirs: 115000, diff: 6.1 },
                ].map((row) => (
                  <tr key={row.product} className="hover:bg-off-white transition-colors">
                    <td className="px-4 py-3 font-medium text-text-1">{row.product}</td>
                    <td className="px-4 py-3 text-right">₦{row.ours.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-text-3">{row.competitor}</td>
                    <td className="px-4 py-3 text-right">₦{row.theirs.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-semibold ${row.diff > 0 ? "text-green-600" : "text-red"}`}>
                        {row.diff > 0 ? "+" : ""}{row.diff}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.diff > 0 ? <TrendingUp size={14} className="text-green-600 mx-auto" /> : <TrendingUp size={14} className="text-red mx-auto rotate-180" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Voice Agent */}
      {activeTab === "voice" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <Mic size={18} /> Voice Agent Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Active Persona</label>
                <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                  <option>Amaka — Female, Warm & Professional</option>
                  <option>Chidi — Male, Friendly & Knowledgeable</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Auto-greeting</label>
                <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                  <option>Enabled — greet on first visit</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Voice Payment</label>
                <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                  <option>Disabled (Recommended)</option>
                  <option>Enabled — Customer-initiated only</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-off-white">
                <div>
                  <p className="text-sm font-medium text-text-1">RAG Knowledge Base</p>
                  <p className="text-xs text-text-4">Last synced: 12:00 AM WAT today</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <RefreshCw size={12} /> Retrain
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4">Voice Session Stats</h3>
            <div className="h-[250px] bg-off-white rounded-lg flex items-center justify-center">
              <p className="text-text-4 text-sm">Recharts Line Chart — Sessions over time</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-3 bg-off-white rounded-lg">
                <p className="text-lg font-bold text-text-1">23</p>
                <p className="text-xs text-text-4">Today</p>
              </div>
              <div className="text-center p-3 bg-off-white rounded-lg">
                <p className="text-lg font-bold text-text-1">2:34</p>
                <p className="text-xs text-text-4">Avg Duration</p>
              </div>
              <div className="text-center p-3 bg-off-white rounded-lg">
                <p className="text-lg font-bold text-text-1">68%</p>
                <p className="text-xs text-text-4">Resolution</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat */}
      {activeTab === "chat" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <Bot size={18} /> Chat Agent Personas
            </h3>
            <div className="space-y-3">
              {[
                { name: "Sarah Adeyemi", role: "General Support", active: true },
                { name: "Kemi Okafor", role: "Sales & Products", active: true },
                { name: "Tunde Nwachukwu", role: "Technical Support", active: false },
                { name: "Fatima Aliyu", role: "Orders & Returns", active: true },
              ].map((persona) => (
                <div key={persona.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {persona.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-1">{persona.name}</p>
                      <p className="text-xs text-text-4">{persona.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${persona.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-text-4"}`}>
                    {persona.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 text-xs text-blue">
              Chat agents can: issue store credit, raise returns, initiate refunds, update addresses, apply coupons, cancel orders
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4">Live Conversations</h3>
            <div className="space-y-3">
              {[
                { customer: "Amara O.", topic: "Order status #ORD-8842", persona: "Sarah", duration: "5 min", status: "active" },
                { customer: "John D.", topic: "Product recommendation", persona: "Kemi", duration: "3 min", status: "active" },
                { customer: "Chidi E.", topic: "Return request", persona: "Fatima", duration: "8 min", status: "resolved" },
              ].map((chat) => (
                <div key={chat.customer} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-text-1">{chat.customer}</p>
                    <p className="text-xs text-text-4">{chat.topic} · {chat.persona} · {chat.duration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${chat.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-text-4"}`}>
                      {chat.status}
                    </span>
                    <Button variant="outline" size="sm">Jump In</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature Flags */}
      {activeTab === "flags" && (
        <div className="bg-white rounded-xl border border-border">
          <div className="p-5 border-b border-border">
            <h3 className="font-semibold text-text-1 flex items-center gap-2">
              <Settings size={18} /> Feature Flags
            </h3>
            <p className="text-xs text-text-4 mt-1">Toggle features on/off instantly. Changes take effect immediately.</p>
          </div>
          <div className="divide-y divide-border">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center justify-between px-5 py-4 hover:bg-off-white transition-colors">
                <div>
                  <p className="text-sm font-medium text-text-1">{flag.name}</p>
                  <p className="text-xs text-text-4">{flag.desc}</p>
                </div>
                <button onClick={() => toggleFlag(flag.id)} className="relative">
                  {flag.enabled ? (
                    <ToggleRight size={32} className="text-blue" />
                  ) : (
                    <ToggleLeft size={32} className="text-text-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plugin Builder */}
      {activeTab === "plugins" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <Code size={18} /> AI Plugin Builder
            </h3>
            <p className="text-sm text-text-3 mb-4">Describe what you want in plain language. Claude will build a complete plugin.</p>
            <textarea rows={3} placeholder="e.g. Build a plugin that shows a WhatsApp button on every product page with a pre-filled message..." className="w-full px-4 py-3 rounded-lg border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            <Button className="mt-3 gap-1.5"><Zap size={14} /> Generate Plugin</Button>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-text-1 flex items-center gap-2">
                <Plug size={18} /> Plugin Registry
              </h3>
            </div>
            <div className="divide-y divide-border">
              {plugins.map((plugin) => (
                <div key={plugin.name} className="flex items-center justify-between px-5 py-4 hover:bg-off-white transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Plug size={16} className="text-blue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-1">{plugin.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          plugin.source === "built-in" ? "bg-blue-50 text-blue" : "bg-purple-50 text-purple-600"
                        }`}>{plugin.source}</span>
                        <span className="text-xs text-text-4">v{plugin.version}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><Pencil size={12} /></Button>
                    <Button variant="outline" size="sm" className="text-red hover:bg-red-50"><Trash2 size={12} /></Button>
                    <button onClick={() => {}}>
                      {plugin.enabled ? <ToggleRight size={28} className="text-blue" /> : <ToggleLeft size={28} className="text-text-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Site Doctor */}
      {activeTab === "doctor" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-1 flex items-center gap-2">
                <Shield size={18} /> Site Doctor — 10 Auto-healing Checks
              </h3>
              <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                healthScore >= 90 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
              }`}>
                Health Score: {healthScore}%
              </div>
            </div>

            <div className="space-y-3">
              {doctorChecks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-off-white transition-colors">
                  <div className="flex items-center gap-3">
                    {check.status === "healthy" ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <AlertCircle size={18} className="text-yellow-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-text-1">{check.name}</p>
                      <p className="text-xs text-text-4">{check.interval} · Last: {check.lastRun}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {check.issues > 0 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                        {check.issues} issues
                      </span>
                    )}
                    <span className="text-xs text-text-4">{check.autoFix}</span>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Play size={10} /> Run
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* UGC Video */}
      {activeTab === "ugc" && (
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
            <Video size={18} /> AI UGC Video Creator
          </h3>
          <p className="text-sm text-text-3 mb-4">Generate product videos and marketing content using Kie.ai + OpenRouter</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-2 block mb-1.5">Select Product</label>
              <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                <option>Hikvision 4MP IP Dome Camera</option>
                <option>Yamaha F150 Outboard Engine</option>
                <option>ZKTeco ProFace X Terminal</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 block mb-1.5">Video Type</label>
              <select className="w-full h-10 px-3 rounded-lg border border-border text-sm">
                <option>Product Showcase (30s)</option>
                <option>Feature Highlight (15s)</option>
                <option>Social Media Reel (60s)</option>
                <option>Comparison Video (45s)</option>
              </select>
            </div>
          </div>
          <Button className="mt-4 gap-1.5"><Video size={14} /> Generate Video</Button>
          <p className="text-xs text-text-4 mt-2">Videos are saved as DRAFT for admin approval before publishing.</p>
        </div>
      )}
    </div>
  );
}
