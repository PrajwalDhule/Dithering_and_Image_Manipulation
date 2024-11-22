import { SettingsData } from "@/models/Settings";

export const defaultSettingsData: SettingsData = {
  algorithm: "atkinson",
  noise: 1,
  noOfColors: 2,
  scale: 0.6,
  imageFilterMode: "grayscale",
  tint: "#3d85c6",
  blur: 0,
  brightness: 100,
  contrast: 100,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  sepia: 0,
};

export const preset1SettingsData: SettingsData = {
  algorithm: "quantize",
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
};

export const preset2SettingsData: SettingsData = {
    algorithm: "quantize",
    noise: 1,
    noOfColors: 11,
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
  };
