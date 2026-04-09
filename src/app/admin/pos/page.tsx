"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/admin-shell";
import {
  Search, Plus, Minus, CreditCard, Banknote, Smartphone,
  QrCode, ShoppingCart, User, Receipt, Clock, Tag,
  X, Check, Package,
} from "lucide-react";
import { products as demoProducts } from "@/lib/demo-data";

interface POSItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Banknote, color: "bg-green-500" },
  { id: "card", label: "Card", icon: CreditCard, color: "bg-blue" },
  { id: "transfer", label: "Transfer", icon: Smartphone, color: "bg-purple-500" },
  { id: "qr", label: "QR Code", icon: QrCode, color: "bg-orange-500" },
];

const recentTransactions = [
  { id: "TXN-001", time: "2 min ago", items: 3, total: 245000, method: "Card", status: "completed" },
  { id: "TXN-002", time: "15 min ago", items: 1, total: 89000, method: "Cash", status: "completed" },
  { id: "TXN-003", time: "32 min ago", items: 5, total: 567000, method: "Transfer", status: "completed" },
  { id: "TXN-004", time: "1 hr ago", items: 2, total: 178000, method: "Card", status: "refunded" },
];

export default function POSPage() {
  const [cart, setCart] = useState<POSItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeTab, setActiveTab] = useState<"pos" | "history">("pos");

  const filteredProducts = demoProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: typeof demoProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.regularPrice, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
    );
  };

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const vat = (subtotal - discountAmount) * 0.075;
  const total = subtotal - discountAmount + vat;

  const completeSale = () => {
    setShowReceipt(true);
    setTimeout(() => {
      setShowReceipt(false);
      setCart([]);
      setCustomerName("");
      setDiscount(0);
    }, 3000);
  };

  return (
    <AdminShell title="Point of Sale" subtitle="In-store sales terminal">
      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 w-fit border border-gray-200">
        {[
          { id: "pos" as const, label: "Terminal", icon: ShoppingCart },
          { id: "history" as const, label: "History", icon: Clock },
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

      {activeTab === "history" ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-text-1">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 text-text-4 font-medium">Transaction</th>
                  <th className="text-left p-3 text-text-4 font-medium">Time</th>
                  <th className="text-left p-3 text-text-4 font-medium">Items</th>
                  <th className="text-left p-3 text-text-4 font-medium">Total</th>
                  <th className="text-left p-3 text-text-4 font-medium">Method</th>
                  <th className="text-left p-3 text-text-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs font-semibold text-blue">{txn.id}</td>
                    <td className="p-3 text-text-3">{txn.time}</td>
                    <td className="p-3">{txn.items} items</td>
                    <td className="p-3 font-semibold">₦{txn.total.toLocaleString()}</td>
                    <td className="p-3">{txn.method}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        txn.status === "completed" ? "bg-green-50 text-green-600" : "bg-red/10 text-red"
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
          {/* Product Grid (Left) */}
          <div className="lg:col-span-3 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products by name or SKU..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-blue"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-gray-50 hover:bg-blue/5 hover:border-blue border border-gray-200 rounded-xl p-3 text-left transition-colors group"
                  >
                    <div className="w-full aspect-square bg-white rounded-lg mb-2 flex items-center justify-center">
                      <Package size={20} className="text-text-4 group-hover:text-blue transition-colors" />
                    </div>
                    <p className="text-[11px] font-medium text-text-2 line-clamp-2 leading-snug">{product.name}</p>
                    <p className="text-xs font-bold text-text-1 mt-1">₦{product.regularPrice.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart (Right) */}
          <div className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-blue" />
                <span className="font-semibold text-sm">Cart ({cart.length})</span>
              </div>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-[11px] text-red hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Customer */}
            <div className="px-3 pt-3">
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-text-4">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-2 truncate">{item.name}</p>
                      <p className="text-[10px] text-text-4">₦{item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center">
                        <Minus size={10} />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center">
                        <Plus size={10} />
                      </button>
                    </div>
                    <p className="text-xs font-bold w-20 text-right">₦{(item.price * item.quantity).toLocaleString()}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-text-4 hover:text-red">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Discount */}
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-text-4" />
                <input
                  type="number"
                  value={discount || ""}
                  onChange={(e) => setDiscount(Math.min(100, Number(e.target.value)))}
                  placeholder="Discount %"
                  className="flex-1 h-8 px-2 rounded-lg bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:border-blue"
                  min={0}
                  max={100}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="px-3 py-2 border-t border-gray-100 space-y-1 text-xs">
              <div className="flex justify-between text-text-3">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-text-3">
                <span>VAT (7.5%)</span>
                <span>₦{Math.round(vat).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-text-1 pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>₦{Math.round(total).toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="grid grid-cols-4 gap-1.5">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[10px] font-medium transition-colors ${
                      selectedPayment === pm.id
                        ? "border-blue bg-blue/5 text-blue"
                        : "border-gray-200 text-text-3 hover:bg-gray-50"
                    }`}
                  >
                    <pm.icon size={16} />
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Complete Sale */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={completeSale}
                disabled={cart.length === 0}
                className="w-full h-12 rounded-xl bg-blue text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {showReceipt ? (
                  <>
                    <Check size={18} />
                    Sale Complete!
                  </>
                ) : (
                  <>
                    <Receipt size={18} />
                    Complete Sale — ₦{Math.round(total).toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
