import { motion } from "framer-motion";
import React from "react";

interface AnimationProps {
  y: number[];
  x: number[];
}

export const DNALoader: React.FC = () => {
  const dots: undefined[] = Array.from({ length: 12 });

  const getAnimationProps = (index: number, isRed: boolean): AnimationProps => ({
    y: isRed ? [0, 20, 0] : [20, 0, 20],
    x: [index * 20, index * 20, index * 20],
  });

  const transitionProps = (index: number) => ({
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: index * 0.15,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b1121]">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-60 h-16">
          {/* Red dots */}
          {dots.map((_, i) => (
            <motion.div
              key={`red-${i}`}
              className="absolute w-3 h-3 rounded-full bg-rose-500"
              style={{ filter: 'drop-shadow(0 0 4px rgba(244, 63, 94, 0.5))' }}
              animate={{ x: getAnimationProps(i, true).x, y: getAnimationProps(i, true).y }}
              transition={transitionProps(i)}
            />
          ))}

          {/* Blue dots */}
          {dots.map((_, i) => (
            <motion.div
              key={`blue-${i}`}
              className="absolute w-3 h-3 rounded-full bg-cyan-400"
              style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.5))' }}
              animate={{ x: getAnimationProps(i, false).x, y: getAnimationProps(i, false).y }}
              transition={transitionProps(i)}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            BioSoc <span className="text-cyan-400">DTU</span>
          </h2>
          <p className="text-sm text-slate-400 uppercase tracking-[0.2em]">Loading...</p>
        </motion.div>
      </div>
    </div>
  );
};