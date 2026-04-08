"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  Link2,
  ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/admin/admin-shell";

interface FooterColumn {
  id: string;
  title: string;
  links: { id: string; label: string; url: string; type: "internal" | "external" | "image"; imageUrl?: string }[];
}

interface FooterImageBox {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
}

const defaultColumns: FooterColumn[] = [
  {
    id: "1", title: "Shop", links: [
      { id: "1a", label: "All Products", url: "/shop", type: "internal" },
      { id: "1b", label: "New Arrivals", url: "/new-arrivals", type: "internal" },
      { id: "1c", label: "Deals & Offers", url: "/deals", type: "internal" },
      { id: "1d", label: "Brands", url: "/brands", type: "internal" },
      { id: "1e", label: "Gift Cards", url: "/gift-cards", type: "internal" },
      { id: "1f", label: "Boat Engines", url: "/category/boat-engines", type: "internal" },
    ],
  },
  {
    id: "2", title: "Services", links: [
      { id: "2a", label: "CCTV Installation", url: "/services/cctv-installation", type: "internal" },
      { id: "2b", label: "Fire Alarm", url: "/services/fire-alarm", type: "internal" },
      { id: "2c", label: "Kitchen Installation", url: "/services/kitchen-installation", type: "internal" },
      { id: "2d", label: "Boat Building", url: "/services/boat-building", type: "internal" },
      { id: "2e", label: "Dredging", url: "/services/dredging", type: "internal" },
      { id: "2f", label: "Maintenance", url: "/services/maintenance", type: "internal" },
    ],
  },
  {
    id: "3", title: "Support", links: [
      { id: "3a", label: "Help Center", url: "/help", type: "internal" },
      { id: "3b", label: "FAQ", url: "/faq", type: "internal" },
      { id: "3c", label: "Track Order", url: "/track-order", type: "internal" },
      { id: "3d", label: "Returns & Refunds", url: "/returns", type: "internal" },
      { id: "3e", label: "Contact Us", url: "/contact", type: "internal" },
    ],
  },
  {
    id: "4", title: "Company", links: [
      { id: "4a", label: "About Us", url: "/about", type: "internal" },
      { id: "4b", label: "Blog", url: "/blog", type: "internal" },
      { id: "4c", label: "Affiliate Program", url: "/affiliate", type: "internal" },
      { id: "4d", label: "B2B/Wholesale", url: "/wholesale", type: "internal" },
      { id: "4e", label: "Vendor Marketplace", url: "/vendor/register", type: "internal" },
    ],
  },
];

const defaultImageBoxes: FooterImageBox[] = [
  { id: "img1", imageUrl: "/images/app-store.png", altText: "Download on App Store", linkUrl: "https://apps.apple.com" },
  { id: "img2", imageUrl: "/images/google-play.png", altText: "Get it on Google Play", linkUrl: "https://play.google.com" },
];

const defaultSocialLinks = [
  { id: "s1", platform: "Facebook", url: "https://facebook.com/roshanalglobal", icon: "facebook" },
  { id: "s2", platform: "Twitter/X", url: "https://twitter.com/roshanalglobal", icon: "twitter" },
  { id: "s3", platform: "Instagram", url: "https://instagram.com/roshanalglobal", icon: "instagram" },
  { id: "s4", platform: "LinkedIn", url: "https://linkedin.com/company/roshanalglobal", icon: "linkedin" },
  { id: "s5", platform: "YouTube", url: "https://youtube.com/roshanalglobal", icon: "youtube" },
];

