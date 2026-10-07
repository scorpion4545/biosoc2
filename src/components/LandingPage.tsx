import React from 'react';
import { ThreeDNAScene } from './ui/three-dna-scene';
import { BioParticleCanvas } from './ui/bio-particle-canvas';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center px-4 md:px-12 py-20 perspective-1000">
      {/* Sideways 3D WebGL Double Helix DNA Canvas aligned to the right */}
      <ThreeDNAScene offsetX={5.4} />

      {/* Bioluminescent Particle Field Canvas */}
      <BioParticleCanvas />

      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-bio-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-500/12 rounded-full blur-[140px] pointer-events-none animate-bio-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Hero Content Container - Split Layout */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Sharp Text & Description */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 text-left preserve-3d"
        >
          {/* Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tight preserve-3d leading-none">
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              BIOSOC-DTU
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-xl md:text-3xl font-light text-slate-200 mb-8 tracking-wider font-['Space_Grotesk'] text-shadow-lg">
            Official Society of Biotech DTU
          </h2>
          
          {/* Description Paragraph Container */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bio-card-glow max-w-2xl">
            <p className="text-base md:text-xl text-slate-200 leading-relaxed font-['Inter']">
              Bringing together the brightest minds in biotechnology to innovate, collaborate, and shape the future of biological sciences.
            </p>
          </div>
        </motion.div>

        {/* Right Column: Space reserved for 3D DNA model */}
        <div className="hidden lg:block lg:col-span-5 h-[460px] pointer-events-none" />
      </div>
    </div>
  );
};

export default LandingPage;