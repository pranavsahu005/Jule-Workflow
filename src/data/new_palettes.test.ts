import test from "node:test";
import assert from "node:assert";
import { getPalettes } from "./palettes";
import { NEW_PALETTES } from "./new_palettes";
import { getGradients } from "./gradients";

test("Palette Library Integrity & Volume Tests", async (t) => {
  const allPalettes = getPalettes();

  await t.test("should meet the minimum total palette volume targets", () => {
    // Total palettes should be at least 1000+
    assert.ok(allPalettes.length >= 1000, `Expected at least 1000 palettes, got ${allPalettes.length}`);
  });

  await t.test("should have a valid structure for all base and extended palettes", () => {
    allPalettes.forEach((palette) => {
      // Check core fields
      assert.ok(palette.id, "Palette must have a unique ID");
      assert.ok(palette.name, `Palette ${palette.id} must have a name`);
      assert.ok(Array.isArray(palette.colors), `Palette ${palette.name} must have colors array`);
      assert.ok(palette.colors.length >= 4 && palette.colors.length <= 6, `Palette ${palette.name} colors length must be between 4 and 6`);

      // Validate hex codes
      palette.colors.forEach((color) => {
        assert.ok(/^#[0-9A-F]{6}$/i.test(color), `Color ${color} in palette ${palette.name} must be a valid 6-character hex code`);
      });

      // Check roles
      assert.ok(palette.roles, `Palette ${palette.name} must define roles`);
      assert.ok(palette.roles.dominant, `Palette ${palette.name} must have a dominant role`);
      assert.ok(palette.roles.secondary, `Palette ${palette.name} must have a secondary role`);
      assert.ok(palette.roles.accent, `Palette ${palette.name} must have an accent role`);
      assert.ok(palette.roles.text, `Palette ${palette.name} must have a text role`);
    });
  });

  await t.test("should properly tag the 165 premium Phase 2.5 palettes", () => {
    assert.strictEqual(NEW_PALETTES.length, 165, `Expected exactly 165 new premium palettes, got ${NEW_PALETTES.length}`);

    NEW_PALETTES.forEach((palette) => {
      // Validate PRD schema fields
      assert.ok(palette.color_family, `Phase 2.5 palette ${palette.name} must have color_family field`);
      assert.ok(Array.isArray(palette.categories), `Phase 2.5 palette ${palette.name} must have categories array`);
      assert.ok(typeof palette.is_featured === "boolean", `Phase 2.5 palette ${palette.name} must have is_featured boolean`);
      assert.ok(typeof palette.is_editor_choice === "boolean", `Phase 2.5 palette ${palette.name} must have is_editor_choice boolean`);
      assert.ok(typeof palette.view_count === "number", `Phase 2.5 palette ${palette.name} must have view_count`);
      assert.ok(typeof palette.copy_count === "number", `Phase 2.5 palette ${palette.name} must have copy_count`);
      assert.ok(typeof palette.favorite_count === "number", `Phase 2.5 palette ${palette.name} must have favorite_count`);

      // Ensure visual/undertone consistency (no warm/neon direct blending errors unless explicit)
      const hasNeon = palette.tags.includes("Neon and Cyberpunk");
      const hasWarm = palette.tags.includes("Warm and Cozy") || palette.tags.includes("Warm Sunset and Terracotta");
      if (hasNeon && hasWarm) {
        assert.ok(
          palette.name.toLowerCase().includes("fusion") || palette.name.toLowerCase().includes("kinetic"),
          `Palette ${palette.name} blends warm and neon undertones without explicit design labeling`
        );
      }
    });
  });
});

test("Gradient Library Integrity & Volume Tests", async (t) => {
  const allGradients = getGradients();

  await t.test("should meet the minimum total gradient volume target of roughly 1000+", () => {
    assert.ok(allGradients.length >= 1000, `Expected at least 1000 gradients, got ${allGradients.length}`);
  });

  await t.test("should have a valid structure for all gradients", () => {
    allGradients.forEach((grad) => {
      assert.ok(grad.id, "Gradient must have a unique ID");
      assert.ok(grad.name, `Gradient ${grad.id} must have a name`);
      assert.ok(Array.isArray(grad.colors), `Gradient ${grad.name} must have colors array`);
      assert.ok(grad.colors.length >= 2 && grad.colors.length <= 4, `Gradient ${grad.name} colors length must be between 2 and 4`);

      // Validate gradient colors
      grad.colors.forEach((color) => {
        assert.ok(/^#[0-9A-F]{6}$/i.test(color), `Color ${color} in gradient ${grad.name} must be a valid 6-character hex code`);
      });

      assert.ok(grad.direction, `Gradient ${grad.name} must define a direction/angle`);
      assert.ok(
        ["warm", "cool", "luxury", "neon", "pastel", "multi color"].includes(grad.category),
        `Gradient ${grad.name} has invalid category: ${grad.category}`
      );
    });
  });
});
