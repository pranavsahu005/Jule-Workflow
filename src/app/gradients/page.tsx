"use client";

import React, { useState, useEffect } from "react";
import { getGradients, Gradient } from "@/data/gradients";
import { Copy, Check, Heart, Eye, SlidersHorizontal, RefreshCw, Flame, Award, HelpCircle } from "lucide-react";

export default function GradientsCatalog() {
  const [allGradients, setAllGradients] = useState<Gradient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(32);

  // Load gradients & favorites on mount
  useEffect(() => {
    setAllGradients(getGradients());
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorite_gradients");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, []);

  const handleCopyGradientCss = (grad: Gradient, e: React.MouseEvent) => {
    e.preventDefault();
    const cssString = `linear-gradient(${grad.direction}, ${grad.colors.join(", ")})`;
    navigator.clipboard.writeText(cssString).then(() => {
      setCopiedId(grad.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleFavoriteToggle = (gradId: string, e: React.MouseEvent) => {
    e.preventDefault();
    let updated: string[] = [];
    if (favorites.includes(gradId)) {
      updated = favorites.filter(id => id !== gradId);
    } else {
      updated = [...favorites, gradId];
    }
    setFavorites(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("hexatom_favorite_gradients", JSON.stringify(updated));
    }
  };

  // Filter gradients
  const filtered = allGradients.filter((g) => {
    if (selectedCategory && g.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = g.name.toLowerCase().includes(q);
      const matchesHex = g.colors.some(c => c.toLowerCase().includes(q));
      if (!matchesName && !matchesHex) return false;
    }
    return true;
  });

  const categories = ["warm", "cool", "luxury", "neon", "pastel", "multi color"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* Header Banner */}
      <div className="bg-slate-950 text-white p-8 rounded-2xl border border-slate-900 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Interactive Galleries</span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            1,000+ Original Color Gradients
          </h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            Beautifully curated multi-stop gradients across luxury, cool, pastel, and neon cyberpunk aesthetics. Click any card to instantly copy ready-to-use CSS code.
          </p>
        </div>
      </div>

      {/* SECTION 1: ANIMATED INTERACTIVE UI COMPONENTS DEMONSTRATING COLOR IN MOTION */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-indigo-600 fill-indigo-600 animate-pulse" />
            Interactive Components: Colors in Motion
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Hover over these live examples to see how gradients and transitions create beautiful depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Component A: Gradient Transition Button */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-3xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Component A</span>
              <h4 className="font-bold text-sm text-slate-900">Gradient Transition Button</h4>
              <p className="text-xs text-slate-500 mt-1">
                Smoothly transitions its gradient stops on hover.
              </p>
            </div>
            <div className="py-4 flex justify-center">
              <button className="relative group overflow-hidden px-6 py-2.5 rounded-lg text-xs font-black text-white shadow-md transition-all duration-300 transform active:scale-95 cursor-pointer">
                {/* Gradient background layers */}
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-opacity duration-500 group-hover:opacity-0" />
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative z-10">Purchase Gilded Theme</span>
              </button>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] font-mono text-slate-500 space-y-0.5 border border-slate-100">
              <div>Base stops: #4F46E5 ➔ #9333EA</div>
              <div>Hover stops: #9333EA ➔ #E11D48</div>
            </div>
          </div>

          {/* Component B: Navigation Link Hover Accent */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-3xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Component B</span>
              <h4 className="font-bold text-sm text-slate-900">Nav Underline Accent Wave</h4>
              <p className="text-xs text-slate-500 mt-1">
                Hover activates an animated expanding linear-gradient underline.
              </p>
            </div>
            <div className="py-6 flex justify-center">
              <a href="#" className="relative font-extrabold text-xs text-slate-800 tracking-wide uppercase group">
                Explore Premium Collection
                <span className="absolute left-0 bottom-[-4px] w-0 h-[3px] bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-500 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] font-mono text-slate-500 space-y-0.5 border border-slate-100">
              <div>Gradient Stops: #2DD4BF ➔ #06B6D4 ➔ #6366F1</div>
              <div>Transition timing: cubic-bezier(0.4, 0, 0.2, 1)</div>
            </div>
          </div>

          {/* Component C: Color Shifting Hover State */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-3xs space-y-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Component C</span>
              <h4 className="font-bold text-sm text-slate-900">Interactive Depth Card</h4>
              <p className="text-xs text-slate-500 mt-1">
                Shifts base colors smoothly to deeper tones on hover.
              </p>
            </div>
            <div className="py-2">
              <div className="bg-emerald-600 hover:bg-emerald-800 transition-colors duration-300 p-4 rounded-xl text-center text-white cursor-pointer shadow-sm">
                <span className="text-xs font-extrabold tracking-wide block">Interactive Shifting Card</span>
                <span className="text-[10px] opacity-80 mt-1 block">Smooth transition to darker tint</span>
              </div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg text-[10px] font-mono text-slate-500 space-y-0.5 border border-slate-100">
              <div>Base state: #059669 (Emerald 600)</div>
              <div>Hover state: #065F46 (Emerald 800)</div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: BROWSE GRADIENTS */}
      <div className="space-y-6 pt-6 border-t border-slate-200">

        {/* Filters Panel header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-slate-800" />
              Explore Gradient Library
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Browse {filtered.length} total distinct gradients matching your active filter.
            </p>
          </div>

          {/* Keyword Search */}
          <input
            type="text"
            placeholder="Search gradients..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(32); }}
            className="w-full md:w-64 pl-4 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
        </div>

        {/* Category Chips */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5 shadow-3xs">
          <button
            onClick={() => { setSelectedCategory(null); setVisibleCount(32); }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              selectedCategory === null
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            ALL GRADIENTS
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setVisibleCount(32); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors uppercase ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gradients continuous dense grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.slice(0, visibleCount).map((g) => {
            const isCopied = copiedId === g.id;
            const isFav = favorites.includes(g.id);
            const linearCss = `linear-gradient(${g.direction}, ${g.colors.join(", ")})`;

            return (
              <div
                key={g.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-0.5"
              >
                {/* Gradient display area */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <div
                    style={{ background: linearCss }}
                    className="h-full w-full"
                  />

                  {/* Copy / Fav actions overlay */}
                  <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleFavoriteToggle(g.id, e)}
                      className={`p-2 rounded-full backdrop-blur-xs transition-all ${
                        isFav ? "bg-rose-500 text-white" : "bg-white/90 text-slate-700 hover:bg-white"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => handleCopyGradientCss(g, e)}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-white transition-all"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                      {g.name}
                    </h4>
                    <div className="flex gap-1 mt-1">
                      {g.colors.map((c) => (
                        <span key={c} className="text-[9px] font-mono font-bold bg-slate-50 border border-slate-100 text-slate-500 px-1.5 py-0.5 rounded-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold pt-1">
                    <span className="uppercase text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full tracking-wider">
                      {g.category}
                    </span>
                    <button
                      onClick={(e) => handleCopyGradientCss(g, e)}
                      className="text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      {isCopied ? "CSS Copied!" : "Copy CSS"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Load More */}
        {visibleCount < filtered.length && (
          <div className="text-center pt-8">
            <button
              onClick={() => setVisibleCount(prev => prev + 32)}
              className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-800 hover:bg-slate-50 shadow-xs transition-all"
            >
              Load More Gradients
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
