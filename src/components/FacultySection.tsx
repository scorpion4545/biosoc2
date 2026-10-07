"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TiltCard3D } from "./ui/tilt-card-3d";

interface FacultyMember {
  name: string;
  title: string;
  department: string;
  expertise: string;
  image: string;
}

const facultyMembers: FacultyMember[] = [
  {
    name: "Prof. Yasha Hasija",
    title: "Head of Department",
    department: "Biotechnology",
    expertise: "Biotechnology, Bioinformatics",
    image: "/team/Yasha.jpg"
  },
  {
    name: "Dr. Navneeta Bharadvaja",
    title: "Faculty Advisor, BioSoc-DTU",
    department: "Biotechnology",
    expertise: "Plant Biotech",
    image: "/team/Navneeta.jpg"
  }
];

export function FacultySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const motionProps: HTMLMotionProps<"div"> = {
    initial: { opacity: 0, y: 30 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="relative py-32 bg-transparent perspective-1000" id="faculty">
      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h2 className="mt-8 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 py-4 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl mb-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Faculty
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 preserve-3d">
          {facultyMembers.map((faculty, index) => (
            <motion.div
              key={faculty.name}
              {...motionProps}
              transition={{ ...motionProps.transition, delay: 0.2 * (index + 1) }}
              className="w-full max-w-[340px]"
            >
              <TiltCard3D
                maxTilt={15}
                scale={1.05}
                glareColor="rgba(6, 182, 212, 0.4)"
                className="group p-8 rounded-3xl border border-emerald-500/30 bg-slate-950/70 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] bio-card-glow"
              >
                <div className="relative flex flex-col items-center preserve-3d">
                  {/* 3D Glowing Avatar Ring */}
                  <div className="relative w-48 h-48 md:w-56 md:h-56 p-1 rounded-full bg-gradient-to-tr from-emerald-400 via-cyan-400 to-indigo-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all duration-500 group-hover:translate-z-20">
                    <div className="w-full h-full bg-slate-950 rounded-full p-1">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={faculty.image}
                          alt={faculty.name}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-center preserve-3d">
                    <h3 className="text-2xl font-extrabold text-white group-hover:translate-z-10 group-hover:text-cyan-300 transition-colors">{faculty.name}</h3>
                    <p className="mt-3 text-cyan-300/90 font-medium text-base">{faculty.title}, {faculty.department}</p>
                    <p className="mt-2 text-slate-400 text-sm font-mono">{faculty.expertise}</p>
                  </div>
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}