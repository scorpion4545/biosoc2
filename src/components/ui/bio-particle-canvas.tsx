import React, { useEffect, useRef } from 'react';

export const BioParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for parallax
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle system definition with 3D z-depth
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }

    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 500 + 100, // 3D depth
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.005;

      const fov = 350;
      const cx = width / 2 + (mouseX - width / 2) * 0.03;
      const cy = height / 2 + (mouseY - height / 2) * 0.03;

      // Draw connecting bio-molecular lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const opacity = (1 - dist / 130) * 0.15;
            ctx.beginPath();
            ctx.moveTo(
              cx + (particles[i].x - width / 2) * (fov / particles[i].z),
              cy + (particles[i].y - height / 2) * (fov / particles[i].z)
            );
            ctx.lineTo(
              cx + (particles[j].x - width / 2) * (fov / particles[j].z),
              cy + (particles[j].y - height / 2) * (fov / particles[j].z)
            );
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles with 3D projection
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(angle + p.z) * 0.2;
        p.y += p.vy + Math.cos(angle + p.z) * 0.2;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const scale = fov / p.z;
        const projX = cx + (p.x - width / 2) * scale;
        const projY = cy + (p.y - height / 2) * scale;
        const projRadius = Math.max(0.5, p.radius * scale);

        // Bio-glow halo
        const gradient = ctx.createRadialGradient(
          projX,
          projY,
          0,
          projX,
          projY,
          projRadius * 4
        );
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.4, p.color + '44');
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(projX, projY, projRadius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core nucleus
        ctx.beginPath();
        ctx.arc(projX, projY, projRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    />
  );
};
