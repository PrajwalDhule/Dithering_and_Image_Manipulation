import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  setOriginalImage: (image: HTMLImageElement) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  setOriginalImage 
}) => {
  const imageUrlInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const handleApplyImageUrl = (_url?: string) => {
    const url = _url ? _url : imageUrlInputRef.current?.value;
    if (url) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = url;

      image.onload = () => {
        setOriginalImage(image);
      };
      image.onerror = () => {
        alert("Image link is broken! Please enter a valid image url.");
      };
    } else {
      alert("Please enter a valid image url!");
    }
  };

  const handleApplyImageFile = () => {
    const file = imageFileInputRef.current?.files?.[0];
    if (file) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        setOriginalImage(image);
      };
      image.onerror = () => {
        alert("Image is broken");
      };
    } else {
      alert("Please select an image file!");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-3 p-3 mt-2 bg-[#222] rounded-md">
      <div className="flex flex-col justify-start items-start">
        <label 
          htmlFor="input-image-url" 
          className="mb-3 text-text text-sm font-medium"
        >
          Image url
        </label>
        <div className="w-full flex gap-4">
          <input
            type="text"
            ref={imageUrlInputRef}
            id="input-image-url"
            className="col-span-2 w-3/5 bg-[#1a1a1a] outline-none border-[1px] border-outline-25 focus:border-outline-50 border-solid rounded-md px-2 py-1"
          />
          <Button
            variant="outline"
            className="w-[8em]"
            onClick={() => handleApplyImageUrl()}
          >
            Apply Image
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center -mb-4 text-light">
        <div className="w-1/5 h-[0.25px] bg-gray-700"></div>
        <span className="mx-4">OR</span>
        <div className="w-1/5 h-[0.25px] bg-gray-700"></div>
      </div>

      <div>
        <label
          className="block mb-2 text-sm font-medium text-text"
          htmlFor="input-image-file"
        >
          Upload Image
        </label>
        <div className="w-full flex gap-4">
          <input
            className="block w-3/5 mb-2 text-sm p-1 text-text outline-none border-[1px] border-outline-25 focus:border-outline-50 border-solid rounded-md cursor-pointer bg-[#1a1a1a]"
            id="input-image-file"
            ref={imageFileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          />
          <Button
            variant="outline"
            className="w-[8em]"
            onClick={handleApplyImageFile}
          >
            Apply Image
          </Button>
        </div>
        <p className="text-sm text-gray-500" id="file-input-help">
          Image Formats (like PNG, JPEG or JPG).
        </p>
      </div>
    </div>
  );
};