// src/app/components/chat/flow/SpaceUpload.tsx
'use client';

import React, { useState, ChangeEvent, useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Button from '../../common/Button';
import { FadeInUp, ScaleIn } from '../../common/animations';

interface SpaceUploadProps {
  selectedRoom: string;
  onUpload: (file: File) => void;
  onBack: () => void;
  onNext: () => void;
  uploadedFile?: File | null;
  onRemoveFile?: () => void;
  title?: string;
  className?: string;
}

const SpaceUpload: React.FC<SpaceUploadProps> = ({
  selectedRoom,
  onUpload,
  onBack,
  onNext,
  uploadedFile,
  onRemoveFile,
  title,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultTitle = `Let's see your ${selectedRoom}`;

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex-1 flex items-center justify-center px-4 py-8 lg:p-12 ${className}`}>
      <div className="max-w-3xl w-full">
        {/* Back button */}
        <FadeInUp>
          <button
            onClick={onBack}
            className="flex items-center space-x-3 text-gray-600 hover:text-indigo-600 transition-all duration-300 hover:translate-x-1 transform px-4 py-2 rounded-2xl hover:bg-indigo-50"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </button>
        </FadeInUp>

        <div className="text-center">
          <div className="text-center mb-8 md:mb-12">
            <FadeInUp delay={100}>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </FadeInUp>
            <FadeInUp delay={200}>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                {title || defaultTitle}
              </h1>
            </FadeInUp>
            <FadeInUp delay={300}>
              <p className="text-md md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Upload a photo of your current {selectedRoom.toLowerCase()} so we can personalize your design upgrade
              </p>
            </FadeInUp>
          </div>

          <ScaleIn delay={300}>
            <div
              className={
                'border-2 border-dashed rounded-3xl p-8 mb-12 transition-all duration-500 relative overflow-hidden ' +
                (() => {
                  if (uploadedFile) {
                    return 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50';
                  } else if (isDragOver) {
                    return 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 scale-105';
                  } else {
                    return 'border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50';
                  }
                })()
              }
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="relative">
                  <div className="bg-white rounded-2xl p-6 mb-6 h-80 lg:h-96 flex items-center justify-center overflow-hidden relative group shadow-xl">
                    <img
                      src={URL.createObjectURL(uploadedFile)}
                      alt="Uploaded room"
                      className="max-w-full max-h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                    {onRemoveFile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFile();
                        }}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center space-x-3 text-indigo-600">
                      <div className="w-8 h-8 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="font-semibold text-lg">Image uploaded successfully!</span>
                    </div>
                    <button
                      onClick={triggerFileInput}
                      className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-2xl hover:bg-indigo-200 transition-all duration-300 font-semibold hover:scale-105 transform"
                    >
                      Change image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <div className="mb-8 text-indigo-400 animate-bounce">
                    <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center">
                      <Upload className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Drop your image here
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">or click to browse from your device</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={triggerFileInput}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 transform shadow-xl flex items-center space-x-3 font-semibold"
                    >
                      <ImageIcon className="w-5 h-5" />
                      <span>Choose from gallery</span>
                    </button>
                    
                    <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 transform flex items-center space-x-3 font-semibold">
                      <Camera className="w-5 h-5" />
                      <span>Take photo</span>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-6">
                    Supports JPG, PNG, WebP (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </ScaleIn>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <FadeInUp delay={400}>
            <Button
              onClick={onNext}
              variant="primary"
              size="lg"
              disabled={!uploadedFile}
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-semibold text-lg shadow-xl"
            >
              Next: Choose Inspiration
            </Button>
          </FadeInUp>
        </div>

        <FadeInUp delay={600}>
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl">
            <h4 className="font-bold text-blue-900 mb-4">
              Tips for better results:
            </h4>
            <ul className="text-sm text-blue-800 space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Take the photo in good lighting
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Include as much of the room as possible
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Make sure the image is clear and not blurry
              </li>
            </ul>
          </div>
        </FadeInUp>
      </div>
    </div>
  );
};

export default SpaceUpload;