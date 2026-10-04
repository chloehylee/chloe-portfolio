import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * The subtitle under my name. Hover a phrase and it turns into a little
 * picture of itself, drawn in exactly the space the words took up:
 *  - Software Engineer.     -> ASCII scramble that settles into a terminal command
 *  - Computer Science       -> a GitHub-style contribution grid
 *  - Cognitive Science      -> an AI agent "thinking"
 *  - University of Toronto  -> UofT's coordinates, typed out
 */
export function Degree() {
  return (
    <p className="intro__degree">
      <Phrase fx={Ascii} strong>Software Engineer.</Phrase> <Phrase fx={Contributions}>Computer Science</Phrase>{' '}
      and <Phrase fx={Thinking}>Cognitive Science</Phrase> at the{' '}
      <Phrase fx={Coordinates}>University of Toronto</Phrase>
    </p>
  )
}

type Size = { width: number; height: number }
type Fx = (props: { size: Size }) => ReactNode

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Phrase({ children, fx: Effect, strong }: { children: string; fx: Fx; strong?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState<Size | null>(null)

  return (
    <span
      ref={ref}
      className={`phrase${size ? ' is-on' : ''}`}
      onMouseEnter={() => {
        // measure the words in layout pixels (offset sizes ignore the room's scale)
        if (ref.current) setSize({ width: ref.current.offsetWidth, height: ref.current.offsetHeight })
      }}
      onMouseLeave={() => setSize(null)}
    >
      <span className={`phrase__text${strong ? ' phrase__text--strong' : ''}`}>{children}</span>
      {size && (
        <span className="phrase__fx" aria-hidden="true">
          <Effect size={size} />
        </span>
      )}
    </span>
  )
}

/** pick a monospace font size so `chars` characters fill `width` exactly */
function monoSize(width: number, chars: number, max = 17) {
  return Math.min(max, width / (chars * 0.6))
}

/* ---------- Software Engineer: ASCII scramble -> `npm run dev` ---------- */

const GLYPHS = '#%&*+=<>/\\|{}[]()_-~^;:01'
const COMMAND = '$ npm run dev'

function Ascii({ size }: { size: Size }) {
  const [text, setText] = useState(() => scramble(COMMAND.length))
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(COMMAND)
      setDone(true)
      return
    }
    let frame = 0
    const id = setInterval(() => {
      frame++
      // letters lock in from left to right, the rest keep scrambling
      const locked = Math.max(0, frame - 4)
      setText(COMMAND.slice(0, locked) + scramble(Math.max(0, COMMAND.length - locked)))
      if (locked >= COMMAND.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 38)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="fx-ascii" style={{ fontSize: monoSize(size.width, COMMAND.length + 1) }}>
      {text}
      <span className={`fx-ascii__cursor${done ? ' is-blinking' : ''}`}>▍</span>
    </span>
  )
}

function scramble(n: number) {
  let s = ''
  for (let i = 0; i < n; i++) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  return s
}

/* ---------- Computer Science: contribution grid ---------- */

const CELL = 6
const GAP = 2
const ROWS = 4
// empty, then four greens, lightest to darkest
const LEVELS = ['rgba(47, 74, 54, 0.1)', '#bcd59a', '#8dbb6a', '#4f8f45', '#2e6b45']

function randomLevel() {
  // mostly light days, the odd busy one, like a real graph
  const r = Math.random()
  return r < 0.28 ? 0 : r < 0.55 ? 1 : r < 0.78 ? 2 : r < 0.93 ? 3 : 4
}

function Contributions({ size }: { size: Size }) {
  const cols = Math.max(1, Math.floor((size.width + GAP) / (CELL + GAP)))
  const [cells, setCells] = useState(() => Array.from({ length: cols * ROWS }, randomLevel))

  // a few squares change every beat, so the graph keeps quietly "committing"
  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      setCells((prev) => {
        const next = prev.slice()
        for (let k = 0; k < 3; k++) next[Math.floor(Math.random() * next.length)] = randomLevel()
        return next
      })
    }, 260)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className="fx-grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
        gap: GAP,
      }}
    >
      {cells.map((level, i) => (
        <span
          key={i}
          className="fx-grid__cell"
          style={{
            background: LEVELS[level],
            // fill in column by column, left to right
            animationDelay: `${Math.floor(i / ROWS) * 14}ms`,
          }}
        />
      ))}
    </span>
  )
}

/* ---------- Cognitive Science: an agent thinking ---------- */

const SPINNER = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢']

function Thinking() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => setI((n) => (n + 1) % SPINNER.length), 110)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="fx-think">
      <span className="fx-think__spin">{SPINNER[i]}</span>
      <span className="fx-think__word">thinking</span>
      <span className="fx-think__bar">
        <span />
      </span>
    </span>
  )
}

/* ---------- University of Toronto: coordinates typed out ---------- */

const COORDS = '⌖ 43.6629°N 79.3957°W'

function Coordinates({ size }: { size: Size }) {
  const [n, setN] = useState(0)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setN(COORDS.length)
      return
    }
    const id = setInterval(() => {
      setN((k) => {
        if (k >= COORDS.length) clearInterval(id)
        return Math.min(COORDS.length, k + 1)
      })
    }, 32)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="fx-coords" style={{ fontSize: monoSize(size.width, COORDS.length + 1) }}>
      {COORDS.slice(0, n)}
      <span className="fx-ascii__cursor is-blinking">▍</span>
    </span>
  )
}
