"use client";

import { useState, useEffect } from "react";
import {
  Users, UserPlus, Target, Phone, Mail, MessageSquare, TrendingUp,
  Search, MoreVertical, ArrowRight, Star, Building2, Globe, X,
  Save, Edit, Trash2, ChevronRight, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

const crmTabs = [
  { id: "pipeline", label: "CRM Pipeline" },
  { id: "leads", label: "Lead Generation" },
  { id: "segments", label: "Customer Segments" },
  { id: "b2b", label: "B2B/Wholesale" },
];

interface Lead {
  id: string;
  name: string;
  contact: string;
  value: string;
  score: number;
  source: string;
  stage: string;
  phone?: string;
  notes?: string;
}

interface B2BAccount {
  id: string;
  company: string;
  contact_name: string;
  email?: string;
  tier: string;
  credit_limit: number;
  orders: number;
  last_order: string;
}

const stages = ["New Leads", "Contacted", "Qualified", "Proposal Sent", "Closed Won"];
const stageColors: Record<string, string> = {
  "New Leads": "border-t-blue",
  "Contacted": "border-t-yellow-500",
  "Qualified": "border-t-purple-500",
  "Proposal Sent": "border-t-orange-500",
  "Closed Won": "border-t-green-500",
};

const seedLeads: Omit<Lead, "id">[] = [
  { name: "TechStar Ltd", score: 85, value: "₦2.5M", source: "Web Scrape", contact: "admin@techstar.ng", stage: "New Leads" },
  { name: "SafeGuard Inc", score: 72, value: "₦1.8M", source: "Referral", contact: "info@safeguard.com", stage: "New Leads" },
  { name: "Niger Delta Oil", score: 92, value: "₦8.5M", source: "AI Outbound", contact: "procurement@ndo.com", stage: "Contacted" },
  { name: "Apex Holdings", score: 88, value: "₦3.2M", source: "Inbound", contact: "cto@apex.ng", stage: "Qualified" },
  { name: "Port Authority", score: 95, value: "₦12M", source: "Direct", contact: "security@npa.gov.ng", stage: "Qualified" },
  { name: "Marina Bay Hotel", score: 78, value: "₦4.5M", source: "Cold Email", contact: "manager@marinabay.ng", stage: "Proposal Sent" },
  { name: "EcoBank Branch", score: 98, value: "₦6.8M", source: "Referral", contact: "it@ecobank.com", stage: "Closed Won" },
];

const seedB2B: Omit<B2BAccount, "id">[] = [
  { company: "TechStar Solutions", contact_name: "John Adeboye", email: "john@techstar.ng", tier: "Gold", credit_limit: 5000000, orders: 34, last_order: "2026-04-02" },
  { company: "SafeGuard Nigeria", contact_name: "Amara Okafor", email: "amara@safeguard.com", tier: "Silver", credit_limit: 2000000, orders: 18, last_order: "2026-03-28" },
  { company: "Niger Delta Oil & Gas", contact_name: "Chief Obi", email: "chief@ndo.com", tier: "Platinum", credit_limit: 15000000, orders: 12, last_order: "2026-04-05" },
  { company: "Apex Security Ltd", contact_name: "Emeka Nwachukwu", email: "emeka@apex.ng", tier: "Gold", credit_limit: 3500000, orders: 27, last_order: "2026-03-30" },
];

const customerSegments = [
  { name: "High Value Customers", count: 45, avgOrder: "₦350,000", criteria: "Total spend > ₦1M" },
  { name: "Repeat Buyers", count: 234, avgOrder: "₦85,000", criteria: "3+ orders in 6 months" },
  { name: "At Risk", count: 67, avgOrder: "₦120,000", criteria: "No order in 90+ days" },
  { name: "New Customers", count: 128, avgOrder: "₦45,000", criteria: "First order < 30 days ago" },
  { name: "B2B Accounts", count: 23, avgOrder: "₦850,000", criteria: "Wholesale/corporate" },
  { name: "Service Customers", count: 89, avgOrder: "₦250,000", criteria: "Booked a service" },
];

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [b2bAccounts, setB2bAccounts] = useState<B2BAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Lead modal
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState({ name: "", contact: "", value: "", score: 50, source: "Inbound", stage: "New Leads", phone: "", notes: "" });

  // Lead actions dropdown
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // B2B modal
  const [showB2BModal, setShowB2BModal] = useState(false);
  const [editB2B, setEditB2B] = useState<B2BAccount | null>(null);
  const [b2bForm, setB2bForm] = useState({ company: "", contact_name: "", email: "", tier: "Silver", credit_limit: 0 });

  // Scrape
  const [scrapeKeywords, setScrapeKeywords] = useState("");
  const [scrapeLocation, setScrapeLocation] = useState("");
  const [scraping, setScraping] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [lRes, bRes] = await Promise.all([
        insforge.database.from("crm_contacts").select("*").order("score", { ascending: false }),
        insforge.database.from("b2b_accounts").select("*").order("credit_limit", { ascending: false }),
      ]);

      if (lRes.data && lRes.data.length > 0) setLeads(lRes.data);
      else {
        for (const l of seedLeads) await insforge.database.from("crm_contacts").insert(l);
        const { data } = await insforge.database.from("crm_contacts").select("*");
        if (data) setLeads(data);
      }

      if (bRes.data && bRes.data.length > 0) setB2bAccounts(bRes.data);
      else {
        for (const b of seedB2B) await insforge.database.from("b2b_accounts").insert(b);
        const { data } = await insforge.database.from("b2b_accounts").select("*");
        if (data) setB2bAccounts(data);
      }
    } catch (err) {
      console.error("CRM load error:", err);
      setLeads(seedLeads.map((l, i) => ({ ...l, id: String(i + 1) })));
      setB2bAccounts(seedB2B.map((b, i) => ({ ...b, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  };

  // Lead CRUD
  const saveLead = async () => {
    try {
      if (editLead) {
        await insforge.database.from("crm_contacts").update(leadForm).eq("id", editLead.id);
        setLeads((prev) => prev.map((l) => l.id === editLead.id ? { ...l, ...leadForm } : l));
      } else {
        const { data } = await insforge.database.from("crm_contacts").insert(leadForm).select();
        if (data) setLeads((prev) => [data[0], ...prev]);
      }
      setShowLeadModal(false);
      setEditLead(null);
    } catch (err) { console.error(err); }
  };

  const deleteLead = async (id: string) => {
    try {
      await insforge.database.from("crm_contacts").delete().eq("id", id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) { console.error(err); }
    setOpenMenu(null);
  };

  const moveLeadStage = async (lead: Lead, newStage: string) => {
    try {
      await insforge.database.from("crm_contacts").update({ stage: newStage }).eq("id", lead.id);
      setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, stage: newStage } : l));
    } catch (err) { console.error(err); }
    setOpenMenu(null);
  };

  // B2B CRUD
  const saveB2B = async () => {
    try {
      if (editB2B) {
        await insforge.database.from("b2b_accounts").update(b2bForm).eq("id", editB2B.id);
        setB2bAccounts((prev) => prev.map((b) => b.id === editB2B.id ? { ...b, ...b2bForm } : b));
      } else {
        const { data } = await insforge.database.from("b2b_accounts").insert({ ...b2bForm, orders: 0, last_order: null }).select();
        if (data) setB2bAccounts((prev) => [data[0], ...prev]);
      }
      setShowB2BModal(false);
      setEditB2B(null);
    } catch (err) { console.error(err); }
  };

  const deleteB2B = async (id: string) => {
    try {
      await insforge.database.from("b2b_accounts").delete().eq("id", id);
      setB2bAccounts((prev) => prev.filter((b) => b.id !== id));
    } catch (err) { console.error(err); }
  };

  // Fake scrape
  const handleScrape = () => {
    setScraping(true);
    setTimeout(() => {
      const fakeLeads: Lead[] = [
        { id: `scrape-${Date.now()}`, name: `${scrapeKeywords || "Business"} Corp`, contact: `info@${(scrapeKeywords || "biz").toLowerCase().replace(/\s/g, "")}.ng`, value: "₦1.5M", score: Math.floor(Math.random() * 40 + 50), source: "Web Scrape", stage: "New Leads" },
      ];
      setLeads((prev) => [...fakeLeads, ...prev]);
      setScraping(false);
    }, 2000);
  };

  const totalPipelineValue = leads.reduce((sum, l) => {
    const num = parseFloat(l.value?.replace(/[₦,M]/g, "") || "0");
    return sum + (l.value?.includes("M") ? num * 1000000 : num);
  }, 0);

  return (
    <AdminShell title="Customers & CRM" subtitle="Pipeline, leads, segments, B2B">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-2xl text-text-1">Customers & CRM</h1>
          <div className="flex gap-2">
            <Button size="sm" className="gap-1.5" onClick={() => { setEditLead(null); setLeadForm({ name: "", contact: "", value: "", score: 50, source: "Inbound", stage: "New Leads", phone: "", notes: "" }); setShowLeadModal(true); }}>
              <UserPlus size={14} /> Add Lead
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {crmTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-blue text-white" : "bg-white text-text-3 border border-border hover:bg-off-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: String(leads.length), icon: Target, color: "bg-blue-50 text-blue" },
            { label: "Conversion Rate", value: leads.length > 0 ? `${Math.round((leads.filter((l) => l.stage === "Closed Won").length / leads.length) * 100)}%` : "0%", icon: TrendingUp, color: "bg-green-50 text-green-600" },
            { label: "Pipeline Value", value: `₦${(totalPipelineValue / 1000000).toFixed(1)}M`, icon: Star, color: "bg-purple-50 text-purple-600" },
            { label: "Avg Lead Score", value: leads.length > 0 ? `${Math.round(leads.reduce((a, l) => a + (l.score || 0), 0) / leads.length)}/100` : "0", icon: Users, color: "bg-orange-50 text-orange-600" },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-white rounded-xl border border-border p-4">
                <div className={`w-9 h-9 rounded-lg ${kpi.color} flex items-center justify-center mb-2`}><Icon size={16} /></div>
                <p className="text-xl font-bold text-text-1">{kpi.value}</p>
                <p className="text-xs text-text-4">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="p-12 text-center text-text-4 text-sm">Loading CRM data...</div>
        ) : (
          <>
            {/* Pipeline Kanban */}
            {activeTab === "pipeline" && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {stages.map((stage) => {
                  const stageLeads = leads.filter((l) => l.stage === stage);
                  return (
                    <div key={stage} className={`min-w-[260px] w-[260px] bg-off-white rounded-xl border-t-4 ${stageColors[stage]}`}>
                      <div className="p-3 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-text-1">{stage}</h4>
                          <span className="text-xs bg-white px-2 py-0.5 rounded-full text-text-4 border border-border">{stageLeads.length}</span>
                        </div>
                      </div>
                      <div className="p-3 space-y-3">
                        {stageLeads.map((lead) => (
                          <div key={lead.id} className="bg-white rounded-lg p-3 border border-border shadow-soft hover:shadow-medium transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-semibold text-text-1">{lead.name}</h5>
                              <div className="relative">
                                <button onClick={() => setOpenMenu(openMenu === lead.id ? null : lead.id)} className="p-1 hover:bg-off-white rounded">
                                  <MoreVertical size={14} className="text-text-4" />
                                </button>
                                {openMenu === lead.id && (
                                  <div className="absolute right-0 top-6 z-20 bg-white border border-border rounded-lg shadow-lg py-1 w-40">
                                    {stages.filter((s) => s !== lead.stage).map((s) => (
                                      <button key={s} onClick={() => moveLeadStage(lead, s)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-off-white flex items-center gap-2">
                                        <ChevronRight size={10} /> Move to {s}
                                      </button>
                                    ))}
                                    <hr className="my-1 border-border" />
                                    <button onClick={() => { setEditLead(lead); setLeadForm({ name: lead.name, contact: lead.contact, value: lead.value, score: lead.score, source: lead.source, stage: lead.stage, phone: lead.phone || "", notes: lead.notes || "" }); setShowLeadModal(true); setOpenMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs hover:bg-off-white flex items-center gap-2">
                                      <Edit size={10} /> Edit Lead
                                    </button>
                                    <button onClick={() => deleteLead(lead.id)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-red-50 text-red flex items-center gap-2">
                                      <Trash2 size={10} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
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
                              <button onClick={() => { if (lead.phone) window.open(`tel:${lead.phone}`); }} className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center text-blue hover:bg-blue-100"><Phone size={11} /></button>
                              <button onClick={() => window.open(`mailto:${lead.contact}`)} className="w-6 h-6 rounded bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100"><Mail size={11} /></button>
                              <button onClick={() => window.open(`https://wa.me/${lead.phone?.replace(/[^0-9]/g, "")}`)} className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center text-purple-600 hover:bg-purple-100"><MessageSquare size={11} /></button>
                            </div>
                          </div>
                        ))}
                        {stageLeads.length === 0 && (
                          <p className="text-xs text-text-4 text-center py-4">No leads</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Lead Generation */}
            {activeTab === "leads" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2"><Globe size={18} /> Lead Scraping</h3>
                  <div className="space-y-3 mb-4">
                    <input placeholder="Industry keywords..." value={scrapeKeywords} onChange={(e) => setScrapeKeywords(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
                    <input placeholder="Location (e.g. Lagos, Port Harcourt)" value={scrapeLocation} onChange={(e) => setScrapeLocation(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
                    <Button className="w-full gap-1.5" onClick={handleScrape} disabled={scraping}>
                      <Search size={14} /> {scraping ? "Scraping..." : "Scrape Leads"}
                    </Button>
                  </div>
                  <p className="text-xs text-text-4">Results will appear in the Pipeline as "New Leads"</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2"><Target size={18} /> AI Lead Scoring</h3>
                  <p className="text-sm text-text-3 mb-4">Leads are automatically scored 0-100 based on:</p>
                  <div className="space-y-2">
                    {["Company size & revenue", "Industry match", "Website engagement", "Email open rate", "Social signals", "Purchase intent signals"].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-text-2"><div className="w-1.5 h-1.5 rounded-full bg-blue" />{f}</div>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-text-1 mb-4 flex items-center gap-2"><Phone size={18} /> Outreach Automation</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { method: "Email Sequence", desc: "5-step drip campaign", active: true, sent: 234 },
                      { method: "WhatsApp", desc: "Personalized follow-ups", active: true, sent: 89 },
                      { method: "AI Phone Calls", desc: "Vapi.ai outbound calls", active: false, sent: 12 },
                    ].map((ch) => (
                      <div key={ch.method} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-text-1">{ch.method}</h4>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ch.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-text-4"}`}>{ch.active ? "Active" : "Inactive"}</span>
                        </div>
                        <p className="text-xs text-text-4">{ch.desc}</p>
                        <p className="text-xs text-text-3 mt-2">{ch.sent} sent this month</p>
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
                  <div key={seg.name} className="bg-white rounded-xl border border-border p-5 hover:shadow-soft transition-shadow">
                    <h4 className="font-semibold text-text-1 mb-1">{seg.name}</h4>
                    <p className="text-xs text-text-4 mb-3">{seg.criteria}</p>
                    <div className="flex items-center justify-between">
                      <div><p className="text-xl font-bold text-text-1">{seg.count}</p><p className="text-xs text-text-4">customers</p></div>
                      <div className="text-right"><p className="text-sm font-semibold text-blue">{seg.avgOrder}</p><p className="text-xs text-text-4">avg order</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* B2B */}
            {activeTab === "b2b" && (
              <div className="bg-white rounded-xl border border-border">
                <div className="flex items-center justify-between p-5 border-b border-border">
                  <h3 className="font-semibold text-text-1 flex items-center gap-2"><Building2 size={18} /> B2B / Wholesale Accounts</h3>
                  <Button size="sm" className="gap-1.5" onClick={() => { setEditB2B(null); setB2bForm({ company: "", contact_name: "", email: "", tier: "Silver", credit_limit: 0 }); setShowB2BModal(true); }}>
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
                        <th className="text-right px-5 py-3 font-medium text-text-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {b2bAccounts.map((acc) => (
                        <tr key={acc.id} className="hover:bg-off-white transition-colors">
                          <td className="px-5 py-3 font-medium text-text-1">{acc.company}</td>
                          <td className="px-5 py-3 text-text-3">{acc.contact_name}</td>
                          <td className="px-5 py-3 text-center">
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${acc.tier === "Platinum" ? "bg-purple-50 text-purple-700" : acc.tier === "Gold" ? "bg-yellow-50 text-yellow-700" : "bg-gray-100 text-text-4"}`}>{acc.tier}</span>
                          </td>
                          <td className="px-5 py-3 text-right font-semibold text-text-1">₦{(acc.credit_limit || 0).toLocaleString()}</td>
                          <td className="px-5 py-3 text-center">{acc.orders}</td>
                          <td className="px-5 py-3 text-text-4">{acc.last_order || "—"}</td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditB2B(acc); setB2bForm({ company: acc.company, contact_name: acc.contact_name, email: acc.email || "", tier: acc.tier, credit_limit: acc.credit_limit }); setShowB2BModal(true); }} className="p-1.5 rounded-lg hover:bg-off-white text-text-4 hover:text-blue"><Edit size={14} /></button>
                              <button onClick={() => deleteB2B(acc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-4 hover:text-red"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lead Create/Edit Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowLeadModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{editLead ? "Edit Lead" : "Add Lead"}</h2>
              <button onClick={() => setShowLeadModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className="text-xs font-semibold text-text-2 mb-1 block">Company / Name</label>
                <input value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Email</label>
                  <input value={leadForm.contact} onChange={(e) => setLeadForm({ ...leadForm, contact: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Phone</label>
                  <input value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Deal Value</label>
                  <input value={leadForm.value} onChange={(e) => setLeadForm({ ...leadForm, value: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="₦2.5M" /></div>
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Score (0-100)</label>
                  <input type="number" min={0} max={100} value={leadForm.score} onChange={(e) => setLeadForm({ ...leadForm, score: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Source</label>
                  <select value={leadForm.source} onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    {["Inbound", "Referral", "Web Scrape", "Cold Email", "AI Outbound", "Direct", "LinkedIn"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select></div>
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Stage</label>
                  <select value={leadForm.stage} onChange={(e) => setLeadForm({ ...leadForm, stage: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select></div>
              </div>
              <div><label className="text-xs font-semibold text-text-2 mb-1 block">Notes</label>
                <textarea value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} className="w-full h-20 px-3 py-2 rounded-lg border border-border text-sm resize-none focus:outline-none focus:border-blue" /></div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowLeadModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveLead} disabled={!leadForm.name}><Save size={14} className="mr-1" /> {editLead ? "Update" : "Add Lead"}</Button>
            </div>
          </div>
        </div>
      )}

      {/* B2B Create/Edit Modal */}
      {showB2BModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowB2BModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[460px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{editB2B ? "Edit Account" : "Add B2B Account"}</h2>
              <button onClick={() => setShowB2BModal(false)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className="text-xs font-semibold text-text-2 mb-1 block">Company Name</label>
                <input value={b2bForm.company} onChange={(e) => setB2bForm({ ...b2bForm, company: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Contact Person</label>
                  <input value={b2bForm.contact_name} onChange={(e) => setB2bForm({ ...b2bForm, contact_name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Email</label>
                  <input type="email" value={b2bForm.email} onChange={(e) => setB2bForm({ ...b2bForm, email: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Tier</label>
                  <select value={b2bForm.tier} onChange={(e) => setB2bForm({ ...b2bForm, tier: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    <option>Silver</option><option>Gold</option><option>Platinum</option>
                  </select></div>
                <div><label className="text-xs font-semibold text-text-2 mb-1 block">Credit Limit (₦)</label>
                  <input type="number" value={b2bForm.credit_limit} onChange={(e) => setB2bForm({ ...b2bForm, credit_limit: +e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" /></div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowB2BModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveB2B} disabled={!b2bForm.company}><Save size={14} className="mr-1" /> {editB2B ? "Update" : "Add Account"}</Button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
