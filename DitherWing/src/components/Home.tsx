import { useEffect, useRef, useState } from "react";
import { applySettings } from "../functions/core";
import { Combobox } from "./Combobox";

function Home() {
  const [scale, setScale] = useState<number>(1);
  const [noOfColors, setNoOfColors] = useState<number>(2);
  const [imageSrc, setImageSrc] = useState<string>(
    "https://i.postimg.cc/sXrgJtX5/imageedit-4-6675048281.jpg"
  );
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [inputCanvas, setInputCanvas] = useState<HTMLCanvasElement>();
  const [outputCanvas, setOutputCanvas] = useState<HTMLCanvasElement>();
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [algorithm, setAlgorithm] = useState("atkinson");

  const handleScaleValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setScale(Number(event.target.value));
  };

  const handleNoOfColorsValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNoOfColors(Number(event.target.value));
  };

  // useEffect(() => {
  //   console.log(algorithm);
  // }, [algorithm]);

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
      <div className="w-[92.5vw] flex justify-between items-center">
        <div className="w-[30vw]">
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 mb-6">
            <div className="col-span-2 flex flex-col justify-start items-start">
              <label
                htmlFor="algorithm"
                className="mb-3 text-white text-sm font-medium"
              >
                Image url
              </label>
              <input
                type="text"
                onChange={handleImageSrcChange}
                id="algorithm"
                className="col-span-2 w-3/5 bg-[#111] outline-none border-[1px] border-outline-25 focus:border-outline-50 border-solid rounded-md px-2 py-1"
              />
            </div>
            <div className="col-span-2 h-[0.25px] bg-gray-800 m-block-2"></div>
            <div className="col-span-2 flex flex-col justify-start items-start">
              <label className="mb-3 text-white text-sm font-medium">
                Dithering Algorithm
              </label>
              <Combobox algorithm={algorithm} setAlgorithm={setAlgorithm} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3 text-sm font-medium ">
                <label htmlFor="no-of-colors" className="text-white">
                  No. of Colors
                </label>
                {noOfColors && (
                  <span id="no-of-colors-value" className="text-gray-400">
                    {noOfColors}
                  </span>
                )}
              </div>
              <input
                value={noOfColors}
                type="range"
                min="2"
                max="16"
                step="1"
                onChange={handleNoOfColorsValueChange}
                id="no-of-colors"
                className="text-gray-400 h-[0.45em] w-full"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3 text-sm font-medium ">
                <label htmlFor="scale-slider" className="text-white">
                  Scale
                </label>
                {scale && (
                  <span id="slider-value" className="text-gray-400">
                    {Math.trunc(scale * 100).toString()}
                  </span>
                )}
              </div>
              <input
                value={scale}
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                id="scale-slider"
                onChange={handleScaleValueChange}
                className="h-[0.45em] w-full cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-8 h-[85vh] w-[60vw]">
          <canvas
            className="max-w-[45%] h-auto object-contain"
            ref={outputCanvasRef}
          />
          <canvas className="hidden" ref={inputCanvasRef} />
          {imageSrc && (
            <img
              className="max-w-[45%] h-auto object-contain"
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
