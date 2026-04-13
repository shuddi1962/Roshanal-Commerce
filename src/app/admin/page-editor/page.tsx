"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Plus, Trash2, Loader2, Save, X, GripVertical,
  Type, Image, Columns, List, Video, Code, Quote, Minus,
  ChevronUp, ChevronDown, Copy, Settings, Layout, FileText,
  Edit2,
} from "lucide-react";

interface PageBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

interface SitePage {
  id?: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  blocks: PageBlock[];
  updated_at?: string;
  created_at?: string;
}

const blockTypes = [
  { type: "heading", label: "Heading", icon: Type, default: { text: "Section Heading", level: "h2", align: "left" } },
  { type: "text", label: "Text Block", icon: FileText, default: { text: "Write your content here...", align: "left" } },
  { type: "image", label: "Image", icon: Image, default: { src: "", alt: "", caption: "", width: "full" } },
  { type: "two_columns", label: "Two Columns", icon: Columns, default: { left: "Left column content", right: "Right column content" } },
  { type: "banner", label: "Banner / CTA", icon: Layout, default: { title: "Call to Action", subtitle: "Description text", buttonText: "Shop Now", buttonLink: "/shop", bgColor: "#1641C4" } },
  { type: "video", label: "Video Embed", icon: Video, default: { url: "", caption: "" } },
  { type: "spacer", label: "Spacer", icon: Minus, default: { height: "40" } },
  { type: "html", label: "Custom HTML", icon: Code, default: { code: "" } },
  { type: "quote", label: "Quote", icon: Quote, default: { text: "", author: "" } },
  { type: "list", label: "Feature List", icon: List, default: { items: ["Feature 1", "Feature 2", "Feature 3"] } },
];

const generateId = () => Math.random().toString(36).substring(2, 10);

const defaultPages: SitePage[] = [
  { title: "About Us", slug: "about", status: "published", blocks: [
    { id: generateId(), type: "heading", content: { text: "About Roshanal Global", level: "h1", align: "center" } },
    { id: generateId(), type: "text", content: { text: "Roshanal Global Infotech Limited is Nigeria's leading supplier of security systems, marine equipment, fire safety, and industrial solutions. Based in Port Harcourt, Rivers State, we serve businesses and individuals across West Africa.", align: "left" } },
    { id: generateId(), type: "banner", content: { title: "Our Mission", subtitle: "To provide world-class security and marine solutions with exceptional service delivery.", buttonText: "Contact Us", buttonLink: "/contact", bgColor: "#1641C4" } },
  ]},
  { title: "Contact Us", slug: "contact", status: "published", blocks: [
    { id: generateId(), type: "heading", content: { text: "Get in Touch", level: "h1", align: "center" } },
    { id: generateId(), type: "two_columns", content: { left: "Email: info@roshanalglobal.com\nPhone: +234 803 123 4567\nAddress: 42 Ada George Road, Port Harcourt", right: "Business Hours:\nMonday - Friday: 8am - 6pm\nSaturday: 9am - 3pm\nSunday: Closed" } },
  ]},
  { title: "FAQ", slug: "faq", status: "draft", blocks: [
    { id: generateId(), type: "heading", content: { text: "Frequently Asked Questions", level: "h1", align: "center" } },
  ]},
];

