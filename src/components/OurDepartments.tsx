import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion, useInView, AnimatePresence } from 'framer-motion';
import { Calendar, Briefcase, Palette, BookOpen } from 'lucide-react';

interface Department {
  id: number;
  title: string;
  shortLabel: string;
  description: string;
  tags: string[];
  color: string;
  icon: React.ElementType;
}

const departments: Department[] = [
  {
    id: 1,
    title: 'Events & PR',
    shortLabel: 'Events & PR',
    description: 'The PR & Events department is the organisational backbone behind many of the society\'s highly-successful events. It also spreads word across colleges and universities about upcoming events and maintains the society\'s presence across various premier institutions.',
    tags: ['Events', 'Publicity', 'Campus Reach'],
    color: '#10b981',
    icon: Calendar,
  },
  {
    id: 2,
    title: 'Corporate & Outreach',
    shortLabel: 'Corporate & Outreach',
    description: 'The corporate department maintains and expands the society\'s relations with its corporate partners. It brings in the corporate patronage needed for the society\'s events and helps bridge the gap between academia and industry.',
    tags: ['Partnerships', 'Sponsorship', 'Industry Links'],
    color: '#06b6d4',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'Design & Technical',
    shortLabel: 'Design & Technical',
    description: 'The design department is the driving force behind the society\'s technically-demanding endeavors, such as designing social media posts, attractive posters, and executing other technical tasks with precision and speed.',
    tags: ['Posters', 'Social Media', 'Execution'],
    color: '#8b5cf6',
    icon: Palette,
  },
  {
    id: 4,
    title: 'Research & Content',
    shortLabel: 'Research & Content',
    description: 'The content department manages the posts and articles BioSoc-DTU shares on Instagram, LinkedIn and other platforms for a growing audience of biotech enthusiasts, and handles the ideation of all content.',
    tags: ['Articles', 'Ideation', 'Social Media'],
    color: '#ec4899',
    icon: BookOpen,
  },
];

interface HexagonProps {
  department: Department;
  isActive: boolean;
  onClick: () => void;
  index: number;
  shouldReduceMotion: boolean;
  progress: number;
  mousePosition: { x: number; y: number };
}

