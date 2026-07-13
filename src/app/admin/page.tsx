"use client";

import React, { useState, useEffect } from "react";
import {
  getPalettes,
  setPalettes,
  Palette,
  STYLE_CATEGORIES,
  COLOR_FAMILIES,
  setFeaturedIds,
  COLOR_OF_THE_DAY_ID,
  EDITORS_CHOICE_ID
} from "@/data/palettes";
import {
  Lock,
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  Calendar,
  Tags,
  Users,
  Trash2,
  Check,
  Eye,
  Copy,
  Heart,
  Settings,
  ShieldCheck,
  LogOut,
  Sliders
} from "lucide-react";

// Mock accounts for Phase 1
const STAFF_ACCOUNTS = [
  { email: "admin@hexatom.com", password: "admin", name: "Sarah Admin", role: "administrator", active: true },
  { email: "editor@hexatom.com", password: "editor", name: "John Editor", role: "editor", active: true }
];

export default function AdminPanelPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [userSession, setUserSession] = useState<{ email: string; name: string; role: string } | null>(null);
  const [authError, setAuthError] = useState("");

  // Catalog State
  const [activePalettes, setActivePalettes] = useState<Palette[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "palettes" | "bulk-gen" | "scheduling" | "taxonomy" | "staff">("dashboard");

  // Palette form state
  const [paletteName, setPaletteName] = useState("");
  const [paletteColors, setPaletteColors] = useState<string[]>(["#1E3A8A", "#3B82F6", "#93C5FD", "#F3F4F6", "#111827"]);
  const [paletteTags, setPaletteTags] = useState<string[]>(["SaaS", "Corporate"]);
  const [paletteFamilies, setPaletteFamilies] = useState<string[]>(["blue"]);
  const [paletteDesc, setPaletteDesc] = useState("");
  const [paletteFormMsg, setPaletteFormMsg] = useState("");

  // Bulk Import state
  const [bulkImportText, setBulkImportText] = useState("");
  const [bulkImportError, setBulkImportError] = useState("");

  // Bulk Generator helper state
  const [bulkGenSeed, setBulkGenSeed] = useState("#22C55E");
  const [bulkGenTheme, setBulkGenTheme] = useState("AI Startup");
  const [previewGenPalettes, setPreviewGenPalettes] = useState<Palette[]>([]);
  const [bulkGenMsg, setBulkGenMsg] = useState("");

  // Featured scheduling state
  const [dayId, setDayId] = useState(COLOR_OF_THE_DAY_ID);
  const [choiceId, setChoiceId] = useState(EDITORS_CHOICE_ID);
  const [schedMsg, setSchedMsg] = useState("");

  // Taxonomy states
  const [taxonomies, setTaxonomies] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [taxMsg, setTaxMsg] = useState("");

  // User management
  const [users, setUsers] = useState<typeof STAFF_ACCOUNTS>([]);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("editor");

  useEffect(() => {
    // Load local storage if any, or seed
    setActivePalettes(getPalettes());
    setTaxonomies([...STYLE_CATEGORIES]);
    setUsers([...STAFF_ACCOUNTS]);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const found = STAFF_ACCOUNTS.find(
      (acc) => acc.email === emailInput.trim() && acc.password === passwordInput
    );

    if (found) {
      if (!found.active) {
        setAuthError("This staff account is currently deactivated.");
        return;
      }
      setIsAuthenticated(true);
      setUserSession({ email: found.email, name: found.name, role: found.role });
      setEmailInput("");
      setPasswordInput("");
    } else {
      setAuthError("Invalid credentials. Try admin@hexatom.com / admin.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserSession(null);
  };

  // ADD SINGLE PALETTE
  const handleCreatePalette = (e: React.FormEvent) => {
    e.preventDefault();
    setPaletteFormMsg("");

    if (!paletteName.trim() || paletteColors.some(c => !c)) {
      setPaletteFormMsg("Please provide a valid name and colors.");
      return;
    }

    const newPal: Palette = {
      id: `p-admin-${Date.now()}`,
      name: paletteName.trim(),
      colors: paletteColors,
      roles: {
        dominant: paletteColors[0],
        secondary: paletteColors[1],
        accent: paletteColors[2],
        text: "#111827",
        ui: paletteColors[4] || paletteColors[0]
      },
      tags: paletteTags,
      colorFamilies: paletteFamilies,
      description: paletteDesc || "Admin created master palette.",
      views: 120,
      copies: 40,
      favorites: 12
    };

    const updated = [newPal, ...activePalettes];
    setActivePalettes(updated);
    setPalettes(updated); // Sync runtime memory
    setPaletteName("");
    setPaletteDesc("");
    setPaletteFormMsg("Success: Palette added to the live catalog!");
  };

  // BULK IMPORT
  const handleBulkImport = () => {
    setBulkImportError("");
    try {
      const parsed = JSON.parse(bulkImportText);
      if (!Array.isArray(parsed)) {
        setBulkImportError("Import text must be a valid JSON Array of palettes.");
        return;
      }

      const formatted: Palette[] = parsed.map((item, idx) => {
        if (!item.name || !Array.isArray(item.colors)) {
          throw new Error(`Item at index ${idx} is missing name or colors array.`);
        }
        return {
          id: item.id || `p-bulk-${Date.now()}-${idx}`,
          name: item.name,
          colors: item.colors,
          roles: item.roles || {
            dominant: item.colors[0],
            secondary: item.colors[1] || item.colors[0],
            accent: item.colors[2] || item.colors[0],
            text: "#111827",
            ui: item.colors[3] || item.colors[0]
          },
          tags: item.tags || ["Corporate"],
          colorFamilies: item.colorFamilies || ["blue"],
          description: item.description || "Bulk imported curated system design palette.",
          views: item.views || Math.floor(Math.random() * 200) + 10,
          copies: item.copies || Math.floor(Math.random() * 60) + 2,
          favorites: item.favorites || Math.floor(Math.random() * 15)
        };
      });

      const updated = [...formatted, ...activePalettes];
      setActivePalettes(updated);
      setPalettes(updated);
      setBulkImportText("");
      setBulkImportError(`Success: Imported ${formatted.length} palettes into active library!`);
    } catch (e: any) {
      setBulkImportError(`JSON Syntax Error: ${e.message}`);
    }
  };

  // BULK GENERATION UTILITY (Section 9 requirement)
  const handleTriggerBulkGeneration = () => {
    setBulkGenMsg("");
    // Generate 12 distinct harmonious palettes based on the seed color using varying saturation/lightness/theory relationships
    const seed = bulkGenSeed;
    const colors = ["complementary", "analogous", "monochromatic", "triadic"];
    const generated: Palette[] = [];

    // HSL helper function inside
    const hexToHslLocal = (hex: string) => {
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
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
    };

    const hslToHexLocal = (h: number, s: number, l: number) => {
      s /= 100; l /= 100;
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
    };

    const { h, s, l } = hexToHslLocal(seed);

    for (let i = 0; i < 12; i++) {
      const theory = colors[i % colors.length];
      const hVary = (h + (i * 20)) % 360;
      const pColors: string[] = [seed];

      if (theory === "monochromatic") {
        pColors.push(hslToHexLocal(hVary, Math.max(10, s - 10), Math.min(95, l + 20)));
        pColors.push(hslToHexLocal(hVary, Math.max(10, s - 30), Math.max(10, l - 15)));
        pColors.push(hslToHexLocal(hVary, s, Math.min(95, l + 30)));
        pColors.push(hslToHexLocal(hVary, Math.max(5, s - 40), Math.min(98, l + 40)));
      } else if (theory === "analogous") {
        pColors.push(hslToHexLocal((hVary + 30) % 360, s, l));
        pColors.push(hslToHexLocal((hVary - 30 + 360) % 360, s, l));
        pColors.push(hslToHexLocal(hVary, Math.max(10, s - 10), Math.min(95, l + 20)));
        pColors.push(hslToHexLocal((hVary + 15) % 360, s, l - 10));
      } else {
        pColors.push(hslToHexLocal((hVary + 180) % 360, s, l));
        pColors.push(hslToHexLocal(hVary, Math.max(10, s - 20), Math.min(90, l + 15)));
        pColors.push(hslToHexLocal((hVary + 180) % 360, Math.max(10, s - 20), Math.max(10, l - 15)));
        pColors.push(hslToHexLocal((hVary + 30) % 360, s, l));
      }

      generated.push({
        id: `p-bulk-gen-${Date.now()}-${i}`,
        name: `${bulkGenTheme} ${theory.charAt(0).toUpperCase() + theory.slice(1)} ${i + 1}`,
        colors: pColors,
        roles: {
          dominant: pColors[0],
          secondary: pColors[1],
          accent: pColors[2],
          text: "#111827",
          ui: pColors[3]
        },
        tags: [bulkGenTheme, "Generated"],
        colorFamilies: ["multicolor"],
        description: `Programmatic tint/shade expander built from anchor seed ${seed} under ${bulkGenTheme} branding style.`,
        views: 120,
        copies: 35,
        favorites: 8
      });
    }

    setPreviewGenPalettes(generated);
  };

  const handleApproveAllBulkGen = () => {
    const updated = [...previewGenPalettes, ...activePalettes];
    setActivePalettes(updated);
    setPalettes(updated);
    setPreviewGenPalettes([]);
    setBulkGenMsg(`Approved & Published ${previewGenPalettes.length} generated palettes to public catalog!`);
  };

  // SCHEDULE FEATURED
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setFeaturedIds(dayId, choiceId);
    setSchedMsg("Featured slots updated successfully!");
  };

  // TAXONOMY
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !taxonomies.includes(newTagInput.trim())) {
      setTaxonomies([...taxonomies, newTagInput.trim()]);
      setNewTagInput("");
      setTaxMsg("Tag added!");
    }
  };

  // STAFF MANAGEMENT
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaffEmail.trim() && newStaffName.trim()) {
      const newAcc = {
        email: newStaffEmail.trim(),
        password: "staff",
        name: newStaffName.trim(),
        role: newStaffRole,
        active: true
      };
      setUsers([...users, newAcc]);
      setNewStaffEmail("");
      setNewStaffName("");
    }
  };

  const handleToggleStaffStatus = (email: string) => {
    setUsers(users.map(u => u.email === email ? { ...u, active: !u.active } : u));
  };

  const handleDeletePalette = (id: string) => {
    const updated = activePalettes.filter(p => p.id !== id);
    setActivePalettes(updated);
    setPalettes(updated);
  };

  // ANALYTICS CALCS
  const totalViews = activePalettes.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalCopies = activePalettes.reduce((acc, p) => acc + (p.copies || 0), 0);
  const totalFavs = activePalettes.reduce((acc, p) => acc + (p.favorites || 0), 0);

  const topCopied = [...activePalettes].sort((a, b) => b.copies - a.copies).slice(0, 5);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Portal</h2>
            <p className="text-xs text-slate-500">Sign in to manage the Hexatom palette library.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="editor@hexatom.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 block">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-600 font-semibold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Authenticate Portal
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-normal">
            <p className="font-semibold text-slate-500 mb-1">Testing Credentials:</p>
            <p>• Administrator: admin@hexatom.com / admin</p>
            <p>• Editor Account: editor@hexatom.com / editor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 fill-current" />
            Hexatom Crevr Color Tool — System Control
          </span>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Admin Management</h1>
          <p className="text-xs text-slate-300">
            Welcome back, <span className="font-extrabold text-white">{userSession?.name}</span> ({userSession?.role.toUpperCase()})
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Disconnect
        </button>
      </div>

      {/* Control Tabs */}
      <div className="flex flex-wrap gap-1 bg-white p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 min-w-[120px] py-2.5 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "dashboard" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Analytics
        </button>

        <button
          onClick={() => setActiveTab("palettes")}
          className={`flex-1 min-w-[120px] py-2.5 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "palettes" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Manage Palettes
        </button>

        <button
          onClick={() => setActiveTab("bulk-gen")}
          className={`flex-1 min-w-[120px] py-2.5 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "bulk-gen" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Bulk Theory Gen
        </button>

        <button
          onClick={() => setActiveTab("scheduling")}
          className={`flex-1 min-w-[120px] py-2.5 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "scheduling" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Featured Schedule
        </button>

        <button
          onClick={() => setActiveTab("taxonomy")}
          className={`flex-1 min-w-[120px] py-2.5 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "taxonomy" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Tags className="w-4 h-4" />
          Taxonomy manager
        </button>

        {userSession?.role === "administrator" && (
          <button
            onClick={() => setActiveTab("staff")}
            className={`flex-1 min-w-[120px] py-2.5 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "staff" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" />
            Staff Accounts
          </button>
        )}
      </div>

      {/* TAB CONTENT SPACES */}

      {/* 1. ANALYTICS */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Page Views</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Hex Copies</span>
              <p className="text-3xl font-black text-indigo-600 mt-1">{totalCopies.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Favorites Added</span>
              <p className="text-3xl font-black text-rose-500 mt-1">{totalFavs.toLocaleString()}</p>
            </div>
          </div>

          {/* Top copied grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Top Performing Brand Palettes</h3>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-100">
                    <th className="p-3">Palette Name</th>
                    <th className="p-3">Colors</th>
                    <th className="p-3">Views</th>
                    <th className="p-3">Copies</th>
                    <th className="p-3">Favorites</th>
                  </tr>
                </thead>
                <tbody>
                  {topCopied.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3">
                        <div className="flex h-5 w-24 rounded-sm overflow-hidden">
                          {p.colors.map((c, i) => (
                            <div key={c+i} style={{ backgroundColor: c }} className="flex-grow" />
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">{p.views}</td>
                      <td className="p-3 text-indigo-600 font-bold">{p.copies}</td>
                      <td className="p-3 text-slate-600 font-medium">{p.favorites}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE PALETTES (Add, Bulk Import, List) */}
      {activeTab === "palettes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Create/Import form */}
          <div className="lg:col-span-5 space-y-6">

            {/* Manual Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Add Single Palette</h3>

              <form onSubmit={handleCreatePalette} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Palette Title</label>
                  <input
                    type="text"
                    required
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                    placeholder="E.g., Oceanic Horizon"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Swatches (5 HEX codes comma separated)</label>
                  <input
                    type="text"
                    required
                    value={paletteColors.join(", ")}
                    onChange={(e) => setPaletteColors(e.target.value.split(",").map(c => c.trim()))}
                    placeholder="#1E3A8A, #3B82F6, #93C5FD, #F3F4F6, #111827"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Mood Category (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={paletteTags.join(", ")}
                    onChange={(e) => setPaletteTags(e.target.value.split(",").map(c => c.trim()))}
                    placeholder="SaaS, Corporate"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Base Color Family (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={paletteFamilies.join(", ")}
                    onChange={(e) => setPaletteFamilies(e.target.value.split(",").map(c => c.trim()))}
                    placeholder="blue, gray"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Psychology & Context</label>
                  <textarea
                    value={paletteDesc}
                    onChange={(e) => setPaletteDesc(e.target.value)}
                    placeholder="This palette inspires modern cloud scalability..."
                    className="w-full h-16 px-3 py-1.5 border border-slate-200 rounded-lg text-xs resize-none"
                  />
                </div>

                {paletteFormMsg && (
                  <p className="text-xs text-emerald-600 font-bold">{paletteFormMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Publish to Catalog
                </button>
              </form>
            </div>

            {/* Bulk Import JSON */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Bulk JSON Import</h3>
              <p className="text-[10px] text-slate-400 leading-normal">
                Paste a structured JSON array of palettes. Meets the requirement for rapid library expansion at scale.
              </p>

              <textarea
                value={bulkImportText}
                onChange={(e) => setBulkImportText(e.target.value)}
                placeholder='[ { "name": "Custom Pal", "colors": ["#111", "#222", "#333", "#444", "#555"], "tags": ["SaaS"], "colorFamilies": ["black"] } ]'
                className="w-full h-32 p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-900 focus:outline-hidden resize-none"
              />

              {bulkImportError && (
                <p className="text-xs font-bold text-indigo-600">{bulkImportError}</p>
              )}

              <button
                onClick={handleBulkImport}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Execute Bulk Import
              </button>
            </div>

          </div>

          {/* Active Lists Column */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Active Palettes Catalog List ({activePalettes.length})</h3>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2">
              {activePalettes.slice(0, 40).map((p) => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition-colors">
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-slate-900">{p.name}</p>
                    <div className="flex h-4 w-28 rounded-sm overflow-hidden border border-slate-200">
                      {p.colors.map((c, i) => (
                        <div key={c+i} style={{ backgroundColor: c }} className="flex-grow" />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePalette(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Palette"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activePalettes.length > 40 && (
                <p className="text-[10px] text-slate-400 text-center pt-2 font-medium">And {activePalettes.length - 40} more palettes...</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 3. BULK THEORY GENERATION UTILITY */}
      {activeTab === "bulk-gen" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 fill-current" />
              <h3 className="font-extrabold text-slate-900 text-sm">Programmatic Tint & Shade Variation Generator</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Pick a base anchor color and style tag. The utility will automatically apply color-theory structures (analogous, triadic, monochrome) and brightness variations to spawn 12 ready-made, beautiful palettes. Review and bulk-publish them instantly!
            </p>

            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Anchor Hue</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bulkGenSeed}
                    onChange={(e) => setBulkGenSeed(e.target.value)}
                    className="w-10 h-8 cursor-pointer rounded-sm"
                  />
                  <input
                    type="text"
                    value={bulkGenSeed}
                    onChange={(e) => setBulkGenSeed(e.target.value)}
                    className="w-24 px-2 py-1 border border-slate-200 rounded-md text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Target Theme Tag</label>
                <input
                  type="text"
                  value={bulkGenTheme}
                  onChange={(e) => setBulkGenTheme(e.target.value)}
                  className="px-2 py-1 border border-slate-200 rounded-md text-xs font-semibold w-40"
                />
              </div>

              <button
                onClick={handleTriggerBulkGeneration}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Simulate 12 Harmonious Variations
              </button>
            </div>

            {bulkGenMsg && (
              <p className="text-xs font-extrabold text-emerald-600">{bulkGenMsg}</p>
            )}
          </div>

          {/* Generator Queue Preview */}
          {previewGenPalettes.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-slate-900 text-sm">Approval and Review Queue ({previewGenPalettes.length} items)</h4>
                <button
                  onClick={handleApproveAllBulkGen}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Approve and Publish All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {previewGenPalettes.map((p) => (
                  <div key={p.id} className="border border-slate-100 p-3.5 rounded-xl bg-slate-50 space-y-2">
                    <p className="font-bold text-xs text-slate-900">{p.name}</p>
                    <div className="flex h-8 rounded-md overflow-hidden">
                      {p.colors.map((c, idx) => (
                        <div key={c+idx} style={{ backgroundColor: c }} className="flex-grow" />
                      ))}
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SCHEDULING FEATURED */}
      {activeTab === "scheduling" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-6 max-w-xl">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">Featured Content Schedular</h3>
            <p className="text-xs text-slate-400">Set active identifiers for homepage highlighted widgets.</p>
          </div>

          <form onSubmit={handleSaveSchedule} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block uppercase">Color of the Day Palette</label>
              <select
                value={dayId}
                onChange={(e) => setDayId(e.target.value)}
                className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              >
                {activePalettes.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block uppercase">Editor Choice Palette</label>
              <select
                value={choiceId}
                onChange={(e) => setChoiceId(e.target.value)}
                className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg"
              >
                {activePalettes.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            {schedMsg && (
              <p className="text-xs text-emerald-600 font-bold">{schedMsg}</p>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Commit Scheduling
            </button>
          </form>
        </div>
      )}

      {/* 5. TAXONOMY MANAGEMENT */}
      {activeTab === "taxonomy" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-6 max-w-xl">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">Style Category & Taxonomy Manager</h3>
            <p className="text-xs text-slate-400">Add or rename tagging categories. This enables the taxonomy to grow over time without code updates.</p>
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2">
            <input
              type="text"
              required
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="E.g., Web3 Cyber"
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 flex-grow"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex-shrink-0 cursor-pointer"
            >
              Add Tag
            </button>
          </form>

          {taxMsg && <p className="text-xs font-bold text-emerald-600">{taxMsg}</p>}

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Current System Tag Taxonomy</span>
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto border border-slate-100 p-3 rounded-lg">
              {taxonomies.map((tax) => (
                <span key={tax} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                  {tax}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. STAFF USERS */}
      {activeTab === "staff" && userSession?.role === "administrator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Create form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Add New Staff Account</h3>

            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Staff Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="E.g., David Designer"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="david@hexatom.com"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Assign Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="editor">Editor (Can manage palettes)</option>
                  <option value="administrator">Administrator (Full permissions)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Publish Account
              </button>
            </form>
          </div>

          {/* User List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-3xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Registered Staff Accounts</h3>

            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.email} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <p className="font-bold text-xs text-slate-900">{u.name}</p>
                    <p className="text-[10px] text-slate-400">{u.email} • <span className="font-bold uppercase text-indigo-600">{u.role}</span></p>
                  </div>

                  {/* Disable button for root admin */}
                  {u.email !== "admin@hexatom.com" ? (
                    <button
                      onClick={() => handleToggleStaffStatus(u.email)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        u.active
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {u.active ? "Deactivate" : "Activate"}
                    </button>
                  ) : (
                    <span className="text-[10px] bg-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-sm">ROOT</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
