import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef } from "react";

export function ImageGallery() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.5]);
    const opacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);
    const aboutOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
    const aboutScale = useTransform(scrollYProgress, [0.5, 0.7], [0.8, 1]);

    const imageVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { 
            scale: 1, 
            opacity: 1,
            transition: { duration: 0.5 }
        },
        hover: { 
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.4)",
            transition: { duration: 0.2 }
        }
    };

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div
                    style={{ scale, opacity }}
                    className="grid grid-cols-3 gap-8 p-12 h-screen place-items-center"
                >
                    {/* Left column */}
                    <div className="grid gap-8 h-full">
                        <motion.img
                            variants={imageVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                            src="./team/2b.jpg"
                            className="w-96 h-72 object-cover rounded-xl shadow-lg"
                            alt="Test"
                        />
                        <motion.img 
                            variants={imageVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                            src="./team/3.jpg" 
                            className="w-96 h-72 object-cover rounded-xl shadow-lg"
                            alt="Team 2" 
                        />
                    </div>

                    {/* Center column - main image */}
                    <div className="flex items-center justify-center h-full">
                        <motion.img 
                            variants={imageVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                            src="./team/1a.jpg" 
                            className="w-96 h-[600px] object-cover rounded-xl shadow-xl"
                            alt="Main Team" 
                        />
                    </div>

                    {/* Right column */}
                    <div className="grid gap-8 h-full">
                        <motion.img 
                            variants={imageVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                            src="./team/3c.jpg" 
                            className="w-96 h-72 object-cover rounded-xl shadow-lg"
                            alt="Team 4" 
                        />
                        <motion.img 
                            variants={imageVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                            src="./team/WhatsApp Image 2025-02-03 at 20.05.06_1c062496.jpg" 
                            className="w-96 h-72 object-cover rounded-xl shadow-lg"
                            alt="Team 5" 
                        />
                    </div>
                </motion.div>

                {/* About Section with enhanced animation */}
                <motion.div
                    style={{
                        opacity: aboutOpacity,
                        scale: aboutScale,
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-transparent"
                    id="about"
                >
                    <motion.div 
                        className="max-w-4xl px-6 py-12 text-center"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-6xl font-bold bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
                            ABOUT US
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed">
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
