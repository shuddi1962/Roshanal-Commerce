"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Wrench, Plus, Phone, MapPin, Calendar, CheckCircle2,
  AlertTriangle, Star, Users, X, Save, Trash2, Edit,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

interface Technician {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  zone: string;
  status: string;
  completed_jobs: number;
  rating: number;
  certifications: string[];
}

interface Job {
  id: string;
  job_id: string;
  title: string;
  customer: string;
  tech: string | null;
  date: string;
  status: string;
  priority: string;
}

const seedTechs: Omit<Technician, "id">[] = [
  { name: "Engr. Chisom Eze", phone: "+234 801 234 5678", specialization: "CCTV & Access Control", zone: "Port Harcourt", status: "available", completed_jobs: 234, rating: 4.9, certifications: ["Hikvision Certified", "Dahua Certified"] },
  { name: "Engr. Tunde Bakare", phone: "+234 802 345 6789", specialization: "Fire Alarm & Suppression", zone: "Lagos", status: "on_job", completed_jobs: 189, rating: 4.7, certifications: ["NFPA Certified"] },
  { name: "Engr. Musa Danjuma", phone: "+234 803 456 7890", specialization: "Marine Electronics", zone: "Warri", status: "available", completed_jobs: 156, rating: 4.8, certifications: ["Yamaha Marine Tech"] },
  { name: "Engr. Adaeze Obi", phone: "+234 804 567 8901", specialization: "Kitchen Equipment", zone: "Abuja", status: "on_leave", completed_jobs: 98, rating: 4.5, certifications: ["Kitchen Hood Installer"] },
  { name: "Engr. Yusuf Abubakar", phone: "+234 805 678 9012", specialization: "Boat Electronics & GPS", zone: "Port Harcourt", status: "available", completed_jobs: 267, rating: 4.9, certifications: ["Garmin Certified", "Marine GPS Expert"] },
];

const seedJobs: Omit<Job, "id">[] = [
  { job_id: "JOB-001", title: "CCTV Installation - 16 Cameras", customer: "GTBank Rumuokoro", tech: "Engr. Chisom Eze", date: "2024-03-15", status: "scheduled", priority: "high" },
  { job_id: "JOB-002", title: "Fire Alarm Maintenance", customer: "Transcorp Hotels", tech: "Engr. Tunde Bakare", date: "2024-03-14", status: "in_progress", priority: "medium" },
  { job_id: "JOB-003", title: "Marine GPS Installation", customer: "Port Harcourt Boat Club", tech: null, date: "2024-03-16", status: "unassigned", priority: "high" },
  { job_id: "JOB-004", title: "Kitchen Hood Servicing", customer: "Sheraton Abuja", tech: "Engr. Adaeze Obi", date: "2024-03-20", status: "scheduled", priority: "low" },
  { job_id: "JOB-005", title: "Access Control - 50 Doors", customer: "Dangote Refinery", tech: "Engr. Chisom Eze", date: "2024-03-18", status: "scheduled", priority: "high" },
];