const Hexagon: React.FC<HexagonProps> = ({
  department,
  isActive,
  onClick,
  index,
  shouldReduceMotion,
  progress,
  mousePosition,
}) => {
  const hexRef = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (shouldReduceMotion || !hexRef.current) return;
    
    const rect = hexRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (mousePosition.x - centerX) / 80;
    const deltaY = (mousePosition.y - centerY) / 80;
    
    setTilt({ x: deltaY * -1, y: deltaX });
  }, [mousePosition, shouldReduceMotion]);

  const Icon = department.icon;
  // Mathematical Flat-topped Regular Honeycomb Hexagon
  const width = 195;
  const height = 168.87; // width * sqrt(3)/2

  const points = `${width * 0.25},0 ${width * 0.75},0 ${width},${height * 0.5} ${width * 0.75},${height} ${width * 0.25},${height} 0,${height * 0.5}`;

  return (
    <motion.button
      ref={hexRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      type="button"
      className={`relative focus:outline-none group cursor-pointer preserve-3d transition-all duration-300 ${
        isActive ? 'z-30 scale-105' : 'z-10 hover:z-20'
      }`}
      style={{
        width: width,
        height: height,
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: isActive ? 1.05 : 1,
        rotateX: shouldReduceMotion ? 0 : tilt.x,
        rotateY: shouldReduceMotion ? 0 : tilt.y,
      }}
      transition={{
        delay: index * 0.1,
        duration: shouldReduceMotion ? 0 : 0.4,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      aria-selected={isActive}
      role="tab"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 pointer-events-none filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
      >
        <defs>
          <linearGradient id={`grad-${department.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={department.color} stopOpacity={isActive ? 0.75 : 0.3} />
            <stop offset="100%" stopColor="#030712" stopOpacity={isActive ? 0.95 : 0.75} />
          </linearGradient>
          <filter id={`glow-${department.id}`}>
            <feGaussianBlur stdDeviation={isActive ? 8 : 4} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Flat-topped Regular Hexagon Background */}
        <polygon
          points={points}
          fill={`url(#grad-${department.id})`}
          stroke={department.color}
          strokeWidth={isActive ? 3 : 1.5}
          strokeOpacity={0.6}
          filter={`url(#glow-${department.id})`}
          className="transition-all duration-300"
        />

        {/* Animated Bioluminescent Neon Laser Border Around Comb */}
        <motion.polygon
          points={points}
          fill="none"
          stroke={department.color}
          strokeWidth={isActive ? 3.5 : 2}
          strokeDasharray="130 450"
          animate={{
            strokeDashoffset: [0, -580],
          }}
          transition={{
            duration: isActive ? 3.5 : 6,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            filter: `drop-shadow(0 0 ${isActive ? '12px' : '6px'} ${department.color})`,
          }}
        />

        {/* Animated progress ring on active */}
        {isActive && progress > 0 && (
          <motion.polygon
            points={points}
            fill="none"
            stroke={department.color}
            strokeWidth="3.5"
            strokeDasharray="750"
            strokeDashoffset={750 - (750 * progress) / 100}
            className="transition-all duration-100"
            style={{
              filter: `drop-shadow(0 0 10px ${department.color})`,
            }}
          />
        )}
        
        {/* Breathing glow border */}
        {isActive && !shouldReduceMotion && (
          <motion.polygon
            points={points}
            fill="none"
            stroke={department.color}
            strokeWidth="2.5"
            opacity="0.6"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 0.2, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'center' }}
          />
        )}
      </svg>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 preserve-3d pointer-events-none">
        <Icon
          size={36}
          style={{
            color: department.color,
            filter: isActive ? `drop-shadow(0 0 14px ${department.color})` : 'none',
          }}
          className={`mb-2 transition-all duration-300 ${isActive ? 'scale-125 opacity-100' : 'opacity-85 group-hover:scale-110'}`}
        />
        <span
          className={`text-xs md:text-sm font-extrabold text-center leading-tight transition-all duration-300 ${
            isActive ? 'text-white text-shadow-lg' : 'text-slate-200 group-hover:text-white'
          }`}
          style={{ maxWidth: '110px' }}
        >
          {department.shortLabel}
        </span>
      </div>
    </motion.button>
  );
};

interface DepartmentPanelProps {
  department: Department;
  shouldReduceMotion: boolean;
}

const DepartmentPanel: React.FC<DepartmentPanelProps> = ({ department, shouldReduceMotion }) => {
  const Icon = department.icon;

  return (
    <motion.div
      key={department.id}
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -30 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: 'easeOut',
      }}
      className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-slate-950/80 border p-8 md:p-10 min-h-[420px] flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.9)] bio-card-glow preserve-3d"
      style={{
        borderColor: `${department.color}60`,
        boxShadow: `0 0 50px ${department.color}25, 0 30px 60px rgba(0,0,0,0.9)`,
      }}
    >
      {/* Dynamic Ambient Color Beam */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-40 animate-pulse"
        style={{ backgroundColor: department.color }}
      />

      {/* Content */}
      <div className="relative z-10 preserve-3d">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="p-4 rounded-2xl backdrop-blur-md shadow-lg"
            style={{
              backgroundColor: `${department.color}30`,
              border: `1px solid ${department.color}70`,
              boxShadow: `0 0 20px ${department.color}40`,
            }}
          >
            <Icon size={32} style={{ color: department.color }} />
          </div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">{department.title}</h3>
        </div>

        {/* Description */}
        <p className="text-slate-200 leading-relaxed mb-8 text-base md:text-lg font-['Inter']">
          {department.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          {department.tags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
              className="px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md transition-all shadow-md"
              style={{
                backgroundColor: `${department.color}25`,
                color: '#ffffff',
                border: `1px solid ${department.color}70`,
                boxShadow: `0 0 15px ${department.color}25`,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Decorative bioluminescent accent */}
      <div
        className="absolute bottom-0 right-0 w-48 h-48 opacity-20 pointer-events-none rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at bottom right, ${department.color}, transparent)`,
        }}
      />
    </motion.div>
  );
};

