"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "../components/ui/layout-grid";
import { motion } from "framer-motion";

export function LayoutGridDemo() {
  return (
    <div className="h-screen py-20 w-full">
      <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-2">
        Our Department
      </h1>
      <p className="text-center text-xl text-gray-300 mb-8">
        Click to Know More
      </p>
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Technical And Design
      </p>
      
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      The design department is the driving force behind the execution of the society’s many technically-demanding and intricate endeavors such as, designing the social media posts, designing attractive posters and executing other technical tasks with precision and speed. 
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Content
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      The content department is responsible for managing the content, such as posts, articles, etc. that Biosoc puts across its various social media platforms like Instagram, LinkedIn, to an ever-growing audience of biotech enthusiasts. The content department handles the ideation of all content.
      </p>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Corporate
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      The corporate department is responsible for maintaining and expanding the society’s extensive relations with its various corporate partners, The corporate department doesn’t only bring in the necessary corporate patronage for organizing the society’s many events, but also helps bridge the gap between academia and industry.
      </p>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        PR And Outreach
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      The PR & Events department is the organisational backbone behind many of the society’s highly-successful events. This department is also responsible for spreading word across colleges and universities of the society’s upcoming events, and maintaining the society’s presence across various premiere institutions.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2", // Reverted back to original span
    thumbnail: "./team/Design.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: "./team/Content.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: "./team/Corpo.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2", // Reverted back to original span
    thumbnail: "./team/PR.jpg",
  },
];

// Remove the additional grid container div that was added
const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-[#0B1121] h-full w-full rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 h-full w-full bg-[#0B1121] opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
