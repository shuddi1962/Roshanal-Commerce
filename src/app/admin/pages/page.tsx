"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Plus, Search, Eye, Edit, Trash2, Copy, GripVertical,
  Layout, Type, Image, Video, ShoppingBag, Star, MessageSquare,
  Columns, Sparkles, Code,
} from "lucide-react";

const demoPages = [
  { id: 1, title: "About Us", slug: "/about", status: "published", lastModified: "2024-03-10", author: "Admin", template: "Standard" },
  { id: 2, title: "Contact Us", slug: "/contact", status: "published", lastModified: "2024-03-08", author: "Admin", template: "Contact" },
  { id: 3, title: "Privacy Policy", slug: "/privacy", status: "published", lastModified: "2024-02-20", author: "Admin", template: "Legal" },
  { id: 4, title: "Terms of Service", slug: "/terms", status: "published", lastModified: "2024-02-20", author: "Admin", template: "Legal" },
  { id: 5, title: "Shipping Policy", slug: "/shipping-policy", status: "published", lastModified: "2024-02-15", author: "Admin", template: "Standard" },
  { id: 6, title: "Return Policy", slug: "/return-policy", status: "published", lastModified: "2024-02-15", author: "Admin", template: "Standard" },
  { id: 7, title: "Marine Services", slug: "/services/marine", status: "draft", lastModified: "2024-03-12", author: "Admin", template: "Service" },
  { id: 8, title: "Boat Building Guide", slug: "/boat-building", status: "draft", lastModified: "2024-03-11", author: "Admin", template: "Standard" },
];

const blocks = [
  { name: "Hero Banner", icon: Layout, desc: "Full-width hero section with CTA" },
  { name: "Text Block", icon: Type, desc: "Rich text with headings and paragraphs" },
  { name: "Image Gallery", icon: Image, desc: "Grid or carousel of images" },
  { name: "Video Embed", icon: Video, desc: "YouTube or self-hosted video" },
  { name: "Product Grid", icon: ShoppingBag, desc: "Display selected products" },
  { name: "Testimonials", icon: Star, desc: "Customer review carousel" },
  { name: "FAQ Accordion", icon: MessageSquare, desc: "Collapsible Q&A section" },
  { name: "Two Columns", icon: Columns, desc: "Side-by-side content layout" },
  { name: "Custom HTML", icon: Code, desc: "Raw HTML/CSS embed" },
  { name: "AI Generated", icon: Sparkles, desc: "Generate section with AI" },
];

