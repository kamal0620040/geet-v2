export async function extractColorsFromSong(
  imageUrl?: string,
  seedString?: string
): Promise<[string, string, string]> {
  const fallback = generatePaletteFromSeed(seedString || "neon-wave");

  if (!imageUrl || globalThis.window === undefined) {
    return fallback;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(fallback);

        ctx.drawImage(img, 0, 0, 32, 32);
        const imgData = ctx.getImageData(0, 0, 32, 32).data;

        const pixels: { h: number; s: number; l: number }[] = [];

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          if (a < 128) continue; // Skip transparent pixels

          const [h, s, l] = rgbToHsl(r, g, b);

          // Exclude extreme darks (< 10%) and extreme lights (> 85%) to preserve UI contrast
          if (l >= 0.1 && l <= 0.85) {
            pixels.push({ h, s, l });
          }
        }

        if (pixels.length === 0) {
          return resolve(fallback);
        }

        // Group pixels into 12 hue bins (30 degrees per bin)
        const hueBins = new Array(12).fill(0);
        pixels.forEach((p) => {
          const binIndex = Math.floor(p.h / 30) % 12;
          hueBins[binIndex] += p.s + 0.1;
        });

        // Find top 2 hue bins
        let topBin1 = 0;
        let topBin2 = 1;
        let maxVal1 = -1;
        let maxVal2 = -1;

        hueBins.forEach((val, index) => {
          if (val > maxVal1) {
            maxVal2 = maxVal1;
            topBin2 = topBin1;
            maxVal1 = val;
            topBin1 = index;
          } else if (val > maxVal2) {
            maxVal2 = val;
            topBin2 = index;
          }
        });

        const primaryHue = topBin1 * 30 + 15;
        const secondaryHue = topBin2 * 30 + 15;

        // Construct 3 harmonious, contrast-safe gradient colors
        const c1 = hslToHex(primaryHue, 50, 38);
        const c2 = hslToHex(secondaryHue, 55, 32);
        const c3 = hslToHex(primaryHue, 35, 14);

        resolve([c1, c2, c3]);
      } catch {
        resolve(fallback);
      }
    };

    img.onerror = () => {
      resolve(fallback);
    };
  });
}

export function generatePaletteFromSeed(seed: string): [string, string, string] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 120) % 360;

  return [
    hslToHex(h1, 45, 38),
    hslToHex(h2, 50, 32),
    hslToHex(h1, 35, 14),
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}
