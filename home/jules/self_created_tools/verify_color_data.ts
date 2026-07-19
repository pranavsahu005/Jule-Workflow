import { NEW_PALETTES } from "../../../src/data/new_palettes";
import { getPalettes } from "../../../src/data/palettes";
import { getGradients } from "../../../src/data/gradients";

function main() {
  console.log("=== HEXATOM DATA INTEGRITY & VOLUME VERIFICATION ===\n");

  // 1. Palettes verification
  const allPalettes = getPalettes();
  console.log(`Total Palettes available: ${allPalettes.length}`);
  console.log(`Newly added Phase 2.5 Palettes: ${NEW_PALETTES.length}`);

  const categoryCounts: Record<string, number> = {};
  const familyCounts: Record<string, number> = {};

  allPalettes.forEach((p) => {
    p.tags.forEach((t) => {
      categoryCounts[t] = (categoryCounts[t] || 0) + 1;
    });
    p.colorFamilies.forEach((f) => {
      familyCounts[f] = (familyCounts[f] || 0) + 1;
    });
  });

  console.log("\nTop Palette Categories:");
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([cat, count]) => {
      console.log(`  - ${cat}: ${count}`);
    });

  console.log("\nPalette Color Families:");
  Object.entries(familyCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([fam, count]) => {
      console.log(`  - ${fam}: ${count}`);
    });

  // 2. Gradients verification
  const allGradients = getGradients();
  console.log(`\nTotal Gradients: ${allGradients.length}`);

  const gradCatCounts: Record<string, number> = {};
  allGradients.forEach((g) => {
    gradCatCounts[g.category] = (gradCatCounts[g.category] || 0) + 1;
  });

  console.log("\nGradient Categories:");
  Object.entries(gradCatCounts).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}`);
  });

  console.log("\n====================================================");
}

main();
export {};
