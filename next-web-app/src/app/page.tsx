// src/app/page.tsx
'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Sparkles, Heart, Star, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Import components
import Navigation from './components/common/Navigation';
import Button from './components/common/Button';
import { FadeInUp, ScaleIn, FloatingElement } from './components/common/animations';
import { PreLaunchSection } from './components/home/prelaunch';
import { HeroSection } from './components/home/hero';
import { HowItWorksSection } from './components/home/step';
import { FullPageVideoSection } from './components/home/demo';
import { TestimonialsSection } from './components/home/testimonial';
import { CTASection } from './components/home/cta';
import { Footer } from './components/common/footer';

// Main Page Component
const HomePage: React.FC = () => {
  const router = useRouter();

  // Enhanced custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(180deg); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideInUp {
        from { 
          opacity: 0;
          transform: translateY(50px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideInLeft {
        from { 
          opacity: 0;
          transform: translateX(-100%);
        }
        to { 
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes bounceIn {
        0% { 
          opacity: 0;
          transform: scale(0.3);
        }
        50% { 
          opacity: 1;
          transform: scale(1.05);
        }
        70% { 
          transform: scale(0.9);
        }
        100% { 
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .animate-float {
        animation: float 8s ease-in-out infinite;
      }
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
      .animate-slideInUp {
        animation: slideInUp 0.6s ease-out;
      }
      .animate-slideInLeft {
        animation: slideInLeft 0.5s ease-out;
      }
      .animate-bounceIn {
        animation: bounceIn 0.8s ease-out;
      }
      .animate-shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleTryNow = () => {
    router.push('/chat');
  };

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onTryNow={handleTryNow} onScrollTo={scrollToSection} />
      <HeroSection onTryNow={handleTryNow} />
      <FullPageVideoSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PreLaunchSection/>
      <CTASection onTryNow={handleTryNow} />
      <Footer />
    </div>
  );
};

export default HomePage;