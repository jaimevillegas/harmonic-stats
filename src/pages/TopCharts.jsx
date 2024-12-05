import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import lastfm from '../api/lastfm';

const TopCharts = () => {
  const [activeTab, setActiveTab] = useState('artists');
  const [timeRange, setTimeRange] = useState('7day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const tabs = [
    { id: 'artists', label: 'Top Artists' },
    { id: 'tracks', label: 'Top Tracks' },
    { id: 'tags', label: 'Popular Tags' },
  ];

  const timeRangeOptions = [
    { value: '7day', label: 'Last 7 Days' },
    { value: '1month', label: 'Last Month' },
    { value: '3month', label: 'Last 3 Months' },
    { value: '6month', label: 'Last 6 Months' },
    { value: '12month', label: 'Last 12 Months' },
    { value: 'overall', label: 'All Time' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        switch (activeTab) {
          case 'artists':
            response = await lastfm.get('/', {
              params: {
                method: 'chart.getTopArtists',
                limit: itemsPerPage,
                page: page,
                period: timeRange,
              },
            });
            setData(response.data.artists?.artist || []);
            break;

          case 'tracks':
            response = await lastfm.get('/', {
              params: {
                method: 'chart.getTopTracks',
                limit: itemsPerPage,
                page: page,
                period: timeRange,
              },
            });
            setData(response.data.tracks?.track || []);
            break;

          case 'tags':
            response = await lastfm.get('/', {
              params: {
                method: 'chart.getTopTags',
                limit: itemsPerPage,
                page: page,
              },
            });
            setData(response.data.tags?.tag || []);
            break;

          default:
            break;
        }
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Top Charts error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, timeRange, page]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
  };

  const renderArtistItem = (artist, index) => (
    <Link
      to={`/artist/${artist.mbid}`}
      state={{ artist }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <span className="text-2xl font-bold text-gray-400 w-8">
        {(page - 1) * itemsPerPage + index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{artist.name}</h3>
        <p className="text-sm text-gray-600">
          {parseInt(artist.listeners).toLocaleString()} listeners
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">
          {parseInt(artist.playcount).toLocaleString()} plays
        </p>
      </div>
    </Link>
  );

  const renderTrackItem = (track, index) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <span className="text-2xl font-bold text-gray-400 w-8">
        {(page - 1) * itemsPerPage + index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{track.name}</h3>
        <p className="text-sm text-gray-600">
          {track.artist.name}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">
          {parseInt(track.playcount).toLocaleString()} plays
        </p>
      </div>
    </div>
  );

  const renderTagItem = (tag, index) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <span className="text-2xl font-bold text-gray-400 w-8">
        {(page - 1) * itemsPerPage + index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{tag.name}</h3>
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            {parseInt(tag.reach).toLocaleString()} reach
          </span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
            {parseInt(tag.taggings).toLocaleString()} taggings
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Global Top Charts</h1>

      {/* Controls */}
      <div className="mb-8 space-y-4">
        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-gray-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex-1 py-2.5 px-3 text-sm font-medium rounded-lg
                ${activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Time Range Selector (hide for tags) */}
        {activeTab !== 'tags' && (
          <div>
            <select
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
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {data.map((item, index) => (
              <div key={item.mbid || item.url || index}>
                {activeTab === 'artists' && renderArtistItem(item, index)}
                {activeTab === 'tracks' && renderTrackItem(item, index)}
                {activeTab === 'tags' && renderTagItem(item, index)}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-4 py-2 border rounded-lg bg-white">
          Page {page}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 border rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TopCharts;
