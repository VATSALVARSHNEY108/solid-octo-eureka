'use client'

import { Suspense, lazy, useEffect, useMemo, useState } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SplineComponent = Spline as any

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [scene])

  const fallback = useMemo(() => {
    return (
      <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
        <div className="relative h-64 w-64 md:h-80 md:w-80 text-[var(--text-primary)] opacity-80">
          <div className="absolute inset-0 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 blur-sm" />
          <svg className="relative h-full w-full" viewBox="0 0 320 320" fill="none">
            <path d="M160 34v42" stroke="currentColor" strokeOpacity="0.28" strokeWidth="8" strokeLinecap="round" />
            <circle cx="160" cy="28" r="13" fill="currentColor" fillOpacity="0.48" />
            <rect x="58" y="76" width="204" height="166" rx="56" fill="var(--bg-primary)" stroke="currentColor" strokeOpacity="0.22" strokeWidth="8" />
            <rect x="92" y="122" width="42" height="42" rx="14" fill="currentColor" fillOpacity="0.72" />
            <rect x="186" y="122" width="42" height="42" rx="14" fill="currentColor" fillOpacity="0.72" />
            <path d="M106 196c18 22 90 22 108 0" stroke="currentColor" strokeOpacity="0.48" strokeWidth="8" strokeLinecap="round" />
            <path d="M58 152H28M292 152h-30" stroke="currentColor" strokeOpacity="0.22" strokeWidth="10" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    )
  }, [])

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      {hasError ? (
        fallback
      ) : (
        <SplineComponent
          scene={scene}
          className={className}
          onError={() => setHasError(true)}
        />
      )}
    </Suspense>
  )
}
