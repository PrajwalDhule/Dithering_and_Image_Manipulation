import React from "react";
import { Button } from "./ui/button";
import Logo from "../assets/DitherPlay-logo-4.png";

interface NavbarProps {
  setIsImageZoomMode: React.Dispatch<React.SetStateAction<boolean>>;
  exportImage: () => void;
}
export const Navbar = ({ setIsImageZoomMode, exportImage }: NavbarProps) => {
  return (
    <div className="lg:sticky lg:top-0 flex justify-between items-center pt-4 pb-6">
      <div>
        <img src={Logo} alt="DitherPlay logo" className="h-[2.5em]" />
      </div>
      <div className="flex justify-end items-center gap-x-4 lg:gap-x-8">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            onChange={() => setIsImageZoomMode((prevState) => !prevState)}
          />
          <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#666] peer-checked:after:bg-[#111] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-200"></div>
          <span className="hidden lg:block ms-3 text-sm font-medium text-gray-300">
            Zoom Mode
          </span>
          <span className="lg:hidden ms-3 text-sm font-medium text-gray-300">
            Zoom
          </span>
        </label>
        <Button
          variant="outline"
          className="w-[6em] self-end"
          onClick={() => exportImage()}
        >
          Export
        </Button>
      </div>
    </div>
  );
};
