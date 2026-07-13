"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getPalettes, Palette } from "@/data/palettes";
import PaletteCard from "@/components/PaletteCard";
import {
  Heart,
  FolderPlus,
  Layers,
  Copy,
  Check,
  Trash2,
  Folder,
  Plus,
  FileCode,
  Info,
  ChevronRight
} from "lucide-react";

interface Collection {
  name: string;
  paletteIds: string[];
}

export default function FavoritesPage() {
  const [allPalettes, setAllPalettes] = useState<Palette[]>([]);
  const [favoritesIds, setFavoritesIds] = useState<string[]>([]);
  const [collections, setCollections] = useState<{ [key: string]: string[] }>({});

  // Custom generated palettes from Generator / Extractor
  const [customPalettes, setCustomPalettes] = useState<Palette[]>([]);

  // UI State
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [copiedBulk, setCopiedBulk] = useState(false);
  const [bulkFormat, setBulkFormat] = useState<"hex" | "css" | "tailwind" | "ai">("hex");

  useEffect(() => {
    // Load all palettes
    const list = getPalettes();
    setAllPalettes(list);

    // Load from local storage
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("hexatom_favorites");
      if (savedFavs) {
        setFavoritesIds(JSON.parse(savedFavs));
      }

      const savedCollections = localStorage.getItem("hexatom_collections");
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }

      const savedCustom = localStorage.getItem("hexatom_custom_palettes");
      if (savedCustom) {
        setCustomPalettes(JSON.parse(savedCustom));
      }
    }
  }, []);

  const saveCollections = (updated: { [key: string]: string[] }) => {
    setCollections(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("hexatom_collections", JSON.stringify(updated));
    }
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      const name = newCollectionName.trim();
      if (!collections[name]) {
        const updated = { ...collections, [name]: [] };
        saveCollections(updated);
        setNewCollectionName("");
      }
    }
  };

  const handleDeleteCollection = (name: string) => {
    const updated = { ...collections };
    delete updated[name];
    saveCollections(updated);
    if (selectedCollection === name) {
      setSelectedCollection(null);
    }
  };

  const handleAddPaletteToCollection = (paletteId: string, colName: string) => {
    const colList = collections[colName] || [];
    if (!colList.includes(paletteId)) {
      const updated = {
        ...collections,
        [colName]: [...colList, paletteId]
      };
      saveCollections(updated);
    }
  };

  const handleRemoveFromCollection = (paletteId: string, colName: string) => {
    const colList = collections[colName] || [];
    const updated = {
      ...collections,
      [colName]: colList.filter(id => id !== paletteId)
    };
    saveCollections(updated);
  };

  const handleFavoriteToggle = () => {
    // Sync active favorites on card action
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("hexatom_favorites");
      if (savedFavs) {
        setFavoritesIds(JSON.parse(savedFavs));
      }
    }
  };

  // Combine static seeded palettes and user custom-created ones
  const activeLibrary = [...allPalettes, ...customPalettes];

  // Resolve favorited items
  const favoritedPalettes = activeLibrary.filter(p => favoritesIds.includes(p.id));

  // Resolve current active collection display list
  const activeCollectionPalettes = selectedCollection
    ? activeLibrary.filter(p => (collections[selectedCollection] || []).includes(p.id))
    : favoritedPalettes;

  // BULK EXPORT GENERATOR
  const getBulkExportText = () => {
    const targetPalettes = activeCollectionPalettes;
    if (targetPalettes.length === 0) return "No palettes in list.";

    let text = `/* HEXATOM BULK EXPORT - ${selectedCollection || "All Favorites"} */\n`;

    targetPalettes.forEach((palette, idx) => {
      text += `\n/* ${idx + 1}. Palette Name: ${palette.name} */\n`;
      const pColor = palette.colors;

      switch (bulkFormat) {
        case "hex":
          text += `Swatches: ${pColor.join(", ")}\n`;
          break;
        case "css":
          text += `:root {\n` +
            `  --theme-${palette.id}-dominant: ${pColor[0]};\n` +
            `  --theme-${palette.id}-secondary: ${pColor[1]};\n` +
            `  --theme-${palette.id}-accent: ${pColor[2]};\n` +
            `}\n`;
          break;
        case "tailwind":
          text += `theme-${palette.id}: {\n` +
            `  dominant: "${pColor[0]}",\n` +
            `  secondary: "${pColor[1]}",\n` +
            `  accent: "${pColor[2]}",\n` +
            `},\n`;
          break;
        case "ai":
          text += `Configure project theme around "${palette.name}". Dominant (60%): ${pColor[0]}, Secondary (30%): ${pColor[1]}, Accent (10%): ${pColor[2]}.\n`;
          break;
      }
    });

    return text;
  };

  const handleCopyBulk = () => {
    navigator.clipboard.writeText(getBulkExportText()).then(() => {
      setCopiedBulk(true);
      setTimeout(() => setCopiedBulk(false), 2000);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-500 fill-current" />
            My Saved Collections
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Organize color architectures by client, asset type, or visual design project.
          </p>
        </div>

        {/* Create Collection Input */}
        <form onSubmit={handleCreateCollection} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="New Collection Name (e.g., SaaS App)..."
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors rounded-xl text-xs font-bold flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            Create
          </button>
        </form>
      </div>

      {/* Workspace Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Collections List */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">Collection Folders</span>

            <div className="flex flex-col gap-1.5">

              {/* Favorites general tab */}
              <button
                onClick={() => setSelectedCollection(null)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  selectedCollection === null
                    ? "bg-rose-50 text-rose-700 font-extrabold border border-rose-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className={`w-4 h-4 ${selectedCollection === null ? "fill-current" : ""}`} />
                  <span>ALL FAVORITES</span>
                </div>
                <span className="bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                  {favoritedPalettes.length}
                </span>
              </button>

              {/* Loop Collections */}
              {Object.keys(collections).map((name) => {
                const active = selectedCollection === name;
                return (
                  <div key={name} className="group flex items-center justify-between w-full rounded-xl transition-all">
                    <button
                      onClick={() => setSelectedCollection(name)}
                      className={`flex-grow text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        active
                          ? "bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-100"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className={`w-4 h-4 ${active ? "fill-current" : ""}`} />
                        <span className="truncate max-w-[120px]">{name}</span>
                      </div>
                      <span className="bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                        {collections[name].length}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteCollection(name)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* Right workspace content list */}
        <div className="lg:col-span-3 space-y-6">

          {/* Active Collection Stats & Bulk exporter widget */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tight">{selectedCollection || "All Favorited Colors"}</h2>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Contains {activeCollectionPalettes.length} items. Organize your themes and copy them in a single bulk block below!
              </p>
            </div>

            {activeCollectionPalettes.length > 0 && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={bulkFormat}
                  onChange={(e) => setBulkFormat(e.target.value as any)}
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-bold py-1.5 px-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="hex">Plain HEX</option>
                  <option value="css">CSS Variables</option>
                  <option value="tailwind">Tailwind Theme</option>
                  <option value="ai">AI Prompt Block</option>
                </select>

                <button
                  onClick={handleCopyBulk}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 flex-shrink-0 cursor-pointer"
                >
                  {copiedBulk ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  Bulk Export ({activeCollectionPalettes.length})
                </button>
              </div>
            )}
          </div>

          {/* Grid display */}
          {activeCollectionPalettes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {activeCollectionPalettes.map((palette) => (
                <div key={palette.id} className="relative group">
                  <PaletteCard
                    palette={palette}
                    isFavorited={favoritesIds.includes(palette.id)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />

                  {/* Move/Remove controls relative to collections */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-slate-100 shadow-sm flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    {selectedCollection ? (
                      <button
                        onClick={() => handleRemoveFromCollection(palette.id, selectedCollection)}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove from Folder
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Add to collection:</span>
                    )}

                    {/* Collection drop selection */}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddPaletteToCollection(palette.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      defaultValue=""
                      className="text-[9px] font-bold bg-slate-50 border border-slate-200 rounded-sm py-0.5 px-1 max-w-[100px]"
                    >
                      <option value="" disabled>Choose...</option>
                      {Object.keys(collections)
                        .filter(name => !(collections[name] || []).includes(palette.id))
                        .map(name => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 p-8 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                <Heart className="w-6 h-6 stroke-1" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Your dashboard is empty</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You haven't favorited any color architectures or created folders for {selectedCollection || "All Favorites"} yet.
                </p>
              </div>
              <Link
                href="/browse"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                Browse Palette Library <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
