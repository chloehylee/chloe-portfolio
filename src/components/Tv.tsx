import { useEffect, useState } from 'react'
import { TextMorph } from 'torph/react'
import { records, tv } from '../data'

function formatTime(timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date())
}

function useClock(timeZone: string) {
  const [time, setTime] = useState(() => formatTime(timeZone))

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(timeZone)), 15000)
    return () => clearInterval(id)
  }, [timeZone])

  return time
}

export function Tv({ playing }: { playing: boolean }) {
  const time = useClock(tv.timeZone)
  const thumbs = tv.nowPlaying.recordIds
    .map((id) => records.find((r) => r.id === id))
    .filter((r) => r !== undefined)

  return (
    <div className={`tv${playing ? '' : ' is-paused'}`}>
      <div className="tv__screen">
        <div className="tv__ui">
          <div className="tv__top">
            <div className="tv__where">
              <span className="tv__time">
                {/* the colon blinks like a cable-box clock */}
                <TextMorph>{time.split(':')[0]}</TextMorph>
                <span className="tv__colon">:</span>
                <TextMorph>{time.split(':')[1]}</TextMorph>
              </span>
              <span className="tv__city">{tv.city}</span>
            </div>
            <p className="tv__next">
              <strong>seeking</strong> {tv.upNext}
            </p>
          </div>
          <div className="tv__now">
            <div className="tv__track">
              <div className="tv__thumbs" aria-hidden="true">
                {thumbs.map((r) => (
                  <span
                    key={r.id}
                    className="tv__thumb"
                    style={{
                      backgroundColor: r.color,
                      backgroundImage: r.cover ? `url(${r.cover})` : undefined,
                    }}
                  />
                ))}
              </div>
              <div className="tv__meta">
                <TextMorph className="tv__label">{playing ? 'now playing' : 'paused'}</TextMorph>
                <span className="tv__title">{tv.nowPlaying.title}</span>
                <span className="tv__subtitle">{tv.nowPlaying.subtitle}</span>
              </div>
            </div>
            <div className="tv__progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