export default function FooterBuilderPage() {
  const [columns, setColumns] = useState(defaultColumns);
  const [imageBoxes, setImageBoxes] = useState(defaultImageBoxes);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [expandedColumn, setExpandedColumn] = useState<string | null>("1");

  const addColumn = () => {
    const newCol: FooterColumn = {
      id: String(Date.now()),
      title: "New Column",
      links: [],
    };
    setColumns([...columns, newCol]);
    setExpandedColumn(newCol.id);
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter((c) => c.id !== id));
  };

  const addLink = (columnId: string) => {
    setColumns(columns.map((col) =>
      col.id === columnId
        ? { ...col, links: [...col.links, { id: String(Date.now()), label: "New Link", url: "/", type: "internal" as const }] }
        : col
    ));
  };

  const removeLink = (columnId: string, linkId: string) => {
    setColumns(columns.map((col) =>
      col.id === columnId
        ? { ...col, links: col.links.filter((l) => l.id !== linkId) }
        : col
    ));
  };

  const updateLink = (columnId: string, linkId: string, field: string, value: string) => {
    setColumns(columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            links: col.links.map((l) =>
              l.id === linkId ? { ...l, [field]: value } : l
            ),
          }
        : col
    ));
  };

  const addImageBox = () => {
    setImageBoxes([...imageBoxes, {
      id: String(Date.now()),
      imageUrl: "",
      altText: "New Image",
      linkUrl: "",
    }]);
  };

  return (
    <AdminShell title="Footer Builder" subtitle="Customize footer columns and links">
    <div>
      {/* Top Bar */}
      <div className="bg-white border-b border-border h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-text-3 hover:text-text-1"><ArrowLeft size={18} /></Link>
          <div>
            <h1 className="font-syne font-bold text-sm text-text-1">Footer Builder</h1>
            <p className="text-[10px] text-text-4">Manage columns, links, image boxes, and social icons</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Eye size={14} className="mr-1" /> Preview</Button>
          <Button size="sm"><Save size={14} className="mr-1" /> Save</Button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Column Manager */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-bold text-sm">Footer Columns</h2>
              <Button size="sm" variant="outline" onClick={addColumn}>
                <Plus size={14} className="mr-1" /> Add Column
              </Button>
            </div>

            {columns.map((col) => (
              <div key={col.id} className="bg-white rounded-xl border border-border overflow-hidden">
                {/* Column Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-off-white/50"
                  onClick={() => setExpandedColumn(expandedColumn === col.id ? null : col.id)}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical size={14} className="text-text-4 cursor-grab" />
                    {editingColumn === col.id ? (
                      <input
                        value={col.title}
                        onChange={(e) => setColumns(columns.map((c) => c.id === col.id ? { ...c, title: e.target.value } : c))}
                        onBlur={() => setEditingColumn(null)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingColumn(null)}
                        autoFocus
                        className="h-7 px-2 text-sm font-syne font-bold rounded border border-blue focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3
                        className="font-syne font-bold text-sm text-text-1 cursor-text"
                        onDoubleClick={(e) => { e.stopPropagation(); setEditingColumn(col.id); }}
                      >
                        {col.title}
                      </h3>
                    )}
                    <span className="text-[10px] text-text-4 bg-off-white px-1.5 py-0.5 rounded">{col.links.length} links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); removeColumn(col.id); }} className="text-text-4 hover:text-red p-1">
                      <Trash2 size={14} />
                    </button>
                    {expandedColumn === col.id ? <ChevronUp size={14} className="text-text-4" /> : <ChevronDown size={14} className="text-text-4" />}
                  </div>
                </div>

                {/* Column Links */}
                {expandedColumn === col.id && (
                  <div className="border-t border-border p-4 space-y-2">
                    {col.links.map((link) => (
                      <div key={link.id} className="flex items-center gap-2 p-2 bg-off-white rounded-lg">
                        <GripVertical size={12} className="text-text-4 cursor-grab shrink-0" />
                        <select
                          value={link.type}
                          onChange={(e) => updateLink(col.id, link.id, "type", e.target.value)}
                          className="h-7 px-1.5 text-[10px] rounded border border-border bg-white w-20 shrink-0"
                        >
                          <option value="internal">Internal</option>
                          <option value="external">External</option>
                          <option value="image">Image</option>
                        </select>
                        <input
                          value={link.label}
                          onChange={(e) => updateLink(col.id, link.id, "label", e.target.value)}
                          placeholder="Link label"
                          className="flex-1 h-7 px-2 text-xs rounded border border-border bg-white focus:outline-none focus:border-blue"
                        />
                        <input
                          value={link.url}
                          onChange={(e) => updateLink(col.id, link.id, "url", e.target.value)}
                          placeholder="URL"
                          className="flex-1 h-7 px-2 text-xs rounded border border-border bg-white focus:outline-none focus:border-blue font-mono"
                        />
                        {link.type === "external" && <ExternalLink size={12} className="text-text-4 shrink-0" />}
                        {link.type === "image" && (
                          <input
                            value={link.imageUrl || ""}
                            onChange={(e) => updateLink(col.id, link.id, "imageUrl", e.target.value)}
                            placeholder="Image URL"
                            className="w-32 h-7 px-2 text-[10px] rounded border border-border bg-white"
                          />
                        )}
                        <button onClick={() => removeLink(col.id, link.id)} className="text-text-4 hover:text-red p-0.5 shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="w-full" onClick={() => addLink(col.id)}>
                      <Plus size={12} className="mr-1" /> Add Link
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Image Boxes & Social */}
          <div className="space-y-6">
            {/* Image Boxes / App Icons */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-sm flex items-center gap-2">
                  <ImageIcon size={14} className="text-blue" /> Image Boxes
                </h3>
                <Button size="sm" variant="outline" onClick={addImageBox}>
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              </div>
              <p className="text-[10px] text-text-4 mb-3">
                Add app store icons, partner logos, or any linked image to the footer.
                Each image can link to any URL.
              </p>
              <div className="space-y-3">
                {imageBoxes.map((box, i) => (
                  <div key={box.id} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-text-3">Image Box {i + 1}</span>
                      <button onClick={() => setImageBoxes(imageBoxes.filter((b) => b.id !== box.id))} className="text-text-4 hover:text-red">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="h-16 bg-off-white rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-blue">
                      {box.imageUrl ? (
                        <span className="text-[10px] text-text-3 font-mono truncate px-2">{box.imageUrl}</span>
                      ) : (
                        <span className="text-[10px] text-text-4 flex items-center gap-1"><ImageIcon size={12} /> Upload Image</span>
                      )}
                    </div>
                    <input
                      value={box.altText}
                      onChange={(e) => setImageBoxes(imageBoxes.map((b) => b.id === box.id ? { ...b, altText: e.target.value } : b))}
                      placeholder="Alt text / Label"
                      className="w-full h-7 px-2 text-[10px] rounded border border-border focus:outline-none focus:border-blue"
                    />
                    <div className="flex items-center gap-1">
                      <Link2 size={10} className="text-text-4 shrink-0" />
                      <input
                        value={box.linkUrl}
                        onChange={(e) => setImageBoxes(imageBoxes.map((b) => b.id === box.id ? { ...b, linkUrl: e.target.value } : b))}
                        placeholder="Link URL (e.g. https://apps.apple.com)"
                        className="w-full h-7 px-2 text-[10px] rounded border border-border focus:outline-none focus:border-blue font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-syne font-bold text-sm flex items-center gap-2">
                  <Globe size={14} className="text-blue" /> Social Links
                </h3>
                <Button size="sm" variant="outline" onClick={() => setSocialLinks([...socialLinks, {
                  id: String(Date.now()), platform: "New Platform", url: "", icon: "globe"
                }])}>
                  <Plus size={12} className="mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {socialLinks.map((social) => (
                  <div key={social.id} className="flex items-center gap-2">
                    <input
                      value={social.platform}
                      onChange={(e) => setSocialLinks(socialLinks.map((s) => s.id === social.id ? { ...s, platform: e.target.value } : s))}
                      className="w-24 h-7 px-2 text-[10px] rounded border border-border shrink-0 focus:outline-none focus:border-blue"
                    />
                    <input
                      value={social.url}
                      onChange={(e) => setSocialLinks(socialLinks.map((s) => s.id === social.id ? { ...s, url: e.target.value } : s))}
                      placeholder="URL"
                      className="flex-1 h-7 px-2 text-[10px] rounded border border-border font-mono focus:outline-none focus:border-blue"
                    />
                    <button onClick={() => setSocialLinks(socialLinks.filter((s) => s.id !== social.id))} className="text-text-4 hover:text-red">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-syne font-bold text-sm mb-3 flex items-center gap-2">
                <Type size={14} className="text-blue" /> Footer Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-text-2 mb-1 block">Copyright Text</label>
                  <input
                    defaultValue="© 2026 Roshanal Infotech Limited. All rights reserved."
                    className="w-full h-8 px-2 text-[10px] rounded border border-border focus:outline-none focus:border-blue"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-text-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Show newsletter signup
                </label>
                <label className="flex items-center gap-2 text-xs text-text-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Show trust badges (shipping, security, support, returns)
                </label>
                <label className="flex items-center gap-2 text-xs text-text-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Show payment logos
                </label>
                <label className="flex items-center gap-2 text-xs text-text-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Show store locator link
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminShell>
  );
}
