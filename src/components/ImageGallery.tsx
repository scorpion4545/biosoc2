"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";
import { TiltCard3D } from "./ui/tilt-card-3d";

interface Photo {
  id: number;
  src: string;
  alt: string;
  title: string;
  story: string;
}

export const AboutSection: React.FC = () => {
  return (
    <section className="relative bg-transparent px-4 py-24 md:py-32 perspective-1000" id="about">
      <div className="mx-auto max-w-5xl preserve-3d">
        <motion.div 
          className="text-center preserve-3d"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-block mb-4 px-5 py-2 rounded-full bg-slate-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Who We Are
          </div>

          <h1 className="mb-8 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text py-3 text-4xl font-extrabold text-transparent md:mb-12 md:text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            ABOUT US
          </h1>

          <TiltCard3D maxTilt={6} scale={1.01} className="p-8 md:p-12 rounded-3xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] bio-card-glow text-left preserve-3d">
            <p className="text-base leading-relaxed text-slate-200 md:text-xl md:leading-loose font-['Inter']">
              BioSoc-DTU is the official society of the Department of Biotechnology at Delhi Technological University. 
              As an agile collective driven by passionate members, we foster a supportive environment for researchers, students, and professionals while bridging the gap between industry and academia. 
              Leveraging our members' expertise across various domains of biotechnology and natural sciences, BioSoc-DTU endeavors to inform the broader community about cutting-edge developments in biotechnology, aligning with our mission of knowledge dissemination and social impact. 
              By emphasizing the integration of biological sciences and promoting a research-oriented outlook, BioSoc-DTU enhances students' scientific aptitude through discussions, workshops, and competitions, thereby contributing to a dynamic and enriching learning experience.
            </p>
          </TiltCard3D>
        </motion.div>
      </div>
    </section>
  );
};

