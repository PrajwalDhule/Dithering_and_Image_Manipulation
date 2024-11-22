import { SettingsData } from "@/models/Settings";

export interface RangeSliderConfig { 
    key: keyof SettingsData;
    min: number;
    max: number;
    title: string;
 }

export const rangeSliderConfigs: RangeSliderConfig[] = [
  {
    key: "blur",
    min: 0,
    max: 25,
    title: "Blur",
  },
  {
    key: "brightness",
    min: 0,
    max: 200,
    title: "Brightness",
  },
  {
    key: "contrast",
    min: 0,
    max: 200,
    title: "Contrast",
  },
  {
    key: "hueRotate",
    min: 0,
    max: 360,
    title: "Hue Rotate",
  },
  {
    key: "invert",
    min: 0,
    max: 100,
    title: "Invert",
  },
  {
    key: "opacity",
    min: 0,
    max: 100,
    title: "Opacity",
  },
  {
    key: "sepia",
    min: 0,
    max: 100,
    title: "Sepia",
  },
];
