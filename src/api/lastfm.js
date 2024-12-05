import axios from 'axios';

const lastfm = axios.create({
  baseURL: import.meta.env.VITE_LASTFM_API_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_LASTFM_API_KEY,
    format: 'json',
  },
});

export default lastfm;
