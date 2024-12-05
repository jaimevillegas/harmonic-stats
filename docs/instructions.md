# Last.fm Dashboard Project

A project to visualize data from Last.fm using its API, showcasing information about artists, albums, popular tracks, and historical statistics through interactive charts.

---

## **1. Prerequisites**
- **Required technologies**:
  - [Node.js](https://nodejs.org) (v18+)
  - [React](https://react.dev/)
  - [TailwindCSS](https://tailwindcss.com/)
  - [Chart.js](https://www.chartjs.org/) or [Recharts](https://recharts.org/)
  - [React Router](https://reactrouter.com/)
  - [Axios](https://axios-http.com/)
- **Access to the Last.fm API**:
  - Create an account at [Last.fm](https://www.last.fm/).
  - Obtain an API key from the [Last.fm API Console](https://www.last.fm/api).

---

## **2. Project Setup**

### **2.1. Create the Project**
```bash
# Create the app using Vite
npm create vite@latest lastfm-dashboard --template react

# Navigate to the project directory and set up TailwindCSS
cd lastfm-dashboard
npm install tailwindcss postcss autoprefixer
npx tailwindcss init

2.2. Configure TailwindCSS
Edit tailwind.config.js:

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

Edit src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

2.3. Install Dependencies
npm install axios react-router-dom chart.js react-chartjs-2

2.4. Set Up Last.fm API
Create a .env file:

REACT_APP_LASTFM_API_KEY=your_lastfm_api_key
REACT_APP_LASTFM_API_BASE_URL=https://ws.audioscrobbler.com/2.0/

Set up an Axios client in src/api/lastfm.js:

import axios from "axios";

const lastfm = axios.create({
  baseURL: process.env.REACT_APP_LASTFM_API_BASE_URL,
  params: {
    api_key: process.env.REACT_APP_LASTFM_API_KEY,
    format: "json",
  },
});

export default lastfm;

3. Dashboard Design
3.1. Main Structure
Home Page: Introduction to the dashboard.
Search: Search for artists, albums, or tracks.
Artist Details: Detailed information about the selected artist.
Charts: Historical trends charts.
Top Charts: Visualizing global top tracks and artists.

3.2. Routing Schema
Use React Router for navigation:
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ArtistDetails from "./pages/ArtistDetails";
import Charts from "./pages/Charts";
import TopCharts from "./pages/TopCharts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/artist/:id" element={<ArtistDetails />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/top-charts" element={<TopCharts />} />
      </Routes>
    </Router>
  );
}

export default App;


4. Detailed Sections
4.1. Home Page
Introduction to the dashboard.
Links to main sections.
4.2. Search
A search input connected to the API.
Paginated results displayed in a list.
Clicking an artist navigates to /artist/:id.
4.3. Artist Details
Basic Information:
Name, image, biography.
Statistics:
Listeners, play counts, and top tracks.
Historical Popularity Chart:
Use sample data or sources like Google Trends.
4.4. Charts
Dynamic charts with Last.fm data.
Weekly play count history.
4.5. Top Charts
Global lists of popular tracks and artists.


5. Implementing Charts
Use Chart.js for data visualization. Example of a line chart:
import { Line } from "react-chartjs-2";

const data = {
  labels: ["January", "February", "March", "April"],
  datasets: [
    {
      label: "Plays",
      data: [120, 200, 150, 300],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

export default function ExampleChart() {
  return <Line data={data} />;
}


6. Styling and Design
Use TailwindCSS for styling. Example of a card component:
export default function Card({ title, image, description }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
}



