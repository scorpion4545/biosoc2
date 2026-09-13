"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("Home");
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { title: "Home", href: "#biosoc" },
    { title: "About Us", href: "#about" },
    {
      title: "Team",
      href: "#team",
      items: [
        { title: "Faculty", href: "#faculty" },
        { title: "Council Members", href: "#council" },
      ]
    },
    {
      title: "More",
      href: "#more",
      items: [
        { title: "Why BioSoc", href: "#why-biosoc" },
        { title: "Past Events", href: "#past-events" },
        { title: "Upcoming Events", href: "#upcoming-events" },
        { title: "Newsletter", href: "#newsletter" },
      ]
    },
  ];

  const scrollToSection = (id: string, title: string) => {
    setIsOpen(false);
    setActiveDropdown(null);
    setActiveSection(title);
    if (id === "#biosoc") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('section[id], div[id]');
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const sectionId = section.getAttribute('id');
          menuItems.forEach(item => {
            if (item.items) {
              item.items.forEach(subItem => {
                if (subItem.href === `#${sectionId}`) {
                  setActiveSection(subItem.title);
                }
              });
            } else if (item.href === `#${sectionId}`) {
              setActiveSection(item.title);
            }
          });
        }
      });

      if (scrollPosition < 100) {
        setActiveSection("Home");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed transition-all duration-300 z-50 ${
      isScrolled 
      ? 'top-4 left-4 right-4 w-auto flex justify-between items-center' 
      : 'top-6 left-1/2 -translate-x-1/2 w-auto'
    }`}>
      <nav className={`transition-all duration-300 ${
        isScrolled 
        ? 'bg-transparent flex w-full justify-between items-center px-0' 
        : 'bg-black/20 backdrop-blur-lg border border-white/10 rounded-full px-8'
      }`}>
        <div className={`flex items-center justify-between ${isScrolled ? 'w-full' : 'h-16'}`}>
          {/* Logo */}
          <div className={`flex items-center transition-all duration-300`}>
            <button 
              onClick={() => scrollToSection("#biosoc", "Home")}
              className="cursor-pointer"
            >
              <img 
                src="./team/Logo.svg" 
                alt="BioSoc Logo" 
                className={`transition-all duration-300 hover:scale-110 ${
                  isScrolled ? 'h-12 w-12' : 'h-18 w-18'
                } mr-8`}
              />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center transition-all duration-300 ${
            isScrolled ? 'md:hidden' : 'space-x-16 ml-8'
          }`}>
            {menuItems.map((item) => (
              <div key={item.title} className="relative">
                {('items' in item) ? (
                  // Dropdown Menu
                  <div 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button 
                      className={`flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 text-lg relative`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.title && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-2 w-52 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl"
                        >
                          {item.items?.map((subItem) => (
                            <button
                              key={subItem.title}
                              onClick={() => scrollToSection(subItem.href, subItem.title)}
                              className={`block w-full text-left px-4 py-3 text-base ${
                                activeSection === subItem.title ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
                              } transition-colors duration-300`}
                            >
                              {subItem.title}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular Menu Item
                  <button
                    onClick={() => scrollToSection(item.href, item.title)}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-lg relative"
                  >
                    {item.title}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Menu Button - Always visible when scrolled */}
          <div className={`${isScrolled ? 'block' : 'md:hidden'}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white bg-black/40 backdrop-blur-lg p-3 rounded-full"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden"
            >
              {menuItems.map((item) => (
                'items' in item ? (
                  <div key={item.title}>
                    <div className="px-4 py-3 text-gray-300 bg-white/5 text-lg">
                      {item.title}
                    </div>
                    {item.items?.map((subItem) => (
                      <button
                        key={subItem.title}
                        onClick={() => scrollToSection(subItem.href, subItem.title)}
                        className={`block w-full text-left px-6 py-3 text-base ${
                          activeSection === subItem.title ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    key={item.title}
                    onClick={() => scrollToSection(item.href, item.title)}
                    className={`block w-full text-left px-4 py-3 text-base ${
                      activeSection === item.title ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.title}
                  </button>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
