import { useEffect, useRef, useState } from "react";
import { applySettings } from "../functions/core";
import { Combobox } from "./Combobox";
import { Button } from "./ui/button";
import { RadioButton } from "./ui/radiobutton";

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
      <div className="w-[92.5vw] lg:flex justify-between items-start">
        <div className="lg:w-[30vw]">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div className="col-span-2 flex flex-col justify-start items-start">
              <label
                htmlFor="algorithm"
                className="mb-3 text-text text-sm font-medium"
              >
                Image url
              </label>
              <div className="w-full flex gap-4">
                <input
                  type="text"
                  onChange={handleImageSrcChange}
                  id="algorithm"
                  className="col-span-2 w-3/5 bg-[#111] outline-none border-[1px] border-outline-25 focus:border-outline-50 border-solid rounded-md px-2 py-1"
                />
                <Button variant="outline" className="w-[8em]">
                  Apply Image
                </Button>
              </div>
            </div>
            <div className="col-span-2 flex justify-center items-center -mb-4 -mt-1 text-light">
              <div className="w-1/5 h-[0.25px] bg-gray-800"></div>
              <span className="mx-4">Or</span>
              <div className="w-1/5 h-[0.25px] bg-gray-800"></div>
            </div>
            <div className="col-span-2">
              <label
                className="block mb-2 text-sm font-medium text-text"
                htmlFor="small-size"
              >
                Upload Image
              </label>
              <div className="w-full flex gap-4">
                <input
                  className="block w-3/5 mb-2 text-sm p-1 text-text outline-none border-[1px] border-outline-25 focus:border-outline-50 border-solid rounded-md cursor-pointer bg-[#111]"
                  id="small-size"
                  type="file"
                />
                <Button variant="outline" className="w-[8em]">
                  Apply Image
                </Button>
              </div>
              <p className=" text-sm text-gray-500" id="file-input-help">
                PNG, JPEG or JPG.
              </p>
            </div>
            <div className="col-span-2 h-[0.25px] bg-gray-800"></div>
            <div className="col-span-2 flex flex-col justify-start items-start">
              <label className="mb-3 text-white text-sm font-medium">
                Dithering Algorithm
              </label>
              <Combobox algorithm={algorithm} setAlgorithm={setAlgorithm} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-3 text-sm font-medium ">
                <label htmlFor="no-of-colors" className="text-text">
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
                <label htmlFor="scale-slider" className="text-text">
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
            <div className="col-span-2 flex justify-start gap-8">
              <RadioButton text="Grayscale" value="grayscale" />
              <RadioButton text="Tint" value="tint" />
              <input type="color" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-8 h-[85vh] lg:w-[60vw]">
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
