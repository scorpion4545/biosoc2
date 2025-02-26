"use client";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function LampContainer2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem]"
        >
          <div className="absolute h-full w-full bg-gradient-to-r from-violet-500 to-purple-500 blur-[100px] rotate-12 translate-x-[50%]" />
        </motion.div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function LampDemo2() {
  return (
    <LampContainer2>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
        Faculty In-Charge
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
            <img
              src="./team/faculty1.jpg"
              alt="Faculty 1"
              className="w-48 h-48 rounded-full object-cover border-2 border-white/50"
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-xl text-white font-medium">Dr. John Doe</h3>
            <p className="text-slate-300">Professor, Biotechnology</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.7,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
            <img
              src="./team/faculty2.jpg"
              alt="Faculty 2"
              className="w-48 h-48 rounded-full object-cover border-2 border-white/50"
            />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-xl text-white font-medium">Dr. Jane Smith</h3>
            <p className="text-slate-300">Associate Professor, Biotechnology</p>
          </div>
        </motion.div>
      </div>
    </LampContainer2>
  );
} 