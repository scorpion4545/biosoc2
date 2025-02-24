import React from 'react';
import { Users, Linkedin, Twitter, Mail } from 'lucide-react';

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
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our distinguished council brings together leading experts in various fields of biotechnology and healthcare.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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