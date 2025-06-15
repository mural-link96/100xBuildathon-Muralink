// src/app/components/chat/flow/InspirationSelection.tsx
'use client';

import React from 'react';
import { Check, ArrowLeft, Palette } from 'lucide-react';
import Button from '../../common/Button';
import { FadeInUp, ScaleIn } from '../../common/animations';

interface InspirationImage {
  id: number;
  url: string;
  aspectRatio: string;
  alt: string;
  style?: string;
}

interface InspirationSelectionProps {
  selectedInspiration: number[];
  onToggleInspiration: (imageId: number) => void;
  onBack: () => void;
  onNext: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

const INSPIRATION_IMAGES: InspirationImage[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
    aspectRatio: "4:5",
    alt: "Modern minimalist living room",
    style: "Minimalist"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400&auto=format&fit=crop",
    aspectRatio: "2:3",
    alt: "Scandinavian bedroom design",
    style: "Scandinavian"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
    aspectRatio: "4:3",
    alt: "Cozy reading nook",
    style: "Cozy"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=400&fit=crop",
    aspectRatio: "1:1",
    alt: "Open concept kitchen",
    style: "Modern"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=500&fit=crop",
    aspectRatio: "4:5",
    alt: "Contemporary dining space",
    style: "Contemporary"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=350&fit=crop",
    aspectRatio: "8:7",
    alt: "Neutral color palette",
    style: "Neutral"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=450&fit=crop",
    aspectRatio: "8:9",
    alt: "Modern furniture arrangement",
    style: "Industrial"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=600&fit=crop",
    aspectRatio: "2:3",
    alt: "Vertical gallery wall",
    style: "Artistic"
  }
];

const getImageHeightClass = (aspectRatio: string): string => {
  const heightMap: Record<string, string> = {
    '1:1': 'h-64',
    '4:3': 'h-48',
    '4:5': 'h-80',
    '2:3': 'h-96',
    '8:7': 'h-56',
    '8:9': 'h-72'
  };
  return heightMap[aspectRatio] || 'h-64';
};

const InspirationCard: React.FC<{
  image: InspirationImage;
  isSelected: boolean;
  onToggle: (imageId: number) => void;
  index: number;
}> = ({ image, isSelected, onToggle, index }) => {
  return (
    <ScaleIn delay={index * 100}>
      <div
        onClick={() => onToggle(image.id)}
        className={`
          relative cursor-pointer rounded-3xl overflow-hidden transform hover:scale-105 break-inside-avoid mb-8 duration-300 ease-out
          ${getImageHeightClass(image.aspectRatio)}
          ${isSelected
            ? 'ring-4 ring-indigo-500 shadow-2xl'
            : 'hover:shadow-xl'
          }
        `}
      >
        {/* Image */}
        <img
          src={image.url}
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 px-8 py-6 bg-gradient-to-b from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-semibold">{image.alt}</p>
        </div>
        
        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-indigo-500/20"></div>
        )}
        
        {/* Style Tag */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 px-3 py-1 rounded-xl text-xs font-semibold text-gray-800">
            {image.style}
          </span>
        </div>
        
        {/* Selection Check */}
        {isSelected && (
          <div className="absolute top-4 right-4 bg-indigo-500 rounded-xl p-2 shadow-lg">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </ScaleIn>
  );
};

const InspirationSelection: React.FC<InspirationSelectionProps> = ({
  selectedInspiration,
  onToggleInspiration,
  onBack,
  onNext,
  title = "Choose your inspiration",
  subtitle = "Select styles that resonate with you. This will help us personalize your design ideas.",
  className = ''
}) => {
  return (
    <div className={`relative flex-1 flex flex-col px-4 pt-8 lg:px-12 ${className}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full">
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
        <div className="text-center mb-8 md:mb-12">
          <FadeInUp delay={100}>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Palette className="w-8 h-8 text-white" />
            </div>
          </FadeInUp>
          <FadeInUp delay={200}>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              {title}
            </h1>
          </FadeInUp>
          <FadeInUp delay={300}>
            <p className="text-md md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {subtitle}
            </p>
          </FadeInUp>
        </div>
      </div>

      {/* Images Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-8">
          {INSPIRATION_IMAGES.map((image: InspirationImage, index: number) => (
            <InspirationCard
              key={image.id}
              image={image}
              isSelected={selectedInspiration.includes(image.id)}
              onToggle={onToggleInspiration}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Tips */}
      <FadeInUp delay={600}>
        <div className="max-w-4xl mx-auto mt-12 mb-12 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl">
          <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
            Pro tip:
          </h4>
          <p className="text-yellow-800 leading-relaxed ml-4">
            Don't worry about choosing the "perfect" styles. Our AI will blend your selections to create something uniquely yours!
          </p>
        </div>
      </FadeInUp>
      
      {/* Fixed bottom bar with selection count and continue button */}
      {selectedInspiration.length > 0 && (
  <div className="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-xl px-6 lg:px-12 py-4 rounded-t-2xl">
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
      {/* Left Side Text */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-3 rounded-2xl border border-indigo-200/50 text-center sm:text-left">
          <span className="font-semibold">
            {selectedInspiration.length} style{selectedInspiration.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        <span className="text-gray-600 font-medium text-md sm:text-base text-center sm:text-left">
          Perfect! This will help us understand your style.
        </span>
      </div>

      {/* Button */}
      <div className="flex justify-end sm:justify-start">
        <Button
          onClick={onNext}
          variant="secondary"
          size="md"
          className="w-full sm:w-auto animate-slideInUp bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 px-8 py-3 rounded-2xl font-semibold shadow-lg"
        >
          Next: Set Budget
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default InspirationSelection;