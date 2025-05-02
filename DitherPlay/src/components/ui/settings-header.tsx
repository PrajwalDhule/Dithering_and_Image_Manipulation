import React from 'react'
import { ArrowUpSvg } from '../assets/ArrowUpSvg'
import Tooltip from './tooltip';

interface SettingsHeaderProps {
    headerText: string;
    onClickFn: (key: any) => void;
    isCollapsed: boolean;
  }

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ 
    headerText, onClickFn, isCollapsed 
  }) =>  {
  return (
    <div className="flex justify-between items-center text-white text-base font-medium segment-title p-3 bg-[#222] rounded-md relative">
    <h3>{headerText}</h3>
    {
      headerText === "More Filters" && (
        <Tooltip
            infoText="Safari currently not supported."
            classNameButton="top-[50%] left-[14ch] translate-y-[-50%]"
            classNameInfoBox="top-0 left-[10h]"
          />
      )
    }
    <button
      className="bg-transparent p-0"
      onClick={onClickFn}
    >
      <ArrowUpSvg
        className={
          isCollapsed ? "rotate-180" : "rotate-0"
        }
      />
    </button>
  </div>
  )
}

export default SettingsHeader