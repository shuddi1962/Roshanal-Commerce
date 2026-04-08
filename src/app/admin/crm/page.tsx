"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Target,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  Filter,
  Search,
  MoreVertical,
  ArrowRight,
  Star,
  Building2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "pipeline", label: "CRM Pipeline" },
  { id: "leads", label: "Lead Generation" },
  { id: "segments", label: "Customer Segments" },
  { id: "b2b", label: "B2B/Wholesale" },
];

const pipelineStages = [
  {
    name: "New Leads",
    color: "border-t-blue",
    leads: [
      { name: "TechStar Ltd", score: 85, value: "₦2.5M", source: "Web Scrape", contact: "admin@techstar.ng" },
      { name: "SafeGuard Inc", score: 72, value: "₦1.8M", source: "Referral", contact: "info@safeguard.com" },
    ],
  },
  {
    name: "Contacted",
    color: "border-t-yellow-500",
    leads: [
      { name: "Niger Delta Oil", score: 92, value: "₦8.5M", source: "AI Outbound", contact: "procurement@ndo.com" },
    ],
  },
  {
    name: "Qualified",
    color: "border-t-purple-500",
    leads: [
      { name: "Apex Holdings", score: 88, value: "₦3.2M", source: "Inbound", contact: "cto@apex.ng" },
      { name: "Port Authority", score: 95, value: "₦12M", source: "Direct", contact: "security@npa.gov.ng" },
    ],
  },
  {
    name: "Proposal Sent",
    color: "border-t-orange-500",
    leads: [
      { name: "Marina Bay Hotel", score: 78, value: "₦4.5M", source: "Cold Email", contact: "manager@marinabay.ng" },
    ],
  },
  {
    name: "Closed Won",
    color: "border-t-green-500",
    leads: [
      { name: "EcoBank Branch", score: 98, value: "₦6.8M", source: "Referral", contact: "it@ecobank.com" },
    ],
  },
];

const customerSegments = [
  { name: "High Value Customers", count: 45, avgOrder: "₦350,000", criteria: "Total spend > ₦1M" },
  { name: "Repeat Buyers", count: 234, avgOrder: "₦85,000", criteria: "3+ orders in 6 months" },
  { name: "At Risk", count: 67, avgOrder: "₦120,000", criteria: "No order in 90+ days" },
  { name: "New Customers", count: 128, avgOrder: "₦45,000", criteria: "First order < 30 days ago" },
  { name: "B2B Accounts", count: 23, avgOrder: "₦850,000", criteria: "Wholesale/corporate" },
  { name: "Service Customers", count: 89, avgOrder: "₦250,000", criteria: "Booked a service" },
];

