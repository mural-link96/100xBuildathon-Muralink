// src/app/components/chat/flow/BudgetSelection.tsx
'use client';

import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Edit3 } from 'lucide-react';
import Button from '../../common/Button';
import { FadeInUp, ScaleIn } from '../../common/animations';

interface BudgetSelectionProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
  onBack: () => void;
  onNext: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
  minBudget?: number;
  maxBudget?: number;
}

const BudgetSelection: React.FC<BudgetSelectionProps> = ({
  budget,
  onBudgetChange,
  onBack,
  onNext,
  title = "What's your budget?",
  subtitle = "This helps us recommend designs and products within your price range",
  className = '',
  minBudget = 300,
  maxBudget = 10000
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customBudget, setCustomBudget] = useState(budget.toString());

  const formatBudget = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onBudgetChange(value);
    setShowCustomInput(false);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBudget(e.target.value);
  };

  const handleCustomInputSubmit = () => {
    const value = parseInt(customBudget.replace(/[^0-9]/g, ''));
    if (value && value >= minBudget) {
      onBudgetChange(value);
      setShowCustomInput(false);
    }
  };

  const handleCustomInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomInputSubmit();
    }
  };

  const getSliderBackground = () => {
    const percentage = ((budget - minBudget) / (maxBudget - minBudget)) * 100;
    return `linear-gradient(to right, #6ee7b7 0%, #4f46e5 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  };

  const budgetRanges = [
    { label: 'Budget-friendly', range: `$${minBudget} - $1,000`, min: minBudget, max: 1000 },
    { label: 'Mid-range', range: '$1,000 - $5,000', min: 1000, max: 5000 },
    { label: 'Premium', range: '$5,000 - $10,000', min: 5000, max: maxBudget },
    { label: 'Luxury', range: '$10,000+', min: maxBudget, max: maxBudget * 2 },
  ];

  const getCurrentRange = () => {
    for (const range of budgetRanges) {
      if (budget >= range.min && budget <= range.max) {
        return range;
      }
    }
    return budgetRanges[budgetRanges.length - 1]; // Default to luxury for high budgets
  };

  return (
    <div className={`flex-1 flex items-center justify-center p-8 lg:p-12 ${className}`}>
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </FadeInUp>
            <FadeInUp delay={200}>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 bg-clip-text text-transparent">
                {title}
              </h1>
            </FadeInUp>
            <FadeInUp delay={300}>
              <p className="text-md md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>
            </FadeInUp>
          </div>

          <ScaleIn delay={200}>
            <div className="mb-12">
              {/* Budget Display */}
              <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-3xl p-8 mb-8 relative group hover:border-indigo-300 transition-all duration-300 shadow-xl">
                <div className="text-gray-900 text-5xl font-bold mb-3">
                  {formatBudget(budget)}
                </div>
                <div className="text-gray-600 text-base mb-3">
                  Your design budget
                </div>
                <div className="text-indigo-600 text-sm font-semibold">
                  {getCurrentRange().label} • {getCurrentRange().range}
                </div>
                
                {/* Custom Budget Button */}
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="absolute top-6 right-6 p-3 text-gray-400 hover:text-indigo-600 transition-all duration-300 hover:bg-indigo-50 rounded-2xl"
                  title="Set custom budget"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              </div>

              {/* Custom Budget Input */}
              {showCustomInput && (
                <FadeInUp>
                  <div className="mb-6 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                    <h3 className="text-sm font-medium text-indigo-900 mb-3">
                      Enter custom budget
                    </h3>
                    <div className="flex space-x-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="text"
                          value={customBudget}
                          onChange={handleCustomInputChange}
                          onKeyPress={handleCustomInputKeyPress}
                          placeholder="Enter amount"
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <Button
                        onClick={handleCustomInputSubmit}
                        variant="secondary"
                        size="sm"
                        className="px-4"
                      >
                        Set
                      </Button>
                    </div>
                    <p className="text-xs text-indigo-700 mt-2">
                      Minimum budget: {formatBudget(minBudget)}
                    </p>
                  </div>
                </FadeInUp>
              )}

              {/* Slider */}
              {!showCustomInput && (
                <div className="relative">
                  <input
                    type="range"
                    min={minBudget}
                    max={maxBudget}
                    step="1"
                    value={Math.min(budget, maxBudget)}
                    onChange={handleSliderChange}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: getSliderBackground()
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{formatBudget(minBudget)}</span>
                    <span>{formatBudget(maxBudget)}+</span>
                  </div>
                </div>
              )}
            </div>
          </ScaleIn>

          <FadeInUp delay={500}>
            <Button
              onClick={onNext}
              variant="primary"
              size="lg"
              className="w-full px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-semibold text-lg shadow-xl"
            >
              Continue to Design Consultation
            </Button>
          </FadeInUp>
        </div>

        {/* Info Section */}
        <FadeInUp delay={600}>
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-2xl">
            <h4 className="font-bold text-green-900 mb-4 flex items-center">
              Budget includes:
            </h4>
            <ul className="text-sm text-green-800 space-y-2 ml-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Furniture and decor items
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Design consultation and 3D renders
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Product sourcing and recommendations
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Optional installation coordination
              </li>
            </ul>
          </div>
        </FadeInUp>
      </div>
      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4f46e5;
          border: 3px solid white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4f46e5;
          border: 3px solid white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          border: none;
        }
        
        .slider::-moz-range-track {
          height: 12px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default BudgetSelection;