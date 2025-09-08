import './App.css'
import { LayoutGridDemo } from './components/LayoutGridDemo'
import { ImageGallery } from './components/ImageGallery'
import { useState, useEffect } from 'react';
import { DNALoader } from './components/ui/dna-loader';
import { Navbar } from './components/navbar';
import LandingPage from './components/LandingPage'
import { WhyBioSoc } from './components/WhyBioSoc';
import Footer from './components/Footer'
import { InfiniteMovingSponsors } from './components/InfiniteMovingSponsors'
import CouncilMembers from './components/CouncilMembers'
import SpeakerCarousel from './components/SpeakerCarousel'
import UpcomingEventsSection from './components/UpcomingEventsSection'
import PastEvents from './components/PastEvents'
import { FacultySection } from './components/FacultySection';
import { Newsletter } from './components/Newsletter';
import { Analytics } from '@vercel/analytics/react';


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DNALoader />;
  }

  // Add this at the top of your main App component
  const [isMaintenance, setIsMaintenance] = useState(true);
  
  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6">
            Site Under Maintenance
          </h1>
          <p className="text-gray-300 text-xl mb-8">
            We're working hard to improve your experience. Check back soon!
          </p>
          <button 
            onClick={() => setIsMaintenance(false)}
            className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Revert to Live Site
          </button>
        </div>
      </div>
    );
  }
 // Remove till this to make the site running back 
  return (
    <div>
      <LandingPage />
      <Navbar />
      <div className="pt-24"> {/* Increased padding for floating navbar */}
        <ImageGallery />
        <WhyBioSoc />    
        <Newsletter />
        <UpcomingEventsSection />
        <PastEvents />
        <LayoutGridDemo />
        <FacultySection />
        <SpeakerCarousel />
        <CouncilMembers />
        <InfiniteMovingSponsors />
        <Footer />
        <Analytics />
      </div>
    </div>
  );
}

export default App
