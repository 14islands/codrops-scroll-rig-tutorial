import React, { useEffect, useRef } from 'react'

export default function EffectsToggle({ setEnabled, enabled }) {
  const wrapperRef = useRef()
  const textRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => e.target.classList.toggle('is-pinned', e.intersectionRatio < 1), { threshold: [1] })
    observer.observe(wrapperRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={wrapperRef} className="EffectsToggle">
        <div className="EffectsToggle__Inner">
          <span ref={textRef} className="EffectsToggle__Text">
            WebGL Scroll Effects
          </span>
          <button onClick={() => setEnabled(!enabled)}>{enabled ? 'ON' : 'OFF'}</button>
        </div>
      </div>
    </>
  )
}
