import { useEffect, useRef, useState } from 'react'

/**
 * Notes from visitors, clipped to a little clothesline on the wall.
 *
 * When the page runs as a Claude artifact, notes are saved in the
 * artifact's shared store: everyone it's shared with reads them, and each
 * person who's allowed to write can pin one note of their own (writing
 * again replaces it). Anywhere else (e.g. the plain hosted site) there's no
 * store, so the line shows a placeholder until a backend is hooked up.
 */

type Note = { id: string; text: string; name: string; createdAt: number }

// the bits of the artifact runtime this file uses (see claude.use docs)
type Snap = { id: string; data(): Record<string, unknown> | undefined }
type Db = {
  collection(path: string): {
    orderBy(f: string, d?: 'asc' | 'desc'): { limit(n: number): { onSnapshot(next: (s: { docs: Snap[] }) => void, err?: (e: { code: string }) => void): () => void } }
  }
  doc(path: string): { set(d: Record<string, unknown>): Promise<void>; delete(): Promise<void> }
}
type User = { id(): Promise<string | null>; isOwner(): boolean | Promise<boolean>; can(n: string): boolean | null | Promise<boolean | null> }
type ClaudeRuntime = { use(name: string): Promise<unknown> }

const TEXT_MAX = 140
const NAME_MAX = 30
const SHOWN = 4
const CARD_COLORS = ['#FFFBF0', '#F4EBD6', '#EEF2E6', '#F6E9E4']

function runtime(): ClaudeRuntime | undefined {
  return (window as unknown as { claude?: ClaudeRuntime }).claude
}

export function Notes() {
  const [db, setDb] = useState<Db | null>(null)
  const [uid, setUid] = useState<string | null>(null)
  const [owner, setOwner] = useState(false)
  const [canWrite, setCanWrite] = useState(true)
  const [notes, setNotes] = useState<Note[]>([])
  const [writing, setWriting] = useState(false)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [ready, setReady] = useState(false)
  const unsub = useRef<(() => void) | null>(null)

  // connect once: the store, who's viewing, and a live list of the latest notes
  useEffect(() => {
    const claude = runtime()
    if (!claude?.use) {
      setReady(true)
      return
    }
    let alive = true
    ;(async () => {
      const [d, u] = (await Promise.all([claude.use('db'), claude.use('user')])) as [Db | null, User | null]
      if (!alive) return
      setReady(true)
      if (!d) return
      setDb(d)
      if (u) {
        setUid(await u.id())
        setOwner(Boolean(await u.isOwner()))
        if ((await u.can('data.write')) === false) setCanWrite(false)
      }
      unsub.current = d
        .collection('notes')
        .orderBy('createdAt', 'desc')
        .limit(SHOWN)
        .onSnapshot(
          (snap) => {
            setNotes(
              snap.docs.map((s) => {
                const b = s.data() ?? {}
                return { id: s.id, text: String(b.text ?? ''), name: String(b.name ?? ''), createdAt: Number(b.createdAt ?? 0) }
              }),
            )
          },
          () => setStatus('notes are taking a nap, try again later'),
        )
    })()
    return () => {
      alive = false
      unsub.current?.()
    }
  }, [])

  async function pin() {
    if (!db || !uid || !text.trim()) return
    setStatus('pinning…')
    try {
      await db.doc(`notes/${uid}`).set({
        text: text.trim().slice(0, TEXT_MAX),
        name: name.trim().slice(0, NAME_MAX) || 'anonymous',
        createdAt: Date.now(),
      })
      setText('')
      setWriting(false)
      setStatus('')
    } catch (e) {
      const code = (e as { code?: string }).code
      if (code === 'invalid_argument') {
        setCanWrite(false)
        setStatus('you can read the notes, but leaving one needs an invite')
      } else {
        setStatus("that didn't pin, try again in a moment")
      }
    }
  }

  async function remove(id: string) {
    if (!db) return
    try {
      await db.doc(`notes/${id}`).delete()
    } catch {
      setStatus("couldn't take that one down")
    }
  }

  const live = Boolean(db)
  const writable = live && Boolean(uid) && canWrite
  const cards: (Note | null)[] = live ? notes : []

  return (
    <div className="notes">
      <div className="notes__line" aria-hidden="true" />
      <ul className="notes__cards" aria-label="Notes from visitors">
        {!live && (
          <li className="note" style={{ background: CARD_COLORS[0], rotate: '-2deg' }}>
            <span className="note__clip" aria-hidden="true" />
            <p className="note__text">{ready ? 'notes from visitors will hang here' : '…'}</p>
            <p className="note__name">chloe</p>
          </li>
        )}
        {live && cards.length === 0 && (
          <li className="note" style={{ background: CARD_COLORS[0], rotate: '-2deg' }}>
            <span className="note__clip" aria-hidden="true" />
            <p className="note__text">no notes yet, be the first?</p>
            <p className="note__name">chloe</p>
          </li>
        )}
        {cards.map(
          (n, i) =>
            n && (
              <li key={n.id} className="note" style={{ background: CARD_COLORS[i % CARD_COLORS.length], rotate: `${i % 2 ? 2 : -2}deg` }}>
                <span className="note__clip" aria-hidden="true" />
                <p className="note__text">{n.text}</p>
                <p className="note__name">{n.name}</p>
                {owner && (
                  <button type="button" className="note__remove" onClick={() => remove(n.id)} aria-label={`Take down the note from ${n.name}`}>
                    ×
                  </button>
                )}
              </li>
            ),
        )}
        {writable && !writing && (
          <li>
            <button type="button" className="note note--add" onClick={() => setWriting(true)}>
              + leave a note
            </button>
          </li>
        )}
      </ul>

      {writing && (
        <form
          className="notes__form"
          onSubmit={(e) => {
            e.preventDefault()
            pin()
          }}
        >
          <textarea
            value={text}
            maxLength={TEXT_MAX}
            onChange={(e) => setText(e.target.value)}
            placeholder="say something nice…"
            aria-label="Your note"
            autoFocus
          />
          <div className="notes__row">
            <input
              value={name}
              maxLength={NAME_MAX}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              aria-label="Your name"
            />
            <button type="submit" disabled={!text.trim()}>
              pin it
            </button>
            <button type="button" className="notes__cancel" onClick={() => setWriting(false)}>
              cancel
            </button>
          </div>
        </form>
      )}
      {status && <p className="notes__status">{status}</p>}
      <span className="tag notes__tag">notes</span>
    </div>
  )
}
