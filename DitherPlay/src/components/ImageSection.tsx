import React from 'react';
import ImageHeader from '@/components/ui/image-header';

interface ImageSectionProps {
  isImageZoomMode: boolean;
  collapsedSections: {
    [key: string]: boolean;
  };
  toggleCollapse: (section: string) => void;
  outputCanvasRef: React.RefObject<HTMLCanvasElement>;
  inputCanvasRef: React.RefObject<HTMLCanvasElement>;
  originalImage?: HTMLImageElement;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  isImageZoomMode,
  collapsedSections,
  toggleCollapse,
  outputCanvasRef,
  inputCanvasRef,
  originalImage,
}) => {
  return (
    <>
      <div
        className={`${
          isImageZoomMode
            ? "w-auto h-auto max-w-full lg:max-w-[36vw] aspect-square"
            : "lg:w-[45%] lg:h-full"
        } relative pb-1 lg:pb-0`}
      >
        <ImageHeader
          headerText="Output image"
          onClickFn={() => toggleCollapse("outputImage")}
          isCollapsed={collapsedSections.outputImage}
        />
        <div
          className={`${
            isImageZoomMode ? "overflow-auto canvas-zoomed" : ""
          } h-full w-full`}
        >
          <canvas
            className={`${
              isImageZoomMode
                ? "min-w-[150vw] min-h-[150vw] lg:min-w-[50vw] lg:min-h-[50vw]"
                : "max-w-full h-auto max-h-full object-contain"
            } ${collapsedSections.outputImage ? "hidden lg:block" : ""}`}
            ref={outputCanvasRef}
          />
        </div>
      </div>

      <canvas className="hidden" ref={inputCanvasRef} />

      <div
        className={`${
          isImageZoomMode ? "" : "lg:w-[45%] lg:h-full"
        } relative mt-16 lg:mt-0 pb-1 lg:pb-0`}
      >
        <ImageHeader
          headerText="Input image"
          onClickFn={() => toggleCollapse("inputImage")}
          isCollapsed={collapsedSections.inputImage}
        />
        {originalImage?.src && (
          <img
            className={`${
              isImageZoomMode
                ? "lg:max-w-[15vw] lg:max-h-[15vw]"
                : "lg:max-w-full h-auto max-h-full"
            } object-contain ${
              collapsedSections.inputImage ? "hidden lg:block" : ""
            }`}
            src={originalImage.src}
            alt="Uploaded Image"
          />
        )}
      </div>
    </>
  );
};