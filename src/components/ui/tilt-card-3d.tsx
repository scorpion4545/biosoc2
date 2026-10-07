import React, { useRef, useState } from 'react';

interface TiltCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glareOpacity?: number;
  glareColor?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const TiltCard3D: React.FC<TiltCard3DProps> = ({
  children,
  className = '',
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  glareOpacity = 0.25,
  glareColor = 'rgba(6, 182, 212, 0.4)',
  style = {},
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const px = (mouseX / width) - 0.5;
    const py = (mouseY / height) - 0.5;

    // Calculate rotation angles
    const rotateY = px * maxTilt * 2;
    const rotateX = -py * maxTilt * 2;

    setTransform(`perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);
    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transition: 'transform 0.15s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      className={`relative overflow-hidden rounded-2xl preserve-3d cursor-pointer ${className}`}
    >
      {/* 3D Content Container */}
      <div className="relative z-10 preserve-3d w-full h-full">
        {children}
      </div>

      {/* Dynamic Specular Glare Effect */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-2xl"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};
