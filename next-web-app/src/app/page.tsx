// src/app/page.tsx
'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Home, Palette, ShoppingBag, Sparkles, Heart, ArrowRight, Check, Star, Sofa, Bed, ChefHat, Bath, UtensilsCrossed, MapPin, Users, Baby, TreePine, Upload, X, ArrowLeft, Send, MessageCircle, Clock, Zap, Shield, Award, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Import components
import Navigation from './components/common/Navigation';
import Button from './components/common/Button';
import { FadeInUp, ScaleIn, FloatingElement } from './components/common/animations';

// Types
interface DesignStep {
  number: string;
  title: string;
  desc: string;
  image: string;
  color: string;
}

type FormData = {
  name: string;
  email: string;
};

// Data
const DESIGN_STEPS: DesignStep[] = [
  {
    number: "01",
    title: "Knowing you better",
    desc: "We decode your design DNA because design is personal to everyone",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    color: "bg-blue-500"
  },
  {
    number: "02",
    title: "Instant Personalized designs",
    desc: "Receive 3D room design images with real products chosen just for you",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop",
    color: "bg-orange-500"
  },
  {
    number: "03",
    title: "Shop & Transform",
    desc: "Purchase curated items and watch your space come to life",
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop",
    color: "bg-purple-500"
  }
];

// Components
interface StepProps {
  step: DesignStep;
}

const StepImage: React.FC<StepProps> = ({ step }) => (
  <div className="w-full sm:w-1/2 lg:w-2/5">
    <div className="relative group">
      <img
        src={step.image}
        alt={step.title}
        className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-xl shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  </div>
);

const StepContent: React.FC<StepProps> = ({ step }) => (
  <div className="w-full sm:w-1/2 lg:w-3/5 text-center sm:text-left">
    <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 ${step.color} rounded-full text-white font-bold text-xl hover:scale-110 transition-transform duration-300`}>
      {step.number}
    </div>
    <h3 className="text-xl md:text-2xl font-bold mb-4 text-teal-900">{step.title}</h3>
    <p className="text-teal-700 text-base md:text-lg leading-relaxed">{step.desc}</p>
  </div>
);

const HeroSection: React.FC<{ onTryNow: () => void }> = ({ onTryNow }) => {
  return (
    <section className="relative md:pt-48 pt-48 px-4 md:px-6 min-h-screen flex items-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=3840&h=2160&fit=crop&q=100"
          alt="Modern interior design"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 to-white/70"></div>

        {/* Floating elements */}
        <FloatingElement className="absolute top-20 right-20 hidden lg:block">
          <div className="w-20 h-20 bg-indigo-200 rounded-full opacity-60"></div>
        </FloatingElement>
        <FloatingElement className="absolute bottom-40 left-20 hidden lg:block">
          <div className="w-16 h-16 bg-yellow-200 rounded-full opacity-60"></div>
        </FloatingElement>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <FadeInUp>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Personalized Interior
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Design
            </span>
          </h1>
        </FadeInUp>

        <FadeInUp delay={200}>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Transform your space with AI-powered designs tailored just for you.
            <span className="font-semibold"> Because you deserve the best.</span>
          </p>
        </FadeInUp>

        <FadeInUp delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              onClick={onTryNow}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Try Now
            </Button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-6 bg-teal-50 rounded-3xl mx-4 md:mx-6">
      <div className="max-w-7xl mx-auto">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-teal-900">How It Works</h2>
        </FadeInUp>
        <div className="space-y-12 md:space-y-16">
          {DESIGN_STEPS.map((step: DesignStep, index: number) => (
            <FadeInUp key={index} delay={index * 200}>
              <div className="bg-white rounded-2xl p-6 md:p-8 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className={`flex flex-col gap-6 sm:gap-8 lg:gap-12 items-center ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  <StepImage step={step} />
                  <StepContent step={step} />
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonialStyles = [
    { bg: 'bg-purple-100', color: 'bg-purple-500' },
    { bg: 'bg-teal-100', color: 'bg-teal-500' },
    { bg: 'bg-orange-100', color: 'bg-orange-500' }
  ];

  return (
    <section id="testimonials" className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <FadeInUp>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-indigo-600">Love From Our Community</h2>
        </FadeInUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonialStyles.map((style, i: number) => (
            <FadeInUp key={i} delay={i * 200}>
              <div className={`${style.bg} rounded-3xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group`}>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, starIndex: number) => (
                    <Star key={starIndex} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${starIndex * 50}ms` }} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm md:text-base">
                  "Working with Muralink was an absolute dream! They transformed my space into something magical."
                </p>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${style.color} rounded-full group-hover:scale-110 transition-transform duration-300`}></div>
                  <div>
                    <p className="font-semibold text-sm md:text-base">Happy Customer</p>
                    <p className="text-xs md:text-sm text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

const PreLaunchSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '' });
    }, 3000);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Be the first to be notified when we launch
        </h2>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-indigo-600 text-center">
              Pre-Launch Interest Form
            </h3>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>

                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full"
                >
                  Notify Me at Launch
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Thank you!</h4>
                <p className="text-gray-600">We'll notify you as soon as we launch.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC<{ onTryNow: () => void }> = ({ onTryNow }) => {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <FadeInUp>
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of happy customers who've created their dream homes with us
            </p>
            <Button
              onClick={onTryNow}
              variant="primary"
              size="lg"
              className="hover:scale-110"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12 px-4 md:px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
            <span className="text-xl font-bold">Muralink</span>
          </div>
          <p className="text-gray-400 text-sm md:text-base">Making interior design delightfully simple.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-gray-400 text-sm md:text-base">
            <li><a href="#" className="hover:text-white transition">Full Room Design</a></li>
            <li><a href="#" className="hover:text-white transition">Color Consultation</a></li>
            <li><a href="#" className="hover:text-white transition">Furniture Curation</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400 text-sm md:text-base">
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-gray-800 rounded-full hover:bg-gray-700 transition cursor-pointer hover:scale-110 transform duration-200"></div>
            <div className="w-10 h-10 bg-gray-800 rounded-full hover:bg-gray-700 transition cursor-pointer hover:scale-110 transform duration-200"></div>
            <div className="w-10 h-10 bg-gray-800 rounded-full hover:bg-gray-700 transition cursor-pointer hover:scale-110 transform duration-200"></div>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-8 pt-8 border-t border-gray-800 text-sm md:text-base">
        <p>&copy; 2025 Muralink. All rights reserved. Made with <Heart className="w-4 h-4 inline text-red-500 animate-pulse" /> </p>
      </div>
    </footer>
  );
};

// Main Page Component
const HomePage: React.FC = () => {
  const router = useRouter();

  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideInUp {
        from { 
          opacity: 0;
          transform: translateY(30px);
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
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
      }
      .animate-slideInUp {
        animation: slideInUp 0.4s ease-out;
      }
      .animate-slideInLeft {
        animation: slideInLeft 0.3s ease-out;
      }
      .animate-bounceIn {
        animation: bounceIn 0.6s ease-out;
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

      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-indigo-600 mb-6">
                Homes so good your guests would wanna stay over
              </h2>
            </div>

            {/* Right side - Demo Video */}
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Demo Video
              </h3>
              <div className="bg-white rounded-3xl p-4 shadow-xl">
                <video
                  controls
                  poster="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=450&fit=crop"
                  className="w-full h-80 object-cover rounded-2xl"
                >
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorksSection />
      <TestimonialsSection />
      <PreLaunchSection />
      <CTASection onTryNow={handleTryNow} />
      <Footer />
    </div>
  );
};

export default HomePage;