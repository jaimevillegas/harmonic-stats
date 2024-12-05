import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import lastfm from '../api/lastfm';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await lastfm.get('/', {
        params: {
          method: 'artist.search',
          artist: query,
          limit: 10,
        },
      });

      const artists = response.data.results?.artistmatches?.artist || [];
      setResults(artists);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Search Artists
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find detailed information about your favorite artists
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for an artist..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {results.map((artist) => (
          <div
            key={artist.mbid || artist.url}
            onClick={() => navigate(`/artist/${artist.mbid}`, { state: { artist } })}
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {artist.image?.[1]?.['#text'] && (
                <img
                  src={artist.image[1]['#text']}
                  alt={artist.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {artist.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {artist.listeners} listeners
                </p>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && query && !loading && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-300">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
