import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import lastfm from '../api/lastfm';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ArtistDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialArtist = location.state?.artist;

  const [artist, setArtist] = useState(initialArtist || null);
  const [topTracks, setTopTracks] = useState([]);
  const [similarArtists, setSimilarArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch artist info if not provided in navigation state
        if (!artist) {
          const artistResponse = await lastfm.get('/', {
            params: {
              method: 'artist.getInfo',
              mbid: id,
              autocorrect: 1,
            },
          });

          // Debug logs
          console.log('Full API Response:', artistResponse.data);
          const artistData = artistResponse.data.artist;
          console.log('Artist Object:', artistData);
          console.log('Stats Object:', artistData?.stats);

          // Get the largest available image
          const artistImage = artistData.image?.[artistData.image.length - 1]?.['#text'];
          
          // Make sure we're getting the stats from the correct path
          const stats = artistData?.stats || {};
          console.log('Processed Stats:', stats);
          
          setArtist({
            ...artistData,
            largeImage: artistImage || 'https://placehold.co/400x400?text=No+Image',
            stats: {
              listeners: stats.listeners || '0',
              playcount: stats.playcount || '0'
            }
          });
        }

        // Fetch top tracks
        const tracksResponse = await lastfm.get('/', {
          params: {
            method: 'artist.getTopTracks',
            mbid: id || artist?.mbid,
            artist: artist?.name,
            limit: 10,
            autocorrect: 1,
          },
        });
        setTopTracks(tracksResponse.data.toptracks?.track || []);

        // Fetch similar artists
        const similarResponse = await lastfm.get('/', {
          params: {
            method: 'artist.getSimilar',
            mbid: id || artist?.mbid,
            artist: artist?.name,
            limit: 5,
            autocorrect: 1,
          },
        });
        setSimilarArtists(similarResponse.data.similarartists?.artist || []);

      } catch (err) {
        setError('Failed to fetch artist details. Please try again.');
        console.error('Artist details error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistData();
  }, [id, artist?.mbid, artist?.name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Prepare chart data for top tracks
  const chartData = {
    labels: topTracks.slice(0, 5).map(track => track.name),
    datasets: [
      {
        label: 'Playcount',
        data: topTracks.slice(0, 5).map(track => parseInt(track.playcount)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        }
      },
      title: {
        display: true,
        text: 'Top 5 Tracks Playcount',
        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Artist Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          {artist?.largeImage && (
            <img
              src={artist.largeImage}
              alt={artist.name}
              className="w-32 h-32 object-cover rounded-lg shadow-lg bg-gray-100 dark:bg-gray-700"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {artist.name}
            </h1>
            
            {/* Stats Pills */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">{parseInt(artist.stats?.listeners).toLocaleString()}</span>
                <span className="ml-1 text-sm opacity-75">listeners</span>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">{parseInt(artist.stats?.playcount).toLocaleString()}</span>
                <span className="ml-1 text-sm opacity-75">plays</span>
              </div>
            </div>

            {artist.tags?.tag && (
              <div className="flex flex-wrap gap-2 mb-4">
                {artist.tags.tag.map((tag, index) => (
                  <span
                    key={tag.name}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {/* Biography */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Biography</h2>
            <div className="prose dark:prose-invert max-w-none">
              {artist?.bio?.summary ? (
                <p className="text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: artist.bio.summary }} />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No biography available.</p>
              )}
            </div>
          </div>

          {/* Top Tracks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Top Tracks</h2>
            <div className="space-y-4">
              {topTracks.map((track, index) => (
                <div
                  key={track.url}
                  className="flex items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                >
                  <span className="text-gray-500 dark:text-gray-300 w-6">{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white font-medium">{track.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {track.playcount.toLocaleString()} plays
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Playcount Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <Line options={chartOptions} data={chartData} />
          </div>

          {/* Similar Artists */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Similar Artists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarArtists.map((similar) => (
                <div
                  key={similar.url}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                >
                  {similar.image?.[2]?.['#text'] && (
                    <img
                      src={similar.image[2]['#text']}
                      alt={similar.name}
                      className="w-12 h-12 object-cover rounded bg-gray-100 dark:bg-gray-700"
                    />
                  )}
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-medium">{similar.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Match: {Math.round(similar.match * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
