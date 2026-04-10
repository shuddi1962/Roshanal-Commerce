"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Plus, GripVertical, Trash2, Edit, ChevronRight,
  Save, Undo,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  url: string;
  children: MenuItem[];
  isOpen?: boolean;
}

const defaultMenus: Record<string, MenuItem[]> = {
  main: [
    { id: "1", label: "Home", url: "/", children: [] },
    { id: "2", label: "Shop", url: "/shop", children: [
      { id: "2a", label: "Security Systems", url: "/shop/security", children: [] },
      { id: "2b", label: "Marine Equipment", url: "/shop/marine", children: [] },
      { id: "2c", label: "Safety Equipment", url: "/shop/safety", children: [] },
      { id: "2d", label: "Kitchen Equipment", url: "/shop/kitchen", children: [] },
      { id: "2e", label: "Boat Engines", url: "/shop/engines", children: [] },
    ]},
    { id: "3", label: "Services", url: "/services", children: [
      { id: "3a", label: "Boat Building", url: "/services/boat-building", children: [] },
      { id: "3b", label: "Dredging", url: "/services/dredging", children: [] },
      { id: "3c", label: "Installation", url: "/services/installation", children: [] },
    ]},
    { id: "4", label: "Brands", url: "/brands", children: [] },
    { id: "5", label: "About", url: "/about", children: [] },
    { id: "6", label: "Contact", url: "/contact", children: [] },
  ],
  footer: [
    { id: "f1", label: "Quick Links", url: "#", children: [
      { id: "f1a", label: "About Us", url: "/about", children: [] },
      { id: "f1b", label: "Contact", url: "/contact", children: [] },
      { id: "f1c", label: "Blog", url: "/blog", children: [] },
    ]},
    { id: "f2", label: "Customer Service", url: "#", children: [
      { id: "f2a", label: "Track Order", url: "/account/orders", children: [] },
      { id: "f2b", label: "Returns", url: "/return-policy", children: [] },
      { id: "f2c", label: "Warranty", url: "/warranty", children: [] },
    ]},
  ],
  mobile: [
    { id: "m1", label: "Home", url: "/", children: [] },
    { id: "m2", label: "Categories", url: "/shop", children: [] },
    { id: "m3", label: "Deals", url: "/deals", children: [] },
    { id: "m4", label: "Account", url: "/account", children: [] },
  ],
};

export default function AdminMenuPage() {
  const [activeMenu, setActiveMenu] = useState<"main" | "footer" | "mobile">("main");
  const [items, setItems] = useState(defaultMenus);
  const [newItem, setNewItem] = useState({ label: "", url: "" });

  const addMenuItem = () => {
    if (!newItem.label || !newItem.url) { alert("Please fill in both label and URL."); return; }
    const id = `new-${Date.now()}`;
    setItems((prev) => ({
      ...prev,
      [activeMenu]: [...prev[activeMenu], { id, label: newItem.label, url: newItem.url, children: [] }],
    }));
    setNewItem({ label: "", url: "" });
  };

  const deleteMenuItem = (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    const removeItem = (list: MenuItem[]): MenuItem[] =>
      list.filter((i) => i.id !== id).map((i) => ({ ...i, children: removeItem(i.children) }));
    setItems((prev) => ({ ...prev, [activeMenu]: removeItem(prev[activeMenu]) }));
  };

  const resetMenu = () => {
    if (confirm("Reset menu to default?")) setItems(defaultMenus);
  };

  const saveMenu = () => alert("Menu saved successfully!");

  const renderMenuItem = (item: MenuItem, depth: number = 0) => (
    <div key={item.id}>
      <div className={`flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue/30 group transition-colors`} style={{ marginLeft: depth * 24 }}>
        <button className="cursor-grab text-text-4 hover:text-text-2"><GripVertical size={14} /></button>
        {item.children.length > 0 && (
          <button className="text-text-4"><ChevronRight size={14} /></button>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium">{item.label}</span>
          <span className="text-xs text-text-4 ml-2">{item.url}</span>
        </div>
        <div className="flex gap-0.5">
          <button onClick={() => alert(`Edit: ${item.label}`)} className="p-1 hover:bg-gray-100 rounded"><Edit size={12} className="text-text-4" /></button>
          <button onClick={() => deleteMenuItem(item.id)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red" /></button>
        </div>
      </div>
      {item.children.length > 0 && (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => renderMenuItem(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <AdminShell title="Menu Builder" subtitle="Manage navigation menus and links">
      <div className="space-y-6">
        {/* Menu Type Selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["main", "footer", "mobile"] as const).map((m) => (
            <button key={m} onClick={() => setActiveMenu(m)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${activeMenu === m ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {m === "main" ? "Main Navigation" : m === "footer" ? "Footer Menu" : "Mobile Menu"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Item Panel */}
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-sm mb-4">Add Menu Item</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-4 mb-1 block">Label</label>
                <input type="text" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" placeholder="Menu label" />
              </div>
              <div>
                <label className="text-xs text-text-4 mb-1 block">URL</label>
                <input type="text" value={newItem.url} onChange={(e) => setNewItem({ ...newItem, url: e.target.value })} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg font-mono" placeholder="/page-url" />
              </div>
              <button onClick={addMenuItem} className="w-full h-9 bg-blue text-white rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center gap-2">
                <Plus size={14} /> Add to Menu
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-xs text-text-4 font-medium mb-2">Quick Add</h4>
              <div className="space-y-1">
                {["All Categories", "All Brands", "Custom Link", "Search Page"].map((q) => (
                  <button key={q} className="w-full text-left px-3 py-2 text-sm text-text-3 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                    {q} <ChevronRight size={14} className="text-text-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Structure */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm capitalize">{activeMenu} Menu Structure</h3>
              <div className="flex gap-2">
                <button onClick={resetMenu} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1"><Undo size={12} /> Reset</button>
                <button onClick={saveMenu} className="px-3 py-1.5 text-xs bg-blue text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"><Save size={12} /> Save Menu</button>
              </div>
            </div>
            <div className="space-y-1">
              {items[activeMenu].map((item) => renderMenuItem(item))}
            </div>
            <p className="text-xs text-text-4 mt-4">Drag items to reorder. Indent items to create sub-menus (up to 2 levels deep).</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
