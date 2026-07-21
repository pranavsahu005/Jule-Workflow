export interface Palette {
  id: string;
  name: string;
  colors: string[]; // array of 4 to 6 hex codes
  roles: {
    dominant: string;  // 60%
    secondary: string; // 30%
    accent: string;    // 10%
    text: string;
    ui: string;
    [key: string]: string;
  };
  tags: string[]; // style/mood categories
  colorFamilies: string[]; // e.g., ["blue", "gray"]
  description: string;
  views: number;
  copies: number;
  favorites: number;
  isCustom?: boolean;
  color_family?: string;
  categories?: string[];
  is_featured?: boolean;
  is_editor_choice?: boolean;
  view_count?: number;
  copy_count?: number;
  favorite_count?: number;
}

// Fixed definitions for categories and color families
export const STYLE_CATEGORIES = [
  "Luxury",
  "Neon and Cyberpunk",
  "Minimal and Monochrome",
  "Corporate and Business",
  "Startup and SaaS",
  "E-commerce and Retail",
  "Pastel and Soft",
  "Vintage and Retro",
  "Earthy and Organic",
  "Dark Mode and Deep",
  "Bright and High Contrast",
  "Warm and Cozy",
  "Cool and Calm",
  "Festival and Celebration",
  "Fashion and Beauty",
  "Gaming and Esports",
  "Wedding and Events",
  "Healthcare and Wellness",
  "Finance and Fintech",
  "Real Estate and Architecture",
  "Food and Restaurant",
  "Education and Kids",
  "Nature and Travel",
  "AI and Futuristic Tech",
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
  "Cultural"
];

export const COLOR_FAMILIES = [
  "red", "orange", "yellow", "green", "teal", "blue", "purple", "pink", "brown", "gray", "black", "white", "multicolor"
];

// Helper functions for programmatic expansion (RGB/HSL calculations)
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  hex = hex.replace("#", "");
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
  // Clamp saturation and lightness to [0, 100]
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

  // Clamp final RGB values to [0, 255]
  const rVal = Math.max(0, Math.min(255, Math.round((r + m) * 255)));
  const gVal = Math.max(0, Math.min(255, Math.round((g + m) * 255)));
  const bVal = Math.max(0, Math.min(255, Math.round((b + m) * 255)));

  const rHex = rVal.toString(16).padStart(2, "0");
  const gHex = gVal.toString(16).padStart(2, "0");
  const bHex = bVal.toString(16).padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

