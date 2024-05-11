import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Recommendations() {
  const [selectedSong, setSelectedSong] = useState('');
  const [recommendations, setRecommendations] = useState({ songs: [], posters: [] });
  const [allSongs, setAllSongs] = useState([]);

  useEffect(() => {
    // Fetch all songs when the component mounts
    fetchAllSongs();
  }, []); // Fetch all songs only once when the component mounts

  const fetchAllSongs = async () => {
    try {
      // Fetch all songs from the backend
      const response = await axios.get('http://localhost:5000/all_songs');
      setAllSongs(response.data.songs);
    } catch (error) {
      console.error('Failed to fetch all songs:', error);
    }
  };

  const handleSongChange = (event) => {
    setSelectedSong(event.target.value);
  };

  const handleRecommend = async () => {
    try {
      const response = await axios.get('http://localhost:5000/recommendations', { params: { song: selectedSong } });
      console.log(response.data); // Add this line to log the response data
      setRecommendations(response.data); // Update state with response data
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Satoshi', textAlign: 'center', backgroundImage: 'url("https://i.ibb.co/1r2C4XF/music-cover.jpg")', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2em' }}>
      <img src="https://i.ibb.co/DD4bjCB/Harmoni-Fi-Brand-FInal.png" alt="HarmoniFi Logo" style={{ width: '400px', marginBottom: '0.2em' }} /> {/* Add your logo here */}
      <h1 style={{ color: 'white', marginBottom: '0.2em', fontWeight: 'bold', fontSize: '2.4em' }}>Discover New Music with HarmoniFi</h1>
      <select
        value={selectedSong}
        onChange={handleSongChange}
        style={{ padding: '0.5em', width: '50%', marginBottom: '1em', color: 'black', border: '2px solid #ccc', borderRadius: '2px' }}
      >
        <option value="">Select a song</option>
        {allSongs.map((song, index) => (
          <option key={index} value={song}>{song}</option>
        ))}
      </select>
      <button
        onClick={handleRecommend}
        style={{ padding: '0.5em 1em', backgroundColor: 'transparent', color: 'white', border: '1px solid #ccc', borderRadius: '2px', cursor: 'pointer', marginBottom: '1em' }}
      >
        Recommend 
      </button>
      <h2 style={{ color: 'white' }}>Recommended Songs</h2>

      {/* Recommendation Display Section */}
      {recommendations.songs.length > 0 && ( // Only render if recommendations exist
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {recommendations.songs.map((song, index) => (
            <div key={index} style={{ margin: '1em', width: '200px', backgroundColor: 'black', borderRadius: '5px', padding: '1em', textAlign: 'center' }}>
              <img src={recommendations.posters[index]} alt={`Poster for ${song}`} style={{ width: '100%', maxWidth: '200px', marginBottom: '0.5em' }} />
              <p style={{ fontWeight: 'bold' }}>{song}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;
