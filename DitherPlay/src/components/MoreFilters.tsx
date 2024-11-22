import React from "react";
import RangeSlider from "@/components/ui/range-slider";
import { RangeSliderConfig } from "@/constants/rangeSliderConfig";
import { SettingsData } from "@/models/Settings";

interface MoreFiltersProps {
  rangeSliderConfigs: RangeSliderConfig[];
  settings: SettingsData;
  handleValueChangeDebounced: (event: string, ...args: string[]) => void;
}

export const MoreFilters: React.FC<MoreFiltersProps> = ({
  rangeSliderConfigs,
  settings,
  handleValueChangeDebounced,
}) => {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-4 mt-2 bg-[#222] rounded-md">
      {rangeSliderConfigs.map((config) => (
        <div key={config.key}>
          <RangeSlider
            value={settings[config.key] as number}
            min={config.min}
            max={config.max}
            step={1}
            onChangeFn={handleValueChangeDebounced}
            onChangeFnArgs={[config.key]}
            id={`${config.key}-slider`}
            title={config.title}
            showValue={settings[config.key]}
          />
        </div>
      ))}
    </div>
  );
};
