"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Calendar, Clock, User, DollarSign,
  Check, X, ChevronLeft, ChevronRight, Filter, Plus, Eye,
  Wrench, Ship, Shield, ChefHat,
} from "lucide-react";

const serviceTypes = [
  { id: "cctv-install", label: "CCTV Installation", icon: Shield, color: "bg-blue/10 text-blue", duration: "2-4 hrs" },
  { id: "fire-alarm", label: "Fire Alarm Setup", icon: Shield, color: "bg-red/10 text-red", duration: "3-5 hrs" },
  { id: "marine-service", label: "Marine Service", icon: Ship, color: "bg-cyan-50 text-cyan-600", duration: "4-8 hrs" },
  { id: "kitchen-install", label: "Kitchen Installation", icon: ChefHat, color: "bg-orange-50 text-orange-600", duration: "6-12 hrs" },
  { id: "maintenance", label: "Maintenance Visit", icon: Wrench, color: "bg-purple-50 text-purple-600", duration: "1-3 hrs" },
  { id: "consultation", label: "Consultation", icon: User, color: "bg-green-50 text-green-600", duration: "1 hr" },
];

interface Booking {
  id: string;
  customer: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  location: string;
  deposit: number;
  total: number;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  notes?: string;
}

const demoBookings: Booking[] = [
  { id: "BK-001", customer: "Emeka Obi", phone: "+234 801 234 5678", email: "emeka@email.com", service: "cctv-install", date: "2026-04-10", time: "09:00", location: "Victoria Island, Lagos", deposit: 50000, total: 250000, status: "confirmed" },
  { id: "BK-002", customer: "Aisha Mohammed", phone: "+234 803 456 7890", email: "aisha@email.com", service: "fire-alarm", date: "2026-04-11", time: "10:00", location: "Lekki Phase 1, Lagos", deposit: 30000, total: 180000, status: "pending" },
  { id: "BK-003", customer: "Chidi Nwosu", phone: "+234 805 678 9012", email: "chidi@email.com", service: "marine-service", date: "2026-04-12", time: "08:00", location: "Port Harcourt Marina", deposit: 100000, total: 500000, status: "in-progress" },
  { id: "BK-004", customer: "Funke Adeyemi", phone: "+234 807 890 1234", email: "funke@email.com", service: "kitchen-install", date: "2026-04-09", time: "07:30", location: "Abuja, FCT", deposit: 80000, total: 450000, status: "completed" },
  { id: "BK-005", customer: "Olumide Balogun", phone: "+234 809 012 3456", email: "olumide@email.com", service: "consultation", date: "2026-04-13", time: "14:00", location: "Ikeja, Lagos", deposit: 0, total: 25000, status: "pending" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue/10 text-blue",
  "in-progress": "bg-purple-50 text-purple-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red/10 text-red",
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"calendar" | "list" | "new">("list");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April 2026
  const [, setSelectedDate] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getBookingsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return demoBookings.filter((b) => b.date === dateStr);
  };

  const filteredBookings = filterStatus === "all"
    ? demoBookings
    : demoBookings.filter((b) => b.status === filterStatus);

  const stats = {
    total: demoBookings.length,
    pending: demoBookings.filter((b) => b.status === "pending").length,
    confirmed: demoBookings.filter((b) => b.status === "confirmed").length,
    revenue: demoBookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.total, 0),
  };

  return (
    <AdminShell title="Bookings" subtitle="Service booking calendar & management">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: "Total Bookings", value: stats.total, icon: Calendar, color: "text-blue" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
          { label: "Confirmed", value: stats.confirmed, icon: Check, color: "text-green-600" },
          { label: "Revenue", value: `₦${(stats.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-text-4 uppercase tracking-wider font-semibold">{stat.label}</p>
                <p className="text-xl font-bold text-text-1 mt-1">{stat.value}</p>
              </div>
              <stat.icon size={20} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 w-fit border border-gray-200">
        {[
          { id: "list" as const, label: "Bookings", icon: Filter },
          { id: "calendar" as const, label: "Calendar", icon: Calendar },
          { id: "new" as const, label: "New Booking", icon: Plus },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? "bg-blue text-white" : "text-text-3 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "calendar" && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-gray-50 rounded-lg">
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-bold text-text-1">{months[month]} {year}</h3>
            <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-gray-50 rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => (
              <div key={d} className="text-center text-[10px] text-text-4 font-semibold py-2">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const bookings = getBookingsForDate(day);
              const isToday = day === 8 && month === 3 && year === 2026;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)}
                  className={`min-h-[72px] p-1.5 rounded-lg border text-left transition-colors ${
                    isToday ? "border-blue bg-blue/5" : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? "text-blue" : "text-text-2"}`}>{day}</span>
                  <div className="mt-1 space-y-0.5">
                    {bookings.slice(0, 2).map((b) => {
                      const svc = serviceTypes.find((s) => s.id === b.service);
                      return (
                        <div key={b.id} className={`text-[8px] px-1 py-0.5 rounded ${svc?.color || "bg-gray-100 text-gray-600"} truncate`}>
                          {b.time} {b.customer.split(" ")[0]}
                        </div>
                      );
                    })}
                    {bookings.length > 2 && (
                      <span className="text-[8px] text-text-4">+{bookings.length - 2} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "list" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-semibold text-text-1">All Bookings</h3>
            <div className="flex gap-1.5">
              {["all", "pending", "confirmed", "in-progress", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    filterStatus === s ? "bg-blue text-white" : "bg-gray-50 text-text-3 hover:bg-gray-100"
                  }`}
                >
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 text-text-4 font-medium">Booking</th>
                  <th className="text-left p-3 text-text-4 font-medium">Customer</th>
                  <th className="text-left p-3 text-text-4 font-medium">Service</th>
                  <th className="text-left p-3 text-text-4 font-medium">Date & Time</th>
                  <th className="text-left p-3 text-text-4 font-medium">Location</th>
                  <th className="text-left p-3 text-text-4 font-medium">Deposit</th>
                  <th className="text-left p-3 text-text-4 font-medium">Total</th>
                  <th className="text-left p-3 text-text-4 font-medium">Status</th>
                  <th className="text-left p-3 text-text-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const svc = serviceTypes.find((s) => s.id === booking.service);
                  return (
                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs font-semibold text-blue">{booking.id}</td>
                      <td className="p-3">
                        <p className="font-medium text-text-1 text-xs">{booking.customer}</p>
                        <p className="text-[10px] text-text-4">{booking.phone}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${svc?.color}`}>
                          {svc?.label}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-text-2">
                        <div>{booking.date}</div>
                        <div className="text-text-4">{booking.time}</div>
                      </td>
                      <td className="p-3 text-xs text-text-3">{booking.location}</td>
                      <td className="p-3 text-xs">₦{booking.deposit.toLocaleString()}</td>
                      <td className="p-3 text-xs font-semibold">₦{booking.total.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="View">
                            <Eye size={14} className="text-text-4" />
                          </button>
                          {booking.status === "pending" && (
                            <>
                              <button className="p-1.5 hover:bg-green-50 rounded-lg" title="Confirm">
                                <Check size={14} className="text-green-600" />
                              </button>
                              <button className="p-1.5 hover:bg-red/10 rounded-lg" title="Cancel">
                                <X size={14} className="text-red" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "new" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
          <h3 className="font-bold text-text-1 mb-4">Create New Booking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Customer Name</label>
              <input type="text" placeholder="Full name" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Phone Number</label>
              <input type="tel" placeholder="+234..." className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Email</label>
              <input type="email" placeholder="email@example.com" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Service Type</label>
              <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue bg-white">
                <option value="">Select service...</option>
                {serviceTypes.map((s) => (
                  <option key={s.id} value={s.id}>{s.label} ({s.duration})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Date</label>
              <input type="date" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Time</label>
              <input type="time" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-text-3 font-medium mb-1 block">Location / Address</label>
              <input type="text" placeholder="Service location address" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Deposit Amount (₦)</label>
              <input type="number" placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div>
              <label className="text-xs text-text-3 font-medium mb-1 block">Total Quote (₦)</label>
              <input type="number" placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-text-3 font-medium mb-1 block">Notes</label>
              <textarea rows={3} placeholder="Additional notes..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="h-10 px-6 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
              Create Booking
            </button>
            <button onClick={() => setActiveTab("list")} className="h-10 px-6 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
