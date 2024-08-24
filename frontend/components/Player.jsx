import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import Script from 'next/script';

const ACCESS_TOKEN = 'BQBxK53i0zu9JIxqkyALxMWzpR3-hK7av7TaWuig1-AgHSPaoN99l-31WbrklISigxboahm0CsKUndfyBkXfu2HC3HvPJwmleLvKVx9tG-7OU6rxsebS9-S6jRJhuZvQvDHhZAA0Or97rB3bZ_fpGkWCQRDWQcw7k5IKcpUGYVW7CUiNBUjUKvSxYzqgFCuuR0QKOHNP9HXCHUhCVHFaUUC1tl_r0o0O';

const Player = ({ globalCurrentSongId, setGlobalCurrentSongId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) => {
    const [songInfo, setSongInfo] = useState(null);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const initializePlayer = () => {
            const spotifyPlayer = new window.Spotify.Player({
                name: 'HarmoniFi Web Player',
                getOAuthToken: cb => { cb(ACCESS_TOKEN); },
                volume: 100
            });

            setPlayer(spotifyPlayer);

            spotifyPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            spotifyPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            spotifyPlayer.addListener('initialization_error', ({ message }) => {
                console.error(message);
            });

            spotifyPlayer.addListener('authentication_error', ({ message }) => {
                console.error(message);
            });

            spotifyPlayer.addListener('account_error', ({ message }) => {
                console.error(message);
            });

            spotifyPlayer.addListener('player_state_changed', (state) => {
                if (!state) return;

                setGlobalIsTrackPlaying(!state.paused);
                setGlobalCurrentSongId(state.track_window.current_track.id);
                fetchSongInfo(state.track_window.current_track.id);
            });

            spotifyPlayer.connect();
        };

        window.onSpotifyWebPlaybackSDKReady = initializePlayer;

        return () => {
            if (player) player.disconnect();
        };
    }, []);

    async function fetchSongInfo(trackId) {
        if (trackId) {
            try {
                const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch song info');
                const data = await response.json();
                setSongInfo(data);
            } catch (error) {
                console.error('Error fetching song info:', error);
            }
        }
    }

    async function handlePlayPause() {
        if (player) {
            const state = await player.getCurrentState();
            if (state) {
                if (state.paused) {
                    await player.resume();
                } else {
                    await player.pause();
                }
            }
        }
    }

    useEffect(() => {
        if (!globalCurrentSongId) {
            getCurrentlyPlaying();
        } else {
            fetchSongInfo(globalCurrentSongId);
        }
    }, [globalCurrentSongId]);

    async function getCurrentlyPlaying() {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });
            if (response.status === 204) {
                console.log("204 response from currently playing");
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch currently playing');
            const data = await response.json();
            setGlobalCurrentSongId(data?.item?.id);
            if (data.is_playing) setGlobalIsTrackPlaying(true);
            fetchSongInfo(data?.item?.id);
        } catch (error) {
            console.error('Error fetching currently playing:', error);
        }
    }

    return (
        <div className='h-24 bg-gradient-to-br from-purple-900 to-pink-900 text-black grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
            <Script src="https://sdk.scdn.co/spotify-player.js" strategy="afterInteractive" />
            <div className='flex items-center space-x-4'>
                {songInfo?.album.images[0]?.url && <img className='hidden md:inline h-10 w-10' src={songInfo.album.images[0].url} />}
                <div>
                    <p className='text-white text-sm'>{songInfo?.name}</p>
                    <p className='text-neutral-400 text-xs'>{songInfo?.artists[0]?.name}</p>
                </div>
            </div>
            <div className='flex items-center justify-center'>
                {globalIsTrackPlaying ? <PauseCircleIcon onClick={handlePlayPause} className='h-10 w-10' /> : <PlayCircleIcon onClick={handlePlayPause} className='h-10 w-10' />}
            </div>
            <div></div>
        </div>
    );
};

export default Player;