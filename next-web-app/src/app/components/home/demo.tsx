import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FadeInUp } from "../common/animations";

export const FullPageVideoSection: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
  
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

    const skipForward = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(
          videoRef.current.currentTime + 10,
          videoRef.current.duration
        );
      }
    };

    const skipBackward = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(
          videoRef.current.currentTime - 10,
          0
        );
      }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (videoRef.current && progressRef.current && !isDragging) {
        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && videoRef.current && progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * videoRef.current.duration;
        videoRef.current.currentTime = newTime;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const updateTime = () => {
        if (!isDragging) {
          setCurrentTime(video.currentTime);
        }
        setDuration(video.duration);
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handlePlay = () => {
        setIsPlaying(true);
        setShowControls(true);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }, [isDragging]);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none';
      } else {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }, [isDragging]);
  
    return (
      <section className="relative flex items-center justify-center overflow-hidden bg-white py-16 md:py-32">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
          {/* Title Section */}
          <FadeInUp>
            <div className="text-center mb-12 md:mb-16">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto mb-6"></div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4">
                Watch Our <span className="text-indigo-600 font-medium">Demo</span>
              </h2>
            </div>
          </FadeInUp>

          {/* Video Container */}
          <FadeInUp delay={200}>
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
                  src="https://res.cloudinary.com/dgyzq5oyc/video/upload/v1750270064/rhx0g2g3rjo25sa7apzk.mp4"
                  type="video/mp4"
                />
              </video>
              
              {/* Main Play/Pause Button (shows when not playing or on hover) */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                !isPlaying || isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                {!showControls && (
                  <button
                    onClick={togglePlay}
                    className="group relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-black ml-1" />
                  </button>
                )}
              </div>

              {/* Video Controls (shows when playing) */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 ${
                showControls && (isPlaying || isHovered) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
              }`}>
                {/* Progress Bar */}
                <div className="px-6 pt-4">
                  <div 
                    ref={progressRef}
                    className="relative h-2 bg-white/30 rounded-full cursor-pointer group"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-150"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    ></div>
                    <div 
                      className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg cursor-grab transition-all duration-200 ${
                        isDragging ? 'cursor-grabbing scale-110' : 'hover:scale-110'
                      }`}
                      style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, marginLeft: '-8px' }}
                      onMouseDown={handleMouseDown}
                    ></div>
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="flex items-center justify-between px-6 py-4">
                  {/* Left side - Time */}
                  <div className="text-white text-sm font-medium">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  {/* Center - Control Buttons */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={skipBackward}
                      className="p-2 text-white hover:text-indigo-400 transition-colors duration-200"
                      title="Skip back 10 seconds"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-200 hover:scale-105"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                    
                    <button
                      onClick={skipForward}
                      className="p-2 text-white hover:text-indigo-400 transition-colors duration-200"
                      title="Skip forward 10 seconds"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Right side - Volume (placeholder for future enhancement) */}
                  <div className="w-16"></div>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-400/60 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
};