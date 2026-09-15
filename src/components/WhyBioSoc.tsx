import React from 'react';
import { motion, Variants } from "framer-motion";

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
    <section className="py-20 px-4" id="why-biosoc">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
          Why BioSoc-DTU?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10"
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-purple-500/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Top gradient line */}
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
              
              {/* Background Logo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.06]">
                <img 
                  src="/team/Logo.svg"
                  alt="BioSoc Logo" 
                  className="h-4/5 w-4/5 object-contain"
                />
              </div>

              {/* Corner accent */}
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
              
              <div className="relative z-10">
                {/* Icon with background */}
                <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4 text-4xl shadow-lg ring-1 ring-cyan-500/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-cyan-500/30">
                  {card.icon}
                </div>
                
                <h3 className="mb-4 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
                  {card.title}
                </h3>
                
                <p className="leading-relaxed text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
                  {card.description}
                </p>

                {/* Bottom decorative line */}
                <div className="mt-6 h-1 w-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};