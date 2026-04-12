"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Shield, Plus, Edit, Trash2, Check, X, ChevronDown,
  Users, Lock, Save, Search, Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";

const permissionModules = [
  "Dashboard", "Products", "Orders", "Customers", "Inventory", "Shipping",
  "Marketing", "Blog", "SEO", "Email Campaigns", "SMS Campaigns", "Banners",
  "Coupons", "Seasonal Campaigns", "Affiliate", "Social Posting",
  "Quotes", "Bookings", "POS", "Rentals", "Subscriptions",
  "Payments", "Wallet & Loyalty", "Accounting", "Invoices", "Financial Reports",
  "CRM Pipeline", "Lead Generation", "B2B/Wholesale",
  "Multi-Location Inventory", "Warehouses", "Carriers", "Delivery Boys", "Field Team",
  "AI Tools", "UGC Video", "Voice Agent", "Feature Flags", "Plugin Manager",
  "Homepage Builder", "Page Builder", "Menu Builder", "Footer Builder", "Banner Builder", "Media Library", "Themes",
  "Settings", "API Vault", "Role Manager", "Staff Accounts", "Activity Log", "Security",
  "Vendor Marketplace", "Vendor Ads",
];

const permissionActions = ["View", "Create", "Edit", "Delete", "Manage", "Export"];

interface Role {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_default: boolean;
  is_editable: boolean;
  permissions: Record<string, { action: string; granted: boolean }[]>;
  user_count?: number;
  color?: string;
}

const makePerms = (granted: boolean | ((m: string, a: string) => boolean)) =>
  Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: typeof granted === "function" ? granted(m, a) : granted }))]));

