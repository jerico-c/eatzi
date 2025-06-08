import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Mail, Package, Scale3D, Rotate3D } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from '../components/Header'; 

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-foodie-300 to-foodie-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/images/logo.png" 
              alt="Eatzi Logo" 
              className="h-20 md:h-28" 
            />
          </div>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            A smart recipe finder using AI-powered ingredient recognition
          </p>
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-gray-50 fill-current">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"></path>
        </svg>
      </div>
    </section>
  );
};

const ProjectDefinition = () => {
  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foodie-600 mb-6">Project Definition</h2>
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <p className="text-gray-700 mb-4 leading-relaxed">
          Eatzi is an innovative web application designed to transform the cooking experience by leveraging AI technology to identify ingredients from photos and suggest personalized recipes.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Our application aims to reduce food waste and inspire culinary creativity by helping users discover delicious possibilities with ingredients they already have in their kitchen. By simply uploading a photo of available ingredients or typing them in, users receive customized recipe suggestions tailored to their dietary preferences and needs.
        </p>
        <p className="text-gray-700 leading-relaxed">
          This project was developed as part of a collaborative effort to address common cooking challenges and make meal preparation more accessible, efficient, and enjoyable for everyone. Our slogan "eat smart, cook easy" represents our mission to simplify cooking while making it smarter.
        </p>
      </div>
    </section>
  );
};

const ThreedVisualizer = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    
    const geometry = new THREE.TorusKnotGeometry(3, 0.8, 64, 16);
    const material = new THREE.MeshPhongMaterial({
      color: 0xFB9A60,
      emissive: 0xFECDB1,
      specular: 0xFDE1D3,
      shininess: 50
    });
    
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    camera.position.z = 10;
    
    const animate = () => {
      requestAnimationFrame(animate);
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
        const size = canvasRef.current.parentElement.clientWidth;
        renderer.setSize(size, size);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.remove(torusKnot);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex justify-center mb-16">
      <Card className="overflow-hidden border-none bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="w-[300px] h-[300px] relative bg-gradient-to-br from-foodie-50 to-white rounded-lg shadow-inner">
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foodie-600 mb-6">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-foodie-100 p-3 rounded-full mr-4">
                <Package className="text-foodie-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-foodie-600">Input Ingredients</h3>
            </div>
            <p className="text-gray-600">Type in ingredients or snap a photo. Our AI will identify them.</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-foodie-100 p-3 rounded-full mr-4">
                <Scale3D className="text-foodie-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-foodie-600">Select Preferences</h3>
            </div>
            <p className="text-gray-600">Filter recipes by dietary needs like vegetarian, vegan, or gluten-free.</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-foodie-100 p-3 rounded-full mr-4">
                <Rotate3D className="text-foodie-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg text-foodie-600">Discover Recipes</h3>
            </div>
            <p className="text-gray-600">Get personalized recipe suggestions based on what you have.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

const TeamMembers = () => {
  const teamMembers = [
    { name: 'Jerico Christianto', role: 'Frontend & Backend Developer', initials: 'JR' },
    { name: 'Muhammad Nur Alfin Huda', role: 'Machine Learning', initials: 'AL' },
    { name: 'Sultan Caesar Al-zaky', role: 'Machine Learning', initials: 'SL' },
    { name: 'Ahmad Bachtiar Fawwaz', role: 'Frontend & Backend Developer', initials: 'FW' },
    { name: 'Leonardus Adi Widjayanto', role: 'Machine Learning', initials: 'LO' }
  ];

  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foodie-600 mb-6">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarFallback className="bg-foodie-200 text-foodie-700">{member.initials}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg text-foodie-600">{member.name}</h3>
                <p className="text-gray-600 mt-2">{member.role}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-foodie-600 mb-6">Contact Us</h2>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className="bg-foodie-100 p-3 rounded-full mr-4">
              <Mail className="text-foodie-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foodie-600 mb-2">Get In Touch</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Have suggestions, feedback, or questions? We'd love to hear from you!
              </p>
              <a 
                href="mailto:info@foodiematch.com" 
                className="inline-flex items-center text-foodie-600 hover:text-foodie-700 font-medium"
              >
                info@foodiematch.com
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};


// ===== Komponen Utama Halaman About =====

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <HeroSection />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          
          <ProjectDefinition />
          
          <ThreedVisualizer />
          
          <HowItWorks />
          
          <TeamMembers />
          
          <ContactSection />
          
        </div>
      </main>
    </div>
  );
};

export default About;