import test from "node:test";
import assert from "node:assert";
import { getPalettes } from "./palettes";
import { getGradients } from "./gradients";
import { NEW_PALETTES } from "./new_palettes";

test("Database Validation Suite: Color Palettes Integrity", async (t) => {
  const palettes = getPalettes();

  await t.test("Palettes count should meet volume expectations", () => {
    assert.ok(Array.isArray(palettes), "getPalettes() should return an array");
    assert.ok(palettes.length >= 1000, `Should have over 1000 palettes, found ${palettes.length}`);
  });

  await t.test("NEW_PALETTES should contain additive palettes and match target categories", () => {
    assert.ok(Array.isArray(NEW_PALETTES), "NEW_PALETTES should be an array");
    assert.ok(NEW_PALETTES.length >= 150, `Should contain at least 150 custom expanded palettes, found ${NEW_PALETTES.length}`);
  });

  await t.test("Each palette record should conform to the strict schema shape", () => {
    const hexPattern = /^#[0-9A-F]{6}$/i;

    for (const p of palettes) {
      assert.ok(p.id, "Palette should have a valid id");
      assert.ok(p.name && typeof p.name === "string", `Palette ${p.id} should have a non-empty name string`);
      assert.ok(p.description && typeof p.description === "string", `Palette ${p.id} should have a non-empty description`);

      // Color array assertions
      assert.ok(Array.isArray(p.colors), `Palette ${p.name} colors should be an array`);
      assert.ok(p.colors.length >= 4 && p.colors.length <= 6, `Palette ${p.name} should contain 4 to 6 colors`);
      for (const col of p.colors) {
        assert.ok(hexPattern.test(col), `Color ${col} in palette ${p.name} should be a valid 7-character hex string`);
      }

      // Roles assertions
      assert.ok(p.roles && typeof p.roles === "object", `Palette ${p.name} should have a roles object`);
      const requiredRoles = ["dominant", "secondary", "accent", "text", "ui"];
      for (const role of requiredRoles) {
        const roleColor = p.roles[role];
        assert.ok(roleColor, `Palette ${p.name} is missing the role: ${role}`);
        assert.ok(hexPattern.test(roleColor), `Role color ${roleColor} for role ${role} in palette ${p.name} should be a valid 7-character hex string`);
      }

      // Category / Tag assertions
      assert.ok(Array.isArray(p.tags), `Palette ${p.name} tags should be an array`);
      assert.ok(Array.isArray(p.colorFamilies), `Palette ${p.name} colorFamilies should be an array`);

      // Check view, copy, favorite counters
      assert.ok(typeof p.views === "number", `Palette ${p.name} views should be a number`);
      assert.ok(typeof p.copies === "number", `Palette ${p.name} copies should be a number`);
      assert.ok(typeof p.favorites === "number", `Palette ${p.name} favorites should be a number`);

      // Check PRD specific fields if present (they are on NEW_PALETTES)
      if (p.id.startsWith("new-p-")) {
        assert.ok(p.color_family && typeof p.color_family === "string", `New palette ${p.name} should have color_family string`);
        assert.ok(Array.isArray(p.categories), `New palette ${p.name} should have categories array`);
        assert.ok(typeof p.is_featured === "boolean", `New palette ${p.name} should have is_featured boolean`);
        assert.ok(typeof p.is_editor_choice === "boolean", `New palette ${p.name} should have is_editor_choice boolean`);
        assert.ok(typeof p.view_count === "number", `New palette ${p.name} should have view_count number`);
        assert.ok(typeof p.copy_count === "number", `New palette ${p.name} should have copy_count number`);
        assert.ok(typeof p.favorite_count === "number", `New palette ${p.name} should have favorite_count number`);
      }
    }
  });
});

test("Database Validation Suite: Color Gradients Integrity", async (t) => {
  const gradients = getGradients();

  await t.test("Gradients count should meet volume expectations", () => {
    assert.ok(Array.isArray(gradients), "getGradients() should return an array");
    assert.ok(gradients.length >= 1000, `Should have roughly 1000 distinct gradients, found ${gradients.length}`);
  });

  await t.test("Each gradient record should conform to the strict schema shape", () => {
    const hexPattern = /^#[0-9A-F]{6}$/i;
    const allowedCategories = ["warm", "cool", "luxury", "neon", "pastel", "multi color"];

    for (const g of gradients) {
      assert.ok(g.id, "Gradient should have a valid id");
      assert.ok(g.name && typeof g.name === "string", `Gradient ${g.id} should have a non-empty name string`);
      assert.ok(g.direction && typeof g.direction === "string", `Gradient ${g.id} should have a non-empty direction string`);
      assert.ok(allowedCategories.includes(g.category), `Gradient ${g.name} has invalid category: ${g.category}`);

      // Color array assertions
      assert.ok(Array.isArray(g.colors), `Gradient ${g.name} colors should be an array`);
      assert.ok(g.colors.length >= 2 && g.colors.length <= 4, `Gradient ${g.name} should contain 2 to 4 colors`);
      for (const col of g.colors) {
        assert.ok(hexPattern.test(col), `Color ${col} in gradient ${g.name} should be a valid 7-character hex string`);
      }

      // Check view, copy, favorite counters
      assert.ok(typeof g.views === "number", `Gradient ${g.name} views should be a number`);
      assert.ok(typeof g.copies === "number", `Gradient ${g.name} copies should be a number`);
      assert.ok(typeof g.favorites === "number", `Gradient ${g.name} favorites should be a number`);
    }
  });
});
