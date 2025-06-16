import { Sparkles } from "lucide-react";
import { FadeInUp, FloatingElement } from "../common/animations";
import Button from "../common/Button";

export const HeroSection: React.FC<{ onTryNow: () => void }> = ({ onTryNow }) => {
    return (
      <section className="relative md:pt-48 pt-48 px-4 md:px-6 min-h-screen flex items-center overflow-hidden">
        {/* Enhanced background with less opacity */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=3840&h=2160&fit=crop&q=100"
            alt="Modern interior design"
            className="w-full h-full object-cover"
          />
          {/* Reduced opacity for less fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/45 to-white/25"></div>
  
          {/* Enhanced floating elements */}
          <FloatingElement className="absolute top-20 right-20 hidden lg:block">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-70 shadow-lg"></div>
          </FloatingElement>
          <FloatingElement className="absolute bottom-40 left-20 hidden lg:block">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-70 shadow-lg"></div>
          </FloatingElement>
          <FloatingElement className="absolute top-1/2 right-1/3 hidden lg:block">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-60 shadow-lg"></div>
          </FloatingElement>
        </div>
  
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <FadeInUp>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight">
              Personalized Interior
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Design Magic
              </span>
            </h1>
          </FadeInUp>
  
          <FadeInUp delay={200}>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your space with AI-powered designs tailored just for you.
              <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Because you deserve the extraordinary.</span>
            </p>
          </FadeInUp>
  
          <FadeInUp delay={400}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                onClick={onTryNow}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <span> <Sparkles className="w-5 h-5 mr-2" /> Start Your Transformation</span> 
              </Button>
            </div>
          </FadeInUp>
        </div>
      </section>
    );
  };