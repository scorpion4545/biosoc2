import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden flex items-center justify-center">
      {/* Main Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-8xl font-extrabold mb-4 relative">
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            BIOSOC-DTU
          </span>
        </h1>
        
        <h2 className="text-3xl font-light text-gray-300 mb-8 tracking-wider font-['Space_Grotesk']">
          Official Society of Biotech DTU
        </h2>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-['Inter']">
          Bringing together the brightest minds in biotechnology to innovate, collaborate, and shape the future of biological sciences.
        </p>
      </div>

      {/* Subtle Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] opacity-10"></div>
      </div>
    </div>
  );
};

export default LandingPage;