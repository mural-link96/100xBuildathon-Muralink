// src/app/components/profile/ProfileReminder.tsx
'use client';

import React from 'react';
import { User, X } from 'lucide-react';
import { useProfileReminder } from '../../hooks/useProfileReminder';

export const ProfileReminder: React.FC = () => {
  const { showReminder, handleCompleteProfile, handleDismissReminder } = useProfileReminder();

  if (!showReminder) return null;

  return (
    <div className="fixed top-16 right-8 z-[90] max-w-sm animate-slideInRight">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Complete Your Profile
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Help others know more about you by completing your profile information.
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleCompleteProfile}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
                >
                  Complete Now
                </button>
                <button
                  onClick={handleDismissReminder}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleDismissReminder}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};