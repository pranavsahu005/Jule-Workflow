/**
 * Converts r, g, b numeric components (0-255) to a standard uppercase hexadecimal string (e.g. #FFFFFF).
 * @param r red component
 * @param g green component
 * @param b blue component
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    // Clamp the value to 0-255 just in case
    const clamped = Math.max(0, Math.min(255, Math.round(x)));
    const hex = clamped.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
};

/**
 * Calculates basic Euclidean distance in RGB space to filter close shades.
 * @param hex1 hex color 1 (e.g. #ffffff or #fff)
 * @param hex2 hex color 2 (e.g. #000000)
 */
export const colorDistance = (hex1: string, hex2: string): number => {
  // Normalize shorthand hex colors (e.g., #333 to #333333)
  const normalize = (hex: string) => {
    let cleaned = hex.startsWith("#") ? hex.substring(1) : hex;
    if (cleaned.length === 3) {
      cleaned = cleaned.split("").map(char => char + char).join("");
    }
    return cleaned;
  };

  const c1 = normalize(hex1);
  const c2 = normalize(hex2);

  const r1 = parseInt(c1.substring(0, 2), 16) || 0;
  const g1 = parseInt(c1.substring(2, 4), 16) || 0;
  const b1 = parseInt(c1.substring(4, 6), 16) || 0;

  const r2 = parseInt(c2.substring(0, 2), 16) || 0;
  const g2 = parseInt(c2.substring(2, 4), 16) || 0;
  const b2 = parseInt(c2.substring(4, 6), 16) || 0;

  return Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
};
