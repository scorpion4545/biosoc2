"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GalleryImage {
  url: string;
  caption: string;
}

interface EventGalleryProps {
  event: {
    id: number;
    title: string;
    date: string;
    description: string;
    longDescription: string;
    image: string;  // Add this line
    attendees: number;  // Add this line
    images: GalleryImage[];
    highlights: string[];
  };
  onClose: () => void;
}

const EventGallery: React.FC<EventGalleryProps> = ({ event, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50"
    >
      <div className="relative h-screen overflow-y-auto">
        <button 
          onClick={onClose}
          className="fixed top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-50"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {event.title}
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-xl mb-8"
          >
            {event.date}
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-gray-300 text-lg leading-relaxed">
                {event.longDescription}
              </p>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Event Highlights</h3>
                <ul className="space-y-2">
                  {event.highlights.map((highlight, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center text-gray-300"
                    >
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img 
                  src={event.images[selectedImage].url} 
                  alt={event.images[selectedImage].caption}
                  className="w-full h-full object-cover"
                />
                <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-sm">
                  {event.images[selectedImage].caption}
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {event.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={image.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventGallery;