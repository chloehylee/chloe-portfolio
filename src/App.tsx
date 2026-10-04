import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { contact, defaultRecordId, funFacts, records } from './data'
import { FunFact } from './components/FunFact'
import { Console, Loveseat } from './components/Furniture'
import { Grain } from './components/Grain'
import { RecordWall } from './components/RecordWall'
import { Tv } from './components/Tv'
import { Degree } from './components/Degree'
import { Bedroom, RoomSign } from './components/Bedroom'
import { RoomLock, isRoomUnlocked } from './components/RoomLock'
import { Studio } from './components/Studio'
import { TextMorph } from 'torph/react'

// The room has two designs and the page picks whichever fills the window best:
//  - wide: liner notes beside the records (laptops, most monitors)
//  - tall: liner notes under the records as a wide card (squarer windows)
const LAYOUTS = [
  { className: '', width: 1440 },
  { className: 'is-tall', width: 1180 },
]
// Below this scale the text gets too small, so we use the stacked layout instead
const MIN_SCALE = 0.7
// No upper limit: on big screens (or zoomed out) the room just grows to fill them
const MAX_SCALE = Infinity
// Narrower than square, the scrolling stacked layout reads better
const MIN_ASPECT = 1
/**
 * On landscape screens, scale the whole room so it fits the window exactly
 * (no scrolling). If that would make the text too small, or the window is
 * portrait, fall back to the stacked scrolling layout.
 */
function useFitToScreen(ref: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const room = ref.current
    if (!room) return
    const html = document.documentElement
    // the living room's height in each design, so the other rooms can use the
    // same design and scale (and their titles match "Chloe Lee" exactly)
    const livingHeight: Record<string, number> = {}

    function reset() {
      if (!room) return
      room.classList.remove('is-fit', 'is-tall')
      html.classList.remove('fit')
      room.style.width = room.style.height = room.style.transform = ''
    }

    function fit() {
      if (!room) return
      const vw = window.innerWidth
      const vh = window.innerHeight

      // lay the room out in each design, measure it, and keep the one that
      // can be shown biggest
      let best = { className: '', width: 0, scale: 0 }
      for (const layout of LAYOUTS) {
        room.classList.remove('is-tall')
        room.classList.add('is-fit')
        if (layout.className) room.classList.add(layout.className)
        room.style.transform = 'none'
        room.style.width = `${layout.width}px`
        room.style.height = 'auto'
        let naturalHeight = room.scrollHeight
        if (room.querySelector('.room__row.living')) livingHeight[layout.className] = naturalHeight
        else naturalHeight = Math.max(naturalHeight, livingHeight[layout.className] ?? 0)
        const scale = Math.min(vw / layout.width, vh / naturalHeight, MAX_SCALE)
        if (scale > best.scale) best = { ...layout, scale }
      }

      if (vw / vh < MIN_ASPECT || best.scale < MIN_SCALE) {
        reset() // portrait or small window: normal stacked, scrolling layout
        return
      }

      room.classList.toggle('is-tall', best.className === 'is-tall')
      // size the room so that, once scaled, it covers the window edge to edge;
      // any spare width becomes even margins; spare height is shared out as wall
      room.style.width = `${vw / best.scale}px`
      room.style.height = `${vh / best.scale}px`
      room.style.transform = `scale(${best.scale})`
      html.classList.add('fit')
    }

    fit()
    window.addEventListener('resize', fit)
    // fonts change text height, so refit once they've loaded
    document.fonts?.ready.then(fit)
    return () => window.removeEventListener('resize', fit)
  }, [ref])
}

type Room = 'bedroom' | 'living' | 'studio'

