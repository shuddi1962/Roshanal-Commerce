"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Edit2, Trash2, Loader2, Search, UserPlus, X,
  ToggleLeft, ToggleRight, Shield, Mail, Phone, Eye, EyeOff,
  Key, Users,
} from "lucide-react";

interface StaffMember {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "suspended" | "invited";
  avatar: string;
  last_login: string;
  created_at?: string;
}

const departments = ["Management", "Sales", "Operations", "Support", "Marketing", "Finance", "Warehouse", "IT"];
const roles = ["Super Admin", "Admin", "Manager", "Sales Rep", "Support Agent", "Warehouse Staff", "Accountant", "Content Manager", "Viewer"];

const defaultStaff: StaffMember[] = [
  { name: "Roshanal Admin", email: "admin@roshanalglobal.com", phone: "+234 803 123 4567", role: "Super Admin", department: "Management", status: "active", avatar: "", last_login: "2026-04-12" },
  { name: "Ada Okafor", email: "ada@roshanalglobal.com", phone: "+234 810 234 5678", role: "Sales Rep", department: "Sales", status: "active", avatar: "", last_login: "2026-04-11" },
  { name: "Emeka Nwachukwu", email: "emeka@roshanalglobal.com", phone: "+234 813 345 6789", role: "Warehouse Staff", department: "Warehouse", status: "active", avatar: "", last_login: "2026-04-10" },
  { name: "Blessing Ade", email: "blessing@roshanalglobal.com", phone: "+234 802 456 7890", role: "Support Agent", department: "Support", status: "active", avatar: "", last_login: "2026-04-12" },
  { name: "Chidi Okoro", email: "chidi@roshanalglobal.com", phone: "+234 811 567 8901", role: "Manager", department: "Operations", status: "active", avatar: "", last_login: "2026-04-09" },
  { name: "Ngozi Eze", email: "ngozi@roshanalglobal.com", phone: "+234 814 678 9012", role: "Content Manager", department: "Marketing", status: "suspended", avatar: "", last_login: "2026-03-20" },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "Viewer", department: "Sales", status: "active" as StaffMember["status"] });
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewStaff, setViewStaff] = useState<StaffMember | null>(null);

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    try {
      const { data } = await insforge.database.from("staff").select("*").order("name", { ascending: true });
      if (data && data.length > 0) {
        setStaff(data);
      } else {
        for (const s of defaultStaff) await insforge.database.from("staff").insert(s);
        const { data: seeded } = await insforge.database.from("staff").select("*").order("name", { ascending: true });
        setStaff(seeded || []);
      }
    } catch (e) {
      console.error("Failed to load staff:", e);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingStaff(null);
    setForm({ name: "", email: "", phone: "", password: "", role: "Viewer", department: "Sales", status: "active" });
    setShowPassword(false);
    setShowModal(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditingStaff(s);
    setForm({ name: s.name, email: s.email, phone: s.phone, password: "", role: s.role, department: s.department, status: s.status });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const payload: Partial<StaffMember> = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      department: form.department,
      status: form.status,
      avatar: "",
      last_login: "",
    };

    try {
      if (editingStaff?.id) {
        await insforge.database.from("staff").update(payload).eq("id", editingStaff.id);
        setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...payload } as StaffMember : s));
      } else {
        payload.status = "invited";
        const { data } = await insforge.database.from("staff").insert(payload).select("*");
        if (data?.[0]) setStaff([...staff, data[0]]);
      }
      setShowModal(false);
    } catch (e) {
      console.error("Failed to save staff:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await insforge.database.from("staff").delete().eq("id", id);
      setStaff(staff.filter(s => s.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete staff:", e);
    }
  };

  const toggleStatus = async (s: StaffMember) => {
    const newStatus = s.status === "active" ? "suspended" : "active";
    setStaff(staff.map(st => st.id === s.id ? { ...st, status: newStatus } as StaffMember : st));
    if (s.id) await insforge.database.from("staff").update({ status: newStatus }).eq("id", s.id);
  };

  let filtered = staff;
  if (filterDept !== "all") filtered = filtered.filter(s => s.department === filterDept);
  if (filterStatus !== "all") filtered = filtered.filter(s => s.status === filterStatus);
  if (search) filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-green-50 text-green-700";
      case "suspended": return "bg-red/10 text-red";
      case "invited": return "bg-yellow-50 text-yellow-700";
      default: return "bg-gray-100 text-text-4";
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === "Super Admin") return "bg-purple-50 text-purple-700";
    if (role === "Admin") return "bg-blue/10 text-blue";
    if (role === "Manager") return "bg-blue/5 text-blue";
    return "bg-gray-100 text-text-4";
  };

  if (loading) {
    return (
      <AdminShell title="Staff Management" subtitle="Manage team members, roles, and permissions">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Staff Management" subtitle="Manage team members, roles, and permissions">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Staff", value: staff.length, icon: Users },
          { label: "Active", value: staff.filter(s => s.status === "active").length, icon: UserPlus },
          { label: "Suspended", value: staff.filter(s => s.status === "suspended").length, icon: Shield },
          { label: "Departments", value: new Set(staff.map(s => s.department)).size, icon: Shield },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-text-1">{s.value}</p>
                <p className="text-xs text-text-4">{s.label}</p>
              </div>
              <s.icon size={20} className="text-text-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
          </div>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
            <option value="all">All Depts</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="invited">Invited</option>
          </select>
        </div>
        <button onClick={openCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <UserPlus size={14} /> Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left p-3 text-text-4 font-medium">Name</th>
              <th className="text-left p-3 text-text-4 font-medium">Role</th>
              <th className="text-left p-3 text-text-4 font-medium">Department</th>
              <th className="text-center p-3 text-text-4 font-medium">Status</th>
              <th className="text-left p-3 text-text-4 font-medium">Last Login</th>
              <th className="text-right p-3 text-text-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue to-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-bold">{s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-text-1">{s.name}</p>
                      <p className="text-[10px] text-text-4">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getRoleBadge(s.role)}`}>{s.role}</span>
                </td>
                <td className="p-3 text-text-3">{s.department}</td>
                <td className="p-3 text-center">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${getStatusBadge(s.status)}`}>{s.status}</span>
                </td>
                <td className="p-3 text-xs text-text-4">{s.last_login || "Never"}</td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setViewStaff(s)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-4"><Eye size={13} /></button>
                    <button onClick={() => toggleStatus(s)} className="p-1.5 hover:bg-gray-100 rounded-lg" title={s.status === "active" ? "Suspend" : "Activate"}>
                      {s.status === "active" ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} className="text-text-4" />}
                    </button>
                    <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={13} /></button>
                    <button onClick={() => setDeleteConfirm(s.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-text-4">No staff members found.</div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-[520px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingStaff ? "Edit Staff" : "Add Staff Member"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-2 block mb-1.5">Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. John Doe" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" placeholder="email@roshanalglobal.com" className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+234..." className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                  </div>
                </div>
              </div>
              {!editingStaff && (
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Password *</label>
                  <div className="relative">
                    <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                    <input
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 8 characters"
                      className="w-full h-10 pl-9 pr-10 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue"
                    />
                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-4">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Department</label>
                  <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              {editingStaff && (
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-text-1">Status</span>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as StaffMember["status"] })} className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">
                {editingStaff ? "Update" : "Send Invite & Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {viewStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setViewStaff(null)}>
          <div className="bg-white rounded-2xl w-[450px]" onClick={e => e.stopPropagation()}>
            <div className="p-6 text-center border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue to-blue-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{viewStaff.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
              </div>
              <h3 className="font-semibold text-lg">{viewStaff.name}</h3>
              <p className="text-sm text-text-4">{viewStaff.role} &middot; {viewStaff.department}</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text-3">Email</span>
                <span className="text-sm font-medium text-text-1">{viewStaff.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text-3">Phone</span>
                <span className="text-sm font-medium text-text-1">{viewStaff.phone || "—"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text-3">Status</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getStatusBadge(viewStaff.status)}`}>{viewStaff.status}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text-3">Last Login</span>
                <span className="text-sm text-text-1">{viewStaff.last_login || "Never"}</span>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setViewStaff(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Close</button>
              <button onClick={() => { setViewStaff(null); openEdit(viewStaff); }} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">Edit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Remove Staff Member?</h3>
            <p className="text-sm text-text-3 mb-5">Their account will be deactivated and they will lose all access.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-lg bg-red text-white text-sm font-semibold hover:bg-red/90">Remove</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
