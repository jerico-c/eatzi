
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TeamMembers = () => {
  const teamMembers = [
    { name: 'Jerico Christianto', role: 'Frontend Developer & Backend Developer', initials: 'JR' },
    { name: 'Muhammad Nur Alfin Huda', role: 'Machine Learning', initials: 'AL' },
    { name: 'Sultan Caesar Al-zaky', role: 'Machine Learning', initials: 'SL' },
    { name: 'Ahmad Bachtiar Fawwaz', role: 'Frontend Developer & Backend Developer', initials: 'FW' },
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

export default TeamMembers;
