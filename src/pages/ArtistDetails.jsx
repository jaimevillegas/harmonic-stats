import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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
          setArtist(artistResponse.data.artist);
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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
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
      },
      title: {
        display: true,
        text: 'Top 5 Tracks Playcount',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Artist Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6">
          {artist?.image?.[2]?.['#text'] && (
            <img
              src={artist.image[2]['#text']}
              alt={artist.name}
              className="w-32 h-32 object-cover rounded-lg shadow-lg"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{artist?.name}</h1>
            <div className="text-gray-600">
              <span className="mr-4">{artist?.stats?.listeners} listeners</span>
              <span>{artist?.stats?.playcount} plays</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {/* Biography */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Biography</h2>
            <div className="prose max-w-none">
              {artist?.bio?.summary ? (
                <p dangerouslySetInnerHTML={{ __html: artist.bio.summary }} />
              ) : (
                <p>No biography available.</p>
              )}
            </div>
          </div>

          {/* Top Tracks */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Top Tracks</h2>
            <div className="space-y-4">
              {topTracks.map((track, index) => (
                <div
                  key={track.url}
                  className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-gray-500 w-6">{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{track.name}</h3>
                    <p className="text-sm text-gray-600">
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <Line options={chartOptions} data={chartData} />
          </div>

          {/* Similar Artists */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Similar Artists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {similarArtists.map((similar) => (
                <div
                  key={similar.url}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                >
                  {similar.image?.[0]?.['#text'] && (
                    <img
                      src={similar.image[0]['#text']}
                      alt={similar.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{similar.name}</h3>
                    <p className="text-sm text-gray-600">
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
