"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
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
    value: "quantize",
    label: "Quantized (no dither)",
  },
  {
    value: "atkinson-no-quantize",
    label: "Atkinson (no quantize)",
  },
  {
    value: "floydsteinberg-no-quantize",
    label: "Floyd-Steinberg (no quantize)",
  },
];

export interface ComboboxProps {
  value: string;
  onSelectFn: Function;
  onSelectFnArgs?: string[];
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  onSelectFn,
  onSelectFnArgs,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    const val = currentValue === value ? "" : currentValue;
                    onSelectFnArgs
                      ? onSelectFn(val, ...onSelectFnArgs)
                      : onSelectFn(val);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
