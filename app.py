# from flask import Flask
# app = Flask(__name__)

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

# if__name__ == '__main__':
#     app.run()

from flask import Flask, jsonify, request
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = Flask(__name__)

# Initialize Spotify API credentials
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id="YOUR_CLIENT_ID", client_secret="YOUR_CLIENT_SECRET"))

# Load your preprocessed data
df = pd.read_csv('data/SpotifyFeatures.csv')

@app.route('/recommend', methods=['GET'])
def recommend():
    genre = request.args.get('genre')
    recommendations = df[df['genre'] == genre].sample(10).to_dict(orient='records')
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
