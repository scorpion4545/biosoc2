"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    {
      title: "Team",
      href: "/team",
      items: [
        { title: "Faculty", href: "/team#faculty" },
        { title: "Council Members", href: "/team#council" },
      ]
    },
    {
      title: "More",
      href: "/events",
      items: [
        { title: "Events", href: "/events" },
        { title: "Resources", href: "/resources" },
      ]
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed transition-all duration-500 z-50 ${
      isScrolled 
      ? 'top-4 left-4 right-4 w-auto flex justify-between items-center' 
      : 'top-6 left-1/2 -translate-x-1/2 w-auto'
    }`}>
      <nav className={`transition-all duration-500 ${
        isScrolled 
        ? 'bg-transparent flex w-full justify-between items-center px-0' 
        : 'bg-slate-950/70 backdrop-blur-2xl border border-emerald-500/30 rounded-full px-8 py-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] bio-card-glow'
      }`}>
        <div className={`flex items-center justify-between ${isScrolled ? 'w-full' : 'h-16'}`}>
          {/* Logo */}
          <div className={`flex items-center transition-all duration-300`}>
            <Link to="/" onClick={() => setIsOpen(false)} className="cursor-pointer group">
              <img 
                src="/team/Logo.svg"
                alt="BioSoc Logo" 
                className={`transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] ${
                  isScrolled ? 'h-12 w-12' : 'h-16 w-16'
                } mr-8`}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center h-full transition-all duration-300 ${
            isScrolled ? 'md:hidden' : 'space-x-12 ml-6'
          }`}>
            {menuItems.map((item) => (
              <div key={item.title} className="relative h-full flex items-center">
                {('items' in item) ? (
                  // Dropdown Menu
                  <div 
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button 
                      className={`flex items-center space-x-1.5 text-slate-300 hover:text-emerald-300 transition-colors duration-300 text-base font-semibold relative cursor-pointer py-2 ${
                        activeDropdown === item.title ? 'text-emerald-300' : ''
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronDown 
                        size={16} 
                        className={`text-emerald-400 transition-transform duration-300 ${
                          activeDropdown === item.title ? 'rotate-180 text-emerald-300' : ''
                        }`} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.title && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-56 z-50"
                        >
                          <div className="relative py-2 px-1.5 bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] bio-card-glow overflow-hidden before:absolute before:-top-4 before:inset-x-0 before:h-4">
                            {item.items?.map((subItem) => (
                              <NavLink
                                key={subItem.title}
                                to={subItem.href}
                                onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                                className={({ isActive }) => `block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium ${
                                  isActive ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-300 hover:text-white hover:bg-emerald-500/15'
                                } transition-colors duration-200`}
                              >
                                {subItem.title}
                              </NavLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular Menu Item
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => `${isActive ? 'text-emerald-300 font-bold' : 'text-slate-300'} hover:text-emerald-300 transition-colors duration-300 text-base font-semibold relative py-2`}
                  >
                    {item.title}
                  </NavLink>
                )}
              </div>
            ))}
          </div>

          {/* Menu Button - Always visible when scrolled */}
          <div className={`${isScrolled ? 'block' : 'md:hidden'}`}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white bg-slate-950/80 border border-emerald-500/40 backdrop-blur-2xl p-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full right-0 mt-3 w-64 bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9)] overflow-hidden bio-card-glow"
            >
              {menuItems.map((item) => (
                'items' in item ? (
                  <div key={item.title}>
                    <div className="px-5 py-3 text-emerald-400 font-mono text-sm uppercase font-semibold bg-emerald-500/10">
                      {item.title}
                    </div>
                    {item.items?.map((subItem) => (
                      <NavLink
                        key={subItem.title}
                        to={subItem.href}
                        onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                        className={({ isActive }) => `block w-full text-left px-6 py-3 text-sm font-medium ${
                          isActive ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-300 hover:text-white hover:bg-emerald-500/10'
                        }`}
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    key={item.title}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `block w-full text-left px-5 py-3.5 text-sm font-medium ${
                      isActive ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-300 hover:text-white hover:bg-emerald-500/10'
                    }`}
                  >
                    {item.title}
                  </NavLink>
                )
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};
