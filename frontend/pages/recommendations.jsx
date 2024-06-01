import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { PlayIcon } from '@heroicons/react/24/solid'; // Import PlayIcon

function Recommendations() {
  const [selectedSong, setSelectedSong] = useState('');
  const [recommendations, setRecommendations] = useState({ songs: [], posters: [] });
  const [allSongs, setAllSongs] = useState([]);
  const [showPlayIcon, setShowPlayIcon] = useState(-1); // State to track the clicked poster index

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

  const handlePlayIconToggle = (index) => {
    setShowPlayIcon(index === showPlayIcon ? -1 : index); // Toggle the clicked poster index
  };

  return (
    <div style={{ font: 'extrabold', textAlign: 'center', backgroundImage: 'url("https://i.ibb.co/tBTCCyY/purple-theme-cover.jpg")', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2em' }}>
      {/* Apply motion animation to the HarmoniFi logo */}
      <motion.img
        src="https://i.ibb.co/DD4bjCB/Harmoni-Fi-Brand-FInal.png"
        alt="HarmoniFi Logo"
        style={{ width: '400px', marginBottom: '0.2em' }}
        initial={{ opacity: 0, scale: 0.5 }} // Initial animation properties
        animate={{ opacity: 1, scale: 1 }} // Animation properties to apply when the component mounts
        transition={{ duration: 2 }} // Animation duration
      />
        <motion.h2
        initial={{ opacity: 0, scale: 0.5 }} // Initial animation properties
        animate={{ opacity: 1, scale: 1 }} // Animation properties to apply when the component mounts
        transition={{ duration: 2 }} // Animation duration
        style={{ color: 'transparent', marginBottom: '0.2em', fontWeight: 'bold', fontSize: '2.4em' }} className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
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
        style={{ padding: '0.5em', width: '50%', marginBottom: '1em', color: 'black', border: '2px solid #ccc', borderRadius: '2px' }}
      >
        <option value="">Select a song</option>
        {allSongs.map((song, index) => (
          <option key={index} value={song}>{song}</option>
        ))}
      </select>
      <button
        onClick={handleRecommend}
        style={{ padding: '0.5em 1em', backgroundColor: 'transparent', color: 'white', border: '2px solid #ccc', borderRadius: '2px', cursor: 'pointer', marginBottom: '1em' }}
      >
        Recommend 
      </button>
      <h2 style={{ color: 'white' }}>Recommended Songs</h2>

      {/* Recommendation Display Section */}
      {recommendations.songs.length > 0 && ( // Only render if recommendations exist
        <motion.div
          initial={{ opacity: 0, y: 5 }} // Initial animation properties
          animate={{ opacity: 1, y: 1 }} // Animation properties to apply when the component mounts
          transition={{ duration: 1.0 }} // Animation duration
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {recommendations.songs.map((song, index) => (
            <div key={index} style={{ margin: '1em', width: '200px', backgroundColor: '#4B5563', borderRadius: '5px', padding: '1em', textAlign: 'center', position: 'relative' }} onClick={() => handlePlayIconToggle(index)}>
              {/* Play Icon */}
              <div className={`absolute transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${showPlayIcon === index ? 'opacity-100' : 'opacity-0'}`}>
                <PlayIcon className='h-6 w-6 text-black' />
              </div>

              {/* Song Poster */}
              <img src={recommendations.posters[index]} alt={`Poster for ${song}`} style={{ width: '100%', maxWidth: '200px', marginBottom: '0.5em' }} />

              {/* Song Name */}
              <p style={{ fontWeight: 'bold', color: '#F9FAFB' }}>{song}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}


export default Recommendations;
