"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Save, ArrowLeft, Image, Plus, Trash2, Loader2,
  Package, Tag, DollarSign, Layers, Info, ToggleLeft, ToggleRight,
  Bold, Italic, List,
} from "lucide-react";

interface Category { id: string; name: string; parent_id: string | null; }
interface Brand { id: string; name: string; }
interface TagItem { id: string; name: string; color: string; }
interface Attribute { id: string; name: string; type: string; values: { label: string; value: string; color?: string }[]; }

export default function ProductCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lookup data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [manageStock, setManageStock] = useState(true);
  const [stockQty, setStockQty] = useState("0");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [images, setImages] = useState<string[]>([""]);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string[]>>({});
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [activeSection, setActiveSection] = useState("general");

  useEffect(() => { loadLookups(); }, []);

  const loadLookups = async () => {
    try {
      const [catRes, brandRes, tagRes, attrRes] = await Promise.all([
        insforge.database.from("categories").select("*").eq("active", true),
        insforge.database.from("brands").select("*"),
        insforge.database.from("tags").select("*"),
        insforge.database.from("attributes").select("*"),
      ]);
      setCategories(catRes.data || []);
      setBrands(brandRes.data || []);
      setTags(tagRes.data || []);
      setAttributes((attrRes.data || []).map((a: Record<string, unknown>) => ({
        ...a,
        values: typeof a.values === "string" ? JSON.parse(a.values as string) : (a.values || []),
      })) as Attribute[]);
    } catch (e) {
      console.error("Failed to load lookups:", e);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const generateSKU = () => "RS-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleSave = async (saveStatus?: string) => {
    if (!name.trim()) return alert("Product name is required.");
    setSaving(true);
    const payload = {
      name,
      slug: slug || generateSlug(name),
      sku: sku || generateSKU(),
      regular_price: Number(regularPrice) || 0,
      sale_price: salePrice ? Number(salePrice) : null,
      cost_price: costPrice ? Number(costPrice) : null,
      short_description: shortDesc,
      long_description: longDesc,
      category_id: categoryId || null,
      brand_id: brandId || null,
      tags: JSON.stringify(selectedTags),
      status: saveStatus || status,
      featured,
      manage_stock: manageStock,
      stock_qty: Number(stockQty) || 0,
      low_stock_threshold: Number(lowStockThreshold) || 5,
      weight: weight ? Number(weight) : null,
      length: dimensions.length ? Number(dimensions.length) : null,
      width: dimensions.width ? Number(dimensions.width) : null,
      height: dimensions.height ? Number(dimensions.height) : null,
      images: JSON.stringify(images.filter(Boolean)),
      variations: JSON.stringify(selectedVariations),
      meta_title: metaTitle,
      meta_description: metaDesc,
      rating: 0,
      review_count: 0,
    };
    try {
      await insforge.database.from("products").insert(payload);
      router.push("/admin/products");
    } catch (e) {
      console.error("Failed to save product:", e);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: string) => {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const toggleVariationValue = (attrId: string, val: string) => {
    const current = selectedVariations[attrId] || [];
    setSelectedVariations({
      ...selectedVariations,
      [attrId]: current.includes(val) ? current.filter(v => v !== val) : [...current, val],
    });
  };

  const sections = [
    { id: "general", label: "General", icon: Info },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "images", label: "Images", icon: Image },
    { id: "variations", label: "Variations", icon: Layers },
    { id: "seo", label: "SEO", icon: Tag },
  ];

  const parentCats = categories.filter(c => !c.parent_id);
  const getSubCats = (pid: string) => categories.filter(c => c.parent_id === pid);

  if (loading) {
    return (
      <AdminShell title="Add Product" subtitle="Create a new product listing">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Add Product" subtitle="Create a new product listing">
      <div className="flex gap-6">
        {/* Section Nav */}
        <aside className="hidden lg:block w-48 shrink-0">
          <nav className="space-y-0.5 sticky top-4">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === s.id ? "bg-blue text-white font-medium" : "text-text-3 hover:bg-gray-100"}`}>
                <s.icon size={15} /> {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Form */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* General */}
          {(activeSection === "general" || activeSection === "all") && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2"><Info size={15} /> General Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Product Name *</label>
                  <input value={name} onChange={e => { setName(e.target.value); if (!slug) setSlug(generateSlug(e.target.value)); }} placeholder="e.g. Hikvision 4MP IP Camera" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Slug</label>
                    <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generated" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">SKU</label>
                    <div className="flex gap-2">
                      <input value={sku} onChange={e => setSku(e.target.value)} placeholder="Auto-generate" className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue" />
                      <button onClick={() => setSku(generateSKU())} className="h-10 px-3 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50">Generate</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Short Description</label>
                  <textarea value={shortDesc} onChange={e => setShortDesc(e.target.value)} rows={2} placeholder="Brief product summary..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Full Description</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border-b border-gray-200">
                      <button className="p-1 hover:bg-gray-200 rounded"><Bold size={14} /></button>
                      <button className="p-1 hover:bg-gray-200 rounded"><Italic size={14} /></button>
                      <button className="p-1 hover:bg-gray-200 rounded"><List size={14} /></button>
                    </div>
                    <textarea value={longDesc} onChange={e => setLongDesc(e.target.value)} rows={6} placeholder="Detailed product description..." className="w-full px-3 py-2 text-sm focus:outline-none resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Category</label>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                      <option value="">Select category</option>
                      {parentCats.map(c => {
                        const subs = getSubCats(c.id);
                        return [
                          <option key={c.id} value={c.id}>{c.name}</option>,
                          ...subs.map(s => <option key={s.id} value={s.id}>&nbsp;&nbsp;└ {s.name}</option>),
                        ];
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Brand</label>
                    <select value={brandId} onChange={e => setBrandId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                      <option value="">Select brand</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <button key={t.id} onClick={() => toggleTag(t.id)} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selectedTags.includes(t.id) ? "border-blue bg-blue/10 text-blue font-medium" : "border-gray-200 text-text-3 hover:border-blue"}`}>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm">
                      <option value="draft">Draft</option>
                      <option value="active">Active (Published)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-text-1">Featured Product</span>
                      <button onClick={() => setFeatured(!featured)}>
                        {featured ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {(activeSection === "pricing" || activeSection === "all") && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2"><DollarSign size={15} /> Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Regular Price (₦) *</label>
                  <input value={regularPrice} onChange={e => setRegularPrice(e.target.value)} type="number" placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Sale Price (₦)</label>
                  <input value={salePrice} onChange={e => setSalePrice(e.target.value)} type="number" placeholder="Optional" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Cost Price (₦)</label>
                  <input value={costPrice} onChange={e => setCostPrice(e.target.value)} type="number" placeholder="For profit calc" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
              {regularPrice && salePrice && Number(salePrice) < Number(regularPrice) && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  Discount: {Math.round((1 - Number(salePrice) / Number(regularPrice)) * 100)}% off &middot; Save ₦{(Number(regularPrice) - Number(salePrice)).toLocaleString()}
                </div>
              )}
              {regularPrice && costPrice && (
                <div className="mt-3 p-3 bg-blue/5 rounded-lg text-sm text-blue">
                  Margin: ₦{(Number(salePrice || regularPrice) - Number(costPrice)).toLocaleString()} ({Math.round(((Number(salePrice || regularPrice) - Number(costPrice)) / Number(salePrice || regularPrice)) * 100)}%)
                </div>
              )}
            </div>
          )}

          {/* Inventory */}
          {(activeSection === "inventory" || activeSection === "all") && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2"><Package size={15} /> Inventory & Shipping</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-text-1">Track Stock Quantity</span>
                  <button onClick={() => setManageStock(!manageStock)}>
                    {manageStock ? <ToggleRight size={24} className="text-blue" /> : <ToggleLeft size={24} className="text-text-4" />}
                  </button>
                </div>
                {manageStock && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-text-2 block mb-1.5">Stock Quantity</label>
                      <input value={stockQty} onChange={e => setStockQty(e.target.value)} type="number" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-2 block mb-1.5">Low Stock Alert</label>
                      <input value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} type="number" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Weight (kg)</label>
                    <input value={weight} onChange={e => setWeight(e.target.value)} type="number" step="0.1" placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Length (cm)</label>
                    <input value={dimensions.length} onChange={e => setDimensions({ ...dimensions, length: e.target.value })} type="number" placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Width (cm)</label>
                    <input value={dimensions.width} onChange={e => setDimensions({ ...dimensions, width: e.target.value })} type="number" placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-2 block mb-1.5">Height (cm)</label>
                    <input value={dimensions.height} onChange={e => setDimensions({ ...dimensions, height: e.target.value })} type="number" placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Images */}
          {(activeSection === "images" || activeSection === "all") && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2"><Image size={15} /> Product Images</h3>
              <div className="space-y-3">
                {images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                      {img ? <img src={img} alt={`Product image ${i + 1}`} className="w-full h-full rounded-lg object-cover" /> : <Image size={18} className="text-gray-300" />}
                    </div>
                    <input
                      value={img}
                      onChange={e => { const u = [...images]; u[i] = e.target.value; setImages(u); }}
                      placeholder={i === 0 ? "Main image URL..." : "Additional image URL..."}
                      className="flex-1 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue"
                    />
                    {images.length > 1 && (
                      <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="p-2 hover:bg-red/10 rounded-lg text-red"><Trash2 size={14} /></button>
                    )}
                  </div>
                ))}
                <button onClick={() => setImages([...images, ""])} className="h-9 px-4 rounded-lg border border-dashed border-gray-300 text-sm text-text-3 hover:border-blue hover:text-blue flex items-center gap-2">
                  <Plus size={14} /> Add Image
                </button>
                <p className="text-[10px] text-text-4">First image is the main product image. Drag to reorder. Supports URLs from Media Library.</p>
              </div>
            </div>
          )}

          {/* Variations */}
          {(activeSection === "variations" || activeSection === "all") && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2"><Layers size={15} /> Variations & Attributes</h3>
              {attributes.length === 0 ? (
                <p className="text-sm text-text-4">No attributes configured. <a href="/admin/variations" className="text-blue hover:underline">Create attributes first</a>.</p>
              ) : (
                <div className="space-y-4">
                  {attributes.map(attr => (
                    <div key={attr.id} className="p-4 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-text-1 mb-2">{attr.name} <span className="text-[10px] text-text-4 font-normal">({attr.type})</span></p>
                      <div className="flex flex-wrap gap-2">
                        {attr.values.map(v => {
                          const selected = (selectedVariations[attr.id] || []).includes(v.value);
                          return (
                            <button
                              key={v.value}
                              onClick={() => toggleVariationValue(attr.id, v.value)}
                              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${selected ? "border-blue bg-blue/10 text-blue font-medium" : "border-gray-200 text-text-3 hover:border-blue"}`}
                            >
                              {attr.type === "color" && v.color && <div className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: v.color }} />}
                              {v.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEO */}
          {(activeSection === "seo" || activeSection === "all") && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-sm text-text-1 mb-4 flex items-center gap-2"><Tag size={15} /> SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Meta Title</label>
                  <input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={name || "Product name"} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                  <p className="text-[10px] text-text-4 mt-1">{(metaTitle || name).length}/60 characters</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-2 block mb-1.5">Meta Description</label>
                  <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={2} placeholder="Product description for search engines..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none" />
                  <p className="text-[10px] text-text-4 mt-1">{metaDesc.length}/160 characters</p>
                </div>
                {/* Preview */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-text-4 mb-1">Search Preview</p>
                  <p className="text-blue text-sm font-medium">{metaTitle || name || "Product Name"} | Roshanal Global</p>
                  <p className="text-[10px] text-green-700 font-mono">roshanalglobal.com/product/{slug || "product-slug"}</p>
                  <p className="text-xs text-text-3 mt-0.5 line-clamp-2">{metaDesc || shortDesc || "Product description will appear here..."}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between sticky bottom-4">
            <button onClick={() => router.back()} className="h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50 flex items-center gap-2">
              <ArrowLeft size={14} /> Back to Products
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => handleSave("draft")} disabled={saving} className="h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-text-2 hover:bg-gray-50">
                Save as Draft
              </button>
              <button onClick={() => handleSave("active")} disabled={saving} className="h-10 px-5 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Publish Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
