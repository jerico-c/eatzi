// src/components/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { Clock, User, ThumbsUp, ListChecks, Soup, BookOpen, AlertTriangle, Zap, MessageSquare, Send, Edit3, Trash2 } from 'lucide-react';

// Sesuaikan dengan URL dan port backend Hapi.js Anda
const API_BASE_URL = 'http://localhost:3001';

const PlaceholderRecipeImage = ({ title }) => {
    return (
        <div className="w-full h-64 md:h-96 bg-gradient-to-br from-foodie-200 to-foodie-300 flex flex-col items-center justify-center text-foodie-600 rounded-lg shadow-md p-4 text-center">
            <Soup size={64} strokeWidth={1.5} />
            <p className="mt-2 text-sm font-medium">Gambar untuk {title || "resep"}</p>
        </div>
    );
};

const RecipeDetail = ({ recipe }) => {
  if (!recipe || typeof recipe !== 'object' || Object.keys(recipe).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Detail Resep Tidak Tersedia</h2>
        <p className="text-gray-600">Maaf, kami tidak dapat memuat detail untuk resep ini.</p>
      </div>
    );
  }

  const title = recipe.Title || "Resep Tanpa Judul";
  const ingredientsString = recipe.Ingredients || "";
  const servings = recipe.Servings || 'N/A';
  const difficulty = recipe.Difficulty || 'N/A';
  const caloriesRaw = recipe.Kalori;
  const prepTime = recipe.Prep_Time || 'N/A';
  const cookingTime = recipe.Cooking_Time || 'N/A';
  const loves = recipe.Loves !== undefined ? recipe.Loves : 'N/A';
  const imageUrl = recipe.Image_Name ? `/images/${recipe.Image_Name}` : null;

  const stepsSource = recipe.Steps || recipe.strInstructions;
  const stepsRaw = stepsSource || "";

  let caloriesDisplay = 'N/A';
  let showCalories = false;

  if (typeof caloriesRaw === 'number' && caloriesRaw > 0) {
    caloriesDisplay = `${Math.round(caloriesRaw)} Kalori`;
    showCalories = true;
  } else if (typeof caloriesRaw === 'string' && caloriesRaw.trim() !== '' && !isNaN(parseFloat(caloriesRaw))) {
    const parsedCalories = parseFloat(caloriesRaw);
    if (parsedCalories > 0) {
        caloriesDisplay = `${Math.round(parsedCalories)} Kalori`;
        showCalories = true;
    }
  } else if (typeof caloriesRaw === 'string' && caloriesRaw.trim() !== '' && caloriesRaw.trim().toLowerCase() !== 'n/a') {
    caloriesDisplay = caloriesRaw;
    showCalories = true;
  }

  const ingredientsList = typeof ingredientsString === 'string' && ingredientsString.trim() !== ''
    ? ingredientsString.split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(ingredient => ingredient !== "")
    : [];

  const stepsList = typeof stepsRaw === 'string' && stepsRaw.trim() !== ''
    ? stepsRaw.split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(step => step.trim() !== "")
    : [];

  const mainIngredientsString = recipe.Cleaned_Ingredients || "";
  const mainIngredientsList = typeof mainIngredientsString === 'string'
    ? mainIngredientsString.split(',').map(item => item.trim()).filter(item => item)
    : [];

  // State untuk Komentar
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentUser, setNewCommentUser] = useState('');
  const [editingComment, setEditingComment] = useState(null); // { id: string, text: string, userName: string }
  const [editText, setEditText] = useState('');

  // Fungsi untuk membuat ID resep yang akan dikirim ke API
  // Konsistenkan dengan cara Anda mengidentifikasi resep di backend
  const getRecipeIdForApi = (recipeTitle) => {
    if (!recipeTitle) return null;
    return recipeTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  };
  
  const recipeIdForApi = getRecipeIdForApi(recipe.Title);

  // Fungsi untuk mengambil komentar
  const fetchComments = async () => {
    if (!recipeIdForApi) return;
    setIsLoadingComments(true);
    setCommentError('');
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeIdForApi}/comments`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Gagal mengambil komentar`);
      }
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []); // Pastikan data adalah array
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentError(error.message);
      setComments([]); // Kosongkan komentar jika ada error
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (recipeIdForApi) {
        fetchComments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeIdForApi]); // Hanya fetch ulang jika recipeIdForApi berubah

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !newCommentUser.trim()) {
      alert("Nama pengguna dan isi komentar tidak boleh kosong.");
      return;
    }
    if (!recipeIdForApi) {
        setCommentError("ID Resep tidak valid untuk menambahkan komentar.");
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeIdForApi}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: newCommentUser, text: newCommentText }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Gagal menambahkan komentar');
      }
      const addedComment = await response.json();
      setComments(prevComments => [addedComment, ...prevComments]); // Tambah di awal agar tampil paling atas
      setNewCommentText('');
      setNewCommentUser('');
      setCommentError('');
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentError("Gagal menambahkan komentar: " + error.message);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditText(comment.text);
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editText.trim()) return;
    // Di aplikasi nyata, Anda mungkin ingin validasi nama pengguna di sini jika diizinkan diedit.
    // Untuk sekarang, kita hanya mengizinkan edit teks.
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText /* , userName: editingComment.userName (jika ingin update nama juga) */ }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Gagal memperbarui komentar');
      }
      const updatedComment = await response.json();
      setComments(prevComments => 
        prevComments.map(c => (c.id === updatedComment.id ? updatedComment : c))
      );
      setEditingComment(null);
      setEditText('');
      setCommentError('');
    } catch (error) {
      console.error("Error updating comment:", error);
      setCommentError("Gagal memperbarui komentar: " + error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Gagal menghapus komentar');
      }
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      setCommentError('');
    } catch (error) {
      console.error("Error deleting comment:", error);
      setCommentError("Gagal menghapus komentar: " + error.message);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 md:py-8">
      <article className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Bagian Detail Resep */}
        <div className="md:flex">
          <div className="md:w-1/2 xl:w-2/5 md:flex-shrink-0">
            {imageUrl ? (
              <img
                className="h-64 w-full object-cover md:h-full"
                src={imageUrl}
                alt={`Gambar ${title}`}
              />
            ) : (
              <PlaceholderRecipeImage title={title} />
            )}
          </div>
          <div className="p-6 md:p-8 flex-grow">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              {title}
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm text-gray-600 mb-8">
              {prepTime !== 'N/A' && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-foodie-500 flex-shrink-0" /> 
                  <span>Persiapan: {prepTime}</span>
                </div>
              )}
              {cookingTime !== 'N/A' && (
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-foodie-500 flex-shrink-0" /> 
                  <span>Memasak: {cookingTime}</span>
                </div>
              )}
              {servings !== 'N/A' && (
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-foodie-500 flex-shrink-0" /> 
                  <span>Porsi: {servings}</span>
                </div>
              )}
              {difficulty !== 'N/A' && (
                <div className="flex items-center">
                  <Soup size={16} className="mr-2 text-foodie-500 flex-shrink-0" /> 
                  <span>Kesulitan: {difficulty}</span>
                </div>
              )}
              {showCalories && (
                <div className="flex items-center">
                  <Zap size={16} className="mr-2 text-yellow-500 flex-shrink-0" /> 
                  <span>{caloriesDisplay}</span>
                </div>
              )}
              <div className="flex items-center">
                <ThumbsUp size={16} className="mr-2 text-green-500 flex-shrink-0" /> 
                <span>Disukai: {loves}</span>
              </div>
            </div>

            {mainIngredientsList.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
                        <ListChecks size={20} className="mr-2 text-indigo-600" />
                        Bahan Utama
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {mainIngredientsList.map((ingredient, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm shadow-sm">
                                {ingredient}
                            </span>
                        ))}
                    </div>
                </section>
            )}
            
            {ingredientsList.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <BookOpen size={20} className="mr-2 text-green-600" />
                  Bahan-Bahan Lengkap
                </h2>
                <div className="space-y-2 text-gray-700">
                  {ingredientsList.map((ingredient, index) => (
                    <div key={index} className="flex items-start leading-relaxed">
                      <span className="font-semibold mr-2">{index + 1}.</span>
                      <span>{ingredient}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Bagian Langkah-langkah Pembuatan */}
        <div className="p-6 md:p-8 border-t border-gray-200">
          <section id="instructions">
            <h2 className="text-2xl font-semibold text-gray-700 mb-5 flex items-center">
              <Soup size={24} className="mr-3 text-blue-600" />
              Langkah-Langkah Pembuatan
            </h2>
            {stepsList.length > 0 ? (
              <div className="space-y-5 text-gray-700">
                {stepsList.map((step, index) => (
                  <div key={index} className="flex items-start text-base">
                    <span 
                        className="font-semibold mr-3 flex-shrink-0 mt-0.5"
                    >
                      {index + 1}.
                    </span>
                    <div className="leading-relaxed break-words">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-base">Informasi langkah pembuatan tidak tersedia untuk resep ini.</p>
            )}
          </section>

          {/* Bagian Komentar */}
          <section id="comments" className="mt-10 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
              <MessageSquare size={24} className="mr-3 text-purple-600" />
              Komentar ({comments.length})
            </h2>

            <form onSubmit={handleAddComment} className="mb-8 p-4 bg-gray-50 rounded-lg shadow">
              <div className="mb-4">
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Nama Anda</label>
                <input
                  type="text"
                  id="userName"
                  value={newCommentUser}
                  onChange={(e) => setNewCommentUser(e.target.value)}
                  placeholder="Tulis nama Anda..."
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-foodie-500 focus:border-foodie-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">Komentar Anda</label>
                <textarea
                  id="commentText"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Tulis komentar Anda di sini..."
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-foodie-500 focus:border-foodie-500"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-foodie-500 text-white rounded-md hover:bg-foodie-600 flex items-center transition-colors duration-150"
              >
                <Send size={18} className="mr-2" /> Kirim Komentar
              </button>
            </form>

            {commentError && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm">{commentError}</p>}

            {isLoadingComments && <p className="text-gray-600 py-4 text-center">Memuat komentar...</p>}
            {!isLoadingComments && comments.length === 0 && !commentError && (
              <p className="text-gray-500 italic py-4 text-center">Belum ada komentar untuk resep ini. Jadilah yang pertama!</p>
            )}
            {!isLoadingComments && comments.length > 0 && (
              <div className="space-y-6">
                {comments.map((comment) => ( // Komentar sudah diurutkan dari terbaru saat add
                  <div key={comment.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-gray-800 break-all">{comment.userName}</p>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {editingComment && editingComment.id === comment.id ? (
                      <div className="mt-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows="3"
                          className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:ring-foodie-500 focus:border-foodie-500"
                        />
                        <div className="flex items-center gap-2">
                            <button onClick={handleUpdateComment} className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors duration-150">Simpan</button>
                            <button onClick={() => setEditingComment(null)} className="px-3 py-1.5 bg-gray-300 text-sm rounded-md hover:bg-gray-400 transition-colors duration-150">Batal</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap break-words py-1">{comment.text}</p>
                    )}
                    {!editingComment || editingComment.id !== comment.id ? (
                        <div className="mt-3 flex items-center space-x-3 pt-2 border-t border-gray-100">
                            <button 
                                onClick={() => handleEditComment(comment)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-150"
                                title="Edit Komentar"
                            >
                                <Edit3 size={14} className="mr-1" /> Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs text-red-600 hover:text-red-800 flex items-center transition-colors duration-150"
                                title="Hapus Komentar"
                            >
                                <Trash2 size={14} className="mr-1" /> Hapus
                            </button>
                        </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </article>
    </div>
  );
};

export default RecipeDetail;