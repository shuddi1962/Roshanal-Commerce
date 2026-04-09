"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Wrench, Plus, Phone, MapPin, Calendar, CheckCircle2,
  AlertTriangle, Star, Users,
} from "lucide-react";

const demoTechnicians = [
  { id: 1, name: "Engr. Chisom Eze", phone: "+234 801 234 5678", specialization: "CCTV & Access Control", zone: "Port Harcourt", status: "available", completedJobs: 234, rating: 4.9, certifications: ["Hikvision Certified", "Dahua Certified"] },
  { id: 2, name: "Engr. Tunde Bakare", phone: "+234 802 345 6789", specialization: "Fire Alarm & Suppression", zone: "Lagos", status: "on_job", completedJobs: 189, rating: 4.7, certifications: ["NFPA Certified"] },
  { id: 3, name: "Engr. Musa Danjuma", phone: "+234 803 456 7890", specialization: "Marine Electronics", zone: "Warri", status: "available", completedJobs: 156, rating: 4.8, certifications: ["Yamaha Marine Tech"] },
  { id: 4, name: "Engr. Adaeze Obi", phone: "+234 804 567 8901", specialization: "Kitchen Equipment", zone: "Abuja", status: "on_leave", completedJobs: 98, rating: 4.5, certifications: ["Kitchen Hood Installer"] },
  { id: 5, name: "Engr. Yusuf Abubakar", phone: "+234 805 678 9012", specialization: "Boat Electronics & GPS", zone: "Port Harcourt", status: "available", completedJobs: 267, rating: 4.9, certifications: ["Garmin Certified", "Marine GPS Expert"] },
];

const demoJobs = [
  { id: "JOB-001", title: "CCTV Installation - 16 Cameras", customer: "GTBank Rumuokoro", tech: "Engr. Chisom Eze", date: "2024-03-15", status: "scheduled", priority: "high" },
  { id: "JOB-002", title: "Fire Alarm Maintenance", customer: "Transcorp Hotels", tech: "Engr. Tunde Bakare", date: "2024-03-14", status: "in_progress", priority: "medium" },
  { id: "JOB-003", title: "Marine GPS Installation", customer: "Port Harcourt Boat Club", tech: null, date: "2024-03-16", status: "unassigned", priority: "high" },
  { id: "JOB-004", title: "Kitchen Hood Servicing", customer: "Sheraton Abuja", tech: "Engr. Adaeze Obi", date: "2024-03-20", status: "scheduled", priority: "low" },
  { id: "JOB-005", title: "Access Control - 50 Doors", customer: "Dangote Refinery", tech: "Engr. Chisom Eze", date: "2024-03-18", status: "scheduled", priority: "high" },
];

export default function AdminFieldTeamPage() {
  const [tab, setTab] = useState<"team" | "jobs" | "schedule">("team");

  return (
    <AdminShell title="Field Technical Team" subtitle="Manage technicians, job assignments, and schedules">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Technicians", value: demoTechnicians.length, icon: Users, color: "text-blue" },
            { label: "Available Now", value: demoTechnicians.filter((t) => t.status === "available").length, icon: CheckCircle2, color: "text-green-600" },
            { label: "Active Jobs", value: demoJobs.filter((j) => j.status === "in_progress").length, icon: Wrench, color: "text-yellow-600" },
            { label: "Unassigned", value: demoJobs.filter((j) => j.status === "unassigned").length, icon: AlertTriangle, color: "text-red" },
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

        {tab === "team" && (
          <div className="space-y-3">
            {demoTechnicians.map((tech) => (
              <div key={tech.id} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      tech.status === "available" ? "bg-green-500" : tech.status === "on_job" ? "bg-yellow-500" : "bg-gray-400"
                    }`}>{tech.name.split(" ").pop()?.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{tech.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          tech.status === "available" ? "bg-green-100 text-green-700" :
                          tech.status === "on_job" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                        }`}>{tech.status.replace("_", " ")}</span>
                      </div>
                      <p className="text-xs text-text-4">{tech.specialization} · <MapPin size={10} className="inline" /> {tech.zone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center"><p className="text-[10px] text-text-4">Jobs</p><p className="font-semibold text-sm">{tech.completedJobs}</p></div>
                    <div className="text-center"><p className="text-[10px] text-text-4">Rating</p><p className="font-semibold text-sm flex items-center gap-0.5">{tech.rating}<Star size={10} className="text-yellow-400 fill-yellow-400" /></p></div>
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg"><Phone size={16} className="text-blue" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tech.certifications.map((c) => (
                    <span key={c} className="text-[10px] px-2 py-1 bg-blue/10 text-blue rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>
            ))}
            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-text-4 hover:border-blue hover:text-blue flex items-center justify-center gap-2">
              <Plus size={16} /> Add Technician
            </button>
          </div>
        )}

        {tab === "jobs" && (
          <div className="space-y-3">
            {demoJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl p-4 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-full min-h-[40px] rounded-full shrink-0 ${
                    job.priority === "high" ? "bg-red" : job.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] text-text-4">{job.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        job.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                        job.status === "scheduled" ? "bg-blue/10 text-blue" :
                        "bg-red-100 text-red-700"
                      }`}>{job.status.replace("_", " ")}</span>
                    </div>
                    <h4 className="font-semibold text-sm">{job.title}</h4>
                    <p className="text-xs text-text-4">{job.customer} · <Calendar size={10} className="inline" /> {job.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  {job.tech ? (
                    <p className="text-sm font-medium text-text-2">{job.tech}</p>
                  ) : (
                    <button className="text-xs text-white bg-blue px-3 py-1.5 rounded-lg hover:bg-blue-600">Assign Tech</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "schedule" && (
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-sm mb-4">Weekly Schedule</h3>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center">
                  <p className="text-xs font-medium text-text-4 mb-2">{day}</p>
                  <div className="space-y-1">
                    {demoJobs.filter((_, i) => i % 7 === ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(day) % demoJobs.length).slice(0, 2).map((job) => (
                      <div key={job.id} className="bg-blue/10 text-blue text-[9px] p-1.5 rounded font-medium truncate">
                        {job.title.split(" - ")[0]}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
