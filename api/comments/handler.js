'use strict';

const { v4: uuidv4 } = require('uuid');
const pool = require('../../db/pool');

const getCommentsByRecipe = async (request, h) => {
  const { recipeId } = request.params;
  try {
    const result = await pool.query('SELECT * FROM comments WHERE recipe_id = $1 ORDER BY created_at DESC', [recipeId]);
    return h.response(result.rows).code(200);
  } catch (err) {
    console.error('Error fetching comments:', err);
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
};

const createComment = async (request, h) => {
  const { recipeId } = request.params;
  const { userName, text } = request.payload;
  const id = uuidv4();

  try {
    const result = await pool.query(
      'INSERT INTO comments (id, recipe_id, user_name, text) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, recipeId, userName, text]
    );
    return h.response(result.rows[0]).code(201);
  } catch (err) {
    console.error('Error creating comment:', err);
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
};

const updateComment = async (request, h) => {
  const { commentId } = request.params;
  const { text } = request.payload;

  try {
    const result = await pool.query(
      'UPDATE comments SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [text, commentId]
    );

    if (result.rows.length === 0) {
      return h.response({ message: 'Comment not found' }).code(404);
    }
    return h.response(result.rows[0]).code(200);
  } catch (err) {
    console.error('Error updating comment:', err);
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
};

const deleteComment = async (request, h) => {
  const { commentId } = request.params;

  try {
    const result = await pool.query('DELETE FROM comments WHERE id = $1 RETURNING *', [commentId]);

    if (result.rowCount === 0) {
      return h.response({ message: 'Comment not found' }).code(404);
    }
    return h.response({ message: 'Comment deleted successfully' }).code(200);
  } catch (err) {
    console.error('Error deleting comment:', err);
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
};

module.exports = {
  getCommentsByRecipe,
  createComment,
  updateComment,
  deleteComment,
};