
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/about/HeroSection';
import ProjectDefinition from '../components/about/ProjectDefinition';
import ThreedVisualizer from '../components/about/ThreedVisualizer';
import HowItWorks from '../components/about/HowItWorks';
import TeamMembers from '../components/about/TeamMembers';
import ContactSection from '../components/about/ContactSection';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          
          {/* Project Definition Section */}
          <ProjectDefinition />
          
          {/* 3D Visualization */}
          <ThreedVisualizer />
          
          {/* How It Works Section */}
          <HowItWorks />
          
          {/* Team Members Section */}
          <TeamMembers />
          
          {/* Contact Section */}
          <ContactSection />
          
        </div>
      </div>
    </div>
  );
};

export default About;
