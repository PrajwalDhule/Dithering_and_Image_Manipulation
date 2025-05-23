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
import { OptionsData } from "@/models/Options";

export interface ComboboxProps {
  value: string;
  options: OptionsData;
  variant?:
    | "outline"
    | "link"
    | "default"
    | "destructive"
    | "secondary"
    | "gradient"
    | "ghost";
  size?: "default" | "medium" | "thin" | "thin_medium" | "sm" | "lg" | "icon";
  onSelectFn: Function;
  onSelectFnArgs?: string[];
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  options,
  variant = "outline",
  size = "default",
  onSelectFn,
  onSelectFnArgs,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between tracking-wide"
        >
          {value
            ? options.options.find((option) => option.value === value)?.label
            : "Select Option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Option..." />
          <CommandList>
            <CommandEmpty>No Option found.</CommandEmpty>
            <CommandGroup>
              {options.options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
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
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
