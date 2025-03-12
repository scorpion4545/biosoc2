import React, { useState, useEffect } from 'react';

// Event Card Component
const EventCard = ({ event, isSelected, onSelect }) => {
  return (
    <div 
      className={`relative bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
        isSelected 
          ? 'fixed inset-0 z-50 scale-100 from-blue-900 to-purple-900' 
          : 'from-gray-900 to-gray-800'
      } rounded-xl overflow-hidden shadow-lg`}
      style={{
        minHeight: isSelected ? '100vh' : '300px',
        height: isSelected ? '100vh' : '300px',
      }}
      onClick={() => onSelect(event.id)}
    >
      {/* Image Section */}
      <div className={`${isSelected ? 'h-[50vh]' : 'h-full'} relative`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-10"></div>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Date and Category badges */}
        <div className="absolute top-6 right-6 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full z-20">
          {event.date}
        </div>
        
        <div className="absolute top-6 left-6 bg-gray-800 bg-opacity-80 text-blue-400 text-xs font-medium px-2 py-1 rounded-md z-20 flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
          {event.category}
        </div>
      </div>

      {/* Content Section */}
      <div className={`absolute left-0 right-0 p-6 z-20 ${
        isSelected 
          ? 'top-[45vh] bottom-0 overflow-y-auto bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/80' 
          : 'bottom-0'
      }`}>
        <div className="max-w-4xl mx-auto">
          <h3 className={`text-white font-bold ${
            isSelected ? 'text-3xl mb-4' : 'text-xl mb-2'
          }`}>{event.title}</h3>
          
          <div className="flex items-center mb-3">
            <span className="text-gray-300 text-sm">{event.location}</span>
          </div>
          
          {isSelected ? (
            <div className="space-y-8">
              <p className="text-gray-300 text-base">{event.description}</p>
              
              {event.speakers && (
                <div>
                  <h4 className="text-white text-xl font-semibold mb-3">Speakers</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.speakers.map((speaker, idx) => (
                      <div key={idx} className="flex items-center bg-gray-800/60 rounded-full px-3 py-1.5">
                        <span className="text-white text-sm">{speaker.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.schedule && (
                <div>
                  <h4 className="text-white text-xl font-semibold mb-3">Schedule</h4>
                  <div className="space-y-2">
                    {event.schedule.map((item, idx) => (
                      <div key={idx} className="flex border-l-2 border-blue-500 pl-3">
                        <div className="text-blue-400 text-sm font-medium w-20">{item.time}</div>
                        <div className="text-gray-300 text-sm">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors">
                Register Now
              </button>
            </div>
          ) : (
            <p className="text-gray-300 text-sm">
              {event.description.substring(0, 80)}...
              <span className="text-blue-400 ml-1">Click to see more</span>
            </p>
          )}
        </div>
      </div>

      {/* Close button */}
      {isSelected && (
        <button
          className="absolute top-6 right-6 z-50 bg-gray-800/50 hover:bg-gray-800 p-3 rounded-full text-white"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(null);
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Main Events Section Component
const UpcomingEventsSection = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [visibleEvents, setVisibleEvents] = useState([]);
  
  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2025",
      date: "Mar 15, 2025",
      location: "Innovation Center, Building B",
      category: "Technology",
      description: "Join industry leaders for an immersive day exploring cutting-edge technologies and digital transformation strategies.",
      image: "./team/cat.jpg",
      speakers: [
        { name: "Dr. Eliza Chen", role: "AI Researcher" },
        { name: "Marcus Johnson", role: "Blockchain Expert" }
      ],
      schedule: [
        { time: "09:00 AM", activity: "Registration & Breakfast" },
        { time: "10:00 AM", activity: "Keynote: The Future of Technology" },
        { time: "12:00 PM", activity: "Networking Lunch" }
      ]
    },
    {
      id: 2,
      title: "Design Thinking Workshop",
      date: "Apr 5, 2025",
      location: "Creative Hub, Floor 3",
      category: "Design",
      description: "A comprehensive workshop exploring principles of thoughtful and functional design with practical exercises and expert guidance.",
      image: "./team/cat.jpg",
      speakers: [
        { name: "Alex Rivera", role: "UX Director" },
        { name: "Priya Patel", role: "Product Designer" }
      ],
      schedule: [
        { time: "10:00 AM", activity: "Introduction to Design Thinking" },
        { time: "11:30 AM", activity: "Problem Definition Exercise" },
        { time: "02:00 PM", activity: "Prototyping Workshop" }
      ]
    },
    {
      id: 3,
      title: "Communication Masterclass",
      date: "Apr 18, 2025",
      location: "Grand Hall, Main Campus",
      category: "Communication",
      description: "Develop advanced communication strategies with expert speakers through interactive sessions.",
      image: "./team/dog.jpg",
      speakers: [
        { name: "Dr. James Wilson", role: "Communications Professor" },
        { name: "Natalie Lopez", role: "Public Speaking Coach" }
      ],
      schedule: [
        { time: "09:30 AM", activity: "Effective Communication Principles" },
        { time: "11:00 AM", activity: "Public Speaking Practice" },
        { time: "01:30 PM", activity: "Advanced Techniques" }
      ]
    }
  ];
  
  useEffect(() => {
    setVisibleEvents(events);
  }, []);
  
  const handleEventSelect = (id) => {
    setSelectedEventId(id === selectedEventId ? null : id);
  };
  
  return (
    <div className="p-8 bg-transparent" id="upcoming-events">
      <div className="text-center mb-16">
        <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          Upcoming Events
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleEvents.map((event, index) => (
          <EventCard 
            key={event.id}
            event={event}
            isSelected={event.id === selectedEventId}
            onSelect={handleEventSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsSection;