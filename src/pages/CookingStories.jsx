// src/pages/CookingStories.jsx

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const API_URL = 'https://eatzi-api-production.up.railway.app';

const CookingStories = () => {
    const [stories, setStories] = useState([]);
    const [name, setName] = useState('');
    const [story, setStory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    // ... (useEffect dan fetchStories tidak berubah)
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(`${API_URL}/testimonials`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setStories(data);
            } catch (error) {
                console.error("Failed to fetch stories:", error);
                setError("Could not load stories. Please check your connection.");
            }
        };
        fetchStories();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // --- PERBAIKAN: TAMBAHKAN BLOK VALIDASI DI SINI ---
        if (name.trim().length < 3) {
            setError("Nama minimal harus 3 karakter.");
            return; // Hentikan eksekusi jika nama tidak valid
        }
        if (story.trim().length < 10) {
            setError("Cerita minimal harus 10 karakter.");
            return; // Hentikan eksekusi jika cerita tidak valid
        }
        // --- AKHIR BLOK VALIDASI ---

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
                throw new Error(errorData.message || 'Something went wrong');
            }

            setName('');
            setStory('');
            setEditingId(null);
            // Panggil fetchStories lagi untuk refresh data
            const fetchResponse = await fetch(`${API_URL}/testimonials`);
            const data = await fetchResponse.json();
            setStories(data);

        } catch (err) {
            console.error('Failed to submit story:', err);
setError(err.message);
        }
    };

    // ... (fungsi handleEdit dan handleDelete tidak berubah)
    const handleEdit = (testimonial) => {
        setEditingId(testimonial.id);
        setName(testimonial.name);
        setStory(testimonial.story);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' });
                // Refresh stories setelah delete
                const fetchResponse = await fetch(`${API_URL}/testimonials`);
                const data = await fetchResponse.json();
                setStories(data);
            } catch (err) {
                setError('Failed to delete story.');
            }
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />


            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">Cooking Stories</h1>
                
                <Card className="mb-8 max-w-2xl mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">{editingId ? 'Edit Your Story' : 'Share Your Cooking Story!'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input 
                                placeholder="Your Name (min. 3 karakter)" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                            <Textarea 
                                placeholder="Tell us your story... (min. 10 karakter)" 
                                value={story} 
                                onChange={(e) => setStory(e.target.value)} 
                                required 
                                rows={5}
                            />
                            <div className="flex items-center gap-4">
                                <Button type="submit">{editingId ? 'Update Story' : 'Submit Story'}</Button>
                                {editingId && (
                                <Button variant="outline" onClick={() => { setEditingId(null); setName(''); setStory(''); setError(null); }}>
                                    Cancel Edit
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
                        <Card key={s.id} className="flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="text-foodie-700">{s.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-gray-600">{s.story}</p>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-2 bg-gray-50 p-3">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(s)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CookingStories;