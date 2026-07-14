"use client";

import React, { useState, useEffect } from "react";
import {
  STYLE_CATEGORIES,
  COLOR_FAMILIES,
  Palette
} from "@/data/palettes";
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Heart,
  Sliders,
  Settings,
  HelpCircle
} from "lucide-react";

// Color calculation helpers
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, "0");
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, "0");
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

export default function GeneratorPage() {
  const [activeTab, setActiveTab] = useState<"assisted" | "random">("assisted");
  const [anchorColor, setAnchorColor] = useState("#4F46E5");
  const [colorTheory, setColorTheory] = useState<"analogous" | "monochromatic" | "complementary" | "triadic">("complementary");
  const [selectedMood, setSelectedMood] = useState("SaaS");

  // Generated state
  const [generatedColors, setGeneratedColors] = useState<string[]>([]);
  const [generatedName, setGeneratedName] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copiedText, setCopiedText] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Export format toggle
  const [exportFormat, setExportFormat] = useState<"hex" | "css" | "tailwind" | "ai">("hex");

  // Run generator
  const triggerGenerate = () => {
    setIsSaved(false);
    const id = `generated-${Date.now()}`;
    setGeneratedId(id);

    if (activeTab === "random") {
      // Create fully random seed color
      const randomHue = Math.floor(Math.random() * 360);
      const randomSat = Math.floor(Math.random() * 40) + 50; // 50-90
      const randomLight = Math.floor(Math.random() * 30) + 40; // 40-70
      const randomAnchor = hslToHex(randomHue, randomSat, randomLight);

      const randomTheories: Array<"analogous" | "monochromatic" | "complementary" | "triadic"> = [
        "analogous", "monochromatic", "complementary", "triadic"
      ];
      const selectedTheory = randomTheories[Math.floor(Math.random() * randomTheories.length)];

      const randomMoods = ["Cyberpunk", "Luxury", "Minimal", "Corporate", "Healthcare", "Food", "Retro"];
      const mood = randomMoods[Math.floor(Math.random() * randomMoods.length)];

      const colors = buildPaletteColors(randomAnchor, selectedTheory);
      setGeneratedColors(colors);
      setGeneratedName(`${mood} ${selectedTheory.toUpperCase()} Bloom`);
    } else {
      // Assisted Mode
      const colors = buildPaletteColors(anchorColor, colorTheory);
      setGeneratedColors(colors);
      setGeneratedName(`${selectedMood} ${colorTheory.charAt(0).toUpperCase() + colorTheory.slice(1)} Harmony`);
    }
  };

  const buildPaletteColors = (anchor: string, theory: string) => {
    const { h, s, l } = hexToHsl(anchor);
    const colors: string[] = [anchor];

    switch (theory) {
      case "monochromatic":
        colors.push(hslToHex(h, Math.max(10, s - 20), Math.min(95, l + 25)));
        colors.push(hslToHex(h, Math.max(10, s - 30), Math.max(10, l - 20)));
        colors.push(hslToHex(h, Math.min(100, s + 10), Math.min(98, l + 40)));
        colors.push(hslToHex(h, s, Math.max(5, l - 35)));
        break;
      case "analogous":
        colors.push(hslToHex((h + 30) % 360, s, l));
        colors.push(hslToHex((h - 30 + 360) % 360, s, l));
        colors.push(hslToHex((h + 15) % 360, Math.max(10, s - 15), Math.min(95, l + 20)));
        colors.push(hslToHex((h - 15 + 360) % 360, Math.max(10, s - 15), Math.max(10, l - 20)));
        break;
      case "complementary":
        colors.push(hslToHex((h + 180) % 360, s, l));
        colors.push(hslToHex(h, Math.max(10, s - 25), Math.min(90, l + 20)));
        colors.push(hslToHex((h + 180) % 360, Math.max(10, s - 25), Math.max(10, l - 20)));
        colors.push(hslToHex((h + 30) % 360, s, l));
        break;
      case "triadic":
        colors.push(hslToHex((h + 120) % 360, s, l));
        colors.push(hslToHex((h + 240) % 360, s, l));
        colors.push(hslToHex(h, Math.max(10, s - 20), Math.min(95, l + 25)));
        colors.push(hslToHex((h + 120) % 360, Math.max(10, s - 20), Math.max(10, l - 20)));
        break;
    }
    return colors;
  };

  // Generate on mount or activeTab switch
  useEffect(() => {
    triggerGenerate();
  }, [activeTab]);

  const handleFavoriteClick = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorites");
      let currentFavs = saved ? JSON.parse(saved) : [];

      const newPalette: Palette = {
        id: generatedId,
        name: generatedName,
        colors: generatedColors,
        roles: {
          dominant: generatedColors[0],
          secondary: generatedColors[1] || generatedColors[0],
          accent: generatedColors[2] || generatedColors[0],
          text: "#111827",
          ui: generatedColors[3] || generatedColors[0]
        },
        tags: [selectedMood, "Generated"],
        colorFamilies: ["multicolor"],
        description: `Custom color-theoretic generated harmony. Anchor color: ${anchorColor}.`,
        views: 1,
        copies: 1,
        favorites: 1,
        isCustom: true
      };

      // Save custom palette block so it can be loaded on Favorites list
      const savedCustom = localStorage.getItem("hexatom_custom_palettes");
      let customList: Palette[] = savedCustom ? JSON.parse(savedCustom) : [];
      customList.push(newPalette);
      localStorage.setItem("hexatom_custom_palettes", JSON.stringify(customList));

      // Mark as favorited
      currentFavs.push(newPalette.id);
      localStorage.setItem("hexatom_favorites", JSON.stringify(currentFavs));

      setIsSaved(true);
    }
  };

  // Build active export codes
  const getPlainHexExport = () => {
    return `/* Custom Generated Palette: ${generatedName} */\n` +
      `Dominant (60%): ${generatedColors[0]}\n` +
      `Secondary (30%): ${generatedColors[1]}\n` +
      `Accent (10%): ${generatedColors[2]}\n` +
      `UI: ${generatedColors[3]}\n\n` +
      `Hex values: ${generatedColors.join(", ")}`;
  };

  const getCssExport = () => {
    return `:root {\n` +
      `  /* Generated Palette: ${generatedName} */\n` +
      `  --color-dominant: ${generatedColors[0]};\n` +
      `  --color-secondary: ${generatedColors[1]};\n` +
      `  --color-accent: ${generatedColors[2]};\n` +
      `  --color-ui: ${generatedColors[3]};\n` +
      `}`;
  };

  const getTailwindExport = () => {
    return `// tailwind.config.js for: ${generatedName}\n` +
      `module.exports = {\n` +
      `  theme: {\n` +
      `    extend: {\n` +
      `      colors: {\n` +
      `        custom: {\n` +
      `          dominant: "${generatedColors[0]}",\n` +
      `          secondary: "${generatedColors[1]}",\n` +
      `          accent: "${generatedColors[2]}",\n` +
      `          ui: "${generatedColors[3]}",\n` +
      `        }\n` +
      `      }\n` +
      `    }\n` +
      `  }\n` +
      `}`;
  };

  const getAiAgentExport = () => {
    return `Apply a generated theme named "${generatedName}". Use ${generatedColors[0]} for page backgrounds (60%), ${generatedColors[1]} for cards and headers (30%), and ${generatedColors[2]} for CTA button highlights (10%). Keep borders and icons colored with ${generatedColors[3]}. Ensure the text is dark slate with excellent readability.`;
  };

  const getActiveExportText = () => {
    switch (exportFormat) {
      case "hex": return getPlainHexExport();
      case "css": return getCssExport();
      case "tailwind": return getTailwindExport();
      case "ai": return getAiAgentExport();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveExportText()).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-indigo-600 fill-current" />
          Combination Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Stuck on inspiration? Produce harmonious mathematical combinations in seconds. Anchor around specific feelings or get full random seeds instantly.
        </p>
      </div>

      {/* Tabs */}
      <div className="max-w-md mx-auto flex bg-slate-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab("assisted")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
            activeTab === "assisted" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Assisted Color-Theory Mode
        </button>
        <button
          onClick={() => setActiveTab("random")}
          className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all ${
            activeTab === "random" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          Fully Random Mode
        </button>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-5">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-slate-700" />
            Generator Knobs
          </span>

          {activeTab === "assisted" && (
            <div className="space-y-4">
              {/* Anchor Color Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Anchor Seed Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={anchorColor}
                    onChange={(e) => setAnchorColor(e.target.value)}
                    className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={anchorColor.toUpperCase()}
                    onChange={(e) => setAnchorColor(e.target.value)}
                    placeholder="#4F46E5"
                    className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>
              </div>

              {/* Color Theory Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Color-Theory Law</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "complementary", label: "Complementary" },
                    { id: "analogous", label: "Analogous" },
                    { id: "monochromatic", label: "Monochromatic" },
                    { id: "triadic", label: "Triadic" }
                  ].map((theory) => (
                    <button
                      key={theory.id}
                      onClick={() => setColorTheory(theory.id as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                        colorTheory === theory.id
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {theory.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tagging / Mood */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">Target Mood / Category</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {STYLE_CATEGORIES.slice(0, 15).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "random" && (
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Random Exploration Mode</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Produces fully-fledged custom palettes built around a random hue using standard harmonizers. Every click generates something entirely unique!
              </p>
            </div>
          )}

          <button
            onClick={triggerGenerate}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-extrabold hover:bg-indigo-700 shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Generate New Combination
          </button>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-6">

          {/* Result card header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Generated Output</span>
              <h3 className="font-extrabold text-slate-900 text-lg">{generatedName}</h3>
            </div>

            <button
              onClick={handleFavoriteClick}
              disabled={isSaved}
              className={`px-4 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSaved
                  ? "bg-rose-50 border-rose-100 text-rose-600"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved to Favorites" : "Save Result"}
            </button>
          </div>

          {/* Large Color Strip block */}
          <div className="flex h-24 rounded-2xl overflow-hidden shadow-2xs border border-slate-100">
            {generatedColors.map((color, idx) => (
              <div
                key={color + idx}
                style={{ backgroundColor: color }}
                className="flex-1 h-full flex flex-col items-center justify-end pb-3 text-center transition-all group hover:flex-[1.5] relative cursor-pointer"
                onClick={() => navigator.clipboard.writeText(color)}
                title={`Copy ${color}`}
              >
                <span className="text-[9px] font-mono font-bold bg-slate-950/70 text-white px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  {color}
                </span>
              </div>
            ))}
          </div>

          {/* Export Toggles & Output display */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Export Code Blocks</span>

            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
              {["hex", "css", "tailwind", "ai"].map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format as any)}
                  className={`flex-1 py-1 text-center text-xs font-bold rounded-lg transition-all ${
                    exportFormat === format ? "bg-white text-slate-900 shadow-3xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {format.toUpperCase() === "AI" ? "AI Instruction" : format.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                readOnly
                value={getActiveExportText()}
                className="w-full h-32 p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-900 focus:outline-hidden resize-none"
              />
              <button
                onClick={handleCopyCode}
                className="absolute right-3 top-3 px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-700 transition-colors rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedText ? (
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
  );
}
