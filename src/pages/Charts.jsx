import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import lastfm from '../api/lastfm';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7day'); // '7day', '1month', '3month', '6month', '12month'

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch top artists
        const artistsResponse = await lastfm.get('/', {
          params: {
            method: 'chart.getTopArtists',
            limit: 10,
            period: timeRange,
          },
        });
        setTopArtists(artistsResponse.data.artists?.artist || []);

        // Fetch top tracks
        const tracksResponse = await lastfm.get('/', {
          params: {
            method: 'chart.getTopTracks',
            limit: 10,
            period: timeRange,
          },
        });
        setTopTracks(tracksResponse.data.tracks?.track || []);

        // Fetch top tags
        const tagsResponse = await lastfm.get('/', {
          params: {
            method: 'chart.getTopTags',
            limit: 10,
          },
        });
        setTopTags(tagsResponse.data.tags?.tag || []);

      } catch (err) {
        setError('Failed to fetch chart data. Please try again.');
        console.error('Charts error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timeRange]);

  const timeRangeOptions = [
    { value: '7day', label: 'Last 7 Days' },
    { value: '1month', label: 'Last Month' },
    { value: '3month', label: 'Last 3 Months' },
    { value: '6month', label: 'Last 6 Months' },
    { value: '12month', label: 'Last 12 Months' },
  ];

  // Chart configurations
  const artistChartData = {
    labels: topArtists.map(artist => artist.name),
    datasets: [
      {
        label: 'Listeners',
        data: topArtists.map(artist => parseInt(artist.listeners)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const trackChartData = {
    labels: topTracks.map(track => track.name),
    datasets: [
      {
        label: 'Playcount',
        data: topTracks.map(track => parseInt(track.playcount)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const tagChartData = {
    labels: topTags.map(tag => tag.name),
    datasets: [
      {
        data: topTags.map(tag => parseInt(tag.reach)),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Top Tags Distribution',
      },
    },
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Music Charts</h1>
        
        {/* Time Range Selector */}
        <div className="mb-6">
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-2">
            Select Time Range:
          </label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Artists Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Top Artists by Listeners</h2>
            <Bar options={chartOptions} data={artistChartData} />
          </div>

          {/* Top Tracks Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Top Tracks by Playcount</h2>
            <Line options={chartOptions} data={trackChartData} />
          </div>

          {/* Top Tags Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Top Tags Distribution</h2>
            <div className="aspect-square">
              <Pie options={pieOptions} data={tagChartData} />
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Top Artists</h3>
                <ul className="space-y-2">
                  {topArtists.slice(0, 5).map((artist, index) => (
                    <li key={artist.mbid || index} className="flex justify-between">
                      <span>{artist.name}</span>
                      <span className="text-gray-600">{parseInt(artist.listeners).toLocaleString()} listeners</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Top Tracks</h3>
                <ul className="space-y-2">
                  {topTracks.slice(0, 5).map((track, index) => (
                    <li key={track.url || index} className="flex justify-between">
                      <span>{track.name}</span>
                      <span className="text-gray-600">{parseInt(track.playcount).toLocaleString()} plays</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
