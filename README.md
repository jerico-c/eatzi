# **Model Machine Learning**
- Model machine learning klasifikasi gambar untuk mengklasifikasikan bahan-bahan makanan yang terdiri dari 35 bahan makanan,
- Melakukan pembuatan model CNN untuk mencari akurasi model yang terbaik,
  - Pre trained model 
- Dataset yang digunakan : https://www.kaggle.com/datasets/zollycitraprayogi/food-ingredients-image
- Dataset terdiri dari 75 bahan makanan yang terdiri dari buah, sayur, dan daging, dimana hanya diambil beberapa kelas saja yaitu sebanyak 35 kelas:

  - Daftar kelas: ['Bawang Bombai', 'Bawang Merah', 'Bawang Putih', 'Brokoli', 'Cabai Hijau', 'Cabai Merah', 'Daging Sapi', 'Daging Unggas', 'Ikan', 'Jagung', 'Jahe', 'Jamur', 'Kacang Hijau', 'Kacang Merah', 'Kacang Panjang', 'Kacang Tanah', 'Kembang Kol', 'Kentang', 'Kikil', 'Kol', 'Labu Siam', 'Mie', 'Nasi', 'Petai', 'Sawi', 'Selada', 'Seledri', 'Telur Ayam', 'Telur Bebek', 'Tempe', 'Terong', 'Timun', 'Tomat', 'Usus', 'Wortel']

- Masing-masing kelas dilakukan augmentasi hingga semua kelas memiliki jumlah gambar sebanyak 500 gambar
