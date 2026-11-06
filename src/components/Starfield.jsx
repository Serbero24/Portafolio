import { useEffect, useRef } from 'react'

// Fondo: estrellas + suelo de cuadrícula + luz que sigue al mouse
export default function Starfield() {
  const ref = useRef(null)
  const glow = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars = []
    let raf

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const mobile = window.innerWidth < 768
      const count = Math.floor((canvas.width * canvas.height) / (mobile ? 11000 : 6000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        v: Math.random() * 0.15 + 0.03,
        a: Math.random(),
      }))
    }

    let last = 0
    const slow = window.matchMedia('(pointer: coarse)').matches
    const draw = (now = 0) => {
      raf = requestAnimationFrame(draw)
      // En celular se dibuja a 30 fps y se pausa si la pestaña no está visible
      if (document.hidden || (slow && now - last < 33)) return
      last = now
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        s.y += reduce ? 0 : s.v
        if (s.y > canvas.height) s.y = 0
        s.a += (Math.random() - 0.5) * 0.05
        ctx.globalAlpha = Math.min(1, Math.max(0.15, s.a))
        ctx.fillStyle = '#cfe9ff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const move = e => {
      if (slow) return
      if (glow.current) glow.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(16,217,160,0.08),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(40,90,200,0.10),transparent_50%)]" />
      <div className="grid-floor absolute -left-1/2 -right-1/2 top-[62%] h-[80vh]" />
      <div ref={glow} className="absolute left-0 top-0 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(16,217,160,0.07),transparent_60%)] transition-transform duration-300 ease-out" />
    </div>
  )
}
