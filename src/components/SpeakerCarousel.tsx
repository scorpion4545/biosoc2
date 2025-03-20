import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Speaker {
  name: string;
  title: string;
  quote: string;
  image: string;
}

const SpeakerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const speakers: Speaker[] = [
    {
        name: "Ms. Preeti Yadav",
        title: "Omics Instructor, OmicsLogic Inc",
        quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
        image: "./team/Ms. Preeti Yadav.jpeg"
    },
    {
        name: "Dr Amjad Hussain",
        title: "Co-Founder Canfinis Therapeutics",
        quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
        image: "./team/Amjad .jpeg"
    },
    {
        name: "Dr. Manish Kumar",
        title: "HoD Dept of Biophysics, DU",
        quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
        image: "./team/Dr. Manish Kumar.jpeg"
    },
    {
        name: "Dr Janendra K Batra",
        title: " Senior Scientist, INSA",
        quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
        image: "./team/Dr Janendra K Batra  .jpg"
    },
    {
        name: "Francisco Coroado Santos",
        title: "Bioinformatician at Oxford University Hospitals",
        quote: "An incredible platform for sharing cutting-edge developments in cloud architecture and distributed systems.",
        image: "./team/Francisco .jpeg"
    },
    {
        name: "Anurag Saxena",
        title: " Co-Founder, Milkyway Spawn Mushrooms",
        quote: "An incredible platform for sharing cutting-edge developments in cloud architecture and distributed systems.",
        image: "./team/Anurag Saxena .jpeg"
    },
    {
        name: "Alok Anand",
        title: "Founder TechMedBuddy",
        quote: "The discussions on ethical AI development were particularly enlightening and necessary for our field.",
        image: "./team/Alok Anand.jpeg"
    }
];

const handleNavigation = (direction: 'next' | 'prev'): void => {
  if (isTransitioning) return;

  setIsTransitioning(true);
  const newIndex = direction === 'next'
    ? (currentIndex + 1) % speakers.length
    : (currentIndex - 1 + speakers.length) % speakers.length;

  setCurrentIndex(newIndex);
  setTimeout(() => setIsTransitioning(false), 500);
};

return (

    <div className="w-full max-w-6xl mx-auto px-4">
        <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
            Past Speakers
        </h2>
        {/* Changed flex layout for mobile */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">

            {/* Image Section - adjusted for mobile */}
            <div className="w-full md:w-1/2 relative flex justify-center">
                <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px]">
                    <div className="absolute inset-4 overflow-hidden rounded-full shadow-2xl">
                        <img
                            src={speakers[currentIndex].image}
                            alt={speakers[currentIndex].name}
                            className={`w-full h-full object-cover transform transition-all duration-500 ease-out
                                ${isTransitioning ? 'scale-110 opacity-80' : 'scale-100 opacity-100'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                </div>

                {/* Navigation Buttons - adjusted position */}
                <div className="absolute -bottom-6 flex gap-4">
                    <button
                        onClick={() => handleNavigation('prev')}
                        className="p-2 md:p-3 rounded-full bg-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 group"
                        disabled={isTransitioning}
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                    </button>
                    <button
                        onClick={() => handleNavigation('next')}
                        className="p-2 md:p-3 rounded-full bg-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-200 group"
                        disabled={isTransitioning}
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
                    </button>
                </div>
            </div>

            {/* Content Section - adjusted for mobile */}
            <div className="w-full md:w-1/2 px-4 md:px-0">
                <div className={`transform transition-all duration-500 ease-out text-center md:text-left
                    ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <div className="space-y-6 md:space-y-8">
                        <div className="space-y-2 md:space-y-3">
                            <h2 className="text-2xl md:text-4xl font-bold text-white">
                                {speakers[currentIndex].name}
                            </h2>
                            <p className="text-lg md:text-xl font-medium text-blue-600">
                                {speakers[currentIndex].title}
                            </p>
                        </div>
                        <div className="relative">
                            <svg className="hidden md:block absolute -top-4 -left-4 h-8 w-8 text-white transform -translate-x-2" fill="currentColor" viewBox="0 0 32 32">
                                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4z" />
                            </svg>
                            <blockquote className="relative text-lg md:text-2xl font-medium text-white leading-relaxed md:pl-4">
                                {speakers[currentIndex].quote}
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Progress Dots - adjusted size */}
        <div className="flex justify-center mt-8 md:mt-12 gap-2 md:gap-3">
            {speakers.map((_, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (index !== currentIndex && !isTransitioning) {
                            setIsTransitioning(true);
                            setCurrentIndex(index);
                            setTimeout(() => setIsTransitioning(false), 500);
                        }
                    }}
                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 
                        ${index === currentIndex
                            ? 'w-6 md:w-8 bg-blue-600'
                            : 'w-1.5 md:w-2 bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    </div>
);
};

export default SpeakerCarousel;