# Eatzi - Rekomendasi Resep Makanan Cerdas

Eatzi adalah aplikasi web inovatif yang membantu pengguna menemukan resep makanan berdasarkan bahan-bahan yang mereka miliki. Dengan memanfaatkan Machine Learning, aplikasi ini dapat mengklasifikasikan bahan makanan dari gambar yang diunggah pengguna dan memberikan rekomendasi resep yang relevan. Selain itu, Eatzi juga dilengkapi fitur sosial "Cooking Stories" yang memungkinkan pengguna berbagi pengalaman memasak mereka.

## 🌟 Fitur Utama

1.  **Klasifikasi Bahan Makanan Berbasis Gambar**:
    * Unggah gambar bahan makanan melalui file atau kamera perangkat.
    * Aplikasi terhubung dengan **Flask API** untuk melakukan klasifikasi dan mengidentifikasi bahan-bahan secara otomatis.
    * Dapatkan daftar bahan yang terdeteksi untuk digunakan dalam pencarian resep.

2.  **Rekomendasi Resep Cerdas**:
    * Berdasarkan bahan yang teridentifikasi, Eatzi akan merekomendasikan berbagai resep yang sesuai menggunakan model tensorflow.js.

3.  **Cooking Stories**:
    * Bagikan cerita tentang pengalaman memasak.
    * Fitur ini terhubung ke **RESTful API** untuk menyimpan dan menampilkan cerita dari pengguna lain.

4.  **Antarmuka Pengguna Modern**:
    * Dibangun dengan React dan styling menggunakan Tailwind CSS untuk desain yang responsif dan modern.
    * Navigasi yang mulus sebagai *Single-Page Application* (SPA) menggunakan `react-router-dom`.

## 💻 Tech Stack

* **Frontend**:
    * **Vite** sebagai *module bundler*.
    * **React.js** sebagai library utama antarmuka.
    * **React Router DOM** untuk *routing* pada SPA.
    * **Tailwind CSS** untuk styling.
    * **TensorFlow.js**: model Machine Learning untuk rekomendasi resep.

* **Backend & API**:
    * **Flask API**: Untuk klasifikasi bahan makanan melalui gambar, Endpoint prediksi berada di `https://eatzi.snafcat.com/predict`.
    * **Hapi Js**: RESTful API untuk mengelola "Cooking Stories".
    * **PostgreSQL**: Database untuk menyimpan "Cooking Stories", via Supabase

## 🚀 Instalasi & Penyiapan Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone Repositori**:
    ```bash
    git clone https://github.com/jerico-c/eatzi.git
    cd eatzi
    ```

2.  **Instal Dependensi**:
    Pastikan Anda memiliki Node.js dan npm (atau package manager lain seperti yarn/pnpm). Jalankan perintah berikut di direktori root proyek:
    ```bash
    npm install
    ```

3.  **Jalankan Server Pengembangan**:
    Perintah ini akan menjalankan aplikasi dalam mode pengembangan dengan *hot-reloading*.
    ```bash
    npm run dev
    ```

4.  **Buka di Browser**:
    Buka browser Anda dan akses alamat lokal yang ditampilkan di terminal (biasanya `http://localhost:8080`).

## 🛠️ Cara Penggunaan

1.  **Klasifikasi Bahan**:
    * Pada halaman utama, klik tombol "Unggah Foto Bahan" atau "Buka Kamera & Scan Bahan".
    * Pilih gambar dari perangkat Anda atau ambil foto baru.
    * Aplikasi akan mengirim gambar ke API dan menampilkan nama bahan yang terdeteksi, yang kemudian ditambahkan ke daftar bahan Anda.

2.  **Cari Resep**:
    * Setelah bahan ditambahkan, klik tombol "Cari Resep" untuk menavigasi ke halaman resep.
    * Halaman resep akan menampilkan hidangan yang bisa dibuat dari bahan-bahan yang Anda pilih.

3.  **Bagikan Cooking Story**:
    * Navigasi ke halaman "Cooking Stories".
    * Isi formulir untuk menambahkan nama dan cerita pengalaman memasak Anda, lalu kirim.
  
## Tampilan Website
1. Tampilan Home
   ![home page](https://github.com/jerico-c/eatzi/blob/storiesAPI-(RESTful-API)/images/home%20page.png)
   
3. Tampilan Input
   ![input](https://github.com/jerico-c/eatzi/blob/storiesAPI-(RESTful-API)/images/input.png)
   
4. Tampilan saat Klasifikasi Bahan
   ![klasifikasi](https://github.com/jerico-c/eatzi/blob/storiesAPI-(RESTful-API)/images/classify.png)
   
5. Tampilan Rekomendasi Resep
   ![resep](https://github.com/jerico-c/eatzi/blob/storiesAPI-(RESTful-API)/images/recipe.png)

7. Tampilan Detail Resep
   ![detail resep](https://github.com/jerico-c/eatzi/blob/storiesAPI-(RESTful-API)/images/recipe%20detail.png)

8. Tampilan Cooking Stories
   ![cooking stories](https://github.com/jerico-c/eatzi/blob/storiesAPI-(RESTful-API)/images/cooking%20stories.png)

9. Tampilan About
   ![about](https://github.com/jerico-c/eatzi/blob/storiesAPI-(RESTful-API)/images/about.png)
   



