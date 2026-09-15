"use client";
import React, { useState } from "react";
import { motion, TargetAndTransition } from "framer-motion";
import { cn } from "../../lib/utils";

interface Card {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
}

interface LayoutGridProps {
  cards: Card[];
}

interface ImageComponentProps {
  card: Card;
}

interface SelectedCardProps {
  selected: Card | null;
}

interface MotionAnimationProps {
  opacity: number;
  y?: number;
}

interface TransitionProps {
  duration: number;
  ease: "easeInOut";
}

export const LayoutGrid: React.FC<LayoutGridProps> = ({ cards }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card): void => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = (): void => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3  max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "")}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "relative overflow-hidden",
              selected?.id === card.id
                ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
                : lastSelected?.id === card.id
                ? "z-40 bg-white rounded-xl h-full w-full"
                : "bg-white rounded-xl h-full w-full"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <ImageComponent card={card} />
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const ImageComponent: React.FC<ImageComponentProps> = ({ card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      height={500}
      width={500}
      className={cn(
        "object-cover object-top absolute inset-0 h-full w-full transition duration-200"
      )}
      alt="thumbnail"
    />
  );
};

const SelectedCard: React.FC<SelectedCardProps> = ({ selected }) => {
  const initialAnimation: MotionAnimationProps = { opacity: 0 };
  const overlayAnimation: MotionAnimationProps = { opacity: 0.6 };
  const contentInitial: MotionAnimationProps = { opacity: 0, y: 100 };
  const contentAnimate: MotionAnimationProps = { opacity: 1, y: 0 };
  const contentExit: MotionAnimationProps = { opacity: 0, y: 100 };
  const transitionProps: TransitionProps = {
    duration: 0.3,
    ease: "easeInOut"
  };

  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={initialAnimation as TargetAndTransition}
        animate={overlayAnimation as TargetAndTransition}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={contentInitial as TargetAndTransition}
        animate={contentAnimate as TargetAndTransition}
        exit={contentExit as TargetAndTransition}
        transition={transitionProps}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
