import { useEffect, useState } from 'react'

type ConsoleProps = {
  playing: boolean
  onToggle: () => void
}

/** Side table with a turntable and a matcha on it. Click the turntable to
 *  lift the needle off (the record slows to a stop), click again to play. */
// the matcha: three sips and it's empty, then it refills itself
const SIPS = 3
const REFILL_MS = 2500

export function Console({ playing, onToggle }: ConsoleProps) {
  const [sips, setSips] = useState(0)

  useEffect(() => {
    if (sips < SIPS) return
    const id = setTimeout(() => setSips(0), REFILL_MS)
    return () => clearTimeout(id)
  }, [sips])

  function sip() {
    setSips((s) => (s < SIPS ? s + 1 : s))
  }

  return (
    <svg
      className={`console${playing ? '' : ' is-paused'}`}
      viewBox="0 0 460 200"
      focusable="false"
    >
      {/* table */}
      <rect x="24" y="74" width="412" height="68" fill="#C49A6C" />
      <rect x="24" y="142" width="412" height="16" fill="#A97C50" />
      <rect x="40" y="158" width="14" height="42" fill="#A97C50" />
      <rect x="406" y="158" width="14" height="42" fill="#A97C50" />

      {/* turntable */}
      <g
        className="console__deck"
        role="button"
        tabIndex={0}
        aria-label={playing ? 'Pause the record' : 'Play the record'}
        aria-pressed={playing}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <rect x="84" y="124" width="216" height="14" rx="2" fill="#243A2B" />
        <rect x="84" y="70" width="216" height="55" rx="4" fill="#2F4A36" />
        <ellipse cx="178" cy="97" rx="64" ry="23" fill="#E8DCC8" />
        <g transform="translate(178 96) scale(1 0.36)">
          <g className="console__record">
            <circle r="60" fill="#1C1F1D" />
            <circle r="21" className="accent-fill" />
            <circle cx="9" cy="-9" r="4" fill="#FFFBF0" />
          </g>
          <circle r="3" fill="#FFFBF0" />
        </g>
        <g className="console__arm">
          <ellipse cx="272" cy="80" rx="9" ry="3.6" fill="#E8DCC8" />
          <path d="M272 79 L228 97" fill="none" stroke="#E8DCC8" strokeWidth="3" strokeLinecap="round" />
          <path d="M231 94 l-11 6 l3 5 l11 -6 z" fill="#E8DCC8" />
        </g>
        <ellipse cx="280" cy="110" rx="7" ry="2.8" fill="#E8DCC8" />
      </g>

      {/* matcha: hover for steam, click to take a sip */}
      <g
        className="console__cup"
        role="button"
        tabIndex={0}
        aria-label={sips < SIPS ? 'Take a sip of matcha' : 'Refilling the matcha'}
        onClick={sip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            sip()
          }
        }}
      >
        <rect x="336" y="40" width="64" height="92" fill="transparent" />
        <g className="console__steam" fill="none" stroke="#FFFBF0" strokeWidth="2.5" strokeLinecap="round">
          <path d="M360 82 q-5 -7 0 -14 q5 -7 0 -14" />
          <path d="M368 80 q-5 -7 0 -14 q5 -7 0 -14" />
          <path d="M376 82 q-5 -7 0 -14 q5 -7 0 -14" />
        </g>
        <path d="M346 92 L351 121 Q368 130 385 121 L390 92 Z" fill="#F6F1E7" />
        <ellipse cx="368" cy="92" rx="22" ry="7.5" fill="#F6F1E7" />
        {/* the inside of the cup, then the matcha clipped to the opening: each
            sip drops the surface lower until only the inner wall shows */}
        <clipPath id="cup-mouth">
          <ellipse cx="368" cy="92.5" rx="18.5" ry="5.6" />
        </clipPath>
        <ellipse cx="368" cy="92.5" rx="18.5" ry="5.6" fill="#E3D6C0" />
        <g clipPath="url(#cup-mouth)">
          <ellipse
            className="console__matcha"
            cx="368"
            cy="92.5"
            rx="18.5"
            ry="5.6"
            fill="#93B25E"
            style={{ transform: `translateY(${sips * 3.8}px)` }}
          />
        </g>
      </g>
    </svg>
  )
}

/** The back of a loveseat, sitting in front of everything. */
export function Loveseat() {
  return (
    <svg className="loveseat" viewBox="0 0 460 170" aria-hidden="true" focusable="false">
      <rect x="0" y="64" width="44" height="106" rx="18" fill="#5E7557" />
      <rect x="416" y="64" width="44" height="106" rx="18" fill="#5E7557" />
      {/* the back cushions squish a little when you hover them */}
      <g className="loveseat__back">
        <path d="M24 170 V44 Q24 12 56 12 H404 Q436 12 436 44 V170 Z" fill="#748B6B" />
        <path d="M230 14 V170" fill="none" stroke="#5E7557" strokeWidth="2" />
      </g>
    </svg>
  )
}

/** A simple potted plant that stands on the floor under the record wall */
export function Plant() {
  return (
    <svg className="plant" viewBox="0 0 150 200" aria-hidden="true" focusable="false">
      <g className="plant__leaves">
      <path d="M68 124 C52 110 38 94 26 70 C46 86 62 102 76 124 Z" fill="#748B6B" />
      <path d="M82 124 C98 112 112 96 126 74 C106 90 90 104 76 124 Z" fill="#748B6B" />
      <path d="M70 124 C54 98 42 64 36 26 C54 58 68 92 78 124 Z" fill="#5E7557" />
      <path d="M80 124 C96 98 108 66 116 32 C100 62 86 94 74 124 Z" fill="#5E7557" />
      <path d="M74 124 C67 90 66 46 73 6 C83 46 85 90 80 124 Z" fill="#2F4A36" />
      </g>
      <path d="M44 128 H106 L99 195 Q98 200 93 200 H57 Q52 200 51 195 Z" fill="#F6F1E7" />
      <rect x="38" y="118" width="74" height="13" rx="3" fill="#FFFBF0" />
    </svg>
  )
}
