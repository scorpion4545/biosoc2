"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, ArrowRight, Calendar } from 'lucide-react';
import { DNALoader } from './ui/dna-loader';
import EventGallery, { EventData } from './EventGallery';
import { TiltCard3D } from './ui/tilt-card-3d';

const pastEvents: EventData[] = [
  {
    id: 1,
    title: "Biotech Synergy",
    date: "February 15, 2025",
    description: "Our flagship technology conference featuring industry leaders and innovative workshops.",
    longDescription: "Biotech Synergy brought together leading researchers, industry professionals, and students for a day of cutting-edge discussions and hands-on workshops. The event featured keynote speeches from renowned experts, interactive panel discussions, and networking opportunities.",
    image: "/team/BS.jpeg",
    attendees: 1200,
    images: [
      { url: "/team/BS.jpeg", caption: "Opening ceremony with keynote speaker" },
      { url: "/team/BT.jpg", caption: "Interactive workshop session" },
      { url: "/team/LR.jpg", caption: "Networking break" },
      { url: "/team/BS.jpeg", caption: "Panel discussion" }
    ],
    highlights: [
      "Keynote speech by Dr. Sarah Chen on CRISPR applications",
      "Interactive workshop on biotechnology techniques",
      "Student research poster presentations",
      "Industry networking session"
    ]
  },
  {
    id: 2,
    title: "Biothon",
    date: "February 18, 2025",
    description: "A 4-hour hackathon where teams collaborated to solve real-world problems with creative solutions.",
    longDescription: "Biothon brought together innovative minds for an intensive 4-hour hackathon focused on biotechnology solutions. Teams worked on real-world challenges, from medical diagnostics to environmental conservation.",
    image: "/team/BT.jpg",
    attendees: 350,
    images: [
      { url: "/team/BT.jpg", caption: "Teams working on their projects" },
      { url: "/team/BS.jpeg", caption: "Project presentations" },
      { url: "/team/LR.jpg", caption: "Winners announcement" },
      { url: "/team/BT.jpg", caption: "Group photo" }
    ],
    highlights: [
      "12 teams participated in the challenge",
      "Projects focused on sustainable biotechnology",
      "Live mentoring sessions",
      "Prizes worth $5000 distributed"
    ]
  },
  {
    id: 3,
    title: "Lab Rats",
    date: "February 16, 2025",
    description: "Three days of hands-on design workshops focused on UX/UI principles and implementation.",
    longDescription: "Lab Rats workshop series provided hands-on experience in biotechnology lab techniques and experimental design. Participants learned essential skills through practical demonstrations and guided exercises.",
    image: "/team/LR.jpg",
    attendees: 180,
    images: [
      { url: "/team/LR.jpg", caption: "Workshop in progress" },
      { url: "/team/BS.jpeg", caption: "Lab demonstration" },
      { url: "/team/BT.jpg", caption: "Group activity" },
      { url: "/team/LR.jpg", caption: "Final presentation" }
    ],
    highlights: [
      "Hands-on laboratory techniques",
      "Safety protocols and best practices",
      "Data analysis workshops",
      "Research methodology training"
    ]
  },
  {
    id: 4,
    title: "BioTech Workshop",
    date: "January 25, 2025",
    description: "Intensive workshop on advanced biotechnology techniques and laboratory practices.",
    longDescription: "An intensive one-day workshop covering advanced biotechnology techniques and modern laboratory practices. Experts shared insights on cutting-edge methodologies and emerging trends.",
    image: "/team/BS.jpeg",
    attendees: 150,
    images: [
      { url: "/team/BS.jpeg", caption: "Workshop introduction" },
      { url: "/team/BT.jpg", caption: "Practical session" },
      { url: "/team/LR.jpg", caption: "Equipment training" },
      { url: "/team/BS.jpeg", caption: "Closing ceremony" }
    ],
    highlights: [
      "Advanced biotechnology techniques",
      "Modern laboratory equipment training",
      "Industry best practices",
      "Networking with experts"
    ]
  },
  {
    id: 5,
    title: "Research Symposium",
    date: "January 10, 2025",
    description: "Student research presentations and networking with industry professionals.",
    longDescription: "The Research Symposium brought together students and industry professionals for a day of knowledge sharing and networking. Students presented their research findings to industry experts.",
    image: "/team/BT.jpg",
    attendees: 200,
    images: [
      { url: "/team/BT.jpg", caption: "Opening ceremony" },
      { url: "/team/BS.jpeg", caption: "Student presentations" },
      { url: "/team/LR.jpg", caption: "Poster session" },
      { url: "/team/BT.jpg", caption: "Networking event" }
    ],
    highlights: [
      "Student research presentations",
      "Industry expert feedback",
      "Networking opportunities",
      "Best presentation awards"
    ]
  },
  {
    id: 6,
    title: "Innovation Summit",
    date: "December 15, 2024",
    description: "Showcasing breakthrough research and innovations in biotechnology.",
    longDescription: "The Innovation Summit showcased the latest breakthroughs in biotechnology research and development. Industry leaders shared insights on future trends and opportunities.",
    image: "/team/LR.jpg",
    attendees: 280,
    images: [
      { url: "/team/LR.jpg", caption: "Summit inauguration" },
      { url: "/team/BS.jpeg", caption: "Innovation showcase" },
      { url: "/team/BT.jpg", caption: "Panel discussion" },
      { url: "/team/LR.jpg", caption: "Closing ceremony" }
    ],
    highlights: [
      "Breakthrough research presentations",
      "Innovation showcase",
      "Future trends discussion",
      "Industry collaboration opportunities"
    ]
  }
];

