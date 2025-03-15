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
    ease: "easeInOut",
    delay: index * 0.15,
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-60 h-16">
        {/* Red dots */}
        {dots.map((_, i) => (
          <motion.div
            key={`red-${i}`}
            className="absolute w-3 h-3 rounded-full bg-rose-500"
            animate={{ x: getAnimationProps(i, true).x, y: getAnimationProps(i, true).y }}
            transition={transitionProps(i)}
          />
        ))}

        {/* Blue dots */}
        {dots.map((_, i) => (
          <motion.div
            key={`blue-${i}`}
            className="absolute w-3 h-3 rounded-full bg-cyan-400"
            animate={{ x: getAnimationProps(i, false).x, y: getAnimationProps(i, false).y }}
            transition={transitionProps(i)}
          />
        ))}
      </div>
    </div>
  );
};