import React from 'react'
import { ArrowUpSvg } from '../assets/ArrowUpSvg'

interface SettingsHeaderProps {
    headerText: string;
    onClickFn: (key: any) => void;
    isCollapsed: boolean;
  }

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ 
    headerText, onClickFn, isCollapsed 
  }) =>  {
  return (
    <div className="flex justify-between items-center text-white text-base font-medium segment-title p-3 bg-[#222] rounded-md">
    <h3>{headerText}</h3>
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