const PastEvents: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [eventsList, setEventsList] = useState<EventData[]>(pastEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [canHover, setCanHover] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);

  const [stepWidth, setStepWidth] = useState<number>(370);

  useEffect(() => {
    const updateStep = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) setStepWidth(314);
      else if (window.innerWidth < 768) setStepWidth(348);
      else setStepWidth(378);
    };
    updateStep();
    window.addEventListener('resize', updateStep);
    return () => window.removeEventListener('resize', updateStep);
  }, []);

  // Fetch past events dynamically from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchPastEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/events?type=past');
        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.length > 0) {
            const mapped: EventData[] = json.data.map((item: any, idx: number) => ({
              id: item._id || idx + 1,
              title: item.title,
              date: item.date,
              description: item.description,
              longDescription: item.longDescription || item.description,
              image: item.coverImage,
              attendees: item.attendees || 100,
              images: (item.images && item.images.length > 0) ? item.images : [{ url: item.coverImage, caption: item.title }],
              highlights: (item.highlights && item.highlights.length > 0) ? item.highlights : ['Event highlight session']
            }));
            if (isMounted) setEventsList(mapped);
          }
        }
      } catch (e) {
        // Fall back gracefully to default list
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchPastEvents();
    return () => { isMounted = false; };
  }, []);

  // Motion values for subtle pendulum sway physics
  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 300, damping: 25 });
  const swingAngle = useTransform(springX, [-200, 0, 200], isReducedMotion ? [0, 0, 0] : [2, 0, -2]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    if (typeof window !== 'undefined') {
      setCanHover(window.matchMedia('(hover: hover)').matches);
    }

    const handleMediaChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Keyboard arrow keys listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedEvent) return; // Ignore if modal is open
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(pastEvents.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent]);

  // Mouse wheel Y delta conversion to horizontal step navigation
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (selectedEvent) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 260) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 18) {
      if (e.deltaY > 0) {
        setActiveIndex((prev) => Math.min(pastEvents.length - 1, prev + 1));
        lastScrollTime.current = now;
      } else {
        setActiveIndex((prev) => Math.max(0, prev - 1));
        lastScrollTime.current = now;
      }
    }
  }, [selectedEvent]);

  if (loading) {
    return <DNALoader />;
  }

  const handlePrev = () => setActiveIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setActiveIndex((prev) => Math.min(eventsList.length - 1, prev + 1));

  return (
    <div 
      className="py-20 sm:py-24 bg-transparent text-slate-100 overflow-hidden relative font-['Inter']" 
      id="past-events"
      onWheel={handleWheel}
    >
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 sm:mb-14">
        <motion.h2 
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 py-3 bg-clip-text text-center text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          Past Events
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl text-slate-300 font-['Space_Grotesk'] tracking-wide"
        >
          Relive our most memorable moments
        </motion.p>
      </div>

      {/* Decorative Thin Rope Line (Low Z-Index, Top Spacing) */}
      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="relative w-full h-6 mb-3 pointer-events-none z-0 opacity-40">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 30">
            <defs>
              <linearGradient id="ropeGradSubtle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <motion.path 
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              d="M 0,10 Q 500,22 1000,10"
              fill="none"
              stroke="url(#ropeGradSubtle)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Sleek Centered Horizontal Cards Carousel with Drag on ALL Cards */}
        <div 
          className="relative overflow-hidden py-4 touch-pan-y" 
          ref={containerRef}
          style={{ touchAction: 'pan-y' }}
        >
          <motion.div 
            drag="x"
            dragConstraints={{ 
              left: -(eventsList.length - 1) * stepWidth - 80, 
              right: 80 
            }}
            dragElastic={0.12}
            animate={{ x: -activeIndex * stepWidth }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 26,
            }}
            onDrag={(_, info) => {
              dragX.set(info.offset.x);
            }}
            onDragEnd={(_, info) => {
              const swipeThreshold = 35;
              const velocityThreshold = 140;
              if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                setActiveIndex((prev) => Math.min(eventsList.length - 1, prev + 1));
              } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                setActiveIndex((prev) => Math.max(0, prev - 1));
              }
              dragX.set(0);
            }}
            className="flex items-stretch cursor-grab active:cursor-grabbing select-none"
            style={{
              paddingLeft: `calc(50% - ${stepWidth / 2}px)`,
              paddingRight: `calc(50% - ${stepWidth / 2}px)`,
            }}
          >
            {eventsList.map((event, index) => {
              const offset = index - activeIndex;
              const isCenter = offset === 0;

              // Scale & opacity calculation (cards hang perfectly straight at rest)
              const cardScale = isCenter ? 1 : Math.max(0.9, 1 - Math.abs(offset) * 0.08);
              const cardOpacity = isCenter ? 1 : Math.max(0.65, 1 - Math.abs(offset) * 0.25);
              const zIndex = 20 - Math.abs(offset) * 3;

              return (
                <motion.div
                  key={event.id}
                  layoutId={`event-container-${event.id}`}
                  animate={{
                    scale: cardScale,
                    opacity: cardOpacity,
                  }}
                  style={{
                    rotateZ: isReducedMotion ? 0 : swingAngle,
                    zIndex,
                    width: `${stepWidth - 28}px`,
                    marginRight: '28px',
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                  className="relative flex-shrink-0 transition-shadow duration-300 pointer-events-auto"
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(index);
                    }
                  }}
                >
                  {/* Gentle Clip Hanger Accent */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none opacity-80">
                    <div className="w-3.5 h-3.5 rounded-full border border-emerald-400/80 bg-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="w-0.5 h-2.5 bg-cyan-400/80" />
                  </div>

                  {/* Sleek Event Card Shell */}
                  <TiltCard3D 
                    maxTilt={canHover && !isReducedMotion ? 3 : 0}
                    scale={1}
                    glareColor="rgba(6, 182, 212, 0.25)"
                    className={`border transition-all duration-300 rounded-3xl bg-slate-950/85 backdrop-blur-2xl bio-card-glow flex flex-col justify-between h-full overflow-hidden ${
                      isCenter 
                        ? 'border-emerald-500/50 shadow-[0_20px_50px_rgba(16,185,129,0.2)]' 
                        : 'border-slate-800/80 shadow-md'
                    }`}
                  >
                    <div>
                      {/* Image Stage */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-t-3xl bg-slate-900">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        {/* High-Contrast Crystal Clear Date Tag */}
                        <div className="absolute top-4 left-4 bg-slate-950/90 border border-emerald-400 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.6)] backdrop-blur-xl flex items-center gap-1.5 z-10">
                          <Calendar className="w-3 h-3 text-emerald-400" />
                          <span>{event.date}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 sm:p-6 pb-2">
                        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 group-hover:text-cyan-300 transition-colors truncate">
                          {event.title}
                        </h3>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
                          {event.description}
                        </p>

                        <div className="flex items-center text-cyan-400 text-xs sm:text-sm font-semibold mb-2">
                          <Users className="w-4 h-4 mr-2 text-cyan-400 flex-shrink-0" />
                          <span>{event.attendees} Attendees</span>
                        </div>
                      </div>
                    </div>

                    {/* REDESIGNED SLEEK PILL BUTTON (PART 3) */}
                    <div className="p-5 sm:p-6 pt-2 mt-auto">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="group relative w-full h-11 px-5 rounded-full bg-slate-900/60 border border-emerald-500/40 hover:border-cyan-400/80 text-cyan-300 text-xs sm:text-sm font-bold flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer overflow-hidden"
                      >
                        {/* Hover Fill Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        
                        <span className="relative z-10 font-mono tracking-wide">View Event Gallery</span>
                        <ArrowRight className="relative z-10 w-4 h-4 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </button>
                    </div>
                  </TiltCard3D>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Minimal Progress Indicator & Prev/Next Arrows */}
        <div className="flex items-center justify-between max-w-md mx-auto mt-8 px-4 relative z-10">
          <button 
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 transition-all shadow-lg flex-shrink-0 ${
              activeIndex === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:text-white hover:border-emerald-400/60 hover:bg-slate-800 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
            aria-label="Previous Event Card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Progress Indicator Dots */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {eventsList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx 
                      ? 'w-7 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]' 
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Go to event ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider uppercase">
              Event {activeIndex + 1} of {eventsList.length}
            </span>
          </div>

          <button 
            onClick={handleNext}
            disabled={activeIndex === eventsList.length - 1}
            className={`p-3 rounded-full bg-slate-900 border border-slate-700 text-slate-300 transition-all shadow-lg flex-shrink-0 ${
              activeIndex === pastEvents.length - 1 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:text-white hover:border-emerald-400/60 hover:bg-slate-800 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
            aria-label="Next Event Card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Upgraded Portal-Based Full-Screen Detail View */}
      {selectedEvent && (
        <EventGallery 
          event={selectedEvent} 
          allEvents={pastEvents}
          onClose={() => setSelectedEvent(null)}
          onSelectEvent={(evt) => setSelectedEvent(evt)}
        />
      )}
    </div>
  );
};

export default PastEvents;