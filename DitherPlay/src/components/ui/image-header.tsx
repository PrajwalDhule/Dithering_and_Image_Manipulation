import React from 'react'
import { ArrowUpSvg } from '../assets/ArrowUpSvg'

interface ImageHeaderProps {
    headerText: string;
    onClickFn: (key: any) => void;
    isCollapsed: boolean;
  }

const ImageHeader: React.FC<ImageHeaderProps> = ({ 
    headerText, onClickFn, isCollapsed 
  }) =>  {
  return (
    <>
    <h3 className="absolute top-0 left-0 -translate-y-[150%] z-10 overflow-visible">{headerText}</h3>
    <button
      className="absolute top-0 right-0 -translate-y-[200%] z-10 overflow-visible lg:hidden p-0 bg-transparent"
      onClick={onClickFn}
    >
      <ArrowUpSvg
        className={
          isCollapsed ? "rotate-180" : "rotate-0"
        }
      />
    </button>
    </>
  )
}

export default ImageHeader