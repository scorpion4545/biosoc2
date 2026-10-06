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
    color: '#C7822B',
    icon: Calendar,
  },
  {
    id: 2,
    title: 'Corporate & Outreach',
    shortLabel: 'Corporate & Outreach',
    description: 'The corporate department maintains and expands the society\'s relations with its corporate partners. It brings in the corporate patronage needed for the society\'s events and helps bridge the gap between academia and industry.',
    tags: ['Partnerships', 'Sponsorship', 'Industry Links'],
    color: '#1E7FC0',
    icon: Briefcase,
  },
  {
    id: 3,
    title: 'Design & Technical',
    shortLabel: 'Design & Technical',
    description: 'The design department is the driving force behind the society\'s technically-demanding endeavors, such as designing social media posts, attractive posters, and executing other technical tasks with precision and speed.',
    tags: ['Posters', 'Social Media', 'Execution'],
    color: '#2DD4BF',
    icon: Palette,
  },
  {
    id: 4,
    title: 'Research & Content',
    shortLabel: 'Research & Content',
    description: 'The content department manages the posts and articles BioSoc-DTU shares on Instagram, LinkedIn and other platforms for a growing audience of biotech enthusiasts, and handles the ideation of all content.',
    tags: ['Articles', 'Ideation', 'Social Media'],
    color: '#3BB04A',
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
    
    const deltaX = (mousePosition.x - centerX) / 100;
    const deltaY = (mousePosition.y - centerY) / 100;
    
    setTilt({ x: deltaY * -1, y: deltaX });
  }, [mousePosition, shouldReduceMotion]);

  const Icon = department.icon;
  const size = 220; // Increased by ~30%
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = size / 2 + (size / 2) * Math.cos(angle);
    const y = size / 2 + (size / 2) * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <motion.button
      ref={hexRef}
      onClick={onClick}
      className="relative focus:outline-none group"
      style={{
        width: size,
        height: size,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateX: shouldReduceMotion ? 0 : tilt.x,
        rotateY: shouldReduceMotion ? 0 : tilt.y,
      }}
      transition={{
        delay: index * 0.1,
        duration: shouldReduceMotion ? 0 : 0.5,
        rotateX: { duration: 0.3 },
        rotateY: { duration: 0.3 },
      }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -5 }}
      aria-selected={isActive}
      role="tab"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        <defs>
          <linearGradient id={`grad-${department.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={department.color} stopOpacity={isActive ? 0.3 : 0.05} />
            <stop offset="100%" stopColor={department.color} stopOpacity={isActive ? 0.15 : 0.02} />
          </linearGradient>
          <filter id={`glow-${department.id}`}>
            <feGaussianBlur stdDeviation={isActive ? 4 : 2} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* Progress ring */}
          <circle
            id={`progress-path-${department.id}`}
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) + 8}
            fill="none"
            strokeWidth="2"
          />
        </defs>
        
        {/* Progress ring (only for active) */}
        {isActive && progress > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) + 8}
            fill="none"
            stroke={department.color}
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              pathLength: progress / 100,
              rotate: -90,
              transformOrigin: 'center',
            }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress / 100 }}
            transition={{ duration: 0.1, ease: 'linear' }}
          />
        )}

        {/* Hexagon */}
        <polygon
          points={points}
          fill={`url(#grad-${department.id})`}
          stroke={department.color}
          strokeWidth={isActive ? 2 : 1}
          filter={`url(#glow-${department.id})`}
          className="transition-all duration-300"
        />
        
        {/* Breathing pulse on active */}
        {isActive && !shouldReduceMotion && (
          <motion.polygon
            points={points}
            fill="none"
            stroke={department.color}
            strokeWidth="1"
            opacity="0.5"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'center' }}
          />
        )}
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <Icon
          size={32}
          style={{ color: department.color }}
          className={`mb-2 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
        />
        <span
          className={`text-xs font-semibold text-center leading-tight transition-all duration-300 ${
            isActive ? 'text-white' : 'text-slate-400'
          }`}
          style={{ maxWidth: '90px' }}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut',
      }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-slate-900/60 border p-8 min-h-[400px] flex flex-col"
      style={{
        borderColor: `${department.color}40`,
        boxShadow: `0 0 40px ${department.color}20, 0 20px 40px rgba(0,0,0,0.3)`,
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${department.color} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="p-3 rounded-xl backdrop-blur-sm"
            style={{
              backgroundColor: `${department.color}20`,
              border: `1px solid ${department.color}40`,
            }}
          >
            <Icon size={28} style={{ color: department.color }} />
          </div>
          <h3 className="text-3xl font-bold text-white">{department.title}</h3>
        </div>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed mb-6 text-base">
          {department.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {department.tags.map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: shouldReduceMotion ? 0 : 0.2 }}
              className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
              style={{
                backgroundColor: `${department.color}20`,
                color: department.color,
                border: `1px solid ${department.color}40`,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Decorative corner accent */}
      <div
        className="absolute bottom-0 right-0 w-32 h-32 opacity-10"
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
        currentProgress += (100 / 60); // 6 seconds = 60 frames
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

  // Mouse position tracking for tilt effect
  useEffect(() => {
    if (shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleInteraction((activeIndex - 1 + departments.length) % departments.length);
      } else if (e.key === 'ArrowRight') {
        handleInteraction((activeIndex + 1) % departments.length);
      } else if (e.key === 'ArrowUp') {
        handleInteraction(activeIndex - 2 >= 0 ? activeIndex - 2 : activeIndex);
      } else if (e.key === 'ArrowDown') {
        handleInteraction(activeIndex + 2 < departments.length ? activeIndex + 2 : activeIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

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
      className="relative min-h-screen py-20 px-4 overflow-hidden bg-slate-950"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2 className="text-4xl md:text-7xl font-bold bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-transparent mb-4">
            Our Departments
          </h2>
          <p className="text-xl text-gray-400">Click to Know More</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Honeycomb Hexagons */}
          <div className="relative flex items-center justify-center lg:justify-end" role="tablist" aria-label="Department selector">
            {/* Desktop: Honeycomb Layout */}
            <div className="hidden lg:grid grid-cols-2 gap-2 w-fit relative" style={{ perspective: 1000 }}>
              {/* Top row - offset */}
              <div style={{ marginLeft: '110px', marginBottom: '-30px' }}>
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
              <div style={{ marginBottom: '-30px' }}>
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
              {/* Bottom row */}
              <div>
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
              <div style={{ marginLeft: '-110px' }}>
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

            {/* Mobile/Tablet: 2x2 Grid */}
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
          <div className="relative">
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