const b2bAccounts = [
  { company: "TechStar Solutions", contact: "John Adeboye", tier: "Gold", credit: "₦5,000,000", orders: 34, lastOrder: "2026-04-02" },
  { company: "SafeGuard Nigeria", contact: "Amara Okafor", tier: "Silver", credit: "₦2,000,000", orders: 18, lastOrder: "2026-03-28" },
  { company: "Niger Delta Oil & Gas", contact: "Chief Obi", tier: "Platinum", credit: "₦15,000,000", orders: 12, lastOrder: "2026-04-05" },
  { company: "Apex Security Ltd", contact: "Emeka Nwachukwu", tier: "Gold", credit: "₦3,500,000", orders: 27, lastOrder: "2026-03-30" },
];

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-text-1">Customers & CRM</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter size={14} /> Filter
          </Button>
          <Button size="sm" className="gap-1.5">
            <UserPlus size={14} /> Add Lead
          </Button>
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

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: "156", icon: Target, color: "bg-blue-50 text-blue" },
          { label: "Conversion Rate", value: "18.5%", icon: TrendingUp, color: "bg-green-50 text-green-600" },
          { label: "Pipeline Value", value: "₦42.3M", icon: Star, color: "bg-purple-50 text-purple-600" },
          { label: "Avg Lead Score", value: "72/100", icon: Users, color: "bg-orange-50 text-orange-600" },
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

      {/* Pipeline Kanban */}
      {activeTab === "pipeline" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => (
            <div key={stage.name} className={`min-w-[260px] w-[260px] bg-off-white rounded-xl border-t-4 ${stage.color}`}>
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-text-1">{stage.name}</h4>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full text-text-4 border border-border">{stage.leads.length}</span>
                </div>
              </div>
              <div className="p-3 space-y-3">
                {stage.leads.map((lead) => (
                  <div key={lead.name} className="bg-white rounded-lg p-3 border border-border shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold text-text-1">{lead.name}</h5>
                      <MoreVertical size={14} className="text-text-4" />
                    </div>
                    <p className="text-xs text-text-3 mb-2">{lead.contact}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue">{lead.value}</span>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${lead.score >= 80 ? "bg-green-500" : lead.score >= 60 ? "bg-yellow-500" : "bg-red-500"}`} />
                        <span className="text-[10px] text-text-4">{lead.score}/100</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-text-4 mt-1.5">Source: {lead.source}</p>
                    <div className="flex gap-1.5 mt-2">
                      <button className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue hover:bg-blue-100">
                        <Phone size={11} />
                      </button>
                      <button className="w-6 h-6 rounded bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100">
                        <Mail size={11} />
                      </button>
                      <button className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center text-purple-600 hover:bg-purple-100">
                        <MessageSquare size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lead Generation */}
      {activeTab === "leads" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <Globe size={18} /> Lead Scraping (Apify)
            </h3>
            <div className="space-y-3 mb-4">
              <input placeholder="Industry keywords..." className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
              <input placeholder="Location (e.g. Lagos, Port Harcourt)" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
              <Button className="w-full gap-1.5">
                <Search size={14} /> Scrape Leads
              </Button>
            </div>
            <p className="text-xs text-text-4">Last scrape: 2026-04-05 · Found 23 leads · 8 enriched</p>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <Target size={18} /> AI Lead Scoring
            </h3>
            <p className="text-sm text-text-3 mb-4">Leads are automatically scored 0-100 based on:</p>
            <div className="space-y-2">
              {["Company size & revenue", "Industry match", "Website engagement", "Email open rate", "Social signals", "Purchase intent signals"].map((factor) => (
                <div key={factor} className="flex items-center gap-2 text-sm text-text-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                  {factor}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2">
              <Phone size={18} /> Outreach Automation
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { method: "Email Sequence", desc: "5-step drip campaign", active: true, sent: 234 },
                { method: "WhatsApp", desc: "Personalized follow-ups", active: true, sent: 89 },
                { method: "AI Phone Calls", desc: "Vapi.ai outbound calls", active: false, sent: 12 },
              ].map((channel) => (
                <div key={channel.method} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-text-1">{channel.method}</h4>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${channel.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-text-4"}`}>
                      {channel.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-text-4">{channel.desc}</p>
                  <p className="text-xs text-text-3 mt-2">{channel.sent} sent this month</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Segments */}
      {activeTab === "segments" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customerSegments.map((seg) => (
            <div key={seg.name} className="bg-white rounded-xl border border-border p-5 hover:shadow-soft transition-shadow cursor-pointer">
              <h4 className="font-semibold text-text-1 mb-1">{seg.name}</h4>
              <p className="text-xs text-text-4 mb-3">{seg.criteria}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-text-1">{seg.count}</p>
                  <p className="text-xs text-text-4">customers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue">{seg.avgOrder}</p>
                  <p className="text-xs text-text-4">avg order</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 gap-1">
                View Segment <ArrowRight size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* B2B */}
      {activeTab === "b2b" && (
        <div className="bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-text-1 flex items-center gap-2">
              <Building2 size={18} /> B2B / Wholesale Accounts
            </h3>
            <Button size="sm" className="gap-1.5">
              <UserPlus size={14} /> Add Account
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-off-white">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-text-4">Company</th>
                  <th className="text-left px-5 py-3 font-medium text-text-4">Contact</th>
                  <th className="text-center px-5 py-3 font-medium text-text-4">Tier</th>
                  <th className="text-right px-5 py-3 font-medium text-text-4">Credit Limit</th>
                  <th className="text-center px-5 py-3 font-medium text-text-4">Orders</th>
                  <th className="text-left px-5 py-3 font-medium text-text-4">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {b2bAccounts.map((acc) => (
                  <tr key={acc.company} className="hover:bg-off-white transition-colors">
                    <td className="px-5 py-3 font-medium text-text-1">{acc.company}</td>
                    <td className="px-5 py-3 text-text-3">{acc.contact}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        acc.tier === "Platinum" ? "bg-purple-50 text-purple-700" :
                        acc.tier === "Gold" ? "bg-yellow-50 text-yellow-700" :
                        "bg-gray-100 text-text-4"
                      }`}>{acc.tier}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-text-1">{acc.credit}</td>
                    <td className="px-5 py-3 text-center">{acc.orders}</td>
                    <td className="px-5 py-3 text-text-4">{acc.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
