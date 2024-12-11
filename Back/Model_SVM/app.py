from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa
import numpy as np
import pickle
import io
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins (can restrict in production)

# Load the SVM model
model_filename = 'svm_model.pkl'
try:
    with open(model_filename, 'rb') as file:
        clf = pickle.load(file)
except FileNotFoundError:
    raise RuntimeError(f"Model file '{model_filename}' not found.")

# Genres list (ensure it matches the training labels)
genres = ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"]

# Function to predict genre
def predict_genre(file, clf):
    hop_length = 512
    n_fft = 2048
    n_mels = 128

    # Load and preprocess the audio file from the in-memory file object
    try:
        signal, rate = librosa.load(file, sr=None)  # Preserve original sampling rate
        S = librosa.feature.melspectrogram(y=signal, sr=rate, n_fft=n_fft, hop_length=hop_length, n_mels=n_mels)
        S_DB = librosa.power_to_db(S, ref=np.max)
        S_DB = S_DB.flatten()[:1200]  # Ensure input size matches training
    except Exception as e:
        raise ValueError(f"Error processing audio file: {e}")

    # Predict the genre
    try:
        genre_label = clf.predict([S_DB])[0]
        return genres[genre_label]
    except Exception as e:
        raise ValueError(f"Error during prediction: {e}")

# Define a route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    
    if not file.filename.endswith('.wav'):
        return jsonify({'error': 'Only .wav files are supported'}), 400

    # Process the file directly in memory
    try:
        # Convert file to a BytesIO stream for librosa to read
        audio_file = io.BytesIO(file.read())
        predicted_genre = predict_genre(audio_file, clf)
        result = {'genre': predicted_genre}
    except Exception as e:
        result = {'error': str(e)}

    return jsonify(result)

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv("PORT", 5000)))
