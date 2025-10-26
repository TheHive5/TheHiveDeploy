import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const HiveGrid = ({ mods, selectedModId, onSelectMod }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const hexagonsRef = useRef([]);
  const particlesRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5C542);
    sceneRef.current = scene;

    // Camera setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 25;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFD85C, 1);
    pointLight.position.set(10, 10, 15);
    scene.add(pointLight);

    // Create hexagons for each mod
    const hexagons = [];
    const group = new THREE.Group();

    mods.forEach((mod, index) => {
      const angle = (index / mods.length) * Math.PI * 2;
      const x = Math.cos(angle) * 12;
      const y = Math.sin(angle) * 12;

      // Create hexagon geometry
      const geometry = new THREE.CylinderGeometry(3, 3, 1, 6);
      
      // Color based on status
      let color = 0x2ECC71; // stable - green
      if (mod.status === 'warning') color = 0xF39C12; // orange
      if (mod.status === 'critical') color = 0xE74C3C; // red

      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: 0x000000,
        shininess: 100
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, 0);
      mesh.userData = { modId: mod.id, mod: mod };

      group.add(mesh);
      hexagons.push(mesh);
    });

    scene.add(group);
    hexagonsRef.current = hexagons;

    // Create particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 30;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xFFD85C,
      size: 0.3,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate particles
      if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0008;
      }

      // Pulse selected hexagon
      if (selectedModId) {
        const selectedHex = hexagons.find(h => h.userData.modId === selectedModId);
        if (selectedHex) {
          selectedHex.material.emissive.setHex(0xFFD85C);
          selectedHex.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse interaction
    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(hexagons);

      if (intersects.length > 0) {
        onSelectMod(intersects[0].object.userData.modId);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Handle window resize
    const onWindowResize = () => {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onWindowResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [mods, selectedModId, onSelectMod]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default HiveGrid;