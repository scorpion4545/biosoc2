"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";


export const InfiniteMovingSponsors = ({
  direction = "left",
  speed = 80,
  pauseOnHover = true,
  mobileSpeed = 60,
}: {
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  mobileSpeed?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();
  const sponsors = [
    {
      name: "Nestle",
      image: "/sponsors/nestle.png",
      
    },
    {
      name: "HoverRobotix",
      image: "/sponsors/Hov.jpg",
      
    },
    {
      name: "Beats Energy Drinks",
      image: "/sponsors/beat.jpg",
      
    },
    {
      name: "MentorX",
      image: "/sponsors/Men.jpg",
      
    },
    {
      name: "DU Refresh News",
      image: "/sponsors/DU.jpg",
      
    },
    {
      name: "Kaploths",
      image: "/sponsors/Kap.jpg",
      
    },
    {
      name: "Jamboree",
      image: "/sponsors/jam.jpg",
      
    },
    {
      name: "Hurricane Energy",
      image: "/sponsors/Hur.jpg",
      
    },
    {
      name: "Learning While Travelling",
      image: "/sponsors/LWT.jpg",
      
    },
    {
      name: "Mr Makhana",
      image: "/sponsors/Mr.jpg",
      
    },
    {
      name: "GeeksforGeeks",
      image: "/sponsors/gfg.png",
    },
    {
      name: "Bistro 57",
      image: "/sponsors/bistro57.png",
    },
    {
      name: "Interview Buddy",
      image: "/sponsors/interview-buddy.png",
    },
    
  ];

  // Bring back duplicated array for seamless loop
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors, ...sponsors,];

  useEffect(() => {
    if (!isHovered) {
      controls.start({
        x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        transition: {
          duration: window.innerWidth < 768 ? mobileSpeed : speed,
          ease: "linear",
          repeat: Infinity,
        },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, controls, direction, speed, mobileSpeed]);

  return (
    <section className="relative m-auto w-full overflow-hidden bg-[#0b1121] py-16 md:py-24">
      {/* Background gradient accents */}
      <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
      
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-center text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Trusted Partners</p>
          <h2 className="mb-12 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-center text-3xl font-medium tracking-tight text-transparent md:text-5xl">
            Past Sponsors
          </h2>
        </motion.div>

        <motion.div
          animate={controls}
          className="flex min-w-full gap-8 md:gap-16"
          style={{ 
            width: "fit-content", 
            flexWrap: "nowrap"
          }}
        >
          {duplicatedSponsors.map((sponsor, idx) => (
            <motion.div
              key={idx}
              className="group flex h-[80px] w-[140px] items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-cyan-500/10 md:h-[120px] md:w-[220px] md:p-6"
              whileHover={{ 
                scale: 1.2,
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
              onMouseEnter={() => pauseOnHover && setIsHovered(true)}
              onMouseLeave={() => pauseOnHover && setIsHovered(false)}
            >
              <img
                src={sponsor.image}
                alt={sponsor.name}
                className="h-full w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};