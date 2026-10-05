import { Users, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiMember {
  _id: string;
  name: string;
  position: string;
  councilType: 'Senior' | 'Junior';
  department: string;
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

        // Filter active members and sort by order
        const activeMembers = allMembers
          .filter(m => m.isActive !== false)
          .sort((a, b) => a.order - b.order);

        // Separate by councilType instead of department
        const senior = activeMembers.filter(m => m.councilType === 'Senior');
        const junior = activeMembers.filter(m => m.councilType === 'Junior');

        setSeniorMembers(senior);
        setJuniorMembers(junior);
      } catch (error) {
        console.error('Error fetching council members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="py-20" id="council">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading council members...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20" id="council">
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
              Council Members
            </h2>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full" />
            <p className="text-gray-300 max-w-2xl mx-auto mb-16">
              Our distinguished council brings together leading experts in various fields of biotechnology and healthcare.
            </p>
          </div>

          {/* Senior Council Section */}
          {seniorMembers.length > 0 && (
            <div className="mb-16">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-semibold text-center bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent mb-16"
              >
                Senior Council
              </motion.h3>
              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 [&>*:last-child:nth-child(3n-1)]:lg:col-start-2 [&>*:last-child:nth-child(3n-2)]:lg:col-start-2">
                {seniorMembers.map((member) => (
                  <div 
                    key={member._id}
                    className="relative group"
                  >
                    <div className="flex flex-col items-center">
                      {/* Image Container with Border Animation */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin-slow opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-blue-500 transition-colors duration-300">
                          <img 
                            src={member.imageUrl} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                          {member.name}
                        </h3>
                        <div className="text-blue-500 font-medium mb-2">{member.position}</div>

                        {/* Social Links */}
                        <div className="flex justify-center space-x-4 mt-4">
                          {member.linkedin && (
                            <a 
                              href={member.linkedin} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {member.email && (
                            <a 
                              href={`mailto:${member.email}`} 
                              className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                            >
                              <Mail className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
            className="text-4xl md:text-5xl font-semibold text-center bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent mb-8"
          >
            Junior Council
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center text-gray-300 max-w-2xl mx-auto mb-16"
          >
            Meet our dynamic and passionate junior council members, the rising stars shaping the future of biotechnology at DTU.
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-8 max-w-6xl mx-auto">
            {juniorMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="group relative flex flex-col items-center"
                style={{
                  zIndex: juniorMembers.length - index
                }}
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-sm" />
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors duration-300"
                  />
                  {/* LinkedIn Icon with conditional rendering */}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="bg-black/50 p-2 rounded-full">
                        <Linkedin className="w-6 h-6 text-white hover:text-blue-400 transition-colors duration-300" />
                      </div>
                    </a>
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-sm md:text-base font-medium text-gray-200 group-hover:text-purple-400 transition-colors duration-300">
                    {member.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400">
                    {member.position}
                  </p>
                </div>
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
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CouncilMembers;