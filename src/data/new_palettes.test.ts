import { test } from "node:test";
import assert from "node:assert";
import { NEW_PALETTES } from "./new_palettes";
import { getGradients } from "./gradients";

test("NEW_PALETTES Database Integrity, Format, and Volume", async (t) => {
  await t.test("Volume target should meet or exceed 139 palettes", () => {
    // Phase 2.5 instruction says: volume at least equal to dark and neon palette count (which is 139)
    assert.ok(NEW_PALETTES.length >= 139, `Expected >= 139 palettes, got ${NEW_PALETTES.length}`);
  });

  await t.test("Every palette record must comply with the expected schema format", () => {
    NEW_PALETTES.forEach((p) => {
      // Must have string id
      assert.strictEqual(typeof p.id, "string", `Palette id must be a string: ${p.id}`);
      assert.ok(p.id.length > 0, `Palette id cannot be empty`);

      // Must have descriptive name
      assert.strictEqual(typeof p.name, "string", `Palette name must be a string: ${p.name}`);
      assert.ok(p.name.length > 0, `Palette name cannot be empty`);

      // Colors ordered array of hex strings (4 to 6 hex codes)
      assert.ok(Array.isArray(p.colors), `Palette colors must be an array: ${p.name}`);
      assert.ok(p.colors.length >= 4 && p.colors.length <= 6, `Palette colors must be between 4 and 6 elements: ${p.name}`);
      p.colors.forEach((col) => {
        assert.ok(/^#[0-9A-F]{6}$/i.test(col), `Colors must be valid 6-char hex strings: ${col} in ${p.name}`);
      });

      // Must have color_family string matching standard fields
      assert.strictEqual(typeof p.color_family, "string", `color_family must be a string in ${p.name}`);

      // Must have categories array of tags
      assert.ok(Array.isArray(p.categories), `categories must be an array in ${p.name}`);
      assert.ok(p.categories.length > 0, `categories cannot be empty in ${p.name}`);

      // Roles object mapping role names to specific hex values
      assert.ok(p.roles && typeof p.roles === "object", `roles must be an object in ${p.name}`);
      assert.ok(p.roles.dominant && /^#[0-9A-F]{6}$/i.test(p.roles.dominant), `dominant role must be a valid hex color in ${p.name}`);
      assert.ok(p.roles.secondary && /^#[0-9A-F]{6}$/i.test(p.roles.secondary), `secondary role must be a valid hex color in ${p.name}`);
      assert.ok(p.roles.accent && /^#[0-9A-F]{6}$/i.test(p.roles.accent), `accent role must be a valid hex color in ${p.name}`);

      // Optional/Extended fields or required stats
      assert.strictEqual(typeof p.is_featured, "boolean", `is_featured must be a boolean in ${p.name}`);
      assert.strictEqual(typeof p.is_editor_choice, "boolean", `is_editor_choice must be a boolean in ${p.name}`);
      assert.strictEqual(typeof p.view_count, "number", `view_count must be a number in ${p.name}`);
      assert.strictEqual(typeof p.copy_count, "number", `copy_count must be a number in ${p.name}`);
      assert.strictEqual(typeof p.favorite_count, "number", `favorite_count must be a number in ${p.name}`);
    });
  });
});

test("Gradients Database Integrity, Format, and Volume", async (t) => {
  const gradients = getGradients();

  await t.test("Volume target should target around 1,000 distinct gradients", () => {
    assert.ok(gradients.length >= 1000, `Expected around or over 1000 gradients, got ${gradients.length}`);
  });

  await t.test("Every gradient record must comply with the expected schema format", () => {
    gradients.forEach((g) => {
      // Must have string id
      assert.strictEqual(typeof g.id, "string", `Gradient id must be a string: ${g.id}`);
      assert.ok(g.id.length > 0, `Gradient id cannot be empty`);

      // Must have name
      assert.strictEqual(typeof g.name, "string", `Gradient name must be a string: ${g.name}`);
      assert.ok(g.name.length > 0, `Gradient name cannot be empty`);

      // Must have colors array (2 to 4 hex stops)
      assert.ok(Array.isArray(g.colors), `Gradient colors must be an array: ${g.name}`);
      assert.ok(g.colors.length >= 2 && g.colors.length <= 4, `Gradient colors must be between 2 and 4 stops: ${g.name}`);
      g.colors.forEach((col) => {
        assert.ok(/^#[0-9A-F]{6}$/i.test(col), `Gradient colors must be valid 6-char hex strings: ${col} in ${g.name}`);
      });

      // Must have angle/direction value
      assert.strictEqual(typeof g.direction, "string", `Gradient direction must be a string in ${g.name}`);
      assert.ok(g.direction.length > 0, `Gradient direction cannot be empty in ${g.name}`);

      // Must have category tag
      assert.ok(["warm", "cool", "luxury", "neon", "pastel", "multi color"].includes(g.category), `Invalid category tag: ${g.category} in ${g.name}`);

      // Must have counters
      assert.strictEqual(typeof g.views, "number", `views must be a number in ${g.name}`);
      assert.strictEqual(typeof g.copies, "number", `copies must be a number in ${g.name}`);
      assert.strictEqual(typeof g.favorites, "number", `favorites must be a number in ${g.name}`);
    });
  });
});
