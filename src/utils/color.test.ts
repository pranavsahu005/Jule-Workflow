import { rgbToHex, colorDistance } from "./color";

describe("rgbToHex", () => {
  it("should convert black (0, 0, 0) to #000000", () => {
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
  });

  it("should convert white (255, 255, 255) to #FFFFFF", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#FFFFFF");
  });

  it("should convert red (255, 0, 0) to #FF0000", () => {
    expect(rgbToHex(255, 0, 0)).toBe("#FF0000");
  });

  it("should convert green (0, 255, 0) to #00FF00", () => {
    expect(rgbToHex(0, 255, 0)).toBe("#00FF00");
  });

  it("should convert blue (0, 0, 255) to #0000FF", () => {
    expect(rgbToHex(0, 0, 255)).toBe("#0000FF");
  });

  it("should convert arbitrary color correctly", () => {
    expect(rgbToHex(108, 24, 221)).toBe("#6C18DD");
  });

  it("should handle single digit hex components with padding", () => {
    expect(rgbToHex(10, 15, 9)).toBe("#0A0F09");
  });

  it("should clamp values less than 0 to 0", () => {
    expect(rgbToHex(-5, -20, 0)).toBe("#000000");
  });

  it("should clamp values greater than 255 to 255", () => {
    expect(rgbToHex(300, 256, 255)).toBe("#FFFFFF");
  });

  it("should handle decimal values by rounding", () => {
    // 250.6 rounds up to 251 (FB)
    expect(rgbToHex(12.4, 250.6, 127.5)).toBe("#0CFB80");
  });
});

describe("colorDistance", () => {
  it("should calculate zero distance between identical colors", () => {
    expect(colorDistance("#FFFFFF", "#FFFFFF")).toBe(0);
    expect(colorDistance("#000000", "#000000")).toBe(0);
  });

  it("should calculate correct Euclidean distance", () => {
    // Distance between red (#FF0000) and black (#000000) is sqrt(255^2 + 0 + 0) = 255
    expect(colorDistance("#FF0000", "#000000")).toBe(255);
  });

  it("should handle shorthand hex strings", () => {
    // #FFF shorthand should normalize to #FFFFFF, distance to #000 should be sqrt(3 * 255^2) = 441.67...
    expect(colorDistance("#FFF", "#000")).toBeCloseTo(Math.sqrt(3 * Math.pow(255, 2)));
  });

  it("should handle hex strings with or without hash symbol prefix", () => {
    expect(colorDistance("FF0000", "#000000")).toBe(255);
    expect(colorDistance("#FF0000", "000000")).toBe(255);
  });
});
