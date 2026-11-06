import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n'

// Flechas que CONSTRUYEN la página como si varias personas la estuvieran diseñando
// (inspirado en el video de referencia):
//   1. una flecha vuela a la esquina del bloque
//   2. arrastra el recuadro hasta la otra esquina (con la medida en píxeles)
//   3. el contenido se "escribe" de izquierda a derecha, o la imagen se revela
//   4. al terminar, todas las flechas se juntan en tu cursor hasta ser una sola
// Se construye lo que se ve al entrar y cada bloque nuevo al bajar.
// Marca un bloque con data-build="etiqueta" (y data-build-kind="image" para imágenes).
// Solo en computadoras con mouse; en celular o con "reducir movimiento" todo se ve normal.

// Cada flecha es una tecnología, como los colaboradores en Figma.
// Un bloque puede pedir quién lo construye con data-build-by="React".
const TEAM = [
  ['React', '#61DAFB'], ['Laravel', '#FF4A3D'], ['PostgreSQL', '#6B8CFF'], ['Tailwind', '#38BDF8'],
  ['JavaScript', '#F7DF1E'], ['PHP', '#9AA4D6'], ['Java', '#F89820'], ['Python', '#5AA0E6'],
  ['FastAPI', '#10B9A8'], ['Git', '#F05032'], ['Linux', '#FCC624'], ['Vite', '#A57BFF'],
]
const COUNT = TEAM.length
const WORKERS_PC = 4            // bloques que se construyen al mismo tiempo (2 flechas cada uno)
const WORKERS_MOBILE = 3      // en celular, un poco menos a la vez
const STAGGER = 220          // ms entre el inicio de cada trabajador
const T_DRAG = 480           // ms arrastrando el recuadro
const T_FILL = 160           // ms con el recuadro lleno antes del contenido
const T_WRITE = 560          // ms escribiendo / revelando el contenido
const T_FADE = 320           // ms desvaneciendo el recuadro
const T_START = 600          // ms de pantalla vacía antes de empezar
const inkFor = hex => {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255
  return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#04140f' : '#ffffff'
}

const easeBack = t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) }
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = t => Math.min(1, Math.max(0, t))
const esc = s => s.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))

