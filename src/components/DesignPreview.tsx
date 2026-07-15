"use client";

import React, { useState } from "react";
import { Laptop, Smartphone, ArrowRight, Star, Heart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Palette } from "@/data/palettes";

interface DesignPreviewProps {
  palette: Palette;
  customRoles?: {
    dominant: string;
    secondary: string;
    accent: string;
    text: string;
    ui: string;
  };
}

export default function DesignPreview({ palette, customRoles }: DesignPreviewProps) {
  const [activeTab, setActiveTab] = useState<"web" | "app">("web");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const roles = customRoles || {
    dominant: palette.roles?.dominant || palette.colors[0],
    secondary: palette.roles?.secondary || palette.colors[1] || palette.colors[0],
    accent: palette.roles?.accent || palette.colors[2] || palette.colors[0],
    text: palette.roles?.text || "#111827",
    ui: palette.roles?.ui || palette.colors[3] || palette.colors[0],
  };

  const carouselItems = [
    { title: "Dynamic Integration", desc: "Instantly preview your design assets before exporting code." },
    { title: "Accessibility Approved", desc: "Ensuring great text contrast and high action button prominence." },
    { title: "Sleek Aesthetics", desc: "Crafted to look beautiful on high-end device displays." }
  ];

  const handleNextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            Interactive Design Preview
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            See how the palette colors are mapped onto real digital layouts.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit self-start sm:self-center">
          <button
            onClick={() => setActiveTab("web")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "web"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Laptop className="w-4 h-4" />
            Web Layout
          </button>
          <button
            onClick={() => setActiveTab("app")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "app"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            App Layout
          </button>
        </div>
      </div>

      {/* Preview Screen area */}
      <div className="flex justify-center">
        {activeTab === "web" ? (
          /* Web Mockup Frame (Browser Mockup) */
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* Browser chrome */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white text-[10px] text-slate-400 font-medium px-4 py-0.5 rounded-md flex-1 max-w-sm mx-auto text-center truncate">
                https://hexatom.co/preview/{palette.name.toLowerCase().replace(/\s+/g, "-")}
              </div>
            </div>

            {/* Browser Webpage Content Area */}
            <div
              className="p-6 space-y-8 transition-colors duration-300 min-h-[380px] flex flex-col justify-between"
              style={{ backgroundColor: roles.dominant, color: roles.text }}
            >
              {/* Header / Navbar */}
              <div
                className="flex justify-between items-center px-4 py-3 rounded-xl border text-xs font-bold shadow-3xs transition-colors duration-300"
                style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: roles.accent }}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </span>
                  <span className="tracking-tight uppercase">CREATIVE DESIGN</span>
                </div>
                <div className="flex gap-4 text-[10px] opacity-80">
                  <span>Home</span>
                  <span>Portfolio</span>
                  <span>About</span>
                </div>
              </div>

              {/* Hero Section */}
              <div className="text-center space-y-4 max-w-md mx-auto my-auto">
                <h4 className="text-2xl font-extrabold tracking-tight leading-tight">
                  Design at the Speed of <span style={{ color: roles.accent }}>Color Intelligence</span>
                </h4>
                <p className="text-xs opacity-75 font-medium leading-relaxed">
                  Experience a beautifully harmonized mockup layout perfectly utilizing the 60-30-10 color allocation rules.
                </p>

                {/* Call To Actions */}
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-transform active:scale-95 flex items-center gap-1 shadow-sm"
                    style={{ backgroundColor: roles.accent }}
                  >
                    Get Started <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-xs font-semibold border transition-colors bg-white/10"
                    style={{ borderColor: roles.ui }}
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Slider / Carousel section */}
              <div
                className="p-3.5 rounded-xl border flex items-center justify-between text-left shadow-3xs"
                style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
              >
                <button onClick={handlePrevCarousel} className="p-1 rounded-md hover:bg-white/10 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-center px-4">
                  <h5 className="font-extrabold text-[11px] uppercase tracking-wider">{carouselItems[carouselIndex].title}</h5>
                  <p className="text-[10px] opacity-75 mt-0.5">{carouselItems[carouselIndex].desc}</p>
                </div>
                <button onClick={handleNextCarousel} className="p-1 rounded-md hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Row of content cards */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-xl border text-left shadow-3xs"
                  style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                >
                  <h5 className="font-bold text-xs">Elegant Architecture</h5>
                  <p className="text-[10px] opacity-70 mt-1">This card container acts as a secondary surface to provide clear depth.</p>
                </div>
                <div
                  className="p-4 rounded-xl border text-left shadow-3xs"
                  style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                >
                  <h5 className="font-bold text-xs">Aesthetic Precision</h5>
                  <p className="text-[10px] opacity-70 mt-1">Accent colors highlight calls to action and direct key navigation flows.</p>
                </div>
              </div>

              {/* Footer */}
              <div
                className="pt-4 border-t text-center text-[9px] opacity-65 flex justify-between"
                style={{ borderTopColor: roles.ui }}
              >
                <span>© {palette.name.toUpperCase()} CREATIVE LABS</span>
                <span>DESIGN SYSTEM DEMO</span>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile App Mockup Frame (Phone Frame) */
          <div className="w-[300px] bg-slate-900 border-[8px] border-slate-950 rounded-[40px] overflow-hidden shadow-lg relative flex flex-col aspect-[9/19]">
            {/* Speaker & camera slot */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex items-center justify-center z-10">
              <div className="w-16 h-4 bg-black rounded-full flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* Inner Content Screen */}
            <div
              className="flex-1 p-4 pt-8 pb-12 flex flex-col justify-between transition-colors duration-300"
              style={{ backgroundColor: roles.dominant, color: roles.text }}
            >
              {/* Top Bar Navigation */}
              <div
                className="flex justify-between items-center px-3.5 py-2.5 rounded-lg border text-[11px] font-extrabold shadow-3xs"
                style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
              >
                <span>Dashboard</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: roles.accent }} />
              </div>

              {/* App Feed Cards list */}
              <div className="space-y-3.5 my-auto">
                <div
                  className="p-3.5 rounded-xl border text-left shadow-3xs space-y-1.5"
                  style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider opacity-60">Finance Tracker</span>
                  <h5 className="font-bold text-xs">Total Revenue Portfolio</h5>
                  <div className="h-2 rounded-full w-full bg-slate-200/20 overflow-hidden">
                    <div className="h-full rounded-full w-2/3" style={{ backgroundColor: roles.accent }} />
                  </div>
                </div>

                <div
                  className="p-3.5 rounded-xl border text-left shadow-3xs space-y-1.5"
                  style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                >
                  <span className="text-[9px] font-black uppercase tracking-wider opacity-60">Creative Cloud</span>
                  <h5 className="font-bold text-xs">Style Preferences Saved</h5>
                  <div className="flex gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] opacity-75">Theme matches 100% with branding guidelines.</span>
                  </div>
                </div>
              </div>

              {/* Floating Action Button (FAB) & Bottom Nav */}
              <div className="space-y-4">
                {/* Floating Action Button */}
                <div className="flex justify-end pr-2">
                  <button
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md active:scale-90 transition-transform"
                    style={{ backgroundColor: roles.accent }}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Bottom navigation bar */}
                <div
                  className="flex justify-around items-center py-2.5 rounded-xl border text-[10px] font-bold shadow-3xs"
                  style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                >
                  <span className="opacity-100" style={{ color: roles.accent }}>Feed</span>
                  <span className="opacity-70">Analytics</span>
                  <span className="opacity-70">Account</span>
                </div>
              </div>
            </div>

            {/* Home indicator bar */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
              <span className="w-24 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
