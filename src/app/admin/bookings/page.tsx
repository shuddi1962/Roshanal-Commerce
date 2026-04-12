"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Calendar, Clock, User, DollarSign,
  Check, X, ChevronLeft, ChevronRight, Filter, Plus, Eye,
  Wrench, Ship, Shield, ChefHat, Save,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

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
  booking_id: string;
  customer: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  location: string;
  deposit: number;
  total: number;
  status: string;
  notes?: string;
}

const seedBookings: Omit<Booking, "id">[] = [
  { booking_id: "BK-001", customer: "Emeka Obi", phone: "+234 801 234 5678", email: "emeka@email.com", service: "cctv-install", date: "2026-04-10", time: "09:00", location: "Victoria Island, Lagos", deposit: 50000, total: 250000, status: "confirmed" },
  { booking_id: "BK-002", customer: "Aisha Mohammed", phone: "+234 803 456 7890", email: "aisha@email.com", service: "fire-alarm", date: "2026-04-11", time: "10:00", location: "Lekki Phase 1, Lagos", deposit: 30000, total: 180000, status: "pending" },
  { booking_id: "BK-003", customer: "Chidi Nwosu", phone: "+234 805 678 9012", email: "chidi@email.com", service: "marine-service", date: "2026-04-12", time: "08:00", location: "Port Harcourt Marina", deposit: 100000, total: 500000, status: "in-progress" },
  { booking_id: "BK-004", customer: "Funke Adeyemi", phone: "+234 807 890 1234", email: "funke@email.com", service: "kitchen-install", date: "2026-04-09", time: "07:30", location: "Abuja, FCT", deposit: 80000, total: 450000, status: "completed" },
  { booking_id: "BK-005", customer: "Olumide Balogun", phone: "+234 809 012 3456", email: "olumide@email.com", service: "consultation", date: "2026-04-13", time: "14:00", location: "Ikeja, Lagos", deposit: 0, total: 25000, status: "pending" },
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
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({ customer: "", phone: "", email: "", service: "cctv-install", date: "", time: "", location: "", deposit: 0, total: 0, notes: "" });

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    try {
      const { data, error } = await insforge.database.from("bookings").select("*").order("date", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setBookings(data);
      else {
        for (const b of seedBookings) await insforge.database.from("bookings").insert(b);
        const { data: seeded } = await insforge.database.from("bookings").select("*");
        if (seeded) setBookings(seeded);
      }
    } catch {
      setBookings(seedBookings.map((b, i) => ({ ...b, id: String(i + 1) })));
    } finally { setLoading(false); }
  };

  const createBooking = async () => {
    if (!form.customer || !form.service || !form.date) return;
    setSaving(true);
    try {
      const booking_id = `BK-${String(bookings.length + 1).padStart(3, "0")}`;
      const { data } = await insforge.database.from("bookings").insert({ ...form, booking_id, status: "pending" }).select();
      if (data) setBookings((prev) => [data[0], ...prev]);
      setForm({ customer: "", phone: "", email: "", service: "cctv-install", date: "", time: "", location: "", deposit: 0, total: 0, notes: "" });
      setActiveTab("list");
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await insforge.database.from("bookings").update({ status }).eq("id", id);
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    } catch (err) { console.error(err); }
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getBookingsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter((b) => b.date === dateStr);
  };

  const filteredBookings = filterStatus === "all" ? bookings : bookings.filter((b) => b.status === filterStatus);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.total, 0),
  };

  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

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
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-blue text-white" : "text-text-3 hover:bg-gray-50"}`}>
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center p-12 text-text-4 text-sm">Loading bookings...</div>
      ) : (
        <>
          {activeTab === "calendar" && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-gray-50 rounded-lg"><ChevronLeft size={18} /></button>
                <h3 className="font-bold text-text-1">{months[month]} {year}</h3>
                <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-gray-50 rounded-lg"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((d) => (
                  <div key={d} className="text-center text-[10px] text-text-4 font-semibold py-2">{d}</div>
                ))}
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} />;
                  const dayBookings = getBookingsForDate(day);
                  return (
                    <button key={day} onClick={() => setSelectedDate(`${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`)} className={`min-h-[72px] p-1.5 rounded-lg border text-left transition-colors ${isToday(day) ? "border-blue bg-blue/5" : "border-gray-100 hover:bg-gray-50"}`}>
                      <span className={`text-xs font-medium ${isToday(day) ? "text-blue" : "text-text-2"}`}>{day}</span>
                      <div className="mt-1 space-y-0.5">
                        {dayBookings.slice(0, 2).map((b) => {
                          const svc = serviceTypes.find((s) => s.id === b.service);
                          return (
                            <div key={b.id} className={`text-[8px] px-1 py-0.5 rounded ${svc?.color || "bg-gray-100 text-gray-600"} truncate`}>
                              {b.time} {b.customer.split(" ")[0]}
                            </div>
                          );
                        })}
                        {dayBookings.length > 2 && <span className="text-[8px] text-text-4">+{dayBookings.length - 2} more</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected date bookings */}
              {selectedDate && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold mb-2">Bookings for {selectedDate}</h4>
                  {bookings.filter((b) => b.date === selectedDate).length === 0 ? (
                    <p className="text-xs text-text-4">No bookings on this date.</p>
                  ) : (
                    <div className="space-y-2">
                      {bookings.filter((b) => b.date === selectedDate).map((b) => {
                        const svc = serviceTypes.find((s) => s.id === b.service);
                        return (
                          <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium">{b.customer} — <span className={`px-2 py-0.5 rounded text-[10px] ${svc?.color}`}>{svc?.label}</span></p>
                              <p className="text-xs text-text-4">{b.time} · {b.location}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[b.status] || "bg-gray-100 text-gray-600"}`}>{b.status}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "list" && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-semibold text-text-1">All Bookings</h3>
                <div className="flex gap-1.5">
                  {["all", "pending", "confirmed", "in-progress", "completed"].map((s) => (
                    <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${filterStatus === s ? "bg-blue text-white" : "bg-gray-50 text-text-3 hover:bg-gray-100"}`}>
                      {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Booking", "Customer", "Service", "Date & Time", "Location", "Deposit", "Total", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left p-3 text-text-4 font-medium text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const svc = serviceTypes.find((s) => s.id === booking.service);
                      return (
                        <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="p-3 font-mono text-xs font-semibold text-blue">{booking.booking_id}</td>
                          <td className="p-3">
                            <p className="font-medium text-text-1 text-xs">{booking.customer}</p>
                            <p className="text-[10px] text-text-4">{booking.phone}</p>
                          </td>
                          <td className="p-3"><span className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${svc?.color}`}>{svc?.label}</span></td>
                          <td className="p-3 text-xs text-text-2">
                            <div>{booking.date}</div>
                            <div className="text-text-4">{booking.time}</div>
                          </td>
                          <td className="p-3 text-xs text-text-3">{booking.location}</td>
                          <td className="p-3 text-xs">₦{booking.deposit.toLocaleString()}</td>
                          <td className="p-3 text-xs font-semibold">₦{booking.total.toLocaleString()}</td>
                          <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[booking.status] || "bg-gray-100 text-gray-600"}`}>{booking.status}</span></td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <button onClick={() => setViewBooking(booking)} className="p-1.5 hover:bg-gray-100 rounded-lg" title="View"><Eye size={14} className="text-text-4" /></button>
                              {booking.status === "pending" && (
                                <>
                                  <button onClick={() => updateStatus(booking.id, "confirmed")} className="p-1.5 hover:bg-green-50 rounded-lg" title="Confirm"><Check size={14} className="text-green-600" /></button>
                                  <button onClick={() => updateStatus(booking.id, "cancelled")} className="p-1.5 hover:bg-red/10 rounded-lg" title="Cancel"><X size={14} className="text-red" /></button>
                                </>
                              )}
                              {booking.status === "confirmed" && (
                                <button onClick={() => updateStatus(booking.id, "in-progress")} className="p-1.5 hover:bg-purple-50 rounded-lg" title="Start"><Wrench size={14} className="text-purple-600" /></button>
                              )}
                              {booking.status === "in-progress" && (
                                <button onClick={() => updateStatus(booking.id, "completed")} className="p-1.5 hover:bg-green-50 rounded-lg" title="Complete"><Check size={14} className="text-green-600" /></button>
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
                  <input type="text" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Full name" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs text-text-3 font-medium mb-1 block">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234..." className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs text-text-3 font-medium mb-1 block">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs text-text-3 font-medium mb-1 block">Service Type</label>
                  <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue bg-white">
                    {serviceTypes.map((s) => <option key={s.id} value={s.id}>{s.label} ({s.duration})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-3 font-medium mb-1 block">Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs text-text-3 font-medium mb-1 block">Time</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-text-3 font-medium mb-1 block">Location / Address</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Service location address" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs text-text-3 font-medium mb-1 block">Deposit Amount (₦)</label>
                  <input type="number" value={form.deposit || ""} onChange={(e) => setForm({ ...form, deposit: +e.target.value })} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div>
                  <label className="text-xs text-text-3 font-medium mb-1 block">Total Quote (₦)</label>
                  <input type="number" value={form.total || ""} onChange={(e) => setForm({ ...form, total: +e.target.value })} placeholder="0" className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-text-3 font-medium mb-1 block">Notes</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue resize-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={createBooking} disabled={saving || !form.customer || !form.date} className="h-10 px-6 rounded-lg bg-blue text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-40 flex items-center gap-2">
                  <Save size={14} /> {saving ? "Creating..." : "Create Booking"}
                </button>
                <button onClick={() => setActiveTab("list")} className="h-10 px-6 rounded-lg border border-gray-200 text-sm font-medium text-text-3 hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Booking Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewBooking(null)}>
          <div className="bg-white rounded-2xl w-full max-w-[500px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-syne font-bold text-lg">{viewBooking.booking_id}</h2>
              <button onClick={() => setViewBooking(null)} className="p-2 rounded-lg hover:bg-gray-50 text-text-4"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-text-4">Customer:</span><p className="font-medium">{viewBooking.customer}</p></div>
                <div><span className="text-text-4">Phone:</span><p className="font-medium">{viewBooking.phone}</p></div>
                <div><span className="text-text-4">Email:</span><p className="font-medium text-xs">{viewBooking.email}</p></div>
                <div><span className="text-text-4">Service:</span><p className="font-medium">{serviceTypes.find((s) => s.id === viewBooking.service)?.label}</p></div>
                <div><span className="text-text-4">Date:</span><p className="font-medium">{viewBooking.date}</p></div>
                <div><span className="text-text-4">Time:</span><p className="font-medium">{viewBooking.time}</p></div>
                <div className="col-span-2"><span className="text-text-4">Location:</span><p className="font-medium">{viewBooking.location}</p></div>
                <div><span className="text-text-4">Deposit:</span><p className="font-semibold">₦{viewBooking.deposit.toLocaleString()}</p></div>
                <div><span className="text-text-4">Total:</span><p className="font-semibold">₦{viewBooking.total.toLocaleString()}</p></div>
                <div><span className="text-text-4">Balance Due:</span><p className="font-semibold text-red">₦{(viewBooking.total - viewBooking.deposit).toLocaleString()}</p></div>
                <div><span className="text-text-4">Status:</span><p><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[viewBooking.status] || "bg-gray-100 text-gray-600"}`}>{viewBooking.status}</span></p></div>
              </div>
              {viewBooking.notes && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-text-4 text-xs mb-1">Notes:</p>
                  <p className="text-sm text-text-2">{viewBooking.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
