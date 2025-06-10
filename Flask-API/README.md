# Cara menggunakan secara lokal!

Pertama, kloning branch ini dari repositori dengan:

```python
git clone --single-branch --branch flask-API [https://github.com/jerz-c/eatzl.git](https://github.com/jerz-c/eatzl.git)
```
Sekarang, buat virtual environment untuk menjalankan proyek
```
py -3 -m venv .venv
```
Kemudian, aktifkan virtual environment
```
.venv\Scripts\activate
```
Instal file requirements.txt:
```
pip install -r requirements.txt
```
Jalankan file app_cnn.py dengan:
```
py app_cnn.py
```
Sekarang, ini akan berjalan di localhost.

- API dibuat menggunakan Flask-API untuk model CNN
- Link google drive berisi model yang sudah di convert ke .h5, TF-Lite dan SavedModel
link : https://drive.google.com/drive/folders/1Bg7L5EandszCx_3QsNX8M8rDs4fH5AFu?usp=sharing
- Pada api kali ini menggunakan model yang di convert to TF-Lite
