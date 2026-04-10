"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Star, ThumbsUp, Trash2, CheckCircle2, XCircle,
  MessageSquare, Search, Image as ImageIcon, Flag,
} from "lucide-react";

const demoReviews = [
  { id: 1, product: "Hikvision 4CH DVR Kit", customer: "Chidi Okafor", email: "chidi@email.com", rating: 5, title: "Excellent quality!", comment: "Very clear picture quality, easy to install. Highly recommended for home security.", date: "2024-03-15", status: "approved", helpful: 12, images: 2, verified: true },
  { id: 2, product: "Yamaha 40HP Outboard", customer: "Emeka Nwosu", email: "emeka@email.com", rating: 4, title: "Good engine", comment: "Reliable performance. Been using it for 3 months now with no issues.", date: "2024-03-14", status: "approved", helpful: 8, images: 0, verified: true },
  { id: 3, product: "Fire Extinguisher 9kg", customer: "Amina Bello", email: "amina@email.com", rating: 2, title: "Arrived damaged", comment: "The extinguisher had a dent on arrival. Packaging was poor.", date: "2024-03-13", status: "pending", helpful: 3, images: 1, verified: false },
  { id: 4, product: "Access Control System", customer: "Tunde Adebayo", email: "tunde@email.com", rating: 5, title: "Professional grade", comment: "Works perfectly for our office building. Support team helped with setup.", date: "2024-03-12", status: "approved", helpful: 15, images: 3, verified: true },
  { id: 5, product: "Life Jacket Adult", customer: "Grace Eze", email: "grace@email.com", rating: 1, title: "Wrong size", comment: "Ordered XL but received M. Very disappointed.", date: "2024-03-11", status: "flagged", helpful: 1, images: 0, verified: true },
  { id: 6, product: "Kitchen Hood 90cm", customer: "Ibrahim Musa", email: "ibrahim@email.com", rating: 3, title: "Decent but noisy", comment: "Extraction works well but the motor is quite loud on high speed.", date: "2024-03-10", status: "pending", helpful: 5, images: 0, verified: false },
];

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  flagged: "bg-red-100 text-red-700",
  rejected: "bg-gray-100 text-gray-600",
};

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState(demoReviews);

  const filtered = reviews.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search && !r.product.toLowerCase().includes(search.toLowerCase()) && !r.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAction = (id: number, action: string) => {
    if (action === "approve") setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
    else if (action === "reject") setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
    else if (action === "flag") setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "flagged" } : r));
    else if (action === "delete") { if (confirm("Delete this review?")) setReviews((prev) => prev.filter((r) => r.id !== id)); }
    else if (action === "reply") alert("Reply feature: Compose your response to this review.");
  };

  const avgRating = (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1);
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    stars: r,
    count: reviews.filter((rev) => rev.rating === r).length,
    pct: Math.round((reviews.filter((rev) => rev.rating === r).length / reviews.length) * 100),
  }));

  return (
    <AdminShell title="Reviews & Ratings" subtitle="Manage product reviews and customer feedback">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-text-4 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-text-1">{demoReviews.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-text-4 mb-1">Average Rating</p>
            <div className="flex items-center gap-1.5">
              <p className="text-2xl font-bold text-text-1">{avgRating}</p>
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-text-4 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{demoReviews.filter((r) => r.status === "pending").length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-text-4 mb-1">With Photos</p>
            <p className="text-2xl font-bold text-blue">{demoReviews.filter((r) => r.images > 0).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-text-4 mb-1">Flagged</p>
            <p className="text-2xl font-bold text-red">{demoReviews.filter((r) => r.status === "flagged").length}</p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h3 className="font-semibold text-sm mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDist.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <span className="text-sm w-16 text-text-3">{r.stars} stars</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-sm text-text-4 w-16 text-right">{r.count} ({r.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
          </div>
          {["all", "pending", "approved", "flagged"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors capitalize ${
                filter === f ? "bg-blue text-white border-blue" : "bg-white border-gray-200 text-text-3 hover:border-blue"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-text-1">{review.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[review.status]}`}>
                      {review.status}
                    </span>
                    {review.verified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue/10 text-blue font-medium">Verified</span>
                    )}
                  </div>
                  <p className="text-xs text-text-4">
                    by <span className="font-medium text-text-2">{review.customer}</span> on{" "}
                    <span className="font-medium">{review.product}</span> · {review.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-text-3 mb-3">{review.comment}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-text-4">
                  <span className="flex items-center gap-1"><ThumbsUp size={12} /> {review.helpful} helpful</span>
                  {review.images > 0 && <span className="flex items-center gap-1"><ImageIcon size={12} /> {review.images} photos</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleAction(review.id, "approve")} className="p-1.5 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                    <CheckCircle2 size={16} className="text-green-600" />
                  </button>
                  <button onClick={() => handleAction(review.id, "reject")} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                    <XCircle size={16} className="text-red" />
                  </button>
                  <button onClick={() => handleAction(review.id, "flag")} className="p-1.5 hover:bg-yellow-50 rounded-lg transition-colors" title="Flag">
                    <Flag size={16} className="text-yellow-600" />
                  </button>
                  <button onClick={() => handleAction(review.id, "reply")} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors" title="Reply">
                    <MessageSquare size={16} className="text-blue" />
                  </button>
                  <button onClick={() => handleAction(review.id, "delete")} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} className="text-text-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
