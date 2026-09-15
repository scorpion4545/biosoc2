import { useEffect } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import { Navbar } from "../components/navbar";
import { ImageGallery } from "../components/ImageGallery";
import { WhyBioSoc } from "../components/WhyBioSoc";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import PastEvents from "../components/PastEvents";
import { FacultySection } from "../components/FacultySection";
import CouncilMembers from "../components/CouncilMembers";
import { Newsletter } from "../components/Newsletter";
import { InfiniteMovingSponsors } from "../components/InfiniteMovingSponsors";
import Footer from "../components/Footer";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = hash ? document.querySelector(hash) : null;
      if (target) {
        target.scrollIntoView({ behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export function PageFrame() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pt-24"
      >
        <Outlet />
      </motion.main>
    </>
  );
}

export function HomePage() {
  return (
    <>
      <LandingPage />
      <ImageGallery />
      <WhyBioSoc />
      <InfiniteMovingSponsors />
      <UpcomingEventsSection />
      <PastEvents />
      <Footer />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <section className="px-4 pt-16 text-center md:pt-24">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">About BioSoc-DTU</p>
        <h1 className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-5xl font-medium tracking-tight text-transparent md:text-7xl">
          Biology, beyond the textbook
        </h1>
      </section>
      <ImageGallery />
      <WhyBioSoc />
      <Footer />
    </>
  );
}

export function TeamPage() {
  return (
    <>
      <section className="px-4 pt-16 text-center md:pt-24">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">The people behind BioSoc-DTU</p>
        <h1 className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-5xl font-medium tracking-tight text-transparent md:text-7xl">
          Meet the team
        </h1>
      </section>
      <FacultySection />
      <CouncilMembers />
      <Footer />
    </>
  );
}

export function EventsPage() {
  return (
    <>
      <section className="px-4 pt-16 text-center md:pt-24">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">Learn, connect, experiment</p>
        <h1 className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-5xl font-medium tracking-tight text-transparent md:text-7xl">
          Events and experiences
        </h1>
      </section>
      <UpcomingEventsSection />
      <PastEvents />
      <Footer />
    </>
  );
}

export function ResourcesPage() {
  return (
    <>
      <section className="px-4 pt-16 text-center md:pt-24">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-400">Stay in the loop</p>
        <h1 className="bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-5xl font-medium tracking-tight text-transparent md:text-7xl">
          Resources and updates
        </h1>
      </section>
      <Newsletter />
      <InfiniteMovingSponsors />
      <Footer />
    </>
  );
}
