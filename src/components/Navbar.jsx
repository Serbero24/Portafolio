import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { useLang, useT } from '../i18n'

const links = [
  { id: 'inicio', label: { es: 'Inicio', en: 'Home' } },
  { id: 'sobre-mi', label: { es: 'Sobre mí', en: 'About' } },
  { id: 'proyectos', label: { es: 'Proyectos', en: 'Projects' } },
  { id: 'contacto', label: { es: 'Contacto', en: 'Contact' } },
]

// Botón ES / EN
function LangSwitch({ lang, toggle }) {
  return (
    <button
      onClick={toggle}
      className="flex items-center border border-line bg-bg/40 p-0.5 font-mono text-[10px] font-semibold tracking-wider"
      aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
    >
      {['es', 'en'].map(l => (
        <span key={l} className={`px-2 py-1 uppercase transition-colors ${lang === l ? 'bg-accent text-bg' : 'text-muted'}`}>{l}</span>
      ))}
    </button>
  )
}

// Barra HUD: sección activa entre [ ], progreso del scroll
export default function Navbar() {
  const [active, setActive] = useState('inicio')
  const [open, setOpen] = useState(false)
  const barRef = useRef(null)
  const [compact, setCompact] = useState(false)
  const t = useT()
  const { lang, toggle } = useLang()

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    links.forEach(l => {
      const el = document.getElementById(l.id)
      if (el) obs.observe(el)
    })

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      setCompact(window.scrollY > 40)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      data-build="<Navbar />" data-build-by="React"
      className={`fixed inset-x-0 top-0 z-50 border-b border-accent/20 backdrop-blur-md transition-all duration-300 ${
        compact ? 'bg-surface/90 shadow-[0_10px_40px_-20px] shadow-accent/40' : 'bg-surface/50'
      }`}
    >
      <nav className={`mx-auto flex max-w-6xl items-center gap-3 md:gap-6 px-4 transition-all duration-300 ${compact ? 'h-14' : 'h-[72px]'}`}>
        {/* Logo */}
        <a href="#inicio" className="min-w-0 truncate font-display text-base sm:text-lg font-bold tracking-wide">
          <span className="text-accent neon">&lt;</span>{site.logo}<span className="text-accent neon">/&gt;</span>
        </a>

        {/* Secciones */}
        <ul className="ml-auto hidden md:flex items-center">
          {links.map((l, i) => {
            const on = active === l.id
            return (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={on ? 'true' : undefined}
                  className={`group relative flex items-center whitespace-nowrap px-2.5 xl:px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                    on ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className={`text-accent transition-all duration-300 ${on ? 'mr-1.5 opacity-100' : 'mr-0 w-0 opacity-0'}`}>[</span>
                  <span className={`mr-2 ${on ? 'text-accent' : 'text-muted/60 group-hover:text-accent/70'}`}>0{i + 1}</span>
                  {t(l.label)}
                  <span className={`text-accent transition-all duration-300 ${on ? 'ml-1.5 opacity-100' : 'ml-0 w-0 opacity-0'}`}>]</span>
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left bg-accent shadow-[0_0_10px] shadow-accent transition-transform duration-300 ${
                      on ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        {/* Idioma y comandos */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new Event('open-palette'))}
            className="hidden xl:inline-flex items-center gap-1.5 border border-line bg-bg/40 px-2 py-1.5 font-mono text-[10px] text-muted transition hover:border-accent/50 hover:text-ink"
            aria-label={t({ es: 'Abrir paleta de comandos', en: 'Open command palette' })}
          >
            <kbd>Ctrl</kbd><span className="text-accent/50">+</span><kbd>K</kbd>
          </button>
          <LangSwitch lang={lang} toggle={toggle} />
        </div>

        {/* Acción */}
        <a
          href="#contacto"
          className="clip-hud hidden md:inline-block shrink-0 bg-accent px-5 py-2.5 font-display text-sm font-bold uppercase tracking-[0.12em] text-bg shadow-[0_0_20px_-6px] shadow-accent transition hover:brightness-110"
        >
          {t({ es: 'Contratar', en: 'Hire me' })}
        </a>

        {/* Móvil */}
        <div className="ml-auto shrink-0 md:hidden"><LangSwitch lang={lang} toggle={toggle} /></div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden shrink-0 whitespace-nowrap border border-accent/30 px-2.5 py-2 font-mono text-[11px] uppercase tracking-wider text-accent"
          aria-expanded={open}
          aria-controls="menu-movil"
        >
          {open ? t({ es: '[ cerrar ]', en: '[ close ]' }) : t({ es: '[ menú ]', en: '[ menu ]' })}
        </button>
      </nav>

      {/* Progreso del scroll */}
      <div className="absolute inset-x-0 -bottom-px h-px">
        <div
          className="h-full origin-left bg-gradient-to-r from-accent/40 via-accent to-accent shadow-[0_0_10px] shadow-accent"
          ref={barRef}
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {open && (
        <div id="menu-movil" className="md:hidden border-t border-line bg-surface/95 px-4 pb-4 pt-2">
          <ul>
            {links.map((l, i) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 border-b border-line/60 py-3.5 font-mono text-sm uppercase tracking-wider ${active === l.id ? 'text-accent' : 'text-ink'}`}
                >
                  <span className="text-muted">0{i + 1}</span>
                  {active === l.id ? `[ ${t(l.label)} ]` : t(l.label)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-end">
            <a href="#contacto" onClick={() => setOpen(false)} className="clip-hud bg-accent px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-bg">
              {t({ es: 'Contratar', en: 'Hire me' })}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
