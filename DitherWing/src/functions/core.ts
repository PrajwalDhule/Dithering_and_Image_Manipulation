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
  scaleFactor: number
) {
  // document.getElementById("canvas")?.remove();
  // // const inputCanvas = document.createElement("canvas");
  // inputCanvas.id = "canvas";
  // inputCanvas.style.display = "none";

  inputCanvas.width = Math.round(originalImage.width * scaleFactor);
  inputCanvas.height = Math.round(originalImage.height * scaleFactor);

  let ctx = inputCanvas.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;
  // filters using css properties
  // ctx.filter = "blur(2px)";
  // ctx.filter = "grayscale(100%)";
  // ctx.filter = "brightness(50%)";
  // ctx.filter = "contrast(200%)";
  // ctx.filter = "hue-rotate(60deg)";
  // ctx.filter = "invert(100%)";
  // ctx.filter = "opacity(30%)";
  // ctx.filter = "saturate(8)";
  // ctx.filter = "sepia(100%)";
  ctx.drawImage(originalImage, 0, 0, inputCanvas.width, inputCanvas.height);
  const resizedImageSrc = inputCanvas.toDataURL();
  const image = new Image();
  image.src = resizedImageSrc;

  image.onload = () => {
    const width = image.width;
    const height = image.height;
    inputCanvas.width = originalImage.width;
    inputCanvas.height = originalImage.height;

    // document.body.appendChild(inputCanvas);

    ctx = inputCanvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    ctx.drawImage(image, 0, 0, width, height);
    // inputCanvas.style.display = "block";

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // grayscale (2nd method)
      const filterVal = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const filterVals = [filterVal, filterVal, filterVal];
      data[i] = filterVals[0];
      data[i + 1] = filterVals[1];
      data[i + 2] = filterVals[2];
      // other color filter
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

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % width;
      const y = Math.floor(i / 4 / width);

      if (x === width - 1 || y === height - 1) continue;

      const { r, g, b } = getClosestColor(data[i], data[i + 1], data[i + 2], 1);
      const errorR = data[i] - r;
      const errorG = data[i + 1] - g;
      const errorB = data[i + 2] - b;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;

      // Floyd-Steinberg Dithering
      // diffuseError(i + 4, errorR, errorG, errorB, 70 / 160, data);
      // diffuseError(i + (width - 1) * 4, errorR, errorG, errorB, 30 / 160, data);
      // diffuseError(i + width * 4, errorR, errorG, errorB, 50 / 160, data);
      // diffuseError(i + (width + 1) * 4, errorR, errorG, errorB, 10 / 160, data);

      // Atkinson Dithering
      diffuseError(i + 4, errorR, errorG, errorB, 10 / 80, data);
      diffuseError(i + (width - 1) * 4, errorR, errorG, errorB, 10 / 80, data);
      diffuseError(i + width * 4, errorR, errorG, errorB, 10 / 80, data);
      diffuseError(i + (width + 1) * 4, errorR, errorG, errorB, 10 / 80, data);
      diffuseError(i + width * 8, errorR, errorG, errorB, 10 / 80, data);
      diffuseError(i + 8, errorR, errorG, errorB, 10 / 80, data);
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
