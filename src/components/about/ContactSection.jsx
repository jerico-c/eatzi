
import React from 'react';
import { Mail } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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
                Have suggestions, feedback, or questions? We'd love to hear from you! Our team is constantly working to improve FoodieMatch based on user feedback.
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

export default ContactSection;
