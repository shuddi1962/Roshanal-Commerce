"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Ship,
  ArrowRight,
  Check,
  Phone,
  Mail,
  MessageSquare,
  Play,
  ChevronRight,
  Ruler,
  Cog,
  Palette,
  Eye,
  FileText,
  Calendar,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BoatVesselType } from "@/types";

const vesselTypes: { type: BoatVesselType; name: string; description: string; startingPrice: number; image: string; engineIncluded: boolean; lengthRange: string }[] = [
  { type: "fishing-boat", name: "Fishing Boat", description: "Durable fishing vessels for commercial and sport fishing", startingPrice: 8500000, image: "/boats/fishing.jpg", engineIncluded: true, lengthRange: "16–32 ft" },
  { type: "speed-boat", name: "Speed Boat", description: "High-performance speed boats for recreation and patrol", startingPrice: 12000000, image: "/boats/speed.jpg", engineIncluded: true, lengthRange: "18–28 ft" },
  { type: "pontoon", name: "Pontoon Boat", description: "Stable flat-deck boats for leisure and touring", startingPrice: 6500000, image: "/boats/pontoon.jpg", engineIncluded: true, lengthRange: "20–30 ft" },
  { type: "cabin-cruiser", name: "Cabin Cruiser", description: "Comfortable cabin boats for extended voyages", startingPrice: 25000000, image: "/boats/cruiser.jpg", engineIncluded: true, lengthRange: "25–45 ft" },
  { type: "catamaran", name: "Catamaran", description: "Twin-hull vessels with excellent stability", startingPrice: 18000000, image: "/boats/catamaran.jpg", engineIncluded: true, lengthRange: "24–50 ft" },
  { type: "tugboat", name: "Tugboat", description: "Powerful tugboats for towing and harbour operations", startingPrice: 45000000, image: "/boats/tugboat.jpg", engineIncluded: true, lengthRange: "30–60 ft" },
  { type: "barge", name: "Barge", description: "Flat-bottom cargo and transport barges", startingPrice: 35000000, image: "/boats/barge.jpg", engineIncluded: false, lengthRange: "40–120 ft" },
  { type: "patrol-boat", name: "Patrol Boat", description: "Military/security patrol and surveillance vessels", startingPrice: 20000000, image: "/boats/patrol.jpg", engineIncluded: true, lengthRange: "20–45 ft" },
  { type: "ferry", name: "Ferry", description: "Passenger and vehicle ferry boats", startingPrice: 55000000, image: "/boats/ferry.jpg", engineIncluded: true, lengthRange: "40–80 ft" },
  { type: "workboat", name: "Workboat", description: "General-purpose industrial and utility workboats", startingPrice: 15000000, image: "/boats/workboat.jpg", engineIncluded: true, lengthRange: "20–50 ft" },
  { type: "houseboat", name: "Houseboat", description: "Floating residential vessels with full amenities", startingPrice: 30000000, image: "/boats/houseboat.jpg", engineIncluded: true, lengthRange: "30–60 ft" },
  { type: "yacht", name: "Yacht", description: "Luxury yachts for premium marine experience", startingPrice: 80000000, image: "/boats/yacht.jpg", engineIncluded: true, lengthRange: "35–80 ft" },
  { type: "dinghy", name: "Dinghy", description: "Small lightweight boats for tenders and short trips", startingPrice: 2500000, image: "/boats/dinghy.jpg", engineIncluded: false, lengthRange: "8–14 ft" },
  { type: "jon-boat", name: "Jon Boat", description: "Flat-bottom aluminium boats for shallow waters", startingPrice: 3500000, image: "/boats/jon-boat.jpg", engineIncluded: false, lengthRange: "10–20 ft" },
  { type: "center-console", name: "Center Console", description: "Versatile boats with center helm for fishing and cruising", startingPrice: 10000000, image: "/boats/center-console.jpg", engineIncluded: true, lengthRange: "18–36 ft" },
  { type: "custom", name: "Custom Build", description: "Fully custom vessel to your exact specifications", startingPrice: 0, image: "/boats/custom.jpg", engineIncluded: false, lengthRange: "Any" },
];

