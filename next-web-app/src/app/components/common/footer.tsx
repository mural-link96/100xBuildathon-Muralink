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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"></div>
                <span className="text-2xl font-bold">Muralink</span>
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
              <h4 className="font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">About Us</a></li>
                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Careers</a></li>
                <li><a href="#" className="hover:text-white transition hover:translate-x-1 inline-block">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Connect</h4>
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-800 rounded-2xl hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 cursor-pointer hover:scale-110 transform shadow-lg"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-2xl hover:bg-gradient-to-br hover:from-pink-500 hover:to-red-600 transition-all duration-300 cursor-pointer hover:scale-110 transform shadow-lg"></div>
                <div className="w-12 h-12 bg-gray-800 rounded-2xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-600 transition-all duration-300 cursor-pointer hover:scale-110 transform shadow-lg"></div>
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