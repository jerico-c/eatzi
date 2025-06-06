
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Card, CardContent } from "@/components/ui/card";

const ThreedVisualizer = () => {
  const canvasRef = useRef(null);

  // Setup 3D scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    
    // Create geometry
    const geometry = new THREE.TorusKnotGeometry(3, 0.8, 64, 16);
    const material = new THREE.MeshPhongMaterial({
      color: 0xFB9A60,
      emissive: 0xFECDB1,
      specular: 0xFDE1D3,
      shininess: 50
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 10;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      scene.remove(torusKnot);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex justify-center mb-16">
      <Card className="overflow-hidden border-none">
        <CardContent className="p-0">
          <div className="w-[300px] h-[300px] relative bg-gradient-to-br from-foodie-50 to-white rounded-lg shadow-inner">
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreedVisualizer;
