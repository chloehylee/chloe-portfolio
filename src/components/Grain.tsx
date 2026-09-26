type GrainProps = {
  id: string
  className?: string
}

/** A fine paper/plaster texture laid over a surface. */
export function Grain({ id, className = '' }: GrainProps) {
  return (
    <svg className={`grain ${className}`} aria-hidden="true" focusable="false">
      <filter id={id} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={3} />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.38  0 0 0 0 0.31  0 0 0 0 0.21  0 0 0 0.6 -0.16"
        />
      </filter>
      <rect width="100%" height="100%" fill="#000" fillOpacity="0.01" filter={`url(#${id})`} />
    </svg>
  )
}
