
import React from 'react';
import { Package, Scale3D, Rotate3D } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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
            <p className="text-gray-600">Type in ingredients you have or snap a photo of them with your camera. Our AI will identify and categorize them.</p>
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
            <p className="text-gray-600">Filter recipes by dietary needs like vegetarian, vegan, or gluten-free to find exactly what suits your lifestyle.</p>
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
            <p className="text-gray-600">Get personalized recipe suggestions based on what you have available. View detailed instructions and nutritional information.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default HowItWorks;
