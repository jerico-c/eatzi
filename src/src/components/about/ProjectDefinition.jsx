
import React from 'react';

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

export default ProjectDefinition;
