"use client";

import { FacultySection } from "../components/FacultySection";
import { InfiniteMovingSponsors } from "../components/InfiniteMovingSponsors";
export default function Home() {
  return (
    <main>
      <InfiniteMovingSponsors />
      <FacultySection />
    </main>
  );
} 