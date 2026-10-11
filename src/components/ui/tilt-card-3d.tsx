import React, { useRef, useState, useEffect } from 'react';

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
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  glareOpacity = 0.25,
  glareColor = 'rgba(6, 182, 212, 0.4)',
  style = {},
  onClick,
}) => {
  // Outer stationary wrapper handles pointer events & stays completely untransformed
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Targets for lerp smoothing
  const targetX = useRef(0);
  const targetY = useRef(0);
  const targetScale = useRef(1);
  const targetGlareOpacity = useRef(0);
  const targetGlareX = useRef(50);
  const targetGlareY = useRef(50);

  // Current smoothed values
  const currentX = useRef(0);
  const currentY = useRef(0);
  const currentScale = useRef(1);
  const currentGlareOpacity = useRef(0);

  const [transformStyle, setTransformStyle] = useState<string>(
    `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  );
  const [glareStyle, setGlareStyle] = useState<{ opacity: number; x: number; y: number }>({
    opacity: 0,
    x: 50,
    y: 50,
  });

  const isHoveredRef = useRef(false);

  useEffect(() => {
    let animId: number;

    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const animate = () => {
      // Lerp smooth towards targets (factor 0.08 for ultra-smooth calm gliding)
      currentX.current = lerp(currentX.current, targetX.current, 0.08);
      currentY.current = lerp(currentY.current, targetY.current, 0.08);
      currentScale.current = lerp(currentScale.current, targetScale.current, 0.08);
      currentGlareOpacity.current = lerp(currentGlareOpacity.current, targetGlareOpacity.current, 0.08);

      setTransformStyle(
        `perspective(${perspective}px) rotateX(${currentX.current.toFixed(2)}deg) rotateY(${currentY.current.toFixed(2)}deg) scale3d(${currentScale.current.toFixed(4)}, ${currentScale.current.toFixed(4)}, 1)`
      );

      setGlareStyle({
        opacity: currentGlareOpacity.current,
        x: targetGlareX.current,
        y: targetGlareY.current,
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [perspective]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const px = mouseX / rect.width - 0.5;
    const py = mouseY / rect.height - 0.5;

    targetX.current = -py * maxTilt * 1.5;
    targetY.current = px * maxTilt * 1.5;
    targetScale.current = scale;
    targetGlareOpacity.current = glareOpacity;
    targetGlareX.current = (mouseX / rect.width) * 100;
    targetGlareY.current = (mouseY / rect.height) * 100;
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    targetX.current = 0;
    targetY.current = 0;
    targetScale.current = 1;
    targetGlareOpacity.current = 0;
  };

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative select-none ${className}`}
      style={{
        ...style,
      }}
    >
      {/* INNER VISUAL LAYER (Receives smooth lerped 3D transforms) */}
      <div
        className="w-full h-full relative rounded-2xl preserve-3d overflow-hidden cursor-pointer"
        style={{
          transform: transformStyle,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* 3D Content Container */}
        <div className="relative z-10 preserve-3d w-full h-full">
          {children}
        </div>

        {/* Dynamic Specular Glare Effect */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
          style={{
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, ${glareColor} 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
};
