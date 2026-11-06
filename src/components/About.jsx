import { useEffect, useRef, useState } from 'react'
import { FaUserAstronaut, FaBullseye, FaFingerprint, FaJava, FaDatabase } from 'react-icons/fa'
import {
  SiReact, SiJavascript, SiTailwindcss, SiHtml5, SiCss, SiVite,
  SiLaravel, SiPhp, SiPython, SiFastapi,
  SiPostgresql, SiMysql,
  SiGit, SiLinux, SiPostman, SiVirtualbox,
} from 'react-icons/si'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { useT } from '../i18n'

// ===== Edita aquí tu contenido =====
const cards = [
  {
    Icon: FaUserAstronaut,
    title: { es: '¿Quién soy?', en: 'Who I am' },
    text: {
      es: 'Hola, soy Sheridan, tengo 22 años y soy de Perú. Estudio Ingeniería de Software con IA y hago mis prácticas como desarrollador de software. Me gusta entender cómo funciona un sistema de punta a punta: la base de datos, el backend, la interfaz y el servidor donde corre.',
      en: "Hi, I'm Sheridan, I'm 22 and I'm from Perú. I study Software Engineering with AI and I'm doing my internship as a software developer. I like understanding how a system works end to end: the database, the backend, the interface and the server it runs on.",
    },
  },
  {
    Icon: FaBullseye,
    title: { es: 'Mi objetivo', en: 'My goal' },
    text: {
      es: 'Conseguir mi primer empleo como desarrollador full stack, en un equipo donde pueda aportar desde el primer día, seguir aprendiendo y construir software con impacto real.',
      en: 'Land my first job as a full stack developer, on a team where I can contribute from day one, keep learning and build software with real impact.',
    },
  },
  {
    Icon: FaFingerprint,
    title: { es: 'Mi perfil', en: 'How I work' },
    text: {
      es: 'Ordenado y curioso. Disfruto encontrar el origen de un bug, documentar lo que hago y dejar el código más claro de como lo encontré. Me adapto rápido a tecnologías nuevas.',
      en: 'Organized and curious. I enjoy tracking down the root cause of a bug, documenting my work and leaving code clearer than I found it. I pick up new technologies quickly.',
    },
  },
]

const timeline = [
  {
    id: 'iiap',
    period: { es: 'Ago 2026 — Actualidad', en: 'Aug 2026 — Present' },
    role: { es: 'Practicante de Desarrollo de Software', en: 'Software Development Intern' },
    place: { es: 'IIAP — Instituto de Investigaciones de la Amazonía Peruana', en: 'IIAP — Peruvian Amazon Research Institute' },
    text: {
      es: 'Actualizo y completo AmantIA, la plataforma web que pone modelos de IA al servicio de la investigación amazónica: corrección de errores en backend, frontend y servicio de IA, un flujo de trabajo más simple y la migración del sistema al servidor del instituto.',
      en: "I update and complete AmantIA, the web platform that puts AI models at the service of Amazon research: fixing bugs across the backend, frontend and AI service, a simpler workflow and migrating the system to the institute's server.",
    },
    tags: ['Laravel', 'React', 'PostgreSQL', 'Linux'],
  },
  {
    id: 'senati',
    period: { es: 'Feb 2025 — Actualidad', en: 'Feb 2025 — Present' },
    role: { es: 'Ingeniería de Software con IA', en: 'Software Engineering with AI' },
    place: 'SENATI',
    text: {
      es: 'Proyectos web en PHP y MySQL con patrón MVC (gestión de laboratorios, restaurante) y sistemas de escritorio en Java con Oracle, DAO/MVC y procedimientos almacenados.',
      en: 'Web projects in PHP and MySQL using MVC (lab management, restaurant) and desktop systems in Java with Oracle, DAO/MVC and stored procedures.',
    },
    tags: ['PHP', 'MySQL', 'Java', 'Oracle'],
  },
]

const skills = [
  { id: 'front', by: 'React', group: 'Frontend', items: [
    { Icon: SiReact, label: 'React', color: '#61DAFB' },
    { Icon: SiJavascript, label: 'JavaScript', color: '#F7DF1E' },
    { Icon: SiTailwindcss, label: 'Tailwind', color: '#38BDF8' },
    { Icon: SiHtml5, label: 'HTML', color: '#E34F26' },
    { Icon: SiCss, label: 'CSS', color: '#663399' },
    { Icon: SiVite, label: 'Vite', color: '#9B6BFF' },
  ]},
  { id: 'back', by: 'Laravel', group: 'Backend', items: [
    { Icon: SiLaravel, label: 'Laravel', color: '#FF2D20' },
    { Icon: SiPhp, label: 'PHP', color: '#8993BE' },
    { Icon: FaJava, label: 'Java', color: '#F89820' },
    { Icon: SiPython, label: 'Python', color: '#3776AB' },
    { Icon: SiFastapi, label: 'FastAPI', color: '#009688' },
  ]},
  { id: 'db', by: 'PostgreSQL', group: { es: 'Bases de datos', en: 'Databases' }, items: [
    { Icon: SiPostgresql, label: 'PostgreSQL', color: '#4169E1' },
    { Icon: SiMysql, label: 'MySQL', color: '#4479A1' },
    { Icon: FaDatabase, label: 'Oracle', color: '#F80000' },
  ]},
  { id: 'tools', by: 'Linux', group: { es: 'Herramientas', en: 'Tools' }, items: [
    { Icon: SiGit, label: 'Git', color: '#F05032' },
    { Icon: SiLinux, label: 'Linux', color: '#FCC624' },
    { Icon: SiPostman, label: 'Postman', color: '#FF6C37' },
    { Icon: SiVirtualbox, label: 'VirtualBox', color: '#2F61B4' },
  ]},
]
// ===================================