export default function AdminFieldTeamPage() {
  const [tab, setTab] = useState<"team" | "jobs" | "schedule">("team");
  const [techs, setTechs] = useState<Technician[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTechModal, setShowTechModal] = useState(false);
  const [editTech, setEditTech] = useState<Technician | null>(null);
  const [techForm, setTechForm] = useState({ name: "", phone: "", specialization: "", zone: "Port Harcourt", certifications: "" });
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: "", customer: "", date: "", priority: "medium", tech: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [tRes, jRes] = await Promise.all([
        insforge.database.from("technicians").select("*").order("name"),
        insforge.database.from("field_jobs").select("*").order("date", { ascending: false }),
      ]);
      if (tRes.data && tRes.data.length > 0) setTechs(tRes.data);
      else {
        for (const t of seedTechs) await insforge.database.from("technicians").insert(t);
        const { data } = await insforge.database.from("technicians").select("*");
        if (data) setTechs(data);
      }
      if (jRes.data && jRes.data.length > 0) setJobs(jRes.data);
      else {
        for (const j of seedJobs) await insforge.database.from("field_jobs").insert(j);
        const { data } = await insforge.database.from("field_jobs").select("*");
        if (data) setJobs(data);
      }
    } catch {
      setTechs(seedTechs.map((t, i) => ({ ...t, id: String(i + 1) })));
      setJobs(seedJobs.map((j, i) => ({ ...j, id: String(i + 1) })));
    } finally { setLoading(false); }
  };

  const saveTech = async () => {
    setSaving(true);
    try {
      const certs = techForm.certifications.split(",").map((c) => c.trim()).filter(Boolean);
      if (editTech) {
        await insforge.database.from("technicians").update({ ...techForm, certifications: certs }).eq("id", editTech.id);
        setTechs((prev) => prev.map((t) => t.id === editTech.id ? { ...t, ...techForm, certifications: certs } : t));
      } else {
        const { data } = await insforge.database.from("technicians").insert({ ...techForm, certifications: certs, status: "available", completed_jobs: 0, rating: 0 }).select();
        if (data) setTechs((prev) => [...prev, data[0]]);
      }
      closeTechModal();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const deleteTech = async (id: string) => {
    if (!confirm("Remove this technician?")) return;
    try {
      await insforge.database.from("technicians").delete().eq("id", id);
      setTechs((prev) => prev.filter((t) => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const createJob = async () => {
    setSaving(true);
    try {
      const job_id = `JOB-${String(jobs.length + 1).padStart(3, "0")}`;
      const status = jobForm.tech ? "scheduled" : "unassigned";
      const { data } = await insforge.database.from("field_jobs").insert({ ...jobForm, job_id, status, tech: jobForm.tech || null }).select();
      if (data) setJobs((prev) => [data[0], ...prev]);
      setShowJobModal(false);
      setJobForm({ title: "", customer: "", date: "", priority: "medium", tech: "" });
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const assignTech = async (jobId: string, techName: string) => {
    try {
      await insforge.database.from("field_jobs").update({ tech: techName, status: "scheduled" }).eq("id", jobId);
      setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, tech: techName, status: "scheduled" } : j));
    } catch (err) { console.error(err); }
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      await insforge.database.from("field_jobs").update({ status }).eq("id", jobId);
      setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status } : j));
    } catch (err) { console.error(err); }
  };

  const closeTechModal = () => { setShowTechModal(false); setEditTech(null); setTechForm({ name: "", phone: "", specialization: "", zone: "Port Harcourt", certifications: "" }); };

  const availableTechs = techs.filter((t) => t.status === "available");

  return (
    <AdminShell title="Field Technical Team" subtitle="Manage technicians, job assignments, and schedules">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Technicians", value: techs.length, icon: Users, color: "text-blue" },
            { label: "Available Now", value: techs.filter((t) => t.status === "available").length, icon: CheckCircle2, color: "text-green-600" },
            { label: "Active Jobs", value: jobs.filter((j) => j.status === "in_progress").length, icon: Wrench, color: "text-yellow-600" },
            { label: "Unassigned", value: jobs.filter((j) => j.status === "unassigned").length, icon: AlertTriangle, color: "text-red" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2"><s.icon size={16} className={s.color} /><span className="text-xs text-text-4">{s.label}</span></div>
              <p className="text-xl font-bold text-text-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["team", "jobs", "schedule"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {t === "team" ? "Technicians" : t === "jobs" ? "Job Board" : "Schedule"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center p-12 text-text-4 text-sm">Loading...</div>
        ) : (
          <>
            {tab === "team" && (
              <div className="space-y-3">
                {techs.map((tech) => (
                  <div key={tech.id} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm ${tech.status === "available" ? "bg-green-500" : tech.status === "on_job" ? "bg-yellow-500" : "bg-gray-400"}`}>
                          {tech.name.split(" ").pop()?.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{tech.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tech.status === "available" ? "bg-green-100 text-green-700" : tech.status === "on_job" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>{tech.status.replace("_", " ")}</span>
                          </div>
                          <p className="text-xs text-text-4">{tech.specialization} · <MapPin size={10} className="inline" /> {tech.zone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center"><p className="text-[10px] text-text-4">Jobs</p><p className="font-semibold text-sm">{tech.completed_jobs}</p></div>
                        <div className="text-center"><p className="text-[10px] text-text-4">Rating</p><p className="font-semibold text-sm flex items-center gap-0.5">{tech.rating}<Star size={10} className="text-yellow-400 fill-yellow-400" /></p></div>
                        <a href={`tel:${tech.phone.replace(/\s/g, "")}`} className="p-1.5 hover:bg-blue-50 rounded-lg"><Phone size={16} className="text-blue" /></a>
                        <button onClick={() => { setEditTech(tech); setTechForm({ name: tech.name, phone: tech.phone, specialization: tech.specialization, zone: tech.zone, certifications: tech.certifications.join(", ") }); setShowTechModal(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                        <button onClick={() => deleteTech(tech.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tech.certifications.map((c) => (
                        <span key={c} className="text-[10px] px-2 py-1 bg-blue/10 text-blue rounded-full font-medium">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => { setEditTech(null); setTechForm({ name: "", phone: "", specialization: "", zone: "Port Harcourt", certifications: "" }); setShowTechModal(true); }} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-text-4 hover:border-blue hover:text-blue flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Technician
                </button>
              </div>
            )}

            {tab === "jobs" && (
              <div className="space-y-3">
                <button onClick={() => setShowJobModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600"><Plus size={16} /> Create Job</button>
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-full min-h-[40px] rounded-full shrink-0 ${job.priority === "high" ? "bg-red" : job.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] text-text-4">{job.job_id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${job.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : job.status === "scheduled" ? "bg-blue/10 text-blue" : job.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{job.status.replace("_", " ")}</span>
                        </div>
                        <h4 className="font-semibold text-sm">{job.title}</h4>
                        <p className="text-xs text-text-4">{job.customer} · <Calendar size={10} className="inline" /> {job.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.tech ? (
                        <p className="text-sm font-medium text-text-2">{job.tech}</p>
                      ) : (
                        <select onChange={(e) => { if (e.target.value) assignTech(job.id, e.target.value); }} className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                          <option value="">Assign...</option>
                          {availableTechs.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                      )}
                      {job.status === "scheduled" && <button onClick={() => updateJobStatus(job.id, "in_progress")} className="text-[10px] px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">Start</button>}
                      {job.status === "in_progress" && <button onClick={() => updateJobStatus(job.id, "completed")} className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Complete</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "schedule" && (
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <h3 className="font-semibold text-sm mb-4">Weekly Schedule</h3>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIdx) => (
                    <div key={day} className="text-center">
                      <p className="text-xs font-medium text-text-4 mb-2">{day}</p>
                      <div className="space-y-1">
                        {jobs.filter((j) => j.status !== "completed").filter((_, i) => i % 7 === dayIdx).slice(0, 2).map((job) => (
                          <div key={job.id} className={`text-[9px] p-1.5 rounded font-medium truncate ${job.priority === "high" ? "bg-red/10 text-red" : job.priority === "medium" ? "bg-yellow-50 text-yellow-700" : "bg-blue/10 text-blue"}`}>
                            {job.title.split(" - ")[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Technician Modal */}
      {showTechModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeTechModal}>
          <div className="bg-white rounded-2xl w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">{editTech ? "Edit Technician" : "Add Technician"}</h2>
              <button onClick={closeTechModal} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Full Name</label>
                <input value={techForm.name} onChange={(e) => setTechForm({ ...techForm, name: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" placeholder="Engr. Full Name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Phone</label>
                  <input value={techForm.phone} onChange={(e) => setTechForm({ ...techForm, phone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Zone</label>
                  <select value={techForm.zone} onChange={(e) => setTechForm({ ...techForm, zone: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                    <option>Port Harcourt</option><option>Lagos</option><option>Abuja</option><option>Warri</option><option>Calabar</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Specialization</label>
                <input value={techForm.specialization} onChange={(e) => setTechForm({ ...techForm, specialization: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" placeholder="e.g. CCTV & Access Control" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Certifications (comma-separated)</label>
                <input value={techForm.certifications} onChange={(e) => setTechForm({ ...techForm, certifications: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" placeholder="Hikvision Certified, Dahua Certified" />
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={closeTechModal} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={saveTech} disabled={saving || !techForm.name} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <Save size={14} /> {saving ? "Saving..." : editTech ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowJobModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">Create Job</h2>
              <button onClick={() => setShowJobModal(false)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Job Title</label>
                <input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" placeholder="CCTV Installation - 8 Cameras" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Customer / Location</label>
                <input value={jobForm.customer} onChange={(e) => setJobForm({ ...jobForm, customer: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Date</label>
                  <input type="date" value={jobForm.date} onChange={(e) => setJobForm({ ...jobForm, date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Priority</label>
                  <select value={jobForm.priority} onChange={(e) => setJobForm({ ...jobForm, priority: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                    <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Assign Technician (optional)</label>
                <select value={jobForm.tech} onChange={(e) => setJobForm({ ...jobForm, tech: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="">Unassigned</option>
                  {techs.map((t) => <option key={t.id} value={t.name}>{t.name} ({t.zone})</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowJobModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={createJob} disabled={saving || !jobForm.title || !jobForm.customer} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-40 flex items-center justify-center gap-1.5">
                <Save size={14} /> {saving ? "Creating..." : "Create Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
