import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Hero3DBat({ fallbackImage }) {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Lighting (Cinematic rim & key light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Crimson / Orange Rim Spotlight for sports aesthetic
    const rimLight = new THREE.SpotLight(0xff2e4d, 5, 10, Math.PI / 4, 0.5);
    rimLight.position.set(-5, -2, -2);
    scene.add(rimLight);

    const topFill = new THREE.DirectionalLight(0xff7733, 1.2);
    topFill.position.set(0, 6, 2);
    scene.add(topFill);

    // 3. Construct Procedural 3D Cricket Bat
    const batGroup = new THREE.Group();

    // Wood Texture procedural canvas
    const createWoodTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      // Base wood tone
      ctx.fillStyle = '#D4A373';
      ctx.fillRect(0, 0, 512, 1024);
      // Wood grain lines
      ctx.strokeStyle = 'rgba(120, 75, 40, 0.35)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 512; i += 18) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.bezierCurveTo(i + 10, 300, i - 10, 700, i + 5, 1024);
        ctx.stroke();
      }
      // Red brand stripes
      ctx.fillStyle = '#FF2E4D';
      ctx.fillRect(40, 650, 432, 70);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SSD SPORTS', 256, 700);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const woodTexture = createWoodTexture();

    // A) Blade (Willow Wood)
    const bladeShape = new THREE.BoxGeometry(0.85, 3.2, 0.22);
    const woodMaterial = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.35,
      metalness: 0.1,
    });
    const bladeMesh = new THREE.Mesh(bladeShape, woodMaterial);
    bladeMesh.position.set(0, -0.4, 0);
    bladeMesh.castShadow = true;
    bladeMesh.receiveShadow = true;
    batGroup.add(bladeMesh);

    // B) Handle Cone & Handle (Grip Texture)
    const handleGeo = new THREE.CylinderGeometry(0.11, 0.13, 1.6, 24);
    const gripMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.2,
    });
    const handleMesh = new THREE.Mesh(handleGeo, gripMaterial);
    handleMesh.position.set(0, 1.9, 0);
    handleMesh.castShadow = true;
    batGroup.add(handleMesh);

    // C) Handle Rubber Top Knob
    const knobGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.15, 24);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0xff2e4d, roughness: 0.4 });
    const knobMesh = new THREE.Mesh(knobGeo, knobMat);
    knobMesh.position.set(0, 2.75, 0);
    batGroup.add(knobMesh);

    // D) Crimson Shoulder Decal Rings
    const ringGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.25, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xff2e4d, roughness: 0.2, metalness: 0.4 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 1.1, 0);
    batGroup.add(ringMesh);

    // Initial Bat Rotation & Positioning
    batGroup.rotation.z = -Math.PI / 12; // Slight diagonal tilt
    batGroup.rotation.y = Math.PI / 6;
    scene.add(batGroup);

    setIsLoaded(true);

    // 4. Mouse Inertia Parallax (Restricted to 5-8 degrees)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (event.clientX / innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / innerHeight) * 2 + 1;

      // Max 8 degrees (0.14 rads)
      targetRotY = mouseX * 0.14;
      targetRotX = -mouseY * 0.14;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp Mouse Rotation
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      batGroup.rotation.x = currentRotX;
      batGroup.rotation.y = Math.PI / 6 + currentRotY;

      // Gentle floating sine wave
      batGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <img
          src={fallbackImage || 'https://cdn.shopify.com/s/files/1/0654/1234/files/cricket-bat-hero.png'}
          alt="SSD Sports Pro Bat"
          className="max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_20px_40px_rgba(255,46,77,0.3)] hover:scale-105 transition-transform duration-700"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[620px] flex items-center justify-center">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-wider animate-pulse">
          Loading 3D Experience...
        </div>
      )}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
