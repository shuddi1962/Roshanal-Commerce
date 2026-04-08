"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ChevronDown,
  Users,
  Lock,
  Save,
  Search,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";

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

const defaultRoles = [
  {
    id: "1", name: "Super Admin", slug: "super-admin", description: "Full system access", isDefault: true, isEditable: false,
    userCount: 2, color: "#C8191C",
    permissions: Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: true }))])),
  },
  {
    id: "2", name: "Store Manager", slug: "store-manager", description: "Products, orders, customers, inventory, shipping, content", isDefault: true, isEditable: true,
    userCount: 3, color: "#1641C4",
    permissions: Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: !["API Vault", "Role Manager", "Accounting"].includes(m) }))])),
  },
  {
    id: "3", name: "Accountant", slug: "accountant", description: "P&L, expenses, invoices, VAT only", isDefault: true, isEditable: true,
    userCount: 1, color: "#0B6B3A",
    permissions: Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: ["Accounting", "Invoices", "Financial Reports", "Payments"].includes(m) }))])),
  },
  {
    id: "4", name: "Marketing Manager", slug: "marketing-manager", description: "Blog, campaigns, social, SEO, banners", isDefault: true, isEditable: true,
    userCount: 2, color: "#9C4B10",
    permissions: Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: ["Marketing", "Blog", "SEO", "Email Campaigns", "SMS Campaigns", "Banners", "Coupons", "Seasonal Campaigns", "Affiliate", "Social Posting", "UGC Video", "Media Library"].includes(m) }))])),
  },
  {
    id: "5", name: "Sales Staff", slug: "sales-staff", description: "Quotes, CRM pipeline, limited product view", isDefault: true, isEditable: true,
    userCount: 5, color: "#4A5270",
    permissions: Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: ["Quotes", "CRM Pipeline", "Dashboard"].includes(m) || (["Products", "Customers"].includes(m) && a === "View") }))])),
  },
  {
    id: "6", name: "Vendor", slug: "vendor", description: "Own shop, products, orders, payouts", isDefault: true, isEditable: true,
    userCount: 12, color: "#2D1B69",
    permissions: Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: false }))])),
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(defaultRoles);
  const [selectedRole, setSelectedRole] = useState(defaultRoles[0]);
  const [editMode, setEditMode] = useState(false);
  const [searchModule, setSearchModule] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const filteredModules = permissionModules.filter((m) =>
    m.toLowerCase().includes(searchModule.toLowerCase())
  );

  const handleTogglePermission = (module: string, action: string) => {
    if (!editMode) return;
    const updatedPermissions = { ...selectedRole.permissions };
    const modulePerms = updatedPermissions[module].map((p: any) =>
      p.action === action ? { ...p, granted: !p.granted } : p
    );
    updatedPermissions[module] = modulePerms;
    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  const handleToggleAllModule = (module: string, granted: boolean) => {
    if (!editMode) return;
    const updatedPermissions = { ...selectedRole.permissions };
    updatedPermissions[module] = permissionActions.map((a) => ({ action: a, granted }));
    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    setSelectedRole(updatedRole);
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)));
  };

  const createNewRole = () => {
    if (!newRoleName.trim()) return;
    const newRole = {
      id: String(roles.length + 1),
      name: newRoleName,
      slug: newRoleName.toLowerCase().replace(/\s+/g, "-"),
      description: "Custom role",
      isDefault: false,
      isEditable: true,
      userCount: 0,
      color: "#4A5270",
      permissions: Object.fromEntries(permissionModules.map((m) => [m, permissionActions.map((a) => ({ action: a, granted: false }))])),
    };
    setRoles([...roles, newRole]);
    setSelectedRole(newRole);
    setEditMode(true);
    setShowCreateModal(false);
    setNewRoleName("");
  };

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
            <Button size="sm" onClick={() => setEditMode(false)}>
              <Save size={14} className="mr-1" /> Save
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
                  selectedRole.id === role.id
                    ? "border-blue bg-white shadow-md"
                    : "border-border bg-white hover:border-blue/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: role.color + "20" }}>
                    <Shield size={14} style={{ color: role.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-syne font-bold text-xs text-text-1 truncate">{role.name}</p>
                      {role.isDefault && (
                        <span className="text-[8px] bg-blue/10 text-blue px-1 py-0.5 rounded shrink-0">DEFAULT</span>
                      )}
                    </div>
                    <p className="text-[10px] text-text-4 truncate mt-0.5">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Users size={10} className="text-text-4" />
                  <span className="text-[10px] text-text-4">{role.userCount} users</span>
                  {!role.isEditable && <Lock size={10} className="text-text-4 ml-auto" />}
                </div>
              </button>
            ))}
          </div>

          {/* Right: Permission Matrix */}
          <div className="flex-1 bg-white rounded-xl border border-border overflow-hidden">
            {/* Role Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedRole.color + "20" }}>
                  <Shield size={20} style={{ color: selectedRole.color }} />
                </div>
                <div>
                  <h2 className="font-syne font-bold text-lg text-text-1">{selectedRole.name}</h2>
                  <p className="text-xs text-text-4">{selectedRole.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedRole.isEditable && (
                  <>
                    <Button size="sm" variant={editMode ? "default" : "outline"} onClick={() => setEditMode(!editMode)}>
                      <Edit size={14} className="mr-1" /> {editMode ? "Editing" : "Edit Permissions"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy size={14} className="mr-1" /> Duplicate
                    </Button>
                    {!selectedRole.isDefault && (
                      <Button size="sm" variant="destructive" onClick={() => {
                        setRoles(roles.filter((r) => r.id !== selectedRole.id));
                        setSelectedRole(roles[0]);
                      }}>
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
                  type="text"
                  value={searchModule}
                  onChange={(e) => setSearchModule(e.target.value)}
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
                      <th key={action} className="text-center text-[10px] font-bold text-text-3 uppercase tracking-wider px-2 py-2.5 w-[80px]">
                        {action}
                      </th>
                    ))}
                    <th className="text-center text-[10px] font-bold text-text-3 uppercase tracking-wider px-2 py-2.5 w-[60px]">All</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.map((module) => {
                    const perms = selectedRole.permissions[module] || [];
                    const allGranted = perms.every((p: any) => p.granted);
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
                                  granted
                                    ? "bg-success text-white"
                                    : editMode
                                    ? "bg-off-white hover:bg-red-50 text-transparent hover:text-red"
                                    : "bg-off-white text-transparent"
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
                <Button size="sm">
                  <Plus size={14} className="mr-1" /> Assign
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <label className="flex items-center gap-2 text-xs text-text-2">
                  <input type="checkbox" className="rounded" />
                  Enforce 2FA for this role
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-[400px] p-6">
            <h3 className="font-syne font-bold text-lg mb-4">Create New Role</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Role Name</label>
                <input
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Regional Manager"
                  className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue"
                />
              </div>
              <p className="text-[10px] text-text-4">
                After creating, you can configure permissions in the matrix and assign staff members.
              </p>
            </div>
            <div className="flex gap-2 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={createNewRole}>Create Role</Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminShell>
  );
}
