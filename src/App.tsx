import './App.css'
import { BentoGridDemo } from './components/Bento-grid'
import { LayoutGridDemo } from './components/LayoutGridDemo'
import { LampContainer } from './components/ui/lamp'
import { ImageGallery } from './components/ImageGallery'
import { useState, useEffect } from 'react';
import { DNALoader } from './components/ui/dna-loader';

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

  return <div>
    <ImageGallery />
    < LampContainer children={undefined} />
    < BentoGridDemo />
    < LayoutGridDemo />
  </div>
}

export default App
