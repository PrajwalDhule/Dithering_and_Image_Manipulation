import { SettingsData } from "@/models/Settings";
import { hexToRgb, hslToRgb, rgbToHsl } from "./helper";

export function getClosestColor(r: number, g: number, b: number, factor = 1) {
  r = Math.round((factor * r) / 255) * Math.floor(255 / factor);
  g = Math.round((factor * g) / 255) * Math.floor(255 / factor);
  b = Math.round((factor * b) / 255) * Math.floor(255 / factor);

  // for lowering contrast, only for grayscale for now
  // r = g = b = r == 255 ? 150 : 25;

  return { r, g, b };
}

export function diffuseError(
  index: number,
  errorR: number,
  errorG: number,
  errorB: number,
  errorPercent: number,
  data: Uint8ClampedArray,
  noise: number = 1
) {
  errorPercent *= noise;
  data[index] = Math.round(data[index] + errorR * errorPercent);
  data[index + 1] = Math.round(data[index + 1] + errorG * errorPercent);
  data[index + 2] = Math.round(data[index + 2] + errorB * errorPercent);
}

function getAppliedFilters(settings: SettingsData): string {
  return `blur(${settings.blur}px) brightness(${settings.brightness}%) contrast(${settings.contrast}%) hue-rotate(${settings.hueRotate}deg) invert(${settings.invert}%) opacity(${settings.opacity}%) sepia(${settings.sepia}%)`;
}

function applyGrayscale(data: Uint8ClampedArray, i: number): void {
  const filterVal = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  data[i] = data[i + 1] = data[i + 2] = filterVal;
}

function applyTint(
  filterColor: { r: number; g: number; b: number },
  data: Uint8ClampedArray,
  i: number
): void {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  let [tintColorH, tintColorS, tintColorL] = rgbToHsl(
    filterColor.r,
    filterColor.g,
    filterColor.b
  );
  let [h, s, l] = rgbToHsl(r, g, b);
  h = tintColorH;
  s = s + tintColorS * (1 - s); // Increase saturation towards the tint
  const [newR, newG, newB] = hslToRgb(h, s, l);
  data[i] = newR;
  data[i + 1] = newG;
  data[i + 2] = newB;
}

export function bayer(
  data: Uint8ClampedArray,
  i: number,
  imageWidth: number,
  imageHeight: number
): void {
  const x = (i / 4) % imageWidth;
  const y = Math.floor(i / 4 / imageWidth);

  if (x === imageWidth - 1 || y === imageHeight - 1) return;

  // Bayer ordered dithering (needs exclusion of getClosestColor and error considerations as this is not an error method)
  const thresholdMat = [
    [ 0, 48, 12, 60,  3, 51, 15, 63 ],
    [32, 16, 44, 28, 35, 19, 47, 31 ],
    [ 8, 56,  4, 52, 11, 59,  7, 55 ],
    [40, 24, 36, 20, 43, 27, 39, 23 ],
    [ 2, 50, 14, 62,  1, 49, 13, 61 ],
    [34, 18, 46, 30, 33, 17, 45, 29 ],
    [10, 58,  6, 54,  9, 57,  5, 53 ],
    [42, 26, 38, 22, 41, 25, 37, 21 ]
  ];

  // const thresholdMat = [
  //   [  0,  8,  2, 10,  1,  9,  3, 11 ],
  //   [ 12,  4, 14,  6, 13,  5, 15,  7 ]
  // ];

  const M = thresholdMat.length;
  const N = thresholdMat[0].length;

  const iModM = x % M;
  const jModN = y % N;
  const threshold = 255 * ((thresholdMat[iModM][jModN] + 0.5) / (M * N));

  data[i] = data[i] > threshold ? 255 : 0;
  data[i + 1] = data[i + 1] > threshold ? 255 : 0;
  data[i + 2] = data[i + 2] > threshold ? 255 : 0;
}

