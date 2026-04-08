"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Save,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div>
      <h1 className="font-bold text-2xl text-text-1 mb-6">Account Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-blue text-white"
                  : "bg-white text-text-3 border border-border hover:bg-off-white"
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                JD
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue text-white flex items-center justify-center shadow-md">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-text-1">John Doe</h3>
              <p className="text-sm text-text-3">Member since March 2025</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">First Name</label>
              <input defaultValue="John" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Last Name</label>
              <input defaultValue="Doe" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Email</label>
              <input defaultValue="john@example.com" type="email" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Phone</label>
              <input defaultValue="+234 812 345 6789" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Date of Birth</label>
              <input type="date" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-2 mb-1.5 block">Gender</label>
              <select className="w-full h-11 px-3 rounded-lg border border-border text-sm">
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>
          <Button className="mt-5 gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-lg text-text-1 mb-4">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium text-text-2 mb-1.5 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full h-11 px-3 pr-10 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-4">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 mb-1.5 block">New Password</label>
                <input type="password" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-text-2 mb-1.5 block">Confirm New Password</label>
                <input type="password" className="w-full h-11 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
              </div>
              <Button>Update Password</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-lg text-text-1 mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-text-3 mb-4">Add an extra layer of security to your account</p>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Smartphone size={20} className="text-text-3" />
                <div>
                  <p className="text-sm font-medium text-text-1">Authenticator App</p>
                  <p className="text-xs text-text-4">Use Google Authenticator or similar</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-lg text-text-1 mb-4">Active Sessions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-blue bg-blue-50">
                <div>
                  <p className="text-sm font-medium text-text-1">Chrome on Windows · Port Harcourt</p>
                  <p className="text-xs text-text-4">Current session · Last active now</p>
                </div>
                <span className="text-xs text-blue font-medium">This device</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-text-1">Safari on iPhone · Lagos</p>
                  <p className="text-xs text-text-4">Last active 2 hours ago</p>
                </div>
                <Button variant="outline" size="sm" className="text-red hover:bg-red-50">Revoke</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold text-lg text-text-1 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { label: "Order updates", desc: "Status changes, shipping, delivery" },
              { label: "Promotions & deals", desc: "Sales, coupons, special offers" },
              { label: "Price drop alerts", desc: "When wishlist items go on sale" },
              { label: "Back in stock", desc: "When out-of-stock items are available" },
              { label: "New arrivals", desc: "Products in your favorite categories" },
              { label: "Blog & articles", desc: "Industry news and guides" },
              { label: "Account activity", desc: "Login, password changes, security" },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-text-1">{pref.label}</p>
                  <p className="text-xs text-text-4">{pref.desc}</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs text-text-3">
                    <input type="checkbox" defaultChecked className="rounded" /> Email
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-text-3">
                    <input type="checkbox" defaultChecked className="rounded" /> SMS
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-text-3">
                    <input type="checkbox" defaultChecked className="rounded" /> Push
                  </label>
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-5 gap-2">
            <Save size={16} /> Save Preferences
          </Button>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold text-lg text-text-1 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              {[
                { label: "Show profile to other users", desc: "Allow other users to see your profile" },
                { label: "Allow product recommendations", desc: "Personalized suggestions based on history" },
                { label: "Allow review visibility", desc: "Show your reviews publicly" },
                { label: "Marketing data usage", desc: "Use purchase data for better recommendations" },
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-1">{setting.label}</p>
                    <p className="text-xs text-text-4">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-red/20 p-6">
            <h3 className="font-semibold text-lg text-red mb-2">Danger Zone</h3>
            <p className="text-sm text-text-3 mb-4">Permanently delete your account and all associated data</p>
            <Button variant="destructive" size="sm">Delete My Account</Button>
          </div>
        </div>
      )}
    </div>
  );
}
