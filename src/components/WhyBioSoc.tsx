import React from 'react';
import { motion, Variants } from "framer-motion";
import { TiltCard3D } from "./ui/tilt-card-3d";

interface Card {
  title: string;
  description: string;
  icon: string;
}

interface CardVariants extends Variants {
  animate: (index: number) => {
    opacity: number;
    y: number;
    transition: {
      duration: number;
      delay: number;
    };
  };
}

export const WhyBioSoc: React.FC = () => {
  const cardVariants: CardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
      },
    })
  };

  const cards: Card[] = [
    {
      title: "Unparalleled Network & Engagement",
      description: "BioSoc-DTU is easily set apart from other student-led initiatives because of the various channels and means it has to connect with not just the niche and dedicated biotech professionals, researchers and students but also the audience it can address at large, through its many interactive events and sessions, all of which have received hearty receptions.",
      icon: "🌐"
    },
    {
      title: "Vibrant Community",
      description: "BioSoc-DTU can provide an incredible platform for any organisation to tap into not just DTU's student body, but also those from other premier colleges, especially those situated in Delhi and the National Capital Region, like Delhi University, NSUT, and many more.",
      icon: "👥"
    },
    {
      title: "Proven Marketing Excellence",
      description: "With its extensive social media following, BioSoc-DTU is a great resource for enabling any brand or organisation, especially those centred around biotechnology, to vitalise or kick start its marketing campaign. This is proven by BioSoc-DTU's many collaborations with renowned brands like - Nescafe, Geeks4Geeks, Hurricane Energy Drink, Interview Buddy, Jamboree Education and more!",
      icon: "🚀"
    }
  ];

  return (
    <section className="py-24 px-4 relative z-10 perspective-1000" id="why-biosoc">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="mt-8 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 py-4 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl mb-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          Why BioSoc-DTU?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 preserve-3d">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="h-full"
            >
              <TiltCard3D
                maxTilt={12}
                scale={1.03}
                glareColor="rgba(16, 185, 129, 0.3)"
                className="h-full group border border-emerald-500/20 bg-slate-950/70 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl bio-card-glow transition-all duration-300"
              >
                {/* Background Logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08] pointer-events-none">
                  <img 
                    src="/team/Logo.svg"
                    alt="BioSoc Logo" 
                    className="h-4/5 w-4/5 object-contain"
                  />
                </div>

                {/* Corner bioluminescent glow */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/25 pointer-events-none" />
                
                <div className="relative z-10 preserve-3d">
                  {/* Icon with 3D depth floating */}
                  <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 p-4 text-4xl shadow-lg ring-1 ring-emerald-500/30 transition-all duration-300 group-hover:translate-z-20 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    {card.icon}
                  </div>
                  
                  <h3 className="mb-4 bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-2xl font-bold text-transparent transition-all group-hover:translate-z-10">
                    {card.title}
                  </h3>
                  
                  <p className="leading-relaxed text-slate-300 transition-colors duration-300 group-hover:text-slate-100 text-base">
                    {card.description}
                  </p>

                  {/* Bottom glowing line */}
                  <div className="mt-8 h-1 w-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500 group-hover:w-full shadow-[0_0_10px_#10b981]" />
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};