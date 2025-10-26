import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const HiveGrid = ({ mods, selectedModId, onSelectMod }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const hexesRef = useRef([]);
  const particlesRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable': return 0xD97C3E; // Copper
      case 'warning': return 0xFFD85C; // Golden light
      case 'critical': return 0xFF6B6B; // Red
      default: return 0xC68E17; // Matte amber
    }
  };

  const calculateHexPosition = (index, total) => {
    const radius = 250;
    const angle = (index / total) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ];
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Three.js setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xF5C542); // Deep amber

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create hexagons
    const geometry = new THREE.CylinderGeometry(60, 60, 10, 6);
    hexesRef.current = [];

    mods.forEach((mod, index) => {
      const [x, y] = calculateHexPosition(index, mods.length);
      const material = new THREE.MeshStandardMaterial({
        color: getStatusColor(mod.status),
        emissive: getStatusColor(mod.status),
        emissiveIntensity: 0.2,
        metalness: 0.4,
        roughness: 0.6
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, 0);
      mesh.modId = mod.id;
      mesh.modData = mod;
      scene.add(mesh);
      hexesRef.current.push({ mesh, mod });
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFFD85C, 1);
    pointLight.position.set(0, 0, 300);
    scene.add(pointLight);

    // Particle system for energy flow
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 800;
      positions[i + 1] = (Math.random() - 0.5) * 800;
      positions[i + 2] = Math.random() * 50;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xFFD85C,
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6
    });

    particlesRef.current = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesRef.current);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.z += 0.0005;
        particlesRef.current.rotation.y += 0.0003;
      }

      // Pulse selected hex
      hexesRef.current.forEach(({ mesh, mod }) => {
        if (mod.id === selectedModId) {
          mesh.scale.z = 1 + Math.sin(Date.now() * 0.003) * 0.2;
          mesh.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;
        } else {
          mesh.scale.z = 1;
          mesh.material.emissiveIntensity = 0.2;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      for (let intersection of intersects) {
        if (intersection.object.modId) {
          onSelectMod(intersection.object.modId);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [mods, selectedModId, onSelectMod]);

  return <div ref={containerRef} className="hive-grid" style={{ width: '100%', height: '100%' }} />;
};

export default HiveGrid;