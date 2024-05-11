from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS module  pip install flask- cors
import pickle
import spotipy
import pandas as pd
from spotipy.oauth2 import SpotifyClientCredentials
from sklearn.metrics.pairwise import cosine_similarity


# Spotify credentials
CLIENT_ID = "f97be02b4f3842b188973f9fef12a604"
CLIENT_SECRET = "681f36ca49494f1e82ba7d97fa38acc5"


# Initialize the Spotify client
client_credentials_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)


# Load data
music = pickle.load(open('df.pkl','rb'))
similarity = pickle.load(open('similarity.pkl','rb'))


# Function to get song album cover URL
def get_song_album_cover_url(song_name, artist_name):
    search_query = f"track:{song_name} artist:{artist_name}"
    results = sp.search(q=search_query, type="track")


    if results and results["tracks"]["items"]:
        track = results["tracks"]["items"][0]
        album_cover_url = track["album"]["images"][0]["url"]
        return album_cover_url
    else:
        return "https://i.ibb.co/2F1r84n/Harmoni-Fi-Logo-Final.png"  # Default logo URL


# Function to recommend songs
def recommend(song):
    if music.empty:
        return [], []  # Return empty lists if the dataframe is empty

    index = music[music['song'] == song].index
    if len(index) == 0:
        return [], []  # Return empty lists if the song is not found

    index = index[0]  # Get the first index if multiple matches found
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_music_names = []
    recommended_music_posters = []
    for i in distances[1:6]:
        artist = music.iloc[i[0]].artist
        recommended_music_posters.append(get_song_album_cover_url(music.iloc[i[0]].song, artist))
        recommended_music_names.append(music.iloc[i[0]].song)

    return recommended_music_names, recommended_music_posters

app = Flask(__name__)
CORS(app)  # Enable CORS on all routes


@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    song = request.args.get('song')  # Retrieve the song name from query parameters
    recommended_music_names, recommended_music_posters = recommend(song)
    return jsonify({"songs": recommended_music_names, "posters": recommended_music_posters})

@app.route('/all_songs', methods=['GET'])
def get_all_songs():
    all_songs = music['song'].tolist()  # Get a list of all song names
    return jsonify({"songs": all_songs})

if __name__ == '__main__':
    app.run(debug=True)

