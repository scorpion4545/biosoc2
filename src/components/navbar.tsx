import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check window width on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close menu when switching to desktop
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    // Set initial value
    checkScreenSize();
    
    // Add event listener
    window.addEventListener("resize", checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "sponsors", label: "Past Sponsors" },
    { id: "newsletter", label: "Newsletter" },
  ];

  const handleNavClick = (itemId) => {
    setActiveTab(itemId);
    setIsMenuOpen(false);
    
    // Handle PDF download if newsletter is clicked
    if (itemId === "newsletter") {
      const link = document.createElement("a");
      link.href = "./team/News.pdf";
      link.download = "Newsletter.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <nav className="w-full bg-[#0B1121]/80 backdrop-blur-sm border border-white/10 rounded-full">
        <div className="px-4 py-3 relative">
          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex justify-between items-center">
              <span className="text-gray-200 font-medium">Menu</span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <div className="flex items-center justify-center space-x-4 md:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="relative px-2 md:px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Mobile dropdown menu */}
          {isMobile && isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-full bg-[#0B1121] border border-white/10 rounded-xl overflow-hidden shadow-xl"
            >
              <div className="py-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full text-left px-6 py-3 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </div>
  );
};
