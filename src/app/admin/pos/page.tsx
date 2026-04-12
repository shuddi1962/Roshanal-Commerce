"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Search, Plus, Minus, CreditCard, Banknote, Smartphone,
  QrCode, ShoppingCart, User, Receipt, Clock, Tag,
  X, Check, Package,
} from "lucide-react";
import { insforge } from "@/lib/insforge";

interface Product {
  id: string;
  name: string;
  regularPrice: number;
  sku?: string;
}

interface POSItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Transaction {
  id: string;
  txn_id: string;
  time: string;
  items: number;
  total: number;
  method: string;
  status: string;
  customer: string;
  cart_items: POSItem[];
}

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Banknote, color: "bg-green-500" },
  { id: "card", label: "Card", icon: CreditCard, color: "bg-blue" },
  { id: "transfer", label: "Transfer", icon: Smartphone, color: "bg-purple-500" },
  { id: "qr", label: "QR Code", icon: QrCode, color: "bg-orange-500" },
];

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cart, setCart] = useState<POSItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeTab, setActiveTab] = useState<"pos" | "history">("pos");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        insforge.database.from("products").select("id,name,regularPrice,sku").order("name"),
        insforge.database.from("pos_transactions").select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      if (pRes.data && pRes.data.length > 0) setProducts(pRes.data);
      else {
        // Fallback products if DB is empty
        setProducts([
          { id: "1", name: "Hikvision 4MP Dome Camera", regularPrice: 85000, sku: "HKV-4MP-D" },
          { id: "2", name: "Yamaha 40HP Outboard Engine", regularPrice: 2200000, sku: "YAM-40HP" },
          { id: "3", name: "Fire Extinguisher 9kg DCP", regularPrice: 18000, sku: "FE-9KG" },
          { id: "4", name: "Access Control ZKTeco", regularPrice: 125000, sku: "ZK-AC" },
          { id: "5", name: "Life Jacket Adult", regularPrice: 15000, sku: "LJ-ADT" },
          { id: "6", name: "CCTV 8CH DVR Kit", regularPrice: 250000, sku: "DVR-8CH" },
          { id: "7", name: "Kitchen Hood 90cm", regularPrice: 185000, sku: "KH-90" },
          { id: "8", name: "Marine GPS Navigator", regularPrice: 350000, sku: "GPS-NAV" },
          { id: "9", name: "Fire Alarm Panel 8-Zone", regularPrice: 95000, sku: "FAP-8Z" },
          { id: "10", name: "Boat Engine Oil 4L", regularPrice: 12000, sku: "OIL-4L" },
          { id: "11", name: "Security Siren Outdoor", regularPrice: 25000, sku: "SIR-OUT" },
          { id: "12", name: "Smoke Detector Wireless", regularPrice: 18500, sku: "SMK-WL" },
        ]);
      }
      if (tRes.data) setTransactions(tRes.data);
    } catch {
      setProducts([
        { id: "1", name: "Hikvision 4MP Dome Camera", regularPrice: 85000, sku: "HKV-4MP-D" },
        { id: "2", name: "Yamaha 40HP Outboard Engine", regularPrice: 2200000, sku: "YAM-40HP" },
        { id: "3", name: "Fire Extinguisher 9kg DCP", regularPrice: 18000, sku: "FE-9KG" },
        { id: "4", name: "Access Control ZKTeco", regularPrice: 125000, sku: "ZK-AC" },
        { id: "5", name: "Life Jacket Adult", regularPrice: 15000, sku: "LJ-ADT" },
        { id: "6", name: "CCTV 8CH DVR Kit", regularPrice: 250000, sku: "DVR-8CH" },
        { id: "7", name: "Kitchen Hood 90cm", regularPrice: 185000, sku: "KH-90" },
        { id: "8", name: "Marine GPS Navigator", regularPrice: 350000, sku: "GPS-NAV" },
      ]);
    } finally { setLoading(false); }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.regularPrice, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const vat = (subtotal - discountAmount) * 0.075;
  const total = subtotal - discountAmount + vat;

  const completeSale = async () => {
    setShowReceipt(true);
    try {
      const txn_id = `TXN-${Date.now().toString(36).toUpperCase()}`;
      const payload = {
        txn_id,
        time: new Date().toISOString(),
        items: cart.length,
        total: Math.round(total),
        method: selectedPayment,
        status: "completed",
        customer: customerName || "Walk-in",
        cart_items: cart,
        discount,
        subtotal,
        vat: Math.round(vat),
      };
      const { data } = await insforge.database.from("pos_transactions").insert(payload).select();
      if (data) setTransactions((prev) => [data[0], ...prev]);
    } catch (err) { console.error(err); }
    setTimeout(() => {
      setShowReceipt(false);
      setCart([]);
      setCustomerName("");
      setDiscount(0);
    }, 2000);
  };

  const printReceipt = (txn: Transaction) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Receipt ${txn.txn_id}</title><style>body{font-family:monospace;padding:20px;max-width:300px;margin:auto}h2{text-align:center;margin-bottom:5px}hr{border:none;border-top:1px dashed #333}table{width:100%}td{padding:3px 0}.right{text-align:right}.bold{font-weight:bold}.center{text-align:center}</style></head><body>`);
    w.document.write(`<h2>ROSHANAL GLOBAL</h2><p class="center">POS Receipt</p><hr/>`);
    w.document.write(`<p>Txn: ${txn.txn_id}<br/>Date: ${new Date(txn.time).toLocaleString()}<br/>Customer: ${txn.customer}<br/>Method: ${txn.method}</p><hr/>`);
    w.document.write(`<table>`);
    if (txn.cart_items) txn.cart_items.forEach((item) => {
      w.document.write(`<tr><td>${item.name} x${item.quantity}</td><td class="right">₦${(item.price * item.quantity).toLocaleString()}</td></tr>`);
    });
    w.document.write(`</table><hr/>`);
    w.document.write(`<p class="bold right">Total: ₦${txn.total.toLocaleString()}</p>`);
    w.document.write(`<p class="center">Thank you for shopping!</p></body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <AdminShell title="Point of Sale" subtitle="In-store sales terminal">
      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 w-fit border border-gray-200">
        {[
          { id: "pos" as const, label: "Terminal", icon: ShoppingCart },
          { id: "history" as const, label: "History", icon: Clock },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-blue text-white" : "text-text-3 hover:bg-gray-50"}`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "history" ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-text-1">Recent Transactions</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Transaction", "Time", "Customer", "Items", "Total", "Method", "Status", ""].map((h) => (
                    <th key={h} className="text-left p-3 text-text-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-text-4 text-sm">No transactions yet.</td></tr>
                ) : transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs font-semibold text-blue">{txn.txn_id}</td>
                    <td className="p-3 text-text-3 text-xs">{new Date(txn.time).toLocaleString()}</td>
                    <td className="p-3">{txn.customer}</td>
                    <td className="p-3">{txn.items} items</td>
                    <td className="p-3 font-semibold">₦{txn.total.toLocaleString()}</td>
                    <td className="p-3 capitalize">{txn.method}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${txn.status === "completed" ? "bg-green-50 text-green-600" : "bg-red/10 text-red"}`}>{txn.status}</span></td>
                    <td className="p-3"><button onClick={() => printReceipt(txn)} className="text-xs text-blue hover:underline">Print</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
          {/* Product Grid */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products by name or SKU..." className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-blue" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {loading ? (
                <div className="text-center py-12 text-text-4 text-sm">Loading products...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {filteredProducts.map((product) => (
                    <button key={product.id} onClick={() => addToCart(product)} className="bg-gray-50 hover:bg-blue/5 hover:border-blue border border-gray-200 rounded-xl p-3 text-left transition-colors group">
                      <div className="w-full aspect-square bg-white rounded-lg mb-2 flex items-center justify-center">
                        <Package size={20} className="text-text-4 group-hover:text-blue transition-colors" />
                      </div>
                      <p className="text-[11px] font-medium text-text-2 line-clamp-2 leading-snug">{product.name}</p>
                      <p className="text-xs font-bold text-text-1 mt-1">₦{product.regularPrice.toLocaleString()}</p>
                      {product.sku && <p className="text-[9px] text-text-4 mt-0.5">{product.sku}</p>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2"><ShoppingCart size={16} className="text-blue" /><span className="font-semibold text-sm">Cart ({cart.length})</span></div>
              {cart.length > 0 && <button onClick={() => setCart([])} className="text-[11px] text-red hover:underline">Clear All</button>}
            </div>

            <div className="px-3 pt-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Walk-in Customer" className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-text-4"><ShoppingCart size={32} className="mx-auto mb-2 opacity-30" /><p className="text-xs">Cart is empty</p></div>
              ) : cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-2 truncate">{item.name}</p>
                    <p className="text-[10px] text-text-4">₦{item.price.toLocaleString()} each</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center"><Minus size={10} /></button>
                    <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center"><Plus size={10} /></button>
                  </div>
                  <p className="text-xs font-bold w-20 text-right">₦{(item.price * item.quantity).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-text-4 hover:text-red"><X size={14} /></button>
                </div>
              ))}
            </div>

            <div className="px-3 py-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-text-4" />
                <input type="number" value={discount || ""} onChange={(e) => setDiscount(Math.min(100, Number(e.target.value)))} placeholder="Discount %" className="flex-1 h-8 px-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue" min={0} max={100} />
              </div>
            </div>

            <div className="px-3 py-2 border-t border-gray-100 space-y-1 text-xs">
              <div className="flex justify-between text-text-3"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({discount}%)</span><span>-₦{discountAmount.toLocaleString()}</span></div>}
              <div className="flex justify-between text-text-3"><span>VAT (7.5%)</span><span>₦{Math.round(vat).toLocaleString()}</span></div>
              <div className="flex justify-between text-base font-bold text-text-1 pt-1 border-t border-gray-100"><span>Total</span><span>₦{Math.round(total).toLocaleString()}</span></div>
            </div>

            <div className="px-3 py-2 border-t border-gray-100">
              <div className="grid grid-cols-4 gap-1.5">
                {paymentMethods.map((pm) => (
                  <button key={pm.id} onClick={() => setSelectedPayment(pm.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[10px] font-medium transition-colors ${selectedPayment === pm.id ? "border-blue bg-blue/5 text-blue" : "border-gray-200 text-text-3 hover:bg-gray-50"}`}>
                    <pm.icon size={16} /> {pm.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-gray-100">
              <button onClick={completeSale} disabled={cart.length === 0} className="w-full h-12 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {showReceipt ? (<><Check size={18} /> Sale Complete!</>) : (<><Receipt size={18} /> Complete Sale — ₦{Math.round(total).toLocaleString()}</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