export default function AdminPagesPage() {
  const [tab, setTab] = useState<"pages" | "builder">("pages");
  const [search, setSearch] = useState("");
  const [builderSections, setBuilderSections] = useState<string[]>(["Hero Banner", "Text Block", "Product Grid"]);
  const [pages, setPages] = useState(demoPages);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");

  const filtered = pages.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeletePage = (id: number) => {
    if (confirm("Delete this page? This cannot be undone.")) {
      setPages((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDuplicatePage = (page: typeof demoPages[0]) => {
    const newPage = { ...page, id: Date.now(), title: `${page.title} (Copy)`, slug: `${page.slug}-copy`, status: "draft" as const, lastModified: new Date().toISOString().split("T")[0] };
    setPages((prev) => [...prev, newPage]);
    alert(`Page "${page.title}" duplicated successfully!`);
  };

  const handlePublish = () => {
    if (!pageTitle) { alert("Please enter a page title."); return; }
    const newPage = { id: Date.now(), title: pageTitle, slug: pageSlug || `/${pageTitle.toLowerCase().replace(/\s+/g, "-")}`, status: "published" as const, lastModified: new Date().toISOString().split("T")[0], author: "Admin", template: "Standard" };
    setPages((prev) => [...prev, newPage]);
    setPageTitle(""); setPageSlug(""); setBuilderSections([]);
    setTab("pages");
    alert(`Page "${newPage.title}" published!`);
  };

  const handleSaveDraft = () => {
    if (!pageTitle) { alert("Please enter a page title."); return; }
    const newPage = { id: Date.now(), title: pageTitle, slug: pageSlug || `/${pageTitle.toLowerCase().replace(/\s+/g, "-")}`, status: "draft" as const, lastModified: new Date().toISOString().split("T")[0], author: "Admin", template: "Standard" };
    setPages((prev) => [...prev, newPage]);
    alert(`Draft "${newPage.title}" saved!`);
  };

  return (
    <AdminShell title="Page Builder" subtitle="Create and manage custom pages with drag-drop blocks">
      <div className="space-y-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(["pages", "builder"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm rounded-md capitalize transition-colors ${tab === t ? "bg-white text-text-1 font-medium shadow-sm" : "text-text-4 hover:text-text-2"}`}>
              {t === "pages" ? "All Pages" : "Page Builder"}
            </button>
          ))}
        </div>

        {tab === "pages" && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <input type="text" placeholder="Search pages..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue" />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
              </div>
              <button onClick={() => setTab("builder")} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600"><Plus size={16} /> New Page</button>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">
                  {["Title", "URL", "Template", "Status", "Last Modified", "Actions"].map((h) => (
                    <th key={h} className="text-left p-4 text-xs text-text-4 font-medium">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filtered.map((page) => (
                    <tr key={page.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="p-4 font-medium">{page.title}</td>
                      <td className="p-4 text-xs text-blue font-mono">{page.slug}</td>
                      <td className="p-4 text-text-3">{page.template}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${page.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{page.status}</span>
                      </td>
                      <td className="p-4 text-text-4 text-xs">{page.lastModified}</td>
                      <td className="p-4"><div className="flex gap-1">
                        <button onClick={() => window.open(page.slug, "_blank")} className="p-1.5 hover:bg-gray-100 rounded-lg" title="View"><Eye size={14} className="text-text-4" /></button>
                        <button onClick={() => { setTab("builder"); setPageTitle(page.title); setPageSlug(page.slug); }} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit"><Edit size={14} className="text-text-4" /></button>
                        <button onClick={() => handleDuplicatePage(page)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Duplicate"><Copy size={14} className="text-text-4" /></button>
                        <button onClick={() => handleDeletePage(page.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red" /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Block Palette */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h3 className="font-semibold text-sm mb-3">Available Blocks</h3>
              <p className="text-xs text-text-4 mb-4">Click to add blocks to your page</p>
              <div className="space-y-2">
                {blocks.map((block) => (
                  <button
                    key={block.name}
                    onClick={() => setBuilderSections([...builderSections, block.name])}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue hover:bg-blue/5 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <block.icon size={16} className="text-text-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{block.name}</p>
                      <p className="text-[10px] text-text-4">{block.desc}</p>
                    </div>
                    <Plus size={14} className="text-text-4 shrink-0 ml-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-text-4 mb-1 block">Page Title</label>
                    <input type="text" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg" placeholder="My Custom Page" />
                  </div>
                  <div>
                    <label className="text-xs text-text-4 mb-1 block">URL Slug</label>
                    <input type="text" value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg font-mono" placeholder="/my-page" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePublish} className="px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600">Publish</button>
                  <button onClick={handleSaveDraft} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Save Draft</button>
                  <button onClick={() => alert("Preview: Your page has " + builderSections.length + " sections.")} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1"><Eye size={14} /> Preview</button>
                  <button onClick={() => { setBuilderSections([...builderSections, "AI Generated"]); alert("AI section generated and added!"); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1 ml-auto"><Sparkles size={14} /> AI Generate</button>
                </div>
              </div>

              <div className="space-y-2">
                {builderSections.map((section, i) => {
                  const block = blocks.find((b) => b.name === section);
                  const Icon = block?.icon || Layout;
                  return (
                    <div key={`${section}-${i}`} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3 group hover:border-blue/30 transition-colors">
                      <button className="cursor-grab text-text-4 hover:text-text-2"><GripVertical size={16} /></button>
                      <div className="w-8 h-8 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{section}</p>
                        <p className="text-[10px] text-text-4">Click to edit content</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-text-4" /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Copy size={14} className="text-text-4" /></button>
                        <button onClick={() => setBuilderSections(builderSections.filter((_, j) => j !== i))} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={14} className="text-red" /></button>
                      </div>
                    </div>
                  );
                })}
                <button onClick={() => setBuilderSections([...builderSections, "Text Block"])} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm text-text-4 hover:border-blue hover:text-blue transition-colors flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Block
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
