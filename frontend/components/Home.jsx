import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import FeaturedPlaylists from './FeaturedPlaylists';
import PopularSongs from './PopularSongs';

const Home = ({ setView, setGlobalPlaylistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setGlobalArtistId }) => {
    const { data: session } = useSession();
    const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
    const [popularSongs, setPopularSongs] = useState([]);

    useEffect(() => {
        async function fetchFeaturedPlaylists() {
            const response = await fetch("https://api.spotify.com/v1/browse/featured-playlists", {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            });
            const data = await response.json();
            setFeaturedPlaylists(data.playlists.items);
        }

        async function fetchPopularSongs() {
            const response = await fetch("https://api.spotify.com/v1/browse/new-releases", {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`
                }
            });
            const data = await response.json();
            setPopularSongs(data.albums.items);
        }

        if (session && session.accessToken) {
            fetchFeaturedPlaylists();
            fetchPopularSongs();
        }
    }, [session]);

    return (
        <div className='flex-grow h-screen'>
            <header className='text-white sticky top-0 h-20 z-10 text-4xl flex items-center px-8 bg-black'>
                <h1 className='font-bold'>Home</h1>
                <div onClick={() => signOut()} className='absolute z-20 top-5 right-8 flex items-center bg-gradient-to-br from-purple-400 to-pink-400 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'>
                    <img className='rounded-full w-0 h-7' src={session?.user.image} alt="profile pic" />
                    <p className='text-sm'>Logout</p>
                    <ChevronDownIcon className='h-5 w-5' />
                </div>
            </header>
            <div className='px-8 py-4'>
                <h2 className='text-2xl font-bold mb-4'>Made For You</h2>
                <FeaturedPlaylists
                    playlists={featuredPlaylists}
                    setView={setView}
                    setGlobalPlaylistId={setGlobalPlaylistId}
                />
                <h2 className='text-2xl font-bold my-4'>Popular Songs</h2>
                <PopularSongs
                    songs={popularSongs}
                    setGlobalCurrentSongId={setGlobalCurrentSongId}
                    setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                />
            </div>
            <footer className='bg-black text-white py-8 px-8 mt-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                        <h3 className='font-bold text-lg'>Company</h3>
                        <ul>
                            <li><a href="#" className='hover:underline'>About</a></li>
                            <li><a href="#" className='hover:underline'>Jobs</a></li>
                            <li><a href="#" className='hover:underline'>For the Record</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='font-bold text-lg'>Communities</h3>
                        <ul>
                            <li><a href="#" className='hover:underline'>For Artists</a></li>
                            <li><a href="#" className='hover:underline'>Developers</a></li>
                            <li><a href="#" className='hover:underline'>Advertising</a></li>
                            <li><a href="#" className='hover:underline'>Investors</a></li>
                            <li><a href="#" className='hover:underline'>Vendors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='font-bold text-lg'>Useful Links</h3>
                        <ul>
                            <li><a href="#" className='hover:underline'>Support</a></li>
                            <li><a href="#" className='hover:underline'>Free Mobile App</a></li>
                        </ul>
                    </div>
                </div>
                <div className='flex justify-between mt-8'>
                    <div>
                        <p>© 2024 Your Company</p>
                    </div>
                    <div className='flex space-x-4'>
                        <a href="#" className='hover:underline'>Legal</a>
                        <a href="#" className='hover:underline'>Privacy Center</a>
                        <a href="#" className='hover:underline'>Privacy Policy</a>
                        <a href="#" className='hover:underline'>Cookies</a>
                        <a href="#" className='hover:underline'>About Ads</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
