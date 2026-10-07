"use client";
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface EventData {
  id: number;
  title: string;
  date: string;
  description: string;
  longDescription: string;
  image: string;
  attendees: number;
  images: GalleryImage[];
  highlights: string[];
}

interface EventGalleryProps {
  event: EventData;
  allEvents?: EventData[];
  onClose: () => void;
  onSelectEvent?: (event: EventData) => void;
}

const EventGallery: React.FC<EventGalleryProps> = ({ 
  event, 
  allEvents = [], 
  onClose,
  onSelectEvent 
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset image index when event changes
  useEffect(() => {
    setSelectedImage(0);
    setIsLightboxOpen(false);
    setLightboxZoom(1);
  }, [event.id]);

  // Lock body scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Keyboard navigation & escape listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setLightboxZoom(1);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (event.images && event.images.length > 1) {
          setSelectedImage((prev) => (prev - 1 + event.images.length) % event.images.length);
        }
      } else if (e.key === 'ArrowRight') {
        if (event.images && event.images.length > 1) {
          setSelectedImage((prev) => (prev + 1) % event.images.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, event, onClose]);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!event.images || event.images.length === 0) return;
    setSelectedImage((prev) => (prev + 1) % event.images.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!event.images || event.images.length === 0) return;
    setSelectedImage((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  // In-modal event switcher
  const currentEventIdx = allEvents.findIndex(e => e.id === event.id);
  const hasMultipleEvents = allEvents.length > 1 && currentEventIdx !== -1;

  const handlePrevEvent = () => {
    if (!hasMultipleEvents || !onSelectEvent) return;
    const prevIdx = (currentEventIdx - 1 + allEvents.length) % allEvents.length;
    onSelectEvent(allEvents[prevIdx]);
  };

  const handleNextEvent = () => {
    if (!hasMultipleEvents || !onSelectEvent) return;
    const nextIdx = (currentEventIdx + 1) % allEvents.length;
    onSelectEvent(allEvents[nextIdx]);
  };

  const activeImage = event.images[selectedImage] || { url: event.image, caption: event.title };

  if (!mounted || typeof window === 'undefined') return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 h-[100dvh] w-screen z-[9999] bg-slate-950/95 backdrop-blur-3xl flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-hidden text-white font-['Inter']"
        onClick={onClose}
      >
        <motion.div 
          layoutId={`event-container-${event.id}`}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-full max-h-[92dvh] bg-slate-950/90 border border-emerald-500/30 rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] bio-card-glow flex flex-col min-h-0 overflow-hidden"
        >
          {/* Ambient Background Glow Beams */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Modal Header Bar */}
          <div className="flex-shrink-0 flex justify-between items-center pb-4 border-b border-slate-800/80 relative z-10 gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold font-mono uppercase shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <Calendar className="w-3 h-3" />
                  {event.date}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-bold font-mono uppercase">
                  <Users className="w-3 h-3" />
                  {event.attendees} Attendees
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-transparent truncate">
                {event.title}
              </h2>
            </div>

            {/* Close Button & Header Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasMultipleEvents && (
                <div className="hidden sm:flex items-center bg-slate-900/90 border border-slate-800 rounded-full p-1 shadow-md">
                  <button 
                    onClick={handlePrevEvent}
                    className="p-1.5 rounded-full text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition-all cursor-pointer"
                    title="Previous Event"
                    aria-label="Previous Event"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-mono text-slate-400">
                    {currentEventIdx + 1}/{allEvents.length}
                  </span>
                  <button 
                    onClick={handleNextEvent}
                    className="p-1.5 rounded-full text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition-all cursor-pointer"
                    title="Next Event"
                    aria-label="Next Event"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <button 
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-400/60 hover:bg-slate-800 transition-all cursor-pointer shadow-lg flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Content: 100dvh Desktop Grid / Mobile Single Scroll */}
          <div className="flex-1 min-h-0 pt-4 relative z-10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 overflow-y-auto lg:overflow-hidden">
              
              {/* Left Column (~60% on Desktop): Gallery Stage & Thumbnails */}
              <div className="lg:col-span-7 flex flex-col h-full min-h-0 space-y-3">
                
                {/* Gallery Stage Viewer */}
                <div className="relative flex-1 min-h-[220px] sm:min-h-[280px] lg:min-h-0 bg-slate-900/60 border border-slate-800/90 rounded-2xl overflow-hidden flex items-center justify-center group">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={selectedImage}
                      src={activeImage.url} 
                      alt={activeImage.caption}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.03 }}
                      transition={{ duration: 0.25 }}
                      className="max-h-full max-w-full object-contain p-2 cursor-zoom-in"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  </AnimatePresence>

                  {/* Gradient Lightbox Trigger overlay */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 border border-cyan-400/40 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer shadow-lg z-20"
                    title="Click to Zoom Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Image Caption & Counter Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/85 backdrop-blur-md border-t border-white/10 flex justify-between items-center z-20">
                    <p className="text-slate-200 text-xs font-medium truncate max-w-[80%]">
                      {activeImage.caption}
                    </p>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30">
                      {selectedImage + 1} / {event.images.length}
                    </span>
                  </div>

                  {/* Navigation Prev/Next Arrows */}
                  {event.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/85 border border-emerald-400/40 text-white hover:text-emerald-300 transition-all cursor-pointer shadow-lg z-20"
                        aria-label="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/85 border border-emerald-400/40 text-white hover:text-emerald-300 transition-all cursor-pointer shadow-lg z-20"
                        aria-label="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Pinned Thumbnail Strip Below Stage */}
                {event.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2.5 flex-shrink-0">
                    {event.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 focus:outline-none cursor-pointer group"
                      >
                        <img 
                          src={img.url} 
                          alt={img.caption}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            selectedImage === idx ? 'opacity-100' : 'opacity-50 group-hover:opacity-85'
                          }`}
                        />
                        {selectedImage === idx && (
                          <motion.div
                            layoutId={`thumb-active-ring-${event.id}`}
                            className="absolute inset-0 border-2 border-emerald-400 rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.7)] pointer-events-none"
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column (~40% on Desktop): Glass Info Panel with Internal Scroll */}
              <div className="lg:col-span-5 flex flex-col h-full min-h-0 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 overflow-y-auto custom-scrollbar justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                      About Event
                    </h3>
                    <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-['Inter']">
                      {event.longDescription}
                    </p>
                  </div>

                  {event.highlights && event.highlights.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Event Highlights
                      </h3>
                      <ul className="space-y-2.5">
                        {event.highlights.map((highlight, index) => (
                          <motion.li 
                            key={index}
                            initial={{ x: -12, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.07, duration: 0.3 }}
                            className="flex items-start text-slate-200 text-xs sm:text-sm leading-snug"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 mr-2.5 flex-shrink-0" />
                            <span>{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom In-Modal Event Switcher Pill Navigation */}
                {hasMultipleEvents && (
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex justify-between items-center">
                    <button
                      onClick={handlePrevEvent}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous Event
                    </button>
                    <span className="text-[11px] font-mono text-cyan-400">
                      {currentEventIdx + 1} / {allEvents.length}
                    </span>
                    <button
                      onClick={handleNextEvent}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-all cursor-pointer"
                    >
                      Next Event <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.div>

        {/* High-Resolution Click-to-Zoom Lightbox Overlay */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-slate-950/98 backdrop-blur-3xl flex flex-col justify-between p-4 md:p-8 overflow-hidden"
              onClick={() => setIsLightboxOpen(false)}
            >
              {/* Lightbox Top Controls */}
              <div className="flex justify-between items-center z-20" onClick={(e) => e.stopPropagation()}>
                <div className="text-white">
                  <h4 className="font-bold text-sm sm:text-base text-emerald-300">{event.title}</h4>
                  <p className="text-xs text-slate-400">{activeImage.caption}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.5))}
                    className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-cyan-400">{Math.round(lightboxZoom * 100)}%</span>
                  <button
                    onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.5))}
                    className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLightboxZoom(1)}
                    className="p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2.5 rounded-full bg-slate-900 border border-emerald-500/50 text-white hover:bg-slate-800 cursor-pointer shadow-lg ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Container */}
              <div 
                className="flex-1 flex items-center justify-center relative my-4 overflow-auto cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  src={activeImage.url}
                  alt={activeImage.caption}
                  animate={{ scale: lightboxZoom }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-cyan-500/20"
                />
              </div>

              {/* Lightbox Footer Caption & Counter */}
              <div className="flex justify-between items-center text-xs text-slate-400 z-20 border-t border-slate-800 pt-3" onClick={(e) => e.stopPropagation()}>
                <span>Use mouse wheel or buttons to zoom. Press Esc to exit.</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {selectedImage + 1} / {event.images.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default EventGallery;