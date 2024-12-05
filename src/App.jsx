import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Search from './pages/Search'
import ArtistDetails from './pages/ArtistDetails'
import Charts from './pages/Charts'
import TopCharts from './pages/TopCharts'
import Navbar from './components/Navbar'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/artist/:id" element={<ArtistDetails />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/top-charts" element={<TopCharts />} />
            {/* Additional routes will be added as we create the components */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