export default function App() {
  const roomRef = useRef<HTMLDivElement>(null)
  useFitToScreen(roomRef)
  // the turntable and the TV share this: pause one and the other follows
  const [playing, setPlaying] = useState(true)
  // which room you're standing in
  // the house, left to right: my room · living room · studio
  const [where, setWhere] = useState<Room>('living')
  // which side you walked in from, so the room slides in from that side
  const [from, setFrom] = useState<Room | null>(null)
  // my room is locked until you have the password (remembered on this browser)
  const [unlocked, setUnlocked] = useState(isRoomUnlocked)
  const [asking, setAsking] = useState(false)
  function go(to: Room) {
    setFrom(where)
    setWhere(to)
    // the rooms can differ slightly in height, so refit once the new one is in
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
  }

  return (
    <div className="room" ref={roomRef}>
      <Grain id="grain-wall" className="grain--wall" />

      {where === 'bedroom' ? (
        <Bedroom key="bedroom" onLeave={() => go('living')} />
      ) : where === 'studio' ? (
        <Studio key="studio" onLeave={() => go('living')} />
      ) : (
      <main key="living" className={`room__row living${from ? ` from-${from}` : ''}`}>
        <section className="intro">
          <header className="intro__header">
            <h1>Chloe Lee</h1>
            <Degree />
            <FunFact facts={funFacts} />
          </header>

          <div className="scene">
            <Tv playing={playing} />
            <Console playing={playing} onToggle={() => setPlaying((p) => !p)} />
            <Loveseat />
          </div>
        </section>

        <RecordWall records={records} defaultId={defaultRecordId} />
        <RoomSign to="my room" side="left" locked={!unlocked} onClick={() => (unlocked ? go('bedroom') : setAsking(true))} />
        <RoomSign to="studio" side="right" onClick={() => go('studio')} />
      </main>
      )}

      {asking && (
        <RoomLock
          onClose={() => setAsking(false)}
          onUnlock={() => {
            setUnlocked(true)
            setAsking(false)
            go('bedroom')
          }}
        />
      )}

      <div className="baseboard" aria-hidden="true" />
      {/* the contact line sits right on the oak floor */}
      <footer className="floor">
        <p>
          {contact.before} <ReachOut />
        </p>
      </footer>
    </div>
  )
}

/**
 * "say hi": hover (or tap) and a little menu opens above it with the ways to
 * reach me. Pointing at an option morphs "say hi" into what it does (torph).
 */
function ReachOut() {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState(contact.link)
  const closeTimer = useRef<number | undefined>(undefined)
  const openedAt = useRef(0)
  const root = useRef<HTMLSpanElement>(null)

  // tapping or clicking anywhere else closes it
  useEffect(() => {
    if (!open) return
    function onDown(e: PointerEvent) {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function show() {
    window.clearTimeout(closeTimer.current)
    if (!open) openedAt.current = Date.now()
    setOpen(true)
  }
  // a short delay so moving the mouse from the link up to the menu doesn't close it
  function hide() {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 180)
  }

  return (
    <span
      ref={root}
      className={`reach${open ? ' is-open' : ''}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type="button"
        className="reach__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => {
          // a tap fires hover and click together; don't let the click undo the hover
          if (open && Date.now() - openedAt.current > 400) setOpen(false)
          else show()
        }}
      >
        <TextMorph>{open ? label : contact.link}</TextMorph>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 12h11M13 7l5 5-5 5" />
        </svg>
      </button>
      <span className="reach__menu">
        <a
          href={`mailto:${contact.email}`}
          tabIndex={open ? 0 : -1}
          onMouseEnter={() => setLabel('email me')}
          onFocus={() => setLabel('email me')}
          onMouseLeave={() => setLabel(contact.link)}
        >
          email
          <span className="reach__hint">{contact.email}</span>
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noreferrer"
          tabIndex={open ? 0 : -1}
          onMouseEnter={() => setLabel('view my linkedin')}
          onFocus={() => setLabel('view my linkedin')}
          onMouseLeave={() => setLabel(contact.link)}
        >
          linkedin
          <span className="reach__hint">/in/chloehylee</span>
        </a>
      </span>
    </span>
  )
}
