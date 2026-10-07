"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useState, useEffect } from "react";
import { TiltCard3D } from "./ui/tilt-card-3d";

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

  const duplicatedSponsors = [
    ...sponsors,
    ...sponsors,
    ...sponsors,
    ...sponsors,
  ];

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
    <section className="relative m-auto w-full overflow-hidden bg-transparent py-20 md:py-28 perspective-1000">
      <div className="relative z-10 preserve-3d">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="preserve-3d"
        >
          <p className="mb-3 text-center text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400 font-mono">Trusted Partners</p>
          <h2 className="mb-16 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text py-4 text-center text-3xl font-extrabold tracking-tight text-transparent md:text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Past Sponsors
          </h2>
        </motion.div>

        <motion.div
          animate={controls}
          className="flex min-w-full gap-6 md:gap-12 preserve-3d"
          style={{ 
            width: "fit-content", 
            flexWrap: "nowrap"
          }}
        >
          {duplicatedSponsors.map((sponsor, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              onMouseEnter={() => pauseOnHover && setIsHovered(true)}
              onMouseLeave={() => pauseOnHover && setIsHovered(false)}
            >
              <TiltCard3D
                maxTilt={12}
                scale={1.1}
                glareColor="rgba(16, 185, 129, 0.3)"
                className="group flex h-[90px] w-[150px] items-center justify-center rounded-2xl border border-emerald-500/20 bg-slate-950/70 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl bio-card-glow md:h-[130px] md:w-[230px] md:p-6"
              >
                <img
                  src={sponsor.image}
                  alt={sponsor.name}
                  className="h-full w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                />
              </TiltCard3D>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};