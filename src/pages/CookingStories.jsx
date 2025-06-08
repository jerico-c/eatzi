import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen, Edit2, Trash2, XCircle } from 'lucide-react';

const API_URL = 'https://eatzi-api-production.up.railway.app';

const CookingStories = () => {
    const [stories, setStories] = useState([]);
    const [name, setName] = useState('');
    const [story, setStory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    // --- FUNGSI-FUNGSI TIDAK BERUBAH ---
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(`${API_URL}/testimonials`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setStories(data);
            } catch (error) {
                console.error("Failed to fetch stories:", error);
                setError("Tidak dapat memuat cerita. Silakan periksa koneksi Anda.");
            }
        };
        fetchStories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (name.trim().length < 3) {
            setError("Nama minimal harus 3 karakter.");
            return;
        }
        if (story.trim().length < 10) {
            setError("Cerita minimal harus 10 karakter.");
            return;
        }

        const testimonialData = { name, story };
        const url = editingId ? `${API_URL}/testimonials/${editingId}` : `${API_URL}/testimonials`;
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testimonialData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Terjadi kesalahan');
            }

            setName('');
            setStory('');
            setEditingId(null);
            const fetchResponse = await fetch(`${API_URL}/testimonials`);
            const data = await fetchResponse.json();
            setStories(data);

        } catch (err) {
            console.error('Failed to submit story:', err);
            setError(err.message);
        }
    };

    const handleEdit = (testimonial) => {
        setEditingId(testimonial.id);
        setName(testimonial.name);
        setStory(testimonial.story);
        document.getElementById('story-form').scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus cerita ini?')) {
            try {
                await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' });
                const fetchResponse = await fetch(`${API_URL}/testimonials`);
                const data = await fetchResponse.json();
                setStories(data);
            } catch (err) {
                setError('Gagal menghapus cerita.');
            }
        }
    };

    // --- TAMPILAN JSX DIPERBARUI ---
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <section className="bg-foodie-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-foodie-600 mb-4" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Cerita Dapur Pengguna</h1>
                    <p className="mt-2 text-lg text-gray-600">Bagikan pengalaman memasakmu dan lihat cerita dari yang lain!</p>
                </div>
            </section>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                
                <Card id="story-form" className="mb-12 max-w-2xl mx-auto shadow-lg border-t-4 border-foodie-500">
                    <CardHeader>
                        <CardTitle className="text-2xl text-gray-800">
                            {editingId ? 'Edit Cerita Anda' : 'Bagikan Cerita Memasak Anda!'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            {/* Input Nama dengan margin bottom */}
                            <div className="mb-4">
                                <Input 
                                    placeholder="Nama Anda (min. 3 karakter)" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    className="text-base"
                                />
                            </div>

                            {/* Textarea Cerita dengan margin bottom */}
                            <div className="mb-6">
                                <Textarea 
                                    placeholder="Ceritakan pengalaman memasakmu di sini... (min. 10 karakter)" 
                                    value={story} 
                                    onChange={(e) => setStory(e.target.value)} 
                                    required 
                                    rows={5}
                                    className="text-base"
                                />
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex items-center gap-4">
                                <Button type="submit" size="lg">{editingId ? 'Perbarui Cerita' : 'Kirim Cerita'}</Button>
                                {editingId && (
                                <Button variant="ghost" onClick={() => { setEditingId(null); setName(''); setStory(''); setError(null); }}>
                                    <XCircle className="mr-2 h-4 w-4" /> Batal Edit
                                </Button>
                                )}
                            </div>
                        </form>
                        {error && (
                            <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{`Error: ${error}`}</p>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stories.map((s) => (
                        <Card key={s.id} className="flex flex-col bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden">
                            <CardHeader className="bg-foodie-50 p-4">
                                <CardTitle className="text-foodie-700 text-lg">{s.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                                <p className="text-gray-700 leading-relaxed">{s.story}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2 bg-gray-50 p-3 border-t">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(s)}>
                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {stories.length === 0 && !error && (
                     <div className="text-center py-16 text-gray-500">
                        <p>Belum ada cerita yang dibagikan. Jadilah yang pertama!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CookingStories;