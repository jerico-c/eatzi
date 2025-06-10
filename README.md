# model-rekomendasi

Eatzi adalah proyek aplikasi inovatif yang dirancang untuk mengatasi pemborosan makanan dan membantu masyarakat menemukan resep sesuai bahan yang mereka miliki. Aplikasi ini tidak hanya memberikan rekomendasi resep yang dipersonalisasi, tetapi juga menyertakan informasi nilai gizi untuk mendukung pola makan sehat

## Data Understanding

### **Sumber Data**

| Jenis | Keterangan |
| ------ | ------ |
| Title | _Indonesian Food Recipes_ |
| Source | [Kaggle](https://www.kaggle.com/datasets/canggih/indonesian-food-recipes) |
| Visibility | Publik |
| Tags | _Food, Text, Cooking and Recipes, Nutrition_ |
| View | 36K |
| Downloads | 4847 |

### **Penjelasan Variabel**
| Fitur            | Tipe Data | Deskripsi|
|------------------|-----------|---------------------------------------------------------------------------|
| `Title`         | Objek   | 	Nama atau judul resep makanan |
| `Ingredients`         | Objek     | 	Daftar bahan-bahan yang digunakan dalam resep, dipisahkan koma dalam bentuk teks |
| `Steps`       | Objek     | Instruksi langkah demi langkah dalam memasak resep, berbentuk paragraf atau list |
| `Nutrients`             | Integer   | Informasi nilai gizi dari resep |

Dataset yang digunakan dalam proyek ini terdiri dari 15.593 baris, yang masing-masing direpresentasikan oleh 5 atribut utama. Setiap baris mewakili satu resep unik, lengkap dengan daftar bahan, nilai kalori, dan steps untuk pembuatan makanan.

## Model Evaluation
- Model ini mengimplementasikan pendekatan berbasis logika sederhana untuk mengidentifikasi dan merekomendasikan resep dengan memprioritaskan jumlah bahan yang sesuai dengan input pengguna.
- Sistem dirancang untuk mengurutkan resep berdasarkan skor prioritas yang dihitung dari kecocokan bahan dan nilai popularitas (Loves) dari dataset, memastikan hasil yang paling sesuai ditampilkan terlebih dahulu.
- Dataset yang digunakan adalah file 'dataset_finale.csv' yang mencakup detail resep seperti judul, daftar bahan, nilai kalori, langkah-langkah memasak, dan metrik popularitas (Loves).
- Sistem rekomendasi dibangun berdasarkan pencarian bertahap untuk setiap keywords. Sistem mencari resep kombinasi yang mencakup beberapa bahan dari inputan pengguna, jika tidak ditemukan pada dataset maka model akan mencoba mencari kombinasi bahan lebih sedikit. 
