import { motion } from "framer-motion";
import React from "react";

interface AnimationProps {
  y: number[];
  x: number[];
  scale: number[];
}

export const DNALoader: React.FC = () => {
  const dots: undefined[] = Array.from({ length: 14 });

  const getAnimationProps = (index: number, isEmerald: boolean): AnimationProps => ({
    y: isEmerald ? [-18, 18, -18] : [18, -18, 18],
    x: [(index - 6.5) * 18, (index - 6.5) * 18, (index - 6.5) * 18],
    scale: isEmerald ? [0.8, 1.3, 0.8] : [1.3, 0.8, 1.3],
  });

  const transitionProps = (index: number) => ({
    duration: 2.2,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: index * 0.12,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#030712] relative overflow-hidden">
      {/* Background bioluminescent ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="relative w-64 h-24 flex items-center justify-center preserve-3d">
          {/* Emerald 3D Strand */}
          {dots.map((_, i) => (
            <motion.div
              key={`emerald-${i}`}
              className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400"
              style={{
                boxShadow: '0 0 12px #10b981, 0 0 24px #10b981',
              }}
              animate={{
                x: getAnimationProps(i, true).x,
                y: getAnimationProps(i, true).y,
                scale: getAnimationProps(i, true).scale,
              }}
              transition={transitionProps(i)}
            />
          ))}

          {/* Cyan 3D Strand */}
          {dots.map((_, i) => (
            <motion.div
              key={`cyan-${i}`}
              className="absolute w-3.5 h-3.5 rounded-full bg-cyan-400"
              style={{
                boxShadow: '0 0 12px #06b6d4, 0 0 24px #06b6d4',
              }}
              animate={{
                x: getAnimationProps(i, false).x,
                y: getAnimationProps(i, false).y,
                scale: getAnimationProps(i, false).scale,
              }}
              transition={transitionProps(i)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold text-white tracking-wider mb-2">
            BioSoc <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">DTU</span>
          </h2>
          <p className="text-xs text-cyan-400/80 uppercase tracking-[0.3em] font-mono">Loading...</p>
        </motion.div>
      </div>
    </div>
  );
};