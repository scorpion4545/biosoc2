"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  title: string;
  href: string;
  items?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  href: string;
}

// Remove unused TransitionProps interface
// Remove duplicate motion import since it's already imported above

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("Home");

  const menuItems: MenuItem[] = [
    { title: "Home", href: "#biosoc" },
    { title: "About Us", href: "#about" },
    {
      title: "Team",
      href: "#team", // Added missing href for dropdown menu
      items: [
        { title: "Faculty", href: "#faculty" },
        { title: "Council Members", href: "#council" },
      ]
    },
    {
      title: "More",
      href: "#more", // Added missing href for dropdown menu
      items: [
        { title: "Why BioSoc", href: "#why-biosoc" },
        { title: "Past Events", href: "#past-events" },
        { title: "Upcoming Events", href: "#upcoming-events" },
        { title: "Newsletter", href: "#newsletter" },
      ]
    },
  ];

  const scrollToSection = (id: string, title: string): void => {
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

  // Remove unused transition constant
  useEffect(() => {
    const handleScroll = (): void => {
      const sections = document.querySelectorAll<HTMLElement>('section[id], div[id]');
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const sectionId = section.getAttribute('id');
          // Find the corresponding menu item
          menuItems.forEach(item => {
            if ('items' in item && item.items) {
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

      // Check if we're at the top of the page
      if (scrollPosition < 100) {
        setActiveSection("Home");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto">
      <nav className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-full px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center mr-8">
            <img 
              src="./team/Logo.svg" 
              alt="BioSoc Logo" 
              className="h-18 w-18 mr-4 transition-transform hover:scale-110"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-16">
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
                      {activeSection === item.title && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30
                          }}
                        />
                      )}
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
                    {activeSection === item.title && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30
                        }}
                      />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
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
              className="md:hidden absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden"
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
