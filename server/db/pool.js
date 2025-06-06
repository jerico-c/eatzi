const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // Gunakan string koneksi tunggal dari variabel lingkungan
  connectionString: process.env.DATABASE_URL,
  // Tambahkan konfigurasi SSL jika diperlukan oleh layanan hosting Anda (Render biasanya butuh)
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Terhubung ke database Supabase!');
});

module.exports = pool;