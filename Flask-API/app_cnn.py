from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # untuk mengizinkan request dari frontend

# Muat model TFLite 
interpreter = tf.lite.Interpreter(model_path="model/food_ingredients_model.tflite") # Sesuaikan dengan directory model yang akan digunakan
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Daftar nama bahan
class_names = ['Bawang Bombai', 'Bawang Merah', 'Bawang Putih', 'Brokoli', 'Cabai Hijau', 
                'Cabai Merah', 'Daging Sapi', 'Daging Unggas', 'Ikan', 'Jagung', 'Jahe', 'Jamur', 'Kacang Hijau',
                'Kacang Merah', 'Kacang Panjang', 'Kacang Tanah', 'Kembang Kol', 'Kentang', 'Kikil', 'Kol', 
                'Labu Siam', 'Mie', 'Nasi', 'Petai', 'Sawi', 'Selada', 'Seledri', 'Telur Ayam', 'Telur Bebek', 
                'Tempe', 'Terong', 'Timun', 'Tomat', 'Usus', 'Wortel']

def preprocess_image(image_bytes, target_size):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image = image.resize(target_size)
    image_array = np.array(image, dtype=np.float32)
    image_array = image_array / 255.0  
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.route('/klasifikasi_gambar', methods=['POST'])
def classify_image():
    if 'file' not in request.files:
        return jsonify({'error': 'Tidak ada file gambar'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'File belum dipilih'}), 400

    try:
        img_bytes = file.read()
        input_shape = input_details[0]['shape']
        target_size = (input_shape[1], input_shape[2])

        input_data = preprocess_image(img_bytes, target_size)

        interpreter.set_tensor(input_details[0]['index'], input_data)
        interpreter.invoke()
        output_data = interpreter.get_tensor(output_details[0]['index'])

        predicted_indices = np.argsort(output_data[0])[::-1]

        results = []
        for i in range(min(3, len(predicted_indices))):  # Top 3
            idx = predicted_indices[i]
            confidence = float(output_data[0][idx])
            if confidence > 0.5:
                results.append({
                    "bahan": class_names[idx],
                    "confidence": confidence
                })

        return jsonify({'bahan_terdeteksi': results})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
