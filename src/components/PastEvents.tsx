"use client";
import React, { useState, useEffect } from 'react';
import { DNALoader } from './ui/dna-loader';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  attendees: number;
}

const PastEvents: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DNALoader />;
  }

  const pastEvents: Event[] = [
    {
      id: 1,
      title: "Biotech Synergy",
      date: "Feburary 15, 2025",
      description: "Our flagship technology conference featuring industry leaders and innovative workshops.",
      image: "./team/BS.jpeg",
      attendees: 1200
    },
    {
      id: 2,
      title: "Biothon",
      date: "Feburary 18, 2025",
      description: "A 4-hour hackathon where teams collaborated to solve real-world problems with creative solutions.",
      image: "./team/BT.jpg",
      attendees: 350
    },
    {
      id: 3,
      title: "Lab Rats",
      date: "Feburary 16, 2025",
      description: "Three days of hands-on design workshops focused on UX/UI principles and implementation.",
      image: "./team/LR.jpg",
      attendees: 180
    }, // Added missing comma here
    {
      id: 4,
      title: "BioTech Workshop",
      date: "January 25, 2025",
      description: "Intensive workshop on advanced biotechnology techniques and laboratory practices.",
      image: "./team/BS.jpeg",
      attendees: 150
    },
    {
      id: 5,
      title: "Research Symposium",
      date: "January 10, 2025",
      description: "Student research presentations and networking with industry professionals.",
      image: "./team/BT.jpg",
      attendees: 200
    },
    {
      id: 6,
      title: "Innovation Summit",
      date: "December 15, 2024",
      description: "Showcasing breakthrough research and innovations in biotechnology.",
      image: "./team/LR.jpg",
      attendees: 280
    }
  ];

  const displayedEvents: Event[] = showAllEvents ? pastEvents : pastEvents.slice(0, 3);

  return (
    <div className="py-16 bg-transparent text-gray-100" id="past-events">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-8">
            Past Events
          </h2>
          <p className="text-xl text-gray-300">
            Relive our most memorable moments
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {displayedEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-gray-800 rounded-xl overflow-hidden"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {event.date}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <div className="flex items-center text-gray-500 mb-6">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>{event.attendees} Attendees</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium">
                  View Event Gallery
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => setShowAllEvents(!showAllEvents)}
            className="group relative inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gray-800 border border-purple-500 rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-700"
          >
            <span className="relative z-10">
              {showAllEvents ? 'Show Less Events' : 'Explore All Past Events'}
            </span>
            <span className="absolute inset-0 w-full bg-purple-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></span>
            <svg className="ml-2 w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastEvents;