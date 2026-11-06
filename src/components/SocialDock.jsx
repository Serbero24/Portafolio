import { useRef, useState } from 'react'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { site } from '../data/site'
import { useT } from '../i18n'

// Los enlaces se editan en src/data/site.js
const socials = [
  { Icon: FaGithub, label: 'GitHub', href: site.github },
  { Icon: FaLinkedin, label: 'LinkedIn', href: site.linkedin },
  { Icon: FaEnvelope, label: { es: 'Correo', en: 'Email' }, href: `mailto:${site.email}` },
].filter(s => s.href)

const BASE = 32      // tamaño normal del botón (px)
const MAX = 1.8      // cuánto crece el ícono más cercano
const RANGE = 80    // distancia (px) a la que el mouse empieza a afectar

// Íconos que se agrandan al acercar el mouse (efecto dock)
export default function SocialDock() {
  const t = useT()
  const refs = useRef([])
  const [scales, setScales] = useState(socials.map(() => 1))

  const onMove = e => {
    setScales(
      refs.current.map(el => {
        if (!el) return 1
        const r = el.getBoundingClientRect()
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
        return d > RANGE ? 1 : 1 + (MAX - 1) * Math.cos((d / RANGE) * (Math.PI / 2))
      })
    )
  }

  return (
    <div className="mt-8 flex items-center gap-4 text-muted">
      <span className="font-mono text-xs uppercase tracking-widest">{t({ es: 'Encuéntrame', en: 'Find me' })} ::</span>
      <div
        className="flex items-center gap-6 -my-8 py-8 px-2"
        onPointerMove={onMove}
        onPointerLeave={() => setScales(socials.map(() => 1))}
      >
        {socials.map(({ Icon, label, href }, i) => {
          const s = scales[i]
          const active = s > 1.6
          return (
            <div key={t(label)} className="relative shrink-0" style={{ width: BASE, height: BASE }}>
              <a
                ref={el => (refs.current[i] = el)}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                aria-label={t(label)}
                className="group grid place-items-center size-full transition-[transform,filter] duration-150 ease-out will-change-transform"
                style={{
                  transform: `scale(${s})`,
                  filter: active ? 'drop-shadow(0 0 10px var(--color-accent))' : undefined,
                }}
              >
                <Icon size={22} className={`transition-colors ${active ? 'text-accent' : 'text-muted group-hover:text-accent'}`} />
              </a>
              {/* Etiqueta (no crece con el ícono) */}
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-accent transition-all duration-200 ${
                  active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                }`}
              >
                {t(label)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
