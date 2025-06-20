// src/app/components/profile/ProfileModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, User, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  setProfileModalOpen, 
  updateUserProfile, 
  uploadProfileImage,
  fetchUserProfile,
  clearError 
} from '../../store/slices/userSlice';

const JOINING_OPTIONS = [
  'Home Owner',
  'Architect', 
  'Interior Designer',
  'Builders',
  'Contractor/Supplier',
  'Furniture Maker',
  'Business Professionals',
  'Digital Creator'
];

interface ProfileModalProps {
  isOpen?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen: externalIsOpen }) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { profile, isProfileModalOpen, isLoading, error } = useAppSelector((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : isProfileModalOpen;

  // Debug logging
  console.log('ProfileModal - isOpen:', isOpen);
  console.log('ProfileModal - isProfileModalOpen:', isProfileModalOpen);
  console.log('ProfileModal - profile:', profile);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    interested_in: [] as string[],
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Get display name with fallback to Google name
  const getDefaultName = () => {
    const dbName = profile?.name?.trim();
    const googleName = session?.user?.name?.trim();
    return dbName || googleName || '';
  };

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, loading profile data');
      const defaultName = getDefaultName();
      console.log('Default name:', defaultName);
      
      setFormData({
        name: defaultName,
        bio: profile?.bio || '',
        phone: profile?.phone || '',
        interested_in: profile?.interested_in || [],
      });
      setImagePreview(profile?.profile_image || session?.user?.image || '');
    }
  }, [isOpen, profile, session]);

  // Fetch profile when modal opens if not available
  useEffect(() => {
    if (isOpen && !profile && !isLoading) {
      console.log('Modal opened but no profile, fetching...');
      dispatch(fetchUserProfile());
    }
  }, [isOpen, profile, isLoading, dispatch]);

  const handleClose = () => {
    if (externalIsOpen === undefined) {
      dispatch(setProfileModalOpen(false));
    }
    dispatch(clearError());
    setFormErrors({});
    setSelectedImage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interested_in: prev.interested_in.includes(interest)
        ? prev.interested_in.filter(item => item !== interest)
        : [...prev.interested_in, interest]
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Upload image first if selected
      if (selectedImage) {
        await dispatch(uploadProfileImage(selectedImage)).unwrap();
      }
      
      // Update profile
      await dispatch(updateUserProfile(formData)).unwrap();
      
      // Refresh profile data
      await dispatch(fetchUserProfile()).unwrap();
      
      // Close modal on success
      handleClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Profile Image */}
          {/* <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-sm text-gray-500">Upload profile picture</p>
          </div> */}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                formErrors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Joining Muralink For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Joining Muralink For?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {JOINING_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleInterestToggle(option)}
                  className={`relative p-3 border-2 rounded-lg text-left text-sm font-medium transition-all ${
                    formData.interested_in.includes(option)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {option}
                  {formData.interested_in.includes(option) && (
                    <Check className="absolute top-2 right-2 w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};