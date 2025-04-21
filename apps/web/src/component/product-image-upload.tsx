'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ProductImageUploadProps {
  onChange: (files: File[]) => void;
}

export default function ProductImageUpload({
  onChange,
}: ProductImageUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate file types and sizes
    const invalidFiles = files.filter((file) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 1024 * 1024; // 1MB

      if (!validTypes.includes(file.type)) {
        setError('Only JPG, JPEG, PNG, and GIF files are allowed.');
        return true;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 1MB.');
        return true;
      }

      return false;
    });

    if (invalidFiles.length > 0) {
      return;
    }

    setError(null);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));

    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setSelectedFiles((prev) => [...prev, ...files]);
    onChange([...selectedFiles, ...files]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);

    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);

    setPreviewUrls(newPreviewUrls);
    setSelectedFiles(newSelectedFiles);
    onChange(newSelectedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square border rounded-md overflow-hidden"
          >
            <Image
              src={url || '/placeholder.svg'}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </button>
          </div>
        ))}

        <div
          className="aspect-square border rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center">Click to upload</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.gif"
        multiple
        className="hidden"
      />
    </div>
  );
}
