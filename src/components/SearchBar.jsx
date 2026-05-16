import { useState, useEffect, useRef } from 'react'

function SearchBar({ onSearch, onGeolocate }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef(null)
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

  useEffect(() => {
    if (input.trim().length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=${API_KEY}`)
        const data = await r.json()
        setSuggestions(data)
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [input])

  const handleSearch = (city) => {
    setInput(city.name)
    setSuggestions([])
    setShowSuggestions(false)
    onSearch(city.name)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      onSearch(input.trim())
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleGeo = () => {
    navigator.geolocation.getCurrentPosition(
      pos => onGeolocate(pos.coords.latitude, pos.coords.longitude),
      () => alert('Location access denied.')
    )
  }

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <input type="text" placeholder="Search city..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} />
        <button onClick={() => { setSuggestions([]); setShowSuggestions(false); onSearch(input.trim()) }}>Search</button>
        <button onClick={handleGeo} className="geo-btn" aria-label="Use my location">⊕</button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((city, i) => (
            <li key={i} onClick={() => handleSearch(city)}>
              <span className="suggestion-city">{city.name}</span>
              <span className="suggestion-meta">{city.state ? `${city.state}, ` : ''}{city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar