"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getPalettes,
  Palette,
  STYLE_CATEGORIES,
  COLOR_FAMILIES
} from "@/data/palettes";
import PaletteCard from "@/components/PaletteCard";
import {
  SlidersHorizontal,
  X,
  RefreshCw,
  Search,
  ChevronRight,
  Info,
  BookOpen
} from "lucide-react";

// Category descriptions and practical advice
const CATEGORY_TIPS: { [key: string]: string } = {
  Luxury: "Luxury styles use deep shadows, warm gold accents, and rich cream hues. Best suited for high-end boutique e-commerce, jewelry, luxury real estate, and premium premium spirits.",
  "Neon and Cyberpunk": "High-vibrancy glowing shades on dark/black backgrounds. Ideal for gaming dashboards, web3 applications, esports tournaments, and cyber-security products.",
  "Minimal and Monochrome": "Subtle shades with high structural contrast. Focuses entirely on readability, typography, and clear layout lines. Perfect for architectural firms, art portfolios, and personal blogs.",
  "Corporate and Business": "Sober navy blues, deep slate grays, and silver accents. Inspires trust, stability, and high operational excellence. Perfect for global consulting, legal offices, and SaaS tools.",
  "Startup and SaaS": "Bright cyber-blues, purple highlights, and clean slate backdrops. Energetic, trustworthy, and modern. Designed for fast-moving technical teams and cloud products.",
  "E-commerce and Retail": "Warm oranges, inviting coral reds, and rich gold CTAs. Created specifically to drive conversion, evoke friendliness, and make checkout buttons highly visible.",
  "Pastel and Soft": "Desaturated, calming blush, lavender, and mint. Fosters relaxation, sleep, aromatherapy wellness, and friendly kids products.",
  "Vintage and Retro": "Earthy sepia tones, warm olive greens, and mustard yellows. Invokes high nostalgia, artisanal heritage, and organic premium craftsmanship.",
  "Earthy and Organic": "Leafy moss greens, clay terracottas, and deep bark browns. Great for wellness, biological farming, vegan cosmetic brands, and outdoor travel blogs.",
  "Dark Mode and Deep": "Deep graphite blacks and midnight blues contrasted with bright neon indicators. High-end look that is easy on the eyes during late hours.",
  "Bright and High Contrast": "Saturated, vibrant complimentary colors that pop instantly. Captures attention for youth festivals, public alerts, or modern creative agencies."
};

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allPalettes, setAllPalettes] = useState<Palette[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(32);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load datasets on mount
  useEffect(() => {
    setAllPalettes(getPalettes());

    // Load favorites
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, []);

  // Sync parameters from URL
  useEffect(() => {
    const search = searchParams.get("search");
    const family = searchParams.get("family");
    const category = searchParams.get("category");

    if (search) setSearchQuery(search);
    if (family && COLOR_FAMILIES.includes(family.toLowerCase())) {
      setSelectedFamily(family.toLowerCase());
    } else if (family === "all") {
      setSelectedFamily(null);
    }

    if (category) {
      const found = STYLE_CATEGORIES.find(c => c.toLowerCase() === category.toLowerCase());
      if (found) setSelectedCategory(found);
    } else if (category === "all") {
      setSelectedCategory(null);
    }
  }, [searchParams]);

  const handleFavoriteToggle = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  };

  // FILTERING LOGIC WITH FORGIVING WIDENING RULE
  const runFilter = (family: string | null, cat: string | null, query: string) => {
    return allPalettes.filter((p) => {
      // Query text search
      if (query) {
        const q = query.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        const matchesHex = p.colors.some(c => c.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags && !matchesHex) return false;
      }

      // Family matching
      if (family && !p.colorFamilies.includes(family)) return false;

      // Category matching
      if (cat && !p.tags.includes(cat)) return false;

      return true;
    });
  };

  let filtered = runFilter(selectedFamily, selectedCategory, searchQuery);
  let isForgivingWiden = false;

  // Apply forgiving rule if empty or extremely low results (< 4)
  if (filtered.length < 4 && (selectedFamily && selectedCategory)) {
    filtered = runFilter(selectedFamily, null, searchQuery);
    isForgivingWiden = true;

    if (filtered.length < 4) {
      filtered = runFilter(null, selectedCategory, searchQuery);
    }
  }

  // Backup fallback
  if (filtered.length === 0 && (selectedFamily || selectedCategory || searchQuery)) {
    filtered = allPalettes.slice(0, 48);
    isForgivingWiden = true;
  }

  const handleClear = () => {
    setSelectedFamily(null);
    setSelectedCategory(null);
    setSearchQuery("");
    setVisibleCount(32);
    router.push("/browse");
  };

  const handleFamilyChange = (fam: string | null) => {
    setSelectedFamily(fam);
    setVisibleCount(32);
    // Update URL param nicely
    const params = new URLSearchParams(searchParams.toString());
    if (fam) {
      params.set("family", fam);
    } else {
      params.delete("family");
    }
    router.push(`/browse?${params.toString()}`);
  };

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setVisibleCount(32);
    // Update URL param nicely
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    router.push(`/browse?${params.toString()}`);
  };

  // Find active description details
  const activeCategoryTip = selectedCategory ? (CATEGORY_TIPS[selectedCategory] || "Perfect color balance designed to boost digital readability and user retention.") : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Info */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">Unified Explorer</span>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {selectedCategory || selectedFamily ? (
              <>
                Browsing <span className="text-indigo-400">{selectedCategory || selectedFamily?.toUpperCase()}</span> Palettes
              </>
            ) : "All Design Palettes"}
          </h1>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            {activeCategoryTip || "Explore our comprehensive library of over one thousand fully-assigned color combinations. Each palette displays balanced primary, secondary, and accent colors conforming to sound aesthetic rules."}
          </p>
        </div>
      </div>

      {/* Two-Column Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar Filters */}
        <div className="space-y-6 lg:sticky lg:top-20 h-fit">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-5">

            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                Refine Library
              </span>
              {(selectedFamily || selectedCategory || searchQuery) && (
                <button
                  onClick={handleClear}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Keyword Search Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hex, name, tag..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(32); }}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Color Family Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Base Color Family</label>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => handleFamilyChange(null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedFamily === null
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  ALL COLOR FAMILIES
                </button>
                {COLOR_FAMILIES.map((fam) => (
                  <button
                    key={fam}
                    onClick={() => handleFamilyChange(fam)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedFamily === fam
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {fam.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Categories Selector */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Style & Mood</label>
              <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === null
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  ALL STYLE MOODS
                </button>
                {STYLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Content Catalog Grid */}
        <div className="lg:col-span-3 space-y-6">

          {/* Forgiving Widen Banner (Rule 2 + 3) */}
          {isForgivingWiden && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
              <Info className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-extrabold leading-none mb-1">Showing Closest Matches</p>
                <p className="text-xs text-amber-700 font-medium">
                  We couldn't find exact combinations for your filters. We've automatically relaxed parameters to make sure you have options to browse.
                </p>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.slice(0, visibleCount).map((p) => (
              <PaletteCard
                key={p.id}
                palette={p}
                isFavorited={favorites.includes(p.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount(prev => prev + 32)}
                className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-800 hover:bg-slate-50 shadow-xs transition-all hover:border-slate-400"
              >
                Load More Palettes
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function Browse() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading Browse Catalog...</span>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
