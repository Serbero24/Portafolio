import { useEffect, useState } from 'react'

// Intro: la página "se construye" como en un editor de diseño (inspirado en el video de referencia).
// Se muestra una vez por sesión. Cambia SHOW_ALWAYS a true para verla siempre mientras pruebas.
const SHOW_ALWAYS = false
const KEY = 'intro-visto'

export default function IntroBuild() {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'off'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off'
    try {
      if (!SHOW_ALWAYS && sessionStorage.getItem(KEY)) return 'off'
    } catch {}
    return 'build'
  })

  useEffect(() => {
    if (phase !== 'build') return
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setPhase('leave'), 2300)
    const t2 = setTimeout(() => {
      setPhase('off')
      document.body.style.overflow = ''
      try { sessionStorage.setItem(KEY, '1') } catch {}
    }, 3100)
    return () => { clearTimeout(t1); clearTimeout(t2); document.body.style.overflow = '' }
  }, [phase])

  if (phase === 'off') return null

  return (
    <div
      aria-hidden="true"
      className={`intro fixed inset-0 z-[200] bg-bg transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.3,1)] ${
        phase === 'leave' ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'
      }`}
    >
      {/* Cuadrícula de plano */}
      <div className="absolute inset-0 opacity-60 bg-[linear-gradient(rgba(45,226,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(45,226,255,0.07)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative mx-auto h-full max-w-6xl px-4">
        {/* Barra de menú */}
        <div className="ib-box absolute inset-x-4 top-5 h-12" style={{ '--d': '0ms' }}><span className="ib-tag">Navbar.jsx</span></div>

        {/* Columna de texto */}
        <div className="ib-box absolute left-4 top-[22%] h-7 w-56" style={{ '--d': '180ms' }}><span className="ib-tag">status</span></div>
        <div className="ib-box absolute left-4 top-[30%] h-[22%] w-[min(520px,80%)]" style={{ '--d': '320ms' }}>
          <span className="ib-tag">&lt;h1&gt; · display / 84px</span>
          <div className="ib-text">CONSTRUYO<br />SOFTWARE QUE<br /><span className="text-accent">RESUELVE.</span></div>
        </div>
        <div className="ib-box absolute left-4 top-[57%] h-16 w-[min(460px,75%)]" style={{ '--d': '520ms' }}><span className="ib-tag">&lt;p&gt;</span></div>
        <div className="ib-box absolute left-4 top-[70%] h-12 w-40" style={{ '--d': '660ms' }}><span className="ib-tag">button</span></div>
        <div className="ib-box absolute left-48 top-[70%] h-12 w-40 hidden sm:block" style={{ '--d': '740ms' }}><span className="ib-tag">button</span></div>

        {/* Foto */}
        <div className="ib-box ib-round absolute right-[8%] top-[30%] hidden size-64 lg:block" style={{ '--d': '420ms' }}><span className="ib-tag">foto.jpg · 480×480</span></div>

        {/* Estado de carga */}
        <div className="absolute bottom-8 left-4 right-4 flex items-end justify-between font-mono text-[11px] uppercase tracking-widest">
          <span className="text-accent-2">construyendo interfaz<span className="caret">_</span></span>
          <span className="ib-count text-muted" />
        </div>
        <div className="absolute bottom-5 left-4 right-4 h-px bg-line">
          <div className="ib-bar h-full bg-accent shadow-[0_0_10px] shadow-accent" />
        </div>
      </div>
    </div>
  )
}