export const ImageGallery: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPan, setZoomPan] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // References for continuous float position and 60fps rAF loop
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const currentPosition = useRef(0);
  const targetPosition = useRef(0);
  const velocity = useRef(0);
  const activeIndexRef = useRef(0);

  // Drag Gesture Physics
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);
  const dragDistance = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const lastWheelTime = useRef(0);

  // Trigger state update to drive rAF position updates cleanly
  const [, setRenderTrigger] = useState(0);

  const photos: Photo[] = [
    {
      id: 1,
      src: "/team/1a.jpg",
      alt: "BioQuest 25 Banner - DTU",
      title: "BioQuest '25 Banner Unveiling",
      story: "The official grand unveiling of BioQuest '25 at the heart of Delhi Technological University campus, bringing together students and Biotech enthusiasts.",
    },
    {
      id: 2,
      src: "/team/2b.jpg",
      alt: "BioSoc Team Innovation",
      title: "Hackathon & Innovation Meet",
      story: "Passionate minds collaborating during our high-octane 4-hour hackathon to solve real-world biological and healthcare challenges.",
    },
    {
      id: 3,
      src: "/team/3.jpg",
      alt: "DTU Campus Team",
      title: "DTU Biotech Campus Delegation",
      story: "BioSoc-DTU council members representing the department at the university administrative quadrangle.",
    },
    {
      id: 4,
      src: "/team/3c.jpg",
      alt: "Lab Rats & Workshops",
      title: "Hands-on Technical Workshops",
      story: "Interactive practical session where members gained hands-on experience in laboratory protocols and research methodologies.",
    },
    {
      id: 5,
      src: "/team/WhatsApp Image 2025-02-03 at 20.05.06_1c062496.jpg",
      alt: "Amphitheatre Gathering",
      title: "Annual DTU Biotech Meet",
      story: "A memorable gathering of our vibrant community at the DTU amphitheatre, sharing insights, ideas, and building long-lasting connections.",
    },
  ];

  // 1. Preload & Decode ALL 5 images before presenting section (No pop-ins)
  useEffect(() => {
    setMounted(true);
    let isCurrent = true;

    const checkReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsReducedMotion(checkReducedMotion);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const preloadImages = async () => {
      try {
        await Promise.all(
          photos.map((photo) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = photo.src;
              if (img.complete) {
                if (img.decode) {
                  img.decode().then(resolve).catch(resolve);
                } else {
                  resolve(true);
                }
              } else {
                img.onload = () => {
                  if (img.decode) {
                    img.decode().then(resolve).catch(resolve);
                  } else {
                    resolve(true);
                  }
                };
                img.onerror = resolve;
              }
            });
          })
        );
      } catch {
        // Fallback gracefully
      }
      if (isCurrent) {
        setImagesLoaded(true);
      }
    };

    preloadImages();

    return () => {
      isCurrent = false;
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Lock body scroll when Lightbox Modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus Trap setup
    const focusableElements = modalContainerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      if (triggerRef.current) {
        (triggerRef.current as HTMLElement).focus();
      }
    };
  }, [isModalOpen]);

  // Glide camera to target frame index
  const glideToFrame = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(photos.length - 1, index));
    targetPosition.current = clamped;
  }, [photos.length]);

  // Keyboard navigation & accessibility listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === "Escape") {
          setIsModalOpen(false);
          setIsZoomed(false);
        } else if (e.key === "ArrowLeft") {
          setModalPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
          setIsZoomed(false);
        } else if (e.key === "ArrowRight") {
          setModalPhotoIndex((prev) => (prev + 1) % photos.length);
          setIsZoomed(false);
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        glideToFrame(activeIndexRef.current - 1);
      } else if (e.key === "ArrowRight") {
        glideToFrame(activeIndexRef.current + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, photos.length, glideToFrame]);

  // 2. Main 60fps rAF Lerp Loop (Factor ~0.07 for slow calm 1400ms glide)
  useEffect(() => {
    let animId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      if (isVisible && imagesLoaded) {
        // Momentum decay when drag ends
        if (!isDragging.current && Math.abs(velocity.current) > 0.0001) {
          targetPosition.current += velocity.current;
          velocity.current *= 0.94; // Gentle decay over ~1.5s

          if (Math.abs(velocity.current) <= 0.0005) {
            velocity.current = 0;
            // Eased snap to nearest frame
            const nearest = Math.max(0, Math.min(photos.length - 1, Math.round(targetPosition.current)));
            targetPosition.current = nearest;
          }
        }

        // Clamp target position bound
        targetPosition.current = Math.max(-0.15, Math.min(photos.length - 1 + 0.15, targetPosition.current));

        // Smooth position lerp (lerp factor ~0.07 gives calm 1400ms camera glide)
        const diff = targetPosition.current - currentPosition.current;
        if (Math.abs(diff) > 0.0001) {
          currentPosition.current = lerp(currentPosition.current, targetPosition.current, isReducedMotion ? 0.2 : 0.07);
        } else {
          currentPosition.current = targetPosition.current;
        }

        // Update active index state
        const rounded = Math.max(0, Math.min(photos.length - 1, Math.round(currentPosition.current)));
        if (rounded !== activeIndexRef.current && !isDragging.current) {
          activeIndexRef.current = rounded;
          setActiveIndex(rounded);
        }

        setRenderTrigger((prev) => prev + 1);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [imagesLoaded, isReducedMotion, photos.length]);

  // Throttled Wheel / Trackpad Scroll
  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (isModalOpen) return;
    const now = Date.now();
    if (now - lastWheelTime.current < 350) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) || Math.abs(e.deltaX) > 15) {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const step = delta > 0 ? 1 : -1;
      glideToFrame(activeIndexRef.current + step);
      lastWheelTime.current = now;
    }
  }, [isModalOpen, glideToFrame]);

  // Drag Gesture Physics Handlers (with 6px movement threshold)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isModalOpen) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartPos.current = targetPosition.current;
    dragDistance.current = 0;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = Date.now();
    velocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - dragStartX.current;
    dragDistance.current = Math.abs(deltaX);

    // Map drag pixel offset to position delta
    const sensitivity = isMobile ? 0.0035 : 0.0025;
    targetPosition.current = dragStartPos.current - deltaX * sensitivity;

    const now = Date.now();
    const dt = now - lastPointerTime.current;
    if (dt > 0) {
      const dx = e.clientX - lastPointerX.current;
      velocity.current = -dx * sensitivity * 0.4;
    }
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (Math.abs(velocity.current) < 0.008) {
      const nearest = Math.max(0, Math.min(photos.length - 1, Math.round(targetPosition.current)));
      glideToFrame(nearest);
    }
  };

  // Open Full-Screen Lightbox Portal
  const openLightbox = (index: number, e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
      triggerRef.current = e.currentTarget as HTMLElement;
    }
    setModalPhotoIndex(index);
    setIsModalOpen(true);
    setIsZoomed(false);
    setZoomPan({ x: 0, y: 0 });
  };

  // Frame height offsets for curated museum gallery hanging look
  const frameHangingOffsets = [0, -16, 12, -10, 14];

  return (
    <section 
      className="relative py-24 md:py-32 px-4 bg-transparent overflow-hidden select-none font-['Inter']" 
      id="gallery"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-4xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Life at BioSoc-DTU
          </h2>
        </div>

        {/* Quiet Background Placeholder / Skeleton until all images are decoded */}
        {!imagesLoaded ? (
          <div className="h-[480px] sm:h-[540px] md:h-[600px] w-full rounded-3xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-center backdrop-blur-md my-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80">
                Curating Museum Gallery...
              </span>
            </div>
          </div>
        ) : (
          /* ONE-TIME CALM INTRO FADE-IN (1600ms opacity 0->1 and 24px upward drift) */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
            ref={containerRef}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative h-[480px] sm:h-[540px] md:h-[600px] flex items-center justify-center my-4 cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ touchAction: "pan-y" }}
          >
            {/* Soft Ambient Spotlight Beam above center frame */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none z-0 transition-opacity duration-700"
              style={{
                background: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 75%)",
              }}
            />

            {/* THE MUSEUM WALL STAGE (CSS 3D perspective ~1800px) */}
            <div 
              className="relative w-full h-full flex items-center justify-center z-10 preserve-3d"
              style={{
                perspective: "1800px",
                transformStyle: "preserve-3d",
              }}
            >
              {photos.map((photo, index) => {
                // Derived continuous offset from center camera
                const offset = index - currentPosition.current;
                const isFocused = activeIndex === index;
                const isHovered = hoveredIndex === index;

                // Wall Spatial Geometry Math
                const stepX = isMobile ? 270 : 390;
                const translateX = offset * stepX;
                // Gentle concave curve (~6deg per step) - text stays crisp!
                const rotateY = isReducedMotion ? 0 : offset * -5.5;
                const translateZ = isReducedMotion ? 0 : -Math.pow(Math.abs(offset), 1.35) * (isMobile ? 35 : 55);
                const translateY = frameHangingOffsets[index % frameHangingOffsets.length];

                // Scale & Opacity curves
                const baseScale = Math.max(0.86, 1 - Math.abs(offset) * 0.07);
                const focusedScaleBoost = (isFocused && Math.abs(offset) < 0.25) ? (isMobile ? 1.12 : 1.25) : 1;
                const cardScale = baseScale * focusedScaleBoost;

                const cardOpacity = Math.max(0.42, 1 - Math.abs(offset) * 0.28);
                const zIndex = Math.round(100 - Math.abs(offset) * 20);

                return (
                  /* UNTRANSFORMED STATIONARY HIT-AREA WRAPPER (Prevents Hover Jitter) */
                  <div
                    key={photo.id}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={(e) => {
                      // Prevent drag gesture from triggering click
                      if (dragDistance.current < 6) {
                        if (!isFocused) {
                          glideToFrame(index);
                        } else {
                          openLightbox(index, e);
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!isFocused) {
                          glideToFrame(index);
                        } else {
                          openLightbox(index, e);
                        }
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Frame ${index + 1} of 5: ${photo.title}. ${isFocused ? "Click to open fullscreen view" : "Click to center"}`}
                    className="absolute select-none pointer-events-auto focus:outline-none"
                    style={{
                      width: isMobile ? "250px" : "370px",
                      height: isMobile ? "290px" : "390px",
                      top: "50%",
                      left: "50%",
                      marginLeft: isMobile ? "-125px" : "-185px",
                      marginTop: isMobile ? "-145px" : "-195px",
                      zIndex,
                    }}
                  >
                    {/* INNER VISUAL CONTAINER (Receives 3D Position & Hover Transforms over 500ms) */}
                    <div
                      className={`w-full h-full flex flex-col justify-between p-3.5 rounded-2xl bg-slate-950/90 border backdrop-blur-2xl bio-card-glow shadow-2xl relative transition-all duration-500 ease-out ${
                        isFocused
                          ? "border-emerald-400/90 shadow-[0_20px_60px_rgba(16,185,129,0.45)] ring-2 ring-emerald-400/30"
                          : isHovered
                          ? "border-cyan-400/80 shadow-[0_15px_40px_rgba(6,182,212,0.35)]"
                          : "border-slate-800/80 shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
                      }`}
                      style={{
                        transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${cardScale * (isHovered ? 1.02 : 1)})`,
                        opacity: cardOpacity,
                        willChange: "transform, opacity",
                      }}
                    >
                      {/* Frame Image Canvas */}
                      <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-slate-900/80 border border-slate-800/80 group">
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

                        {/* Visible Expand Button on Focused Frame */}
                        {isFocused && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="absolute top-3 right-3 z-30"
                          >
                            <button
                              type="button"
                              onClick={(e) => openLightbox(index, e)}
                              className="p-2.5 rounded-full bg-slate-950/90 border border-emerald-400/80 text-white hover:text-cyan-300 hover:scale-110 transition-all shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer"
                              title="Expand Fullscreen Museum Lightbox"
                              aria-label="Expand Fullscreen Museum Lightbox"
                            >
                              <Maximize2 className="w-4 h-4 text-emerald-400" />
                            </button>
                          </motion.div>
                        )}
                      </div>

                      {/* Museum-Style Plaque beneath Frame (Crisp Flat Text) */}
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-left px-1">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-0.5">
                          PHOTO {index + 1} / {photos.length}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm">
                          {photo.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Round Arrow Buttons & Pill Progress Dots Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mt-8 relative z-20">
          <button
            type="button"
            onClick={() => glideToFrame(activeIndex - 1)}
            disabled={activeIndex === 0}
            className={`p-3.5 rounded-full bg-slate-950/80 border transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer ${
              activeIndex === 0
                ? "border-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                : "border-emerald-500/40 text-white hover:text-emerald-300 hover:border-emerald-400 hover:scale-110"
            }`}
            aria-label="Previous Frame"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Progress Pill Dots */}
          <div className="flex items-center gap-2">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => glideToFrame(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === activeIndex
                    ? "w-8 bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_12px_#10b981]"
                    : "w-2.5 bg-slate-800 hover:bg-slate-600"
                }`}
                aria-label={`Glide to photo ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => glideToFrame(activeIndex + 1)}
            disabled={activeIndex === photos.length - 1}
            className={`p-3.5 rounded-full bg-slate-950/80 border transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer ${
              activeIndex === photos.length - 1
                ? "border-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                : "border-emerald-500/40 text-white hover:text-emerald-300 hover:border-emerald-400 hover:scale-110"
            }`}
            aria-label="Next Frame"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* FULL-SCREEN MUSEUM LIGHTBOX VIEWER PORTAL */}
      {mounted && isModalOpen && typeof window !== "undefined" && ReactDOM.createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            ref={modalContainerRef}
            onClick={() => {
              setIsModalOpen(false);
              setIsZoomed(false);
            }}
            className="fixed inset-0 h-[100dvh] w-screen z-[9999] bg-slate-950/95 backdrop-blur-3xl flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-hidden font-['Inter']"
          >
            {/* Top Bar: Counter & Close Controls */}
            <div className="flex justify-between items-center z-50 max-w-7xl w-full mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40">
                  PHOTO {modalPhotoIndex + 1} / {photos.length}
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-white truncate max-w-md hidden sm:block">
                  {photos[modalPhotoIndex].title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                    setZoomPan({ x: 0, y: 0 });
                  }}
                  className="p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isZoomed ? "Reset Zoom" : "2x Zoom"}
                  aria-label={isZoomed ? "Reset Zoom" : "2x Zoom"}
                >
                  {isZoomed ? <ZoomOut className="w-5 h-5 text-cyan-400" /> : <ZoomIn className="w-5 h-5 text-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsZoomed(false);
                  }}
                  className="p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close Lightbox Viewer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main Image Stage (Object-Fit Contain & 800ms Crossfade) */}
            <div 
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={() => {
                setIsZoomed(!isZoomed);
                setZoomPan({ x: 0, y: 0 });
              }}
              className="relative flex-1 min-h-0 w-full max-w-6xl mx-auto my-4 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950/80 border border-slate-800/80"
            >
              {/* Prev / Next Floating Navigation Overlay */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
                  setIsZoomed(false);
                }}
                className="absolute left-4 z-40 p-3 rounded-full bg-slate-950/80 border border-slate-700 text-white hover:text-emerald-400 hover:border-emerald-400 hover:scale-110 transition-all shadow-2xl cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalPhotoIndex((prev) => (prev + 1) % photos.length);
                  setIsZoomed(false);
                }}
                className="absolute right-4 z-40 p-3 rounded-full bg-slate-950/80 border border-slate-700 text-white hover:text-emerald-400 hover:border-emerald-400 hover:scale-110 transition-all shadow-2xl cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.img
                  key={modalPhotoIndex}
                  src={photos[modalPhotoIndex].src}
                  alt={photos[modalPhotoIndex].alt}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isZoomed ? 1.8 : 1,
                    x: isZoomed ? zoomPan.x : 0,
                    y: isZoomed ? zoomPan.y : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
                  className={`max-h-full max-w-full object-contain select-none transition-transform ${
                    isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                  }`}
                />
              </AnimatePresence>
            </div>

            {/* Bottom Bar: Title & Thumbnail Selector Strip */}
            <div className="z-50 max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80" onClick={(e) => e.stopPropagation()}>
              <div className="text-center sm:text-left">
                <h4 className="text-base sm:text-lg font-extrabold text-white">
                  {photos[modalPhotoIndex].title}
                </h4>
                <p className="text-xs text-slate-400 hidden md:block max-w-xl">
                  {photos[modalPhotoIndex].story}
                </p>
              </div>

              {/* Bottom Thumbnail Strip with Sliding Active Outline */}
              <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                {photos.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setModalPhotoIndex(idx);
                      setIsZoomed(false);
                    }}
                    className={`relative w-12 h-10 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                      idx === modalPhotoIndex ? "ring-2 ring-emerald-400 opacity-100 scale-105" : "opacity-50 hover:opacity-90"
                    }`}
                  >
                    <img src={p.src} alt={p.alt} className="w-full h-full object-cover" />
                    {idx === modalPhotoIndex && (
                      <motion.div 
                        layoutId="museumActiveThumb" 
                        className="absolute inset-0 border-2 border-emerald-400 rounded-xl pointer-events-none"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
