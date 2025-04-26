import { OptionsData } from "@/models/Options";

export const algorithmOptions: OptionsData = {
  options: [
    {
      value: "none",
      label: "None",
    },
    {
      value: "atkinson",
      label: "Atkinson",
    },
    {
      value: "floydsteinberg",
      label: "Floyd-Steinberg",
    },
    {
      value: "bayer",
      label: "Bayer",
    },
    {
      value: "halftone",
      label: "Halftone",
    },
    {
      value: "quantize",
      label: "Quantized (no error diffusion)",
    },
    {
      value: "atkinson-no-quantize",
      label: "Atkinson (no quantize)",
    },
    {
      value: "floydsteinberg-no-quantize",
      label: "Floyd-Steinberg (no quantize)",
    },
  ],
};

export const presetOptions: OptionsData = {
  options: [
    {
      value: "default",
      label: "Default",
    },
    {
      value: "preset 1",
      label: "Preset 1",
    },
    {
      value: "preset 2",
      label: "Preset 2",
    },
  ],
};
