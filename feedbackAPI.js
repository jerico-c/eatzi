'use strict';

// Import Hapi
const Hapi = require('@hapi/hapi');
// Import Joi for input validation
const Joi = require('joi');

// --- In-Memory Data Store ---
// This object will store feedback for recipes.
// Structure: { "recipeId": { likes: 0, dislikes: 0, usersWhoVoted: Set() } }
// The usersWhoVoted Set is a simple way to prevent multiple votes from the same "user"
// in a session. In a real app with authentication, you'd use actual user IDs.
let recipeFeedbackStore = {};

// --- Server Initialization Function ---
const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3001, // Use environment variable for port or default to 3001
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:8080', 'http://localhost:5173'], // Allow your frontend's origin (Vite default is 5173, common dev is 8080)
                credentials: true,
            },
            validate: {
                failAction: async (request, h, err) => {
                    // Log validation errors for debugging
                    console.error('Validation error:', err.message, err.details);
                    throw err; // Re-throw the error for Hapi to handle (sends 400 response)
                }
            }
        }
    });

    // --- API Plugin for Feedback Routes ---
    const feedbackPlugin = {
        name: 'app/feedback',
        register: async function (server, options) {
            // --- Helper: Ensure a feedback record exists for a recipe ---
            const ensureFeedbackRecord = (recipeId) => {
                if (!recipeFeedbackStore[recipeId]) {
                    recipeFeedbackStore[recipeId] = {
                        likes: 0,
                        dislikes: 0,
                        // usersWhoVoted: new Set() // To track users who voted (simplified for this example)
                    };
                }
            };

            // --- Route Definitions ---

            // GET /api/v1/recipes/{recipeId}/feedback
            // Retrieves feedback (likes/dislikes) for a specific recipe.
            server.route({
                method: 'GET',
                path: '/api/v1/recipes/{recipeId}/feedback',
                handler: (request, h) => {
                    const { recipeId } = request.params;
                    ensureFeedbackRecord(recipeId);
                    const feedback = recipeFeedbackStore[recipeId];
                    return h.response({
                        recipeId,
                        likes: feedback.likes,
                        dislikes: feedback.dislikes,
                    }).code(200);
                },
                options: {
                    description: 'Get feedback for a specific recipe',
                    notes: 'Returns the number of likes and dislikes for the given recipe ID.',
                    tags: ['api', 'v1', 'feedback', 'recipes'],
                    validate: {
                        params: Joi.object({
                            recipeId: Joi.string().required().description('The ID of the recipe'),
                        }),
                    },
                },
            });

            // POST /api/v1/recipes/{recipeId}/like
            // Records a "like" for a specific recipe.
            server.route({
                method: 'POST',
                path: '/api/v1/recipes/{recipeId}/like',
                handler: (request, h) => {
                    const { recipeId } = request.params;
                    // const userId = request.payload?.userId || 'anonymous'; // Example: Get userId if sent

                    ensureFeedbackRecord(recipeId);

                    // Simplified: In a real app, check if userId has already disliked or to allow changing vote.
                    // if (recipeFeedbackStore[recipeId].usersWhoVoted.has(userId + '_dislike')) {
                    //    recipeFeedbackStore[recipeId].dislikes--; // Optionally remove dislike if liking
                    // }
                    // if (!recipeFeedbackStore[recipeId].usersWhoVoted.has(userId + '_like')) {
                    //    recipeFeedbackStore[recipeId].likes++;
                    //    recipeFeedbackStore[recipeId].usersWhoVoted.add(userId + '_like');
                    // }

                    recipeFeedbackStore[recipeId].likes++;
                    console.log(`Liked recipe ${recipeId}. New counts:`, recipeFeedbackStore[recipeId]);

                    return h.response({
                        message: 'Recipe liked successfully.',
                        recipeId,
                        likes: recipeFeedbackStore[recipeId].likes,
                        dislikes: recipeFeedbackStore[recipeId].dislikes,
                    }).code(200);
                },
                options: {
                    description: 'Like a recipe',
                    notes: 'Increments the like count for the specified recipe ID.',
                    tags: ['api', 'v1', 'feedback', 'recipes'],
                    validate: {
                        params: Joi.object({
                            recipeId: Joi.string().required().description('The ID of the recipe to like'),
                        }),
                        // payload: Joi.object({ // Optional: if you send userId or other data
                        //    userId: Joi.string().optional().description('The ID of the user performing the action'),
                        // }).optional()
                    },
                },
            });

            // POST /api/v1/recipes/{recipeId}/dislike
            // Records a "dislike" for a specific recipe.
            server.route({
                method: 'POST',
                path: '/api/v1/recipes/{recipeId}/dislike',
                handler: (request, h) => {
                    const { recipeId } = request.params;
                    // const userId = request.payload?.userId || 'anonymous';

                    ensureFeedbackRecord(recipeId);

                    // Simplified: In a real app, check if userId has already liked or to allow changing vote.
                    // if (recipeFeedbackStore[recipeId].usersWhoVoted.has(userId + '_like')) {
                    //    recipeFeedbackStore[recipeId].likes--; // Optionally remove like if disliking
                    // }
                    // if (!recipeFeedbackStore[recipeId].usersWhoVoted.has(userId + '_dislike')) {
                    //    recipeFeedbackStore[recipeId].dislikes++;
                    //    recipeFeedbackStore[recipeId].usersWhoVoted.add(userId + '_dislike');
                    // }
                    recipeFeedbackStore[recipeId].dislikes++;
                    console.log(`Disliked recipe ${recipeId}. New counts:`, recipeFeedbackStore[recipeId]);

                    return h.response({
                        message: 'Recipe disliked successfully.',
                        recipeId,
                        likes: recipeFeedbackStore[recipeId].likes,
                        dislikes: recipeFeedbackStore[recipeId].dislikes,
                    }).code(200);
                },
                options: {
                    description: 'Dislike a recipe',
                    notes: 'Increments the dislike count for the specified recipe ID.',
                    tags: ['api', 'v1', 'feedback', 'recipes'],
                    validate: {
                        params: Joi.object({
                            recipeId: Joi.string().required().description('The ID of the recipe to dislike'),
                        }),
                        // payload: Joi.object({ // Optional
                        //    userId: Joi.string().optional().description('The ID of the user performing the action'),
                        // }).optional()
                    },
                },
            });

            // GET /api/v1/feedback (Optional: For debugging or admin view)
            // Retrieves all feedback data.
            server.route({
                method: 'GET',
                path: '/api/v1/feedback',
                handler: (request, h) => {
                    return h.response(recipeFeedbackStore).code(200);
                },
                options: {
                    description: 'Get all feedback data',
                    notes: 'Returns the entire feedback store. Useful for debugging.',
                    tags: ['api', 'v1', 'feedback', 'admin'],
                },
            });
        },
    };

    // Register the plugin
    await server.register(feedbackPlugin);

    // Start the server
    await server.start();
    console.log('Eatzi Feedback API Server running on %s', server.info.uri);
    console.log('Current feedback store:', recipeFeedbackStore); // Log initial store
};

// --- Graceful Shutdown ---
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log('Stopping server...');
    // Perform any cleanup here if needed (e.g., saving in-memory data to a file)
    // For now, just exiting.
    process.exit(0);
});

// --- Run the server ---
init();
