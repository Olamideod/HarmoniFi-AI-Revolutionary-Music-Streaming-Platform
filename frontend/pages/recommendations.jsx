import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { PlayIcon } from '@heroicons/react/24/solid';

function Recommendations() {
  const [selectedSong, setSelectedSong] = useState('');
  const [recommendations, setRecommendations] = useState({ songs: [], posters: [] });
  const [allSongs, setAllSongs] = useState([]);
  const [showPlayIcon, setShowPlayIcon] = useState(-1);

  useEffect(() => {
    fetchAllSongs();
  }, []);

  const fetchAllSongs = async () => {
    try {
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
      console.log(response.data);
      setRecommendations(response.data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    }
  };

  const handlePlayIconToggle = (index) => {
    setShowPlayIcon(index === showPlayIcon ? -1 : index);
  };

  return (
    <div className="container">
      <motion.img
        src="https://i.ibb.co/DD4bjCB/Harmoni-Fi-Brand-FInal.png"
        alt="HarmoniFi Logo"
        className="logo"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
      />
      <motion.h2
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="title"
      >
        <TypeAnimation
          sequence={[
            "Discover New Music with HarmoniFi!",
            1000,
            "Listen To Millions Of Songs",
            1000,
            "Get Recommendations",
            1000,
            "Personalized Experiences",
            1000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
        />
      </motion.h2>
      <select
        value={selectedSong}
        onChange={handleSongChange}
        className="select"
      >
        <option value="">Select a song</option>
        {allSongs.map((song, index) => (
          <option key={index} value={song}>{song}</option>
        ))}
      </select>
      <button
        onClick={handleRecommend}
        className="recommend-button"
      >
        Recommend
      </button>
      <h2 className="recommended-title">Recommended Songs</h2>

      {recommendations.songs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 1 }}
          transition={{ duration: 1.0 }}
          className="recommendations"
        >
          {recommendations.songs.map((song, index) => (
            <div key={index} className="recommendation" onClick={() => handlePlayIconToggle(index)}>
              <div className={`play-icon ${showPlayIcon === index ? 'active' : ''}`}>
                <PlayIcon className='icon' />
              </div>
              <img src={recommendations.posters[index]} alt={`Poster for ${song}`} className="poster" />
              <p className="song-name">{song}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default Recommendations;
