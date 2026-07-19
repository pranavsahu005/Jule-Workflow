export interface Gradient {
  id: string;
  name: string;
  colors: string[]; // 2 to 4 hex stops
  direction: string; // e.g. "to right", "to bottom right", "135deg"
  category: "warm" | "cool" | "luxury" | "neon" | "pastel" | "multi color";
  views: number;
  copies: number;
  favorites: number;
}

// Handcrafted seed gradients spanning the different categories
const SEED_GRADIENTS: Gradient[] = [
  {
    id: "g-seed-1",
    name: "Luxury Gilded Amber",
    colors: ["#111827", "#D4AF37", "#FDFBF7"],
    direction: "135deg",
    category: "luxury",
    views: 340,
    copies: 120,
    favorites: 45
  },
  {
    id: "g-seed-2",
    name: "Cool Ocean Breeze",
    colors: ["#0369A1", "#0284C7", "#38BDF8"],
    direction: "to right",
    category: "cool",
    views: 290,
    copies: 88,
    favorites: 32
  },
  {
    id: "g-seed-3",
    name: "Vibrant Sunset Glow",
    colors: ["#EA580C", "#F97316", "#FACC15"],
    direction: "to bottom right",
    category: "warm",
    views: 410,
    copies: 195,
    favorites: 75
  },
  {
    id: "g-seed-4",
    name: "Cyber Neon Hack",
    colors: ["#0D0E15", "#00FF66", "#00FFFF"],
    direction: "135deg",
    category: "neon",
    views: 520,
    copies: 230,
    favorites: 98
  },
  {
    id: "g-seed-5",
    name: "Ethereal Pastel Orchid",
    colors: ["#FAF5FF", "#E9D5FF", "#F472B6"],
    direction: "to right",
    category: "pastel",
    views: 240,
    copies: 75,
    favorites: 28
  },
  {
    id: "g-seed-6",
    name: "Spectral Prism Flow",
    colors: ["#FF0055", "#00FF66", "#0055FF", "#FFCC00"],
    direction: "to bottom right",
    category: "multi color",
    views: 380,
    copies: 140,
    favorites: 60
  }
];

// Helper functions for programmatic creation
function hslToHex(h: number, s: number, l: number): string {
  // Clamp saturation and lightness to 0-100 to avoid out-of-bounds calculations
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));

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

  // Clamp output values to 0-255 to ensure exact valid hex codes
  const rHex = Math.max(0, Math.min(255, Math.round((r + m) * 255))).toString(16).padStart(2, "0");
  const gHex = Math.max(0, Math.min(255, Math.round((g + m) * 255))).toString(16).padStart(2, "0");
  const bHex = Math.max(0, Math.min(255, Math.round((b + m) * 255))).toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

const ADJECTIVES = [
  "Golden", "Midnight", "Ethereal", "Cosmic", "Luminous", "Sultry", "Electric", "Mystic",
  "Radiant", "Serene", "Hyper", "Vibrant", "Sleek", "Subtle", "Prismatic", "Glacial", "Velvet",
  "Oceanic", "Sunset", "Mesa", "Desert", "Arctic", "Warm", "Delicate", "Crisp", "Opal"
];

const NOUNS = [
  "Horizon", "Breeze", "Fusion", "Cascade", "Glow", "Mist", "Pulse", "Vortex", "Tide",
  "Aura", "Canopy", "Echo", "Shade", "Haven", "Haze", "Spectrum", "Beacon", "Spire", "Dune",
  "Oasis", "Ridge", "Ascent", "Symphony", "Harmonics", "Flow", "Wave", "Mirage", "Zenith"
];

const CATEGORIES: ("warm" | "cool" | "luxury" | "neon" | "pastel" | "multi color")[] = [
  "warm", "cool", "luxury", "neon", "pastel", "multi color"
];

const GENERATED_GRADIENTS: Gradient[] = [...SEED_GRADIENTS];

// Programmatically scale to 1000+ distinct gradients
let idCounter = 1;
const countToGenerate = 1010;

for (let i = 0; i < countToGenerate; i++) {
  const category = CATEGORIES[i % CATEGORIES.length];
  const adj = ADJECTIVES[(i * 13) % ADJECTIVES.length];
  const noun = NOUNS[(i * 17) % NOUNS.length];
  const name = `${adj} ${noun} ${category.toUpperCase()}`;

  // Deterministic colors depending on category
  const colors: string[] = [];
  const direction = i % 3 === 0 ? "135deg" : i % 3 === 1 ? "to right" : "to bottom right";

  if (category === "warm") {
    const baseH = (15 + (i * 2.5)) % 60; // warm red to yellow range
    colors.push(hslToHex(baseH, 85, 45));
    colors.push(hslToHex((baseH + 20) % 360, 95, 55));
    if (i % 2 === 0) colors.push(hslToHex((baseH + 40) % 360, 100, 65));
  } else if (category === "cool") {
    const baseH = (180 + (i * 3)) % 80 + 170; // cool teal to blue range
    colors.push(hslToHex(baseH, 80, 40));
    colors.push(hslToHex((baseH + 25) % 360, 75, 55));
    if (i % 2 === 0) colors.push(hslToHex((baseH + 45) % 360, 85, 65));
  } else if (category === "luxury") {
    // dark/rich colors with gold/cream
    if (i % 2 === 0) {
      colors.push("#0F172A"); // dark midnight slate
      colors.push("#D4AF37"); // premium metallic gold
      colors.push("#FAF9F6"); // luxury soft ivory
    } else {
      colors.push("#2D0A15"); // deep burgundy
      colors.push("#D4AF37"); // gold
      colors.push("#FDFBF7"); // cream
    }
  } else if (category === "neon") {
    const baseH = (i * 45) % 360;
    colors.push("#090A0F"); // dark cyberpunk base
    colors.push(hslToHex(baseH, 100, 50)); // electric accent
    colors.push(hslToHex((baseH + 120) % 360, 100, 50)); // complementary neon
  } else if (category === "pastel") {
    const baseH = (i * 24) % 360;
    colors.push(hslToHex(baseH, 40, 92)); // highly desaturated and light
    colors.push(hslToHex((baseH + 60) % 360, 50, 85));
    if (i % 2 === 0) colors.push(hslToHex((baseH + 120) % 360, 45, 88));
  } else {
    // multi color: spread across color wheel
    const baseH = (i * 36) % 360;
    colors.push(hslToHex(baseH, 80, 50));
    colors.push(hslToHex((baseH + 90) % 360, 85, 50));
    colors.push(hslToHex((baseH + 180) % 360, 90, 50));
    if (i % 2 === 0) colors.push(hslToHex((baseH + 270) % 360, 85, 50));
  }

  GENERATED_GRADIENTS.push({
    id: `g-generated-${idCounter}`,
    name,
    colors,
    direction,
    category,
    views: Math.floor(Math.random() * 150) + 12,
    copies: Math.floor(Math.random() * 45) + 3,
    favorites: Math.floor(Math.random() * 15) + 1
  });

  idCounter++;
}

export function getGradients(): Gradient[] {
  return GENERATED_GRADIENTS;
}
