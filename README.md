# RESTful API - Eatzi Cooking Stories

Backend ini adalah RESTful API yang dibangun menggunakan Node.js dan Hapi.js untuk mengelola data "Cooking Stories". API ini menyediakan endpoint untuk operasi CRUD (Create, Read, Update, Delete) pada data testimoni pengguna dan menyimpannya ke dalam database PostgreSQL.

  - **URL Deployment**: [https://eatzi-api-production.up.railway.app](https://eatzi-api-production.up.railway.app)

## Teknologi

  - **Runtime**: Node.js
  - **Framework**: Hapi.js
  - **Database**: PostgreSQL
  - **Validasi**: Joi

## Fitur API

  - Menyimpan, mengambil, memperbarui, dan menghapus testimoni.
  - Validasi input untuk memastikan integritas data.
  - Konfigurasi CORS untuk mengizinkan permintaan dari frontend yang ditentukan.

## Panduan Setup Lokal

### Prasyarat

  - [Node.js](https://nodejs.org/en) (v18 atau lebih baru)
  - [npm](https://www.npmjs.com/) (atau package manager lain)
  - [Docker](https://www.docker.com/products/docker-desktop/) (Direkomendasikan untuk setup database)
  - [DBeaver](https://dbeaver.io/) (Manajemen Database)

### Langkah-langkah Instalasi

1.  **Navigasi ke Direktori Server**
    Dari root proyek, masuk ke folder `server`.

    ```bash
    cd server
    ```

2.  **Instal Dependensi**

    ```bash
    npm install
    ```

3.  **Jalankan Database PostgreSQL via Docker**
    Buka terminal dan jalankan perintah ini untuk membuat kontainer database.

    ```bash
    docker run --name eatzi-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=eatzi-user -e POSTGRES_DB=eatzi_db -p 5432:5432 -d postgres
    ```

     ![config docker](images/configDocker.png)
    

5.  **Konfigurasi Environment Variable**
    Buat file baru bernama `.env` di dalam direktori `/server` dan isi dengan konfigurasi berikut:

    ```env
    # /server/.env

    # URL Koneksi ke database lokal
    DATABASE_URL="postgres://eatzi-user:mysecretpassword@localhost:5432/eatzi_db"

    # URL Frontend yang diizinkan untuk mengakses API
    CORS_ORIGIN_FRONTEND="http://0.0.0.0:8080"
    ```

6.  **Migrasi Skema Database**
    Hubungkan ke database PostgreSQL Anda menggunakan tool seperti DBeaver, pgAdmin, atau terminal, lalu jalankan skema SQL berikut untuk membuat tabel `testimonials`.

    ```sql
    CREATE TABLE testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      story TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ```

     ![config DBeaver](images/configDBeaver.png)

7.  **Jalankan Server**

    ```bash
    node server.js
    ```

    Server sekarang berjalan dan siap menerima permintaan di `http://0.0.0.0:4000`.

## Dokumentasi API Endpoint

Semua endpoint berada di bawah base URL server Anda. Untuk produksi, gunakan: `https://eatzi-api-production.up.railway.app`

-----

### **GET** `/testimonials`

Mengambil semua data testimoni yang tersimpan, diurutkan dari yang terbaru.

  - **Method**: `GET`
  - **Respon Sukses (200 OK)**:
    ```json
    [
      {
        "id": 1,
        "name": "jerico",
        "story": "sate kambingnya enak banget!",
        "created_at": "2025-06-07T02:30:00.000Z"
      },
      ...
    ]
    ```

     ![test get](images/testGet.png)

-----

### **POST** `/testimonials`

Menambahkan testimoni baru.

  - **Method**: `POST`
  - **Body Request** (`application/json`):
    ```json
    {
      "name": "chef juna",
      "story": "saya rekomen eatzi buat semuanya."
    }
    ```
  - **Validasi**:
      - `name`: string, minimal 3 karakter, wajib diisi.
      - `story`: string, minimal 10 karakter, wajib diisi.
  - **Respon Sukses (201 Created)**: Mengembalikan objek dari testimoni yang baru saja dibuat.

    ![test post](images/testPost.png)

-----

### **PUT** `/testimonials/{id}`

Mengedit testimoni yang sudah ada berdasarkan ID.

  - **Method**: `PUT`
  - **Parameter URL**:
      - `id` (integer, wajib): ID dari testimoni yang akan diubah.
  - **Body Request** (`application/json`):
    ```json
    {
      "name": "Nama Pengguna Baru",
      "story": "Isi cerita yang telah diperbarui."
    }
    ```
  - **Respon Sukses (200 OK)**: Mengembalikan objek dari testimoni yang telah diperbarui.
  - **Respon Gagal (404 Not Found)**: Jika testimoni dengan ID tersebut tidak ditemukan.

    ![test put](images/testPut.png)

-----

### **DELETE** `/testimonials/{id}`

Menghapus testimoni berdasarkan ID.

  - **Method**: `DELETE`
  - **Parameter URL**:
      - `id` (integer, wajib): ID dari testimoni yang akan dihapus.
  - **Respon Sukses (200 OK)**:
    ```json
    {
      "message": "Testimonial deleted successfully"
    }
    ```
  - **Respon Gagal (404 Not Found)**: Jika testimoni dengan ID tersebut tidak ditemukan.

    ![test delete](images/testDelete.png)
    

## Panduan Deployment

API ini dirancang untuk di-deploy dengan mudah di platform seperti **Railway**.

1.  **Hubungkan Repositori**: Hubungkan repositori GitHub Anda ke Railway.
2.  **Atur Konfigurasi Dasar**:
      - **Root Directory**: Atur ke `server/`.
      - **Start Command**: Railway akan otomatis menggunakan `npm start` dari `package.json`.
3.  **Siapkan Database Produksi**: Buat database PostgreSQL di layanan cloud seperti **Supabase** atau gunakan add-on database dari Railway.
4.  **Konfigurasi Environment Variables di Railway**:
      - `DATABASE_URL`: Masukkan *Connection String* dari database produksi Anda (misalnya dari Supabase).
      - `CORS_ORIGIN_FRONTEND`: Masukkan URL aplikasi frontend Anda yang sudah di-deploy (misalnya, `https://meek-cranachan-019fc9.netlify.app`).
      - `PORT`: Disediakan secara otomatis oleh Railway.

Aplikasi akan otomatis di-deploy ulang setiap kali ada perubahan yang di-push ke branch utama di GitHub.
