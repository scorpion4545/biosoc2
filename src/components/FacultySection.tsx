"use client";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function FacultySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  return (
    <div className="relative py-32 bg-transparent">
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

        <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative group"
          >
            <div className="relative">
              <div className="p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="bg-black rounded-full p-1">
                  <img
                    src="./team/dog.jpg"
                    alt="Faculty 1"
                    className="w-64 h-64 md:w-72 md:h-72 rounded-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-semibold text-white">Dr. John Doe</h3>
                <p className="mt-3 text-purple-300">Professor, Biotechnology</p>
                <p className="mt-2 text-gray-400 text-sm">Ph.D. in Molecular Biology</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative group"
          >
            <div className="relative">
              <div className="p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="bg-black rounded-full p-1">
                  <img
                    src="./team/cat.jpg"
                    alt="Faculty 2"
                    className="w-64 h-64 md:w-72 md:h-72 rounded-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-8 text-center">
                <h3 className="text-2xl font-semibold text-white">Dr. Jane Smith</h3>
                <p className="mt-3 text-purple-300">Associate Professor, Biotechnology</p>
                <p className="mt-2 text-gray-400 text-sm">Ph.D. in Biochemistry</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 