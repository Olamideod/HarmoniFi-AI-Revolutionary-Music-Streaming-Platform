import pickle
import streamlit as st
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, request, jsonify
import pandas as pd
import pickle
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load the pickle files
df = pd.read_pickle('df.pkl')
similarity = pickle.load(open('similarity.pkl', 'rb'))

@app.route('/api/auth/recommendations', methods=['GET'])
def get_recommendations():
    # Generate recommendations based on your trained model
    recommendations = generate_recommendations(df, similarity)
    return jsonify(recommendations)

def generate_recommendations(df, similarity):
    # This is just a placeholder. Replace this with the actual logic to generate recommendations.
    return []

if __name__ == '__main__':
    app.run(debug=True)

# Spotify credentials
CLIENT_ID = "f97be02b4f3842b188973f9fef12a604"
CLIENT_SECRET = "681f36ca49494f1e82ba7d97fa38acc5"

# Initialize the Spotify client
client_credentials_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

# Function to get song album cover URL
def get_song_album_cover_url(song_name, artist_name):
    search_query = f"track:{song_name} artist:{artist_name}"
    results = sp.search(q=search_query, type="track")

    if results and results["tracks"]["items"]:
        track = results["tracks"]["items"][0]
        album_cover_url = track["album"]["images"][0]["url"]
        return album_cover_url
    else:
        return "https://i.ibb.co/nsbFJy3/Harmoni-Fi-Logo.png"  # Default logo URL

# Function to recommend songs
def recommend(song):
    index = music[music['song'] == song].index[0]
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])
    recommended_music_names = []
    recommended_music_posters = []
    for i in distances[1:6]:
        artist = music.iloc[i[0]].artist
        recommended_music_posters.append(get_song_album_cover_url(music.iloc[i[0]].song, artist))
        recommended_music_names.append(music.iloc[i[0]].song)

    return recommended_music_names, recommended_music_posters

# Load data
music = pickle.load(open('df.pkl','rb'))
similarity = pickle.load(open('similarity.pkl','rb'))

# Set background image URL
bg_image_url = "https://i.ibb.co/zZctWpL/recommendation-cover-photo.png"

# App layout
st.set_page_config(page_title="HarmoniFi Music Recommender", page_icon="🎵")

# Set background image CSS
st.markdown(
    f"""
    <style>
    .reportview-container {{
        background: url("{bg_image_url}") no-repeat center center fixed;
        background-size: cover;
    }}
    </style>
    """,
    unsafe_allow_html=True
)

st.title('Discover New Music with HarmoniFi')

selected_song = st.selectbox("Select a Song", music['song'].values)

if st.button('Show Recommendations'):
    recommended_music_names, recommended_music_posters = recommend(selected_song)
    
    st.subheader("Recommended Songs")
    col1, col2, col3, col4, col5 = st.columns(5)
    
    for i in range(len(recommended_music_names)):
        with eval(f'col{i+1}'):
            st.image(recommended_music_posters[i], use_column_width=True)
            st.write(recommended_music_names[i])
