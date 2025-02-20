import './App.css'
import { BentoGridDemo } from './components/Bento-grid'
import { LayoutGridDemo } from './components/LayoutGridDemo'
import { LampContainer } from './components/ui/lamp'
import { ImageGallery } from './components/ImageGallery'
import { useState, useEffect } from 'react';
import { DNALoader } from './components/ui/dna-loader';
import { Navbar } from './components/ui/navbar';
import LandingPage from './components/LandingPage'

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

  return (
    <div>
      <LandingPage />
      <Navbar />
      <div className="pt-24"> {/* Increased padding for floating navbar */}
        <ImageGallery />
        <LampContainer children={undefined} />
        <BentoGridDemo />
        <LayoutGridDemo />
      </div>
    </div>
  );
}

export default App
