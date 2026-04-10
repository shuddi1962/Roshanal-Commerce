"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  CreditCard,
  Check,
  Shield,
  Package,
  Warehouse,
  Map,
  User,
  Phone,
  Mail,
  Building2,
  Lock,
  Banknote,
  Smartphone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useCurrencyStore } from "@/store/currency-store";

const steps = [
  { id: 1, label: "Delivery", icon: User },
  { id: 2, label: "Map", icon: Map },
  { id: 3, label: "Shipping", icon: Truck },
  { id: 4, label: "Warehouse", icon: Warehouse },
  { id: 5, label: "Payment", icon: CreditCard },
  { id: 6, label: "Review", icon: Check },
  { id: 7, label: "Confirmation", icon: Package },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nassarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT",
];

const shippingMethods = [
  { id: "standard", name: "Standard Delivery", time: "3-5 business days", cost: 4500, icon: Truck },
  { id: "express", name: "Express Delivery", time: "1-2 business days", cost: 8500, icon: Package },
  { id: "same-day", name: "Same-Day (PH only)", time: "Same day by 6 PM", cost: 12000, icon: Map },
  { id: "pickup", name: "Store Pickup", time: "Ready in 2 hours", cost: 0, icon: Building2 },
];

const paymentMethods = [
  { id: "card", name: "Debit / Credit Card", description: "Visa, Mastercard, Verve", icon: CreditCard },
  { id: "bank-transfer", name: "Bank Transfer", description: "Direct transfer to our account", icon: Banknote },
  { id: "ussd", name: "USSD", description: "Pay with any bank USSD code", icon: Phone },
  { id: "wallet", name: "Roshanal Wallet", description: "Pay from your wallet balance", icon: Smartphone },
  { id: "paystack", name: "Paystack", description: "Multiple payment options", icon: Shield },
  { id: "pay-on-delivery", name: "Pay on Delivery", description: "Cash or POS on delivery", icon: Banknote },
];

const warehouses = [
  { id: "phc-main", name: "Port Harcourt Main", address: "12 Aba Road, Port Harcourt", stock: "In Stock", eta: "Same day" },
  { id: "phc-diobu", name: "Port Harcourt Diobu", address: "45 Ikwerre Road, Diobu", stock: "In Stock", eta: "Next day" },
  { id: "lagos-ikeja", name: "Lagos Ikeja", address: "22 Allen Avenue, Ikeja", stock: "Limited", eta: "2-3 days" },
];

