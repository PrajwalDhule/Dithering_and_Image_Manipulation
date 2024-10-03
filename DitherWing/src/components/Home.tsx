import { useEffect, useRef, useState } from "react";
import { applySettings } from "../functions/core";
import { Combobox } from "./Combobox";
import { Button } from "./ui/button";
import { RadioButton } from "./ui/radiobutton";
import Divider from "./ui/divider";
import RangeSlider from "./ui/range-slider";
import { SettingsData } from "@/models/Settings";
import { useDebounce } from "@/functions/helper";

function Home() {
  const defaultImageUrl =
    "https://i.postimg.cc/sXrgJtX5/imageedit-4-6675048281.jpg";
  const [settings, setSettings] = useState<SettingsData>({
    algorithm: "atkinson",
    noise: 1,
    noOfColors: 2,
    scale: 1,
    imageFilterMode: "grayscale",
    tint: "#3d85c6",
    blur: 0,
    brightness: 100,
    contrast: 100,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    sepia: 0,
  });
  const [isImageZoomMode, setIsImageZoomMode] = useState(false);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [inputCanvas, setInputCanvas] = useState<HTMLCanvasElement>();
  const [outputCanvas, setOutputCanvas] = useState<HTMLCanvasElement>();
  const imageUrlInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleValueChange = (eventValue: string, settingsKey: string): void => {
    if (settingsKey in settings) {
      const _settingsKey = settingsKey as keyof SettingsData;
      const val =
        typeof settings[_settingsKey] === "number"
          ? Number(eventValue)
          : eventValue;
      setSettings((prevSettings) => ({
        ...prevSettings,
        [_settingsKey]: val,
      }));
    }
  };

  const handleValueChangeDebounced = useDebounce(handleValueChange, 5);
  // const handleValueChangeDebounced = handleValueChange;

  const applySettingsDebounced = useDebounce(applySettings, 200);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      imageFilterMode: event.target.value,
    }));
  };

  const handleApplyImageUrl = (_url?: string) => {
    const url = _url ? _url : imageUrlInputRef.current?.value;
    if (url) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = url;

      image.onload = () => {
        setOriginalImage(image);
      };
      image.onerror = () => {
        alert("Image link is broken! Please enter a valid image url.");
      };
    } else {
      alert("Please enter a valid image url!");
    }
  };

  const handleApplyImageFile = () => {
    const file = imageFileInputRef.current?.files?.[0];
    if (file) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        setOriginalImage(image);
      };
      image.onerror = () => {
        alert("Image is broken");
      };
    } else {
      alert("Please select an image file!");
    }
  };

  useEffect(() => {
    const _originalImage = new Image();
    _originalImage.crossOrigin = "anonymous";
    _originalImage.src = defaultImageUrl;

    _originalImage.onload = () => {
      setOriginalImage(_originalImage);
    };
  }, []);

  useEffect(() => {
    if (originalImage) {
      const _inputCanvas = inputCanvasRef.current;
      const _outputCanvas = outputCanvasRef.current;
      if (_inputCanvas && _outputCanvas) {
        const _originalImage = new Image();
        _originalImage.crossOrigin = "anonymous";
        _originalImage.src = originalImage.src;

        _originalImage.onload = () => {
          _outputCanvas.width = _originalImage.width;
          _outputCanvas.height = _originalImage.height;
          setInputCanvas(_inputCanvas);
          setOutputCanvas(_outputCanvas);

          applySettings(originalImage, _inputCanvas, _outputCanvas, settings);
        };
      }
    }
  }, [originalImage]);

  useEffect(() => {
    if (originalImage && inputCanvas && outputCanvas) {
      applySettingsDebounced(
        originalImage,
        inputCanvas,
        outputCanvas,
        settings
      );
    }
  }, [settings]);

  return (
    <>
      <div className="w-[92.5vw] lg:flex justify-between items-start">
        <div className="lg:w-[30vw]">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={() => setIsImageZoomMode((prevState) => !prevState)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Toggle me
            </span>
          </label>
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div className="col-span-2 text-white text-sm font-medium">
              <span>Input image</span>
            </div>
            <div className="col-span-2 flex flex-col justify-start items-start">
              <label
                htmlFor="input-image-url"
                className="mb-3 text-text text-sm font-medium"
              >
                Image url
              </label>
              <div className="w-full flex gap-4">
                <input
                  type="text"
                  ref={imageUrlInputRef}
                  id="input-image-url"
                  className="col-span-2 w-3/5 bg-[#111] outline-none border-[1px] border-outline-25 focus:border-outline-50 border-solid rounded-md px-2 py-1"
                />
                <Button
                  variant="outline"
                  className="w-[8em]"
                  onClick={() => handleApplyImageUrl()}
                >
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
                htmlFor="input-image-file"
              >
                Upload Image
              </label>
              <div className="w-full flex gap-4">
                <input
                  className="block w-3/5 mb-2 text-sm p-1 text-text outline-none border-[1px] border-outline-25 focus:border-outline-50 border-solid rounded-md cursor-pointer bg-[#111]"
                  id="input-image-file"
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                />
                <Button
                  variant="outline"
                  className="w-[8em]"
                  onClick={() => handleApplyImageFile()}
                >
                  Apply Image
                </Button>
              </div>
              <p className=" text-sm text-gray-500" id="file-input-help">
                PNG, JPEG or JPG.
              </p>
            </div>
            <Divider />
            <div className="col-span-2 text-white text-sm font-medium">
              <span>Main settings</span>
            </div>
            <div className="col-span-2 flex justify-between items-start">
              <div className="flex flex-col w-3/5">
                <label className="mb-3 text-white text-sm font-medium">
                  Dithering Algorithm
                </label>
                <Combobox
                  value={settings.algorithm}
                  onSelectFn={handleValueChange}
                  onSelectFnArgs={["algorithm"]}
                />
              </div>
              <div className="relative ml-4">
                <RangeSlider
                  value={settings.noise}
                  min={1}
                  max={10}
                  step={0.1}
                  onChangeFn={handleValueChange}
                  onChangeFnArgs={["noise"]}
                  id="noise-slider"
                  title="Noise"
                  showValue={settings.noise}
                />

                <button
                  data-tooltip-target="tooltip-noise"
                  type="button"
                  className="tooltip-button absolute top-0 left-[3.75em] p-0 m-0 text-xs text-center font-bold text-black bg-muted-foreground h-[1.5em] aspect-square rounded-[50%]"
                >
                  <div
                    id="tooltip-noise"
                    role="tooltip"
                    className="absolute hidden opacity-0 z-10 top-0 left-0 -translate-x-[60%] lg:-translate-x-[50%] -translate-y-[125%] w-[30ch] px-3 py-2 text-sm lg:text-xs text-start font-normal text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm tooltip"
                  >
                    Changes might be slower for very large images and scale
                    values. Only works with error based algorithms (eg: Atkinson
                    and Floyd-Steinberg)
                  </div>
                  <div>i</div>
                </button>

                {/*
                 */}
              </div>
            </div>
            <div className="relative">
              <button
                data-tooltip-target="tooltip-scale"
                type="button"
                className="tooltip-button absolute top-0 left-[8em] p-0 m-0 text-xs text-center font-bold text-black bg-muted-foreground h-[1.5em] aspect-square rounded-[50%]"
              >
                <div
                  id="tooltip-scale"
                  role="tooltip"
                  className="absolute hidden opacity-0 z-10 top-0 left-0 -translate-x-[60%] lg:-translate-x-[50%] -translate-y-[125%] w-[30ch] px-3 py-2 text-sm lg:text-xs text-start font-normal text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm tooltip"
                >
                  Does not work with ordered algorithms (eg: Bayer).
                </div>
                <div>i</div>
              </button>
              <RangeSlider
                value={settings.noOfColors}
                min={2}
                max={16}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["noOfColors"]}
                id="no-of-colors"
                title="No. of Colors"
                showValue={settings.noOfColors}
              />
            </div>
            <div className="relative">
              <button
                data-tooltip-target="tooltip-scale"
                type="button"
                className="tooltip-button absolute top-0 left-[3.5em] p-0 m-0 text-xs text-center font-bold text-black bg-muted-foreground h-[1.5em] aspect-square rounded-[50%]"
              >
                <div
                  id="tooltip-scale"
                  role="tooltip"
                  className="absolute hidden opacity-0 z-10 top-0 left-0 -translate-x-[60%] lg:-translate-x-[50%] -translate-y-[125%] w-[30ch] px-3 py-2 text-sm lg:text-xs text-start font-normal text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm tooltip"
                >
                  Changes might be slower for very large images.
                </div>
                <div>i</div>
              </button>
              <RangeSlider
                value={settings.scale}
                min={0.05}
                max={1}
                step={0.05}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["scale"]}
                id="scale-slider"
                title="Scale"
                showValue={Math.trunc(settings.scale * 100).toString()}
              />
            </div>
            <Divider />
            <div className="col-span-2 flex justify-start items-center gap-8 py-2">
              <RadioButton
                text="Original"
                value="original"
                onChangeFn={handleRadioChange}
                isChecked={settings.imageFilterMode === "original"}
              />
              <RadioButton
                text="Grayscale"
                value="grayscale"
                onChangeFn={handleRadioChange}
                isChecked={settings.imageFilterMode === "grayscale"}
              />
              <div className="flex gap-4">
                <RadioButton
                  text="Tint"
                  value="tint"
                  onChangeFn={handleRadioChange}
                  isChecked={settings.imageFilterMode === "tint"}
                />
                <input
                  type="color"
                  value={settings.tint}
                  onChange={(e) => {
                    handleValueChangeDebounced(e.target.value, "tint");
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
                value={settings.blur}
                min={0}
                max={25}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["blur"]}
                id="blur-slider"
                title="Blur"
                showValue={settings.blur}
                // key={settings.blur}
              />
            </div>

            <div>
              <RangeSlider
                value={settings.brightness}
                min={0}
                max={200}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["brightness"]}
                id="brightness-slider"
                title="Brightness"
                showValue={settings.brightness}
              />
            </div>

            <div>
              <RangeSlider
                value={settings.contrast}
                min={0}
                max={200}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["contrast"]}
                id="contrast-slider"
                title="Contrast"
                showValue={settings.contrast}
              />
            </div>

            <div>
              <RangeSlider
                value={settings.hueRotate}
                min={0}
                max={360}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["hueRotate"]}
                id="hue-rotate-slider"
                title="Hue Rotate"
                showValue={settings.hueRotate}
              />
            </div>

            <div>
              <RangeSlider
                value={settings.invert}
                min={0}
                max={100}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["invert"]}
                id="invert-slider"
                title="Invert"
                showValue={settings.invert}
              />
            </div>

            <div>
              <RangeSlider
                value={settings.opacity}
                min={0}
                max={100}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["opacity"]}
                id="opacity-slider"
                title="Opacity"
                showValue={settings.opacity}
              />
            </div>

            <div>
              <RangeSlider
                value={settings.sepia}
                min={0}
                max={100}
                step={1}
                onChangeFn={handleValueChangeDebounced}
                onChangeFnArgs={["sepia"]}
                id="sepia-slider"
                title="Sepia"
                showValue={settings.sepia}
              />
            </div>
          </div>
        </div>
        {/* <div className="flex justify-end gap-8 h-[85vh] lg:w-[60vw]">
          <canvas
            className="max-w-[45%] h-auto object-contain"
            ref={outputCanvasRef}
          />
          <canvas className="hidden" ref={inputCanvasRef} />
          {originalImage?.src && (
            <img
              className="max-w-[45%] h-auto object-contain"
              src={originalImage.src}
              alt="Uploaded Image"
            />
          )}
        </div> */}

        <div className="flex items-start gap-8 h-[85vh] lg:w-[60vw]">
          <div
            className={`${
              isImageZoomMode ? "w-[40vw] h-[40vw] overflow-auto" : "w-[45%]"
            }`}
          >
            <canvas
              className={`${
                isImageZoomMode
                  ? "min-w-[54vw] min-h-[54vw]"
                  : "max-w-full h-auto object-contain"
              }`}
              ref={outputCanvasRef}
            />
          </div>
          <canvas className="hidden" ref={inputCanvasRef} />
          {originalImage?.src && (
            <img
              className={`${
                isImageZoomMode
                  ? "max-w-[15vw] max-h-[15vw]"
                  : "max-w-[45%] h-auto object-contain"
              }`}
              src={originalImage.src}
              alt="Uploaded Image"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
