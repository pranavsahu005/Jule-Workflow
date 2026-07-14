import { Palette } from "./palettes";

// Helpers for HSL to HEX
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

const GROUPS = [
  {
    categoryGroup: "Luxury Cream and Gold",
    tags: ["Luxury", "Minimal and Monochrome"],
    families: ["white", "yellow", "brown"],
    names: [
      "Alabaster Gilded Spire", "Champagne Velvet Sovereign", "Ivory Silk Regency",
      "Florentine Gold Brocade", "Imperial Cream Monarch", "Corinthian Marble Crest",
      "Versailles Gilded Salon", "Opulent Alabaster Arch", "Gilded Cashmere Horizon",
      "Sovereign Cream Tapestry", "Byzantine Ivory Halo", "Gilded Sand Serenade",
      "Royal Cream Damask", "Aurum Marble Oasis", "Majestic Gilded Haven"
    ],
    generate: (idx: number) => {
      const h = 42 + (idx * 0.5);
      const dom = hslToHex(h, 15, 96 - (idx % 3));
      const sec = hslToHex(44 + (idx % 3) * 2, 65, 55 - (idx % 2) * 5); // Rich gold
      const acc = hslToHex(20 + (idx % 4) * 5, 20, 15 + (idx % 3) * 3); // Warm charcoal
      const text = "#111827";
      const ui = hslToHex(h, 20, 85 - (idx % 3) * 5);
      const colors = [dom, sec, acc, ui, hslToHex(h, 40, 75)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "A luxurious and warm neutral cream composition with glowing gold accents, creating an aura of timeless prestige and upscale quality."
  },
  {
    categoryGroup: "Luxury Cherry and Burgundy",
    tags: ["Luxury", "Fashion and Beauty"],
    families: ["red", "pink", "white"],
    names: [
      "Sovereign Cherry Manor", "Bordeaux Silk Opulence", "Crimson Velvet Chateau",
      "Royal Burgundy Tapestry", "Imperial Cherry Brocade", "Baroque Rose Crimson",
      "Gilded Merlot Canopy", "Vintner Gold Sovereign", "Regal Cherry Damask",
      "Burgundy Cashmere Crest", "Bordeaux Gilded Pavilion", "Sovereign Rose Merlot",
      "Cherry Silk Alcove", "Majestic Burgundy Gala", "Sultry Crimson Brocade"
    ],
    generate: (idx: number) => {
      const h = 345 + (idx * 0.8);
      const dom = hslToHex(h, 60, 20 + (idx % 3) * 4); // Deep Cherry/Burgundy
      const sec = hslToHex(35, 40, 88 - (idx % 3) * 3); // Champagne/Ivory
      const acc = hslToHex(45, 65, 55 - (idx % 3) * 2); // Rich gold
      const text = "#F9FAFB";
      const ui = hslToHex(h, 45, 35);
      const colors = [dom, sec, acc, ui, hslToHex(h, 30, 70)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "Deep regal cherry and opulent burgundy hues paired with rose champagne and gold, evoking high fashion, beauty, and prestigious luxury."
  },
  {
    categoryGroup: "Bright and Energetic",
    tags: ["Bright and High Contrast", "Startup and SaaS"],
    families: ["multicolor", "blue", "orange"],
    names: [
      "Electric Surge Kinetics", "Vivid Neon Spark", "Hyperdrive Kinetic Pulse",
      "Quantum Cyan Blitz", "Volt Spark Catalyst", "Infinite Neon Horizon",
      "Sonic Orange Dynamo", "Prismatic Kinetic Flow", "Solar Flare Catalyst",
      "Vibrant Synergy Spark", "Fusion Charge Dynamo", "Spectral Volt Pulse",
      "Kinetic Shock Wave", "Electric Pulse Echo", "Dynamo Horizon Spark"
    ],
    generate: (idx: number) => {
      const h = (180 + idx * 24) % 360;
      const dom = "#F8FAFC";
      const sec = hslToHex(h, 95, 50); // Vibrant electric
      const acc = hslToHex((h + 120) % 360, 100, 50); // High-contrast neon
      const text = "#0F172A";
      const ui = hslToHex(h, 80, 40);
      const colors = [dom, sec, acc, ui, hslToHex((h + 240) % 360, 90, 45)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "An electric and highly vibrant modern setup, designed to burst with energetic movement, creativity, and ultimate action."
  },
  {
    categoryGroup: "Warm Sunset and Terracotta",
    tags: ["Warm and Cozy", "Earthy and Organic"],
    families: ["orange", "brown", "red"],
    names: [
      "Sahara Clay Serenade", "Tuscan Sunset Haven", "Mesa Terracotta Glow",
      "Sienna Ridge Sanctuary", "Earthy Clay Ochre", "Amber Sunset Horizon",
      "Terracotta Dune Vista", "Warm Adobe Solace", "Sedona Clay Echo",
      "Autumn Sienna Glow", "Suntanned Terracotta Ridge", "Cozy Hearth Sienna",
      "Desert Adobe Horizon", "Sienna Clay Oasis", "Golden Mesa Canopy"
    ],
    generate: (idx: number) => {
      const h = 18 + (idx * 1.2);
      const dom = hslToHex(h, 60, 48 - (idx % 3) * 3); // Terracotta/Clay
      const sec = hslToHex(35, 75, 88 - (idx % 3) * 3); // Soft peach
      const acc = hslToHex(240 + (idx % 3) * 15, 45, 18); // Deep space indigo/teal
      const text = "#F9FAFB";
      const ui = hslToHex(h, 50, 30);
      const colors = [dom, sec, acc, ui, hslToHex(h, 80, 65)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "Grounded earthy terracotta and warm desert sand tones harmonized with twilight indigo, capturing the serene comfort of a rustic sunset."
  },
  {
    categoryGroup: "Light and Airy Pastel",
    tags: ["Pastel and Soft", "Cool and Calm"],
    families: ["pink", "blue", "green", "white"],
    names: [
      "Morning Dew Breeze", "Pale Lavender Mist", "Soft Meadow Whispers",
      "Ethereal Mint Oasis", "Dreamy Azure Horizon", "Pale Blush Zephyr",
      "Calm Orchid Sanctuary", "Whispering Sea Foam", "Serene Lilac Canopy",
      "Airy Peach Horizon", "Morning Orchid Mist", "Soft Petal Whispers",
      "Luminous Mint Serene", "Ethereal Cloud Breeze", "Delicate Sky Zephyr"
    ],
    generate: (idx: number) => {
      const h = (180 + idx * 15) % 360;
      const dom = hslToHex(h, 20, 97); // Airy tinted white
      const sec = hslToHex((h + 40) % 360, 60, 85); // Soft pastel mint/sky
      const acc = hslToHex((h + 160) % 360, 75, 70); // Warm coral/pink accent
      const text = "#334155";
      const ui = hslToHex(h, 40, 88);
      const colors = [dom, sec, acc, ui, hslToHex((h + 120) % 360, 50, 80)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "An extremely light, airy, and calming pastel aesthetic, carrying whispers of soft morning mist and delicate spring blossoms."
  },
  {
    categoryGroup: "Pink from Blush to Cherry",
    tags: ["Fashion and Beauty", "Pastel and Soft"],
    families: ["pink", "red"],
    names: [
      "Blush Velvet Cherry", "Cherry Blossom Silk", "Satin Rose Sovereign",
      "Petal Blush Cascade", "Rich Cherry Brocade", "Dusky Rose Sovereign",
      "Blush Silk Canopy", "Cherry Velvet Horizon", "Satin Rosewood Arch",
      "Dahlia Rose Regency", "Blushing Cherry Crest", "Petal Silk Pavilion",
      "Soft Orchid Brocade", "Elegant Rosewood Haven", "Blush Satin Alcove"
    ],
    generate: (idx: number) => {
      const h = 330 + (idx * 1.5);
      const dom = hslToHex(h, 45, 93 - (idx % 3) * 2); // Blush Pink
      const sec = hslToHex(345 + (idx % 2) * 5, 80, 45 - (idx % 3) * 4); // Rich Cherry
      const acc = hslToHex(200, 15, 20); // Dark contrast charcoal
      const text = "#1E293B";
      const ui = hslToHex(h, 50, 80);
      const colors = [dom, sec, acc, ui, hslToHex(h, 90, 65)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "A stunning exploration of pinks, bridging soft powdery blush and deep saturated sweet cherries for high-end fashion and lifestyle."
  },
  {
    categoryGroup: "Red from Coral to Deep Cherry",
    tags: ["Bright and High Contrast", "Warm and Cozy"],
    families: ["red", "white"],
    names: [
      "Coral Crimson Glow", "Sultry Cherry Hearth", "Deep Carmine Solace",
      "Scarlet Coral Horizon", "Burgundy Crimson Tapestry", "Rich Coral Sienna",
      "Sultry Coral Canopy", "Deep Cherry Solace", "Garnet Hearth Sovereign",
      "Vivid Coral Damask", "Sienna Crimson Alcove", "Deep Coral Fireplace",
      "Sultry Scarlet Vista", "Baroque Carmine Crest", "Spiced Coral Sanctuary"
    ],
    generate: (idx: number) => {
      const h = 2 + (idx * 1.1);
      const dom = hslToHex(h, 85, 55 - (idx % 3) * 3); // Coral Crimson
      const sec = hslToHex(345 + (idx % 2) * 10, 75, 18); // Deep Cherry
      const acc = hslToHex(45, 30, 95); // Pale ivory
      const text = "#F9FAFB";
      const ui = hslToHex(h, 75, 35);
      const colors = [dom, sec, acc, ui, hslToHex(h, 90, 45)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "A passionate spectrum of red tones spanning bright coral highlights to deep, comforting cherry wood fires, creating rich warmth and focus."
  },
  {
    categoryGroup: "White and Ivory Dominant",
    tags: ["Minimal and Monochrome", "Corporate and Business"],
    families: ["white", "gray"],
    names: [
      "Alabaster Calm Minimal", "Pure Ivory Sanctuary", "Crisp Alabaster Horizon",
      "Sleek Ivory Monolith", "Porcelain Air Minimal", "Slight Ivory Crest",
      "Alabaster Silk Gallery", "Minimalist Cloud Ivory", "Clean Alabaster Haven",
      "Polished Ivory Atelier", "Alabaster Studio Slate", "Sleek Alabaster Canopy",
      "Pristine Ivory Column", "Chalk White Atelier", "Pure Alabaster Solace"
    ],
    generate: (idx: number) => {
      const dom = idx % 2 === 0 ? "#FFFFFF" : "#FAF9F6";
      const sec = hslToHex(210, 10, 93 - (idx % 3) * 4); // Cool/warm grays
      const acc = hslToHex(220 - (idx % 3) * 10, 40, 22); // Deep premium navy/charcoal
      const text = "#1E293B";
      const ui = hslToHex(200, 10, 85);
      const colors = [dom, sec, acc, ui, "#E2E8F0"];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "An ultra-clean minimalist white and premium ivory canvas supported by cool steel grays, optimizing content focus and modern clarity."
  },
  {
    categoryGroup: "Soft Romantic Rose",
    tags: ["Wedding and Events", "Pastel and Soft"],
    families: ["pink", "white", "green"],
    names: [
      "Vintage Rose Promenade", "Dusky Rose Romance", "Blushing Bridal Veil",
      "Soft Rosewood Serenade", "Romantic Petal Canopy", "Dusky Rosewood Oasis",
      "Ethereal Bridal Rose", "Blush Promenade Canopy", "Satin Rosewood Arch",
      "Soft Orchid Solace", "Sweetheart Rose Pavilion", "Romantic Sage Blossom",
      "Blush Peony Promenade", "Dusky Petal Sanctuary", "Soft Rosewood Harmony"
    ],
    generate: (idx: number) => {
      const h = 340 + (idx * 0.7);
      const dom = hslToHex(h, 35, 82 - (idx % 3) * 3); // Dusty Rose
      const sec = hslToHex(140 + (idx % 3) * 15, 15, 93); // Soft Sage/Cream
      const acc = hslToHex(330, 60, 35); // Deep wine/berry accent
      const text = "#3C2A30";
      const ui = hslToHex(h, 25, 70);
      const colors = [dom, sec, acc, ui, hslToHex(h, 40, 90)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "Delicate dusty rose and pale romantic blush harmonized with clean sage accents, creating a timeless and deeply intimate romantic aesthetic."
  },
  {
    categoryGroup: "Modern Startup Bright",
    tags: ["Startup and SaaS", "Finance and Fintech"],
    families: ["blue", "multicolor", "white"],
    names: [
      "Cloud SaaS Velocity", "Modern Fintech Forge", "Quantum Tech Catalyst",
      "Hyperblue Cloud Horizon", "Tech Purple Kinetic", "Vivid Startup Catalyst",
      "SaaS Blue Momentum", "Fintech Charge Dynamo", "Cloud Velocity Pulse",
      "SaaS Spark Catalyst", "Vivid Blue Pulse", "Modern SaaS Horizon",
      "Fintech Core Pulse", "Hyper SaaS Kinetic", "Vivid Tech Wave"
    ],
    generate: (idx: number) => {
      const dom = "#F8FAFC";
      const sec = hslToHex(220 + (idx % 3) * 15, 85, 55); // Tech blue/indigo
      const acc = hslToHex(340 - (idx % 3) * 20, 95, 50); // Energetic accent (hot pink/orange)
      const text = "#0F172A";
      const ui = hslToHex(220, 30, 92);
      const colors = [dom, sec, acc, ui, hslToHex(220, 85, 45)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "A highly-polished modern tech aesthetic combining high-visibility royal blues and electric pinks, customized for fast-growing platforms."
  },
  {
    categoryGroup: "Relaxing Calm Light",
    tags: ["Healthcare and Wellness", "Cool and Calm"],
    families: ["teal", "blue", "green"],
    names: [
      "Sea Mist Sanctuary", "Calm Teal Oasis", "Serene Blue Lagoon",
      "Morning Spa Breeze", "Calming Mint Horizon", "Relaxing Sea Foam",
      "Peaceful Teal Horizon", "Serene Slate Lagoon", "Morning Sea Mist",
      "Calm Wellness Retreat", "Teal Spa Serenade", "Peaceful Blue Breeze",
      "Calm Mist Sanctuary", "Serene Ocean Whispers", "Relaxing Meadow Sea"
    ],
    generate: (idx: number) => {
      const h = 175 + (idx * 2.5);
      const dom = hslToHex(h, 30, 96); // Soft pale teal/mist
      const sec = hslToHex(h, 45, 40); // Deep ocean teal/blue
      const acc = hslToHex(350 + (idx % 3) * 20, 60, 85); // Peach glow accent
      const text = "#1E293B";
      const ui = hslToHex(h, 25, 85);
      const colors = [dom, sec, acc, ui, hslToHex(h, 40, 70)];
      return { colors, roles: { dominant: dom, secondary: sec, accent: acc, text, ui } };
    },
    desc: "Refreshing sea mist, ocean teal, and pale lavender hues, specifically designed to promote ultimate mental relaxation, focus, and health."
  }
];

// Compile the 165 new palettes
export const NEW_PALETTES: Palette[] = [];

let idCounter = 2000;

GROUPS.forEach((group) => {
  group.names.forEach((name, idx) => {
    const { colors, roles } = group.generate(idx);

    // Build the fully-compatible, rich palette record
    NEW_PALETTES.push({
      id: `new-p-${idCounter}`,
      name,
      colors,
      roles: {
        dominant: roles.dominant,
        secondary: roles.secondary,
        accent: roles.accent,
        text: roles.text,
        ui: roles.ui,
        // PRD schema compliance: primary/secondary background, etc.
        "primary background": roles.dominant,
        "secondary background": roles.secondary,
      } as any,
      tags: [...group.tags, group.categoryGroup], // Tag into existing tags AND the new sub-category tag for fidelity
      colorFamilies: group.families,
      description: `${group.desc} Fully optimized using visual scale patterns.`,
      views: Math.floor(Math.random() * 250) + 100,
      copies: Math.floor(Math.random() * 80) + 15,
      favorites: Math.floor(Math.random() * 45) + 5,
      // PRD specific fields
      color_family: group.families[0],
      categories: [...group.tags, group.categoryGroup],
      is_featured: idx === 0, // Mark the first of each group as featured
      is_editor_choice: idx === 4, // Mark some as editor's choice
      view_count: Math.floor(Math.random() * 250) + 100,
      copy_count: Math.floor(Math.random() * 80) + 15,
      favorite_count: Math.floor(Math.random() * 45) + 5,
    });

    idCounter++;
  });
});