// Tarjeta HUD con luz que sigue al mouse
function HudCard({ children, className = '' }) {
  const ref = useRef(null)
  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group clip-hud relative h-full bg-accent/20 p-px transition-colors hover:bg-accent/60 ${className}`}
    >
      <div className="clip-hud relative h-full overflow-hidden bg-surface/90 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(260px_circle_at_var(--mx)_var(--my),rgba(16,217,160,0.14),transparent_70%)]" />
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}

// Línea de la trayectoria que se llena con el scroll
function useScrollFill(ref, lineRef) {
  useEffect(() => {
    let ticking = false
    const update = () => {
      ticking = false
      const el = ref.current
      if (!el || !lineRef.current) return
      const r = el.getBoundingClientRect()
      const start = window.innerHeight * 0.75
      lineRef.current.style.transform = `scaleY(${Math.min(1, Math.max(0, (start - r.top) / r.height))})`
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref, lineRef])
}

export default function About() {
  const tlRef = useRef(null)
  const lineRef = useRef(null)
  useScrollFill(tlRef, lineRef)
  const t = useT()
  return (
    <section id="sobre-mi" className="relative px-4 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionTitle index="02" tag={t({ es: 'sobre_mí', en: 'about_me' })} title={t({ es: 'Más que código,', en: 'More than code,' })} highlight={t({ es: 'soluciones.', en: 'solutions.' })} />
        </Reveal>

        {/* Tarjetas */}
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map(({ Icon, title: tt, text: tx }, i) => {
            const title = t(tt), text = t(tx)
            return (
            <Reveal key={i} delay={i * 120}>
              <div className="selectable h-full" data-label={`Card · ${title}`} data-build={`<Card /> · ${title}`} data-build-by="Tailwind">
              <HudCard>
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <div className="grid place-items-center size-11 rounded-lg bg-accent/10 text-accent shadow-[inset_0_0_12px] shadow-accent/30">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-muted">0{i + 1}/03</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-wide">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </HudCard>
              </div>
            </Reveal>
          )})}
        </div>

        {/* Trayectoria + Habilidades */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          {/* Línea de tiempo */}
          <div>
            <Reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">&gt; {t({ es: 'trayectoria.log', en: 'journey.log' })}</h3>
            </Reveal>
            <ol ref={tlRef} className="relative mt-8 border-l border-accent/25 pl-8">
              <span aria-hidden="true" className="absolute -left-px top-0 w-px origin-top bg-accent shadow-[0_0_10px] shadow-accent" ref={lineRef} style={{ height: '100%', transform: 'scaleY(0)' }} />
              {timeline.map((item, i) => {
                const tl = { ...item, period: t(item.period), role: t(item.role), place: t(item.place), text: t(item.text) }
                return (
                <li key={tl.id} className="relative pb-14 last:pb-0" data-build={`<TimelineItem /> · ${tl.place.split(" ")[0]}`} data-build-by="Git">
                  <Reveal delay={i * 150}>
                    <span className="absolute -left-[41px] top-1 z-10 grid place-items-center size-4 rotate-45 border border-accent bg-bg">
                      <span className={`size-1.5 bg-accent ${i === 0 ? 'pulse-dot' : ''}`} />
                    </span>
                    <p className="font-mono text-xs uppercase tracking-widest text-accent">{tl.period}</p>
                    <h4 className="mt-2 font-display text-2xl font-bold uppercase leading-tight">{tl.role}</h4>
                    <p className="mt-1 text-sm text-ink/80">{tl.place}</p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{tl.text}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tl.tags.map(tag => (
                        <span key={tag} className="border border-accent/25 bg-accent/5 px-2.5 py-1 font-mono text-[11px] text-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                </li>
              )})}
            </ol>
          </div>

          {/* Habilidades */}
          <div>
            <Reveal>
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">&gt; stack.config</h3>
            </Reveal>
            <div className="mt-8 space-y-7">
              {skills.map(({ id, by, group, items }, gi) => (
                <Reveal key={id} delay={gi * 100}>
                  <div data-build={`<SkillGroup /> · ${t(group)}`} data-build-by={by}>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
                    <span className="text-accent">[{String(gi + 1).padStart(2, '0')}]</span> {t(group)}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map(({ Icon, label, color }) => (
                      <div
                        key={label}
                        className="group flex items-center gap-2 border border-line bg-surface/70 px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_0_18px_-6px] hover:shadow-accent"
                      >
                        <Icon size={16} color={color} className="transition-transform duration-200 group-hover:scale-125" />
                        <span className="text-sm text-ink/90">{label}</span>
                      </div>
                    ))}
                  </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
