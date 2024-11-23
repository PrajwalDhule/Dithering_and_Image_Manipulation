import React from "react";
import { Combobox } from "./Combobox";
import RangeSlider from "./ui/range-slider";
import Tooltip from "@/components/ui/tooltip";
import { RadioButton } from "@/components/ui/radiobutton";
import Divider from "@/components/ui/divider";
import { OptionsData } from "@/models/Options";
import { SettingsData } from "@/models/Settings";

interface MainSettingsProps {
  settings: SettingsData;
  algorithmOptions: OptionsData;
  handleValueChange: (eventValue: string, settingsKey: string) => void;
  handleValueChangeDebounced: (value: any, key: string) => void;
  handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MainSettings: React.FC<MainSettingsProps> = ({
  settings,
  algorithmOptions,
  handleValueChange,
  handleValueChangeDebounced,
  handleRadioChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-4 mt-2 bg-[#222] rounded-md">
      <div className="col-span-2 flex flex-col lg:flex-row justify-start items-start">
        <div className="flex flex-col w-3/5">
          <label className="mb-3 text-white text-sm font-medium">
            Dithering Algorithm
          </label>
          <Combobox
            value={settings.algorithm}
            options={algorithmOptions}
            onSelectFn={handleValueChange}
            onSelectFnArgs={["algorithm"]}
          />
        </div>

        <div className="relative mt-4 lg:mt-0 lg:ml-4 w-3/5 lg:w-2/5">
          <Tooltip
            infoText="Does not work with ordered algorithms (eg: Bayer)."
            classNameButton="top-0 left-[8em]"
            classNameInfoBox="top-0 left-[2em] lg:-left-[2em]"
          />
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
      </div>

      <div className="relative">
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
        <Tooltip
          infoText="Changes might be slower for very large images and scale values. Only works with error based algorithms (eg: Atkinson and Floyd-Steinberg)"
          classNameButton="top-0 left-[3.75em]"
          classNameInfoBox="top-0 left-[6em]"
        />
      </div>

      <div className="relative">
        <Tooltip
          infoText="Changes might be slower for very large images and values."
          classNameButton="top-0 left-[3.5em]"
          classNameInfoBox="top-0 left-[2em]"
        />
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
  );
};
