"use client";

import { useState, useEffect, useRef } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { insforge } from "@/lib/insforge";
import {
  Upload, Image, FileText, Film, Music, Trash2, Loader2, Search,
  Grid, List, Download, Copy, X, Eye, FolderPlus, Check,
  Filter, SortAsc,
} from "lucide-react";

interface MediaFile {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  width?: number;
  height?: number;
  folder: string;
  alt_text: string;
  uploaded_at: string;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return Film;
  if (type.startsWith("audio/")) return Music;
  return FileText;
};

const formatSize = (bytes: number) => {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes} B`;
};

const defaultFiles: MediaFile[] = [
  { name: "hero-banner-main.jpg", url: "/images/hero-banner.jpg", type: "image/jpeg", size: 245000, width: 1920, height: 600, folder: "banners", alt_text: "Roshanal Global hero banner", uploaded_at: "2026-03-15" },
  { name: "hikvision-4mp.jpg", url: "/images/products/hikvision-4mp.jpg", type: "image/jpeg", size: 180000, width: 800, height: 800, folder: "products", alt_text: "Hikvision 4MP camera", uploaded_at: "2026-03-20" },
  { name: "yamaha-40hp.jpg", url: "/images/products/yamaha-40hp.jpg", type: "image/jpeg", size: 220000, width: 800, height: 800, folder: "products", alt_text: "Yamaha 40HP outboard engine", uploaded_at: "2026-03-18" },
  { name: "fire-alarm-panel.jpg", url: "/images/products/fire-alarm.jpg", type: "image/jpeg", size: 150000, width: 800, height: 800, folder: "products", alt_text: "Fire alarm control panel", uploaded_at: "2026-03-22" },
  { name: "logo.svg", url: "/images/logo.svg", type: "image/svg+xml", size: 12000, folder: "brand", alt_text: "Roshanal Global logo", uploaded_at: "2026-01-10" },
  { name: "favicon.ico", url: "/favicon.ico", type: "image/x-icon", size: 4200, folder: "brand", alt_text: "Favicon", uploaded_at: "2026-01-10" },
  { name: "category-cctv.jpg", url: "/images/categories/cctv.jpg", type: "image/jpeg", size: 195000, width: 1200, height: 400, folder: "categories", alt_text: "CCTV category banner", uploaded_at: "2026-02-28" },
  { name: "category-marine.jpg", url: "/images/categories/marine.jpg", type: "image/jpeg", size: 210000, width: 1200, height: 400, folder: "categories", alt_text: "Marine equipment category", uploaded_at: "2026-02-28" },
  { name: "promo-easter.jpg", url: "/images/promos/easter.jpg", type: "image/jpeg", size: 320000, width: 1080, height: 1080, folder: "promos", alt_text: "Easter sale promo", uploaded_at: "2026-03-25" },
  { name: "about-team.jpg", url: "/images/about-team.jpg", type: "image/jpeg", size: 280000, width: 1600, height: 900, folder: "pages", alt_text: "Roshanal Global team photo", uploaded_at: "2026-02-15" },
  { name: "shipping-policy.pdf", url: "/docs/shipping-policy.pdf", type: "application/pdf", size: 450000, folder: "documents", alt_text: "Shipping policy document", uploaded_at: "2026-01-20" },
  { name: "product-demo.mp4", url: "/videos/product-demo.mp4", type: "video/mp4", size: 15000000, folder: "videos", alt_text: "Product demonstration video", uploaded_at: "2026-03-10" },
];

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [activeFolder, setActiveFolder] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadFiles(); }, []);

  const loadFiles = async () => {
    try {
      const { data } = await insforge.database.from("media").select("*").order("uploaded_at", { ascending: false });
      if (data && data.length > 0) {
        setFiles(data);
      } else {
        for (const file of defaultFiles) {
          await insforge.database.from("media").insert(file);
        }
        const { data: seeded } = await insforge.database.from("media").select("*").order("uploaded_at", { ascending: false });
        setFiles(seeded || []);
      }
    } catch (e) {
      console.error("Failed to load media:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;
    setUploading(true);

    for (const file of Array.from(uploadedFiles)) {
      const newFile: MediaFile = {
        name: file.name,
        url: `/uploads/${file.name}`,
        type: file.type,
        size: file.size,
        folder: activeFolder === "all" ? "uploads" : activeFolder,
        alt_text: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        uploaded_at: new Date().toISOString().split("T")[0],
      };

      try {
        const { data } = await insforge.database.from("media").insert(newFile).select("*");
        if (data?.[0]) setFiles(prev => [data[0], ...prev]);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    try {
      await insforge.database.from("media").delete().eq("id", id);
      setFiles(files.filter(f => f.id !== id));
      if (selectedFile?.id === id) setSelectedFile(null);
      setDeleteConfirm(null);
    } catch (e) {
      console.error("Failed to delete:", e);
    }
  };

  const updateAltText = async (file: MediaFile, altText: string) => {
    setSelectedFile({ ...file, alt_text: altText });
    setFiles(files.map(f => f.id === file.id ? { ...f, alt_text: altText } : f));
    if (file.id) await insforge.database.from("media").update({ alt_text: altText }).eq("id", file.id);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createFolder = async () => {
    if (!newFolder.trim()) return;
    setShowFolderModal(false);
    setActiveFolder(newFolder.toLowerCase().replace(/\s+/g, "-"));
    setNewFolder("");
  };

  const folders = ["all", ...Array.from(new Set(files.map(f => f.folder)))];

  let filtered = files;
  if (activeFolder !== "all") filtered = filtered.filter(f => f.folder === activeFolder);
  if (typeFilter !== "all") {
    if (typeFilter === "images") filtered = filtered.filter(f => f.type.startsWith("image/"));
    else if (typeFilter === "videos") filtered = filtered.filter(f => f.type.startsWith("video/"));
    else if (typeFilter === "documents") filtered = filtered.filter(f => !f.type.startsWith("image/") && !f.type.startsWith("video/"));
  }
  if (search) filtered = filtered.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.alt_text.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === "oldest") filtered = [...filtered].reverse();
  if (sortBy === "largest") filtered = [...filtered].sort((a, b) => b.size - a.size);
  if (sortBy === "name") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  if (loading) {
    return (
      <AdminShell title="Media Library" subtitle="Manage images, videos, and files">
        <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Media Library" subtitle="Manage images, videos, and files">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Files", value: files.length },
          { label: "Images", value: files.filter(f => f.type.startsWith("image/")).length },
          { label: "Total Size", value: formatSize(totalSize) },
          { label: "Folders", value: folders.length - 1 },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-2xl font-bold text-text-1">{s.value}</p>
            <p className="text-xs text-text-4">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Folder Sidebar */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-text-4 uppercase">Folders</p>
            <button onClick={() => setShowFolderModal(true)} className="text-blue hover:text-blue-600"><FolderPlus size={14} /></button>
          </div>
          <nav className="space-y-0.5">
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                  activeFolder === folder ? "bg-blue text-white font-medium" : "text-text-3 hover:bg-gray-100"
                }`}
              >
                {folder === "all" ? "All Files" : folder}
                <span className="text-[10px] ml-1 opacity-70">
                  ({folder === "all" ? files.length : files.filter(f => f.folder === folder).length})
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
                <option value="all">All Types</option>
                <option value="images">Images</option>
                <option value="videos">Videos</option>
                <option value="documents">Documents</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="h-9 px-3 rounded-lg border border-gray-200 text-sm">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="largest">Largest</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => setView("grid")} className={`p-1.5 rounded-md ${view === "grid" ? "bg-white shadow-sm" : "text-text-4"}`}><Grid size={14} /></button>
                <button onClick={() => setView("list")} className={`p-1.5 rounded-md ${view === "list" ? "bg-white shadow-sm" : "text-text-4"}`}><List size={14} /></button>
              </div>
              <input ref={fileInputRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="h-9 px-4 bg-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Upload
              </button>
            </div>
          </div>

          {/* Drop Zone (when empty) */}
          {filtered.length === 0 && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-blue transition-colors"
            >
              <Upload size={32} className="text-text-4 mx-auto mb-3" />
              <p className="text-sm font-medium text-text-2">Drop files here or click to upload</p>
              <p className="text-xs text-text-4 mt-1">Images, videos, PDFs, documents</p>
            </div>
          )}

          {/* Grid View */}
          {view === "grid" && filtered.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(file => {
                const Icon = getFileIcon(file.type);
                const isImage = file.type.startsWith("image/");
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-sm transition-all group ${
                      selectedFile?.id === file.id ? "border-blue ring-2 ring-blue/20" : "border-gray-200"
                    }`}
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                      {isImage ? (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Image size={32} className="text-gray-300" />
                        </div>
                      ) : (
                        <Icon size={32} className="text-text-4" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-text-1 truncate">{file.name}</p>
                      <p className="text-[10px] text-text-4">{formatSize(file.size)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {view === "list" && filtered.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-3 text-text-4 font-medium">File</th>
                    <th className="text-left p-3 text-text-4 font-medium">Type</th>
                    <th className="text-left p-3 text-text-4 font-medium">Size</th>
                    <th className="text-left p-3 text-text-4 font-medium">Folder</th>
                    <th className="text-left p-3 text-text-4 font-medium">Date</th>
                    <th className="text-right p-3 text-text-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(file => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <tr key={file.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedFile(file)}>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <Icon size={16} className="text-text-4" />
                            </div>
                            <span className="font-medium text-text-1 truncate max-w-[200px]">{file.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-text-3 text-xs">{file.type.split("/")[1]}</td>
                        <td className="p-3 text-text-3">{formatSize(file.size)}</td>
                        <td className="p-3"><span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-text-4 capitalize">{file.folder}</span></td>
                        <td className="p-3 text-text-4 text-xs">{file.uploaded_at}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={e => { e.stopPropagation(); copyUrl(file.url); }} className="p-1.5 hover:bg-gray-100 rounded-lg text-text-4"><Copy size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); setDeleteConfirm(file.id!); }} className="p-1.5 hover:bg-red/10 rounded-lg text-red"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* File Detail Panel */}
        {selectedFile && (
          <aside className="hidden xl:block w-72 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h4 className="font-semibold text-sm">File Details</h4>
                <button onClick={() => setSelectedFile(null)} className="text-text-4 hover:text-text-2"><X size={16} /></button>
              </div>
              <div className="p-4 space-y-4">
                <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                  {(() => { const Icon = getFileIcon(selectedFile.type); return <Icon size={40} className="text-gray-300" />; })()}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-1 break-all">{selectedFile.name}</p>
                  <p className="text-xs text-text-4 mt-1">{selectedFile.type} &middot; {formatSize(selectedFile.size)}</p>
                  {selectedFile.width && <p className="text-xs text-text-4">{selectedFile.width} x {selectedFile.height}px</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-text-3 block mb-1">Alt Text</label>
                  <input
                    value={selectedFile.alt_text}
                    onChange={e => updateAltText(selectedFile, e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-3 block mb-1">URL</label>
                  <div className="flex gap-1">
                    <input value={selectedFile.url} readOnly className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-xs bg-gray-50 font-mono" />
                    <button onClick={() => copyUrl(selectedFile.url)} className="h-9 w-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                      {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-text-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setDeleteConfirm(selectedFile.id!)} className="flex-1 h-9 rounded-lg border border-gray-200 text-sm text-red font-medium hover:bg-red/5 flex items-center justify-center gap-1.5">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowFolderModal(false)}>
          <div className="bg-white rounded-2xl w-[380px] p-5" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-4">New Folder</h3>
            <input
              value={newFolder}
              onChange={e => setNewFolder(e.target.value)}
              placeholder="Folder name..."
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue mb-4"
              onKeyDown={e => e.key === "Enter" && createFolder()}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowFolderModal(false)} className="flex-1 h-10 rounded-lg border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={createFolder} className="flex-1 h-10 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">Delete File?</h3>
            <p className="text-sm text-text-3 mb-5">This file will be permanently removed. Products referencing it may show broken images.</p>
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