export function halftone(
  data: Uint8ClampedArray,
  imageWidth: number,
  imageHeight: number,
  cellSize: number
){
  const output = new Uint8ClampedArray(data.length);

  for (let y = 0; y < imageHeight; y += cellSize) {
    for (let x = 0; x < imageWidth; x += cellSize) {
      let sum = 0;
      let count = 0;

      for (let cy = 0; cy < cellSize; cy++) {
        for (let cx = 0; cx < cellSize; cx++) {
          const px = x + cx;
          const py = y + cy;
          if (px >= imageWidth || py >= imageHeight) continue;

          const idx = (py * imageWidth + px) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          sum += gray;
          count++;
        }
      }

      const avg = sum / count;

      const maxRadius = cellSize / 2;
      const radius = ((255 - avg) / 255) * maxRadius;

      const centerX = x + cellSize / 2;
      const centerY = y + cellSize / 2;

      for (let cy = 0; cy < cellSize; cy++) {
        for (let cx = 0; cx < cellSize; cx++) {
          const px = x + cx;
          const py = y + cy;
          if (px >= imageWidth || py >= imageHeight) continue;

          const dx = px + 0.5 - centerX;
          const dy = py + 0.5 - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const idx = (py * imageWidth + px) * 4;
          const color = dist <= radius ? 0 : 255; 

          output[idx] = color;     
          output[idx + 1] = color; 
          output[idx + 2] = color; 
          output[idx + 3] = 255;   
        }
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = output[i];
  }
}

export function floydSteinberg(
  data: Uint8ClampedArray,
  i: number,
  errorR: number,
  errorG: number,
  errorB: number,
  noise: number,
  imageWidth: number
): void {
  diffuseError(i + 4, errorR, errorG, errorB, 70 / 160, data, noise);
  diffuseError(
    i + (imageWidth - 1) * 4,
    errorR,
    errorG,
    errorB,
    30 / 160,
    data,
    noise
  );
  diffuseError(
    i + imageWidth * 4,
    errorR,
    errorG,
    errorB,
    50 / 160,
    data,
    noise
  );
  diffuseError(
    i + (imageWidth + 1) * 4,
    errorR,
    errorG,
    errorB,
    10 / 160,
    data,
    noise
  );
}

export function atkinson(
  data: Uint8ClampedArray,
  i: number,
  errorR: number,
  errorG: number,
  errorB: number,
  noise: number,
  imageWidth: number
): void {
  diffuseError(
    i + 4,
    errorR,
    errorG,
    errorB,
    10 / 80,
    data,
    noise
  );
  diffuseError(
    i + (imageWidth - 1) * 4,
    errorR,
    errorG,
    errorB,
    10 / 80,
    data,
    noise
  );
  diffuseError(
    i + imageWidth * 4,
    errorR,
    errorG,
    errorB,
    10 / 80,
    data,
    noise
  );
  diffuseError(
    i + (imageWidth + 1) * 4,
    errorR,
    errorG,
    errorB,
    10 / 80,
    data,
    noise
  );
  diffuseError(
    i + imageWidth * 8,
    errorR,
    errorG,
    errorB,
    10 / 80,
    data,
    noise
  );
  diffuseError(
    i + 8,
    errorR,
    errorG,
    errorB,
    10 / 80,
    data,
    noise
  );
}

export function applySettings(
  originalImage: HTMLImageElement,
  inputCanvas: HTMLCanvasElement,
  outputCanvas: HTMLCanvasElement,
  settings: SettingsData
) {
  inputCanvas.width = Math.round(originalImage.width * settings.scale);
  inputCanvas.height = Math.round(originalImage.height * settings.scale);

  let ctx = inputCanvas.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  // filters using css properties
  ctx.filter = getAppliedFilters(settings);

  ctx.drawImage(originalImage, 0, 0, inputCanvas.width, inputCanvas.height);
  const resizedImageSrc = inputCanvas.toDataURL();
  const image = new Image();
  image.src = resizedImageSrc;

  image.onload = () => {
    const width = image.width;
    const height = image.height;
    inputCanvas.width = originalImage.width;
    inputCanvas.height = originalImage.height;

    ctx = inputCanvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    ctx.drawImage(image, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (settings.imageFilterMode === "grayscale") {
        applyGrayscale(data, i);
      } else if (settings.imageFilterMode === "tint") {
        const filterColor = hexToRgb(settings.tint);
        if (filterColor) {
          applyTint(filterColor, data, i);
        }
      }
    }

    if (settings.algorithm === "bayer") {
      for (let i = 0; i < data.length; i += 4) {
        bayer(data, i, width, height);
      }
    } else if(settings.algorithm === "halftone") {
      halftone(data, width, height, 36);
    }
    else if (settings.algorithm !== "none") {
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);

        if (x === width - 1 || y === height - 1) continue;

        const { r, g, b } = getClosestColor(
          data[i],
          data[i + 1],
          data[i + 2],
          settings.noOfColors - 1
        );
        const errorR = data[i] - r;
        const errorG = data[i + 1] - g;
        const errorB = data[i + 2] - b;

        // quantizing stage
        if (!settings.algorithm.includes("no-quantize")) {
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }

        // Floyd-Steinberg Dithering
        if (settings.algorithm.includes("floydsteinberg")) {
          floydSteinberg(
            data,
            i,
            errorR,
            errorG,
            errorB,
            settings.noise,
            width
          );
        }

        // Atkinson Dithering
        if (settings.algorithm.includes("atkinson")) {
          atkinson(
            data,
            i,
            errorR,
            errorG,
            errorB,
            settings.noise,
            width
          );
        }
      }
    }

    const newCanvas = document.createElement("canvas");
    newCanvas.width = imageData.width;
    newCanvas.height = imageData.height;

    const newCtx = newCanvas.getContext("2d", { willReadFrequently: true });

    newCtx?.putImageData(imageData, 0, 0);

    const outputImage = new Image();
    outputImage.src = newCanvas.toDataURL("image/png");

    outputImage.onload = () => {
      const outputCtx = outputCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (outputCtx) {
        outputCtx.drawImage(
          outputImage,
          0,
          0,
          outputCanvas.width,
          outputCanvas.height
        );
        const imageData = outputCtx.getImageData(
          0,
          0,
          outputCanvas.width,
          outputCanvas.height
        );
        outputCtx.putImageData(imageData, 0, 0);
      }
    };
  };
}

