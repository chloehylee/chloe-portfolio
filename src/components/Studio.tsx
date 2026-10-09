import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { projects } from '../data'
import type { Project } from '../data'
import { Grain } from './Grain'
import { RoomSign } from './Bedroom'

/**
 * The studio: personal projects as objects on a workbench, with a pegboard
 * of tools on the wall. Point at an object to read about it on the card;
 * click to keep that one open (same as the record wall).
 */

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

/** Highnotes: a mic on a little stand. Hovering it scrolls a lyric. */
function Mic() {
  return (
    <>
      <span className="mic__lyric" aria-hidden="true">
        <span>♪ the mitochondria is the powerhouse of the cell ♪ the mitochondria is the powerhouse of the cell ♪</span>
      </span>
      <svg viewBox="0 0 90 170" aria-hidden="true" focusable="false">
        {/* stand */}
        <rect x="42" y="86" width="6" height="74" fill="#2F4A36" />
        <ellipse cx="45" cy="162" rx="30" ry="7" fill="#2F4A36" />
        {/* mic */}
        <rect x="35" y="66" width="20" height="30" rx="5" fill="#2F4A36" />
        <rect x="35" y="64" width="20" height="7" fill="#C96A3F" />
        <rect x="27" y="14" width="36" height="52" rx="18" fill="#8E9AA0" />
        <g stroke="#6E7A80" strokeWidth="2">
          <path d="M30 28 H60 M28 38 H62 M28 48 H62 M30 58 H60" />
        </g>
      </svg>
    </>
  )
}

/** heart2heart: a phone on a stand, mid-conversation. Hovering sends a heart up. */
function Phone() {
  return (
    <>
      <svg className="phone__heart" viewBox="0 0 24 22" aria-hidden="true" focusable="false">
        <path d="M12 21 C4 15 0 11 0 6.5 A6 6 0 0 1 12 4 A6 6 0 0 1 24 6.5 C24 11 20 15 12 21 Z" fill="#B85C6E" />
      </svg>
      <svg viewBox="0 0 80 124" aria-hidden="true" focusable="false">
        {/* stand */}
        <path d="M14 124 L24 92 H56 L66 124 Z" fill="#C49A6C" />
        {/* phone */}
        <rect x="16" y="6" width="48" height="94" rx="9" fill="#2F4A36" />
        <rect x="20" y="14" width="40" height="76" rx="4" fill="#FFFBF0" />
        {/* the chat */}
        <rect x="24" y="22" width="22" height="9" rx="4.5" fill="#B7C7AE" />
        <rect x="34" y="36" width="22" height="9" rx="4.5" fill="#E3A6B4" />
        <rect x="24" y="50" width="16" height="9" rx="4.5" fill="#B7C7AE" />
        <path d="M45 74 C40 70 37 68 37 65 A3 3 0 0 1 45 64 A3 3 0 0 1 53 65 C53 68 50 70 45 74 Z" fill="#B85C6E" />
      </svg>
    </>
  )
}

/** Perfume visualizer: three bottles. Hovering lets their notes drift up and overlap. */
function Perfumes() {
  return (
    <>
      <span className="scent scent--a" aria-hidden="true" />
      <span className="scent scent--b" aria-hidden="true" />
      <span className="scent scent--c" aria-hidden="true" />
      <svg viewBox="0 0 150 120" aria-hidden="true" focusable="false">
        {/* tall pink */}
        <rect x="16" y="20" width="12" height="12" fill="#2F4A36" />
        <rect x="8" y="32" width="28" height="84" rx="4" fill="#E3A6B4" />
        <rect x="13" y="40" width="5" height="62" rx="2" fill="#FFFBF0" opacity="0.5" />
        {/* round amber */}
        <rect x="68" y="40" width="14" height="12" fill="#C49A6C" />
        <circle cx="75" cy="86" r="32" fill="#E8C27A" />
        <rect x="58" y="80" width="34" height="14" fill="#FFFBF0" opacity="0.75" />
        {/* square lilac */}
        <rect x="117" y="44" width="12" height="16" rx="6" fill="#2F4A36" />
        <rect x="106" y="60" width="34" height="56" rx="3" fill="#B9A6D6" />
        <rect x="111" y="66" width="5" height="40" rx="2" fill="#FFFBF0" opacity="0.5" />
      </svg>
    </>
  )
}

/** Days Better Tmr: a desk calendar. Hovering flips today over to tomorrow. */
function Calendar() {
  const today = new Date()
  const tmr = new Date(today)
  tmr.setDate(today.getDate() + 1)
  return (
    <span className="cal" aria-hidden="true">
      <span className="cal__page cal__page--tmr">
        <span className="cal__day">{DAYS[tmr.getDay()]}</span>
        <span className="cal__date">{tmr.getDate()}</span>
        <span className="cal__word">better :)</span>
      </span>
      <span className="cal__page cal__page--today">
        <span className="cal__day">{DAYS[today.getDay()]}</span>
        <span className="cal__date">{today.getDate()}</span>
        <span className="cal__word">today</span>
      </span>
      <span className="cal__rings" />
      <span className="cal__stand" />
    </span>
  )
}