// Core seed configurations based on the 30+ theme groups mentioned in the PRD
const SEED_THEMES = [
  { name: "Luxury Cream Tones", baseHex: "#FDFBF7", secondary: "#D4AF37", accent: "#1A1A1A", family: "white", category: "Luxury", desc: "Warm luxury cream and rich gold tones designed for premium, exclusive brand aesthetics." },
  { name: "Crimson & Warm Red", baseHex: "#9B111E", secondary: "#D2B48C", accent: "#F5F5DC", family: "red", category: "Warm and Cozy", desc: "Intense crimson paired with warm neutrals, conveying deep passion, prestige, and comfort." },
  { name: "Majestic Purple", baseHex: "#4B0082", secondary: "#E6E6FA", accent: "#DA70D6", family: "purple", category: "Luxury", desc: "Majestic and elegant royal violet shades suited for high-end fashion, beauty, or royal branding." },
  { name: "Teal & Cream", baseHex: "#008080", secondary: "#FFFDD0", accent: "#FF7F50", family: "teal", category: "Minimal and Monochrome", desc: "Balanced teal and smooth cream tones, creating geometric harmony and a retro-modern visual feel." },
  { name: "Dark Forest & Neon", baseHex: "#0B291B", secondary: "#39FF14", accent: "#00E5FF", family: "green", category: "Neon and Cyberpunk", desc: "A vibrant combination of rich forest green and neon cyberpunk green, perfect for modern gaming and futuristic tech." },
  { name: "Pastel Blush Streetwear", baseHex: "#FFD1DC", secondary: "#C0C0C0", accent: "#4A4A4A", family: "pink", category: "Pastel and Soft", desc: "Soft pastel blush pink and cool gray streetwear shades, bridging gentle warmth and city culture." },
  { name: "Eccentric High Energy", baseHex: "#FF5F1F", secondary: "#00FFFF", accent: "#FF1493", family: "orange", category: "Bright and High Contrast", desc: "High energy high-contrast combinations, radiating maximum excitement and youth-brand playfulness." },
  { name: "Dark Blue Galaxy", baseHex: "#0B1026", secondary: "#1E3A8A", accent: "#A5B4FC", family: "blue", category: "Dark Mode and Deep", desc: "Deep cosmic blues and starlight lavender tones, perfect for space aesthetics and deep-tech products." },
  { name: "Blue Neon Cyber", baseHex: "#0D0E15", secondary: "#0055FF", accent: "#00FFFF", family: "blue", category: "Neon and Cyberpunk", desc: "Sleek cybernetic blue tones on a dark canvas, giving a sci-fi hacker look to coding agents or gaming layouts." },
  { name: "Green & Lemon Fresh", baseHex: "#22C55E", secondary: "#EAB308", accent: "#1E3A8A", family: "green", category: "Earthy and Organic", desc: "A fresh burst of lemon yellow and leafy greens, ideal for organic food, health, and clean eco products." },
  { name: "Sunset Glow", baseHex: "#F97316", secondary: "#EF4444", accent: "#FACC15", family: "orange", category: "Bright and High Contrast", desc: "Radiant orange, red, and golden yellow colors of a summer sunset, providing warm invitation and action." },
  { name: "Dark Hacker Terminal", baseHex: "#050B05", secondary: "#15803D", accent: "#22C55E", family: "black", category: "Neon and Cyberpunk", desc: "Retro command line terminal green tones, designed for coding, cybersecurity, and tech tools." },
  { name: "Pure Cloud Neutral", baseHex: "#F8FAFC", secondary: "#E2E8F0", accent: "#0F172A", family: "white", category: "Minimal and Monochrome", desc: "Extremely clean, modern neutral gray and white cloud shades for the ultimate SaaS minimalist aesthetic." },
  { name: "Bright Corporate Business", baseHex: "#1E40AF", secondary: "#64748B", accent: "#3B82F6", family: "blue", category: "Corporate and Business", desc: "Reliable blue and slate tones that inspire trust, stability, and professional corporate authority." },
  { name: "Dark Premium Business", baseHex: "#0F172A", secondary: "#1E293B", accent: "#F59E0B", family: "black", category: "Dark Mode and Deep", desc: "A premium corporate combination with deep slate and gold highlights, suitable for fintech platforms." },
  { name: "Ultra Luxury Gold", baseHex: "#111827", secondary: "#D4AF37", accent: "#93C5FD", family: "yellow", category: "Luxury", desc: "Exclusive charcoal, deep blue and metallic gold palette representing wealth, success, and high value." },
  { name: "Pink Girly Streetwear", baseHex: "#F43F5E", secondary: "#FB7185", accent: "#111827", family: "pink", category: "Fashion and Beauty", desc: "Feminine rose and sharp dark contrast accents, radiating self-assurance, modern fashion, and edge." },
  { name: "Midnight Ocean", baseHex: "#0F172A", secondary: "#0369A1", accent: "#38BDF8", family: "blue", category: "Cool and Calm", desc: "Deep ocean navy and sparkling sky blue tones that convey calmness, serenity, and depth." },
  { name: "Terracotta Earth", baseHex: "#C2410C", secondary: "#FDBA74", accent: "#451A03", family: "brown", category: "Earthy and Organic", desc: "Rustic clay terracotta tones representing organic soil, warmth, tradition, and natural elements." },
  { name: "Sage Forest Moss", baseHex: "#15803D", secondary: "#A7F3D0", accent: "#065F46", family: "green", category: "Earthy and Organic", desc: "Calm sage green and deep forest foliage tones, inspired by tranquil mountain landscapes and plant wellness." },
  { name: "Royal Indigo", baseHex: "#3730A3", secondary: "#818CF8", accent: "#F43F5E", family: "purple", category: "Luxury", desc: "A royal deep indigo backdrop combined with electric neon pink accents, designed to stand out in creative agencies." },
  { name: "Electric Lime", baseHex: "#111827", secondary: "#84CC16", accent: "#06B6D4", family: "green", category: "Gaming and Esports", desc: "Vivid lime green on midnight dark, optimized for sports, gaming clubs, and high-octane web layouts." },
  { name: "Monochrome Minimal", baseHex: "#FFFFFF", secondary: "#F3F4F6", accent: "#111827", family: "gray", category: "Minimal and Monochrome", desc: "Clean black-and-white minimalist setup emphasizing readability, elegance, and extreme structural simplicity." },
  { name: "Peach Fuzz Harmony", baseHex: "#FFBE98", secondary: "#FFE4E6", accent: "#9A3412", family: "orange", category: "Pastel and Soft", desc: "Soft peach fuzz and delicate rose shades, providing cozy intimacy, peace, and modern lifestyle warmth." },
  { name: "Deep Magenta Passion", baseHex: "#86198F", secondary: "#F0ABFC", accent: "#F43F5E", family: "pink", category: "Fashion and Beauty", desc: "Vibrant deep magenta and fuchsia colors that inspire creativity, emotional intensity, and design flare." },
  { name: "Titanium Metal", baseHex: "#1E293B", secondary: "#94A3B8", accent: "#CBD5E1", family: "gray", category: "Corporate and Business", desc: "Sleek and robust titanium silver tones representing strength, modern hardware, and professional tech." },
  { name: "Creamy Beige Cozy", baseHex: "#F5F5DC", secondary: "#D2B48C", accent: "#8B4513", family: "brown", category: "Warm and Cozy", desc: "Comforting beige and earthy wood tones ideal for home decor, cozy cafes, and organic cosmetics." },
  { name: "Midnight Navy Luxury", baseHex: "#030712", secondary: "#1E1B4B", accent: "#F3F4F6", family: "blue", category: "Luxury", desc: "Deep navy darkness and pristine silver highlights, perfect for high-end investment banking and corporate pride." },
  { name: "Soft Lavender Calm", baseHex: "#E9D5FF", secondary: "#FAF5FF", accent: "#7E22CE", family: "purple", category: "Pastel and Soft", desc: "Whispering lavender and orchid shades representing relaxation, sleep, modern aromatherapy, and luxury spas." },
  { name: "Olive Green Glow", baseHex: "#3F6212", secondary: "#D9F99D", accent: "#1E3A8A", family: "green", category: "Vintage and Retro", desc: "Retro olive green paired with golden glow accents, giving a grounded, retro-chic 1970s aesthetic." },
  { name: "Sweet Candy Blue", baseHex: "#E0F2FE", secondary: "#38BDF8", accent: "#F472B6", family: "blue", category: "Education and Kids", desc: "Bright candy blue and bubblegum pink, perfect for playful toy designs, kids products, and candy shops." },
  { name: "Rich Amber Night", baseHex: "#111827", secondary: "#B45309", accent: "#F59E0B", family: "orange", category: "Dark Mode and Deep", desc: "Deep shadow black and glowing amber highlights, capturing a warm campfire night or rich whiskey branding." },
  { name: "Teal Turquoise Pop", baseHex: "#0F766E", secondary: "#2DD4BF", accent: "#FF4500", family: "teal", category: "E-commerce and Retail", desc: "Vivid turquoise and coral red pop accents, stimulating conversion and attention on modern digital storefronts." }
];

