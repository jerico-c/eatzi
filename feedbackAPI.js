'use strict';

// Import Hapi
const Hapi = require('@hapi/hapi');
// Import Joi for validation
const Joi = require('joi');

// In-memory store for recipe feedback.
// In a real application, this would be a database.
// Structure: { "recipeId": { likes: 0, dislikes: 0, usersVoted: Set() } }
const recipeFeedbackStore = {};

// Initialize the Hapi server
const init = async () => {
    const server = Hapi.server({
        port: 3000, // You can choose any port
        host: 'localhost',
        routes: {
            cors: { // Enable CORS for frontend interaction
                origin: ['*'], // Allow all origins for development, restrict in production
                credentials: true
            }
        }
    });

    // --- Helper function to initialize feedback for a recipe if it doesn't exist ---
    const ensureFeedbackRecord = (recipeId) => {
        if (!recipeFeedbackStore[recipeId]) {
            recipeFeedbackStore[recipeId] = {
                likes: 0,
                dislikes: 0,
                // Optional: To prevent multiple votes from the same user for the same recipe in a session
                // In a real app with user auth, you'd store userId here.
                // For simplicity, we'll assume a user can only vote once per recipe ID for now.
                // This part can be enhanced with actual user tracking.
            };
        }
    };

    // --- API Routes for Feedback ---

    // 1. Get feedback for a specific recipe
    server.route({
        method: 'GET',
        path: '/recipes/{id}/feedback',
        handler: (request, h) => {
            const recipeId = request.params.id;
            ensureFeedbackRecord(recipeId); // Ensure record exists even if no votes yet

            const feedback = recipeFeedbackStore[recipeId];
            return h.response({
                recipeId: recipeId,
                likes: feedback.likes,
                dislikes: feedback.dislikes
            }).code(200);
        },
        options: {
            description: 'Get like and dislike counts for a recipe',
            notes: 'Returns the current feedback statistics for the given recipe ID',
            tags: ['api', 'feedback', 'recipes'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required().description('The ID of the recipe')
                })
            }
        }
    });

    // 2. Like a recipe
    server.route({
        method: 'POST',
        path: '/recipes/{id}/like',
        handler: (request, h) => {
            const recipeId = request.params.id;
            // const userId = request.auth.credentials.id; // Assuming you have user authentication

            ensureFeedbackRecord(recipeId);

            // Basic check to prevent multiple votes (can be enhanced)
            // For now, just increment. A real app would check if userId has already voted.
            recipeFeedbackStore[recipeId].likes += 1;

            console.log(`Recipe ${recipeId} liked. Current feedback:`, recipeFeedbackStore[recipeId]);

            return h.response({
                message: 'Recipe liked successfully',
                recipeId: recipeId,
                likes: recipeFeedbackStore[recipeId].likes,
                dislikes: recipeFeedbackStore[recipeId].dislikes
            }).code(200);
        },
        options: {
            description: 'Increment the like count for a recipe',
            notes: 'Records a like for the specified recipe ID',
            tags: ['api', 'feedback', 'recipes'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required().description('The ID of the recipe to like')
                })
                // payload: Joi.object({ // If you want to pass userId or other info in payload
                //    userId: Joi.string().required().description('The ID of the user liking the recipe')
                // })
            }
        }
    });

    // 3. Dislike a recipe
    server.route({
        method: 'POST',
        path: '/recipes/{id}/dislike',
        handler: (request, h) => {
            const recipeId = request.params.id;
            // const userId = request.auth.credentials.id; // Assuming you have user authentication

            ensureFeedbackRecord(recipeId);

            // Basic check to prevent multiple votes (can be enhanced)
            recipeFeedbackStore[recipeId].dislikes += 1;

            console.log(`Recipe ${recipeId} disliked. Current feedback:`, recipeFeedbackStore[recipeId]);

            return h.response({
                message: 'Recipe disliked successfully',
                recipeId: recipeId,
                likes: recipeFeedbackStore[recipeId].likes,
                dislikes: recipeFeedbackStore[recipeId].dislikes
            }).code(200);
        },
        options: {
            description: 'Increment the dislike count for a recipe',
            notes: 'Records a dislike for the specified recipe ID',
            tags: ['api', 'feedback', 'recipes'],
            validate: {
                params: Joi.object({
                    id: Joi.string().required().description('The ID of the recipe to dislike')
                })
            }
        }
    });

    // --- Optional: Route to get all feedback data (for debugging/admin) ---
    server.route({
        method: 'GET',
        path: '/feedback/all',
        handler: (request, h) => {
            return h.response(recipeFeedbackStore).code(200);
        },
        options: {
            description: 'Get all feedback data (for debugging)',
            tags: ['api', 'feedback', 'admin']
        }
    });


    // Start the server
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error("Unhandled rejection:", err);
    process.exit(1);
});

// Start the server initialization
init();