export default function PageEditorPage() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState<SitePage | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertIndex, setInsertIndex] = useState(-1);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showPageModal, setShowPageModal] = useState(false);
  const [pageForm, setPageForm] = useState({ title: "", slug: "" });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => { loadPages(); }, []);

  const loadPages = async () => {
    try {
      const { data } = await insforge.database.from("site_pages").select("*").order("title", { ascending: true });
      if (data && data.length > 0) {
        setPages(data.map((p: Record<string, unknown>) => ({
          ...p,
          blocks: typeof p.blocks === "string" ? JSON.parse(p.blocks as string) : (p.blocks || []),
        })) as SitePage[]);
      } else {
        for (const page of defaultPages) {
          await insforge.database.from("site_pages").insert({ ...page, blocks: JSON.stringify(page.blocks) });
        }
        const { data: seeded } = await insforge.database.from("site_pages").select("*").order("title", { ascending: true });
        setPages((seeded || []).map((p: Record<string, unknown>) => ({
          ...p,
          blocks: typeof p.blocks === "string" ? JSON.parse(p.blocks as string) : (p.blocks || []),
        })) as SitePage[]);
      }
    } catch (e) {
      console.error("Failed to load pages:", e);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const createPage = async () => {
    if (!pageForm.title.trim()) return;
    const newPage: SitePage = {
      title: pageForm.title,
      slug: pageForm.slug || generateSlug(pageForm.title),
      status: "draft",
      blocks: [{ id: generateId(), type: "heading", content: { text: pageForm.title, level: "h1", align: "center" } }],
    };
    try {
      const { data } = await insforge.database.from("site_pages").insert({ ...newPage, blocks: JSON.stringify(newPage.blocks) }).select("*");
      if (data?.[0]) {
        const page = { ...data[0], blocks: newPage.blocks };
        setPages([...pages, page]);
        setActivePage(page);
      }
    } catch (e) { console.error(e); }
    setShowPageModal(false);
    setPageForm({ title: "", slug: "" });
  };

  const savePage = async () => {
    if (!activePage) return;
    setSaving(true);
    try {
      const payload = { title: activePage.title, slug: activePage.slug, status: activePage.status, blocks: JSON.stringify(activePage.blocks), updated_at: new Date().toISOString() };
      if (activePage.id) {
        await insforge.database.from("site_pages").update(payload).eq("id", activePage.id);
      }
      setPages(pages.map(p => p.id === activePage.id ? activePage : p));
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const deletePage = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    try {
      await insforge.database.from("site_pages").delete().eq("id", id);
      setPages(pages.filter(p => p.id !== id));
      if (activePage?.id === id) setActivePage(null);
    } catch (e) { console.error(e); }
  };

  const addBlock = (type: string) => {
    if (!activePage) return;
    const bt = blockTypes.find(b => b.type === type);
    if (!bt) return;
    const newBlock: PageBlock = { id: generateId(), type, content: { ...bt.default } };
    const blocks = [...activePage.blocks];
    blocks.splice(insertIndex >= 0 ? insertIndex : blocks.length, 0, newBlock);
    setActivePage({ ...activePage, blocks });
    setShowBlockPicker(false);
    setInsertIndex(-1);
    setEditingBlock(newBlock.id);
  };

  const updateBlock = (id: string, content: Record<string, unknown>) => {
    if (!activePage) return;
    setActivePage({ ...activePage, blocks: activePage.blocks.map(b => b.id === id ? { ...b, content } : b) });
  };

  const removeBlock = (id: string) => {
    if (!activePage) return;
    setActivePage({ ...activePage, blocks: activePage.blocks.filter(b => b.id !== id) });
    if (editingBlock === id) setEditingBlock(null);
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    if (!activePage) return;
    const blocks = [...activePage.blocks];
    const idx = blocks.findIndex(b => b.id === id);
    if (idx < 0 || (dir === -1 && idx === 0) || (dir === 1 && idx === blocks.length - 1)) return;
    [blocks[idx], blocks[idx + dir]] = [blocks[idx + dir], blocks[idx]];
    setActivePage({ ...activePage, blocks });
  };

  const duplicateBlock = (id: string) => {
    if (!activePage) return;
    const idx = activePage.blocks.findIndex(b => b.id === id);
    if (idx < 0) return;
    const copy = { ...activePage.blocks[idx], id: generateId(), content: { ...activePage.blocks[idx].content } };
    const blocks = [...activePage.blocks];
    blocks.splice(idx + 1, 0, copy);
    setActivePage({ ...activePage, blocks });
  };

  if (loading) {
    return (
      <AdminShell title="Page Editor" subtitle="Visual page builder for custom pages">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  // Page List View
  if (!activePage) {
    return (
      <AdminShell title="Page Editor" subtitle="Visual page builder for custom pages">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-text-3">{pages.length} pages</p>
          <button onClick={() => setShowPageModal(true)} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"><Plus size={14} /> New Page</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pages.map(page => (
            <div key={page.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center"><FileText size={18} className="text-blue" /></div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deletePage(page.id!)} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                </div>
              </div>
              <h4 className="font-semibold text-sm text-text-1">{page.title}</h4>
              <p className="text-[10px] text-text-4 font-mono">/{page.slug}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${page.status === "published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{page.status}</span>
                  <span className="text-[10px] text-text-4">{page.blocks.length} blocks</span>
                </div>
                <button onClick={() => setActivePage(page)} className="text-xs text-blue font-semibold hover:underline flex items-center gap-1"><Edit2 size={12} /> Edit</button>
              </div>
            </div>
          ))}
        </div>

        {showPageModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowPageModal(false)}>
            <div className="bg-white rounded-2xl w-[420px] p-5" onClick={e => e.stopPropagation()}>
              <h3 className="font-semibold text-lg mb-4">Create New Page</h3>
              <div className="space-y-3">
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Page Title *</label><input value={pageForm.title} onChange={e => setPageForm({ ...pageForm, title: e.target.value, slug: generateSlug(e.target.value) })} placeholder="e.g. About Us" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" /></div>
                <div><label className="text-sm font-medium text-text-2 block mb-1.5">Slug</label><input value={pageForm.slug} onChange={e => setPageForm({ ...pageForm, slug: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:border-blue" /></div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowPageModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Cancel</button>
                <button onClick={createPage} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">Create</button>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    );
  }

  // Editor View
  return (
    <AdminShell title={`Editing: ${activePage.title}`} subtitle={`/${activePage.slug}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => { savePage(); setActivePage(null); }} className="h-9 px-3 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50">Back to Pages</button>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setPreviewMode(false)} className={`px-3 py-1.5 text-xs rounded-md ${!previewMode ? "bg-white shadow-sm font-medium" : "text-text-4"}`}>Edit</button>
            <button onClick={() => setPreviewMode(true)} className={`px-3 py-1.5 text-xs rounded-md ${previewMode ? "bg-white shadow-sm font-medium" : "text-text-4"}`}>Preview</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={activePage.status} onChange={e => setActivePage({ ...activePage, status: e.target.value as SitePage["status"] })} className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button onClick={savePage} disabled={saving} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
        </div>
      </div>

      {/* Preview Mode */}
      {previewMode ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-4xl mx-auto min-h-[400px]">
          {activePage.blocks.map(block => (
            <div key={block.id} className="mb-6">
              {block.type === "heading" && (
                <div style={{ textAlign: ((block.content.align as string) || "left") as React.CSSProperties["textAlign"] }}>
                  {block.content.level === "h1" && <h1 className="text-3xl font-bold text-text-1">{block.content.text as string}</h1>}
                  {block.content.level === "h2" && <h2 className="text-2xl font-bold text-text-1">{block.content.text as string}</h2>}
                  {block.content.level === "h3" && <h3 className="text-xl font-semibold text-text-1">{block.content.text as string}</h3>}
                </div>
              )}
              {block.type === "text" && <p className="text-text-2 leading-relaxed whitespace-pre-wrap" style={{ textAlign: ((block.content.align as string) || "left") as React.CSSProperties["textAlign"] }}>{block.content.text as string}</p>}
              {block.type === "image" && block.content.src ? <img src={block.content.src as string} alt={block.content.alt as string} className="rounded-xl max-w-full" /> : null}
              {block.type === "banner" && (
                <div className="rounded-xl p-8 text-center text-white" style={{ backgroundColor: (block.content.bgColor as string) || "#1641C4" }}>
                  <h3 className="text-2xl font-bold mb-2">{block.content.title as string}</h3>
                  <p className="text-white/80 mb-4">{block.content.subtitle as string}</p>
                  <button className="px-6 py-2 bg-white text-text-1 rounded-lg font-semibold text-sm">{block.content.buttonText as string}</button>
                </div>
              )}
              {block.type === "two_columns" && (
                <div className="grid grid-cols-2 gap-6"><div className="text-text-2 whitespace-pre-wrap">{block.content.left as string}</div><div className="text-text-2 whitespace-pre-wrap">{block.content.right as string}</div></div>
              )}
              {block.type === "spacer" && <div style={{ height: `${block.content.height}px` }} />}
              {block.type === "quote" && (
                <blockquote className="border-l-4 border-blue pl-4 py-2 italic text-text-2">
                  <p>{block.content.text as string}</p>
                  {block.content.author ? <cite className="text-sm text-text-4 not-italic mt-2 block">— {block.content.author as string}</cite> : null}
                </blockquote>
              )}
              {block.type === "video" && block.content.url ? <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center"><Video size={40} className="text-gray-300" /></div> : null}
              {block.type === "html" && <div className="p-4 bg-gray-50 rounded-lg font-mono text-xs text-text-3 whitespace-pre-wrap">{block.content.code as string}</div>}
              {block.type === "list" && (
                <ul className="space-y-2">{((block.content.items as string[]) || []).map((item, i) => <li key={i} className="flex items-start gap-2 text-text-2"><span className="w-1.5 h-1.5 rounded-full bg-blue mt-2 shrink-0" />{item}</li>)}</ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Edit Mode */
        <div className="max-w-4xl mx-auto space-y-2">
          {activePage.blocks.map((block, idx) => {
            const bt = blockTypes.find(b => b.type === block.type);
            const Icon = bt?.icon || Code;
            const isEditing = editingBlock === block.id;

            return (
              <div key={block.id}>
                {/* Add Block Button Between Blocks */}
                <div className="flex justify-center py-1">
                  <button onClick={() => { setInsertIndex(idx); setShowBlockPicker(true); }} className="w-6 h-6 rounded-full border border-dashed border-gray-300 text-gray-300 hover:border-blue hover:text-blue flex items-center justify-center transition-colors">
                    <Plus size={12} />
                  </button>
                </div>

                <div className={`bg-white rounded-xl border ${isEditing ? "border-blue ring-2 ring-blue/10" : "border-gray-200"} overflow-hidden group`}>
                  {/* Block Header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} className="text-text-4/40 cursor-grab" />
                      <Icon size={14} className="text-text-4" />
                      <span className="text-xs font-medium text-text-3">{bt?.label || block.type}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => moveBlock(block.id, -1)} className="p-1 hover:bg-gray-200 rounded text-text-4"><ChevronUp size={13} /></button>
                      <button onClick={() => moveBlock(block.id, 1)} className="p-1 hover:bg-gray-200 rounded text-text-4"><ChevronDown size={13} /></button>
                      <button onClick={() => duplicateBlock(block.id)} className="p-1 hover:bg-gray-200 rounded text-text-4"><Copy size={13} /></button>
                      <button onClick={() => setEditingBlock(isEditing ? null : block.id)} className="p-1 hover:bg-gray-200 rounded text-text-4"><Settings size={13} /></button>
                      <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red/10 rounded text-red"><Trash2 size={13} /></button>
                    </div>
                  </div>

                  {/* Block Content / Editor */}
                  <div className="p-4">
                    {block.type === "heading" && (
                      <div className="space-y-2">
                        <input value={block.content.text as string} onChange={e => updateBlock(block.id, { ...block.content, text: e.target.value })} className="w-full text-xl font-bold text-text-1 focus:outline-none" placeholder="Heading text..." />
                        {isEditing && (
                          <div className="flex gap-2 pt-2 border-t border-gray-100">
                            <select value={block.content.level as string} onChange={e => updateBlock(block.id, { ...block.content, level: e.target.value })} className="h-8 px-2 rounded border border-gray-200 text-xs"><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option></select>
                            <select value={block.content.align as string} onChange={e => updateBlock(block.id, { ...block.content, align: e.target.value })} className="h-8 px-2 rounded border border-gray-200 text-xs"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
                          </div>
                        )}
                      </div>
                    )}
                    {block.type === "text" && (
                      <textarea value={block.content.text as string} onChange={e => updateBlock(block.id, { ...block.content, text: e.target.value })} rows={4} className="w-full text-sm text-text-2 focus:outline-none resize-none" placeholder="Write content..." />
                    )}
                    {block.type === "image" && (
                      <div className="space-y-2">
                        <input value={block.content.src as string} onChange={e => updateBlock(block.id, { ...block.content, src: e.target.value })} placeholder="Image URL..." className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                        {isEditing && <input value={block.content.alt as string} onChange={e => updateBlock(block.id, { ...block.content, alt: e.target.value })} placeholder="Alt text..." className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm" />}
                      </div>
                    )}
                    {block.type === "banner" && (
                      <div className="space-y-2">
                        <input value={block.content.title as string} onChange={e => updateBlock(block.id, { ...block.content, title: e.target.value })} className="w-full text-lg font-bold focus:outline-none" placeholder="Banner title..." />
                        <input value={block.content.subtitle as string} onChange={e => updateBlock(block.id, { ...block.content, subtitle: e.target.value })} className="w-full text-sm text-text-3 focus:outline-none" placeholder="Subtitle..." />
                        {isEditing && (
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                            <input value={block.content.buttonText as string} onChange={e => updateBlock(block.id, { ...block.content, buttonText: e.target.value })} placeholder="Button text" className="h-8 px-2 rounded border border-gray-200 text-xs" />
                            <input value={block.content.buttonLink as string} onChange={e => updateBlock(block.id, { ...block.content, buttonLink: e.target.value })} placeholder="Button link" className="h-8 px-2 rounded border border-gray-200 text-xs" />
                            <input type="color" value={block.content.bgColor as string} onChange={e => updateBlock(block.id, { ...block.content, bgColor: e.target.value })} className="h-8 w-full rounded border border-gray-200 cursor-pointer" />
                          </div>
                        )}
                      </div>
                    )}
                    {block.type === "two_columns" && (
                      <div className="grid grid-cols-2 gap-3">
                        <textarea value={block.content.left as string} onChange={e => updateBlock(block.id, { ...block.content, left: e.target.value })} rows={3} className="w-full text-sm text-text-2 p-2 rounded border border-gray-200 focus:outline-none focus:border-blue resize-none" placeholder="Left column..." />
                        <textarea value={block.content.right as string} onChange={e => updateBlock(block.id, { ...block.content, right: e.target.value })} rows={3} className="w-full text-sm text-text-2 p-2 rounded border border-gray-200 focus:outline-none focus:border-blue resize-none" placeholder="Right column..." />
                      </div>
                    )}
                    {block.type === "spacer" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-4">Height:</span>
                        <input value={block.content.height as string} onChange={e => updateBlock(block.id, { ...block.content, height: e.target.value })} type="number" className="w-20 h-8 px-2 rounded border border-gray-200 text-xs" />
                        <span className="text-xs text-text-4">px</span>
                      </div>
                    )}
                    {block.type === "quote" && (
                      <div className="space-y-2 border-l-4 border-blue pl-4">
                        <textarea value={block.content.text as string} onChange={e => updateBlock(block.id, { ...block.content, text: e.target.value })} rows={2} className="w-full text-sm italic focus:outline-none resize-none" placeholder="Quote text..." />
                        <input value={block.content.author as string} onChange={e => updateBlock(block.id, { ...block.content, author: e.target.value })} className="w-full text-xs text-text-4 focus:outline-none" placeholder="— Author name" />
                      </div>
                    )}
                    {block.type === "video" && (
                      <input value={block.content.url as string} onChange={e => updateBlock(block.id, { ...block.content, url: e.target.value })} placeholder="YouTube or video embed URL..." className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm" />
                    )}
                    {block.type === "html" && (
                      <textarea value={block.content.code as string} onChange={e => updateBlock(block.id, { ...block.content, code: e.target.value })} rows={4} className="w-full font-mono text-xs p-3 rounded-lg bg-gray-900 text-green-400 focus:outline-none resize-none" placeholder="<div>Your HTML here</div>" />
                    )}
                    {block.type === "list" && (
                      <div className="space-y-1">
                        {((block.content.items as string[]) || []).map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
                            <input value={item} onChange={e => { const items = [...(block.content.items as string[])]; items[i] = e.target.value; updateBlock(block.id, { ...block.content, items }); }} className="flex-1 text-sm focus:outline-none" placeholder="List item..." />
                            <button onClick={() => { const items = (block.content.items as string[]).filter((_, j) => j !== i); updateBlock(block.id, { ...block.content, items }); }} className="text-red hover:bg-red/10 p-0.5 rounded"><X size={12} /></button>
                          </div>
                        ))}
                        <button onClick={() => updateBlock(block.id, { ...block.content, items: [...(block.content.items as string[]), ""] })} className="text-xs text-blue font-medium flex items-center gap-1 mt-1"><Plus size={12} /> Add Item</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Block at End */}
          <div className="flex justify-center py-4">
            <button onClick={() => { setInsertIndex(-1); setShowBlockPicker(true); }} className="h-10 px-6 rounded-lg border-2 border-dashed border-gray-300 text-sm text-text-3 hover:border-blue hover:text-blue flex items-center gap-2 transition-colors">
              <Plus size={16} /> Add Block
            </button>
          </div>
        </div>
      )}

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowBlockPicker(false)}>
          <div className="bg-white rounded-2xl w-[500px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold text-lg">Add Block</h3>
              <button onClick={() => setShowBlockPicker(false)} className="text-text-4 hover:text-text-2"><X size={18} /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-2">
              {blockTypes.map(bt => (
                <button key={bt.type} onClick={() => addBlock(bt.type)} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue hover:bg-blue/5 transition-colors text-left">
                  <div className="w-9 h-9 rounded-lg bg-blue/10 flex items-center justify-center shrink-0"><bt.icon size={16} className="text-blue" /></div>
                  <span className="text-sm font-medium text-text-1">{bt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
