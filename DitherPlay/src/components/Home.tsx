import { useEffect, useRef, useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { Navbar } from "./Navbar";
import { MainSettings } from "./MainSettings";
import { MoreFilters } from "./MoreFilters";
import { ImageSection } from "./ImageSection";
import { Combobox } from "./Combobox";
import { ProductHuntEmbedMobile } from "./productHuntEmbeds/ProductHuntEmbedMobile";
import { Button } from "./ui/button";
import Divider from "./ui/divider";
import SettingsHeader from "./ui/settings-header";
import { applySettings } from "@/functions/core";
import { useDebounce } from "@/functions/helper";
import { SettingsData } from "@/models/Settings";
import { rangeSliderConfigs } from "@/constants/rangeSliderConfig";
import { algorithmOptions, presetOptions } from "@/constants/comboboxOptions";
import {
  defaultSettingsData,
  preset1SettingsData,
  preset2SettingsData,
} from "@/constants/settingsData";
import defaultInputImage from "./assets/default_input_image.jpg";

function Home() {
  const [preset, setPreset] = useState<string>("default");
  const [settings, setSettings] = useState<SettingsData>(defaultSettingsData);
  const [isImageZoomMode, setIsImageZoomMode] = useState(false);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [inputCanvas, setInputCanvas] = useState<HTMLCanvasElement>();
  const [outputCanvas, setOutputCanvas] = useState<HTMLCanvasElement>();
  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);

  const [collapsedSections, setCollapsedSections] = useState({
    inputImageField: false,
    mainSettings: false,
    moreFilters: false,
    inputImage: false,
    outputImage: false,
  });

  const handlePresetValueChange = (presetValue: string): void => {
    setPreset(presetValue);
    switch (presetValue) {
      case "preset 1":
        setSettings(preset1SettingsData);
        break;
      case "preset 2":
        setSettings(preset2SettingsData);
        break;
      default:
        setSettings(defaultSettingsData);
        break;
    }
  };

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

  const applySettingsDebounced = useDebounce(applySettings, 200);

  const handleRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      imageFilterMode: event.target.value,
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettingsData);
  };

  useEffect(() => {
    const _originalImage = new Image();
    _originalImage.crossOrigin = "anonymous";
    _originalImage.src = defaultInputImage;

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
              <ImageSection
                isImageZoomMode={isImageZoomMode}
                collapsedSections={collapsedSections}
                toggleCollapse={toggleCollapse}
                outputCanvasRef={outputCanvasRef}
                inputCanvasRef={inputCanvasRef}
                originalImage={originalImage}
              />
            </div>
          </div>

          <div className="lg:w-[35vw] lg:h-[85vh] mt-8 lg:mt-0 settings">
            <div className="flex justify-between items-center text-white font-medium segment-title">
              <div className="flex justify-between items-center">
                <div className="h-2 w-2 rounded-[50%] mr-2 bg-gray-300"></div>
                <h2 className="text-xl">Settings</h2>
              </div>
              <Button
                variant="basic"
                size="thin_medium"
                className="px-3 h-8 ml-auto mr-4"
                onClick={() => resetSettings()}
              >
                Reset
              </Button>
              <div className="flex justify-end items-stretch w-1/3 lg:w-[45%] text-base rounded-md bg-[#2a2a2a]">
                <div className="hidden lg:flex justify-center items-center flex-1 rounded-s-md px-3 text-sm text-[#ccc]">
                  Preset
                </div>
                <Combobox
                  value={preset}
                  variant="gradient"
                  size="thin"
                  options={presetOptions}
                  onSelectFn={handlePresetValueChange}
                />
              </div>
            </div>

            <Divider classNames="my-6" />

            <div className="flex flex-col gap-0 mb-6 lg:h-[70vh] lg:pl-1 lg:pr-4 lg:overflow-auto settings-section">
              <SettingsHeader
                headerText="Select Input image"
                onClickFn={() => toggleCollapse("inputImageField")}
                isCollapsed={collapsedSections.inputImageField}
              />
              {!collapsedSections.inputImageField && (
                <ImageUpload setOriginalImage={setOriginalImage} />
              )}

              <Divider classNames="mt-6" />

              <SettingsHeader
                headerText="Main settings"
                onClickFn={() => toggleCollapse("mainSettings")}
                isCollapsed={collapsedSections.mainSettings}
              />
              {!collapsedSections.mainSettings && (
                <div>
                  <MainSettings
                    settings={settings}
                    algorithmOptions={algorithmOptions}
                    handleValueChange={handleValueChange}
                    handleValueChangeDebounced={handleValueChangeDebounced}
                    handleRadioChange={handleRadioChange}
                  />
                </div>
              )}

              <Divider classNames="mt-6" />

              <SettingsHeader
                headerText="More Filters"
                onClickFn={() => toggleCollapse("moreFilters")}
                isCollapsed={collapsedSections.moreFilters}
              />
              {!collapsedSections.moreFilters && (
                <MoreFilters
                  rangeSliderConfigs={rangeSliderConfigs}
                  settings={settings}
                  handleValueChangeDebounced={handleValueChangeDebounced}
                />
              )}

              <ProductHuntEmbedMobile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
