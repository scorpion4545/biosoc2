import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import React, { useRef } from "react";

interface MotionStyle {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}

interface AboutMotionStyle {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export const ImageGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);
  const aboutOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const aboutScale = useTransform(scrollYProgress, [0.5, 0.7], [0.8, 1]);

  const motionStyle: MotionStyle = { scale, opacity };
  const aboutMotionStyle: AboutMotionStyle = { opacity: aboutOpacity, scale: aboutScale };

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div 
          style={motionStyle}
          className="grid grid-cols-3 gap-6 p-8 h-screen place-items-center"
        >
          {/* Left column */}
          <div className="grid gap-6">
            <img src="./team/dog.jpg" className="w-72 h-56 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" alt="Team 1" />
            <img src="./team/dog.jpg" className="w-56 h-72 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" alt="Team 2" />
          </div>

          {/* Center column - main image */}
          <div className="flex items-center">
            <img src="./team/cat.jpg" className="w-[500px] h-[600px] object-cover rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-300" alt="Main Team" />
          </div>

          {/* Right column */}
          <div className="grid gap-6">
            <img src="./team/WhatsApp Image 2025-01-14 at 09.53.30_936c20a2.jpg" className="w-56 h-72 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" alt="Team 4" />
            <img src="./team/WhatsApp Image 2025-02-03 at 20.05.06_1c062496.jpg" className="w-72 h-56 object-cover rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" alt="Team 5" />
          </div>
        </motion.div>

        <motion.div 
          style={aboutMotionStyle}
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95"
        >
          <motion.div className="max-w-4xl px-6 py-12 text-center">
            <h1 className="text-6xl font-bold text-cyan-500 mb-8 [text-shadow:_0_0_30px_rgb(6_182_212_/_50%)] animate-pulse">BioSoc </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Fostering a vibrant community of biology enthusiasts at IIIT Delhi. 
              We organize workshops, seminars, and hands-on projects to explore the 
              fascinating world of biological sciences and its intersection with technology.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
    