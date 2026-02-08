"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import Image from "next/image";
import { uploadEventBanner, uploadAsset } from "@/lib/api/services/assetService";

// how to use
{
  /* <UploadImage
  uploadType="event-banner" // or "asset"
  folder="custom-folder" // optional, for asset uploads
  onUploadComplete={(uploadData) => {
    // uploadData contains: { url, key, bucket, fileName }
    console.log(uploadData);
  }}
/> */
}

export interface UploadData {
  url: string;
  key: string;
  bucket: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

interface UploadImageProps {
  uploadType?: "event-banner" | "asset"; // Type of upload
  folder?: string; // Optional folder for asset uploads
  onUploadComplete?: (uploadData: UploadData) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export default function UploadImage({
  uploadType = "asset",
  folder,
  onUploadComplete,
  onUploadError,
  maxSizeMB = 10,
  acceptedTypes = ["image/png", "image/jpeg", "image/jpg"],
  className = "",
}: UploadImageProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload: ${acceptedTypes.join(", ")}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `File size exceeds ${maxSizeMB}MB limit. Current size: ${fileSizeMB.toFixed(2)}MB`;
    }

    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      if (onUploadError) {
        onUploadError(validationError);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create preview URL for immediate display
      const preview = await convertToBase64(file);
      setPreviewUrl(preview);

      // Upload to backend
      let uploadResult;
      if (uploadType === "event-banner") {
        uploadResult = await uploadEventBanner(file);
      } else {
        uploadResult = await uploadAsset(file, folder);
      }

      const uploadDataObj: UploadData = {
        url: uploadResult.url,
        key: uploadResult.key,
        bucket: uploadResult.bucket,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };

      setUploadData(uploadDataObj);
      setLoading(false);

      if (onUploadComplete) {
        onUploadComplete(uploadDataObj);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      setError(errorMessage);
      setPreviewUrl(null);
      if (onUploadError) {
        onUploadError(errorMessage);
      }
      console.error("Error uploading image:", error);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0];
      handleImageUpload(image);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || uploadData) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const image = files[0];
      if (image.type.startsWith("image/")) {
        handleImageUpload(image);
      } else {
        setError("Please drop an image file");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeSelectedImage = () => {
    setLoading(false);
    setUploadData(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div onDrop={handleDrop} onDragOver={handleDragOver} className="h-full">
        <label
          htmlFor="dropzone-file"
          className={`
            relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
            transition-colors w-full h-full min-h-[200px]
            ${
              error
                ? "border-destructive bg-destructive/5"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }
            ${loading || uploadData ? "cursor-not-allowed opacity-60" : ""}
          `}
        >
          {loading && (
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm font-semibold">Uploading Image</p>
              <p className="text-xs text-muted-foreground">
                Please wait...
              </p>
            </div>
          )}

          {!loading && !uploadData && !error && (
            <div className="text-center space-y-2">
              <div className="border p-3 rounded-md max-w-min mx-auto">
                <IoCloudUploadOutline
                  size="2em"
                  className="text-muted-foreground"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-black">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  {acceptedTypes.join(", ").toUpperCase()} (MAX. {maxSizeMB}MB)
                </p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center space-y-2">
              <IoCloseCircleOutline
                size="2em"
                className="text-destructive mx-auto"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-destructive">Error</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
            </div>
          )}

          {uploadData && previewUrl && !loading && (
            <div className="text-center space-y-3 w-full">
              <div className="relative w-full max-h-48 flex items-center justify-center">
                <Image
                  width={400}
                  height={400}
                  src={previewUrl}
                  className="w-full object-contain max-h-48 rounded-md"
                  alt="Uploaded image"
                />
                <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
                  <IoCheckmarkCircleOutline
                    size="1.5em"
                    className="text-green-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Upload Successful</p>
                <p className="text-xs text-muted-foreground">
                  {uploadData.fileName} ({(uploadData.fileSize / 1024).toFixed(2)} KB)
                </p>
              </div>
            </div>
          )}
        </label>

        <Input
          ref={fileInputRef}
          id="dropzone-file"
          accept={acceptedTypes.join(",")}
          type="file"
          className="hidden"
          disabled={loading || uploadData !== null}
          onChange={handleImageChange}
        />
      </div>

      {uploadData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground truncate flex-1">
              File uploaded to: {uploadData.bucket}
            </p>
            <Button
              onClick={removeSelectedImage}
              type="button"
              variant="secondary"
              size="sm"
              className="text-white"
            >
              Remove
            </Button>
          </div>
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View upload details
            </summary>
            <div className="mt-2 p-2 bg-muted rounded-md text-[10px] space-y-1">
              <p><strong>URL:</strong> {uploadData.url}</p>
              <p><strong>Key:</strong> {uploadData.key}</p>
              <p><strong>Bucket:</strong> {uploadData.bucket}</p>
            </div>
          </details>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-end">
          <Button
            onClick={() => {
              setError(null);
              triggerFileInput();
            }}
            type="button"
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
