import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { FadeInUp } from "../common/animations";

export const FullPageVideoSection: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
  
    const togglePlay = () => {
      setIsPlaying(!isPlaying);
    };
  
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
  
        {/* Content Overlay */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <FadeInUp>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              See the
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Magic </span>
              in Action
            </h2>
          </FadeInUp>
          
          <FadeInUp delay={200}>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Watch how we transform ordinary spaces into extraordinary experiences
            </p>
          </FadeInUp>
  
          <FadeInUp delay={400}>
            <button
              onClick={togglePlay}
              className="group relative inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              {isPlaying ? (
                <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
              ) : (
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
              )}
            </button>
          </FadeInUp>
        </div>
  
        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  };