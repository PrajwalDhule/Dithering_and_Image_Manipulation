import { useEffect, useRef, useState } from "react";
import { applySettings } from "../functions/core";

function Home() {
  const [scale, setScale] = useState<number>(1);
  const [imageSrc, setImageSrc] = useState<string>(
    "https://i.postimg.cc/sXrgJtX5/imageedit-4-6675048281.jpg"
  );
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [inputCanvas, setInputCanvas] = useState<HTMLCanvasElement>();
  const [outputCanvas, setOutputCanvas] = useState<HTMLCanvasElement>();
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleScaleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setScale(Number(event.target.value));
  };

  useEffect(() => {
    const _inputCanvas = inputCanvasRef.current;
    const _outputCanvas = outputCanvasRef.current;
    if (imageSrc && _inputCanvas && _outputCanvas) {
      const _originalImage = new Image();
      _originalImage.crossOrigin = "anonymous";
      _originalImage.src = imageSrc;

      _originalImage.onload = () => {
        _outputCanvas.width = _originalImage.width;
        _outputCanvas.height = _originalImage.height;
        setInputCanvas(_inputCanvas);
        setOutputCanvas(_outputCanvas);
        setOriginalImage(_originalImage);

        applySettings(_originalImage, _inputCanvas, _outputCanvas, scale);
      };
    }
  }, [imageSrc]);

  useEffect(() => {
    if (originalImage && inputCanvas && outputCanvas) {
      applySettings(originalImage, inputCanvas, outputCanvas, scale);
    }
  }, [scale]);

  function handleImageSrcChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value !== "") {
      setImageSrc(event.target.value);
    }
  }

  function handleBrokenImageLink() {
    setImageSrc("https://i.postimg.cc/sXrgJtX5/imageedit-4-6675048281.jpg");
  }

  return (
    <>
      <div className="w-[90vw] flex justify-between items-center">
        <div>
          <div className="flex flex-col">
            <input
              value={scale}
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              id="slider"
              onChange={handleScaleValueChange}
            />
            {scale && (
              <p id="sliderValue">{Math.trunc(scale * 100).toString()}</p>
            )}
          </div>
          <input
            type="text"
            onChange={handleImageSrcChange}
            className="bg-[#1f1f1f] border-[1px] border-black border-solid rounded-md"
          />
        </div>
        <div className="flex justify-center gap-8 h-[85vh] w-[75%]">
          <canvas
            className="max-w-[50%] h-auto object-contain"
            ref={outputCanvasRef}
          />
          <canvas className="hidden" ref={inputCanvasRef} />
          {imageSrc && (
            <img
              className="max-w-[50%] h-auto object-contain"
              src={imageSrc}
              alt="Uploaded Image"
              onError={handleBrokenImageLink}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
