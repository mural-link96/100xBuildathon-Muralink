import { FadeInUp } from "../common/animations";

export const FullPageVideoSection: React.FC = () => {
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

          {/* Vimeo Video Container */}
          <FadeInUp delay={200}>
            <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl">
              <div style={{padding: '56.25% 0 0 0', position: 'relative'}}>
                <iframe 
                  src="https://player.vimeo.com/video/1094480728?badge=0&autopause=0&player_id=0&app_id=58479" 
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" 
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} 
                  title="Muralink AI Demo"
                ></iframe>
              </div>
              <script src="https://player.vimeo.com/api/player.js"></script>
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