const defaultRolesData: Omit<Role, "id">[] = [
  { name: "Super Admin", slug: "super-admin", description: "Full system access", is_default: true, is_editable: false, color: "#C8191C", user_count: 2, permissions: makePerms(true) },
  { name: "Store Manager", slug: "store-manager", description: "Products, orders, customers, inventory, shipping, content", is_default: true, is_editable: true, color: "#1641C4", user_count: 3, permissions: makePerms((m) => !["API Vault", "Role Manager", "Accounting"].includes(m)) },
  { name: "Accountant", slug: "accountant", description: "P&L, expenses, invoices, VAT only", is_default: true, is_editable: true, color: "#0B6B3A", user_count: 1, permissions: makePerms((m) => ["Accounting", "Invoices", "Financial Reports", "Payments"].includes(m)) },
  { name: "Marketing Manager", slug: "marketing-manager", description: "Blog, campaigns, social, SEO, banners", is_default: true, is_editable: true, color: "#9C4B10", user_count: 2, permissions: makePerms((m) => ["Marketing", "Blog", "SEO", "Email Campaigns", "SMS Campaigns", "Banners", "Coupons", "Seasonal Campaigns", "Affiliate", "Social Posting", "UGC Video", "Media Library"].includes(m)) },
  { name: "Sales Staff", slug: "sales-staff", description: "Quotes, CRM pipeline, limited product view", is_default: true, is_editable: true, color: "#4A5270", user_count: 5, permissions: makePerms((m, a) => ["Quotes", "CRM Pipeline", "Dashboard"].includes(m) || (["Products", "Customers"].includes(m) && a === "View")) },
  { name: "Vendor", slug: "vendor", description: "Own shop, products, orders, payouts", is_default: true, is_editable: true, color: "#2D1B69", user_count: 12, permissions: makePerms(false) },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [searchModule, setSearchModule] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadRoles(); }, []);

  const loadRoles = async () => {
    try {
      const { data, error } = await insforge.database.from("roles").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        setRoles(data);
        setSelectedRole(data[0]);
      } else {
        for (const r of defaultRolesData) {
          await insforge.database.from("roles").insert(r);
        }
        const { data: seeded } = await insforge.database.from("roles").select("*").order("created_at", { ascending: true });
        if (seeded && seeded.length > 0) {
          setRoles(seeded);
          setSelectedRole(seeded[0]);
        }
      }
    } catch (err) {
      console.error("Roles load error:", err);
      const fallback = defaultRolesData.map((r, i) => ({ ...r, id: String(i + 1) }));
      setRoles(fallback);
      setSelectedRole(fallback[0]);
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = permissionModules.filter((m) =>
    m.toLowerCase().includes(searchModule.toLowerCase())
  );

  const handleTogglePermission = (module: string, action: string) => {
    if (!editMode || !selectedRole) return;
    const updatedPermissions = { ...selectedRole.permissions };
    updatedPermissions[module] = (updatedPermissions[module] || []).map((p: any) =>
      p.action === action ? { ...p, granted: !p.granted } : p
    );
    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);
    setRoles(roles.map((r) => r.id === updatedRole.id ? updatedRole : r));
  };

  const handleToggleAllModule = (module: string, granted: boolean) => {
    if (!editMode || !selectedRole) return;
    const updatedPermissions = { ...selectedRole.permissions };
    updatedPermissions[module] = permissionActions.map((a) => ({ action: a, granted }));
    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);
    setRoles(roles.map((r) => r.id === updatedRole.id ? updatedRole : r));
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await insforge.database.from("roles").update({ permissions: selectedRole.permissions }).eq("id", selectedRole.id);
      setEditMode(false);
    } catch (err) {
      console.error("Save permissions error:", err);
    } finally {
      setSaving(false);
    }
  };

  const createNewRole = async () => {
    if (!newRoleName.trim()) return;
    const newRole: Omit<Role, "id"> = {
      name: newRoleName,
      slug: newRoleName.toLowerCase().replace(/\s+/g, "-"),
      description: newRoleDesc || "Custom role",
      is_default: false,
      is_editable: true,
      color: "#4A5270",
      user_count: 0,
      permissions: makePerms(false),
    };
    try {
      const { data } = await insforge.database.from("roles").insert(newRole).select();
      if (data && data[0]) {
        setRoles([...roles, data[0]]);
        setSelectedRole(data[0]);
        setEditMode(true);
      }
    } catch (err) {
      console.error("Create role error:", err);
    }
    setShowCreateModal(false);
    setNewRoleName("");
    setNewRoleDesc("");
  };

  const duplicateRole = async () => {
    if (!selectedRole) return;
    const dup: Omit<Role, "id"> = {
      name: `${selectedRole.name} (Copy)`,
      slug: `${selectedRole.slug}-copy`,
      description: selectedRole.description,
      is_default: false,
      is_editable: true,
      color: selectedRole.color || "#4A5270",
      user_count: 0,
      permissions: { ...selectedRole.permissions },
    };
    try {
      const { data } = await insforge.database.from("roles").insert(dup).select();
      if (data && data[0]) {
        setRoles([...roles, data[0]]);
        setSelectedRole(data[0]);
        setEditMode(true);
      }
    } catch (err) {
      console.error("Duplicate role error:", err);
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await insforge.database.from("roles").delete().eq("id", id);
      const remaining = roles.filter((r) => r.id !== id);
      setRoles(remaining);
      if (selectedRole?.id === id) setSelectedRole(remaining[0] || null);
    } catch (err) {
      console.error("Delete role error:", err);
    }
  };

  if (loading) {
    return (
      <AdminShell title="Roles & Permissions" subtitle="Manage user roles and access control">
        <div className="p-12 text-center text-text-4 text-sm">Loading roles...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Roles & Permissions" subtitle="Manage user roles and access control">
      <div>
        {/* Top Bar */}
        <div className="bg-white border-b border-border h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-text-3 hover:text-text-1"><ArrowLeft size={18} /></Link>
            <div>
              <h1 className="font-syne font-bold text-sm text-text-1">Roles & Permissions</h1>
              <p className="text-[10px] text-text-4">Manage roles, create custom ones, and assign permissions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowCreateModal(true)}>
              <Plus size={14} className="mr-1" /> Create Role
            </Button>
            {editMode && (
              <Button size="sm" onClick={savePermissions} disabled={saving}>
                <Save size={14} className="mr-1" /> {saving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto p-6">
          <div className="flex gap-6">
            {/* Left: Role List */}
            <div className="w-[280px] shrink-0 space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role); setEditMode(false); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedRole?.id === role.id
                      ? "border-blue bg-white shadow-md"
                      : "border-border bg-white hover:border-blue/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: (role.color || "#4A5270") + "20" }}>
                      <Shield size={14} style={{ color: role.color || "#4A5270" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-syne font-bold text-xs text-text-1 truncate">{role.name}</p>
                        {role.is_default && (
                          <span className="text-[8px] bg-blue/10 text-blue px-1 py-0.5 rounded shrink-0">DEFAULT</span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-4 truncate mt-0.5">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Users size={10} className="text-text-4" />
                    <span className="text-[10px] text-text-4">{role.user_count || 0} users</span>
                    {!role.is_editable && <Lock size={10} className="text-text-4 ml-auto" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Permission Matrix */}
            {selectedRole && (
              <div className="flex-1 bg-white rounded-xl border border-border overflow-hidden">
                {/* Role Header */}
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: (selectedRole.color || "#4A5270") + "20" }}>
                      <Shield size={20} style={{ color: selectedRole.color || "#4A5270" }} />
                    </div>
                    <div>
                      <h2 className="font-syne font-bold text-lg text-text-1">{selectedRole.name}</h2>
                      <p className="text-xs text-text-4">{selectedRole.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedRole.is_editable && (
                      <>
                        <Button size="sm" variant={editMode ? "default" : "outline"} onClick={() => setEditMode(!editMode)}>
                          <Edit size={14} className="mr-1" /> {editMode ? "Editing" : "Edit Permissions"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={duplicateRole}>
                          <Copy size={14} className="mr-1" /> Duplicate
                        </Button>
                        {!selectedRole.is_default && (
                          <Button size="sm" variant="destructive" onClick={() => deleteRole(selectedRole.id)}>
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                    <input
                      type="text" value={searchModule} onChange={(e) => setSearchModule(e.target.value)}
                      placeholder="Search modules..."
                      className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border focus:outline-none focus:border-blue"
                    />
                  </div>
                </div>

                {/* Permission Grid */}
                <div className="overflow-auto max-h-[600px]">
                  <table className="w-full">
                    <thead className="bg-off-white sticky top-0">
                      <tr>
                        <th className="text-left text-[10px] font-bold text-text-3 uppercase tracking-wider px-4 py-2.5 w-[200px]">Module</th>
                        {permissionActions.map((action) => (
                          <th key={action} className="text-center text-[10px] font-bold text-text-3 uppercase tracking-wider px-2 py-2.5 w-[80px]">{action}</th>
                        ))}
                        <th className="text-center text-[10px] font-bold text-text-3 uppercase tracking-wider px-2 py-2.5 w-[60px]">All</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredModules.map((module) => {
                        const perms = selectedRole.permissions?.[module] || [];
                        const allGranted = perms.length > 0 && perms.every((p: any) => p.granted);
                        return (
                          <tr key={module} className="border-b border-border hover:bg-off-white/50">
                            <td className="px-4 py-2.5 text-xs text-text-2 font-semibold">{module}</td>
                            {permissionActions.map((action) => {
                              const perm = perms.find((p: any) => p.action === action);
                              const granted = perm?.granted || false;
                              return (
                                <td key={action} className="text-center px-2 py-2.5">
                                  <button
                                    onClick={() => handleTogglePermission(module, action)}
                                    disabled={!editMode}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-all ${
                                      granted ? "bg-success text-white" : editMode ? "bg-off-white hover:bg-red-50 text-transparent hover:text-red" : "bg-off-white text-transparent"
                                    }`}
                                  >
                                    {granted ? <Check size={12} /> : <X size={12} />}
                                  </button>
                                </td>
                              );
                            })}
                            <td className="text-center px-2 py-2.5">
                              <button
                                onClick={() => handleToggleAllModule(module, !allGranted)}
                                disabled={!editMode}
                                className={`w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-all ${
                                  allGranted ? "bg-blue text-white" : editMode ? "bg-off-white hover:bg-blue-50 text-text-4" : "bg-off-white text-text-4"
                                }`}
                              >
                                {allGranted ? <Check size={12} /> : <ChevronDown size={12} />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Staff Assignment */}
                <div className="p-5 border-t border-border">
                  <h3 className="font-syne font-bold text-sm mb-3">Assign to Staff</h3>
                  <div className="flex gap-2">
                    <select className="flex-1 h-9 px-3 text-xs rounded-lg border border-border">
                      <option>Select staff member...</option>
                      <option>John Okafor — john@roshanalglobal.com</option>
                      <option>Amina Bello — amina@roshanalglobal.com</option>
                      <option>David Nwankwo — david@roshanalglobal.com</option>
                    </select>
                    <Button size="sm"><Plus size={14} className="mr-1" /> Assign</Button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <label className="flex items-center gap-2 text-xs text-text-2">
                      <input type="checkbox" className="rounded" />
                      Enforce 2FA for this role
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Role Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white rounded-2xl w-[400px] p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-syne font-bold text-lg mb-4">Create New Role</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Role Name</label>
                  <input
                    value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g. Regional Manager"
                    className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Description</label>
                  <input
                    value={newRoleDesc} onChange={(e) => setNewRoleDesc(e.target.value)}
                    placeholder="Short description of this role"
                    className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue"
                  />
                </div>
                <p className="text-[10px] text-text-4">
                  After creating, you can configure permissions in the matrix and assign staff members.
                </p>
              </div>
              <div className="flex gap-2 mt-5">
                <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button className="flex-1" onClick={createNewRole} disabled={!newRoleName.trim()}>Create Role</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
