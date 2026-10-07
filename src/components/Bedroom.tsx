import { useState } from 'react'
import type { CSSProperties } from 'react'
import { scrapbook } from '../data'
import { essays } from '../writing/essays'
import type { Essay } from '../writing/essays'
import { Notes } from './Notes'

/**
 * My room: the personal side. Notes from visitors on a little clothesline,
 * a bookshelf for writing and research, a scrapbook on the bed and a desk.
 */

/** A book on the shelf. `essay` opens it to read; `soon` means not written yet. */
type Spine = { title: string; color: string; height: number; soon?: boolean; essay?: string }

const writing: Spine[] = [
  { title: 'questioning the a in ai', color: '#8F3F22', height: 150, essay: 'ai-intelligence' },
  { title: 'the open road', color: '#B0435B', height: 122, essay: 'ride' },
  { title: 'scrolling science', color: '#3D7A80', height: 128, essay: 'scrolling' },
  { title: 'fav eats!', color: '#D99A3E', height: 104, soon: true },
  { title: 'far from home', color: '#7FA38A', height: 118, soon: true },
  { title: 'personality disorders', color: '#B85C6E', height: 142, soon: true },
  { title: 'study habits', color: '#6E9CD0', height: 112, soon: true },
]

const research: Spine[] = [
  { title: 'llm tutors', color: '#2E6B45', height: 112 },
  { title: 'music x mental health', color: '#4A5670', height: 142 },
]

function Shelf({ label, items, onOpen }: { label: string; items: Spine[]; onOpen: (id: string) => void }) {
  return (
    <div className="shelf">
      <ul className="shelf__books">
        {items.map((b, i) => (
          <li key={i}>
            {b.essay ? (
              <button
                type="button"
                className="book is-readable"
                style={{ '--book': b.color, height: b.height } as CSSProperties}
                onClick={() => onOpen(b.essay!)}
                aria-label={`Read ${b.title}`}
              >
                <span className="book__title">{b.title}</span>
              </button>
            ) : (
              <span
                className={`book${b.soon ? ' is-soon' : ''}`}
                style={{ '--book': b.color, height: b.height } as CSSProperties}
                title={b.soon ? `${b.title} (coming soon)` : b.title}
              >
                <span className="book__title">{b.title}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="shelf__board" aria-hidden="true" />
      <span className="tag shelf__tag">{label}</span>
    </div>
  )
}

/** The bed, seen side-on, with the scrapbook lying on the quilt */
function Bed({ onOpenScrapbook }: { onOpenScrapbook: () => void }) {
  return (
    <div className="bed">
      <svg viewBox="0 0 460 190" aria-hidden="true" focusable="false">
        {/* headboard */}
        <rect x="0" y="20" width="26" height="170" rx="6" fill="#8E6A45" />
        {/* mattress + quilt */}
        <rect x="20" y="96" width="440" height="94" rx="10" fill="#F6F1E7" />
        <path d="M120 92 H452 Q460 92 460 100 V190 H120 Z" fill="#748B6B" />
        <g fill="#5E7557">
          <rect x="150" y="110" width="40" height="40" />
          <rect x="230" y="150" width="40" height="40" />
          <rect x="310" y="110" width="40" height="40" />
          <rect x="390" y="150" width="40" height="40" />
        </g>
        <g fill="#C96A3F" opacity="0.85">
          <rect x="190" y="150" width="40" height="40" />
          <rect x="270" y="110" width="40" height="40" />
          <rect x="350" y="150" width="40" height="40" />
        </g>
        {/* pillow */}
        <rect x="32" y="72" width="96" height="38" rx="16" fill="#FFFBF0" />
      </svg>
      {/* lying flat on the quilt, spine facing out */}
      <button type="button" className="scrapbook" onClick={onOpenScrapbook} aria-label="Open the scrapbook">
        <span>scrapbook</span>
      </button>
    </div>
  )
}

/** Desk with a lamp, a closed laptop, bubble tea and a chair tucked in */
function Desk() {
  return (
    <svg className="desk" viewBox="0 0 460 230" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="silver" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9DCE0" />
          <stop offset="0.5" stopColor="#EEF0F2" />
          <stop offset="1" stopColor="#C3C8CD" />
        </linearGradient>
        {/* the lamp's light falls in a soft cone onto the desk */}
        <linearGradient id="lamplight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7EBC4" stopOpacity="0.75" />
          <stop offset="1" stopColor="#F7EBC4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* lamp */}
      <path className="desk__glow" d="M68 66 L114 66 L150 142 L32 142 Z" fill="url(#lamplight)" />
      <path d="M70 38 L112 38 L120 66 L62 66 Z" fill="#C96A3F" />
      <rect x="88" y="66" width="6" height="72" fill="#2F4A36" />
      <rect x="70" y="134" width="42" height="8" rx="3" fill="#2F4A36" />
      {/* closed silver laptop */}
      <rect x="190" y="132" width="150" height="10" rx="3" fill="url(#silver)" />
      <rect x="190" y="138" width="150" height="2" fill="#AEB4BA" />
      {/* bubble tea */}
      <path d="M368 92 H404 L399 142 H373 Z" fill="#E9D2B0" opacity="0.95" />
      <path d="M368 92 H404 L403 100 H369 Z" fill="#F6EEDF" />
      <g fill="#3B2A22">
        <circle cx="379" cy="136" r="3.2" />
        <circle cx="387" cy="137" r="3.2" />
        <circle cx="395" cy="136" r="3.2" />
        <circle cx="383" cy="130" r="3.2" />
        <circle cx="391" cy="130" r="3.2" />
      </g>
      <path d="M366 92 Q386 80 406 92 Z" fill="#F6F1E7" opacity="0.9" />
      <rect x="389" y="56" width="5" height="40" rx="2" fill="#7FA38A" transform="rotate(10 391 76)" />
      {/* desk */}
      <rect x="20" y="142" width="420" height="16" fill="#C49A6C" />
      <rect x="20" y="158" width="420" height="10" fill="#A97C50" />
      <rect x="40" y="168" width="14" height="62" fill="#A97C50" />
      <rect x="406" y="168" width="14" height="62" fill="#A97C50" />
      {/* chair, tucked in, side-on */}
      <rect x="318" y="96" width="12" height="88" rx="5" fill="#5E7557" />
      <rect x="236" y="178" width="96" height="12" rx="5" fill="#748B6B" />
      <rect x="244" y="190" width="8" height="40" fill="#5E7557" />
      <rect x="316" y="190" width="8" height="40" fill="#5E7557" />
    </svg>
  )
}

/** Reading an essay: a clean page over the room */
function Reader({ essay, onClose }: { essay: Essay; onClose: () => void }) {
  return (
    <div className="reader" role="dialog" aria-label={essay.title} onClick={onClose}>
      <article className="reader__page" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="reader__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="reader__title">{essay.title}</h2>
        <p className="reader__meta">
          {[essay.byline, ...essay.details].join(' · ')}
        </p>
        {essay.note && <p className="reader__note">{essay.note}</p>}
        {essay.sections.map((sec) => (
          <section key={sec.heading || 'body'} className={sec.heading === 'References' ? 'reader__refs' : undefined}>
            {sec.heading && <h3>{sec.heading}</h3>}
            {sec.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}

/** The scrapbook, open: one spread at a time */
function Scrapbook({ onClose }: { onClose: () => void }) {
  // two photos per spread; empty slots show where photos will go
  const pages = scrapbook.length ? scrapbook : Array.from({ length: 4 }, () => null)
  const spreads = Math.max(1, Math.ceil(pages.length / 2))
  const [spread, setSpread] = useState(0)
  const shown = pages.slice(spread * 2, spread * 2 + 2)

  return (
    <div className="album" role="dialog" aria-label="Scrapbook" onClick={onClose}>
      <div className="album__book" onClick={(e) => e.stopPropagation()}>
        {shown.map((p, i) => (
          <div key={i} className="album__page">
            <figure className={`polaroid${p ? '' : ' is-empty'}`} style={{ rotate: i ? '2deg' : '-2.5deg' }}>
              <span className="polaroid__tape" aria-hidden="true" />
              {p ? <img src={p.src} alt={p.caption} /> : <span className="polaroid__blank">photo soon</span>}
              <figcaption>{p ? p.caption : 'more memories coming'}</figcaption>
            </figure>
          </div>
        ))}
        <div className="album__nav">
          <button type="button" disabled={spread === 0} onClick={() => setSpread((s) => s - 1)} aria-label="Previous page">
            ←
          </button>
          <span>
            {spread + 1} / {spreads}
          </span>
          <button
            type="button"
            disabled={spread >= spreads - 1}
            onClick={() => setSpread((s) => s + 1)}
            aria-label="Next page"
          >
            →
          </button>
        </div>
        <button type="button" className="album__close" onClick={onClose} aria-label="Close the scrapbook">
          ×
        </button>
      </div>
    </div>
  )
}

export function Bedroom({ onLeave }: { onLeave: () => void }) {
  const [album, setAlbum] = useState(false)
  const [reading, setReading] = useState<Essay | null>(null)
  const open = (id: string) => setReading(essays.find((e) => e.id === id) ?? null)

  return (
    <main className="room__row bedroom">
      <RoomSign to="living room" side="right" onClick={onLeave} />
      <section className="intro bedroom__left">
        <header className="intro__header">
          <h1>My Room</h1>
          <p className="intro__degree">Hobbyist writer. 200GB of photos on my phone, iCloud included</p>
          <p className="bedroom__aside">nice to see you! it's more casual in here, so make yourself at home :)</p>
        </header>
        <Notes />
        <Bed onOpenScrapbook={() => setAlbum(true)} />
      </section>
      <section className="bedroom__right">
        <div className="bedroom__shelves">
          <Shelf label="writing" items={writing} onOpen={open} />
          <Shelf label="research" items={research} onOpen={open} />
        </div>
        <Desk />
      </section>
      {album && <Scrapbook onClose={() => setAlbum(false)} />}
      {reading && <Reader essay={reading} onClose={() => setReading(null)} />}
    </main>
  )
}

/** A paper sign on the wall that takes you to the other room */
export function RoomSign({
  to,
  side,
  locked = false,
  onClick,
}: {
  to: string
  side: 'left' | 'right'
  locked?: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className={`room-sign room-sign--${side}`} onClick={onClick} aria-label={`Go to the ${to}`}>
      <span className="room-sign__pin" aria-hidden="true" />
      {side === 'right' ? `${to}${locked ? ' 🔒' : ''} →` : `← ${to}${locked ? ' 🔒' : ''}`}
    </button>
  )
}
