import { useEffect, useMemo, useRef, useState } from 'react'

type FunFactProps = {
  facts: string[]
}

// The facts are stacked in a tall reel (repeated a few times) so a spin can
// roll through several before easing onto a new one, like a slot machine.
// Each fact is one --fact-line tall (set in styles.css; taller on phones).
const CYCLES = 6
const SPIN_MS = 1400
// until someone spins it themselves, it moves on by itself every few seconds
const AUTO_MS = 8000

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function FunFact({ facts }: FunFactProps) {
  const n = facts.length
  const [pos, setPos] = useState(n) // start in the second cycle
  const [spinning, setSpinning] = useState(false)
  const [spins, setSpins] = useState(0)

  const reel = useMemo(
    () => Array.from({ length: n * CYCLES }, (_, i) => facts[i % n]),
    [facts, n],
  )

  const touched = useRef(false)
  const spinRef = useRef(spin)
  spinRef.current = spin

  useEffect(() => {
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      if (!touched.current && !document.hidden) spinRef.current()
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [])

  function spin() {
    if (spinning || n < 2) return
    // Always lands on the NEXT fact (after rolling past a couple of full cycles),
    // so the order in data.ts is the order people see them.
    if (prefersReducedMotion()) {
      setPos(n + ((pos + 1) % n))
      return
    }
    setSpinning(true)
    setSpins((s) => s + 1)
    setPos(pos + 2 * n + 1)
  }

  // After the reel settles, jump back to the same fact in the second cycle
  // (no animation) so there's always room to spin again.
  function handleSettled() {
    if (!spinning) return
    setSpinning(false)
    setPos((p) => n + (p % n))
  }

  return (
    <button
      type="button"
      className={`fact${spinning ? ' is-spinning' : ''}`}
      aria-label="Spin to see what else I'm up to"
      onClick={() => {
        touched.current = true
        spin()
      }}
    >
      <span className="fact__label" aria-hidden="true">
        currently:
      </span>
      <span className="fact__window" aria-hidden="true">
        <span
          className="fact__reel"
          style={{
            transform: `translateY(calc(${-pos} * var(--fact-line)))`,
            transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.8, 0.2, 1)` : 'none',
          }}
          onTransitionEnd={handleSettled}
        >
          {reel.map((fact, i) => (
            <span key={i} className="fact__item">
              {fact}
            </span>
          ))}
        </span>
      </span>
      <span className="fact__dial" aria-hidden="true">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: `rotate(${spins * 360}deg)` }}
        >
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 4v5h-5" />
        </svg>
      </span>
      <span className="visually-hidden" aria-live="polite">
        currently {facts[pos % n]}
      </span>
    </button>
  )
}
