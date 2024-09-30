import { SettingsData } from "@/models/Settings";

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
  data: Uint8ClampedArray
) {
  data[index] = Math.round(data[index] + errorR * errorPercent);
  data[index + 1] = Math.round(data[index + 1] + errorG * errorPercent);
  data[index + 2] = Math.round(data[index + 2] + errorB * errorPercent);
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
  ctx.filter = `blur(${settings.blur}px) brightness(${settings.brightness}%) contrast(${settings.contrast}%) hue-rotate(${settings.hueRotate}deg) invert(${settings.invert}%) opacity(${settings.opacity}%) sepia(${settings.sepia}%)`;

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
      // grayscale (2nd method)
      if (settings.imageFilterMode === "grayscale") {
        const filterVal = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = filterVal;
      }
      // other color filter (tinting)
      //         const filterColor = [0, 0, 255]; // rgb format
      //         const r = data[i];
      //         const g = data[i + 1];
      //         const b = data[i + 2];
      //         let [tintColorH, tintColorS, tintColorL] = rgbToHsl(
      //           filterColor[0],
      //           filterColor[1],
      //           filterColor[2]
      //         );
      //         let [h, s, l] = rgbToHsl(r, g, b);
      //         h = tintColorH;
      //         s = s + tintColorS * (1 - s); // Increase saturation towards the tint
      //         const [newR, newG, newB] = hslToRgb(h, s, l);
      //         data[i] = newR;
      //         data[i + 1] = newG;
      //         data[i + 2] = newB;
    }

    if (settings.algorithm === "bayer") {
      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);

        if (x === width - 1 || y === height - 1) continue;

        // Bayer ordered dithering (also need to exclude getClosestColor and error considerations as this is not an error method)
        const thresholdMat = [
          [21, 37, 25, 41, 22, 38, 26, 42],
          [53, 5, 57, 9, 54, 6, 58, 10],
          [29, 45, 17, 33, 30, 46, 18, 34],
          [61, 13, 49, 1, 62, 14, 50, 2],
          [23, 39, 27, 43, 20, 36, 24, 40],
          [55, 7, 59, 11, 52, 4, 56, 8],
          [31, 47, 19, 35, 28, 44, 16, 32],
          [63, 15, 51, 3, 60, 12, 48, 0],
        ];

        const N = thresholdMat.length;

        const iModN = x % N;
        const jModN = y % N;
        const threshold =
          255 * ((thresholdMat[iModN][jModN] + 0.5) / Math.pow(N, 2));

        data[i] = data[i] > threshold ? 255 : 0;
        data[i + 1] = data[i + 1] > threshold ? 255 : 0;
        data[i + 2] = data[i + 2] > threshold ? 255 : 0;
      }
    } else if (settings.algorithm !== "none") {
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
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;

        // Floyd-Steinberg Dithering
        if (settings.algorithm === "floydsteinberg") {
          diffuseError(i + 4, errorR, errorG, errorB, 70 / 160, data);
          diffuseError(
            i + (width - 1) * 4,
            errorR,
            errorG,
            errorB,
            30 / 160,
            data
          );
          diffuseError(i + width * 4, errorR, errorG, errorB, 50 / 160, data);
          diffuseError(
            i + (width + 1) * 4,
            errorR,
            errorG,
            errorB,
            10 / 160,
            data
          );
        }

        // Atkinson Dithering
        if (settings.algorithm === "atkinson") {
          diffuseError(i + 4, errorR, errorG, errorB, 10 / 80, data);
          diffuseError(
            i + (width - 1) * 4,
            errorR,
            errorG,
            errorB,
            10 / 80,
            data
          );
          diffuseError(i + width * 4, errorR, errorG, errorB, 10 / 80, data);
          diffuseError(
            i + (width + 1) * 4,
            errorR,
            errorG,
            errorB,
            10 / 80,
            data
          );
          diffuseError(i + width * 8, errorR, errorG, errorB, 10 / 80, data);
          diffuseError(i + 8, errorR, errorG, errorB, 10 / 80, data);
        }
      }
    }

    // scalePixels to create a dark lighting effect

    // let dataCopy = [...data];

    // for (let i = (width + 1) * 4; i < data.length; i += 4) {
    //   const x = (i / 4) % width;
    //   const y = Math.floor(i / 4 / width);

    //   if (x === width - 1 || y === height - 1) continue;
    //   if (i < data.length) scalePixels(i, data, dataCopy, width);
    // }

    // for (let i = 0; i < data.length; i += 4) {
    //   data[i] = dataCopy[i];
    //   data[i + 1] = dataCopy[i + 1];
    //   data[i + 2] = dataCopy[i + 2];
    // }

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

function scalePixels(
  index: number,
  data: Uint8ClampedArray,
  dataCopy: Uint8ClampedArray,
  width: number
) {
  let netWhiteCount = 0;

  // Just checking the r value
  netWhiteCount += data[index] == 255 ? 1 : -1;

  const indices = [
    index - 4,
    index + 4,
    index + width * 4,
    index - width * 4,
    index + (width + 1) * 4,
    index + (width - 1) * 4,
    index - (width + 1) * 4,
    index - (width - 1) * 4,
  ];
  const indicesToUpdate = [index];

  for (const currIndex of indices) {
    if (currIndex >= 0) {
      netWhiteCount += data[currIndex] == 255 ? 1 : -1;
      indicesToUpdate.push(currIndex);
    }
  }

  const value = netWhiteCount >= 3 ? 255 : 0;

  for (const i of indicesToUpdate) {
    dataCopy[i] = value;
    dataCopy[i + 1] = value;
    dataCopy[i + 2] = value;
  }
}
