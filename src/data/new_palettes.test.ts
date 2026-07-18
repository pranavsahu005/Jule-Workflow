import { test } from "node:test";
import assert from "node:assert";
import { NEW_PALETTES } from "./new_palettes";
import { getGradients } from "./gradients";

test("Verify new palettes volume and integrity", () => {
  // Volume check
  assert.ok(NEW_PALETTES.length >= 165, `Expected at least 165 new palettes, got ${NEW_PALETTES.length}`);

  // Schema check for each palette record
  for (const palette of NEW_PALETTES) {
    assert.ok(palette.id, "Palette must have a unique ID");
    assert.ok(palette.name, "Palette must have a name");
    assert.ok(Array.isArray(palette.colors), "Palette colors must be an array");
    assert.ok(palette.colors.length >= 4 && palette.colors.length <= 6, "Palette colors count must be between 4 and 6");

    // Check HEX formatting
    for (const color of palette.colors) {
      assert.match(color, /^#[0-9A-F]{6}$/i, `Color ${color} must be a valid 6-character HEX code`);
    }

    // Role assignment mapping checks
    assert.ok(palette.roles, "Palette must define layout roles");
    assert.ok(palette.roles.dominant, "roles.dominant is required");
    assert.ok(palette.roles.secondary, "roles.secondary is required");
    assert.ok(palette.roles.accent, "roles.accent is required");
    assert.ok(palette.roles.text, "roles.text is required");
    assert.ok(palette.roles.ui, "roles.ui is required");

    // Existing fields compliance check
    assert.ok(palette.tags && Array.isArray(palette.tags), "tags must be an array");
    assert.ok(palette.colorFamilies && Array.isArray(palette.colorFamilies), "colorFamilies must be an array");
    assert.ok(palette.description, "description is required");
    assert.ok(typeof palette.views === "number", "views count must be a number");
    assert.ok(typeof palette.copies === "number", "copies count must be a number");
    assert.ok(typeof palette.favorites === "number", "favorites count must be a number");

    // Additive Phase 2.5 compliance fields
    assert.ok(palette.color_family, "color_family field must be set");
    assert.ok(Array.isArray(palette.categories), "categories must be an array");
    assert.ok(typeof palette.view_count === "number", "view_count must be a number");
    assert.ok(typeof palette.copy_count === "number", "copy_count must be a number");
    assert.ok(typeof palette.favorite_count === "number", "favorite_count must be a number");
  }
});

test("Verify new gradient library volume and categories", () => {
  const gradients = getGradients();

  // Volume check
  assert.ok(gradients.length >= 1000, `Expected around 1000 distinct gradients, got ${gradients.length}`);

  // Verify categories and colors
  const validCategories = new Set(["warm", "cool", "luxury", "neon", "pastel", "multi color"]);

  for (const gradient of gradients) {
    assert.ok(gradient.id, "Gradient must have an ID");
    assert.ok(gradient.name, "Gradient must have a name");
    assert.ok(Array.isArray(gradient.colors), "Gradient colors must be an array of stops");
    assert.ok(gradient.colors.length >= 2 && gradient.colors.length <= 4, "Gradient must have between 2 and 4 color stops");

    for (const color of gradient.colors) {
      assert.match(color, /^#[0-9A-F]{6}$/i, `Gradient color ${color} must be a valid HEX code`);
    }

    assert.ok(gradient.direction, "Gradient must specify a direction or angle");
    assert.ok(validCategories.has(gradient.category), `Gradient category ${gradient.category} is invalid`);
    assert.ok(typeof gradient.views === "number", "views must be a number");
    assert.ok(typeof gradient.copies === "number", "copies must be a number");
    assert.ok(typeof gradient.favorites === "number", "favorites must be a number");
  }
});