const materials = [
  { value: "fiberglass", label: "Fiberglass", desc: "Lightweight, low maintenance, smooth finish" },
  { value: "aluminum", label: "Aluminium", desc: "Durable, corrosion-resistant, lightweight" },
  { value: "steel", label: "Steel", desc: "Maximum strength for heavy-duty vessels" },
  { value: "wood", label: "Wood", desc: "Classic aesthetic, traditional craftsmanship" },
  { value: "composite", label: "Composite", desc: "Advanced hybrid materials for performance" },
];

const pastProjects = [
  { name: "36ft Patrol Boat — Nigerian Navy", year: "2025", type: "patrol-boat", location: "Port Harcourt" },
  { name: "28ft Sport Fishing Boat", year: "2025", type: "fishing-boat", location: "Lagos" },
  { name: "45ft Passenger Ferry", year: "2024", type: "ferry", location: "Calabar" },
  { name: "20ft Center Console", year: "2024", type: "center-console", location: "Warri" },
  { name: "60ft Cargo Barge", year: "2024", type: "barge", location: "Bonny" },
  { name: "50ft Luxury Houseboat", year: "2023", type: "houseboat", location: "Port Harcourt" },
];

export default function BoatBuildingPage() {
  const [selectedVessel, setSelectedVessel] = useState<BoatVesselType | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [includeEngine, setIncludeEngine] = useState(true);
  const [step, setStep] = useState(1);

  const selectedVesselData = vesselTypes.find((v) => v.type === selectedVessel);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-navy via-blue-900 to-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute bottom-10 right-20 w-64 h-64 border border-white/10 rounded-full" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 relative">
          <div className="flex items-center gap-2 text-blue-300 text-sm mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={14} />
            <Link href="/services" className="hover:text-white">Services</Link>
            <ChevronRight size={14} />
            <span className="text-white">Boat Building</span>
          </div>
          <div className="max-w-2xl">
            <Badge variant="navy" className="mb-4 bg-white/10 border border-white/20">
              <Ship size={12} className="mr-1" /> Marine Vessel Construction
            </Badge>
            <h1 className="font-syne font-black text-4xl lg:text-5xl text-white leading-tight">
              Custom Boat Building
            </h1>
            <p className="text-white/60 text-lg mt-4 leading-relaxed">
              Design and build your dream vessel with our expert marine engineers.
              From fishing boats to luxury yachts — we bring your vision to life with
              3D visualization, premium materials, and professional craftsmanship.
            </p>
            <div className="flex gap-3 mt-8">
              <Button variant="cta" size="lg" onClick={() => document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth" })}>
                Start Designing <ArrowRight size={16} className="ml-1" />
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Phone size={16} className="mr-2" /> Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="max-w-[1440px] mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "200+", label: "Vessels Built" },
              { value: "15+", label: "Years Experience" },
              { value: "16", label: "Vessel Types" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-syne font-black text-3xl text-blue">{stat.value}</p>
                <p className="text-sm text-text-3 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vessel Types Gallery */}
      <section className="py-12">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-syne font-bold text-2xl text-text-1">Marine Vessels We Build</h2>
            <p className="text-text-3 text-sm mt-2">Select a vessel type to see details and start your custom design</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vesselTypes.map((vessel) => (
              <button
                key={vessel.type}
                onClick={() => {
                  setSelectedVessel(vessel.type);
                  setIncludeEngine(vessel.engineIncluded);
                  document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`text-left p-4 rounded-xl border transition-all group ${
                  selectedVessel === vessel.type
                    ? "border-blue bg-blue-50 shadow-lg"
                    : "border-border bg-white hover:border-blue/50 hover:shadow-md"
                }`}
              >
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-blue-50 to-off-white rounded-lg mb-3 flex items-center justify-center">
                  <Ship size={32} className={`${selectedVessel === vessel.type ? "text-blue" : "text-text-4"} group-hover:text-blue transition-colors`} />
                </div>
                <h3 className="font-syne font-bold text-sm text-text-1">{vessel.name}</h3>
                <p className="text-xs text-text-4 mt-1 line-clamp-2">{vessel.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-text-4">{vessel.lengthRange}</span>
                  {vessel.engineIncluded && (
                    <Badge variant="outline" className="text-[9px]">
                      <Cog size={9} className="mr-0.5" /> Engine Incl.
                    </Badge>
                  )}
                </div>
                {vessel.startingPrice > 0 && (
                  <p className="font-syne font-bold text-xs text-blue mt-2">
                    From ₦{(vessel.startingPrice / 1000000).toFixed(1)}M
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Boat Configurator */}
      <section id="configurator" className="py-12 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-syne font-bold text-2xl text-text-1">Design Your Vessel</h2>
            <p className="text-text-3 text-sm mt-2">Configure your boat and get a 3D visualization with cost estimate</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { num: 1, label: "Vessel Type", icon: Ship },
              { num: 2, label: "Specifications", icon: Ruler },
              { num: 3, label: "Material", icon: Palette },
              { num: 4, label: "3D Preview", icon: Eye },
              { num: 5, label: "Quote & Book", icon: FileText },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    step === s.num
                      ? "bg-blue text-white"
                      : step > s.num
                      ? "bg-success/10 text-success"
                      : "bg-off-white text-text-4"
                  }`}
                >
                  {step > s.num ? <Check size={14} /> : <s.icon size={14} />}
                  <span className="hidden md:inline">{s.label}</span>
                </button>
                {i < 4 && <div className="w-8 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Form */}
            <div>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-syne font-bold text-lg">Select Vessel Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {vesselTypes.map((vessel) => (
                      <button
                        key={vessel.type}
                        onClick={() => { setSelectedVessel(vessel.type); setIncludeEngine(vessel.engineIncluded); }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedVessel === vessel.type
                            ? "border-blue bg-blue-50"
                            : "border-border hover:border-blue/50"
                        }`}
                      >
                        <Ship size={18} className={selectedVessel === vessel.type ? "text-blue" : "text-text-4"} />
                        <p className="font-syne font-bold text-xs mt-1.5">{vessel.name}</p>
                        <p className="text-[10px] text-text-4">{vessel.lengthRange}</p>
                      </button>
                    ))}
                  </div>
                  <Button onClick={() => setStep(2)} disabled={!selectedVessel} className="w-full mt-4">
                    Continue <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-syne font-bold text-lg">Specifications</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-text-2 mb-1 block">Length (feet)</label>
                      <input type="number" placeholder="e.g. 28" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-text-2 mb-1 block">Width / Beam (feet)</label>
                      <input type="number" placeholder="e.g. 10" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-text-2 mb-1 block flex items-center gap-2">
                        Include Engine
                        <input type="checkbox" checked={includeEngine} onChange={(e) => setIncludeEngine(e.target.checked)} className="rounded" />
                      </label>
                    </div>
                    {includeEngine && (
                      <>
                        <div>
                          <label className="text-sm font-semibold text-text-2 mb-1 block">Engine Brand</label>
                          <select className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue bg-white">
                            <option value="">Select brand</option>
                            <option value="yamaha">Yamaha</option>
                            <option value="mercury">Mercury</option>
                            <option value="suzuki">Suzuki Marine</option>
                            <option value="honda">Honda Marine</option>
                            <option value="evinrude">Evinrude</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-text-2 mb-1 block">Horsepower</label>
                          <select className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue bg-white">
                            <option value="">Select HP</option>
                            <option>40 HP</option>
                            <option>75 HP</option>
                            <option>115 HP</option>
                            <option>150 HP</option>
                            <option>200 HP</option>
                            <option>250 HP</option>
                            <option>300 HP</option>
                            <option>350+ HP</option>
                          </select>
                        </div>
                      </>
                    )}
                    <div>
                      <label className="text-sm font-semibold text-text-2 mb-1 block">Additional Features</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["GPS/Navigation", "Fish Finder", "Live Well", "Rod Holders", "Cabin/Canopy", "LED Lights", "Sound System", "Anchor Winch"].map((feat) => (
                          <label key={feat} className="flex items-center gap-2 text-xs text-text-2 p-2 bg-off-white rounded-lg cursor-pointer hover:bg-blue-50">
                            <input type="checkbox" className="rounded" />
                            {feat}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button onClick={() => setStep(3)} className="flex-1">Continue <ArrowRight size={14} className="ml-1" /></Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-syne font-bold text-lg">Select Material</h3>
                  <div className="space-y-3">
                    {materials.map((mat) => (
                      <button
                        key={mat.value}
                        onClick={() => setSelectedMaterial(mat.value)}
                        className={`w-full p-4 rounded-lg border text-left transition-all flex items-start gap-3 ${
                          selectedMaterial === mat.value
                            ? "border-blue bg-blue-50"
                            : "border-border hover:border-blue/50"
                        }`}
                      >
                        <Palette size={18} className={selectedMaterial === mat.value ? "text-blue mt-0.5" : "text-text-4 mt-0.5"} />
                        <div>
                          <p className="font-syne font-bold text-sm">{mat.label}</p>
                          <p className="text-xs text-text-4 mt-0.5">{mat.desc}</p>
                        </div>
                        {selectedMaterial === mat.value && <Check size={16} className="text-blue ml-auto" />}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-text-2 mb-1 block">Custom Requirements</label>
                    <textarea placeholder="Describe any special requirements, custom features, color preferences..." className="w-full h-24 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-blue resize-none" />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button onClick={() => setStep(4)} disabled={!selectedMaterial} className="flex-1">
                      Generate 3D Preview <Eye size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-syne font-bold text-lg">3D Vessel Preview</h3>
                  <p className="text-sm text-text-3">
                    Your custom {selectedVesselData?.name || "vessel"} visualization is being generated.
                    {includeEngine && " Engine configuration is included in the rendering."}
                  </p>
                  <div className="bg-off-white rounded-xl border border-border p-6">
                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-navy rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-400/30 to-transparent" />
                      </div>
                      <div className="text-center relative">
                        <Ship size={64} className="text-white/30 mx-auto mb-3" />
                        <p className="text-white/60 text-sm font-syne font-bold">
                          {selectedVesselData?.name || "Custom Vessel"} — 3D Visualization
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {selectedMaterial.charAt(0).toUpperCase() + selectedMaterial.slice(1)} hull
                          {includeEngine && " • Engine included"}
                        </p>
                        <button className="mt-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center mx-auto transition-colors">
                          <Play size={20} className="text-white ml-0.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {["Front View", "Side View", "Interior"].map((view) => (
                        <div key={view} className="aspect-video bg-navy/5 rounded-lg flex items-center justify-center border border-border hover:border-blue cursor-pointer transition-colors">
                          <span className="text-[10px] text-text-4">{view}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {includeEngine && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue/20">
                      <h4 className="font-syne font-bold text-sm text-blue flex items-center gap-2">
                        <Cog size={16} /> Engine Configuration
                      </h4>
                      <p className="text-xs text-text-3 mt-2">
                        Your vessel includes engine mounting, fuel system, propeller, and controls as part of the build.
                        Engine illustrations and specifications are included in the 3D preview.
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
                    <Button onClick={() => setStep(5)} className="flex-1">
                      Get Quote <FileText size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="font-syne font-bold text-lg">Get Your Quote</h3>
                  <div className="bg-off-white rounded-xl p-4 border border-border">
                    <h4 className="font-syne font-bold text-sm mb-3">Configuration Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-text-3">Vessel Type</span><span className="font-semibold">{selectedVesselData?.name}</span></div>
                      <div className="flex justify-between"><span className="text-text-3">Material</span><span className="font-semibold capitalize">{selectedMaterial}</span></div>
                      <div className="flex justify-between"><span className="text-text-3">Engine</span><span className="font-semibold">{includeEngine ? "Included" : "Not included"}</span></div>
                      {selectedVesselData && selectedVesselData.startingPrice > 0 && (
                        <div className="flex justify-between pt-2 border-t border-border">
                          <span className="text-text-3">Estimated Starting Price</span>
                          <span className="font-syne font-bold text-blue">₦{selectedVesselData.startingPrice.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <input placeholder="Full Name" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                    <input placeholder="Email Address" type="email" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                    <input placeholder="Phone Number" type="tel" className="w-full h-10 px-3 rounded-lg border border-border text-sm focus:outline-none focus:border-blue" />
                    <textarea placeholder="Additional notes or questions..." className="w-full h-20 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-blue resize-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="cta" className="col-span-3">
                      <Mail size={14} className="mr-2" /> Submit Quote Request
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <Phone size={14} /> Call Us
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <Calendar size={14} /> Book Call
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center gap-2">
                      <MessageSquare size={14} /> Drop Note
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(4)} className="flex-1">Back</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Live Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-4 space-y-4">
                <div className="bg-gradient-to-br from-navy to-blue-900 rounded-2xl p-6 min-h-[400px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-400/20 to-transparent" />
                  </div>
                  <div className="text-center relative">
                    <Ship size={80} className="text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 text-sm font-syne">
                      {selectedVessel ? `${selectedVesselData?.name} Preview` : "Select a vessel type to begin"}
                    </p>
                    {selectedVessel && (
                      <div className="mt-4 space-y-1">
                        <p className="text-white/30 text-xs">Material: {selectedMaterial || "Not selected"}</p>
                        <p className="text-white/30 text-xs">Engine: {includeEngine ? "Included" : "Not included"}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedVesselData && (
                  <div className="bg-white rounded-xl border border-border p-4">
                    <h4 className="font-syne font-bold text-sm mb-2">{selectedVesselData.name} Info</h4>
                    <p className="text-xs text-text-3">{selectedVesselData.description}</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-off-white rounded-lg p-2">
                        <p className="text-[10px] text-text-4">Length Range</p>
                        <p className="font-syne font-bold text-xs">{selectedVesselData.lengthRange}</p>
                      </div>
                      <div className="bg-off-white rounded-lg p-2">
                        <p className="text-[10px] text-text-4">Engine</p>
                        <p className="font-syne font-bold text-xs">{selectedVesselData.engineIncluded ? "Standard" : "Optional"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Past Projects */}
      <section className="py-12">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-syne font-bold text-2xl text-text-1">Our Previous Builds</h2>
            <p className="text-text-3 text-sm mt-2">Explore our portfolio of custom marine vessels</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastProjects.map((project, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-off-white flex items-center justify-center">
                  <Ship size={40} className="text-text-4/30 group-hover:text-blue/30 transition-colors" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px]">{project.year}</Badge>
                    <Badge variant="default" className="text-[10px] capitalize">{project.type.replace("-", " ")}</Badge>
                  </div>
                  <h3 className="font-syne font-bold text-sm text-text-1">{project.name}</h3>
                  <p className="text-xs text-text-4 mt-1 flex items-center gap-1">
                    <MapPin size={10} /> {project.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-navy">
        <div className="max-w-[1440px] mx-auto px-4 text-center">
          <Ship size={48} className="text-blue-400 mx-auto mb-4" />
          <h2 className="font-syne font-bold text-2xl text-white">Ready to Build Your Vessel?</h2>
          <p className="text-white/50 text-sm mt-2 max-w-md mx-auto">
            Contact our marine engineering team for a free consultation and custom quote.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="cta" size="lg">
              <Phone size={16} className="mr-2" /> Call Now
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Mail size={16} className="mr-2" /> Send Inquiry
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
