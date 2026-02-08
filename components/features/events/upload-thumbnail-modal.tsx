"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadImage, { type UploadData } from "@/components/shared/upload-image";
import { useState } from "react";

interface UploadThumbnailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (uploadData: UploadData) => void;
}

export function UploadThumbnailModal({
  isOpen,
  onClose,
  onSubmit,
}: UploadThumbnailModalProps) {
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUploadComplete = (data: UploadData) => {
    console.log("Thumbnail uploaded:", data);
    setUploadData(data);
    setUploadError(null);
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    setUploadError(error);
    setUploadData(null);
  };

  const handleSubmit = () => {
    if (uploadData && onSubmit) {
      onSubmit(uploadData);
    }
    onClose();
  };

  const handleClose = () => {
    setUploadData(null);
    setUploadError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-lg md:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-4 md:p-6 border-gray-200">
          <h2 className="text-2xl sm:text-2xl md:text-2xl font-semibold text-gray-900">
            Upload Event Thumbnail
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4 md:p-6 space-y-1 sm:space-y-2 md:space-y-4">
          <p className="text-[10px] sm:text-xs md:text-base text-gray-700">
            Select a file to upload and click the submit button
          </p>

          <div className="text-[9px] sm:text-[10px] md:text-sm text-gray-500 space-y-0 sm:space-y-0.5">
            <p>Maximum file size: 10 MB</p>
            <p>Accepted file types: png, jpg, jpeg</p>
          </div>

          {/* Upload Image Component */}
          <div className="mt-1 sm:mt-2 md:mt-4">
            <UploadImage 
              uploadType="asset"
              folder="event-thumbnails"
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              acceptedTypes={["image/png", "image/jpeg", "image/jpg"]}
            />
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-start gap-1 sm:gap-1.5 md:gap-3 p-1.5 sm:p-2 md:p-4 bg-red-50 border border-red-300 rounded-md md:rounded-lg">
              <p className="text-[9px] sm:text-[10px] md:text-sm text-red-800 leading-tight">
                {uploadError}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-2 sm:p-3 md:p-6 border-t border-gray-200">
          <Button
            onClick={handleSubmit}
            disabled={!uploadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-2 text-[10px] sm:text-xs md:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
