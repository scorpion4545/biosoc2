import React, { useState, useRef } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { IconBrandGmail } from '@tabler/icons-react';
import emailjs from '@emailjs/browser';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  bgClass: string;
  shadowClass: string;
}

const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string>('');
  const form = useRef<HTMLFormElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus('');

    try {
      await emailjs.sendForm(
        'service_hugy1ch',
        'template_hubmrbi',
        form.current!,
        'PaOONK9S4J-eBuXYs'
      );
      
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="flex flex-col justify-center h-full items-center md:items-start">
            <div className="mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                BioSoc DTU
              </h2>
            </div>

            <div className="flex space-x-6 mb-6">
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

            <div className="text-center md:text-left text-gray-400 text-sm">
              <p className="mb-2">Contact us at: biosoc@dtu.ac.in</p>
              <p>Delhi Technological University, Delhi - 110042</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Having a Query?
            </h3>
            <form ref={form} onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
              <div>
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="user_email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
              {status && (
                <p className={`text-sm text-center ${status.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} BioSoc DTU. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;