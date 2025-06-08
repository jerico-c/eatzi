'use strict';
require('dns').setDefaultResultOrder('ipv4first');

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const allowedOrigins = (process.env.CORS_ORIGIN_FRONTEND || 'http://localhost:8080','https://eatzi.netlify.app').split(',');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 4000,
        host: '0.0.0.0', 
        routes: {
            cors: {
                origin: allowedOrigins,
            },
        },
    });

    server.route([
        {
            method: 'GET',
            path: '/testimonials',
            handler: async (request, h) => {
                try {
                    const { rows } = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
                    return h.response(rows);
                } catch (err) {
                    console.error('Database query error:', err);
                    return h.response({ message: 'Internal Server Error' }).code(500);
                }
            }
        },
        {
            method: 'POST',
            path: '/testimonials',
            handler: async (request, h) => {
                try {
                    const { name, story } = request.payload;
                    const { rows } = await pool.query(
                        'INSERT INTO testimonials (name, story) VALUES ($1, $2) RETURNING *',
                        [name, story]
                    );
                    return h.response(rows[0]).code(201);
                } catch (err) {
                    console.error('Database insert error:', err);
                    return h.response({ message: 'Internal Server Error' }).code(500);
                }
            },
            options: {
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(3).max(100).required(),
                        story: Joi.string().min(10).required(),
                    })
                }
            }
        },
        
        {
            method: 'PUT',
            path: '/testimonials/{id}',
            handler: async (request, h) => {
                try {
                    const { id } = request.params;
                    const { name, story } = request.payload;
                    const { rows } = await pool.query(
                        'UPDATE testimonials SET name = $1, story = $2 WHERE id = $3 RETURNING *',
                        [name, story, id]
                    );
                    if (rows.length === 0) {
                        return h.response({ message: 'Not Found' }).code(404);
                    }
                    return h.response(rows[0]);
                } catch (err) {
                    console.error('Database update error:', err);
                    return h.response({ message: 'Internal Server Error' }).code(500);
                }
            },
            options: {
                validate: {
                    params: Joi.object({ id: Joi.number().integer().required() }),
                    payload: Joi.object({
                        name: Joi.string().min(3).max(100).required(),
                        story: Joi.string().min(10).required(),
                    })
                }
            }
        },
        {
            method: 'DELETE',
            path: '/testimonials/{id}',
            handler: async (request, h) => {
                try {
                    const { id } = request.params;
                    const result = await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
                    if (result.rowCount === 0) {
                        return h.response({ message: 'Not Found' }).code(404);
                    }
                    return h.response({ message: 'Testimonial deleted successfully' }).code(200);
                } catch (err) {
                    console.error('Database delete error:', err);
                    return h.response({ message: 'Internal Server Error' }).code(500);
                }
            },
            options: {
                validate: {
                    params: Joi.object({ id: Joi.number().integer().required() })
                }
            }
        }
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

init();