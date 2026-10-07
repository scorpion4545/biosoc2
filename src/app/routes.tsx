import { useEffect } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import { Navbar } from "../components/navbar";
import { ImageGallery, AboutSection } from "../components/ImageGallery";
import { WhyBioSoc } from "../components/WhyBioSoc";
import UpcomingEventsSection from "../components/UpcomingEventsSection";
import PastEvents from "../components/PastEvents";
import { FacultySection } from "../components/FacultySection";
import CouncilMembers from "../components/CouncilMembers";
import { Newsletter } from "../components/Newsletter";
import { InfiniteMovingSponsors } from "../components/InfiniteMovingSponsors";
import { OurDepartments } from "../components/OurDepartments";
import Footer from "../components/Footer";
import AdminPanelV2 from "../components/AdminPanelV2";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const target = hash ? document.querySelector(hash) : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-20 overflow-x-hidden"
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
      <AboutSection />
      <WhyBioSoc />
      <ImageGallery />
      <OurDepartments />
      <UpcomingEventsSection />
      <PastEvents />
      <InfiniteMovingSponsors />
      <Footer />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <section className="px-4 pt-16 text-center md:pt-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400 font-mono">About BioSoc-DTU</p>
        <h1 className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          Biology, beyond the textbook
        </h1>
      </section>
      <AboutSection />
      <WhyBioSoc />
      <ImageGallery />
      <Footer />
    </>
  );
}

export function TeamPage() {
  return (
    <>
      <section className="px-4 pt-16 text-center md:pt-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400 font-mono">The people behind BioSoc-DTU</p>
        <h1 className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
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
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400 font-mono">Learn, connect, experiment</p>
        <h1 className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
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
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400 font-mono">Stay in the loop</p>
        <h1 className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          Resources and updates
        </h1>
      </section>
      <Newsletter />
      <InfiniteMovingSponsors />
      <Footer />
    </>
  );
}

export function AdminPage() {
  return <AdminPanelV2 />;
}
