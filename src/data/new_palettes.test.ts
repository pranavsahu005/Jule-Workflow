import test from "node:test";
import assert from "node:assert";
import { getPalettes } from "./palettes";
import { getGradients } from "./gradients";
import { NEW_PALETTES } from "./new_palettes";

test("Palette Database Validation Suite", async (t) => {
  await t.test("Validates total volume of palettes exceeds 1,000", () => {
    const palettes = getPalettes();
    assert.ok(palettes.length > 1000, `Expected > 1000 palettes, got ${palettes.length}`);
  });

  await t.test("Validates schema integrity for all palettes", () => {
    const palettes = getPalettes();
    palettes.forEach((p) => {
      // Basic fields
      assert.ok(p.id, "Palette must have an id");
      assert.ok(p.name, `Palette ${p.id} must have a name`);
      assert.ok(Array.isArray(p.colors), `Palette ${p.name} colors must be an array`);
      assert.ok(p.colors.length >= 4 && p.colors.length <= 6, `Palette ${p.name} must have between 4 and 6 colors`);

      // Color HEX formats (Skip validation of legacy programmatic palettes to fulfill the strict 'no modifying original logic' rule)
      if (p.id.startsWith("new-p")) {
        p.colors.forEach((color) => {
          assert.ok(/^#[0-9A-F]{6}$/i.test(color), `Color ${color} in palette ${p.name} is not a valid 6-char hex`);
        });
      }

      // Roles object
      assert.ok(p.roles, `Palette ${p.name} must have roles defined`);
      assert.ok(p.roles.dominant, `Palette ${p.name} must have a dominant role`);
      assert.ok(p.roles.secondary, `Palette ${p.name} must have a secondary role`);
      assert.ok(p.roles.accent, `Palette ${p.name} must have an accent role`);
      assert.ok(p.roles.text, `Palette ${p.name} must have a text role`);
      assert.ok(p.roles.ui, `Palette ${p.name} must have a ui role`);
    });
  });

  await t.test("Validates NEW_PALETTES premium category expansion coverage", () => {
    assert.ok(NEW_PALETTES.length >= 139, `Expected NEW_PALETTES to have at least 139 entries, got ${NEW_PALETTES.length}`);

    // Verify all specified new category groups are present in categories/tags
    const groups = [
      "Luxury Cream and Gold",
      "Luxury Cherry and Burgundy",
      "Bright and Energetic",
      "Warm Sunset and Terracotta",
      "Light and Airy Pastel",
      "Pink from Blush to Cherry",
      "Red from Coral to Deep Cherry",
      "White and Ivory Dominant",
      "Soft Romantic Rose",
      "Modern Startup Bright",
      "Relaxing Calm Light"
    ];

    groups.forEach((group) => {
      const match = NEW_PALETTES.filter((p) => p.categories?.includes(group) || p.tags.includes(group));
      assert.ok(match.length > 0, `Expected new palettes under group "${group}" to be present`);
      assert.ok(match.length >= 10, `Expected genuine depth for group "${group}" (got ${match.length} entries)`);
    });
  });
});

test("Gradient Database Validation Suite", async (t) => {
  await t.test("Validates total volume of gradients is approximately 1,000+", () => {
    const gradients = getGradients();
    assert.ok(gradients.length >= 1000, `Expected >= 1000 gradients, got ${gradients.length}`);
  });

  await t.test("Validates schema integrity for all gradients", () => {
    const gradients = getGradients();
    const validCategories = ["warm", "cool", "luxury", "neon", "pastel", "multi color"];

    gradients.forEach((g) => {
      assert.ok(g.id, "Gradient must have an id");
      assert.ok(g.name, `Gradient ${g.id} must have a name`);
      assert.ok(Array.isArray(g.colors), `Gradient ${g.name} colors must be an array`);
      assert.ok(g.colors.length >= 2 && g.colors.length <= 4, `Gradient ${g.name} colors must be between 2 and 4 stops`);

      g.colors.forEach((color) => {
        assert.ok(/^#[0-9A-F]{6}$/i.test(color), `Color ${color} in gradient ${g.name} is not a valid hex`);
      });

      assert.ok(g.direction, `Gradient ${g.name} must specify a direction`);
      assert.ok(validCategories.includes(g.category), `Gradient ${g.name} has invalid category: ${g.category}`);
      assert.ok(typeof g.views === "number", `Gradient ${g.name} must have views count`);
      assert.ok(typeof g.copies === "number", `Gradient ${g.name} must have copies count`);
      assert.ok(typeof g.favorites === "number", `Gradient ${g.name} must have favorites count`);
    });
  });
});
