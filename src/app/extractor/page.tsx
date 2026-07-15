"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Copy, Check, Heart, HelpCircle, Sliders, Sparkles } from "lucide-react";
import { Palette } from "@/data/palettes";
import { rgbToHex, colorDistance } from "@/utils/color";

export default function ImageExtractorPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [exportFormat, setExportFormat] = useState<"hex" | "css" | "tailwind" | "ai">("hex");
  const [copiedText, setCopiedText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple Color Clustering Algorithm using Canvas
  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize for performance
        canvas.width = 100;
        canvas.height = 100;
        ctx.drawImage(img, 0, 0, 100, 100);

        // Get pixel data
        const imgData = ctx.getImageData(0, 0, 100, 100).data;
        const colorCounts: { [key: string]: number } = {};

        // Sample pixels
        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 128) continue; // Skip semi-transparent pixels

          // Format to standard hex
          const hex = rgbToHex(r, g, b);
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        // Sort by frequency
        const sortedColors = Object.keys(colorCounts).sort(
          (a, b) => colorCounts[b] - colorCounts[a]
        );

        // Filter out highly similar colors to ensure beautiful variety (minimum distance check)
        const uniqueColors: string[] = [];
        for (const col of sortedColors) {
          if (uniqueColors.length >= 7) break;
          const isSimilar = uniqueColors.some((existing) => colorDistance(existing, col) < 45);
          if (!isSimilar) {
            uniqueColors.push(col);
          }
        }

        // If we didn't get enough unique colors, relax constraint
        if (uniqueColors.length < 5) {
          for (const col of sortedColors) {
            if (uniqueColors.length >= 7) break;
            if (!uniqueColors.includes(col)) {
              uniqueColors.push(col);
            }
          }
        }

        setExtractedColors(uniqueColors);
        setIsSaved(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  const handleSaveToFavorites = () => {
    if (extractedColors.length > 0 && typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorites");
      let currentFavs = saved ? JSON.parse(saved) : [];

      const customId = `extracted-${Date.now()}`;

      const newPalette: Palette = {
        id: customId,
        name: "Extracted Mood Palette",
        colors: extractedColors.slice(0, 5),
        roles: {
          dominant: extractedColors[0],
          secondary: extractedColors[1] || extractedColors[0],
          accent: extractedColors[2] || extractedColors[0],
          text: "#111827",
          ui: extractedColors[3] || extractedColors[0]
        },
        tags: ["Extracted", "Custom"],
        colorFamilies: ["multicolor"],
        description: "Custom palette extracted programmatically from uploaded graphics asset.",
        views: 1,
        copies: 1,
        favorites: 1,
        isCustom: true
      };

      // Save custom palette block so it can be loaded in favorites list
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

  // EXPORTS
  const getPlainHexExport = () => {
    return `/* Extracted Image Palette */\n` +
      `Dominant: ${extractedColors[0]}\n` +
      `Secondary: ${extractedColors[1]}\n` +
      `Accent: ${extractedColors[2]}\n` +
      `UI Element: ${extractedColors[3]}\n\n` +
      `Full swatches: ${extractedColors.join(", ")}`;
  };

  const getCssExport = () => {
    return `:root {\n` +
      `  /* Extracted Image Palette */\n` +
      `  --color-dominant: ${extractedColors[0]};\n` +
      `  --color-secondary: ${extractedColors[1]};\n` +
      `  --color-accent: ${extractedColors[2]};\n` +
      `  --color-ui: ${extractedColors[3]};\n` +
      `}`;
  };

  const getTailwindExport = () => {
    return `// tailwind.config.js - Extracted Palette\n` +
      `module.exports = {\n` +
      `  theme: {\n` +
      `    extend: {\n` +
      `      colors: {\n` +
      `        extracted: {\n` +
      `          dominant: "${extractedColors[0]}",\n` +
      `          secondary: "${extractedColors[1]}",\n` +
      `          accent: "${extractedColors[2]}",\n` +
      `          ui: "${extractedColors[3]}",\n` +
      `        }\n` +
      `      }\n` +
      `    }\n` +
      `  }\n` +
      `}`;
  };

  const getAiAgentExport = () => {
    return `Apply a palette extracted from user graphic elements. Background (60%): ${extractedColors[0]}. Supporting boxes (30%): ${extractedColors[1]}. CTAs and icons (10%): ${extractedColors[2]}. Active borders: ${extractedColors[3]}. Ensure the text is highly readable.`;
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

      {/* Hero Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <ImageIcon className="w-8 h-8 text-indigo-600" />
          Image Color Extractor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Upload or drop any brand logo, screenshot, UI mock, or photo to extract the most significant dominant colors instantly. Fully exportable in 4 formats.
        </p>
      </div>

      {/* Main Extractor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Upload Slot / Image Preview */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Graphic Source Input</span>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/20 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-6 text-center group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imageSrc ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={imageSrc}
                  alt="Uploaded source file preview"
                  className="max-h-full max-w-full object-contain shadow-xs"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <span className="text-white text-xs font-bold bg-indigo-600 px-3.5 py-1.5 rounded-lg shadow-sm">Replace Image</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="p-3 bg-white border border-slate-200 rounded-xl w-fit mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Drag & Drop Image Here</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Or click to select file from computer</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Output Slot */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Extracted Palettes</span>
            {extractedColors.length > 0 && (
              <button
                onClick={handleSaveToFavorites}
                disabled={isSaved}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 ${
                  isSaved
                    ? "bg-rose-50 border-rose-100 text-rose-600"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved to Favorites!" : "Save Extracted Palette"}
              </button>
            )}
          </div>

          {extractedColors.length > 0 ? (
            <div className="space-y-6">

              {/* Grid of swatches */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                {extractedColors.map((color, idx) => {
                  const isCopied = copiedColor === color;
                  return (
                    <button
                      key={color + idx}
                      onClick={() => handleCopyColor(color)}
                      className="group/swatch rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-3xs text-left"
                    >
                      <div className="h-12 w-full" style={{ backgroundColor: color }} />
                      <div className="p-2 flex justify-between items-center bg-white">
                        <span className="text-[10px] font-mono font-bold text-slate-800">{color}</span>
                        {isCopied ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400 group-hover/swatch:text-indigo-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Exports */}
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
                      {format === "ai" ? "AI Instruction" : format.toUpperCase()}
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <ImageIcon className="w-12 h-12 stroke-1" />
              <p className="text-xs font-medium">No color extracted yet</p>
              <p className="text-[10px] text-slate-400">Please drag or upload an image in the left panel to begin.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
