import { useEffect, useRef, useState } from "react";
import { applySettings } from "../functions/core";
import { Combobox } from "./Combobox";
import { Button } from "./ui/button";
import { RadioButton } from "./ui/radiobutton";
import Divider from "./ui/divider";
import RangeSlider from "./ui/range-slider";
import { SettingsData } from "@/models/Settings";
import { useDebounce } from "@/functions/helper";
import { ArrowUpSvg } from "./assets/ArrowUpSvg";
import { Navbar } from "./Navbar";

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

  const [collapsedSections, setCollapsedSections] = useState({
    inputImageField: false,
    mainSettings: false,
    moreFilters: false,
    inputImage: false,
    outputImage: false,
  });

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

  const resetSettings = () => {
    setSettings({
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

  const toggleCollapse = (section: string) => {
    if (section in collapsedSections) {
      setCollapsedSections((prevState) => ({
        ...prevState,
        [section]: !prevState[section as keyof typeof collapsedSections],
      }));
    }
  };

  const exportImage = () => {
    if (outputCanvas) {
      const link = document.createElement("a");
      link.download = "ditherplay-image.png";
      link.href = outputCanvas.toDataURL("image/png");
      link.click();
    } else {
      alert(
        "Oops! Couldn't get the output image, something went wrong. Please try again later."
      );
    }
  };

  return (
    <>
      <div className="relative w-[92.5vw]">
        <Navbar
          setIsImageZoomMode={setIsImageZoomMode}
          exportImage={exportImage}
        />
        <div className="lg:flex flex-row-reverse justify-between items-start">
          <div className="">
            <div className="lg:flex justify-end items-start gap-8 lg:h-[80vh] lg:w-[57vw] mt-10">
              <div
                className={`${
                  isImageZoomMode
                    ? "w-auto h-auto max-w-full lg:max-w-[36vw] aspect-square"
                    : "lg:w-[45%] lg:h-full"
                } relative pb-1 lg:pb-0`}
              >
                <h3 className="absolute top-0 left-0 -translate-y-[150%] z-10 overflow-visible">
                  Output image
                </h3>
                <button
                  className="absolute top-0 right-0 -translate-y-[200%] z-10 overflow-visible lg:hidden p-0 bg-transparent"
                  onClick={() => toggleCollapse("outputImage")}
                >
                  <ArrowUpSvg
                    className={` ${
                      collapsedSections.outputImage ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`${
                    isImageZoomMode ? "overflow-auto canvas-zoomed" : ""
                  } h-full w-full`}
                >
                  <canvas
                    className={`${
                      isImageZoomMode
                        ? "min-w-[150vw] min-h-[150vw] lg:min-w-[50vw] lg:min-h-[50vw]"
                        : "max-w-full h-auto max-h-full object-contain"
                    } ${
                      collapsedSections.outputImage ? "hidden lg:block" : ""
                    }`}
                    ref={outputCanvasRef}
                  />
                </div>
              </div>
              <canvas className="hidden" ref={inputCanvasRef} />
              <div
                className={`${
                  isImageZoomMode ? "" : "lg:w-[45%] lg:h-full"
                } relative mt-16 lg:mt-0 pb-1 lg:pb-0`}
              >
                <h3 className="absolute top-0 left-0 -translate-y-[150%] z-10 overflow-visible">
                  Input image
                </h3>
                <button
                  className="absolute top-0 right-0 -translate-y-[200%] z-10 overflow-visible lg:hidden p-0 bg-transparent"
                  onClick={() => toggleCollapse("inputImage")}
                >
                  <ArrowUpSvg
                    className={` ${
                      collapsedSections.inputImage ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {originalImage?.src && (
                  <img
                    className={`${
                      isImageZoomMode
                        ? "lg:max-w-[15vw] lg:max-h-[15vw]"
                        : "lg:max-w-full h-auto max-h-full"
                    } object-contain ${
                      collapsedSections.inputImage ? "hidden lg:block" : ""
                    }`}
                    src={originalImage.src}
                    alt="Uploaded Image"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-[35vw] lg:h-[85vh] lg:overflow-auto lg:pl-1 lg:pr-6 mt-8 lg:mt-0 settings">
            <div className="flex flex-col gap-0 mb-6">
              <div className="flex justify-between items-center text-white text-base font-medium segment-title">
                <h3>Select Input image</h3>
                <button
                  className="bg-transparent p-0"
                  onClick={() => toggleCollapse("inputImageField")}
                >
                  <ArrowUpSvg
                    className={
                      collapsedSections.inputImageField
                        ? "rotate-180"
                        : "rotate-0"
                    }
                  />
                </button>
              </div>
              {!collapsedSections.inputImageField && (
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 mt-6">
                  <div className="flex flex-col justify-start items-start">
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
                  <div className="flex justify-center items-center -mb-4 -mt-1 text-light">
                    <div className="w-1/5 h-[0.25px] bg-gray-800"></div>
                    <span className="mx-4">Or</span>
                    <div className="w-1/5 h-[0.25px] bg-gray-800"></div>
                  </div>
                  <div>
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
                </div>
              )}

              <Divider classNames="mt-6" />

              <div className="flex justify-between items-center mt-6 text-white text-base font-medium segment-title">
                <h3>Main settings</h3>
                <button
                  className="bg-transparent p-0"
                  onClick={() => toggleCollapse("mainSettings")}
                >
                  <ArrowUpSvg
                    className={
                      collapsedSections.mainSettings ? "rotate-180" : "rotate-0"
                    }
                  />
                </button>
              </div>
              {!collapsedSections.mainSettings && (
                <div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-10">
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
                            Changes might be slower for very large images and
                            scale values. Only works with error based algorithms
                            (eg: Atkinson and Floyd-Steinberg)
                          </div>
                          <div>i</div>
                        </button>
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
                          Changes might be slower for very large images and
                          values.
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
                  </div>
                </div>
              )}

              <Divider classNames="mt-6" />

              <div className="flex justify-between items-center mt-6 text-white text-base font-medium segment-title">
                <h3>More filters</h3>
                <button
                  className="bg-transparent p-0"
                  onClick={() => toggleCollapse("moreFilters")}
                >
                  <ArrowUpSvg
                    className={
                      collapsedSections.moreFilters ? "rotate-180" : "rotate-0"
                    }
                  />
                </button>
              </div>
              {!collapsedSections.moreFilters && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-10">
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
              )}

              <Button
                variant="outline"
                className="w-[6em] mt-4 self-end"
                onClick={() => resetSettings()}
              >
                Reset
              </Button>

              <a
                href="https://www.producthunt.com/posts/ditherplay?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ditherplay"
                target="_blank"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=496197&theme=dark"
                  alt="DitherPlay - Realtime&#0032;image&#0032;dithering&#0032;&#0038;&#0032;filters&#0032;in&#0032;a&#0032;responsive&#0032;interface | Product Hunt"
                  width="250"
                  height="54"
                  className="lg:hidden w-[187px] h-[40px] mt-8"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
