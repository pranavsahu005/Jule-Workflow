"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, HelpCircle, Eye, ChevronRight, Compass, Shield, Sparkles } from "lucide-react";

export default function ColorGuides() {
  const [activeArticle, setActiveArticle] = useState<string>("sixty-thirty-ten");

  const articles = [
    {
      id: "sixty-thirty-ten",
      title: "The 60-30-10 Rule of Visual Balance",
      subtitle: "The gold standard interior design formula applied to user interfaces.",
      icon: Compass,
      category: "Theory",
      content: (
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
          <p>
            When creating digital products, one of the most common mistakes designers and developers make is utilizing colors in equal proportions. This creates visual noise, makes pages hard to read, and tires the user's eyes.
          </p>
          <p className="font-extrabold text-slate-900 text-base">
            What is the 60-30-10 Rule?
          </p>
          <p>
            The 60-30-10 rule is a timeless formula that ensures perfect proportional distribution of color. It states that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>60% Dominant (The Canvas):</strong> Typically assigned to the page background. This color creates the overall atmosphere of the application (either light, clean white/cream, or deep dark mode slate).
            </li>
            <li>
              <strong>30% Secondary (The Structure):</strong> Used for content containers, cards, navigation bars, and secondary buttons. It builds structure and separates sections nicely.
            </li>
            <li>
              <strong>10% Accent (The Focus):</strong> Restrained exclusively for primary Call-to-Actions (CTAs), focus states, active badges, and high-visibility notifications. Because it's used so sparingly, it instantly draws attention.
            </li>
          </ul>

          {/* Visual Swatch Demo */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Proportional Swatch Example</span>
            <div className="flex h-12 rounded-lg overflow-hidden">
              <div className="w-[60%] bg-[#FDFBF7] border-r border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600">Dominant (60%)</div>
              <div className="w-[30%] bg-[#D4AF37] border-r border-slate-200 flex items-center justify-center text-[10px] font-black text-white">Secondary (30%)</div>
              <div className="w-[10%] bg-[#1A1A1A] flex items-center justify-center text-[10px] font-black text-white">Accent (10%)</div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-500">
              <span>Cream background</span>
              <span>Luxury Gold layout structures</span>
              <span>Premium Charcoal action</span>
            </div>
          </div>

          <p>
            Applying this rule creates a natural hierarchy. A client browsing your landing page won't have to guess where to look next; their eyes will automatically drift from the clean dominant backdrop to the action button highlighted in your accent color.
          </p>
          <div className="pt-4">
            <Link
              href="/browse?category=Luxury"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition-colors"
            >
              Browse Luxury Palettes <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )
    },
    {
      id: "psychology",
      title: "Color Psychology in Branding",
      subtitle: "How different hues convey emotion and shape user expectations.",
      icon: Sparkles,
      category: "Psychology",
      content: (
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
          <p>
            Colors are not merely aesthetic decisions; they are psychological triggers. Every hue communicates a distinct message to the human brain, stirring specific emotions and shaping how customers perceive a brand's authority or warmth.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Blue (Trust & Security)
              </h5>
              <p className="text-xs text-slate-600 mt-1.5">
                Conveys stability, intelligence, and professional structure. It is the gold standard for financial institutes and SaaS applications.
              </p>
            </div>
            <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Yellow/Gold (Optimism & Luxury)
              </h5>
              <p className="text-xs text-slate-600 mt-1.5">
                Communicates prestigious quality, bright intelligence, and high value. Excellent for luxury fashion and boutique branding.
              </p>
            </div>
            <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Pink/Rose (Compassion & Beauty)
              </h5>
              <p className="text-xs text-slate-600 mt-1.5">
                Soft blush pinks and rose tones inspire warm comfort, intimacy, and lifestyle aesthetics, perfect for fashion e-commerce.
              </p>
            </div>
            <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50">
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Green (Organic & Growth)
              </h5>
              <p className="text-xs text-slate-600 mt-1.5">
                Represents leaf freshness, natural health, stability, and wealth. Great for healthcare, organic food, and eco-friendly SaaS.
              </p>
            </div>
          </div>
          <p>
            By matching your palette with the psychological intent of your brand, you establish implicit alignment. For instance, a wellness spa uses calming pastels or soft sea mist greens instead of high-contrast cyberpunk neon to immediately soothe incoming clients.
          </p>
          <div className="pt-4 flex gap-3 flex-wrap">
            <Link
              href="/browse?family=blue"
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              Explore Royal Blues
            </Link>
            <Link
              href="/browse?family=pink"
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              Explore Blush & Pinks
            </Link>
          </div>
        </div>
      )
    },
    {
      id: "accessibility",
      title: "Building Accessible Color Systems",
      subtitle: "Securing readability and meeting WCAG standards for inclusive design.",
      icon: Shield,
      category: "Accessibility",
      content: (
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
          <p>
            Accessibility is not a compliance checkmark—it is the foundation of outstanding product design. If a reader cannot decipher your text background contrast easily, they will immediately exit your platform.
          </p>
          <p className="font-extrabold text-slate-900 text-base">
            The WCAG Contrast Ratio Standards:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>WCAG AA (Standard):</strong> Demands a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
            </li>
            <li>
              <strong>WCAG AAA (Enhanced):</strong> Demands a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text.
            </li>
          </ul>

          <p>
            In Hexatom, we automatically assign contrasting text colors depending on your chosen dominant role. If your dominant background is a deep, dark slate, your text is computed as white or high-contrast silver to secure maximum ease-of-reading.
          </p>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs">
            <h6 className="font-black">Design Practice Tip:</h6>
            <p className="mt-1 font-medium">
              Avoid overlaying bright, saturated orange or neon green text directly on white backgrounds. Keep your background neutral (like crisp white or cream) and restrain high-contrast saturated colors for borders or buttons.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/browse?category=Minimal and Monochrome"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition-colors"
            >
              Explore High-Contrast Minimal <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )
    },
    {
      id: "product-choices",
      title: "Colors for Specific Industries",
      subtitle: "Fintech apps vs. luxury boutique fashion vs. artificial intelligence startups.",
      icon: HelpCircle,
      category: "Industry",
      content: (
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
          <p>
            Every industry has set expectations. While breaking rules intentionally can make a startup stand out, conforming to industry-specific guidelines helps secure immediate trust from your target audience.
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h5 className="font-black text-slate-900 text-xs">Fintech & Finance</h5>
              <p className="text-xs text-slate-600 mt-1">
                Colors: Royal Blue, Slate Gray, Emerald Green accents. These communicate safe vaults, corporate stability, and financial prosperity.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h5 className="font-black text-slate-900 text-xs">Luxury Fashion & Aesthetics</h5>
              <p className="text-xs text-slate-600 mt-1">
                Colors: Soft Cream, Champagne, Ivory, Metallic Gold, Burgundy. These project heritage craftsmanship, premium boutique comfort, and high caliber value.
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h5 className="font-black text-slate-900 text-xs">SaaS & AI Startups</h5>
              <p className="text-xs text-slate-600 mt-1">
                Colors: Pure White/Black canvas, vibrant Cyan or Cobalt Blue, Cyber Neon highlights. These emphasize fast processing, modern cloud scalability, and futuristic computing power.
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Link
              href="/browse?category=Startup and SaaS"
              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition-colors"
            >
              Explore Startup Themes <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )
    },
    {
      id: "glossary",
      title: "Color Glossary Explained Simply",
      subtitle: "Plain language definitions of hue, saturation, lightness, tints, and shades.",
      icon: BookOpen,
      category: "Vocabulary",
      content: (
        <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
          <p>
            Stop guessing what your designer means when they ask you to adjust the "tone." Here are plain-language definitions of core color vocabulary:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
              <h5 className="font-extrabold text-slate-900 text-xs">Hue</h5>
              <p className="text-xs text-slate-600 mt-1">
                The actual pure color itself (e.g., Red, Blue, Yellow). Think of it as your position around the color wheel.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
              <h5 className="font-extrabold text-slate-900 text-xs">Saturation</h5>
              <p className="text-xs text-slate-600 mt-1">
                The intensity or purity of the color. A saturation of 100% is extremely neon and vibrant, while 0% is completely gray.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
              <h5 className="font-extrabold text-slate-900 text-xs">Lightness</h5>
              <p className="text-xs text-slate-600 mt-1">
                How bright or dark a color is. 100% lightness yields pure white, and 0% lightness yields pure black.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
              <h5 className="font-extrabold text-slate-900 text-xs">Tint vs. Shade</h5>
              <p className="text-xs text-slate-600 mt-1">
                A <strong>Tint</strong> is created by mixing a color with white (lightening it). A <strong>Shade</strong> is created by mixing it with black (darkening it).
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const activeData = articles.find(a => a.id === activeArticle) || articles[0];
  const ActiveIconComponent = activeData.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
          Unified Color Reference Guides
        </h1>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Practical, plain-language reference articles about color theory, visual hierarchy, branding psychology, and Web accessibility.
        </p>
      </div>

      {/* Two-Column Blog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar Index Links */}
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-20 h-fit">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block px-2">Table of Contents</span>
          <div className="flex flex-col gap-1.5 bg-white p-4 border border-slate-200 rounded-2xl shadow-3xs">
            {articles.map((art) => {
              const ArtIcon = art.icon;
              const isActive = art.id === activeArticle;
              return (
                <button
                  key={art.id}
                  onClick={() => setActiveArticle(art.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-start gap-3 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <ArtIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs">{art.title}</span>
                    <span className={`text-[10px] font-semibold mt-0.5 ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                      {art.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Article Content viewport */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-8 rounded-2xl shadow-3xs space-y-6">
          <div className="border-b border-slate-100 pb-5 space-y-2">
            <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2.5 py-0.5 rounded-full tracking-wider">
              {activeData.category}
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ActiveIconComponent className="w-6 h-6 text-indigo-600" />
              {activeData.title}
            </h2>
            <p className="text-sm font-semibold text-slate-400 leading-relaxed">
              {activeData.subtitle}
            </p>
          </div>

          <div className="pt-2 animate-in fade-in duration-150">
            {activeData.content}
          </div>
        </div>

      </div>

    </div>
  );
}
