'use strict';

const Joi = require('joi');
const commentHandler = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/recipes/{recipeId}/comments',
    handler: commentHandler.getCommentsByRecipe,
    options: {
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({ recipeId: Joi.string().required() }),
      },
    },
  },
  {
    method: 'POST',
    path: '/recipes/{recipeId}/comments',
    handler: commentHandler.createComment,
    options: {
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({ recipeId: Joi.string().required() }),
        payload: Joi.object({
          userName: Joi.string().min(2).max(50).required(),
          text: Joi.string().min(1).max(1000).required(),
        }),
      },
    },
  },
  {
    method: 'PUT',
    path: '/comments/{commentId}',
    handler: commentHandler.updateComment,
    options: {
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({ commentId: Joi.string().guid({ version: ['uuidv4'] }).required() }),
        payload: Joi.object({ text: Joi.string().min(1).max(1000).required() }),
      },
    },
  },
  {
    method: 'DELETE',
    path: '/comments/{commentId}',
    handler: commentHandler.deleteComment,
    options: {
      tags: ['api', 'comments'],
      validate: {
        params: Joi.object({ commentId: Joi.string().guid({ version: ['uuidv4'] }).required() }),
      },
    },
  },
];

module.exports = routes;