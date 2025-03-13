import { motion } from "framer-motion";

export const WhyBioSoc = () => {
  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.2,
      },
    }),
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
      background: "linear-gradient(145deg, rgba(11, 17, 33, 0.6), rgba(11, 17, 33, 0.8))",
      transition: { duration: 0.2 }
    }
  };

  const cards = [
    {
      title: "Unparalleled Network & Engagement",
      description: "BioSoc-DTU is easily set apart from other student-led initiatives because of the various channels and means it has to connect with not just the niche and dedicated biotech professionals, researchers and students but also the audience it can address at large, through its many interactive events and sessions, all of which have received hearty receptions.",
      icon: "🌐"
    },
    {
      title: "Vibrant Community",
      description: "BioSoc can provide an incredible platform for any organisation to tap into not just DTU's student body, but also those from other premier colleges, especially those situated in Delhi and the National Capital Region, like Delhi University, NSUT, and many more.",
      icon: "👥"
    },
    {
      title: "Proven Marketing Excellence",
      description: "With its extensive social media following, BioSoc is a great resource for enabling any brand or organisation, especially those centred around biotechnology, to vitalise or kick start its marketing campaign. This is proven by BioSoc's many collaborations with renowned brands like - Nescafe, Geeks4Geeks, Hurricane Energy Drink, Interview Buddy, Jamboree Education and more!",
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
          Why Bio-Soc?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              custom={index}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-[#0B1121]/40 border border-white/10 backdrop-blur-sm relative group"
            >
              <div className="text-4xl mb-6">{card.icon}</div>
              <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
                {card.title}
              </h3>
              <p className="text-gray-300 leading-relaxed relative z-10">
                {card.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};