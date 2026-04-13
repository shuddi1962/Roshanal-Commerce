"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { Image, Plus, Eye, Edit, Trash2, ToggleLeft, ToggleRight, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { insforge } from "@/lib/insforge";

interface Banner {
  id: string;
  title: string;
  position: string;
  image_url: string;
  link: string;
  active: boolean;
  clicks: number;
  views: number;
  start_date: string;
  end_date: string;
}

const seedBanners: Omit<Banner, "id">[] = [
  { title: "Summer Sale 2026", position: "Hero Slider", image_url: "/banners/summer.jpg", link: "/deals", active: true, clicks: 1245, views: 8900, start_date: "2026-03-01", end_date: "2026-06-30" },
  { title: "New Marine Products", position: "Hero Slider", image_url: "/banners/marine.jpg", link: "/shop/marine", active: true, clicks: 890, views: 5600, start_date: "2026-02-15", end_date: "2026-12-31" },
  { title: "Free Shipping Weekend", position: "Promo Bar", image_url: "/banners/shipping.jpg", link: "/shop", active: false, clicks: 456, views: 3200, start_date: "2026-03-08", end_date: "2026-03-10" },
  { title: "Boat Engine Special", position: "Category Banner", image_url: "/banners/engines.jpg", link: "/category/boat-engines", active: true, clicks: 678, views: 4100, start_date: "2026-01-01", end_date: "2026-12-31" },
  { title: "Safety Equipment Sale", position: "Sidebar", image_url: "/banners/safety.jpg", link: "/safety", active: true, clicks: 234, views: 1800, start_date: "2026-03-01", end_date: "2026-04-30" },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: "", position: "Hero Slider", image_url: "", link: "", start_date: "", end_date: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBanners(); }, []);

  const loadBanners = async () => {
    try {
      const { data, error } = await insforge.database.from("banners").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setBanners(data);
      else {
        for (const b of seedBanners) await insforge.database.from("banners").insert(b);
        const { data: seeded } = await insforge.database.from("banners").select("*");
        if (seeded) setBanners(seeded);
      }
    } catch (err) {
      console.error("Banners load error:", err);
      setBanners(seedBanners.map((b, i) => ({ ...b, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  };

  const saveBanner = async () => {
    setSaving(true);
    try {
      if (editBanner) {
        await insforge.database.from("banners").update(form).eq("id", editBanner.id);
        setBanners((prev) => prev.map((b) => b.id === editBanner.id ? { ...b, ...form } : b));
      } else {
        const { data } = await insforge.database.from("banners").insert({ ...form, active: true, clicks: 0, views: 0 }).select();
        if (data) setBanners((prev) => [data[0], ...prev]);
      }
      closeModal();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const toggleBanner = async (banner: Banner) => {
    const newActive = !banner.active;
    try {
      await insforge.database.from("banners").update({ active: newActive }).eq("id", banner.id);
      setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, active: newActive } : b));
    } catch (err) { console.error(err); }
  };

  const deleteBanner = async (id: string) => {
    try {
      await insforge.database.from("banners").delete().eq("id", id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) { console.error(err); }
  };

  const openEdit = (banner: Banner) => {
    setEditBanner(banner);
    setForm({ title: banner.title, position: banner.position, image_url: banner.image_url || "", link: banner.link || "", start_date: banner.start_date, end_date: banner.end_date });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditBanner(null); setForm({ title: "", position: "Hero Slider", image_url: "", link: "", start_date: "", end_date: "" }); };

  return (
    <AdminShell title="Banner Management" subtitle="Manage promotional banners across the store">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Banners", value: banners.filter((b) => b.active).length },
              { label: "Total Clicks", value: banners.reduce((a, b) => a + (b.clicks || 0), 0).toLocaleString() },
              { label: "Total Views", value: banners.reduce((a, b) => a + (b.views || 0), 0).toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-text-4">{s.label}</p>
                <p className="text-xl font-bold text-text-1">{s.value}</p>
              </div>
            ))}
          </div>
          <button onClick={() => { setEditBanner(null); setForm({ title: "", position: "Hero Slider", image_url: "", link: "", start_date: "", end_date: "" }); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600">
            <Plus size={16} /> Create Banner
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-text-4 text-sm">Loading banners...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Banner", "Position", "Status", "Clicks", "Views", "CTR", "Schedule", "Actions"].map((h) => (
                    <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {banner.image_url ? <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : null}
                          <Image size={16} className="text-text-4" />
                        </div>
                        <span className="font-medium">{banner.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-3">{banner.position}</td>
                    <td className="p-4">
                      <button onClick={() => toggleBanner(banner)} className="flex items-center gap-1">
                        {banner.active ? <ToggleRight size={20} className="text-green-600" /> : <ToggleLeft size={20} className="text-text-4" />}
                        <span className={`text-xs ${banner.active ? "text-green-600" : "text-text-4"}`}>{banner.active ? "Active" : "Inactive"}</span>
                      </button>
                    </td>
                    <td className="p-4 font-semibold">{(banner.clicks || 0).toLocaleString()}</td>
                    <td className="p-4">{(banner.views || 0).toLocaleString()}</td>
                    <td className="p-4 font-medium text-blue">{banner.views ? ((banner.clicks / banner.views) * 100).toFixed(1) : "0.0"}%</td>
                    <td className="p-4 text-xs text-text-4">{banner.start_date} — {banner.end_date}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button onClick={() => setPreviewBanner(banner)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-text-4" /></button>
                        <button onClick={() => openEdit(banner)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                        <button onClick={() => deleteBanner(banner.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{editBanner ? "Edit Banner" : "Create Banner"}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Banner Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Position</label>
                  <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm bg-white">
                    <option>Hero Slider</option><option>Promo Bar</option><option>Category Banner</option><option>Sidebar</option><option>Footer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Link URL</label>
                  <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="/deals" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-2 mb-1 block">Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" placeholder="/banners/my-banner.jpg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">Start Date</label>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-2 mb-1 block">End Date</label>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-5 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button>
              <Button className="flex-1" onClick={saveBanner} disabled={saving || !form.title}>
                <Save size={14} className="mr-1" /> {saving ? "Saving..." : editBanner ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewBanner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setPreviewBanner(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[600px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-syne font-bold text-lg">{previewBanner.title}</h2>
              <button onClick={() => setPreviewBanner(null)} className="p-2 rounded-lg hover:bg-off-white text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5">
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {previewBanner.image_url ? <img src={previewBanner.image_url} alt={previewBanner.title} className="w-full h-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : null}
                <Image size={32} className="text-text-4" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-text-4">Position:</span> <span className="font-medium">{previewBanner.position}</span></div>
                <div><span className="text-text-4">Status:</span> <span className={`font-medium ${previewBanner.active ? "text-success" : "text-text-4"}`}>{previewBanner.active ? "Active" : "Inactive"}</span></div>
                <div><span className="text-text-4">Link:</span> <span className="font-mono text-xs">{previewBanner.link}</span></div>
                <div><span className="text-text-4">CTR:</span> <span className="font-medium text-blue">{previewBanner.views ? ((previewBanner.clicks / previewBanner.views) * 100).toFixed(1) : "0"}%</span></div>
                <div><span className="text-text-4">Clicks:</span> <span className="font-semibold">{(previewBanner.clicks || 0).toLocaleString()}</span></div>
                <div><span className="text-text-4">Views:</span> <span>{(previewBanner.views || 0).toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
