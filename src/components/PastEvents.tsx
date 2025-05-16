"use client";
import React, { useState, useEffect } from 'react';
import { DNALoader } from './ui/dna-loader';
import EventGallery from './EventGallery';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  longDescription: string;
  image: string;
  attendees: number;
  images: { url: string; caption: string; }[];
  highlights: string[];
}

const PastEvents: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Add useEffect to handle body scroll
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DNALoader />;
  }

  // Update your pastEvents array to include the new fields:
  const pastEvents: Event[] = [
    {
      id: 1,
      title: "Biotech Synergy",
      date: "February 15, 2025",
      description: "Our flagship technology conference featuring industry leaders and innovative workshops.",
      longDescription: "Biotech Synergy brought together leading researchers, industry professionals, and students for a day of cutting-edge discussions and hands-on workshops. The event featured keynote speeches from renowned experts, interactive panel discussions, and networking opportunities.",
      image: "./team/BS.jpeg",
      attendees: 1200,
      images: [
        { url: "./team/BS.jpeg", caption: "Opening ceremony with keynote speaker" },
        { url: "./team/BT.jpg", caption: "Interactive workshop session" },
        { url: "./team/LR.jpg", caption: "Networking break" },
        { url: "./team/BS.jpeg", caption: "Panel discussion" }
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
      date: "Feburary 18, 2025",
      description: "A 4-hour hackathon where teams collaborated to solve real-world problems with creative solutions.",
      longDescription: "Biothon brought together innovative minds for an intensive 4-hour hackathon focused on biotechnology solutions. Teams worked on real-world challenges, from medical diagnostics to environmental conservation.",
      image: "./team/BT.jpg",
      attendees: 350,
      images: [
        { url: "./team/BT.jpg", caption: "Teams working on their projects" },
        { url: "./team/BS.jpeg", caption: "Project presentations" },
        { url: "./team/LR.jpg", caption: "Winners announcement" },
        { url: "./team/BT.jpg", caption: "Group photo" }
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
      date: "Feburary 16, 2025",
      description: "Three days of hands-on design workshops focused on UX/UI principles and implementation.",
      longDescription: "Lab Rats workshop series provided hands-on experience in biotechnology lab techniques and experimental design. Participants learned essential skills through practical demonstrations and guided exercises.",
      image: "./team/LR.jpg",
      attendees: 180,
      images: [
        { url: "./team/LR.jpg", caption: "Workshop in progress" },
        { url: "./team/BS.jpeg", caption: "Lab demonstration" },
        { url: "./team/BT.jpg", caption: "Group activity" },
        { url: "./team/LR.jpg", caption: "Final presentation" }
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
      image: "./team/BS.jpeg",
      attendees: 150,
      images: [
        { url: "./team/BS.jpeg", caption: "Workshop introduction" },
        { url: "./team/BT.jpg", caption: "Practical session" },
        { url: "./team/LR.jpg", caption: "Equipment training" },
        { url: "./team/BS.jpeg", caption: "Closing ceremony" }
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
      image: "./team/BT.jpg",
      attendees: 200,
      images: [
        { url: "./team/BT.jpg", caption: "Opening ceremony" },
        { url: "./team/BS.jpeg", caption: "Student presentations" },
        { url: "./team/LR.jpg", caption: "Poster session" },
        { url: "./team/BT.jpg", caption: "Networking event" }
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
      image: "./team/LR.jpg",
      attendees: 280,
      images: [
        { url: "./team/LR.jpg", caption: "Summit inauguration" },
        { url: "./team/BS.jpeg", caption: "Innovation showcase" },
        { url: "./team/BT.jpg", caption: "Panel discussion" },
        { url: "./team/LR.jpg", caption: "Closing ceremony" }
      ],
      highlights: [
        "Breakthrough research presentations",
        "Innovation showcase",
        "Future trends discussion",
        "Industry collaboration opportunities"
      ]
    }
  ];

  const displayedEvents = pastEvents.slice(0, 3);

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
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium"
                >
                  View Event Gallery
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedEvent && (
        <EventGallery 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </div>
  );
};

export default PastEvents;