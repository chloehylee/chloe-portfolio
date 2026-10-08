import { useState } from 'react'
import { contact } from '../data'

/**
 * A soft lock on my room: visitors ask me for the password, and friends get
 * a hint. The password is checked against a hash so it isn't sitting in the
 * page as plain text, but this is a polite "please knock", not real
 * security: the room's content still ships with the site.
 */

// sha-256 of the accepted answers (lowercased, spaces removed):
// the Pokémon's proper spelling, and the way I usually spell it
const ACCEPTED = new Set([
  '278ad624f6cebd4c5bdb9b7dd4fb5d586f7027e1f6f68fd62a754ca3c31234b8',
  'a1f073c2cff9143c19b138dc78c92c1694c691355267bd75fbe2a3975fd1c74e',
])

const KEY = 'room-unlocked'

export function isRoomUnlocked() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

async function sha256(text: string) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function RoomLock({ onUnlock, onClose }: { onUnlock: () => void; onClose: () => void }) {
  const [value, setValue] = useState('')
  const [hint, setHint] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [shake, setShake] = useState(false)

  async function tryUnlock() {
    const guess = value.toLowerCase().replace(/\s+/g, '')
    if (!guess) return
    let ok = false
    try {
      ok = ACCEPTED.has(await sha256(guess))
    } catch {
      ok = false
    }
    if (ok) {
      try {
        localStorage.setItem(KEY, '1')
      } catch {
        // private window: they'll just be asked again next visit
      }
      onUnlock()
    } else {
      setWrong(true)
      setShake(false)
      requestAnimationFrame(() => setShake(true))
    }
  }

  return (
    <div className="lock" role="dialog" aria-label="My room is locked" onClick={onClose}>
      <form
        className={`lock__card${shake ? ' is-wrong' : ''}`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          tryUnlock()
        }}
        onAnimationEnd={() => setShake(false)}
      >
        <button type="button" className="lock__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <svg className="lock__icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h2 className="lock__title">my room is locked</h2>
        <p className="lock__text">
          my professional work was all there! this area is friends only
          <br />
          but <a href={`mailto:${contact.email}`}>reach out</a> and I'll send you the password :)
        </p>
        <div className="lock__row">
          <input
            type="password"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setWrong(false)
            }}
            placeholder="password"
            aria-label="Password"
            autoFocus
          />
          <button type="submit" disabled={!value.trim()}>
            unlock
          </button>
        </div>
        {wrong && <p className="lock__wrong">not quite, try again</p>}
        {hint ? (
          <p className="lock__hint">hint: my favourite pokémon</p>
        ) : (
          <button type="button" className="lock__hint-btn" onClick={() => setHint(true)}>
            know me? get a hint
          </button>
        )}
      </form>
    </div>
  )
}
