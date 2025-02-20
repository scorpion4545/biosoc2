import { motion } from "framer-motion";

export const DNALoader = () => {
  const dots = Array.from({ length: 12 });

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-60 h-16">
        {/* Red dots */}
        {dots.map((_, i) => (
          <motion.div
            key={`red-${i}`}
            className="absolute w-3 h-3 rounded-full bg-rose-500"
            animate={{
              y: [0, 20, 0],
              x: [i * 20, (i * 20), i * 20],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}

        {/* Blue dots */}
        {dots.map((_, i) => (
          <motion.div
            key={`blue-${i}`}
            className="absolute w-3 h-3 rounded-full bg-cyan-400"
            animate={{
              y: [20, 0, 20],
              x: [i * 20, (i * 20), i * 20],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}; 