import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

interface MotionDivStyle {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
}

export const ImageGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0]);

  const motionStyle: MotionDivStyle = { scale, opacity };

  return (
    <>
      <div ref={containerRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={motionStyle}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-8 h-screen place-items-center"
          >
            {/* Left column */}
            <div className="grid gap-4 md:gap-6 w-full">
              <motion.img
                src="/team/2b.jpg"
                className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                alt="Test"
              />
              <motion.img
                src="/team/3.jpg"
                className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                alt="Team 2"
              />
            </div>

            {/* Center column - main image */}
            <div className="flex items-center justify-center w-full">
              <motion.img
                src="/team/1a.jpg"
                className="w-full h-64 md:h-[600px] object-cover rounded-xl shadow-xl"
                alt="Main Team"
              />
            </div>

            {/* Right column */}
            <div className="grid gap-4 md:gap-6 w-full">
              <motion.img
                src="/team/3c.jpg"
                className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                alt="Team 4"
              />
              <motion.img
                src="/team/WhatsApp Image 2025-02-03 at 20.05.06_1c062496.jpg"
                className="w-full h-48 md:h-72 object-cover rounded-xl shadow-lg"
                alt="Team 5"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* About Section - Now separate from the image gallery */}
      <section className="relative bg-[#0b1121] px-4 py-20 md:py-32" id="about">
        <motion.div 
          className="mx-auto max-w-4xl text-center"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mb-8 bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text py-4 text-4xl font-bold text-transparent md:mb-16 md:text-6xl">
            ABOUT US
          </h1>
          <p className="text-base leading-relaxed text-gray-300 md:text-xl md:leading-loose">
            BioSoc-DTU is the official society of the Department of Biotechnology at Delhi Technological University. 
            As an agile collective driven by passionate members, we foster a supportive environment for researchers, students, and professionals while bridging the gap between industry and academia. 
            Leveraging our members' expertise across various domains of biotechnology and natural sciences, BioSoc-DTU endeavors to inform the broader community about cutting-edge developments in biotechnology, aligning with our mission of knowledge dissemination and social impact. 
            By emphasizing the integration of biological sciences and promoting a research-oriented outlook, BioSoc-DTU enhances students' scientific aptitude through discussions, workshops, and competitions, thereby contributing to a dynamic and enriching learning experience.
          </p>
        </motion.div>
      </section>
    </>
  );
}
