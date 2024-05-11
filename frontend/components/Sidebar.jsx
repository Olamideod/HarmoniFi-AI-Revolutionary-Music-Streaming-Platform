import { BuildingLibraryIcon, HeartIcon, HomeIcon, MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axios from 'axios'; // Import Axios
import { useRouter } from 'next/router' // Import useRouter


const Sidebar = ({ view, setView, setGlobalPlaylistId }) => {
    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const router = useRouter(); // Call useRouter


    const handleRecommendationClick = async () => {
        try {
            const response = await axios.get('/recommendations');
            const recommendations = response.data;
            // Handle recommendations as needed, e.g., save to session or display on UI
            router.push('/recommendations');
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        }
    };


    useEffect(() => {
        async function fetchPlaylists() {
            if (session && session.accessToken) {
                try {
                    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`
                        }
                    });
                    const data = await response.json();
                    setPlaylists(data.items);
                } catch (error) {
                    console.error('Failed to fetch playlists:', error);
                }
            }
        }
        fetchPlaylists();
    }, [session]);


    return (
        <div className='w-64 text-neutral-400 grow-0 shrink-0 h-screen border-r border-neutral-900 p-5 text-sm hidden md:inline-flex'>
            <div className='space-y-4'>
                <div className='mt-1 mb-5'>
                    {/* Replace the next line with your HarmoniFi image URL */}
                    <img src="https://i.ibb.co/DD4bjCB/Harmoni-Fi-Brand-FInal.png" alt="HarmoniFi" className="text-white h-12 max-w-[820px]" />
                </div>


                <button onClick={() => setView("home")} className='flex items-center space-x-2 hover:text-white'>
                     <HomeIcon className='h-5 w-5' />
                     <p>Home</p>
                </button>
                <button onClick={() => setView("search")} className={`flex items-center space-x-2 hover:text-white ${view == "search" ? "text-white" : null}`}>
                    <MagnifyingGlassIcon className='h-5 w-5' />
                    <p>Search</p>
                </button>
                <button onClick={() => setView("library")} className={`flex items-center space-x-2 hover:text-white ${view == "library" ? "text-white" : null}`}>
                    <BuildingLibraryIcon className='h-5 w-5' />
                    <p>Your Library</p>
                </button>
                <hr className='border-black' />
                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='h-5 w-5' />
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className='h-5 w-5' />
                    <p>Liked Songs</p>
                </button>
                <hr className='border-neutral-900' />
                {
                    playlists.map((playlist) => {
                        return (
                            <p
                                onClick={() => {
                                    setView("playlist")
                                    setGlobalPlaylistId(playlist.id)
                                }}
                                key={playlist.id}
                                className='cursor-default hover:text-white w-52 truncate'
                            >
                                {playlist.name}
                            </p>
                        )
                    })
                }
               
                {/* Button to trigger recommendation */}
                <button onClick={handleRecommendationClick} className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className='h-5 w-5' />
                    <p>Get Recommendations</p>
                </button>


            </div>
        </div>
    );
}


export default Sidebar;