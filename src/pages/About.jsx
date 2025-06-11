import React from 'react';
import { Package, Scale3D, Rotate3D } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from '../components/Header'; 


const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-foodie-100 to-foodie-200 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-800">Tentang <span className="text-foodie-600">Eatzi</span></h1>
        <p className="text-lg md:text-xl text-gray-700 mt-2">Mengenal lebih dekat apa itu Eatzi dan tim di belakangnya.</p>
      </div>
    </section>
  );
};

const ProjectDefinition = () => {
  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-foodie-600">Definisi Proyek</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          Eatzi adalah aplikasi rekomendasi resep berbasis Machine Learning. Cukup foto atau masukin bahan-bahanmu dan kami akan berikan resep yang cocok. Tujuannya simpel: biar kamu bisa masak enak tanpa pusing dan mengurangi sisa makanan di kulkas.
        </p>
      </CardContent>
    </Card>
  );
};


const HowItWorks = () => { 
   return ( 
     <section className="mb-8"> 
       <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-foodie-600">Cara Kerjanya</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-3 gap-6"> 
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300"> 
                    <CardContent className="p-4 md:p-6"> 
                        <div className="flex items-center mb-3"> 
                        <div className="bg-foodie-100 p-2 rounded-full mr-3"> 
                            <Package className="text-foodie-600" size={20} /> 
                        </div> 
                        <h3 className="font-semibold text-lg text-foodie-600">Masukkan Bahan</h3> 
                        </div> 
                        <p className="text-gray-600 text-sm md:text-base">Ketik bahan yang Anda miliki atau ambil fotonya. Machine Learning kami akan mengidentifikasinya.</p> 
                    </CardContent> 
                </Card> 
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300"> 
                    <CardContent className="p-4 md:p-6"> 
                        <div className="flex items-center mb-3"> 
                        <div className="bg-foodie-100 p-2 rounded-full mr-3"> 
                            <Scale3D className="text-foodie-600" size={20} /> 
                        </div> 
                        <h3 className="font-semibold text-lg text-foodie-600">Cari Resepnya</h3> 
                        </div> 
                        <p className="text-gray-600 text-sm md:text-base">Cari resep yang sesuai sama kamu. Lagi-lagi Machine Learning kami akan carikan resep yang cocok buat kamu</p> 
                    </CardContent> 
                </Card> 
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300"> 
                    <CardContent className="p-4 md:p-6"> 
                        <div className="flex items-center mb-3"> 
                        <div className="bg-foodie-100 p-2 rounded-full mr-3"> 
                            <Rotate3D className="text-foodie-600" size={20} /> 
                        </div> 
                        <h3 className="font-semibold text-lg text-foodie-600">Masak dan Enjoy</h3> 
                        </div> 
                        <p className="text-gray-600 text-sm md:text-base">Selamat memasak, Ikuti resep ini biar bahan-bahan segarmu jadi makanan sehat yang enak. Enjoy makan!</p> 
                    </CardContent> 
                </Card> 
            </div> 
        </CardContent>
       </Card>
     </section> 
   ); 
 };
 

const TeamMembers = () => {
  const teamMembers = [
    { name: 'Jerico Christianto', role: 'Frontend & Backend' },
    { name: 'M. Nur Alfin Huda', role: 'Machine Learning' },
    { name: 'Sultan Caesar Al-zaky', role: 'Machine Learning' },
    { name: 'A. Bachtiar Fawwaz', role: 'Frontend & Backend' },
    { name: 'Leonardus A. Widjayanto', role: 'Machine Learning' }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-foodie-600">Tim Kami</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="w-60 p-4 text-center hover:shadow-xl transition-shadow duration-300">
              
              <h3 className="font-semibold text-lg text-gray-800">{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <HeroSection />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          <ProjectDefinition />

          <HowItWorks />

          <TeamMembers />

        </div>
      </main>
    </div>
  );
};

export default About;