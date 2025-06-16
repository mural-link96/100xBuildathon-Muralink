import Image from 'next/image';
import { Mail, MapPin, Linkedin, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16 px-4 md:px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full translate-x-32 -translate-y-32"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <Image
                src='/images/logos/muralink-logo-white.png'
                alt="Muralink Logo"
                width={80}
                height={80}
                className="h-20 w-auto"
                priority
                quality={100}
              />
              <span className="font-relative-pro text-3xl font-bold ml-[-15] ">uralink</span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">Making interior design delightfully simple and magically beautiful.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-lg">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Full Room Design</a></li>
              <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Color Consultation</a></li>
              <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Furniture Curation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-lg">Contact Us</h4>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <a href="mailto:info@muralinkai.com" className="hover:text-white transition">
                  info@muralinkai.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-0.5" />
                <div>
                  <div className="hover:text-white transition cursor-pointer">Los Angeles, USA</div>
                  <div className="hover:text-white transition cursor-pointer mt-1">Kolkata, India</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-lg">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/mura-link/posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 rounded-2xl hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 transform shadow-lg flex items-center justify-center"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/muralinkdesigns" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 rounded-2xl hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 transition-all duration-300 hover:scale-110 transform shadow-lg flex items-center justify-center"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-400 mt-12 pt-8 border-t border-gray-800">
          <p className="text-lg">&copy; 2025 Muralink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};