'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const commentRoutes = require('./api/comments/routes');

const init = async () => {
  const server = Hapi.server({
    // Render akan menyediakan port melalui variabel lingkungan PORT
    // Host '0.0.0.0' diperlukan agar bisa diakses dari luar
    port: process.env.PORT || 3001,
    host: '0.0.0.0', 
    routes: {
      cors: {
        origin: ['*'], // Izinkan semua origin, atau ganti dengan URL Netlify Anda
      },
    },
  });

  server.route(commentRoutes);

  await server.start();
  console.log('Server backend Hapi.js berjalan di %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();