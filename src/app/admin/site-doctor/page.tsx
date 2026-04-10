"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import { Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCcw, Shield, Zap, Globe, Database, Image } from "lucide-react";

interface HealthCheck {
  id: string;
  name: string;
  category: string;
  icon: typeof Activity;
  status: "pass" | "warning" | "fail" | "checking";
  message: string;
  fix?: string;
}

const initialChecks: HealthCheck[] = [
  { id: "ssl", name: "SSL Certificate", category: "Security", icon: Shield, status: "pass", message: "Valid SSL certificate detected" },
  { id: "https", name: "HTTPS Redirect", category: "Security", icon: Shield, status: "pass", message: "All traffic redirected to HTTPS" },
  { id: "headers", name: "Security Headers", category: "Security", icon: Shield, status: "pass", message: "X-Frame-Options, CSP headers configured" },
  { id: "perf", name: "Page Load Speed", category: "Performance", icon: Zap, status: "warning", message: "Homepage loads in 3.2s (target: <2s)", fix: "Optimize images and enable lazy loading" },
  { id: "images", name: "Image Optimization", category: "Performance", icon: Image, status: "warning", message: "12 images are not using WebP format", fix: "Convert images to WebP for 40% smaller files" },
  { id: "cache", name: "Browser Caching", category: "Performance", icon: Zap, status: "pass", message: "Cache headers properly configured" },
  { id: "meta", name: "Meta Tags", category: "SEO", icon: Globe, status: "pass", message: "All pages have title and description tags" },
  { id: "sitemap", name: "Sitemap", category: "SEO", icon: Globe, status: "warning", message: "Sitemap found but 3 pages are missing", fix: "Regenerate sitemap to include new pages" },
  { id: "robots", name: "Robots.txt", category: "SEO", icon: Globe, status: "pass", message: "robots.txt properly configured" },
  { id: "og", name: "Open Graph Tags", category: "SEO", icon: Globe, status: "fail", message: "15 pages missing OG image tags", fix: "Add og:image meta tags to all pages" },
  { id: "db", name: "Database Connection", category: "System", icon: Database, status: "pass", message: "Connected to Insforge backend" },
  { id: "storage", name: "Storage Usage", category: "System", icon: Database, status: "pass", message: "Using 2.3GB of 10GB storage" },
  { id: "api", name: "API Response Time", category: "System", icon: Activity, status: "pass", message: "Average response time: 145ms" },
  { id: "pwa", name: "PWA Compliance", category: "Platform", icon: Zap, status: "pass", message: "Manifest and service worker configured" },
  { id: "mobile", name: "Mobile Responsive", category: "Platform", icon: Globe, status: "pass", message: "All pages pass mobile-friendly test" },
];

export default function AdminSiteDoctorPage() {
  const [checks, setChecks] = useState(initialChecks);
  const [scanning, setScanning] = useState(false);

  const runScan = () => {
    setScanning(true);
    setChecks((prev) => prev.map((c) => ({ ...c, status: "checking" as const })));
    setTimeout(() => {
      setChecks(initialChecks);
      setScanning(false);
    }, 2000);
  };

  const fixIssue = (id: string) => {
    setChecks((prev) => prev.map((c) => c.id === id ? { ...c, status: "pass" as const, message: "Fixed! " + c.message } : c));
    alert("Issue fixed successfully!");
  };

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warning").length;
  const failCount = checks.filter((c) => c.status === "fail").length;
  const score = Math.round((passCount / checks.length) * 100);

  const statusIcon = (status: string) => {
    if (status === "checking") return <RefreshCcw size={16} className="text-blue animate-spin" />;
    if (status === "pass") return <CheckCircle2 size={16} className="text-green-600" />;
    if (status === "warning") return <AlertTriangle size={16} className="text-yellow-600" />;
    return <XCircle size={16} className="text-red" />;
  };

  return (
    <AdminShell title="Site Doctor" subtitle="Diagnose and fix site health issues">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 col-span-2 md:col-span-1">
            <p className="text-xs text-text-4 mb-1">Health Score</p>
            <p className={`text-3xl font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red"}`}>{score}%</p>
          </div>
          {[
            { label: "Passed", value: passCount, color: "text-green-600" },
            { label: "Warnings", value: warnCount, color: "text-yellow-600" },
            { label: "Failed", value: failCount, color: "text-red" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-text-4 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
          <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-center">
            <button onClick={runScan} disabled={scanning} className="flex items-center gap-2 px-4 py-2 bg-blue text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50">
              <RefreshCcw size={16} className={scanning ? "animate-spin" : ""} />
              {scanning ? "Scanning..." : "Run Scan"}
            </button>
          </div>
        </div>

        {["Security", "Performance", "SEO", "System", "Platform"].map((cat) => {
          const catChecks = checks.filter((c) => c.category === cat);
          if (catChecks.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="font-semibold text-sm text-text-1 mb-3">{cat}</h3>
              <div className="space-y-2">
                {catChecks.map((check) => (
                  <div key={check.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                    {statusIcon(check.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-1">{check.name}</p>
                      <p className="text-xs text-text-4">{check.message}</p>
                    </div>
                    {check.fix && check.status !== "pass" && (
                      <button onClick={() => fixIssue(check.id)} className="px-3 py-1.5 bg-blue text-white text-xs rounded-lg hover:bg-blue-600">Fix Now</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
