import type { FC } from 'react';
import { Linkedin } from 'lucide-react';

interface Organizer {
  name: string;
  imageUrl: string;
  linkedin?: string; // Add optional LinkedIn field
}

interface Event {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  datetime: string;
  imageUrl: string;
  organizer: Organizer;
}

const events: Event[] = [
  {
    id: 1,
    title: "Research Symposium 2024",
    category: "Research",
    description: "Join us for an exciting showcase of cutting-edge biotechnology research and innovations.",
    date: "Mar 15",
    time: "9:00 AM",
    datetime: "2024-03-15T09:00",
    imageUrl: "./team/cat.jpg",
    organizer: {
      name: "Research Committee",
      imageUrl: "/team/organizer1.jpg",
      linkedin: "https://www.linkedin.com/in/research-committee"
    }
  },
  {
    id: 2,
    title: "Biotech Workshop Series",
    category: "Workshop",
    description: "Hands-on workshop series covering latest techniques in biotechnology and molecular biology.",
    date: "Mar 20",
    time: "2:00 PM",
    datetime: "2024-03-20T14:00",
    imageUrl: "/events/workshop.jpg",
    organizer: {
      name: "Workshop Team",
      imageUrl: "/team/organizer2.jpg"
    }
  },
  {
    id: 3,
    title: "Industry Connect 2024",
    category: "Networking",
    description: "Network with industry leaders and explore career opportunities in biotechnology.",
    date: "Mar 25",
    time: "10:00 AM",
    datetime: "2024-03-25T10:00",
    imageUrl: "/events/networking.jpg",
    organizer: {
      name: "Industry Relations",
      imageUrl: "/team/organizer3.jpg"
    }
  }
];

export const EventsSection: FC = () => {
  return (
    <div className="bg-slate-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-200 sm:text-4xl">
            Events
          </h2>
          <p className="mt-2 text-lg leading-8 text-slate-400">
            Join us in our upcoming events and be part of the biotechnology revolution.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={event.imageUrl}
                  alt={event.title}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-slate-900 p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-400">
                    {event.category}
                  </p>
                  <div className="mt-2">
                    <p className="text-xl font-semibold text-slate-200">
                      {event.title}
                    </p>
                    <p className="mt-3 text-base text-slate-300">
                      {event.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0 relative group">
                    <span className="sr-only">{event.organizer.name}</span>
                    <img
                      className="h-10 w-10 rounded-full"
                      src={event.organizer.imageUrl}
                      alt=""
                    />
                    {/* LinkedIn Icon */}
                    {event.organizer.linkedin && (
                      <a
                        href={event.organizer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <div className="bg-black/50 p-1 rounded-full">
                          <Linkedin className="w-4 h-4 text-white hover:text-blue-400 transition-colors duration-300" />
                        </div>
                      </a>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-slate-200">
                      {event.organizer.name}
                    </p>
                    <div className="flex space-x-1 text-sm text-slate-400">
                      <time dateTime={event.datetime}>{event.date}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}