// Color Psychology lookup based on color family
const COLOR_PSYCHOLOGY: { [key: string]: string } = {
  red: "Red stimulates action, energy, and physical passion. It is an ideal high-visibility accent for sports, fast food, and urgent CTA buttons.",
  orange: "Orange radiates optimism, creativity, and warmth. It fosters a feeling of friendliness, impulse purchasing, and energetic brand adventure.",
  yellow: "Yellow signifies clarity, warmth, and high intelligence. It captures attention quickly and brings a feeling of youthful optimism.",
  green: "Green represents natural health, organic growth, and fresh stability. It reduces heart rate and creates trust in financial or eco-friendly spaces.",
  teal: "Teal balances the serene calm of blue and the organic energy of green, expressing modern clarity, high intellect, and tech elegance.",
  blue: "Blue represents trust, authority, and security. It is the gold standard for global corporations, software platforms, and medical institutions.",
  purple: "Purple combines the fierce power of red and the stable calm of blue, creating a feeling of luxury, mystery, spirituality, and creativity.",
  pink: "Pink evokes soft compassion, nurturing warmth, and fashion-forward streetwear playfulness. It is highly engaging and emotionally inviting.",
  brown: "Brown offers absolute stability, organic comfort, and earthy grounding, evoking rich wood, soil, quality crafts, and vintage heritage.",
  gray: "Gray is highly neutral, modern, and industrial. It signifies pure balance, metal sophistication, and allows content colors to shine.",
  black: "Black is the ultimate signature of raw power, luxury, mystery, and formal premium business elegance in modern sleek interfaces.",
  white: "White projects clean clarity, open airspace, and minimalism, giving interfaces generous space and sophisticated clarity.",
  multicolor: "Multicolor systems project total inclusivity, creative play, child-like wonder, and endless choice for diverse global brands."
};

const BASE_PALETTES: Palette[] = [];

// Seed the 33 initial curated palettes directly from the PRD seed themes
SEED_THEMES.forEach((theme, index) => {
  const hex1 = theme.baseHex;
  const hex2 = theme.secondary;
  const hex3 = theme.accent;
  // Let's build a clean 5-color palette for each
  const { h, s, l } = hexToHsl(hex1);
  const hex4 = hslToHex((h + 180) % 360, Math.max(20, s - 20), Math.min(85, l + 15)); // complementary tint
  const hex5 = hslToHex(h, Math.max(10, s - 30), Math.max(5, l - 15)); // darker shade

  const colors = [hex1, hex2, hex3, hex4, hex5];

  // Suggested roles
  const roles = {
    dominant: hex1,
    secondary: hex2,
    accent: hex3,
    text: l > 60 ? "#111827" : "#F9FAFB",
    ui: hex4
  };

  BASE_PALETTES.push({
    id: `seed-${index + 1}`,
    name: theme.name,
    colors,
    roles,
    tags: [theme.category, "Trending"],
    colorFamilies: [theme.family],
    description: `${theme.desc} ${COLOR_PSYCHOLOGY[theme.family] || ""}`,
    views: Math.floor(Math.random() * 500) + 200,
    copies: Math.floor(Math.random() * 150) + 50,
    favorites: Math.floor(Math.random() * 80) + 10
  });
});

// PROGRAMMATIC EXPANSION SYSTEM: Expand to 1050+ unique, beautifully named and tagged palettes
const EXTENSION_CATEGORIES = STYLE_CATEGORIES;
const ADJECTIVES = [
  "Nordic", "Cyber", "Royal", "Sunset", "Forest", "Vintage", "Desert", "Arctic", "Mountain",
  "Oceanic", "Glow", "Cloud", "Shadow", "Tokyo", "Paris", "London", "Sahara", "Cosmic", "Lunar",
  "Solar", "Zen", "Dynamic", "Minimal", "Sleek", "Premium", "Prism", "Radiant", "Cozy", "Classic",
  "Hyper", "Ethereal", "Serene", "Bold", "Luminous", "Mystic", "Eternal", "Urban", "Vintage", "Deco",
  "Luxe", "Amber", "Citrus", "Marine", "Glacial", "Autumnal", "Verdant", "Orchid", "Blossom"
];

const NOUNS = [
  "Breeze", "Pulse", "Shadow", "Mist", "Horizon", "Ascent", "Glow", "Aura", "Haze", "Tide",
  "Peak", "Glance", "Sanctuary", "Vibe", "Terminal", "Nexus", "Portal", "Spire", "Dune", "Flow",
  "Oasis", "Vault", "Beacon", "Cove", "Echo", "Domain", "Vista", "Current", "Vortex", "Haven",
  "Bloom", "Canvas", "Spectrum", "Chamber", "Ridge", "Coast", "Symphony", "Harmonics", "Matrix"
];

// To ensure deterministic and high quality output, let's systematically generate combinations
let idCounter = 34;

// We will iterate through each color family and generate distinct palettes
COLOR_FAMILIES.forEach((family) => {
  // Let's determine some hue anchors for this color family
  let baseHue = 0;
  switch (family) {
    case "red": baseHue = 0; break;
    case "orange": baseHue = 30; break;
    case "yellow": baseHue = 55; break;
    case "green": baseHue = 120; break;
    case "teal": baseHue = 175; break;
    case "blue": baseHue = 220; break;
    case "purple": baseHue = 280; break;
    case "pink": baseHue = 330; break;
    case "brown": baseHue = 25; break; // Orange-ish, low lightness
    case "gray": baseHue = 200; break; // Blue-gray
    case "black": baseHue = 0; break;
    case "white": baseHue = 60; break;
    case "multicolor": baseHue = 180; break;
  }

  // Generate around 85 palettes per family to reach ~1100 total
  const palettesCountToGenerate = family === "multicolor" ? 90 : 80;

  for (let i = 0; i < palettesCountToGenerate; i++) {
    // Vary hue slightly
    const h = (baseHue + (i * 7.5)) % 360;
    let s = 65;
    let l = 50;

    // Adjust saturation & lightness for specific families
    if (family === "brown") {
      s = 40 + (i % 3) * 10;
      l = 25 + (i % 4) * 5;
    } else if (family === "gray") {
      s = 5 + (i % 3) * 5;
      l = 30 + (i % 6) * 10;
    } else if (family === "black") {
      s = 10 + (i % 3) * 10;
      l = 5 + (i % 3) * 5;
    } else if (family === "white") {
      s = 5 + (i % 3) * 5;
      l = 92 + (i % 3) * 2;
    } else if (family === "multicolor") {
      s = 70 + (i % 3) * 10;
      l = 50 + (i % 2) * 5;
    }

    // Generate 5 distinct, harmonious colors using a variation technique
    const colors: string[] = [];
    if (family === "multicolor") {
      // In multicolor, colors are spread across the wheel (Analogous / Triadic)
      colors.push(hslToHex(h, s, l));
      colors.push(hslToHex((h + 60) % 360, s - 10, l));
      colors.push(hslToHex((h + 120) % 360, s, l - 10));
      colors.push(hslToHex((h + 180) % 360, s - 15, l + 10));
      colors.push(hslToHex((h + 240) % 360, s, l + 5));
    } else if (i % 3 === 0) {
      // Monochromatic
      colors.push(hslToHex(h, s, Math.min(95, l + 30))); // Dominant (Light)
      colors.push(hslToHex(h, Math.max(10, s - 20), Math.max(10, l - 25))); // Deep secondary
      colors.push(hslToHex(h, s + 10, l)); // Accent
      colors.push(hslToHex(h, Math.max(5, s - 40), Math.min(98, l + 40))); // Light text/bg
      colors.push(hslToHex(h, Math.min(90, s + 5), Math.max(15, l - 15))); // UI/Link
    } else if (i % 3 === 1) {
      // Analogous
      colors.push(hslToHex(h, s, l)); // Dominant
      colors.push(hslToHex((h + 30) % 360, s - 10, l + 10)); // Secondary
      colors.push(hslToHex((h - 30 + 360) % 360, s + 10, l - 10)); // Accent
      colors.push(hslToHex(h, Math.max(10, s - 30), Math.min(96, l + 35))); // Light bg
      colors.push(hslToHex((h + 15) % 360, s, l - 5)); // UI
    } else {
      // Complementary split
      colors.push(hslToHex(h, s - 15, l)); // Dominant
      colors.push(hslToHex((h + 180) % 360, s - 5, l + 10)); // Secondary (Complementary)
      colors.push(hslToHex((h + 150) % 360, s, l - 5)); // Accent
      colors.push(hslToHex(h, Math.max(5, s - 40), Math.max(10, l - 35))); // Dark UI
      colors.push(hslToHex((h + 210) % 360, s + 10, l)); // UI/Link
    }

    // Assign roles dynamically
    const dominant = colors[0];
    const secondary = colors[1];
    const accent = colors[2];
    const text = hexToHsl(dominant).l > 60 ? "#111827" : "#F9FAFB";
    const ui = colors[4] || colors[3];

    // Pick unique tags and categories
    const primaryCat = EXTENSION_CATEGORIES[(i + idCounter) % EXTENSION_CATEGORIES.length];
    const secondaryCat = EXTENSION_CATEGORIES[(i * 3 + idCounter + 5) % EXTENSION_CATEGORIES.length];

    // Add "Trending" to every 8th expanded palette
    const tags = [primaryCat];
    if (secondaryCat !== primaryCat) tags.push(secondaryCat);
    if (i % 8 === 0) tags.push("Trending");

    // Make an evocative name
    const adj = ADJECTIVES[(i * 17 + idCounter) % ADJECTIVES.length];
    const noun = NOUNS[(i * 13 + idCounter + 3) % NOUNS.length];
    const familyCap = family.charAt(0).toUpperCase() + family.slice(1);
    const name = `${adj} ${familyCap} ${noun}`;

    // Color psychology sentence
    const psychologySentence = COLOR_PSYCHOLOGY[family] || "This palette works beautifully in digital layouts.";
    const description = `A professionally balanced ${primaryCat.toLowerCase()} combination featuring ${familyCap} as its dominant element. Perfect for ${primaryCat.toLowerCase()} layouts. ${psychologySentence}`;

    BASE_PALETTES.push({
      id: `p-${idCounter}`,
      name,
      colors,
      roles: { dominant, secondary, accent, text, ui },
      tags,
      colorFamilies: [family],
      description,
      views: Math.floor(Math.random() * 200) + 10,
      copies: Math.floor(Math.random() * 60) + 2,
      favorites: Math.floor(Math.random() * 20) + 1
    });

    idCounter++;
  }
});

// Seed color of the day & editor choice initial state
export let COLOR_OF_THE_DAY_ID = "seed-8"; // Dark Blue Galaxy
export let EDITORS_CHOICE_ID = "seed-1"; // Luxury Cream Tones

export function setFeaturedIds(colorOfDay: string, editorsChoice: string) {
  COLOR_OF_THE_DAY_ID = colorOfDay;
  EDITORS_CHOICE_ID = editorsChoice;
}

import { NEW_PALETTES } from "./new_palettes";

// In-Memory Database for Phase 1 runtime
let activePalettes = [...BASE_PALETTES, ...NEW_PALETTES];

export function getPalettes(): Palette[] {
  return activePalettes;
}

export function setPalettes(newPalettes: Palette[]) {
  activePalettes = newPalettes;
}

export function addPalette(palette: Palette) {
  activePalettes.push(palette);
}

export function updatePalette(updated: Palette) {
  activePalettes = activePalettes.map(p => p.id === updated.id ? updated : p);
}

export function deletePalette(id: string) {
  activePalettes = activePalettes.filter(p => p.id !== id);
}

// System support to reset to base seeds
export function resetPalettes() {
  activePalettes = [...BASE_PALETTES];
}
