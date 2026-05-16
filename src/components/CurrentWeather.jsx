const icons = {
  Clear: '☀️',
  Clouds: '⛅',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  default: '🌤️'
}

const toF = (c) => Math.round(c * 9 / 5 + 32)

function CurrentWeather({ data, isCelsius, onToggle }) {
  const temp = isCelsius ? Math.round(data.main.temp) : toF(data.main.temp)
  const feelsLike = isCelsius ? Math.round(data.main.feels_like) : toF(data.main.feels_like)
  const icon = icons[data.weather[0].main] || icons.default

  const now = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${now.toLocaleString('default', { month: 'long' })}`

  return (
    <div className="current-weather">
      <div className="current-top">
        <div>
          <h1 className="city">{data.name}, {data.sys.country}</h1>
          <p className="date">{dateStr}</p>
        </div>
        <div className="unit-toggle" onClick={onToggle}>
          <span className={isCelsius ? 'active' : ''}>°C</span>
          <span className={!isCelsius ? 'active' : ''}>°F</span>
        </div>
      </div>

      <div className="temp-row">
        <span className="temp">{temp}°</span>
        <div className="condition">
          <span className="icon">{icon}</span>
          <p>{data.weather[0].description}</p>
        </div>
      </div>

      <div className="meta">
        <span>Feels like {feelsLike}°</span>
        <span>Humidity {data.main.humidity}%</span>
        <span>Wind {Math.round(data.wind.speed * 3.6)} km/h</span>
      </div>
    </div>
  )
}

export default CurrentWeather