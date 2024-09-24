import { useEffect, useRef, useState } from "react";
import "./App.css";
import { applySettings } from "./functions/core";

function App() {
  const [scale, setScale] = useState<number>(1);
  const [imageSrc, setImageSrc] = useState<string>(
    "https://i.postimg.cc/sXrgJtX5/imageedit-4-6675048281.jpg"
  );
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [outputCanvas, setOutputCanvas] = useState<HTMLCanvasElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScaleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (event && event.target)
      setScale(Number((event.target as HTMLInputElement).value));
  };

  useEffect(() => {
    const _outputCanvas = canvasRef.current;
    if (imageSrc && _outputCanvas) {
      const _originalImage = new Image();
      _originalImage.crossOrigin = "anonymous";
      _originalImage.src = imageSrc;

      _originalImage.onload = () => {
        _outputCanvas.width = _originalImage.width;
        _outputCanvas.height = _originalImage.height;
        setOutputCanvas(_outputCanvas);
        setOriginalImage(_originalImage);

        applySettings(_originalImage, _outputCanvas, 1);
      };
    }
  }, [imageSrc]);

  useEffect(() => {
    if (originalImage && outputCanvas) {
      applySettings(originalImage, outputCanvas, scale);
    }
  }, [scale]);

  function handleImageSrcChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event && event.target && event.target.value !== "") {
      setImageSrc((event.target as HTMLInputElement).value);
    }
  }

  function handleBrokenImageLink() {
    setImageSrc("https://i.postimg.cc/sXrgJtX5/imageedit-4-6675048281.jpg");
  }

  return (
    <>
      <div>
        <div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            id="slider"
            onChange={handleScaleValueChange}
          />
          {scale && (
            <p id="sliderValue">{Math.trunc(scale * 100).toString()}</p>
          )}
          <input type="text" onChange={handleImageSrcChange} />
        </div>
        <canvas ref={canvasRef} />
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Uploaded Image"
            onError={handleBrokenImageLink}
          />
        )}
      </div>
    </>
  );
}

export default App;
