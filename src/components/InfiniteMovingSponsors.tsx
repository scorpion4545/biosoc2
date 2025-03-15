"use client";

import { motion } from "framer-motion";


export const InfiniteMovingSponsors = ({
  direction = "left",
  speed = 5,
  pauseOnHover = true,
}: {
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
}) => {
  const sponsors = [
    {
      name: "Nestle",
      image: "./sponsors/nestle.png",
      
    },
    {
      name: "GeeksforGeeks",
      image: "./sponsors/gfg.png",
    },
    {
      name: "Bistro 57",
      image: "./sponsors/bistro57.png",
    },
    {
      name: "Interview Buddy",
      image: "./sponsors/interview-buddy.png",
    },
    
  ];

  // Duplicate sponsors to create seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="relative m-auto w-full overflow-hidden bg-transparent py-10">
      <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Past Sponsors
      </h2>
      <motion.div
        className="flex min-w-full gap-8"
        animate={{
          x: direction === "left" ? ["0%", "-70%"] : ["-70%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
      >
        {duplicatedSponsors.map((sponsor, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center w-[200px] h-[100px]"
          >
            <img
              src={sponsor.image}
              alt={sponsor.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}; 