import { Pause, Play } from "lucide-react";
import { useState, useRef } from "react";
import { FadeInUp } from "../common/animations";

export const FullPageVideoSection: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
  
    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    return (
      <section className="relative flex items-center justify-center overflow-hidden bg-white py-16 md:py-32">
        {/* Background Pattern */}
        {/* <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        </div> */}

        {/* Video Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
          <div 
            className="relative bg-black rounded-3xl overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <video
              ref={videoRef}
              loop
              playsInline
              className="w-full h-auto aspect-video object-cover"
            >
              <source
                src="https://res.cloudinary.com/dbv2xmoof/video/upload/v1750108542/dcgpjelafnluizlrdyaj.mp4"
                type="video/mp4"
              />
            </video>
            
            {/* Play/Pause Button Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              !isPlaying || isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={togglePlay}
                className="group relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all duration-300 hover:scale-110"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                {isPlaying ? (
                  <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" />
                ) : (
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" />
                )}
              </button>
            </div>
          </div>
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