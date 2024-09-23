import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [scale, setScale] = useState<number>(1); // initial value
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [newCanvas2, setNewCanvas2] = useState<HTMLCanvasElement>();

  const handleScaleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event && event.target)
      setScale(Number((event.target as HTMLInputElement).value));
  };

  const slider = document.getElementById("slider") as HTMLInputElement;
  const sliderValue = document.getElementById("sliderValue");
  useEffect(() => {
    if (!originalImage && !newCanvas2) {
      const _originalImage = new Image();
      _originalImage.crossOrigin = "anonymous";
      _originalImage.src =
        "https://i.postimg.cc/sXrgJtX5/imageedit-4-6675048281.jpg";
      // originalImage.src =
      //   "https://i.postimg.cc/D0hhvKQB/ece08450c4ab1ce80749e487c21fec0a.jpg";

      const newCanvas2 = document.createElement("canvas");
      newCanvas2.width = _originalImage.width;
      newCanvas2.height = _originalImage.height;
      newCanvas2.id = "newCanvas";

      _originalImage.onload = () => {
        setOriginalImage(_originalImage);
        setNewCanvas2(newCanvas2);
        document.body.appendChild(newCanvas2);
        document.body.appendChild(_originalImage);
      };
    }
  }, []);

  useEffect(() => {
    if (originalImage && newCanvas2) {
      if (sliderValue) {
        sliderValue.textContent = Math.trunc(scale * 100).toString();
      }

      document.getElementById("canvas")?.remove();

      const canvas = document.createElement("canvas");
      canvas.id = "canvas";
      canvas.style.display = "none";

      const scaleFactor = scale;

      canvas.width = Math.round(originalImage.width * scaleFactor);
      canvas.height = Math.round(originalImage.height * scaleFactor);

      let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
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
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
      const resizedImageSrc = canvas.toDataURL();
      const image = new Image();
      image.src = resizedImageSrc;

      image.onload = () => {
        const width = image.width;
        const height = image.height;
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        document.body.appendChild(canvas);

        ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.drawImage(image, 0, 0, width, height);

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

          const { r, g, b } = get_closest_color(
            data[i],
            data[i + 1],
            data[i + 2],
            1
          );
          const errorR = data[i] - r;
          const errorG = data[i + 1] - g;
          const errorB = data[i + 2] - b;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;

          // Floyd-Steinberg Dithering
          // diffuse_error(i + 4, errorR, errorG, errorB, 70 / 160, data);
          // diffuse_error(i + (width - 1) * 4, errorR, errorG, errorB, 30 / 160, data);
          // diffuse_error(i + width * 4, errorR, errorG, errorB, 50 / 160, data);
          // diffuse_error(i + (width + 1) * 4, errorR, errorG, errorB, 10 / 160, data);

          // Atkinson Dithering
          diffuse_error(i + 4, errorR, errorG, errorB, 10 / 80, data);
          diffuse_error(
            i + (width - 1) * 4,
            errorR,
            errorG,
            errorB,
            10 / 80,
            data
          );
          diffuse_error(i + width * 4, errorR, errorG, errorB, 10 / 80, data);
          diffuse_error(
            i + (width + 1) * 4,
            errorR,
            errorG,
            errorB,
            10 / 80,
            data
          );
          diffuse_error(i + width * 8, errorR, errorG, errorB, 10 / 80, data);
          diffuse_error(i + 8, errorR, errorG, errorB, 10 / 80, data);
        }

        const newCanvas = document.createElement("canvas");
        newCanvas.width = imageData.width;
        newCanvas.height = imageData.height;

        const newCtx = newCanvas.getContext("2d");

        newCtx?.putImageData(imageData, 0, 0);

        const newImage = new Image();
        newImage.src = newCanvas.toDataURL("image/png");

        newImage.onload = () => {
          const ctx2 = newCanvas2.getContext("2d");
          if (ctx2) {
            ctx2.drawImage(newImage, 0, 0, newCanvas2.width, newCanvas2.height);
            const imageData = ctx2.getImageData(
              0,
              0,
              newCanvas2.width,
              newCanvas2.height
            );
            ctx2.putImageData(imageData, 0, 0);
          }
        };
      };
    }
  }, [scale]);

  function get_closest_color(r: number, g: number, b: number, factor = 1) {
    r = Math.round((factor * r) / 255) * Math.floor(255 / factor);
    g = Math.round((factor * g) / 255) * Math.floor(255 / factor);
    b = Math.round((factor * b) / 255) * Math.floor(255 / factor);

    // for lowering contrast, only for grayscale for now
    // r = g = b = r == 255 ? 150 : 25;

    return { r, g, b };
  }

  function diffuse_error(
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

  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
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
      if (h) h /= 6;
    }

    return [h, s, l];
  }

  function hslToRgb(h: number, s: number, l: number) {
    let r, g, b;

    h = Math.max(0, Math.min(1, h));
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        t = (t + 1) % 1;

        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [
      Math.round(Math.max(0, Math.min(255, r * 255))),
      Math.round(Math.max(0, Math.min(255, g * 255))),
      Math.round(Math.max(0, Math.min(255, b * 255))),
    ];
  }

  return (
    <>
      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          id="slider"
          onChange={handleScaleValueChange}
        />
        <p id="sliderValue">0</p>
      </div>
    </>
  );
}

export default App;
