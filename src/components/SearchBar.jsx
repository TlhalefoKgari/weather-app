import { useState } from 'react'

function SearchBar({ onSearch, onGeolocate }) {
  const [input, setInput] = useState('')

  const handleSearch = () => {
    if (input.trim()) onSearch(input.trim())
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleGeo = () => {
    navigator.geolocation.getCurrentPosition(
      pos => onGeolocate(pos.coords.latitude, pos.coords.longitude),
      () => alert('Location access denied.')
    )
  }

  return (
    <div className="search-bar">
      <input type="text" placeholder="Search city..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleGeo} className="geo-btn" aria-label="Use my location">⊕</button>
    </div>
  )
}

export default SearchBar