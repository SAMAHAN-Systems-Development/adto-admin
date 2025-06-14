"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  disabled,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      onChange(imageUrl);
    };

    reader.readAsDataURL(file);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      {value ? (
        <div className="relative w-40 h-40">
          <Image
            src={value || "/placeholder.svg"}
            alt="Organization icon"
            fill
            className="object-cover rounded-md"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-0 right-0 p-1 m-1 bg-red-500 rounded-full text-white shadow-sm"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="font-medium">Click to upload</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG</p>
            </div>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={disabled}
            />
          </label>
        </div>
      )}
    </div>
  );
};
