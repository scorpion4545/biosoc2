import { motion } from "framer-motion";

export const WhyBioSoc = () => {
  return (
    <section className="py-20 px-4">
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
          {/* Research & Innovation */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#0B1121]/40 border border-white/10 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Unparalleled Network & Engagement</h3>
            <p className="text-gray-300">
            BioSoc-DTU is easily set apart from other student-led initiatives because of the various channels and means it has to connect with not just the niche and dedicated biotech professionals, researchers and students but also the audience it can address at large, through its many interactive events and sessions, all of which have received hearty receptions.
            </p>
          </motion.div>

          {/* Community */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#0B1121]/40 border border-white/10 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Vibrant Community</h3>
            <p className="text-gray-300">
            BioSoc can provide an incredible platform for any organisation to tap into not just DTU’s student body, but also those from other premier colleges, especially those situated in Delhi and the National Capital Region, like Delhi University, NSUT, and many more.rchers, and industry professionals.
            </p>
          </motion.div>

          {/* Opportunities */}
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 rounded-2xl bg-[#0B1121]/40 border border-white/10 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Proven Marketing Excellence</h3>
            <p className="text-gray-300">
            With its extensive social media following, BioSoc is a great resource for enabling any brand or organisation, especially those centred around biotechnology, to vitalise or kick start its marketing campaign. This is proven by BioSoc’s many collaborations with renowned brands like - Nescafe, Geeks4Geeks, Hurricane Energy Drink, Interview Buddy, Jamboree Education and more!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}; 