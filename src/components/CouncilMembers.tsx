import { Users, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TiltCard3D } from './ui/tilt-card-3d';
import fallbackData from '../../db-fallback.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiMember {
  _id: string;
  name: string;
  position: string;
  councilType?: 'Senior' | 'Junior';
  department?: string;
  imageUrl: string;
  email?: string;
  linkedin?: string;
  order: number;
  isActive?: boolean;
}

const CouncilMembers = () => {
  const [seniorMembers, setSeniorMembers] = useState<ApiMember[]>([]);
  const [juniorMembers, setJuniorMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/council-members`);
        const allMembers: ApiMember[] = response.data.data;

        const activeMembers = allMembers
          .filter(m => m.isActive !== false)
          .sort((a, b) => a.order - b.order);

        const senior = activeMembers.filter(m => m.councilType === 'Senior' || !m.councilType);
        const junior = activeMembers.filter(m => m.councilType === 'Junior');

        setSeniorMembers(senior.length ? senior : (activeMembers as ApiMember[]));
        setJuniorMembers(junior);
      } catch (error) {
        console.error('Error fetching council members, using fallback data:', error);
        const fallbackList = (fallbackData.councilMembers || []) as ApiMember[];
        const activeMembers = fallbackList
          .filter(m => m.isActive !== false)
          .sort((a, b) => a.order - b.order);

        const senior = activeMembers.filter(m => m.councilType === 'Senior' || !m.councilType);
        const junior = activeMembers.filter(m => m.councilType === 'Junior');

        setSeniorMembers(senior.length ? senior : activeMembers);
        setJuniorMembers(junior);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="py-20 bg-transparent" id="council">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest">Loading council members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-transparent perspective-1000" id="council">
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20 preserve-3d">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-3xl bg-slate-900/80 border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <Users className="h-12 w-12 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <h2 className="mt-4 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 py-4 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              Council Members
            </h2>
            <div className="w-28 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mb-8 rounded-full shadow-[0_0_15px_#10b981]" />
            <p className="text-slate-300 max-w-2xl mx-auto mb-16 text-base md:text-lg">
              Our distinguished council brings together leading experts in various fields of biotechnology and healthcare.
            </p>
          </div>

          {/* Senior Council Section */}
          {seniorMembers.length > 0 && (
            <div className="mb-20">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent mb-16"
              >
                Senior Council
              </motion.h3>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 preserve-3d">
                {seniorMembers.map((member) => (
                  <TiltCard3D
                    key={member._id}
                    maxTilt={14}
                    scale={1.04}
                    glareColor="rgba(6, 182, 212, 0.4)"
                    className="group border border-emerald-500/30 bg-slate-950/70 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl bio-card-glow"
                  >
                    <div className="flex flex-col items-center preserve-3d">
                      {/* Image Container with 3D Hologram Glow */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-spin-slow opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-slate-900 group-hover:border-cyan-400 transition-colors duration-300 shadow-2xl">
                          <img 
                            src={member.imageUrl} 
                            alt={member.name}
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center preserve-3d">
                        <h3 className="text-2xl font-extrabold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300 group-hover:translate-z-10">
                          {member.name}
                        </h3>
                        <div className="text-emerald-400 font-semibold mb-4 text-base tracking-wide">{member.position}</div>

                        {/* Social Links */}
                        <div className="flex justify-center space-x-4 mt-4">
                          {member.linkedin && (
                            <a 
                              href={member.linkedin} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-300"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {member.email && (
                            <a 
                              href={`mailto:${member.email}`} 
                              className="p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-400/50 transition-all duration-300"
                            >
                              <Mail className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </TiltCard3D>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Junior Council Section */}
      {juniorMembers.length > 0 && (
        <div className="mt-16 max-w-7xl mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent mb-8"
          >
            Junior Council
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center text-slate-300 max-w-2xl mx-auto mb-16 text-base"
          >
            Meet our dynamic and passionate junior council members, the rising stars shaping the future of biotechnology at DTU.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-6xl mx-auto preserve-3d">
            {juniorMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut"
                }}
                className="group relative flex flex-col items-center"
              >
                <TiltCard3D
                  maxTilt={12}
                  scale={1.06}
                  glareColor="rgba(16, 185, 129, 0.3)"
                  className="w-full p-4 rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-xl group-hover:border-cyan-500/40 bio-card-glow"
                >
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto mb-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm" />
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover border-2 border-emerald-500/30 group-hover:border-cyan-400 transition-colors duration-300 shadow-md"
                    />
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="bg-slate-950/80 p-2.5 rounded-full border border-cyan-400/50">
                          <Linkedin className="w-5 h-5 text-cyan-300" />
                        </div>
                      </a>
                    )}
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm md:text-base font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {member.position}
                    </p>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CouncilMembers;