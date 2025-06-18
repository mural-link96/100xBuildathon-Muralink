import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { FadeInUp, FloatingElement } from "../common/animations";
import Button from "../common/Button";
import { PreLaunchModal } from "./prelaunchmodal";

export const HeroSection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTryNow = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    // Auto-open modal after 5 seconds
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 5000);

      return () => clearTimeout(timer);
    }, []);
    
    return (
      <section className="relative md:pt-48 pt-48 px-4 md:px-6 min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=3840&h=2160&fit=crop&q=100"
            alt="Modern interior design"
            className="w-full h-full object-cover"
          />
          
          {/* Enhanced black overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"></div>
        </div>

        {/* Enhanced floating elements */}
        <FloatingElement className="absolute top-20 right-20 hidden lg:block">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-60 shadow-lg backdrop-blur-sm"></div>
        </FloatingElement>
        <FloatingElement className="absolute bottom-40 left-20 hidden lg:block">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 shadow-lg backdrop-blur-sm"></div>
        </FloatingElement>
        <FloatingElement className="absolute top-1/2 right-1/3 hidden lg:block">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-50 shadow-lg backdrop-blur-sm"></div>
        </FloatingElement>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Glass morphism container for text */}
          <div className="relative shadow-2xl">
            <FadeInUp>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                <span className="text-white drop-shadow-lg">Personalized Interior</span>
                <br />
                <span className="text-yellow-400 drop-shadow-lg">
                  Design
                </span>
              </h1>
            </FadeInUp>
            </div>
            <FadeInUp delay={400}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-0">
                <Button
                  onClick={handleTryNow}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-violet-600 hover:bg-violet-700 text-white border-2 border-violet-400 hover:border-violet-300 relative overflow-hidden group"
                  style={{
                    boxShadow: `
                      0 0 20px rgba(139, 92, 246, 0.6),
                      0 0 40px rgba(139, 92, 246, 0.4),
                      0 0 60px rgba(139, 92, 246, 0.2),
                      inset 0 0 20px rgba(255, 255, 255, 0.1)
                    `,
                    animation: 'pulse-glow 2s ease-in-out infinite alternate'
                  }}
                >
                  {/* Animated glow background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-violet-600 opacity-75 animate-pulse"></div>
                  
                  {/* Button content */}
                  <span className="relative z-10 font-semibold tracking-wide">✨ Prelaunch Sign up</span>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
                
                {/* Additional CSS for keyframes */}
                <style jsx>{`
                  @keyframes pulse-glow {
                    0% {
                      box-shadow: 
                        0 0 20px rgba(139, 92, 246, 0.6),
                        0 0 40px rgba(139, 92, 246, 0.4),
                        0 0 60px rgba(139, 92, 246, 0.2),
                        inset 0 0 20px rgba(255, 255, 255, 0.1);
                    }
                    100% {
                      box-shadow: 
                        0 0 30px rgba(139, 92, 246, 0.8),
                        0 0 60px rgba(139, 92, 246, 0.6),
                        0 0 90px rgba(139, 92, 246, 0.4),
                        inset 0 0 30px rgba(255, 255, 255, 0.2);
                    }
                  }
                `}</style>
              </div>
            </FadeInUp>
          
        </div>

        {/* PreLaunch Modal */}
        <PreLaunchModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </section>
    );
};