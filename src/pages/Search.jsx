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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Search Artists</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for an artist..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {results.map((artist) => (
            <div
              key={artist.mbid || artist.url}
              onClick={() => navigate(`/artist/${artist.mbid}`, { state: { artist } })}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
            >
              <div className="flex items-center gap-4">
                {artist.image?.[1]?.['#text'] && (
                  <img
                    src={artist.image[1]['#text']}
                    alt={artist.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{artist.name}</h3>
                  <p className="text-gray-600">
                    {artist.listeners} listeners
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && query && !loading && (
          <p className="text-center text-gray-600">No results found</p>
        )}
      </div>
    </div>
  );
};

export default Search;
