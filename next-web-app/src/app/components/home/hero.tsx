import { Sparkles } from "lucide-react";
import { useState } from "react";
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
    return (
      <section className="relative md:pt-48 pt-48 px-4 md:px-6 min-h-screen flex items-center overflow-hidden">
        {/* Background image without full overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=3840&h=2160&fit=crop&q=100"
            alt="Modern interior design"
            className="w-full h-full object-cover"
          />
          
          {/* Subtle vignette effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
          
          {/* Localized brush-style overlays near text area */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Main text backdrop - organic brush shape */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[70%] max-w-5xl">
              <div className="relative w-full h-full">
                {/* Primary brush stroke backdrop */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/75 to-white/60 backdrop-blur-sm"
                  style={{
                    clipPath: "polygon(15% 25%, 85% 20%, 90% 80%, 10% 85%)",
                    filter: "blur(1px)"
                  }}
                ></div>
                
                {/* Secondary accent brush */}
                <div 
                  className="absolute -top-8 -right-8 w-64 h-32 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 backdrop-blur-sm"
                  style={{
                    clipPath: "polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%)",
                    transform: "rotate(-15deg)"
                  }}
                ></div>
                
                {/* Tertiary accent brush */}
                <div 
                  className="absolute -bottom-6 -left-6 w-48 h-16 md:h-24 bg-gradient-to-r from-pink-500/25 to-orange-500/25 backdrop-blur-sm"
                  style={{
                    clipPath: "polygon(0% 20%, 80% 0%, 100% 80%, 20% 100%)",
                    transform: "rotate(12deg)"
                  }}
                ></div>
              </div>
            </div>
            
            {/* Floating ink blots for artistic effect */}
            <div className="absolute top-32 right-32 w-24 h-24 bg-indigo-600/20 rounded-full filter blur-md hidden lg:block"></div>
            <div className="absolute bottom-48 left-24 w-32 h-16 bg-purple-600/15 rounded-full filter blur-lg hidden lg:block" style={{transform: "rotate(-25deg)"}}></div>
          </div>

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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight drop-shadow-lg">
              <span className="text-gray-900 drop-shadow-sm">Personalized Interior</span>
              <br />
              <span className="text-indigo-600 drop-shadow-lg">
                Design
              </span>
            </h1>
          </FadeInUp>

          <FadeInUp delay={400}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                onClick={handleTryNow}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl backdrop-blur-sm"
              >
                <span> Prelaunch Sign up</span> 
              </Button>
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