export default function CursorFlock() {
  const ref = useRef(null)
  const skipRef = useRef(null)
  const [intro, setIntro] = useState(false)
  const tt = useT()

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2)
    const WORKERS = touch ? WORKERS_MOBILE : WORKERS_PC
    let w = 0, h = 0, raf
    const mouse = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.5, active: false }

    const birds = Array.from({ length: COUNT }, (_, i) => ({
      x: mouse.x + (Math.random() - 0.5) * 240,
      y: mouse.y + (Math.random() - 0.5) * 240,
      vx: 0, vy: 0,
      size: 0.95,
      name: TEAM[i][0],
      color: TEAM[i][1],
      ink: inkFor(TEAM[i][1]),
      roam: null, roamUntil: 0,
      job: null, shape: 'arrow', alpha: 0.9,
    }))

    // ===== Bloques =====
    const pending = new Set()
    const queue = []
    const workers = []
    const ripples = [] // destellos de clic de las flechas ayudantes
    let introCount = 0
    let startAt = performance.now() + T_START
    let nextSlotAt = 0

    const all = [...document.querySelectorAll('[data-build]')]
    all.forEach(el => {
      el.classList.add('build-pending')
      pending.add(el)
    })
    // Lo que se ve al entrar se construye primero, en orden
    const vh = window.innerHeight
    all.forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.top < vh && r.bottom > 0) { queue.push(el); introCount++ }
    })
    if (introCount) setIntro(true)

    // El resto, al aparecer con el scroll
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && pending.has(e.target) && !queue.includes(e.target) && !workers.some(wk => wk.el === e.target)) queue.push(e.target)
      })
    }, { threshold: 0.2 })
    all.forEach(el => io.observe(el))

    const showNow = el => {
      el.classList.remove('build-pending')
      el.style.clipPath = ''
      el.style.opacity = ''
      el.style.filter = ''
      el.style.scale = ''
      pending.delete(el)
      io.unobserve(el)
    }

    const skipIntro = () => {
      // Termina al instante lo que está en pantalla
      const vh2 = window.innerHeight
      ;[...queue].forEach(el => { const r = el.getBoundingClientRect(); if (r.top < vh2 && r.bottom > 0) { showNow(el); queue.splice(queue.indexOf(el), 1) } })
      workers.forEach(wk => { wk.frame.remove(); showNow(wk.el); if (wk.bird) wk.bird.job = null; if (wk.helper) wk.helper.job = null })
      workers.length = 0
      introCount = 0
      setIntro(false)
    }
    skipRef.current = skipIntro

    const makeFrame = (label, bird) => {
      const f = document.createElement('div')
      f.className = 'build-frame'
      f.style.setProperty('--c', bird.color)
      f.style.setProperty('--ink', bird.ink)
      f.innerHTML = `<span class="build-guide gh"></span><span class="build-guide gv"></span><span class="build-tag">${esc(label)}</span>`
      document.body.appendChild(f)
      return f
    }

    const freeBird = (x, y, by) => {
      const wanted = by && birds.find(b => b.name === by && !b.job)
      if (wanted) return wanted
      let best = null, d = Infinity
      for (const b of birds) {
        if (b.job) continue
        const dd = Math.hypot(b.x - x, b.y - y)
        if (dd < d) { d = dd; best = b }
      }
      return best
    }

    // Ayudante: una flecha libre que ninguna pieza en espera necesita
    const freeHelper = (x, y) => {
      const wanted = new Set(queue.slice(0, 14).map(e => e.dataset.buildBy).filter(Boolean))
      let best = null, d = Infinity
      for (const b of birds) {
        if (b.job || wanted.has(b.name)) continue
        const dd = Math.hypot(b.x - x, b.y - y)
        if (dd < d) { d = dd; best = b }
      }
      return best
    }

    const startWorker = now => {
      for (let i = 0; i < queue.length; i++) {
        const el = queue[i]
        if (!pending.has(el)) { queue.splice(i--, 1); continue }
        const r = el.getBoundingClientRect()
        // Si ya quedó fuera de pantalla, se muestra sin animación
        if (r.bottom < 0 || r.top > h || r.width === 0) { showNow(el); queue.splice(i--, 1); if (introCount) introCount--; continue }
        // Cada pieza la construye SU tecnología; si está ocupada, se espera
        const by = el.dataset.buildBy
        const bird = by ? birds.find(b => b.name === by && !b.job) : freeBird(r.left, r.top)
        if (!bird) continue
        queue.splice(i, 1)
        const wk = {
          el, bird, frame: makeFrame(el.dataset.build || 'bloque', bird),
          kind: el.dataset.buildKind || 'text',
          sp: (r.width * r.height < 9000 ? 0.6 : 1) * (touch ? 0.75 : 1), // en celular, un poco más rápido
          stage: 'fly', t0: now, intro: introCount > 0,
        }
        if (introCount) introCount--
        bird.job = wk
        // En bloques grandes, una segunda flecha ayuda haciendo clic dentro
        if (r.width * r.height >= 9000) {
          const helper = freeHelper(r.left + r.width / 2, r.top + r.height / 2)
          if (helper) { helper.job = wk; wk.helper = helper; helper.nextClick = 0 }
        }
        workers.push(wk)
        return
      }
    }

    const place = (f, x, y, ww, hh) => Object.assign(f.style, { left: x + 'px', top: y + 'px', width: Math.max(0, ww) + 'px', height: Math.max(0, hh) + 'px' })

    const stepHelper = (wk, r, now) => {
      const hb = wk.helper
      if (!hb) return
      // Mientras el recuadro no existe, espera cerca; luego hace clic dentro del bloque
      const ready = wk.stage === 'fill' || wk.stage === 'write' || (wk.stage === 'drag' && now - wk.t0 > T_DRAG * 0.5)
      if (!hb.spot || now > hb.nextClick) {
        hb.spot = ready
          ? { x: r.left + r.width * (0.12 + Math.random() * 0.76), y: r.top + r.height * (0.2 + Math.random() * 0.6) }
          : { x: r.right + 30, y: r.top + Math.min(r.height, 120) * 0.5 }
        hb.nextClick = now + 380 + Math.random() * 320
        hb.clicked = false
      }
      const dx = hb.spot.x - hb.x, dy = hb.spot.y - hb.y
      hb.vx += dx * 0.14; hb.vy += dy * 0.14; hb.vx *= 0.7; hb.vy *= 0.7
      hb.x += hb.vx; hb.y += hb.vy
      hb.shape = 'arrow'
      if (ready && !hb.clicked && Math.hypot(dx, dy) < 4) {
        hb.clicked = true
        ripples.push({ x: hb.x, y: hb.y, color: hb.color, t0: now })
      }
    }

    const releaseHelper = wk => { if (wk.helper) { wk.helper.job = null; wk.helper.spot = null; wk.helper = null } }

    const stepWorker = (wk, now) => {
      const r = wk.el.getBoundingClientRect()
      const b = wk.bird
      const t = now - wk.t0
      stepHelper(wk, r, now)
      switch (wk.stage) {
        case 'fly': {
          // vuela a la esquina superior izquierda
          b.shape = 'arrow'
          const dx = r.left - b.x, dy = r.top - b.y
          b.vx += dx * 0.16; b.vy += dy * 0.16; b.vx *= 0.68; b.vy *= 0.68
          b.x += b.vx; b.y += b.vy
          place(wk.frame, r.left, r.top, 0, 0)
          if (Math.hypot(dx, dy) < 5 || t > 900) { wk.stage = 'drag'; wk.t0 = now; b.vx = b.vy = 0; wk.frame.classList.add('on') }
          break
        }
        case 'drag': {
          // arrastra el recuadro de esquina a esquina
          b.shape = 'cross'
          const p = ease(clamp01(t / (T_DRAG * wk.sp)))
          b.x = r.left + r.width * p; b.y = r.top + r.height * p
          place(wk.frame, r.left, r.top, r.width * p, r.height * p)
          b.label = `${Math.round(r.width * p)} × ${Math.round(r.height * p)}`
          if (t >= T_DRAG * wk.sp) { wk.stage = 'fill'; wk.t0 = now; b.label = null; wk.frame.classList.add('filled') }
          break
        }
        case 'fill': {
          b.shape = 'arrow'
          b.x += (r.left + 4 - b.x) * 0.3; b.y += (r.top + r.height / 2 - b.y) * 0.3
          place(wk.frame, r.left, r.top, r.width, r.height)
          if (t >= T_FILL * wk.sp) {
            wk.stage = 'write'; wk.t0 = now
            wk.el.classList.remove('build-pending')
            if (wk.kind === 'image') { wk.el.style.opacity = '0'; wk.el.style.filter = 'grayscale(1) blur(10px)' }
            else if (wk.kind === 'pop') { wk.el.style.opacity = '0'; wk.el.style.scale = '0.4' }
            else wk.el.style.clipPath = 'inset(-24px 100% -24px -24px)'
          }
          break
        }
        case 'write': {
          // el contenido se escribe de izquierda a derecha
          const raw = clamp01(t / (T_WRITE * wk.sp))
          const p = ease(raw)
          place(wk.frame, r.left, r.top, r.width, r.height)
          if (wk.kind === 'pop') {
            // la pieza se coloca con un pequeño rebote
            b.shape = 'arrow'
            b.x += (r.left + r.width * 0.55 - b.x) * 0.25; b.y += (r.top + r.height * 0.55 - b.y) * 0.25
            wk.el.style.opacity = String(Math.min(1, raw * 1.6))
            wk.el.style.scale = String(0.4 + 0.6 * easeBack(raw))
          } else if (wk.kind === 'image') {
            b.shape = 'arrow'
            b.x += (r.left + r.width / 2 - b.x) * 0.2; b.y += (r.top + r.height / 2 - b.y) * 0.2
            wk.el.style.opacity = String(p)
            wk.el.style.filter = `grayscale(${1 - p}) blur(${(1 - p) * 10}px)`
          } else {
            b.shape = 'ibeam'
            b.x = r.left + r.width * p; b.y = r.top + r.height / 2
            wk.el.style.clipPath = `inset(-24px ${(1 - p) * 100}% -24px -24px)`
          }
          if (t >= T_WRITE * wk.sp) {
            wk.stage = 'fade'; wk.t0 = now
            wk.frame.classList.add('out')
            showNow(wk.el)
            b.job = null; b.shape = 'arrow'
            wk.bird = null
            releaseHelper(wk)
          }
          break
        }
        case 'fade': {
          place(wk.frame, r.left, r.top, r.width, r.height)
          if (t >= T_FADE) { wk.frame.remove(); return false }
          break
        }
      }
      return true
    }

    // ===== Dibujo de cursores =====
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawBird = b => {
      if (b.alpha < 0.02) return
      ctx.save()
      ctx.globalAlpha = b.alpha
      ctx.translate(b.x, b.y)
      const color = b.color
      ctx.fillStyle = color; ctx.strokeStyle = color
      ctx.shadowColor = color; ctx.shadowBlur = 8
      if (b.shape === 'cross') {
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); ctx.moveTo(0, -8); ctx.lineTo(0, 8); ctx.stroke()
      } else if (b.shape === 'ibeam') {
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(0, 9); ctx.moveTo(-4, -9); ctx.lineTo(4, -9); ctx.moveTo(-4, 9); ctx.lineTo(4, 9); ctx.stroke()
      } else {
        // flecha de cursor clásica
        ctx.scale(b.size, b.size)
        ctx.beginPath()
        ctx.moveTo(0, 0); ctx.lineTo(0, 15); ctx.lineTo(4, 11); ctx.lineTo(7, 17); ctx.lineTo(9, 16); ctx.lineTo(6, 10); ctx.lineTo(11, 10); ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0; ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(4,20,15,0.8)'; ctx.stroke()
      }
      ctx.restore()
      // Etiqueta con el nombre, como en Figma (solo mientras trabaja)
      if (!b.job) return
      ctx.save()
      ctx.globalAlpha = b.alpha
      ctx.font = '600 10px "JetBrains Mono", monospace'
      const nx = b.x + 13, ny = b.y + 17
      const nw = ctx.measureText(b.name).width + 12
      ctx.fillStyle = b.color
      ctx.beginPath()
      ctx.roundRect ? ctx.roundRect(nx, ny, nw, 17, 4) : ctx.rect(nx, ny, nw, 17)
      ctx.fill()
      ctx.fillStyle = b.ink
      ctx.fillText(b.name, nx + 6, ny + 12)
      if (b.label) {
        ctx.font = '10px "JetBrains Mono", monospace'
        const tw = ctx.measureText(b.label).width + 10
        ctx.fillStyle = 'rgba(5,11,20,0.9)'
        ctx.fillRect(nx, ny + 20, tw, 16)
        ctx.fillStyle = b.color
        ctx.fillText(b.label, nx + 5, ny + 32)
      }
      ctx.restore()
    }

    const draw = now => {
      ctx.clearRect(0, 0, w, h)

      // Iniciar trabajadores escalonados
      if (now > startAt) {
        while (workers.filter(wk => wk.bird).length < WORKERS && queue.length && now >= nextSlotAt) {
          const before = workers.length
          startWorker(now)
          if (workers.length === before) break
          nextSlotAt = now + STAGGER
        }
      }
      for (let i = workers.length - 1; i >= 0; i--) if (!stepWorker(workers[i], now)) workers.splice(i, 1)

      if (introCount === 0 && !workers.some(wk => wk.intro && wk.bird)) setIntroOnce()

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i], k = (now - rp.t0) / 420
        if (k >= 1) { ripples.splice(i, 1); continue }
        ctx.save()
        ctx.globalAlpha = 1 - k
        ctx.strokeStyle = rp.color; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(rp.x, rp.y, 4 + k * 16, 0, Math.PI * 2); ctx.stroke()
        ctx.restore()
      }
      for (const b of birds) {
        if (b.job) { b.alpha = Math.min(1, b.alpha + 0.1); drawBird(b); continue }
        // Sin tarea: se junta con tu cursor hasta desaparecer (se ve una sola flecha)
        const tx = mouse.x, ty = mouse.y, k = 0.09
        b.alpha = Math.max(0, b.alpha - 0.08)
        b.vx += (tx - b.x) * k; b.vy += (ty - b.y) * k
        b.vx *= 0.8; b.vy *= 0.8
        b.x += b.vx; b.y += b.vy
        b.shape = 'arrow'
        drawBird(b)
      }
      raf = requestAnimationFrame(draw)
    }

    let introDone = false
    const setIntroOnce = () => { if (!introDone) { introDone = true; setIntro(false) } }

    const move = e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true }
    const touchAt = e => { const p = e.touches?.[0]; if (p) { mouse.x = p.clientX; mouse.y = p.clientY } }
    const onKey = e => { if (e.key === 'Escape') skipIntro() }

    resize(); raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    window.addEventListener('touchstart', touchAt, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.querySelectorAll('.build-frame').forEach(f => f.remove())
      pending.forEach(showNow)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('touchstart', touchAt)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <>
      <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />
      {intro && (
        <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-4 whitespace-nowrap border border-[#2de2ff]/40 bg-bg/80 px-4 py-2 font-mono text-[11px] uppercase tracking-widest backdrop-blur">
          <span className="text-[#2de2ff]">{tt({ es: 'construyendo interfaz', en: 'building interface' })}<span className="caret">_</span></span>
          <button onClick={() => skipRef.current?.()} className="text-muted hover:text-ink">{tt({ es: 'Saltar', en: 'Skip' })} ›</button>
        </div>
      )}
    </>
  )
}
