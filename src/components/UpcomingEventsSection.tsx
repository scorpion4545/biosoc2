import React, { useState, useEffect, useRef } from 'react';

// Event Card Component with Advanced Animation
const EventCard = ({ event, isSelected, onSelect, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  // Parallax effect for card background
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current || !isHovered) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const moveX = (x - centerX) / 20;
      const moveY = (y - centerY) / 20;
      
      card.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg) scale(1.02)`;
    };
    
    const resetTransform = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
      }
    };
    
    const currentCard = cardRef.current;
    if (currentCard && isHovered) {
      currentCard.addEventListener('mousemove', handleMouseMove);
      currentCard.addEventListener('mouseleave', resetTransform);
    }
    
    return () => {
      if (currentCard) {
        currentCard.removeEventListener('mousemove', handleMouseMove);
        currentCard.removeEventListener('mouseleave', resetTransform);
      }
    };
  }, [isHovered]);
  
  // Animation delay based on index
  const animationDelay = `${index * 0.1}s`;
  
  return (
    <div 
      ref={cardRef}
      className={`relative bg-gradient-to-br ${
        isSelected ? 'from-blue-900 to-purple-900' : 'from-gray-900 to-gray-800'
      } rounded-xl overflow-hidden transition-all duration-500 ease-in-out shadow-lg ${
        isSelected ? 'lg:col-span-2 lg:row-span-2 z-10' : ''
      } cursor-pointer transform ${
        isHovered && !isSelected ? 'scale-105' : ''
      } ${
        isSelected ? 'scale-100' : ''
      }`}
      style={{
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        animationDelay,
        minHeight: isSelected ? '500px' : '300px', // Ensure minimum height
        height: isSelected ? 'auto' : '300px', // Allow auto height when expanded
      }}
      onClick={() => onSelect(event.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background overlay + image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-10 transition-opacity duration-300 ${
          isHovered || isSelected ? 'opacity-70' : 'opacity-90'
        }`}></div>
        <img
          src={event.image}
          alt={event.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered || isSelected ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>
      
      {/* Event date badge */}
      <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full z-20 shadow-lg">
        {event.date}
      </div>
      
      {/* Category label */}
      <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-80 text-blue-400 text-xs font-medium px-2 py-1 rounded-md z-20 flex items-center">
        <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
        {event.category}
      </div>
      
      {/* Content container */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 z-20 transition-all duration-500 ${
        isSelected ? 'top-24 overflow-y-auto' : '' // Make scrollable when expanded
      }`}>
        <h3 className={`text-white font-bold transition-all duration-300 ${
          isSelected ? 'text-3xl mb-4' : 'text-xl mb-2'
        }`}>{event.title}</h3>
        
        <div className="flex items-center mb-3">
          <svg className="w-4 h-4 text-gray-300 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-300 text-sm">{event.location}</span>
        </div>
        
        {/* Expandable content */}
        <div className={`transition-all duration-500 overflow-hidden ${
          isSelected ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-4">
            <p className="text-gray-300">{event.description}</p>
            
            {/* Speaker section */}
            {event.speakers && (
              <div>
                <h4 className="text-white text-lg font-semibold mb-2">Speakers</h4>
                <div className="flex flex-wrap gap-3">
                  {event.speakers.map((speaker, idx) => (
                    <div key={idx} className="flex items-center bg-gray-800 bg-opacity-60 rounded-full px-3 py-1">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                        {speaker.name.charAt(0)}
                      </div>
                      <span className="text-white text-sm">{speaker.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Schedule */}
            {event.schedule && (
              <div>
                <h4 className="text-white text-lg font-semibold mb-2">Schedule</h4>
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
            
            {/* Registration button */}
            <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Register Now
            </button>
          </div>
        </div>
        
        {/* Preview text for non-expanded cards */}
        <p className={`text-gray-300 text-sm transition-all duration-300 ${
          isSelected ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'
        }`}>
          {event.description.substring(0, 80)}...
          <span className="text-blue-400 ml-1">Click to see more</span>
        </p>
      </div>
    </div>
  );
};

// Search and filter component
const EventFilters = ({ onSearch, onFilter, categories }) => {
  return (
    <div className="mb-8 flex flex-col lg:flex-row gap-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search events..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', ...categories].map((category) => (
          <button
            key={category}
            onClick={() => onFilter(category === 'All' ? null : category)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg whitespace-nowrap transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Events Section Component
const AdvancedEventsSection = () => {
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [showMoreEvents, setShowMoreEvents] = useState(false);
  
  // Sample event data
  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2025",
      date: "Mar 15, 2025",
      location: "Innovation Center, Building B",
      category: "Technology",
      description: "Join industry leaders for an immersive day exploring cutting-edge technologies and digital transformation strategies. Participate in hands-on workshops, engaging panel discussions, and exclusive networking sessions with pioneers in AI, blockchain, and quantum computing.",
      image: "./team/cat.jpg",
      speakers: [
        { name: "Dr. Eliza Chen", role: "AI Researcher" },
        { name: "Marcus Johnson", role: "Blockchain Expert" },
        { name: "Sarah Williams", role: "Tech Innovator" }
      ],
      schedule: [
        { time: "09:00 AM", activity: "Registration & Breakfast" },
        { time: "10:00 AM", activity: "Keynote: The Future of Technology" },
        { time: "12:00 PM", activity: "Networking Lunch" },
        { time: "01:30 PM", activity: "Workshop Sessions" }
      ]
    },
    {
      id: 2,
      title: "Design Thinking Workshop",
      date: "Apr 5, 2025",
      location: "Creative Hub, Floor 3",
      category: "Design",
      description: "A comprehensive workshop exploring principles of thoughtful and functional design with practical exercises and expert guidance. Learn how to apply design thinking methodologies to solve complex problems and create user-centered experiences that drive engagement and satisfaction.",
      image: "./team/cat.jpg",
      speakers: [
        { name: "Alex Rivera", role: "UX Director" },
        { name: "Priya Patel", role: "Product Designer" }
      ],
      schedule: [
        { time: "10:00 AM", activity: "Introduction to Design Thinking" },
        { time: "11:30 AM", activity: "Problem Definition Exercise" },
        { time: "01:00 PM", activity: "Lunch Break" },
        { time: "02:00 PM", activity: "Prototyping Workshop" }
      ]
    },
    {
      id: 3,
      title: "Communication Masterclass",
      date: "Apr 18, 2025",
      location: "Grand Hall, Main Campus",
      category: "Communication",
      description: "Develop advanced communication strategies with expert speakers through interactive sessions designed to enhance your personal and professional impact. Master the art of persuasive presentations, effective negotiation, and compelling storytelling to elevate your leadership presence.",
      image: "./team/cat.jpg",
      speakers: [
        { name: "Dr. James Wilson", role: "Communications Professor" },
        { name: "Natalie Lopez", role: "Public Speaking Coach" }
      ],
      schedule: [
        { time: "09:30 AM", activity: "Effective Communication Principles" },
        { time: "11:00 AM", activity: "Public Speaking Practice" },
        { time: "12:30 PM", activity: "Networking Lunch" },
        { time: "01:30 PM", activity: "Advanced Persuasion Techniques" }
      ]
    },
    {
      id: 4,
      title: "Data Science Conference",
      date: "May 10, 2025",
      location: "Science Center, West Wing",
      category: "Technology",
      description: "Explore the latest advancements in data science, machine learning, and analytics with industry pioneers. Discover how leading organizations are leveraging data-driven insights to transform decision-making processes and create competitive advantages in the digital economy.",
      image: "./team/cat.jpg",
      speakers: [
        { name: "Dr. Maya Patel", role: "Data Scientist" },
        { name: "Thomas Lee", role: "ML Engineer" }
      ],
      schedule: [
        { time: "09:00 AM", activity: "Welcome & Introduction" },
        { time: "10:00 AM", activity: "Data Science Trends 2025" },
        { time: "01:00 PM", activity: "Machine Learning Workshop" },
        { time: "03:30 PM", activity: "Networking Session" }
      ]
    },
    {
      id: 5,
      title: "Leadership & Innovation Forum",
      date: "Jun 22, 2025",
      location: "Executive Center, 15th Floor",
      category: "Business",
      description: "An exclusive gathering for forward-thinking leaders to exchange ideas, share insights, and explore innovative approaches to today's most pressing business challenges. Connect with visionary executives and thought leaders who are redefining success in the modern business landscape.",
      image: "./team/dog.jpg",
      speakers: [
        { name: "Richard Hayes", role: "CEO" },
        { name: "Lisa Chang", role: "Innovation Director" }
      ],
      schedule: [
        { time: "08:30 AM", activity: "Executive Breakfast" },
        { time: "09:30 AM", activity: "Leadership Panel Discussion" },
        { time: "12:00 PM", activity: "Networking Lunch" },
        { time: "02:00 PM", activity: "Innovation Workshops" }
      ]
    }
  ];
  
  // Get unique categories for filter buttons
  const categories = [...new Set(events.map(event => event.category))];
  
  // Filter and search events
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      let filtered = [...events];
      
      if (activeFilter) {
        filtered = filtered.filter(event => event.category === activeFilter);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(term) || 
          event.description.toLowerCase().includes(term) ||
          event.category.toLowerCase().includes(term)
        );
      }
      
      setVisibleEvents(filtered);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilter]);
  
  // Handle event selection
  const handleEventSelect = (id) => {
    setSelectedEventId(id === selectedEventId ? null : id);
  };
  
  // Handle view all button click
  const handleViewAllClick = () => {
    setShowMoreEvents(!showMoreEvents);
  };
  
  return (
    <div className="p-8 bg-transparent">
      <div className="flex flex-col items-center justify-center mb-8">
        <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
          Upcoming Events
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">{visibleEvents.length} events found</span>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-500 border-opacity-20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      {/* Events grid */}
      {!isLoading && visibleEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {visibleEvents.map((event, index) => (
            <EventCard 
              key={event.id}
              event={event}
              index={index}
              isSelected={event.id === selectedEventId}
              onSelect={handleEventSelect}
            />
          ))}
        </div>
      )}
      
      {/* "More Events Coming Soon" section (toggled by View All button) */}
      {showMoreEvents && (
        <div className="mt-10 p-8 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-800 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-3">More Events Coming Soon!</h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Our team is busy organizing exciting new events. Subscribe to our newsletter to be the first to know when new events are announced.
          </p>
        </div>
      )}
      
      {/* View all button */}
      <div className="flex justify-center mt-10">
        <button 
          className="px-6 py-3 bg-transparent border border-gray-600 hover:border-blue-500 text-white rounded-lg transition-all duration-300 group flex items-center"
          onClick={handleViewAllClick}
        >
          {showMoreEvents ? 'Hide Additional Info' : 'View All Events'}
          <svg 
            className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${showMoreEvents ? 'rotate-180' : 'group-hover:translate-x-1'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AdvancedEventsSection;