// src/app/components/common/Navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Button from './Button';
import { PreLaunchModal } from '../home/prelaunchmodal';

interface NavigationProps {
  onTryNow?: () => void;
  onScrollTo?: (sectionId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onTryNow, onScrollTo }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTryNow = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
      setIsMobileMenuOpen(false); // Close mobile menu on scroll
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center relative h-18">
            <Image
              src={ isScrolled ? '/images/logos/muralink-logo.png' : '/images/logos/muralink-logo-white.png'}
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
            <Button size="sm" variant="primary" onClick={handleTryNow}>
              Sign up
            </Button>
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
                <Button
                  onClick={() => handleMobileMenuClick(handleTryNow || (() => {}))}
                  size="sm"
                  variant="primary"
                  className="w-full"
                >
                  Try Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PreLaunch Modal */}
        <PreLaunchModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
      />
    </>
  );
};

export default Navigation;