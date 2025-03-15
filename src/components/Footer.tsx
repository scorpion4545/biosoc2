import React from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { IconBrandGmail } from '@tabler/icons-react';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  bgClass: string;
  shadowClass: string;
}

const Footer: React.FC = () => {
  const socialLinks: SocialLink[] = [
    {
      icon: <Instagram className="w-6 h-6" />,
      href: "https://www.instagram.com/biosocdtu/",
      bgClass: "from-purple-500 to-pink-500",
      shadowClass: "shadow-purple-500/25"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "https://www.linkedin.com/company/biosoc-dtu/",
      bgClass: "from-blue-500 to-blue-600",
      shadowClass: "shadow-blue-500/25"
    },
    {
      icon: <IconBrandGmail className="w-6 h-6" />,
      href: "mailto:biosoc@dtu.ac.in",
      bgClass: "from-red-500 to-red-600",
      shadowClass: "shadow-red-500/25"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center">
          {/* Logo/Name */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              BioSoc DTU
            </h2>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-8 mb-8">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-all duration-300 hover:scale-125 hover:-translate-y-2"
              >
                <div className={`p-3 rounded-full bg-gradient-to-br ${social.bgClass} hover:shadow-lg ${social.shadowClass}`}>
                  {social.icon}
                </div>
              </a>
            ))}
          </div>

          {/* Contact Info */}
          <div className="text-center text-gray-400">
            <p className="mb-2">Contact us at: biosoc@dtu.ac.in</p>
            <p>Delhi Technological University, Delhi - 110042</p>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-sm text-gray-500">
            © {new Date().getFullYear()} BioSoc DTU. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;