export const OurDepartments: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-cycle logic
  useEffect(() => {
    if (shouldReduceMotion || hasInteracted || !isInView) return;

    const startCycle = () => {
      setProgress(0);
      let currentProgress = 0;

      progressRef.current = setInterval(() => {
        currentProgress += (100 / 60);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          if (progressRef.current) clearInterval(progressRef.current);
          timerRef.current = setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % departments.length);
            startCycle();
          }, 100);
        }
      }, 100);
    };

    startCycle();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeIndex, hasInteracted, isInView, shouldReduceMotion]);

  // Mouse tracking
  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  const handleInteraction = (index: number) => {
    setActiveIndex(index);
    setHasInteracted(true);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 px-4 overflow-hidden perspective-1000"
      id="departments"
    >
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2 className="text-4xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Our Departments
          </h2>
          <p className="text-lg md:text-xl text-cyan-400/90 tracking-widest font-mono uppercase">Click to Know More</p>

          {/* Quick Select Tab Bar for instant 1-click navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-3xl mx-auto">
            {departments.map((dept, index) => (
              <button
                key={dept.id}
                onClick={() => handleInteraction(index)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer backdrop-blur-md border ${
                  activeIndex === index
                    ? 'bg-slate-900 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-600 hover:text-white'
                }`}
                style={{
                  borderColor: activeIndex === index ? dept.color : undefined,
                  boxShadow: activeIndex === index ? `0 0 20px ${dept.color}60` : undefined,
                }}
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: dept.color }} />
                {dept.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-10 items-center preserve-3d">
          {/* Left: Non-Colliding Staggered Honeycomb Cluster */}
          <div className="lg:col-span-5 flex items-center justify-center py-6" role="tablist" aria-label="Department selector">
            {/* Desktop: Staggered Honeycomb Cluster with Zero Collisions */}
            <div className="hidden lg:block relative w-[440px] h-[310px] preserve-3d">
              {/* Comb 0: Events & PR (Top-Left) */}
              <div className="absolute top-0 left-0 transition-all duration-300">
                <Hexagon
                  department={departments[0]}
                  isActive={activeIndex === 0}
                  onClick={() => handleInteraction(0)}
                  index={0}
                  shouldReduceMotion={!!shouldReduceMotion}
                  progress={activeIndex === 0 ? progress : 0}
                  mousePosition={mousePosition}
                />
              </div>

              {/* Comb 2: Design & Technical (Top-Right) */}
              <div className="absolute top-0 left-[165px] transition-all duration-300">
                <Hexagon
                  department={departments[2]}
                  isActive={activeIndex === 2}
                  onClick={() => handleInteraction(2)}
                  index={2}
                  shouldReduceMotion={!!shouldReduceMotion}
                  progress={activeIndex === 2 ? progress : 0}
                  mousePosition={mousePosition}
                />
              </div>

              {/* Comb 1: Corporate & Outreach (Bottom-Left Staggered) */}
              <div className="absolute top-[138px] left-[82px] transition-all duration-300">
                <Hexagon
                  department={departments[1]}
                  isActive={activeIndex === 1}
                  onClick={() => handleInteraction(1)}
                  index={1}
                  shouldReduceMotion={!!shouldReduceMotion}
                  progress={activeIndex === 1 ? progress : 0}
                  mousePosition={mousePosition}
                />
              </div>

              {/* Comb 3: Research & Content (Bottom-Right Staggered) */}
              <div className="absolute top-[138px] left-[247px] transition-all duration-300">
                <Hexagon
                  department={departments[3]}
                  isActive={activeIndex === 3}
                  onClick={() => handleInteraction(3)}
                  index={3}
                  shouldReduceMotion={!!shouldReduceMotion}
                  progress={activeIndex === 3 ? progress : 0}
                  mousePosition={mousePosition}
                />
              </div>
            </div>

            {/* Mobile/Tablet: 2x2 Grid with Clean Gaps */}
            <div className="grid lg:hidden grid-cols-2 gap-6 max-w-md mx-auto">
              {departments.map((dept, index) => (
                <div key={dept.id} className="flex justify-center">
                  <Hexagon
                    department={dept}
                    isActive={activeIndex === index}
                    onClick={() => handleInteraction(index)}
                    index={index}
                    shouldReduceMotion={!!shouldReduceMotion}
                    progress={activeIndex === index ? progress : 0}
                    mousePosition={mousePosition}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detail Panel */}
          <div className="lg:col-span-7 relative preserve-3d">
            <AnimatePresence mode="wait">
              <DepartmentPanel
                key={departments[activeIndex].id}
                department={departments[activeIndex]}
                shouldReduceMotion={!!shouldReduceMotion}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
