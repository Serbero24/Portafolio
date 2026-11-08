// Hace explotar un elemento en partículas, lo desintegra y lo vuelve a armar.
const busy = new WeakSet()

export default function explode(el, color = '#10d9a0') {
  if (!el || busy.has(el) || el.classList.contains('build-pending') || el.style.opacity) return
  busy.add(el)

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2

  if (reduce) {
    el.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], { duration: 600 }).onfinish = () => busy.delete(el)
    return
  }

  const layer = document.createElement('div')
  layer.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:0;height:0;pointer-events:none;z-index:90`
  document.body.appendChild(layer)

  // Onda expansiva
  const ring = document.createElement('div')
  ring.style.cssText = `position:absolute;left:-24px;top:-24px;width:48px;height:48px;border-radius:50%;border:2px solid ${color};box-shadow:0 0 18px ${color}`
  layer.appendChild(ring)
  ring.animate(
    [{ transform: 'scale(0.4)', opacity: 1 }, { transform: 'scale(2.8)', opacity: 0 }],
    { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
  )

  // Fragmentos: cuadritos del color del logo y del acento
  const colors = [color, color, '#10d9a0', '#e8eef5']
  const N = 30
  for (let i = 0; i < N; i++) {
    const p = document.createElement('span')
    const size = 3 + Math.random() * 5
    const c = colors[i % colors.length]
    p.style.cssText = `position:absolute;left:${-size / 2}px;top:${-size / 2}px;width:${size}px;height:${size}px;background:${c};box-shadow:0 0 6px ${c}`
    layer.appendChild(p)
    const a = (Math.PI * 2 * i) / N + Math.random() * 0.5
    const d = 45 + Math.random() * 85
    const x = Math.cos(a) * d
    const y = Math.sin(a) * d + 25 // caen un poco por gravedad
    const rot = (Math.random() - 0.5) * 540
    p.animate(
      [
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(${x * 0.8}px,${y * 0.6 - 18}px) rotate(${rot * 0.6}deg) scale(1)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${x}px,${y}px) rotate(${rot}deg) scale(0.2)`, opacity: 0 },
      ],
      { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.15,.7,.3,1)', fill: 'forwards' }
    )
  }

  // El logo se infla, parpadea y se desintegra
  el.animate(
    [
      { transform: 'scale(1)', filter: 'none', opacity: 1 },
      { transform: 'scale(1.35)', filter: `brightness(2) drop-shadow(0 0 12px ${color})`, opacity: 1, offset: 0.35 },
      { transform: 'scale(0.2)', filter: 'blur(6px)', opacity: 0 },
    ],
    { duration: 380, easing: 'ease-in', fill: 'forwards' }
  )

  // Se vuelve a armar: las chispas regresan a donde está el logo AHORA.
  // Como el logo sigue orbitando, la capa de chispas lo sigue cuadro a cuadro.
  setTimeout(() => {
    const follow = document.createElement('div')
    follow.style.cssText = 'position:fixed;width:0;height:0;pointer-events:none;z-index:90'
    document.body.appendChild(follow)
    let raf
    const track = () => {
      const rr = el.getBoundingClientRect()
      follow.style.left = rr.left + rr.width / 2 + 'px'
      follow.style.top = rr.top + rr.height / 2 + 'px'
      raf = requestAnimationFrame(track)
    }
    track()
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span')
      const a = Math.random() * Math.PI * 2
      const d = 50 + Math.random() * 40
      p.style.cssText = `position:absolute;left:-2px;top:-2px;width:4px;height:4px;background:${color};box-shadow:0 0 6px ${color}`
      follow.appendChild(p)
      p.animate(
        [
          { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px)`, opacity: 0 },
          { opacity: 1, offset: 0.4 },
          { transform: 'translate(0,0)', opacity: 0 },
        ],
        { duration: 450, easing: 'cubic-bezier(.5,0,.75,0)', delay: Math.random() * 120, fill: 'forwards' }
      )
    }
    setTimeout(() => { cancelAnimationFrame(raf); follow.remove() }, 1000)
  }, 1250)

  setTimeout(() => {
    el.getAnimations().forEach(an => an.cancel())
    el.animate(
      [
        { transform: 'scale(0.2)', opacity: 0, filter: 'blur(4px)' },
        { transform: 'scale(1.18)', opacity: 1, filter: `brightness(1.6) drop-shadow(0 0 10px ${color})`, offset: 0.65 },
        { transform: 'scale(1)', opacity: 1, filter: 'none' },
      ],
      { duration: 420, easing: 'ease-out' }
    ).onfinish = () => busy.delete(el)
    setTimeout(() => layer.remove(), 400)
  }, 1700)
}