import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useState, useEffect } from 'react';
import { DNALoader } from './components/ui/dna-loader';
import {
  AboutPage,
  EventsPage,
  HomePage,
  PageFrame,
  ResourcesPage,
  TeamPage,
  AdminPage,
} from './app/routes';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DNALoader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageFrame />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Route>
        {/* Admin route without navbar/footer */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App
