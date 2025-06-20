// src/app/components/common/Navigation.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';
import { User, Settings } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setProfileModalOpen } from '../../store/slices/userSlice';
import Button from './Button';

interface NavigationProps {
  onTryNow?: () => void;
  onScrollTo?: (sectionId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onTryNow, onScrollTo }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/', // Redirect to home after sign in
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsProfileDropdownOpen(false);
      await signOut({
        callbackUrl: '/', // Redirect to home after sign out
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked, opening modal...');
    setIsProfileDropdownOpen(false);
    dispatch(setProfileModalOpen(true));
  };

  // Get display name with fallback to Google name
  const getDisplayName = () => {
    const dbName = profile?.name?.trim();
    const googleName = session?.user?.name?.trim();
    return dbName || googleName || 'User';
  };

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
      setIsMobileMenuOpen(false); // Close mobile menu on scroll
      setIsProfileDropdownOpen(false); // Close profile dropdown on scroll
    };

    const handleClickOutside = (event: MouseEvent): void => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMobileMenuClick = (action: () => void): void => {
    action();
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string): void => {
    if (onScrollTo) {
      onScrollTo(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const renderAuthButton = () => {
    if (status === 'loading') {
      return (
        <Button size="sm" variant="primary" disabled>
          Loading...
        </Button>
      );
    }

    if (session) {
      return (
        <div className="relative" ref={profileDropdownRef}>
          {/* Profile Icon Button */}
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 border-2 border-gray-100"
          >
            {profile?.profile_image || session.user?.image ? (
              <Image
                src={profile?.profile_image || session.user?.image || ''}
                alt={profile?.name || session.user?.name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[250px] z-50 py-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  {profile?.profile_image || session.user?.image ? (
                    <Image
                      src={profile?.profile_image || session.user?.image || ''}
                      alt={profile?.name || session.user?.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {getDisplayName()}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {session.user?.email || 'No email'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-2 py-1">
                <button
                  onClick={handleEditProfile}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Button size="sm" variant="primary" onClick={handleSignIn}>
        Sign up
      </Button>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center relative h-18">
            <Image
              src={isScrolled ? '/images/logos/muralink-logo.png' : '/images/logos/muralink-logo-white.png'}
              alt="Muralink Logo"
              width={80}
              height={80}
              className="h-20 w-auto transform -translate-x-1"
              priority
              quality={100}
            />
            <span className="font-relative-pro text-3xl font-bold transform -translate-x-2 mt-4 ml-[-15px]">
              <span className={`transition-all duration-300 ${
                isScrolled 
                  ? 'text-indigo-600 font-bold' 
                  : 'text-white'
              }`}>
                uralink
              </span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-indigo-600' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className={`transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-indigo-600' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Testimonial
            </button>
            {renderAuthButton()}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 group cursor-pointer"
          >
            <span className={`w-6 h-0.5 transition-all duration-300 ${
              isScrolled ? 'bg-gray-700' : 'bg-white'
            } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 transition-all duration-300 ${
              isScrolled ? 'bg-gray-700' : 'bg-white'
            } ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 transition-all duration-300 ${
              isScrolled ? 'bg-gray-700' : 'bg-white'
            } ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="absolute top-20 right-4 bg-white rounded-2xl shadow-2xl p-6 min-w-[200px] animate-slideInUp">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleMobileMenuClick(() => scrollToSection('how-it-works'))}
                className="text-left text-gray-700 hover:text-indigo-600 transition-colors py-2 font-medium"
              >
                About
              </button>
              <button
                onClick={() => handleMobileMenuClick(() => scrollToSection('testimonials'))}
                className="text-left text-gray-700 hover:text-indigo-600 transition-colors py-2 font-medium"
              >
                Testimonial
              </button>
              <div className="pt-2 border-t border-gray-200">
                {session ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 py-2">
                      {profile?.profile_image || session.user?.image ? (
                        <Image
                          src={profile?.profile_image || session.user?.image || ''}
                          alt={profile?.name || session.user?.name || 'User'}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email || 'No email'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMobileMenuClick(handleEditProfile)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                    <Button
                      onClick={() => handleMobileMenuClick(handleSignOut)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleMobileMenuClick(handleSignIn)}
                    size="sm"
                    variant="primary"
                    className="w-full"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? 'Loading...' : 'Sign up'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;