"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getPalettes, Palette } from "@/data/palettes";
import PaletteCard from "@/components/PaletteCard";
import DesignPreview from "@/components/DesignPreview";
import {
  ArrowLeft,
  Copy,
  Check,
  Sliders,
  Sparkles,
  Heart,
  Laptop
} from "lucide-react";

export default function PaletteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params using React.use()
  const resolvedParams = React.use(params);

  const [palette, setPalette] = useState<Palette | null>(null);
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [similarPalettes, setSimilarPalettes] = useState<Palette[]>([]);

  // Sixty-Thirty-Ten Role State
  const [roles, setRoles] = useState({
    dominant: "",
    secondary: "",
    accent: "",
    text: "",
    ui: ""
  });

  // Export Format switch
  const [exportFormat, setExportFormat] = useState<"hex" | "css" | "tailwind" | "ai">("hex");

  useEffect(() => {
    const list = getPalettes();
    const found = list.find(p => p.id === resolvedParams.id);
    if (found) {
      setPalette(found);

      // Initialize active roles
      setRoles({
        dominant: found.roles?.dominant || found.colors[0],
        secondary: found.roles?.secondary || found.colors[1] || found.colors[0],
        accent: found.roles?.accent || found.colors[2] || found.colors[0],
        text: found.roles?.text || "#111827",
        ui: found.roles?.ui || found.colors[3] || found.colors[1] || found.colors[0]
      });

      // Set favorites status
      const saved = localStorage.getItem("hexatom_favorites");
      if (saved) {
        const favIds = JSON.parse(saved);
        setFavorite(favIds.includes(found.id));
      }

      // Find 4 similar or complementary palettes
      const similar = list
        .filter(p => p.id !== found.id && (
          p.colorFamilies.some(fam => found.colorFamilies.includes(fam)) ||
          p.tags.some(tag => found.tags.includes(tag))
        ))
        .slice(0, 4);
      setSimilarPalettes(similar);
    }
  }, [resolvedParams.id]);

  if (!palette) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading Palette Details...</span>
      </div>
    );
  }

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedState(label);
      setTimeout(() => setCopiedState(null), 2500);
    });
  };

  const handleFavoriteClick = () => {
    const nextVal = !favorite;
    setFavorite(nextVal);
    const saved = localStorage.getItem("hexatom_favorites");
    let currentFavs = saved ? JSON.parse(saved) : [];
    if (currentFavs.includes(palette.id)) {
      currentFavs = currentFavs.filter((id: string) => id !== palette.id);
    } else {
      currentFavs.push(palette.id);
    }
    localStorage.setItem("hexatom_favorites", JSON.stringify(currentFavs));
  };

  // Reassign roles handler
  const handleRoleChange = (roleKey: "dominant" | "secondary" | "accent" | "text" | "ui", value: string) => {
    setRoles(prev => ({
      ...prev,
      [roleKey]: value
    }));
  };

  // EXPORT BUILDERS
  const getPlainHexExport = () => {
    return `/* HEXATOM Color Palette: ${palette.name} */\n` +
      `Dominant (60%): ${roles.dominant}\n` +
      `Secondary (30%): ${roles.secondary}\n` +
      `Accent (10%): ${roles.accent}\n` +
      `Text: ${roles.text}\n` +
      `UI/Border/Link: ${roles.ui}\n\n` +
      `Full swatches: ${palette.colors.join(", ")}`;
  };

  const getCssExport = () => {
    return `:root {\n` +
      `  /* HEXATOM Color Palette: ${palette.name} */\n` +
      `  --color-dominant: ${roles.dominant}; /* 60% */\n` +
      `  --color-secondary: ${roles.secondary}; /* 30% */\n` +
      `  --color-accent: ${roles.accent}; /* 10% */\n` +
      `  --color-text: ${roles.text};\n` +
      `  --color-ui: ${roles.ui};\n` +
      `}`;
  };

  const getTailwindExport = () => {
    return `// tailwind.config.js config tokens for palette: ${palette.name}\n` +
      `module.exports = {\n` +
      `  theme: {\n` +
      `    extend: {\n` +
      `      colors: {\n` +
      `        brand: {\n` +
      `          dominant: "${roles.dominant}", // 60% background\n` +
      `          secondary: "${roles.secondary}", // 30% elements\n` +
      `          accent: "${roles.accent}", // 10% high-lights\n` +
      `          text: "${roles.text}",\n` +
      `          ui: "${roles.ui}",\n` +
      `        }\n` +
      `      }\n` +
      `    }\n` +
      `  }\n` +
      `}`;
  };

  const getAiAgentExport = () => {
    return `Apply a highly-polished, balanced visual theme called "${palette.name}". ` +
      `Use the sixty-thirty-ten ratio rule to assign colors dynamically: ` +
      `1. Make ${roles.dominant} the dominant color (60%), serving as the primary page background to keep layouts clean and calm. ` +
      `2. Make ${roles.secondary} the supporting secondary color (30%), playing roles like navigation bar backgrounds, card cards, and secondary boxes. ` +
      `3. Make ${roles.accent} the sharp accent color (10%), restricted exclusively to high-contrast elements such as call-to-action buttons, icons, or critical labels. ` +
      `4. Set the dominant page text to ${roles.text} to secure outstanding contrast and accessibility. ` +
      `5. Render decorative borders, borders, and custom buttons with the UI/Link color ${roles.ui}. ` +
      `Design the site mobile-first with generous white space and beautiful typography borders.`;
  };

  const getActiveExportText = () => {
    switch (exportFormat) {
      case "hex": return getPlainHexExport();
      case "css": return getCssExport();
      case "tailwind": return getTailwindExport();
      case "ai": return getAiAgentExport();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Back button */}
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Palette Catalog
        </Link>

        <button
          onClick={handleFavoriteClick}
          className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
            favorite
              ? "bg-rose-500 border-rose-500 text-white shadow-xs"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favorite ? "fill-current" : ""}`} />
          {favorite ? "Favorited" : "Save to Favorites"}
        </button>
      </div>

      {/* Main Grid: Info + Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Swatches & Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{palette.name}</h1>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {palette.tags.map(t => (
                  <span key={t} className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                    {t}
                  </span>
                ))}
                {palette.colorFamilies.map(fam => (
                  <span key={fam} className="text-[11px] font-extrabold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full uppercase">
                    {fam}
                  </span>
                ))}
              </div>
            </div>

            {/* Large Tappable Swatches */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Click Swatch to Copy HEX</span>
              <div className="grid grid-cols-1 gap-2">
                {palette.colors.map((color, idx) => {
                  const isCopied = copiedState === color;
                  return (
                    <button
                      key={color + idx}
                      onClick={() => triggerCopy(color, color)}
                      className="w-full h-16 rounded-xl flex items-center justify-between px-4 transition-all duration-200 hover:-translate-y-0.5 shadow-2xs relative text-left cursor-pointer"
                      style={{ backgroundColor: color }}
                    >
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-sm backdrop-blur-md shadow-3xs ${
                        color.toLowerCase() === "#ffffff" || color.toLowerCase() === "#fdfbf7" || color.toLowerCase() === "#f8fafc"
                          ? "bg-slate-950/10 text-slate-900"
                          : "bg-white/20 text-white"
                      }`}>
                        {color}
                      </span>
                      <div className={`p-1.5 rounded-lg backdrop-blur-md ${
                        color.toLowerCase() === "#ffffff" || color.toLowerCase() === "#fdfbf7" || color.toLowerCase() === "#f8fafc"
                          ? "bg-slate-950/10 text-slate-900"
                          : "bg-white/20 text-white"
                      }`}>
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description & Color Psychology */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-widest block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Color Intelligence Context
              </span>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {palette.description}
              </p>
            </div>
          </div>

          {/* New Interactive Design Preview section beneath swatch grid */}
          <DesignPreview palette={palette} customRoles={roles} />
        </div>

        {/* Builder & Wireframe Preview Right Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-6">

            {/* Sixty Thirty Ten Assignment Controls */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-slate-800" />
                  60-30-10 Rule Assignment
                </h2>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">
                  Customize Layout Roles
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Reassign which hex color handles which role. The changes will update the wireframe live!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

                {/* Dominant */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Dominant (60%)</span>
                  <select
                    value={roles.dominant}
                    onChange={(e) => handleRoleChange("dominant", e.target.value)}
                    className="w-full text-xs font-mono font-bold py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    {palette.colors.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Secondary */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Secondary (30%)</span>
                  <select
                    value={roles.secondary}
                    onChange={(e) => handleRoleChange("secondary", e.target.value)}
                    className="w-full text-xs font-mono font-bold py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    {palette.colors.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Accent */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Accent (10%)</span>
                  <select
                    value={roles.accent}
                    onChange={(e) => handleRoleChange("accent", e.target.value)}
                    className="w-full text-xs font-mono font-bold py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    {palette.colors.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Text */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Text Color</span>
                  <select
                    value={roles.text}
                    onChange={(e) => handleRoleChange("text", e.target.value)}
                    className="w-full text-xs font-mono font-bold py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="#111827">Slate Dark</option>
                    <option value="#F9FAFB">Slate Light</option>
                    {palette.colors.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* UI/Link */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">UI / Border</span>
                  <select
                    value={roles.ui}
                    onChange={(e) => handleRoleChange("ui", e.target.value)}
                    className="w-full text-xs font-mono font-bold py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    {palette.colors.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* LIVE WIREFRAME PREVIEW */}
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Laptop className="w-4 h-4 text-slate-600" />
                Live Dynamic Layout Wireframe
              </span>

              <div
                className="w-full rounded-2xl p-6 border border-slate-200 transition-all duration-300"
                style={{ backgroundColor: roles.dominant, color: roles.text }}
              >
                {/* Navbar mock */}
                <div
                  className="flex justify-between items-center px-4 py-2.5 rounded-lg border text-xs font-bold shadow-3xs"
                  style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: roles.accent }}>
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    </span>
                    <span>WIRE LOGO</span>
                  </div>
                  <div className="flex gap-3 text-[10px]">
                    <span>Features</span>
                    <span>SaaS App</span>
                    <span>Contact</span>
                  </div>
                </div>

                {/* Hero section mock */}
                <div className="py-12 px-2 text-center space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    Translate Color Strategy <br />
                    Into <span style={{ color: roles.accent }}>Real Conversion</span>
                  </h3>
                  <p className="text-xs opacity-80 max-w-md mx-auto leading-relaxed">
                    This live preview demonstrates how the assigned 60% dominant background matches with the 30% supporting modules and the 10% accent focus button.
                  </p>

                  <div className="pt-2 flex justify-center gap-3">
                    {/* Primary Button */}
                    <button
                      className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-transform active:scale-95 shadow-xs"
                      style={{ backgroundColor: roles.accent }}
                    >
                      Primary Action (10%)
                    </button>
                    {/* Secondary Button */}
                    <button
                      className="px-5 py-2.5 rounded-xl text-xs font-bold border transition-colors bg-white/10"
                      style={{ borderColor: roles.ui }}
                    >
                      Secondary
                    </button>
                  </div>
                </div>

                {/* Sub features mockup card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-xl border text-left shadow-3xs"
                    style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                  >
                    <span className="w-6 h-6 rounded-md flex items-center justify-center mb-2" style={{ backgroundColor: roles.accent, color: "#fff" }}>
                      <Check className="w-3.5 h-3.5 text-white" />
                    </span>
                    <h4 className="font-extrabold text-xs">Modern SaaS Widget</h4>
                    <p className="text-[10px] opacity-70 mt-1">Rendered beautifully using secondary containers to separate segments clearly.</p>
                  </div>

                  <div
                    className="p-4 rounded-xl border text-left shadow-3xs"
                    style={{ backgroundColor: roles.secondary, borderColor: roles.ui }}
                  >
                    <span className="w-6 h-6 rounded-md flex items-center justify-center mb-2" style={{ backgroundColor: roles.accent, color: "#fff" }}>
                      <Sparkles className="w-3.5 h-3.5 text-white fill-current" />
                    </span>
                    <h4 className="font-extrabold text-xs">High-Contrast Highlights</h4>
                    <p className="text-[10px] opacity-70 mt-1">Using accents selectively avoids decision fatigue and guides clients smoothly.</p>
                  </div>
                </div>

                {/* Footer mock */}
                <div
                  className="mt-6 pt-4 border-t text-center text-[10px] opacity-60 flex justify-between"
                  style={{ borderTopColor: roles.ui }}
                >
                  <span>© HEXATOM CREATIVE LABS</span>
                  <span>PREVIEW WIREFRAME MODE</span>
                </div>

              </div>
            </div>

            {/* EXPORT OPTIONS */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Copy & Export Settings</span>

              {/* Toggles */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setExportFormat("hex")}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                    exportFormat === "hex" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Hex List
                </button>
                <button
                  onClick={() => setExportFormat("css")}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                    exportFormat === "css" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  CSS Vars
                </button>
                <button
                  onClick={() => setExportFormat("tailwind")}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                    exportFormat === "tailwind" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Tailwind
                </button>
                <button
                  onClick={() => setExportFormat("ai")}
                  className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-all ${
                    exportFormat === "ai" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  AI Agent Prompt
                </button>
              </div>

              {/* Codebox display */}
              <div className="relative">
                <textarea
                  readOnly
                  value={getActiveExportText()}
                  className="w-full h-36 p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-900 focus:outline-hidden resize-none leading-relaxed"
                />
                <button
                  onClick={() => triggerCopy(getActiveExportText(), "export")}
                  className="absolute right-3 top-3 px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-700 transition-colors rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedState === "export" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* COMPLEMENTARY SIMILAR PALETTES ROW */}
      {similarPalettes.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Similar & Complementary Palettes</h2>
            <p className="text-xs text-slate-500">Explore alternative shades matching similar psychological and layout vibes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarPalettes.map((p) => (
              <PaletteCard
                key={p.id}
                palette={p}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