/** Coming soon: a breadboard under a cloth. Hovering lifts the cloth; the LED blinks. */
function Hardware() {
  return (
    <>
      <svg className="hw__board" viewBox="0 0 130 90" aria-hidden="true" focusable="false">
        <rect x="10" y="56" width="110" height="30" rx="3" fill="#F6F1E7" />
        <g fill="#C9BFAE">
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <rect x={18 + i * 8.5} y="62" width="3" height="3" />
              <rect x={18 + i * 8.5} y="76" width="3" height="3" />
            </g>
          ))}
        </g>
        <rect x="58" y="44" width="3" height="16" fill="#8E9AA0" />
        <rect x="68" y="44" width="3" height="16" fill="#8E9AA0" />
        <path className="hw__led" d="M56 46 V36 a8 8 0 0 1 16 0 V46 Z" fill="#E0573E" />
      </svg>
      <svg className="hw__cloth" viewBox="0 0 130 90" aria-hidden="true" focusable="false">
        <path d="M6 88 C10 60 22 26 64 22 C106 26 120 60 124 88 Q96 82 66 88 Q36 82 6 88 Z" fill="#9FB08F" />
        <path d="M40 34 C48 50 46 70 42 86 M86 32 C80 52 84 70 90 86" stroke="#8A9C7A" strokeWidth="2" fill="none" />
      </svg>
      <span className="tag hw__tag">coming soon</span>
    </>
  )
}

const OBJECTS: Record<string, { className: string; draw: () => ReactNode }> = {
  highnotes: { className: 'mic', draw: Mic },
  heart2heart: { className: 'phone', draw: Phone },
  perfume: { className: 'perfumes', draw: Perfumes },
  'days-better': { className: 'cal-wrap', draw: Calendar },
  hardware: { className: 'hw', draw: Hardware },
}

/** Tools hanging on the pegboard, just for the room */
function Pegboard() {
  return (
    <div className="pegboard" aria-hidden="true">
      <svg viewBox="0 0 520 190" focusable="false">
        {/* headphones */}
        <path d="M70 92 a40 40 0 0 1 80 0" fill="none" stroke="#2F4A36" strokeWidth="7" />
        <rect x="60" y="86" width="18" height="34" rx="7" fill="#C96A3F" />
        <rect x="142" y="86" width="18" height="34" rx="7" fill="#C96A3F" />
        {/* ruler */}
        <rect x="200" y="34" width="22" height="130" rx="2" fill="#E8C27A" />
        <g stroke="#A97C50" strokeWidth="2">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M200 ${44 + i * 10} h${i % 2 ? 6 : 11}`} />
          ))}
        </g>
        {/* coil of wire */}
        <g fill="none" stroke="#B85C6E" strokeWidth="4">
          <circle cx="300" cy="86" r="30" />
          <circle cx="302" cy="88" r="24" />
          <path d="M318 110 q16 20 4 46" />
        </g>
        {/* screwdriver */}
        <rect x="384" y="36" width="16" height="44" rx="6" fill="#7FA38A" />
        <rect x="389" y="80" width="6" height="64" fill="#8E9AA0" />
        {/* scissors */}
        <g fill="none" stroke="#2F4A36" strokeWidth="5">
          <circle cx="452" cy="56" r="11" />
          <circle cx="476" cy="56" r="11" />
        </g>
        <path d="M456 66 L472 130 M472 66 L456 130" stroke="#8E9AA0" strokeWidth="5" />
      </svg>
    </div>
  )
}

/** The project card: the same paper as the liner notes */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <aside className="liner studio__card" aria-live="polite" style={{ ['--album' as string]: project.color }}>
      <Grain id="grain-paper-studio" className="grain--paper" />
      <div className="liner__inner">
        <p className="liner__cat">
          ST-{String(index + 1).padStart(2, '0')} · {project.status}
        </p>
        <h3 key={project.id} className="liner__title studio__title">
          {project.name}
        </h3>
        <p key={project.role} className="liner__role">
          {project.role}
        </p>
        <ol className="liner__tracks">
          {project.notes.map((note, i) => (
            <li key={project.id + i} className="track">
              <span className="track__no">{String(i + 1).padStart(2, '0')}</span>
              <span className="track__title">{note}</span>
            </li>
          ))}
        </ol>
        {project.link && (
          <a className="studio__link" href={project.link.href} target="_blank" rel="noreferrer">
            {project.link.label} →
          </a>
        )}
      </div>
    </aside>
  )
}

export function Studio({ onLeave }: { onLeave: () => void }) {
  const [activeId, setActiveId] = useState(projects[0].id)
  const [picked, setPicked] = useState(false)
  const index = Math.max(
    0,
    projects.findIndex((p) => p.id === activeId),
  )
  const active = projects[index]

  return (
    <main className="room__row studio">
      <RoomSign to="living room" side="left" onClick={onLeave} />
      <section className="intro studio__left">
        <header className="intro__header">
          <h1>Studio</h1>
          <p className="intro__degree">Personal projects, built for fun</p>
          <p className="bedroom__aside">pick something up off the bench</p>
        </header>
        <ProjectCard project={active} index={index} />
      </section>
      <section className="studio__right">
        <Pegboard />
        <div className="bench">
          <ul className="bench__items">
            {projects.map((p) => {
              const obj = OBJECTS[p.id]
              const Draw = obj?.draw
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`thing ${obj?.className ?? ''}${p.id === active.id ? ' is-active' : ''}`}
                    style={{ '--thing': p.color } as CSSProperties}
                    aria-label={p.name}
                    aria-pressed={p.id === active.id}
                    onMouseEnter={() => !picked && setActiveId(p.id)}
                    onFocus={() => !picked && setActiveId(p.id)}
                    onClick={() => {
                      setPicked(true)
                      setActiveId(p.id)
                    }}
                  >
                    {Draw ? <Draw /> : <span className="tag">{p.name}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
          <svg className="bench__frame" viewBox="0 0 640 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <rect x="0" y="0" width="640" height="18" fill="#C49A6C" />
            <rect x="0" y="18" width="640" height="10" fill="#A97C50" />
            <rect x="26" y="28" width="16" height="92" fill="#A97C50" />
            <rect x="598" y="28" width="16" height="92" fill="#A97C50" />
            <rect x="42" y="84" width="556" height="8" fill="#8E6A45" />
          </svg>
        </div>
      </section>
    </main>
  )
}
