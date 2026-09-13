import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

interface MotionDivStyle {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}

interface AboutMotionStyle {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}

export const ImageGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);
  const aboutOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const aboutScale = useTransform(scrollYProgress, [0.5, 0.7], [0.8, 1]);

  const motionStyle: MotionDivStyle = { scale, opacity };
  const aboutMotionStyle: AboutMotionStyle = { opacity: aboutOpacity, scale: aboutScale };

  return (
      <div ref={containerRef} className="relative h-[300vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
              <motion.div
                  style={motionStyle}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-8 h-screen place-items-center"
              >
                  {/* Left column */}
                  <div className="grid gap-4 md:gap-6 w-full">
                      <motion.img
                          src="./team/2b.jpg"
                          className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                          alt="Test"
                      />
                      <motion.img
                          src="./team/3.jpg"
                          className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                          alt="Team 2"
                      />
                  </div>

                  {/* Center column - main image */}
                  <div className="flex items-center justify-center w-full">
                      <motion.img
                          src="./team/1a.jpg"
                          className="w-full h-64 md:h-[600px] object-cover rounded-xl shadow-xl"
                          alt="Main Team"
                      />
                  </div>

                  {/* Right column */}
                  <div className="grid gap-4 md:gap-6 w-full">
                      <motion.img
                          src="./team/3c.jpg"
                          className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                          alt="Team 4"
                      />
                      <motion.img
                          src="./team/WhatsApp Image 2025-02-03 at 20.05.06_1c062496.jpg"
                          className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                          alt="Team 5"
                      />
                  </div>
              </motion.div>

              {/* About Section with enhanced animation */}
              <motion.div
                  style={aboutMotionStyle}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-transparent px-4"
                  id="about"
              >
                  <motion.div 
                      className="max-w-4xl px-4 md:px-6 py-8 md:py-12 text-center"
                      initial={{ y: 50, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                  >
                      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-transparent mb-8 md:mb-16">
                          ABOUT US
                      </h1>
                      <p className="text-base md:text-xl text-gray-300 leading-relaxed">
                          BioSoc-DTU, is the official biotechnological society of Delhi Technological University.
                          BioSoc is not just another society but an agile collective run by a team of passionate members, dedicated to nurturing a supportive environment for researchers, students and professionals, and bridging the gap between industry and academia.
                          Leveraging its members' expertise within the various domains covered within biotechnology and natural sciences, BioSoc also aims to inform the general public about the latest and greatest in biotechnology, strongly aligning with its altruistic ideals.
                          Emphasizing the integration of biology and promoting a research-oriented outlook, BioSoc enhances students' scientific aptitude through discussions, sessions, and competitions, contributing to a dynamic learning experience.
                      </p>
                  </motion.div>
              </motion.div>
          </div>
      </div>
  );
}
