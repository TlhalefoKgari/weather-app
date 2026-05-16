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
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Forecast({ days: forecastDays, isCelsius }) {
  return (
    <div className="forecast">
      <p className="forecast-label">5-day forecast</p>
      <div className="forecast-days">
        {forecastDays.map(([date, items]) => {
          const temps = items.map(i => i.main.temp)
          const hi = isCelsius ? Math.round(Math.max(...temps)) : toF(Math.max(...temps))
          const lo = isCelsius ? Math.round(Math.min(...temps)) : toF(Math.min(...temps))
          const main = items[0].weather[0].main
          const icon = icons[main] || icons.default
          const dayName = days[new Date(date).getDay()]

          return (
            <div className="forecast-day" key={date}>
              <span className="day-name">{dayName}</span>
              <span className="day-icon">{icon}</span>
              <span className="day-hi">{hi}°</span>
              <span className="day-lo">{lo}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Forecast