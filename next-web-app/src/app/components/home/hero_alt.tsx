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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=3840&h=2160&fit=crop&q=100"
            alt="Modern interior design"
            className="w-full h-full object-cover"
          />
          {/* Sophisticated overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Geometric accent elements */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {/* Top left accent */}
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
          
          {/* Bottom right accent */}
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-purple-500/10 to-transparent"></div>
          
          {/* Central light beam effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 via-transparent to-transparent"></div>
        </div>

        {/* Floating decorative elements */}
        <FloatingElement className="absolute top-20 right-20 hidden lg:block z-[2]">
          <div className="w-3 h-3 bg-white/60 rounded-full shadow-lg"></div>
        </FloatingElement>
        <FloatingElement className="absolute top-1/3 right-1/4 hidden lg:block z-[2]">
          <div className="w-2 h-2 bg-indigo-400/80 rounded-full shadow-lg"></div>
        </FloatingElement>
        <FloatingElement className="absolute bottom-1/3 left-1/4 hidden lg:block z-[2]">
          <div className="w-4 h-4 bg-purple-400/60 rounded-full shadow-lg"></div>
        </FloatingElement>
        <FloatingElement className="absolute bottom-20 right-32 hidden lg:block z-[2]">
          <div className="w-1 h-1 bg-white/80 rounded-full shadow-lg"></div>
        </FloatingElement>

        {/* Main content container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 text-center">
          {/* Content backdrop */}
          <div className="relative">
            {/* Subtle backdrop for text */}
            <div className="absolute inset-0 transform -rotate-1 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10"></div>
            <div className="absolute inset-0 transform rotate-1 bg-white/3 backdrop-blur-sm rounded-3xl"></div>
            
            {/* Main content */}
            <div className="relative p-8 md:p-16">
              <FadeInUp>
                <div className="mb-8">
                  {/* Decorative line above title */}
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent mx-auto mb-8"></div>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-light mb-4 leading-[0.9] tracking-tight">
                    <span className="block text-white font-extralight">Personalized</span>
                    <span className="block text-white font-extralight">Interior</span>
                    <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-light">
                      Design
                    </span>
                  </h1>
                  
                  {/* Decorative line below title */}
                  <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mt-8"></div>
                </div>
              </FadeInUp>

              <FadeInUp delay={400}>
                <div className="pt-8">
                  <Button
                    onClick={handleTryNow}
                    variant="primary"
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-12 py-4 rounded-full border border-white/20 shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 hover:scale-105 backdrop-blur-sm"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      Prelaunch Sign up
                    </span>
                  </Button>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>

        {/* Ambient light effects */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          {/* Soft ambient lights */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/3 rounded-full filter blur-3xl"></div>
        </div>

        {/* PreLaunch Modal */}
        <PreLaunchModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </section>
    );
};