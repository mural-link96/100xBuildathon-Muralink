// src/app/components/common/animations/index.tsx
import React, { useState, useEffect, ReactNode } from 'react';

interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
}

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const ScaleIn: React.FC<ScaleInProps> = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const FloatingElement: React.FC<FloatingElementProps> = ({ children, className = '' }) => {
  return (
    <div className={`animate-float ${className}`}>
      {children}
    </div>
  );
};

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0';
    
    switch (direction) {
      case 'left': return '-translate-x-8 translate-y-0';
      case 'right': return 'translate-x-8 translate-y-0';
      case 'up': return 'translate-x-0 -translate-y-8';
      case 'down': return 'translate-x-0 translate-y-8';
      default: return 'translate-x-0 translate-y-8';
    }
  };

  return (
    <div
      className={`transition-all duration-600 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};