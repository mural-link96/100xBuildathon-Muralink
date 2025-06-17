import { Sparkles } from "lucide-react";
import { useState } from "react";
import { FadeInUp } from "../common/animations";
import Button from "../common/Button";
import { PreLaunchModal } from "./prelaunchmodal";


export const CTASection: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTryNow = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <section className="py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <FadeInUp>
          <div className="max-w-5xl mx-auto text-center relative">
            {/* Enhanced background with glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
            
            <div className="relative p-12 md:p-16 text-white">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12 animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>
  
              <div className="relative">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Ready to Transform Your Space?
                </h2>
                <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto">
                  Join thousands of happy customers who've created their dream homes with our magical touch
                </p>
                <Button
                  onClick={handleTryNow}
                  variant="primary"
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                 <span>Start Your Magical Journey </span>
                </Button>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* PreLaunch Modal */}
        <PreLaunchModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </section>
    );
  };