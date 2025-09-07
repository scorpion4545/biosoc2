"use client";

import { motion } from "framer-motion";


export const InfiniteMovingSponsors = ({
  direction = "left",
  speed = 45,
  pauseOnHover = true,
  mobileSpeed = 30, // Added mobile-specific speed
}: {
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  mobileSpeed?: number;
}) => {
  const sponsors = [
    {
      name: "Nestle",
      image: "./sponsors/nestle.png",
      
    },
    {
      name: "HoverRobotix",
      image: "./sponsors/Hov.jpg",
      
    },
    {
      name: "Beats Energy Drinks",
      image: "./sponsors/beat.jpg",
      
    },
    {
      name: "MentorX",
      image: "./sponsors/Men.jpg",
      
    },
    {
      name: "DU Refresh News",
      image: "./sponsors/DU.jpg",
      
    },
    {
      name: "Kaploths",
      image: "./sponsors/Kap.jpg",
      
    },
    {
      name: "Jamboree",
      image: "./sponsors/jam.jpg",
      
    },
    {
      name: "Hurricane Energy",
      image: "./sponsors/Hur.jpg",
      
    },
    {
      name: "Learning While Travelling",
      image: "./sponsors/LWT.jpg",
      
    },
    {
      name: "Mr Makhana",
      image: "./sponsors/Mr.jpg",
      
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

  // Bring back duplicated array for seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors,];

  return (
    <div className="relative m-auto w-full overflow-hidden bg-transparent py-10">
      <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-3xl md:text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Past Sponsors
      </h2>
      <motion.div
        className="flex min-w-full gap-8 md:gap-16" // Responsive gap
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: window.innerWidth < 768 ? mobileSpeed : speed,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ 
          width: "fit-content", 
          flexWrap: "nowrap" 
        }}
        whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
      >
        {duplicatedSponsors.map((sponsor, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center w-[120px] h-[60px] md:w-[200px] md:h-[100px]" // Responsive size
          >
            <img
              src={sponsor.image}
              alt={sponsor.name}
              className="w-full h-full object-contain p-2 md:p-0" // Added padding for mobile
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};