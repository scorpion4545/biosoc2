"use client";
import React from 'react';

const PastEvents = () => {
  // Sample past events data
  const pastEvents = [
    {
      id: 1,
      title: "Biotech Synergy",
      date: "Feburary 15, 2025",
      description: "Our flagship technology conference featuring industry leaders and innovative workshops.",
      image: "./team/dog.jpg",
      attendees: 1200
    },
    {
      id: 2,
      title: "Biothon",
      date: "Feburary 18, 2025",
      description: "A 4-hour hackathon where teams collaborated to solve real-world problems with creative solutions.",
      image: "./team/dog.jpg",
      attendees: 350
    },
    {
      id: 3,
      title: "Lab Rats",
      date: "Feburary 16, 2025",
      description: "Three days of hands-on design workshops focused on UX/UI principles and implementation.",
      image: "./team/cat.jpg",
      attendees: 180
    }
  ];

  return (
    <div className="py-16 bg-transparent text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
        <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text   . justify-center text-center  text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
                Past Events
            </h2>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300">
            Relive our most memorable moments
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {pastEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-gray-800 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
                <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                  View Event Gallery
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="group relative inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gray-800 border border-purple-500 rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-700">
            <span className="relative z-10">Explore All Past Events</span>
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