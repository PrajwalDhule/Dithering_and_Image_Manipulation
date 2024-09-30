import { useEffect, useRef, useState } from "react";
import { applySettings } from "../functions/core";
import { Combobox } from "./Combobox";
import { Button } from "./ui/button";
import { RadioButton } from "./ui/radiobutton";
import Divider from "./ui/divider";
import RangeSlider from "./ui/range-slider";
import { SettingsData } from "@/models/Settings";

function Home() {
  const [algorithm, setAlgorithm] = useState("atkinson");
  const [imageFilterMode, setImageFilterMode] = useState<string>("grayscale");
  const [tint, setTint] = useState<string>("#3d85c6");
  const [noOfColors, setNoOfColors] = useState<number>(2);
  const [scale, setScale] = useState<number>(1);
  const [blur, setBlur] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [hueRotate, setHueRotate] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(100);
  const [sepia, setSepia] = useState<number>(0);
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

  const handleNoOfColorsValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNoOfColors(Number(event.target.value));
  };

  const handleBlurValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBlur(Number(event.target.value));
  };

  const handleBrightnessValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBrightness(Number(event.target.value));
  };

  const handleContrastValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setContrast(Number(event.target.value));
  };

  const handleHueRotateValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setHueRotate(Number(event.target.value));
  };

  const handleInvertValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInvert(Number(event.target.value));
  };

  const handleOpacityValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setOpacity(Number(event.target.value));
  };

  const handleSepiaValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSepia(Number(event.target.value));
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageFilterMode(event.target.value);
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

        const settings: SettingsData = {
          imageSrc,
          algorithm,
          imageFilterMode,
          noOfColors,
          scale,
          blur,
          brightness,
          contrast,
          hueRotate,
          invert,
          opacity,
          sepia,
        };

        applySettings(_originalImage, _inputCanvas, _outputCanvas, settings);
      };
    }
  }, [imageSrc]);

  useEffect(() => {
    if (originalImage && inputCanvas && outputCanvas) {
      const settings: SettingsData = {
        imageSrc,
        algorithm,
        imageFilterMode,
        noOfColors,
        scale,
        blur,
        brightness,
        contrast,
        hueRotate,
        invert,
        opacity,
        sepia,
      };

      applySettings(originalImage, inputCanvas, outputCanvas, settings);
    }
  }, [
    algorithm,
    imageFilterMode,
    noOfColors,
    scale,
    blur,
    brightness,
    contrast,
    hueRotate,
    invert,
    opacity,
    sepia,
  ]);

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
            <Divider />
            <div className="col-span-2 flex flex-col justify-start items-start">
              <label className="mb-3 text-white text-sm font-medium">
                Dithering Algorithm
              </label>
              <Combobox algorithm={algorithm} setAlgorithm={setAlgorithm} />
            </div>
            <div>
              <RangeSlider
                value={noOfColors}
                min={2}
                max={16}
                step={1}
                onChangeFn={handleNoOfColorsValueChange}
                id="no-of-colors"
                title="No. of Colors"
                showValue={noOfColors}
              />
            </div>
            <div>
              <RangeSlider
                value={scale}
                min={0.01}
                max={1}
                step={0.01}
                onChangeFn={handleScaleValueChange}
                id="scale-slider"
                title="Scale"
                showValue={Math.trunc(scale * 100).toString()}
              />
            </div>
            <Divider />
            <div className="col-span-2 flex justify-start items-center gap-8 py-2">
              <RadioButton
                text="Original"
                value="original"
                onChangeFn={handleRadioChange}
                isChecked={imageFilterMode === "original"}
              />
              <RadioButton
                text="Grayscale"
                value="grayscale"
                onChangeFn={handleRadioChange}
                isChecked={imageFilterMode === "grayscale"}
              />
              <div className="flex gap-4">
                <RadioButton
                  text="Tint"
                  value="tint"
                  onChangeFn={handleRadioChange}
                  isChecked={imageFilterMode === "tint"}
                />
                <input
                  type="color"
                  value={tint}
                  onChange={(e) => {
                    setTint(e.target.value);
                  }}
                />
              </div>
            </div>
            <Divider />
            <label className="col-span-2 mb-3 text-white text-sm font-medium">
              More filters
            </label>
            <div>
              <RangeSlider
                value={blur}
                min={0}
                max={25}
                step={1}
                onChangeFn={handleBlurValueChange}
                id="blur-slider"
                title="Blur"
                showValue={blur}
              />
            </div>

            <div>
              <RangeSlider
                value={brightness}
                min={0}
                max={200}
                step={1}
                onChangeFn={handleBrightnessValueChange}
                id="brightness-slider"
                title="Brightness"
                showValue={brightness}
              />
            </div>

            <div>
              <RangeSlider
                value={contrast}
                min={0}
                max={200}
                step={1}
                onChangeFn={handleContrastValueChange}
                id="contrast-slider"
                title="Contrast"
                showValue={contrast}
              />
            </div>

            <div>
              <RangeSlider
                value={hueRotate}
                min={0}
                max={360}
                step={1}
                onChangeFn={handleHueRotateValueChange}
                id="hue-rotate-slider"
                title="Hue Rotate"
                showValue={hueRotate}
              />
            </div>

            <div>
              <RangeSlider
                value={invert}
                min={0}
                max={100}
                step={1}
                onChangeFn={handleInvertValueChange}
                id="invert-slider"
                title="Invert"
                showValue={invert}
              />
            </div>

            <div>
              <RangeSlider
                value={opacity}
                min={0}
                max={100}
                step={1}
                onChangeFn={handleOpacityValueChange}
                id="opacity-slider"
                title="Opacity"
                showValue={opacity}
              />
            </div>

            <div>
              <RangeSlider
                value={sepia}
                min={0}
                max={100}
                step={1}
                onChangeFn={handleSepiaValueChange}
                id="sepia-slider"
                title="Sepia"
                showValue={sepia}
              />
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
