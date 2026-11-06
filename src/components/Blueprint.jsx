import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

// Modo plano: tecla B (o desde la paleta de comandos).
// Muestra cada bloque como en un editor de diseño: recuadro, nombre y medidas,
// más las secciones y una cuadrícula de 12 columnas.
const isTyping = el => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)

export default function Blueprint() {
  const t = useT()
  const [on, setOn] = useState(false)
  const layer = useRef(null)

  useEffect(() => {
    const onKey = e => {
      if (e.key.toLowerCase() !== 'b' || e.ctrlKey || e.metaKey || e.altKey || isTyping(document.activeElement)) return
      setOn(v => !v)
    }
    const onToggle = () => setOn(v => !v)
    window.addEventListener('keydown', onKey)
    window.addEventListener('toggle-blueprint', onToggle)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('toggle-blueprint', onToggle) }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('blueprint-on', on)
    if (!on) return
    const root = layer.current
    const targets = [
      ...[...document.querySelectorAll('main section[id], main > section')].map(el => ({ el, kind: 'section', label: `<section${el.id ? ' #' + el.id : ''}>` })),
      ...[...document.querySelectorAll('[data-build]')].map(el => ({ el, kind: 'block', label: el.dataset.build })),
    ]
    const boxes = targets.map(tg => {
      const d = document.createElement('div')
      d.className = `bp-box bp-${tg.kind}`
      d.innerHTML = `<span class="bp-tag"></span><span class="bp-size"></span>`
      d.firstChild.textContent = tg.label
      root.appendChild(d)
      return { ...tg, d, size: d.lastChild }
    })
    let raf
    const frame = () => {
      const vh = window.innerHeight
      for (const b of boxes) {
        const r = b.el.getBoundingClientRect()
        const visible = r.width > 0 && r.bottom > -40 && r.top < vh + 40
        b.d.style.display = visible ? '' : 'none'
        if (!visible) continue
        Object.assign(b.d.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' })
        b.size.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`
      }
      raf = requestAnimationFrame(frame)
    }
    frame()
    return () => { cancelAnimationFrame(raf); boxes.forEach(b => b.d.remove()) }
  }, [on])

  return (
    <>
      <div ref={layer} aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[58] ${on ? '' : 'hidden'}`}>
        {/* Cuadrícula de 12 columnas del contenido */}
        <div className="mx-auto grid h-full max-w-6xl grid-cols-12 gap-4 px-4">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="bg-[#2de2ff]/[0.04] border-x border-[#2de2ff]/10" />)}
        </div>
      </div>
      {on && (
        <div className="fixed left-1/2 top-[84px] z-[70] flex -translate-x-1/2 items-center gap-3 border border-[#2de2ff]/50 bg-bg/90 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[#2de2ff] backdrop-blur animate-[pop_200ms_ease-out]">
          <span className="size-1.5 rounded-full bg-[#2de2ff] pulse-dot" />
          {t({ es: 'Modo plano', en: 'Blueprint mode' })}
          <button onClick={() => setOn(false)} className="ml-2 border border-[#2de2ff]/40 px-2 py-0.5 text-ink hover:bg-[#2de2ff]/10">
            B · {t({ es: 'salir', en: 'exit' })}
          </button>
        </div>
      )}
    </>
  )
}
