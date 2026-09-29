import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { RecordItem } from '../data'
import { Plant } from './Furniture'
import { TextMorph } from 'torph/react'
import { Grain } from './Grain'

type SleeveProps = {
  record: RecordItem
  active: boolean
  /** hover / keyboard focus: preview this record */
  onPreview: () => void
  /** click: pick this record and keep it */
  onPick: () => void
}

function Sleeve({ record, active, onPreview, onPick }: SleeveProps) {
  const className = ['sleeve', `sleeve--${record.format}`, active ? 'is-active' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      style={{ '--sleeve-color': record.color, '--calm': record.calm ?? 0 } as CSSProperties}
      aria-label={record.name}
      aria-pressed={active}
      onClick={onPick}
      onMouseEnter={onPreview}
      onFocus={onPreview}
    >
      <span className="sleeve__disc" aria-hidden="true">
        <span className="vinyl">
          <span className="vinyl__label" />
        </span>
      </span>
      <span className="sleeve__face">
        {record.cover ? (
          // the cover already shows the name, so no tape label
          <>
            <img className="sleeve__cover" src={record.cover} alt="" />
            {/* the same paper grain as the liner notes, so every cover looks printed on one stock */}
            <span className="sleeve__grain" aria-hidden="true" />
          </>
        ) : (
          <>
            <span className="sleeve__ring" aria-hidden="true" />
            <span className="sleeve__tape" aria-hidden="true">
              {record.name}
            </span>
          </>
        )}
      </span>
    </button>
  )
}

/** The back of the sleeve: cover + catalogue number, then a tracklist of what I did */
function LinerNotes({ record, catalogue }: { record: RecordItem; catalogue: string }) {
  const format = `side a · ${record.format === 'lp' ? '12-inch LP' : '7-inch single'}`

  return (
    <aside className="liner" aria-live="polite" style={{ ['--album' as string]: record.color }}>
      <Grain id="grain-paper" className="grain--paper" />
      {/* the words morph from one record to the next (torph) */}
      <div className="liner__inner">
        <div className="liner__top">
          {record.cover ? (
            <img className="liner__thumb" src={record.cover} alt="" />
          ) : (
            <span className="liner__thumb" style={{ background: record.color }} />
          )}
          <div className="liner__labels">
            <p className="liner__cat">{catalogue} · stereo</p>
            <p className="liner__meta">
              <TextMorph>{format}</TextMorph>
              <br />
              <TextMorph>{record.kind}</TextMorph>
            </p>
          </div>
        </div>
        <TextMorph as="h3" className="liner__title">{record.name}</TextMorph>
        <p key={record.role} className="liner__role">
          {record.role}
        </p>
        <ol className="liner__tracks">
          {record.tracks.map((track, i) => (
            <li key={i} className="track">
              <span className="track__no">{String(i + 1).padStart(2, '0')}</span>
              <span key={track.title} className="track__title">{track.title}</span>
            </li>
          ))}
        </ol>
        {record.album && (
          <div className="liner__album">
            <span className="liner__album-label">inspired by</span>
            <TextMorph as="p" className="liner__album-title">{record.album.title}</TextMorph>
            <TextMorph as="p" className="liner__album-artist">{record.album.artist}</TextMorph>
          </div>
        )}
      </div>
    </aside>
  )
}

type RecordWallProps = {
  records: RecordItem[]
  defaultId: string
}

export function RecordWall({ records, defaultId }: RecordWallProps) {
  const [activeId, setActiveId] = useState(defaultId)
  // Hovering previews records until you click one; after that, the clicked
  // record stays put (hovering others won't change it) until you click another.
  const [picked, setPicked] = useState(false)
  const active = records.find((r) => r.id === activeId) ?? records[0]
  const catalogue = `CL-${String(records.indexOf(active) + 1).padStart(2, '0')}`

  return (
    <section className="wall" aria-labelledby="wall-title">
      <h2 id="wall-title" className="wall__title">
        my record collection
      </h2>
      <div className="wall__body">
        <ul className="wall__grid">
        {records.map((record) => (
          <li key={record.id}>
            <Sleeve
              record={record}
              active={record.id === active.id}
              onPreview={() => {
                if (!picked) setActiveId(record.id)
              }}
              onPick={() => {
                setPicked(true)
                setActiveId(record.id)
              }}
            />
          </li>
        ))}
        </ul>
        <LinerNotes record={active} catalogue={catalogue} />
      </div>
      <Plant />
    </section>
  )
}
