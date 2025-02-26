import React from 'react';
import { Users, Linkedin, Twitter, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const juniorMembers = [
  { name: "Alex Smith", position: "Technical Lead", image: "./team/member1.jpg" },
  { name: "Emma Wilson", position: "Event Coordinator", image: "./team/member2.jpg" },
  { name: "John Davis", position: "Content Writer", image: "./team/member3.jpg" },
  { name: "Sarah Brown", position: "Design Lead", image: "./team/member4.jpg" },
  { name: "Michael Lee", position: "Research Associate", image: "./team/member5.jpg" },
  { name: "Lisa Chen", position: "Marketing Lead", image: "./team/member6.jpg" },
  { name: "David Kim", position: "Technical Associate", image: "./team/member7.jpg" },
  { name: "Rachel Green", position: "Event Manager", image: "./team/member8.jpg" },
  { name: "James Wilson", position: "Content Creator", image: "./team/member9.jpg" },
  { name: "Emily Davis", position: "Research Lead", image: "./team/member10.jpg" },
  { name: "Thomas Wang", position: "Design Associate", image: "./team/member11.jpg" },
  { name: "Jessica Liu", position: "Marketing Associate", image: "./team/member12.jpg" },
  { name: "Ryan Park", position: "Technical Support", image: "./team/member13.jpg" },
  { name: "Sophie Martinez", position: "Event Planner", image: "./team/member14.jpg" },
  { name: "Daniel Lee", position: "Content Editor", image: "./team/member15.jpg" },
  { name: "Olivia Johnson", position: "Research Assistant", image: "./team/member16.jpg" },
  { name: "Kevin Zhang", position: "Design Assistant", image: "./team/member17.jpg" },
  { name: "Amanda White", position: "Marketing Coordinator", image: "./team/member18.jpg" },
  { name: "Chris Taylor", position: "Technical Analyst", image: "./team/member19.jpg" },
  { name: "Michelle Park", position: "Event Assistant", image: "./team/member20.jpg" },
  { name: "Brian Chen", position: "Content Manager", image: "./team/member21.jpg" },
  { name: "Laura Kim", position: "Research Coordinator", image: "./team/member22.jpg" },
  { name: "Steven Liu", position: "Design Coordinator", image: "./team/member23.jpg" },
  { name: "Grace Wang", position: "Marketing Assistant", image: "./team/member24.jpg" },
  { name: "Andrew Davis", position: "Technical Coordinator", image: "./team/member25.jpg" }
];

const CouncilMembers = () => {
  const members = [
    {
      name: "Aman Yadav",
      role: "President",
      expertise: "Molecular Biology",
      description: "Leading researcher in genetic engineering with over 15 years of experience in biotechnology.",
      image: "./team/Aman.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah.chen@example.com"
      }
    },
    {
      name: "Bhavya",
      role: "Vice President",
      expertise: "Bioethics",
      description: "Distinguished professor specializing in bioethical implications of emerging technologies.",
      image: "./team/Bhavya.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "james.miller@example.com"
      }
    },
    {
      name: "Mohit Daber",
      role: "Kuch toh hai",
      expertise: "Clinical Research",
      description: "Pioneer in translational medicine and clinical trial design methodology.",
      image: "./team/Mohit.JPG",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "elena.rodriguez@example.com"
      }
    },
    {
      name: "Unnati",
      role: "Treasurer",
      expertise: "Bioinformatics",
      description: "Expert in computational biology and AI applications in healthcare.",
      image: "./team/Uno.jpg",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "michael.patel@example.com"
      }
    },
    {
      name: "Hutansh",
      role: "Kuch toh hai",
      expertise: "Immunology",
      description: "Renowned immunologist with breakthrough research in autoimmune diseases.",
      image: "./team/Hutansh.png",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "amanda.foster@example.com"
      }
    },
    {
        name: "Shivam",
        role: "Ex-Prezz",
        expertise: "Immunology",
        description: "Renowned immunologist with breakthrough research in autoimmune diseases.",
        image: "./team/Shivam.jpg",
        social: {
          linkedin: "#",
          twitter: "#",
          email: "amanda.foster@example.com"
        }
      },
      {
        name: "Katyayani",
        role: "Ex-",
        expertise: "Immunology",
        description: "Renowned immunologist with breakthrough research in autoimmune diseases.",
        image: "./team/cat.jpg",
        social: {
          linkedin: "#",
          twitter: "#",
          email: "amanda.foster@example.com"
        }
  }
    
  ];

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
          <div className="mb-32">
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
              {members.map((member, index) => (
                <div 
                  key={member.name}
                  className="relative group"
                >
                  <div className="flex flex-col items-center">
                    {/* Image Container with Border Animation */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin-slow opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative h-48 w-48 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-blue-500 transition-colors duration-300">
                        <img 
                          src={member.image} 
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
                      <div className="text-blue-500 font-medium mb-2">{member.role}</div>
                      <div className="text-sm text-gray-400 mb-4 font-medium">{member.expertise}</div>
                      <p className="text-gray-300 text-sm mb-6">{member.description}</p>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-4">
                        <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a href={member.social.twitter} className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                          <Twitter className="h-5 w-5" />
                        </a>
                        <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Junior Council Section */}
      <div className="mt-32 max-w-7xl mx-auto px-4">
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
              key={member.name}
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover border-2 border-purple-500/30 group-hover:border-purple-500 transition-colors duration-300"
                />
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

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CouncilMembers;