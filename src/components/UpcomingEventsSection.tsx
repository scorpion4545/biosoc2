import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DEFAULT_RECRUITMENT_URL, normalizeRecruitmentUrl } from '../lib/recruitment';
import { TiltCard3D } from './ui/tilt-card-3d';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

interface Speaker {
  name: string;
  role: string;
}

interface ScheduleItem {
  time: string;
  activity: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  image: string;
  speakers: Speaker[];
  schedule: ScheduleItem[];
}

interface EventCardProps {
  event: Event;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isSelected, onSelect }) => {
  return (
    <div 
      className={`relative transition-all duration-300 ${
        isSelected 
          ? 'fixed inset-0 z-[100] flex items-start md:items-center justify-center bg-slate-950/90 backdrop-blur-xl overflow-y-auto p-4'
          : 'cursor-pointer'
      } rounded-2xl overflow-hidden`}
      style={{
        minHeight: isSelected ? '100vh' : '320px',
        height: isSelected ? '100vh' : '320px',
      }}
      onClick={() => onSelect(event.id)}
    >
      {isSelected ? (
        <div className="relative w-full max-w-[90vw] mx-auto h-[90vh] bg-slate-950/90 border border-cyan-500/30 rounded-3xl overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          {/* Image Section */}
          <div className="relative h-[40vh] w-full">
            <div className="absolute inset-0">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 relative -mt-20">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  {event.date}
                </div>
                <h3 className="text-4xl font-extrabold text-white">{event.title}</h3>
              </div>
              <button
                className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded-full text-white text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center">
                <span className="text-slate-300 text-lg">{event.location}</span>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed">{event.description}</p>
              
              {event.speakers && (
                <div>
                  <h4 className="text-white text-xl font-semibold mb-3">Speakers</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.speakers.map((speaker, idx) => (
                      <div key={idx} className="flex items-center bg-slate-900 border border-cyan-500/30 rounded-full px-4 py-1.5">
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
                      <div key={idx} className="flex border-l-2 border-cyan-400 pl-3">
                        <div className="text-cyan-400 text-sm font-medium w-24">{item.time}</div>
                        <div className="text-slate-300 text-sm">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <button className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-base transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                Register Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <TiltCard3D maxTilt={10} scale={1.03} className="h-full border border-emerald-500/20 bg-slate-950/70 bio-card-glow">
          <div className="h-full relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-95 z-10"></div>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-6 right-6 bg-slate-950/90 border border-emerald-400 text-emerald-300 text-xs font-extrabold px-3.5 py-1 rounded-full z-20 shadow-[0_0_15px_rgba(16,185,129,0.6)] backdrop-blur-xl">
              {event.date}
            </div>
            
            <div className="absolute top-6 left-6 bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full z-20 flex items-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></div>
              {event.category}
            </div>

            <div className="absolute left-0 right-0 bottom-0 p-6 z-20">
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <div className="flex items-center mb-3">
                <span className="text-slate-300 text-sm">{event.location}</span>
              </div>
              <p className="text-slate-300 text-sm">
                {event.description.substring(0, 80)}...
                <span className="text-cyan-400 font-semibold ml-1">Click to see more</span>
              </p>
            </div>
          </div>
        </TiltCard3D>
      )}
    </div>
  );
};

const UpcomingEventsSection: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recruitmentUrl, setRecruitmentUrl] = useState(DEFAULT_RECRUITMENT_URL);

  useEffect(() => {
    let isMounted = true;

    const fetchRecruitmentUrl = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/settings/recruitment-link`);
        const savedUrl = normalizeRecruitmentUrl(String(response.data?.data?.value || ''));
        if (isMounted && savedUrl) setRecruitmentUrl(savedUrl);
      } catch (error) {
        console.error('Error fetching recruitment link:', error);
      }
    };

    void fetchRecruitmentUrl();
    return () => {
      isMounted = false;
    };
  }, []);
  
  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/events?type=upcoming`);
        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.length > 0) {
            const mapped: Event[] = json.data.map((item: any, idx: number) => ({
              id: item._id || idx + 1,
              title: item.title,
              date: item.date,
              location: item.location || 'Delhi Technological University',
              category: item.category || 'General',
              description: item.description,
              image: item.coverImage,
              speakers: item.speakers || [],
              schedule: item.schedule || []
            }));
            if (isMounted) setVisibleEvents(mapped);
          } else {
            if (isMounted) setVisibleEvents([]);
          }
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchEvents();
    return () => { isMounted = false; };
  }, []);
  
  const handleEventSelect = (id: number | null): void => {
    setSelectedEventId(id === selectedEventId ? null : id);
  };
  
  return (
    <div className="p-8 py-24 bg-transparent perspective-1000" id="upcoming-events">
      <div className="text-center mb-16 preserve-3d">
        <h2 className="mt-8 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 py-4 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          Upcoming Events
        </h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-emerald-400"></div>
        </div>
      ) : visibleEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 preserve-3d">
          {visibleEvents.map((event) => (
            <div 
              key={event.id} 
              className={`transition-all duration-300 ${
                selectedEventId && selectedEventId !== event.id ? 'scale-95 opacity-40' : ''
              }`}
            >
              <EventCard 
                event={event}
                isSelected={event.id === selectedEventId}
                onSelect={handleEventSelect}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto preserve-3d">
          <TiltCard3D maxTilt={8} scale={1.02} className="flex flex-col items-center justify-center min-h-[320px] bg-slate-950/70 border border-emerald-500/30 rounded-3xl p-10 text-center bio-card-glow shadow-[0_25px_50px_rgba(0,0,0,0.8)]">
            <div className="text-5xl mb-6 animate-float-3d">🚀</div>
            <h3 className="text-3xl font-extrabold text-white mb-4 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Recruitment Now Live!</h3>
            <p className="text-slate-300 text-center max-w-md mb-8 text-base md:text-lg leading-relaxed">
              Join our team and be part of the innovation! Apply now through our official recruitment form.
            </p>
            <a 
              href={recruitmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 text-slate-950 font-bold text-lg py-3.5 px-8 rounded-full hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105"
            >
              Apply Now
            </a>
          </TiltCard3D>
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsSection;