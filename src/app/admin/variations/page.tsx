"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Edit2, Trash2, Loader2, Search, SlidersHorizontal, X, GripVertical,
} from "lucide-react";

interface Attribute {
  id?: string;
  name: string;
  slug: string;
  type: "select" | "color" | "button" | "radio";
  values: AttributeValue[];
  used_in: number;
  created_at?: string;
}

interface AttributeValue {
  label: string;
  value: string;
  color?: string;
}

const defaultAttributes: Attribute[] = [
  {
    name: "Color", slug: "color", type: "color", used_in: 45,
    values: [
      { label: "Black", value: "black", color: "#000000" },
      { label: "White", value: "white", color: "#FFFFFF" },
      { label: "Silver", value: "silver", color: "#C0C0C0" },
      { label: "Red", value: "red", color: "#EF4444" },
      { label: "Blue", value: "blue", color: "#3B82F6" },
      { label: "Navy", value: "navy", color: "#1E3A5F" },
      { label: "Orange", value: "orange", color: "#F97316" },
      { label: "Yellow", value: "yellow", color: "#EAB308" },
    ],
  },
  {
    name: "Size", slug: "size", type: "button", used_in: 30,
    values: [
      { label: "S", value: "s" }, { label: "M", value: "m" },
      { label: "L", value: "l" }, { label: "XL", value: "xl" },
      { label: "XXL", value: "xxl" },
    ],
  },
  {
    name: "Voltage", slug: "voltage", type: "select", used_in: 18,
    values: [
      { label: "12V DC", value: "12v" }, { label: "24V DC", value: "24v" },
      { label: "110V AC", value: "110v" }, { label: "220V AC", value: "220v" },
    ],
  },
  {
    name: "Resolution", slug: "resolution", type: "select", used_in: 22,
    values: [
      { label: "2MP (1080p)", value: "2mp" }, { label: "4MP (2K)", value: "4mp" },
      { label: "5MP", value: "5mp" }, { label: "8MP (4K)", value: "8mp" },
    ],
  },
  {
    name: "Horsepower", slug: "horsepower", type: "select", used_in: 8,
    values: [
      { label: "15 HP", value: "15hp" }, { label: "25 HP", value: "25hp" },
      { label: "40 HP", value: "40hp" }, { label: "60 HP", value: "60hp" },
      { label: "115 HP", value: "115hp" }, { label: "200 HP", value: "200hp" },
    ],
  },
  {
    name: "Material", slug: "material", type: "select", used_in: 15,
    values: [
      { label: "Stainless Steel", value: "stainless-steel" },
      { label: "Aluminum", value: "aluminum" },
      { label: "Plastic (ABS)", value: "abs-plastic" },
      { label: "Carbon Fiber", value: "carbon-fiber" },
    ],
  },
  {
    name: "Weight Class", slug: "weight-class", type: "button", used_in: 12,
    values: [
      { label: "Light", value: "light" }, { label: "Medium", value: "medium" },
      { label: "Heavy", value: "heavy" }, { label: "Extra Heavy", value: "extra-heavy" },
    ],
  },
];

export default function VariationsPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAttr, setEditingAttr] = useState<Attribute | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", type: "select" as Attribute["type"] });
  const [formValues, setFormValues] = useState<AttributeValue[]>([]);
  const [newVal, setNewVal] = useState({ label: "", value: "", color: "#000000" });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedAttr, setExpandedAttr] = useState<string | null>(null);

  useEffect(() => { loadAttributes(); }, []);

  const loadAttributes = async () => {
    try {
      const { data } = await insforge.database.from("attributes").select("*").order("name", { ascending: true });
      if (data && data.length > 0) {
        setAttributes(data.map((d: Record<string, unknown>) => ({
          ...d,
          values: typeof d.values === "string" ? JSON.parse(d.values as string) : (d.values || []),
        })) as Attribute[]);
      } else {
        for (const attr of defaultAttributes) {
          await insforge.database.from("attributes").insert({ ...attr, values: JSON.stringify(attr.values) });
        }
        const { data: seeded } = await insforge.database.from("attributes").select("*").order("name", { ascending: true });
        setAttributes((seeded || []).map((d: Record<string, unknown>) => ({
          ...d,
          values: typeof d.values === "string" ? JSON.parse(d.values as string) : (d.values || []),
        })) as Attribute[]);
      }
    } catch (e) {
      console.error("Failed to load attributes:", e);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openCreate = () => {
    setEditingAttr(null);
    setForm({ name: "", slug: "", type: "select" });
    setFormValues([]);
    setNewVal({ label: "", value: "", color: "#000000" });
    setShowModal(true);
  };

  const openEdit = (attr: Attribute) => {
    setEditingAttr(attr);
    setForm({ name: attr.name, slug: attr.slug, type: attr.type });
    setFormValues([...attr.values]);
    setNewVal({ label: "", value: "", color: "#000000" });
    setShowModal(true);
  };

  const addValue = () => {
    if (!newVal.label.trim()) return;
    setFormValues([...formValues, { label: newVal.label, value: newVal.value || generateSlug(newVal.label), color: form.type === "color" ? newVal.color : undefined }]);
    setNewVal({ label: "", value: "", color: "#000000" });
  };

  const removeValue = (idx: number) => {
    setFormValues(formValues.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    const slug = form.slug || generateSlug(form.name);
    const payload = { name: form.name, slug, type: form.type, values: JSON.stringify(formValues), used_in: 0 };

    try {
      if (editingAttr?.id) {
        await insforge.database.from("attributes").update({ ...payload, used_in: editingAttr.used_in }).eq("id", editingAttr.id);
        setAttributes(attributes.map(a => a.id === editingAttr.id ? { ...a, ...form, slug, values: formValues, used_in: editingAttr.used_in } : a));
      } else {
        const { data } = await insforge.database.from("attributes").insert(payload).select("*");
        if (data?.[0]) {
          setAttributes([...attributes, { ...data[0], values: formValues }]);
        }
      }
      setShowModal(false);
    } catch (e) {
      console.error("Failed to save attribute:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await insforge.database.from("attributes").delete().eq("id", id);
      setAttributes(attributes.filter(a => a.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete attribute:", e);
    }
  };

  const filtered = search ? attributes.filter(a => a.name.toLowerCase().includes(search.toLowerCase())) : attributes;

  if (loading) {
    return (
      <AdminShell title="Variations & Attributes" subtitle="Manage product attributes, sizes, colors, and custom variations">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Variations & Attributes" subtitle="Manage product attributes, sizes, colors, and custom variations">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Attributes", value: attributes.length },
          { label: "Total Values", value: attributes.reduce((s, a) => s + a.values.length, 0) },
          { label: "Color Types", value: attributes.filter(a => a.type === "color").length },
          { label: "Products Using", value: attributes.reduce((s, a) => s + (a.used_in || 0), 0) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-text-1">{s.value}</p>
            <p className="text-xs text-text-4">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search attributes..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
        </div>
        <button onClick={openCreate} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus size={14} /> Add Attribute
        </button>
      </div>

      {/* Attribute List */}
      <div className="space-y-3">
        {filtered.map(attr => (
          <div key={attr.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedAttr(expandedAttr === attr.id ? null : attr.id!)}
            >
              <GripVertical size={14} className="text-text-4/40" />
              <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center shrink-0">
                <SlidersHorizontal size={18} className="text-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-text-1">{attr.name}</h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-text-4">{attr.type}</span>
                </div>
                <p className="text-[10px] text-text-4">{attr.values.length} values &middot; Used in {attr.used_in || 0} products</p>
              </div>
              {/* Preview values */}
              <div className="hidden sm:flex items-center gap-1.5">
                {attr.type === "color" ? (
                  attr.values.slice(0, 6).map((v, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: v.color }} title={v.label} />
                  ))
                ) : (
                  attr.values.slice(0, 4).map((v, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-text-3">{v.label}</span>
                  ))
                )}
                {attr.values.length > (attr.type === "color" ? 6 : 4) && (
                  <span className="text-[10px] text-text-4">+{attr.values.length - (attr.type === "color" ? 6 : 4)}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={e => { e.stopPropagation(); openEdit(attr); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-3"><Edit2 size={14} /></button>
                <button onClick={e => { e.stopPropagation(); setDeleteConfirm(attr.id!); }} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Expanded Values */}
            {expandedAttr === attr.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                <p className="text-xs text-text-4 font-medium mb-2">All Values ({attr.values.length})</p>
                <div className="flex flex-wrap gap-2">
                  {attr.values.map((v, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
                      {attr.type === "color" && v.color && (
                        <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: v.color }} />
                      )}
                      <span className="text-xs font-medium text-text-1">{v.label}</span>
                      <span className="text-[10px] text-text-4 font-mono">{v.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-text-4">No attributes found.</div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">{editingAttr ? "Edit Attribute" : "New Attribute"}</h3>
              <button onClick={() => setShowModal(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Attribute Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })} placeholder="e.g. Color, Size" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Display Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Attribute["type"] })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                    <option value="select">Dropdown Select</option>
                    <option value="color">Color Swatches</option>
                    <option value="button">Button Group</option>
                    <option value="radio">Radio Buttons</option>
                  </select>
                </div>
              </div>

              {/* Values */}
              <div>
                <label className="text-sm font-medium text-text-2 block mb-2">Values</label>
                {formValues.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formValues.map((v, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-gray-200 bg-gray-50">
                        {form.type === "color" && v.color && (
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: v.color }} />
                        )}
                        <span className="text-xs font-medium">{v.label}</span>
                        <button onClick={() => removeValue(i)} className="text-text-4 hover:text-red ml-0.5"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  {form.type === "color" && (
                    <input type="color" value={newVal.color} onChange={e => setNewVal({ ...newVal, color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                  )}
                  <input
                    value={newVal.label}
                    onChange={e => setNewVal({ ...newVal, label: e.target.value, value: generateSlug(e.target.value) })}
                    placeholder="Value label (e.g. Red, XL)"
                    className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue"
                    onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addValue())}
                  />
                  <button onClick={addValue} className="h-10 px-4 bg-gray-100 text-text-2 text-sm font-medium rounded-lg hover:bg-gray-200 flex items-center gap-1">
                    <Plus size={14} /> Add
                  </button>
                </div>
                <p className="text-[10px] text-text-4 mt-1">Press Enter to add quickly</p>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">{editingAttr ? "Update" : "Create"} Attribute</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete Attribute?</h3>
            <p className="text-sm text-text-3 mb-5">This will remove the attribute from all products using it.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-10 rounded-lg bg-red text-white text-sm font-semibold hover:bg-red/90">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
