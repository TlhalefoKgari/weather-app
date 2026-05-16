import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import './App.css'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [isCelsius, setIsCelsius] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchWeather = async (city) => {
    setLoading(true)
    setError('')

    try {
      const[wRes, fRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
      ])

      if(!wRes.ok) throw new Error('Error: City not found!')
      const wData = await wRes.json()
      const fData = await fRes.json()

      setWeather(wData)
      const daily = {}
      fData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0]
        if (!daily[date]) daily[date] = []
        daily[date].push(item)
      })

      setForecast(Object.entries(daily).slice(0, 5))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchByCoords = async (lat, lon) => {
  setLoading(true)
  setError('')
  try {
    const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    if (!r.ok) throw new Error('Could not get location weather')
    const d = await r.json()
    fetchWeather(d.name)
  } catch (e) {
    setError(e.message)
    setLoading(false)
  }
}

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude), () => fetchWeather('Roodepoort')
    )
  }, [])
 
  return (
    <div className="app">
      <div className="card">
        <SearchBar onSearch={fetchWeather} onGeolocate={fetchByCoords} />
        {loading && <p className="status">Fetching weather...</p>}
        {error && <p className="status error">{error}</p>}
        {weather && !loading && (
          <>
            <CurrentWeather data={weather} isCelsius={isCelsius} onToggle={() => setIsCelsius(!isCelsius)} />
            <Forecast days={forecast} isCelsius={isCelsius} />
          </>
        )}
      </div>
    </div>
  )
}


export default App