export default function CheckoutPage() {
  const { items, getTotal, getItemCount, clearCart } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [selectedWarehouse, setSelectedWarehouse] = useState("phc-main");

  const [delivery, setDelivery] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", state: "Rivers", lga: "", country: "Nigeria", postalCode: "",
  });

  const subtotal = getTotal();
  const shippingCost = shippingMethods.find((m) => m.id === selectedShipping)?.cost || 0;
  const total = subtotal + shippingCost;

  const goNext = () => setCurrentStep(Math.min(7, currentStep + 1));
  const goBack = () => setCurrentStep(Math.max(1, currentStep - 1));

  if (!mounted) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue/20 border-t-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && currentStep < 7) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto text-text-4 mb-4" />
          <h2 className="font-syne font-bold text-xl mb-2">No items in your cart</h2>
          <p className="text-sm text-text-3 mb-4">Add products before proceeding to checkout.</p>
          <Link href="/shop"><Button>Go Shopping</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Progress Steps */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1000px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? "bg-success text-white" : isActive ? "bg-blue text-white" : "bg-off-white text-text-4"
                    }`}>
                      {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <span className={`text-[9px] mt-1 font-semibold ${isActive ? "text-blue" : isCompleted ? "text-success" : "text-text-4"}`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 ${isCompleted ? "bg-success" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Info */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-syne font-bold text-lg mb-5 flex items-center gap-2">
                  <User size={20} className="text-blue" /> Delivery Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">Full Name *</label>
                    <input
                      value={delivery.fullName}
                      onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                      placeholder="John Okafor"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">Email *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                      <input
                        value={delivery.email}
                        onChange={(e) => setDelivery({ ...delivery, email: e.target.value })}
                        type="email"
                        className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">Phone *</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-4" />
                      <input
                        value={delivery.phone}
                        onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                        className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                        placeholder="+234 801 234 5678"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">Country</label>
                    <select className="w-full h-10 px-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue">
                      <option>Nigeria</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-text-2 mb-1 block">Address *</label>
                    <input
                      value={delivery.address}
                      onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                      placeholder="123 Aba Road, GRA Phase 2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">State *</label>
                    <select
                      value={delivery.state}
                      onChange={(e) => setDelivery({ ...delivery, state: e.target.value })}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                    >
                      {nigerianStates.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">City *</label>
                    <input
                      value={delivery.city}
                      onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                      placeholder="Port Harcourt"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">LGA</label>
                    <input
                      value={delivery.lga}
                      onChange={(e) => setDelivery({ ...delivery, lga: e.target.value })}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                      placeholder="Obio-Akpor"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-2 mb-1 block">Postal Code</label>
                    <input
                      value={delivery.postalCode}
                      onChange={(e) => setDelivery({ ...delivery, postalCode: e.target.value })}
                      className="w-full h-10 px-3 text-sm rounded-lg border border-border focus:outline-none focus:border-blue"
                      placeholder="500211"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Map / Address Confirmation */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-syne font-bold text-lg mb-5 flex items-center gap-2">
                  <Map size={20} className="text-blue" /> Confirm Location
                </h2>
                <div className="aspect-video bg-off-white rounded-xl border border-border flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Globe size={48} className="mx-auto text-text-4 mb-2" />
                    <p className="text-sm text-text-3">Map will load here</p>
                    <p className="text-xs text-text-4">Pin your exact delivery location for precise delivery</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-syne font-bold text-xs mb-2">Delivery Address</h4>
                  <p className="text-sm text-text-2">
                    {delivery.fullName && `${delivery.fullName}, `}
                    {delivery.address && `${delivery.address}, `}
                    {delivery.city && `${delivery.city}, `}
                    {delivery.state} State, Nigeria
                  </p>
                  <p className="text-xs text-text-4 mt-1">{delivery.phone} · {delivery.email}</p>
                </div>
              </div>
            )}

            {/* Step 3: Shipping Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-syne font-bold text-lg mb-5 flex items-center gap-2">
                  <Truck size={20} className="text-blue" /> Shipping Method
                </h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedShipping === method.id
                            ? "border-blue bg-blue-50"
                            : "border-border hover:border-blue/30"
                        }`}
                        onClick={() => setSelectedShipping(method.id)}
                      >
                        <input type="radio" name="shipping" checked={selectedShipping === method.id} onChange={() => setSelectedShipping(method.id)} className="accent-blue" />
                        <Icon size={20} className={selectedShipping === method.id ? "text-blue" : "text-text-4"} />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-text-1">{method.name}</p>
                          <p className="text-xs text-text-4">{method.time}</p>
                        </div>
                        <span className={`font-syne font-bold text-sm ${method.cost === 0 ? "text-success" : "text-text-1"}`}>
                          {method.cost === 0 ? "FREE" : formatPrice(method.cost)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Warehouse Selection */}
            {currentStep === 4 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-syne font-bold text-lg mb-5 flex items-center gap-2">
                  <Warehouse size={20} className="text-blue" /> Fulfillment Warehouse
                </h2>
                <p className="text-xs text-text-3 mb-4">We&apos;ll ship from the nearest warehouse with available stock.</p>
                <div className="space-y-3">
                  {warehouses.map((wh) => (
                    <label
                      key={wh.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedWarehouse === wh.id
                          ? "border-blue bg-blue-50"
                          : "border-border hover:border-blue/30"
                      }`}
                      onClick={() => setSelectedWarehouse(wh.id)}
                    >
                      <input type="radio" name="warehouse" checked={selectedWarehouse === wh.id} onChange={() => setSelectedWarehouse(wh.id)} className="accent-blue" />
                      <Building2 size={20} className={selectedWarehouse === wh.id ? "text-blue" : "text-text-4"} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-text-1">{wh.name}</p>
                        <p className="text-xs text-text-4">{wh.address}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-semibold ${wh.stock === "In Stock" ? "text-success" : "text-yellow-600"}`}>
                          {wh.stock}
                        </span>
                        <p className="text-[10px] text-text-4">ETA: {wh.eta}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-syne font-bold text-lg mb-5 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? "border-blue bg-blue-50"
                            : "border-border hover:border-blue/30"
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <input type="radio" name="payment" checked={selectedPayment === method.id} onChange={() => setSelectedPayment(method.id)} className="accent-blue" />
                        <Icon size={20} className={selectedPayment === method.id ? "text-blue" : "text-text-4"} />
                        <div>
                          <p className="text-sm font-bold text-text-1">{method.name}</p>
                          <p className="text-xs text-text-4">{method.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selectedPayment === "card" && (
                  <div className="mt-5 p-4 border border-border rounded-xl space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-text-2 mb-1 block">Card Number</label>
                      <input className="w-full h-10 px-3 text-sm rounded-lg border border-border" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-text-2 mb-1 block">Expiry</label>
                        <input className="w-full h-10 px-3 text-sm rounded-lg border border-border" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text-2 mb-1 block">CVV</label>
                        <input className="w-full h-10 px-3 text-sm rounded-lg border border-border" placeholder="123" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-text-4">
                      <Lock size={10} /> Your payment info is encrypted and secure
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="font-syne font-bold text-lg mb-5 flex items-center gap-2">
                  <Check size={20} className="text-blue" /> Review Order
                </h2>

                {/* Delivery */}
                <div className="p-4 bg-off-white rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-syne font-bold text-xs">Delivery</h4>
                    <button onClick={() => setCurrentStep(1)} className="text-[10px] text-blue hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-text-2">{delivery.fullName || "—"}</p>
                  <p className="text-xs text-text-4">{delivery.address || "—"}, {delivery.city || "—"}, {delivery.state}</p>
                </div>

                {/* Shipping */}
                <div className="p-4 bg-off-white rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-syne font-bold text-xs">Shipping</h4>
                    <button onClick={() => setCurrentStep(3)} className="text-[10px] text-blue hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-text-2">{shippingMethods.find((m) => m.id === selectedShipping)?.name}</p>
                  <p className="text-xs text-text-4">{shippingMethods.find((m) => m.id === selectedShipping)?.time}</p>
                </div>

                {/* Payment */}
                <div className="p-4 bg-off-white rounded-xl mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-syne font-bold text-xs">Payment</h4>
                    <button onClick={() => setCurrentStep(5)} className="text-[10px] text-blue hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-text-2">{paymentMethods.find((m) => m.id === selectedPayment)?.name}</p>
                </div>

                {/* Items */}
                <div className="mt-4">
                  <h4 className="font-syne font-bold text-xs mb-3">Items ({getItemCount()})</h4>
                  <div className="space-y-2">
                    {items.map((item) => {
                      const price = item.product.salePrice || item.product.regularPrice;
                      return (
                        <div key={item.product.id} className="flex items-center gap-3 p-2 rounded-lg border border-border">
                          <div className="w-12 h-12 bg-off-white rounded-lg shrink-0 flex items-center justify-center">
                            <span className="text-[7px] font-mono text-text-4">{item.product.sku}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-text-1 truncate">{item.product.name}</p>
                            <p className="text-[10px] text-text-4">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-xs font-bold">{formatPrice(price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Confirmation */}
            {currentStep === 7 && (
              <div className="bg-white rounded-xl border border-border p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <Check size={40} className="text-success" />
                </div>
                <h2 className="font-syne font-bold text-2xl text-text-1 mb-2">Order Placed!</h2>
                <p className="text-sm text-text-3 mb-1">Thank you for your purchase.</p>
                <p className="text-xs text-text-4 mb-6">Order #RSH-2026-{Math.floor(Math.random() * 90000 + 10000)}</p>

                <div className="bg-off-white rounded-xl p-4 mb-6 text-left max-w-md mx-auto">
                  <p className="text-xs text-text-3">Confirmation email sent to <strong>{delivery.email || "your email"}</strong></p>
                  <p className="text-xs text-text-3 mt-1">Estimated delivery: {shippingMethods.find((m) => m.id === selectedShipping)?.time}</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Link href="/account/orders"><Button variant="outline">View Orders</Button></Link>
                  <Link href="/shop"><Button>Continue Shopping</Button></Link>
                </div>
              </div>
            )}

            {/* Navigation */}
            {currentStep < 7 && (
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={goBack} disabled={currentStep === 1}>
                  <ArrowLeft size={16} className="mr-1" /> Back
                </Button>
                <Button onClick={currentStep === 6 ? () => { clearCart(); goNext(); } : goNext}>
                  {currentStep === 6 ? "Place Order" : "Continue"} <ArrowRight size={16} className="ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar: Order Summary (visible on steps 1-6) */}
          {currentStep < 7 && (
            <div>
              <div className="bg-white rounded-xl border border-border p-5 sticky top-4">
                <h3 className="font-syne font-bold text-sm mb-4">Order Summary</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {items.map((item) => {
                    const price = item.product.salePrice || item.product.regularPrice;
                    return (
                      <div key={item.product.id} className="flex items-center gap-2 py-1.5">
                        <div className="w-10 h-10 bg-off-white rounded-lg shrink-0 flex items-center justify-center">
                          <span className="text-[6px] font-mono text-text-4">{item.product.sku}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-text-1 truncate">{item.product.name}</p>
                          <p className="text-[9px] text-text-4">x{item.quantity}</p>
                        </div>
                        <span className="text-[10px] font-bold shrink-0">{formatPrice(price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border mt-3 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-3">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3">Shipping</span>
                    <span className={shippingCost === 0 ? "text-success font-semibold" : ""}>
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between">
                      <span className="font-syne font-bold">Total</span>
                      <span className="font-syne font-bold text-lg">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 text-[10px] text-text-4">
                  <Lock size={10} />
                  <span>Secure checkout — 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
