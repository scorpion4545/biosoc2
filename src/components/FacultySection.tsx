"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

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
    image: "./team/Yasha.jpg"
  },
  {
    name: "Dr. Navneeta Bharadwaj",
    title: "Associate Professor",
    department: "Biotechnology",
    expertise: "Ph.D.",
    image: "./team/Navneeta.jpg"
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
    <div className="relative py-32 bg-transparent" id="faculty">
      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-24"
        >
          <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
            Faculty
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-32">
          {facultyMembers.map((faculty, index) => (
            <motion.div
              key={faculty.name}
              {...motionProps}
              transition={{ ...motionProps.transition, delay: 0.2 * (index + 1) }}
              className="relative group w-full max-w-[300px]"
            >
              <div className="relative flex flex-col items-center">
                <div className="w-48 h-48 md:w-56 md:h-56 p-0.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_15px] shadow-purple-500/50">
                  <div className="w-full h-full bg-black rounded-full p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-semibold text-white">{faculty.name}</h3>
                  <p className="mt-3 text-purple-300">{faculty.title}, {faculty.department}</p>
                  <p className="mt-2 text-gray-400 text-sm">{faculty.expertise}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}