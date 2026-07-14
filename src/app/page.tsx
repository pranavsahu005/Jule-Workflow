"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getPalettes,
  Palette,
  STYLE_CATEGORIES,
  COLOR_FAMILIES,
  COLOR_OF_THE_DAY_ID,
  EDITORS_CHOICE_ID
} from "@/data/palettes";
import PaletteCard from "@/components/PaletteCard";
import {
  Sparkles,
  Award,
  Flame,
  RefreshCw,
  Search as SearchIcon,
  X,
  SlidersHorizontal,
  ChevronRight,
  Info
} from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load all palettes initially
  const [allPalettes, setAllPalettes] = useState<Palette[]>([]);

  // Active Filter States
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(32);

  // Favorites Cache
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load state on mount
  useEffect(() => {
    setAllPalettes(getPalettes());

    // Load favorites from local storage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  }, []);

  // Update from URL search query if exists
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    const urlFamily = searchParams.get("family");
    if (urlFamily && COLOR_FAMILIES.includes(urlFamily.toLowerCase())) {
      setSelectedFamily(urlFamily.toLowerCase());
    }
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      const matchedCat = STYLE_CATEGORIES.find(c => c.toLowerCase() === urlCategory.toLowerCase());
      if (matchedCat) {
        setSelectedCategory(matchedCat);
      }
    }
  }, [searchParams]);

  // Sync favorites toggles
  const handleFavoriteToggle = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    }
  };

  // Find featured items
  const colorOfTheDay = allPalettes.find(p => p.id === COLOR_OF_THE_DAY_ID) || allPalettes[7];
  const editorsChoice = allPalettes.find(p => p.id === EDITORS_CHOICE_ID) || allPalettes[0];
  const trendingPalettes = allPalettes.filter(p => p.tags.includes("Trending")).slice(0, 6);

  // FILTERS MATCHING & FORGIVING LOGIC (Rule 2 + 3)
  // ----------------------------------------------------
  let filteredPalettes: Palette[] = [];
  let isForgivingWiden = false;
  let matchesIntersection = true;

  // Let's perform full-text search and filtering
  const runFilter = (family: string | null, cat: string | null, search: string) => {
    return allPalettes.filter((p) => {
      // 1. Text Search matching
      if (search) {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(query));
        const matchesFam = p.colorFamilies.some(f => f.toLowerCase().includes(query));
        const matchesHex = p.colors.some(c => c.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags && !matchesFam && !matchesHex) {
          return false;
        }
      }

      // 2. Family matching
      if (family) {
        if (!p.colorFamilies.includes(family)) return false;
      }

      // 3. Category matching
      if (cat) {
        if (!p.tags.includes(cat)) return false;
      }

      return true;
    });
  };

  // Try exact intersection first
  filteredPalettes = runFilter(selectedFamily, selectedCategory, searchQuery);

  // Apply forgiving relaxed rules if results are too narrow (< 4 results) and we have multiple filters active
  if (filteredPalettes.length < 4 && (selectedFamily && selectedCategory)) {
    // Relax the category filter first, keep the color family and search query
    filteredPalettes = runFilter(selectedFamily, null, searchQuery);
    isForgivingWiden = true;
    matchesIntersection = false;

    // If still extremely low, relax color family instead, keep category
    if (filteredPalettes.length < 4) {
      filteredPalettes = runFilter(null, selectedCategory, searchQuery);
    }
  }

  // If even that produces nothing, show some default palettes instead of an empty screen
  if (filteredPalettes.length === 0 && (selectedFamily || selectedCategory || searchQuery)) {
    // Provide a full backup selection so they never see an empty grid
    filteredPalettes = allPalettes.slice(0, 48);
    isForgivingWiden = true;
    matchesIntersection = false;
  }

  const handleClearFilters = () => {
    setSelectedFamily(null);
    setSelectedCategory(null);
    setSearchQuery("");
    setVisibleCount(32);
    // Clear URL params
    router.push("/");
  };

  const handleFamilyClick = (fam: string) => {
    setSelectedFamily(selectedFamily === fam ? null : fam);
    setVisibleCount(32);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(selectedCategory === cat ? null : cat);
    setVisibleCount(32);
  };

  const displayedPalettes = filteredPalettes.slice(0, visibleCount);

  // Define horizontal mosaic colors representing platform's full range
  const mosaicColors = [
    "#FDFBF7", "#D4AF37", "#1A1A1A", "#9B111E", "#D2B48C", "#4B0082", "#E6E6FA", "#008080",
    "#39FF14", "#FFD1DC", "#FF5F1F", "#0B1026", "#0D0E15", "#22C55E", "#F97316", "#050B05",
    "#1E40AF", "#F59E0B", "#F43F5E", "#C2410C", "#15803D", "#3730A3", "#FAF5FF", "#E0F2FE",
    "#00E5FF", "#FF1493", "#EAB308", "#A5B4FC", "#C0C0C0", "#0369A1", "#FACC15", "#111827",
    "#C2410C", "#D9F99D", "#FAF9F6", "#EA580C", "#FAF5FF", "#E9D5FF", "#F472B6", "#2DD4BF"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* Horizontal Mosaic Brand Showcase Band */}
      <div className="w-full overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl p-2.5 relative flex flex-col gap-1 shadow-3xs">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center mb-1 leading-none">
          Live Mosaic Spectrum Showcase
        </span>
        <div className="flex gap-1 overflow-x-hidden select-none w-full justify-center">
          <div className="flex gap-1 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {mosaicColors.concat(mosaicColors).map((color, idx) => (
              <div
                key={color + idx}
                style={{ backgroundColor: color }}
                className="w-4 h-4 rounded-xs shrink-0 transition-all duration-500 hover:scale-125"
                title={color}
              />
            ))}
          </div>
        </div>

        {/* CSS Keyframes for infinite mosaic marquee */}
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* Hero Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Find Your Perfect Palette, <br />
          <span className="text-indigo-600">Copied in Seconds.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 font-medium">
          No complicated step-by-step quizzes. Browse 1,000+ curated, color-theoretic palettes ready to use. Filter by color family or style category instantly.
        </p>

        {/* Home Page Entry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100 p-5 rounded-2xl text-left flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Entry Point A</span>
              <h3 className="font-extrabold text-slate-900 text-lg">Start with a Style Category</h3>
              <p className="text-xs text-slate-600 mt-1">Browse luxury, neon cyberpunk, SaaS, dark mode, vintage, minimal and more.</p>
            </div>
            <button
              onClick={() => { setSelectedCategory("Luxury"); setSelectedFamily(null); }}
              className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900"
            >
              Explore Luxury Moods <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 p-5 rounded-2xl text-left flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Entry Point B</span>
              <h3 className="font-extrabold text-slate-900 text-lg">Start with a Base Color</h3>
              <p className="text-xs text-slate-600 mt-1">Select from blue, green, teal, purple, red, gray, yellow, gold or monochrome.</p>
            </div>
            <button
              onClick={() => { setSelectedFamily("blue"); setSelectedCategory(null); }}
              className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              Explore Royal Blues <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* featured section slots: Color of the Day & Editor Choice */}
      {(!selectedFamily && !selectedCategory && !searchQuery) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">

          {/* Color of the Day */}
          {colorOfTheDay && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                    <Sparkles className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block leading-none">Featured Slot</span>
                    <span className="text-sm font-bold text-slate-900">Color of the Day</span>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {colorOfTheDay.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {colorOfTheDay.description}
                </p>

                {/* Swatches preview */}
                <div className="flex h-12 rounded-lg overflow-hidden border border-slate-100">
                  {colorOfTheDay.colors.map((color, i) => (
                    <div
                      key={color + i}
                      style={{ backgroundColor: color }}
                      className="flex-1 h-full"
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400 font-medium">Currently trending in fintech branding</span>
                <Link
                  href={`/palette/${colorOfTheDay.id}`}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  Apply & Export
                </Link>
              </div>
            </div>
          )}

          {/* Editor Choice */}
          {editorsChoice && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block leading-none">Curated Picks</span>
                    <span className="text-sm font-bold text-slate-900">Editor Choice</span>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {editorsChoice.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {editorsChoice.description}
                </p>

                {/* Swatches preview */}
                <div className="flex h-12 rounded-lg overflow-hidden border border-slate-100">
                  {editorsChoice.colors.map((color, i) => (
                    <div
                      key={color + i}
                      style={{ backgroundColor: color }}
                      className="flex-1 h-full"
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400 font-medium">Exceptional balance and contrast</span>
                <Link
                  href={`/palette/${editorsChoice.id}`}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  Apply & Export
                </Link>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Swipeable Trending Palettes Row */}
      {(!selectedFamily && !selectedCategory && !searchQuery) && trendingPalettes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500 fill-current" />
            <h2 className="text-lg font-extrabold text-slate-900 uppercase tracking-wider">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingPalettes.map((palette) => (
              <Link
                key={palette.id}
                href={`/palette/${palette.id}`}
                className="group bg-white rounded-xl border border-slate-200 p-3 hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-8 rounded-md overflow-hidden mb-2">
                    {palette.colors.map((color, idx) => (
                      <div
                        key={color + idx}
                        style={{ backgroundColor: color }}
                        className="flex-grow h-full"
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                    {palette.name}
                  </h4>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {palette.tags.slice(0, 1).map(tag => (
                    <span key={tag} className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FILTER SYSTEM & DENSE CATALOG GRID */}
      <div className="space-y-6 pt-6 border-t border-slate-200">

        {/* Navigation & Controls header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-slate-800" />
              Explore Color Palettes
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Showing {filteredPalettes.length} palettes. Always active, always responsive.
            </p>
          </div>

          {/* Inline search box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search palettes (e.g. #9B111E, SaaS, Blue)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(32); }}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setVisibleCount(32); }}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Chip Groups */}
        <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">

          {/* Color Family filter chips */}
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Filter by Color Family</span>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_FAMILIES.map((fam) => {
                const active = selectedFamily === fam;
                return (
                  <button
                    key={fam}
                    onClick={() => handleFamilyClick(fam)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      active
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {fam.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Category filter chips */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Filter by Style Mood</span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {STYLE_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Badges with single Clear action */}
          {(selectedFamily || selectedCategory || searchQuery) && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 mt-1 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Active filters:</span>
                {selectedFamily && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-bold">
                    Family: {selectedFamily.toUpperCase()}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedFamily(null)} />
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-bold">
                    Mood: {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-bold">
                    Search: "{searchQuery}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </span>
                )}
              </div>

              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Forgiving Widen Banner Notification (Rule 2 + 3) */}
        {isForgivingWiden && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
            <Info className="w-5 h-5 flex-shrink-0 text-amber-600" />
            <div>
              <p className="font-extrabold leading-none mb-1">Showing Closest Matches</p>
              <p className="text-xs text-amber-700 font-medium">
                We couldn't find exact combinations for your filters. We've widened the search parameters to make sure you never land on an empty screen.
              </p>
            </div>
          </div>
        )}

        {/* Continuous Dense Grid of Palettes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedPalettes.map((palette) => (
            <PaletteCard
              key={palette.id}
              palette={palette}
              isFavorited={favorites.includes(palette.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>

        {/* Load More Pagination Button */}
        {visibleCount < filteredPalettes.length && (
          <div className="text-center pt-8">
            <button
              onClick={() => setVisibleCount(prev => prev + 32)}
              className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-800 hover:bg-slate-50 shadow-xs transition-all hover:border-slate-400 cursor-pointer"
            >
              Load More Palettes
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// Ensure Suspense is used as requested to avoid compile-time issues with build parameters
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading Color Intelligence Catalog...</span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
