import React, { useState, useEffect } from 'react';
import { Clock, User, ThumbsUp, ThumbsDown, MessageSquare, Send, Edit3, Trash2 } from 'lucide-react'; // Tambahkan ikon
import { useRecipe } from '../context/RecipeContext';
import { toast } from 'sonner';

// Asumsi base URL untuk API backend Anda
const API_BASE_URL = 'http://localhost:3000'; // Sesuaikan jika berbeda

const RecipeDetail = ({ recipe }) => {
  const { likeRecipe, dislikeRecipe } = useRecipe();
  const [hasVoted, setHasVoted] = useState(false);

  // State untuk komentar
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentUsername, setNewCommentUsername] = useState(''); // Nanti bisa diganti dengan user yang login

  // State untuk edit komentar
  const [editingComment, setEditingComment] = useState(null); // { id: 'commentId', text: 'current text' }
  const [editText, setEditText] = useState('');


  // Fungsi untuk mengambil komentar
  const fetchComments = async (recipeId) => {
    if (!recipeId) return;
    setIsLoadingComments(true);
    setCommentError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`);
      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setCommentError(error.message);
      toast.error("Could not load comments.");
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Ambil komentar saat komponen dimuat atau recipe.id berubah
  useEffect(() => {
    if (recipe && recipe.id) {
      fetchComments(recipe.id);
    }
  }, [recipe]);

  const handleLike = () => {
    if (!hasVoted) {
      likeRecipe(recipe.id);
      setHasVoted(true);
      toast.success('Thanks for your feedback!');
    } else {
      toast.info('You have already voted on this recipe');
    }
  };

  const handleDislike = () => {
    if (!hasVoted) {
      dislikeRecipe(recipe.id);
      setHasVoted(true);
      toast.success('Thanks for your feedback!');
    } else {
      toast.info('You have already voted on this recipe');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !newCommentUsername.trim()) {
      toast.error("Username and comment cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newCommentUsername,
          text: newCommentText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add comment: ${response.statusText}`);
      }

      const addedComment = await response.json();
      setComments([addedComment, ...comments]); // Tambahkan di awal array untuk urutan terbaru
      setNewCommentText('');
      setNewCommentUsername(''); // Kosongkan username juga, atau sesuaikan dengan logic user login
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(`Failed to add comment: ${error.message}`);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditText(comment.text);
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editText.trim()) {
        toast.error("Comment text cannot be empty.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}/comments/${editingComment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Jika ada autentikasi, tambahkan header Authorization di sini
                // 'Authorization': `Bearer ${yourAuthToken}`
            },
            body: JSON.stringify({ text: editText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update comment: ${response.statusText}`);
        }
        const updatedComment = await response.json();
        setComments(comments.map(c => c.id === updatedComment.id ? updatedComment : c));
        setEditingComment(null);
        setEditText('');
        toast.success("Comment updated successfully!");
    } catch (error) {
        console.error("Error updating comment:", error);
        toast.error(`Failed to update comment: ${error.message}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                // Jika ada autentikasi, tambahkan header Authorization di sini
                // 'Authorization': `Bearer ${yourAuthToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete comment: ${response.statusText}`);
        }
        setComments(comments.filter(c => c.id !== commentId));
        toast.success("Comment deleted successfully!");
    } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error(`Failed to delete comment: ${error.message}`);
    }
  };


  if (!recipe) {
    return <div>Loading recipe details...</div>; // Atau tampilan loading yang lebih baik
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-64 sm:h-80">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.dietaryPreferences.map(pref => (
            <span 
              key={pref}
              className="bg-foodie-100 text-foodie-800 px-3 py-1 rounded-full text-sm"
            >
              {pref}
            </span>
          ))}
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{recipe.title}</h1>
        
        <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
          <div className="flex items-center">
            <Clock className="mr-2" size={18} />
            <div>
              <p className="font-medium">Time</p>
              <p>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} mins</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="mr-2" size={18} />
            <div>
              <p className="font-medium">Servings</p>
              <p>{recipe.servings}</p>
            </div>
          </div>
        </div>
        
        {recipe.nutritionInfo && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Nutrition Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="text-center p-2">
                  <p className="text-gray-500 text-sm">Calories</p>
                  <p className="font-bold text-lg">{recipe.nutritionInfo.calories}</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-gray-500 text-sm">Protein</p>
                  <p className="font-bold text-lg">{recipe.nutritionInfo.protein}g</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-gray-500 text-sm">Carbs</p>
                  <p className="font-bold text-lg">{recipe.nutritionInfo.carbs}g</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-gray-500 text-sm">Fat</p>
                  <p className="font-bold text-lg">{recipe.nutritionInfo.fat}g</p>
                </div>
                <div className="text-center p-2">
                  <p className="text-gray-500 text-sm">Fiber</p>
                  <p className="font-bold text-lg">{recipe.nutritionInfo.fiber}g</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <ul className="bg-gray-50 rounded-lg p-4 flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient) => (
              <li 
                key={ingredient.id}
                className="bg-white border border-gray-200 px-3 py-2 rounded-full text-gray-700 flex items-center"
              >
                {ingredient.image && (
                  <img 
                    src={ingredient.image} 
                    alt={ingredient.name} 
                    className="w-6 h-6 rounded-full object-cover mr-2"
                  />
                )}
                {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="bg-foodie-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-700">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Rate this recipe</h2>
          <div className="flex gap-4">
            <button
              onClick={handleLike}
              disabled={hasVoted}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-colors ${
                hasVoted ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <ThumbsUp size={18} />
              <span>{recipe.likes || 0} Likes</span>
            </button>
            
            <button
              onClick={handleDislike}
              disabled={hasVoted}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg transition-colors ${
                hasVoted ? 'bg-gray-100 text-gray-400' : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <ThumbsDown size={18} />
              <span>{recipe.dislikes || 0} Dislikes</span>
            </button>
          </div>
        </div>

        {/* Bagian Komentar */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <MessageSquare className="mr-2" size={22}/> Comments ({comments.length})
          </h2>

          {/* Form Tambah Komentar */}
          <form onSubmit={handleAddComment} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="mb-3">
              <label htmlFor="commentUsername" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name:
              </label>
              <input
                type="text"
                id="commentUsername"
                value={newCommentUsername}
                onChange={(e) => setNewCommentUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-foodie-500 focus:border-foodie-500 sm:text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="commentText" className="block text-sm font-medium text-gray-700 mb-1">
                Your Comment:
              </label>
              <textarea
                id="commentText"
                rows="3"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-foodie-500 focus:border-foodie-500 sm:text-sm"
                placeholder="Write your comment here..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-foodie-500 hover:bg-foodie-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={18} />
              Add Comment
            </button>
          </form>

          {/* Daftar Komentar */}
          {isLoadingComments && <p className="text-gray-500">Loading comments...</p>}
          {commentError && <p className="text-red-500">Error: {commentError}</p>}
          {!isLoadingComments && !commentError && comments.length === 0 && (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
          
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded-lg bg-white shadow-sm">
                {editingComment && editingComment.id === comment.id ? (
                    <div>
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-foodie-500 focus:border-foodie-500 sm:text-sm mb-2"
                        />
                        <div className="flex gap-2">
                            <button 
                                onClick={handleSaveEdit}
                                className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                            >
                                Save
                            </button>
                            <button 
                                onClick={() => setEditingComment(null)}
                                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-semibold text-gray-800">{comment.username}</p>
                            <p className="text-xs text-gray-400">
                            {new Date(comment.created_at).toLocaleString()}
                            {comment.updated_at !== comment.created_at && ` (edited ${new Date(comment.updated_at).toLocaleString()})`}
                            </p>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                        {/* Tombol Edit & Delete (TODO: tambahkan logic otorisasi) */}
                        {/* Untuk saat ini, anggap semua bisa diedit/dihapus untuk demonstrasi */}
                        {/* Dalam aplikasi nyata, Anda perlu memeriksa apakah user yang login adalah pemilik komentar */}
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={() => handleEditComment(comment)}
                                className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                title="Edit Comment"
                            >
                                <Edit3 size={14} /> Edit
                            </button>
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                                title="Delete Comment"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;