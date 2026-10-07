import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDNASceneProps {
  className?: string;
  offsetX?: number; // Position offset for rightward alignment
}

export const ThreeDNAScene: React.FC<ThreeDNASceneProps> = ({ className = '', offsetX = 5.2 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Dynamic Lights for 3D DNA
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3.5, 35);
    cyanLight.position.set(10, 8, 10);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 35);
    emeraldLight.position.set(-6, -8, 10);
    scene.add(emeraldLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 2.5, 25);
    purpleLight.position.set(12, -4, 5);
    scene.add(purpleLight);

    // Group for 3D DNA System positioned rightwards
    const dnaGroup = new THREE.Group();
    const isMobile = window.innerWidth < 1024;
    dnaGroup.position.set(isMobile ? 0 : offsetX, isMobile ? -2.2 : 0, 0);
    scene.add(dnaGroup);

    // Materials
    const backboneMaterial1 = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      shininess: 90,
    });

    const backboneMaterial2 = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.35,
      shininess: 90,
    });

    const rungMaterialA = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });

    const rungMaterialB = new THREE.MeshPhongMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      emissiveIntensity: 0.3,
    });

    // Enhanced 3D DNA Helix Parameters
    const basePairsCount = 38;
    const radius = 2.7;
    const heightStep = 0.58;
    const twistAngle = 0.33;
    const sphereRadius = 0.3;

    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 16, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.08, 0.08, radius * 2, 8);

    for (let i = 0; i < basePairsCount; i++) {
      const y = (i - basePairsCount / 2) * heightStep;
      const angle = i * twistAngle;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Backbone Sphere 1
      const sphere1 = new THREE.Mesh(sphereGeo, backboneMaterial1);
      sphere1.position.set(x1, y, z1);
      dnaGroup.add(sphere1);

      // Backbone Sphere 2
      const sphere2 = new THREE.Mesh(sphereGeo, backboneMaterial2);
      sphere2.position.set(x2, y, z2);
      dnaGroup.add(sphere2);

      // Connecting Base Rung
      const isEven = i % 2 === 0;
      const rung = new THREE.Mesh(cylinderGeo, isEven ? rungMaterialA : rungMaterialB);
      rung.position.set(0, y, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -angle;
      dnaGroup.add(rung);
    }

    // Orbiting Bioluminescent Molecular Cloud around the right side DNA
    const particlesGroup = new THREE.Group();
    particlesGroup.position.copy(dnaGroup.position);
    scene.add(particlesGroup);

    const particleGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const particleColors = [0x8b5cf6, 0x06b6d4, 0x10b981];

    for (let p = 0; p < 50; p++) {
      const pColor = particleColors[p % particleColors.length];
      const particleMat = new THREE.MeshPhongMaterial({
        color: pColor,
        emissive: pColor,
        emissiveIntensity: 0.6,
      });

      const particle = new THREE.Mesh(particleGeo, particleMat);
      const pRadius = 4.0 + Math.random() * 5.5;
      const pAngle = Math.random() * Math.PI * 2;
      const pY = (Math.random() - 0.5) * 22;

      particle.position.set(
        Math.cos(pAngle) * pRadius,
        pY,
        Math.sin(pAngle) * pRadius
      );
      particlesGroup.add(particle);
    }

    // Mouse Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      targetRotationY = (x / (rect.width / 2)) * 0.7;
      targetRotationX = (y / (rect.height / 2)) * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;

      const isMob = newW < 1024;
      dnaGroup.position.set(isMob ? 0 : offsetX, isMob ? -2.2 : 0, 0);
      particlesGroup.position.copy(dnaGroup.position);

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      dnaGroup.rotation.y += 0.009;
      dnaGroup.rotation.y += (targetRotationY - dnaGroup.rotation.y) * 0.05;
      dnaGroup.rotation.x += (targetRotationX - dnaGroup.rotation.x) * 0.05;
      dnaGroup.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;

      particlesGroup.rotation.y -= 0.005;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [offsetX]);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{ overflow: 'hidden' }}
    />
  );
};
