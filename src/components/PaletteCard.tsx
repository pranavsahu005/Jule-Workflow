"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Check, Heart, Eye, Layout, X } from "lucide-react";
import { Palette } from "@/data/palettes";
import DesignPreview from "./DesignPreview";

interface PaletteCardProps {
  palette: Palette;
  onFavoriteToggle?: () => void;
  isFavorited?: boolean;
}

export default function PaletteCard({ palette, onFavoriteToggle, isFavorited = false }: PaletteCardProps) {
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(isFavorited);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Sync state with prop updates safely without triggering sync effect errors
  React.useMemo(() => {
    setFavorite(isFavorited);
  }, [isFavorited]);

  const handleCopyHexList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const hexList = palette.colors.join(", ");
    navigator.clipboard.writeText(hexList).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextVal = !favorite;
    setFavorite(nextVal);

    // Save to local storage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("hexatom_favorites");
      let currentFavs: string[] = saved ? JSON.parse(saved) : [];
      if (currentFavs.includes(palette.id)) {
        currentFavs = currentFavs.filter(id => id !== palette.id);
      } else {
        currentFavs.push(palette.id);
      }
      localStorage.setItem("hexatom_favorites", JSON.stringify(currentFavs));
    }

    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full hover:-translate-y-0.5">

      {/* Palette Colors Grid */}
      <Link href={`/palette/${palette.id}`} className="block relative aspect-video w-full overflow-hidden">
        <div className="flex h-full w-full">
          {palette.colors.map((color, i) => (
            <div
              key={color + i}
              style={{ backgroundColor: color }}
              className="h-full flex-grow relative group/swatch transition-all duration-200 hover:flex-grow-[1.5]"
              title={color}
            >
              {/* Tooltip on hover showing hex value */}
              <div className="absolute inset-x-0 bottom-2 text-center opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-150">
                <span className="bg-slate-950/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-sm shadow-xs select-all">
                  {color}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating action buttons on card */}
        <div className="absolute top-2.5 right-2.5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPreviewModal(true);
            }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-white hover:text-indigo-600 shadow-xs transition-colors"
            title="Design Preview Mockup"
          >
            <Layout className="w-4 h-4" />
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full backdrop-blur-xs shadow-xs transition-colors ${
              favorite
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600"
            }`}
            title={favorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleCopyHexList}
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:bg-white hover:text-indigo-600 shadow-xs transition-colors"
            title="Copy Hex List"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </Link>

      {/* Palette Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <Link href={`/palette/${palette.id}`} className="hover:text-indigo-600 transition-colors">
            <h3 className="font-bold text-slate-900 text-base tracking-tight truncate max-w-[180px]">
              {palette.name}
            </h3>
          </Link>

          {/* Small counter stats */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Eye className="w-3.5 h-3.5" />
            <span>{palette.views}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-auto">
          {palette.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {palette.colorFamilies.map((fam) => (
            <span
              key={fam}
              className="text-[11px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            >
              {fam}
            </span>
          ))}
        </div>
      </div>
      {/* Design Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base leading-none">
                  Layout Preview: {palette.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold mt-1">
                  Mockup frame demonstrates role mappings live
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPreviewModal(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <DesignPreview palette={palette} />
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-3.5 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold">Try custom roles in the palette detail page.</span>
              <Link
                href={`/palette/${palette.id}`}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
              >
                Open Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
