import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaArrowRight, FaGithub, FaExternalLinkAlt, FaLock, FaTimes, FaCertificate, FaCode } from 'react-icons/fa'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { categories, projects, certificates, upcoming } from '../data/projects'
import { useT } from '../i18n'

// Pasa los textos de un proyecto al idioma actual
const localize = (p, t) => ({ ...p, subtitle: t(p.subtitle), org: t(p.org), status: t(p.status), summary: t(p.summary), highlights: t(p.highlights) })

// Portada: tu imagen o una generada con estilo HUD
function Cover({ project, large }) {
  const { Icon, image, code, title } = project
  if (image) {
    return (
      <div className="relative h-full overflow-hidden">
        <img src={image} alt={title} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
      </div>
    )
  }
  return (
    <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(16,217,160,0.22),transparent_60%),linear-gradient(135deg,#071a24,#050b14)]">
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(16,217,160,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(16,217,160,0.15)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(circle_at_70%_40%,black,transparent_75%)]" />
      {/* Anillos */}
      <div className="absolute right-[12%] top-1/2 -translate-y-1/2">
        <div className={`spin-slow relative grid place-items-center rounded-full border border-dashed border-accent/30 ${large ? 'size-56' : 'size-36'}`}>
          <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px] shadow-accent" />
        </div>
        <div className={`absolute inset-0 m-auto grid place-items-center rounded-full border border-accent/40 bg-bg/60 text-accent shadow-[0_0_50px_-10px] shadow-accent transition-transform duration-500 group-hover:scale-110 ${large ? 'size-28' : 'size-20'}`}>
          <Icon size={large ? 44 : 30} />
        </div>
      </div>
      <span className="absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent/80">{code}</span>
      <span className="absolute left-5 bottom-4 font-mono text-[10px] uppercase tracking-widest text-muted">render://preview</span>
      {/* Escaneo al pasar el mouse */}
      <div className="absolute inset-x-0 top-0 h-full -translate-y-full bg-gradient-to-b from-transparent via-accent/10 to-transparent transition-transform duration-1000 group-hover:translate-y-full" />
    </div>
  )
}

function ProjectCard({ project, onOpen }) {
  const t = useT()
  const ref = useRef(null)
  const { featured, title, subtitle, summary, stack, org, status } = project

  // Inclinación 3D según el mouse
  const onMove = e => {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`
  }
  const onLeave = () => (ref.current.style.transform = '')

  return (
    <button
      ref={ref}
      onClick={() => onOpen(project.id)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group clip-hud block h-full w-full bg-accent/20 p-px text-left transition-[background-color,transform] duration-200 ease-out hover:bg-accent/70 ${''}`}
    >
      <div className={`clip-hud flex h-full bg-surface ${featured ? 'flex-col lg:flex-row' : 'flex-col'}`}>
        <div className={featured ? 'h-56 lg:h-auto lg:w-1/2' : 'h-44'}>
          <Cover project={project} large={featured} />
        </div>
        <div className={`flex flex-1 flex-col p-6 ${featured ? 'lg:p-9' : ''}`}>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
            <span className="text-muted">{org}</span>
            <span className="text-accent/50">/</span>
            <span className="inline-flex items-center gap-1.5 text-accent">
              <span className="size-1.5 rounded-full bg-accent" />
              {status}
            </span>
            {featured && <span className="ml-auto border border-accent/40 px-2 py-0.5 text-accent">★ {t({ es: 'Destacado', en: 'Featured' })}</span>}
          </div>
          <h3 className={`mt-3 font-display font-bold uppercase leading-tight ${featured ? 'text-3xl lg:text-4xl' : 'text-xl'}`}>{title}</h3>
          <p className="mt-1 text-sm text-ink/70">{subtitle}</p>
          <p className={`mt-4 text-sm leading-relaxed text-muted ${featured ? '' : 'line-clamp-3'}`}>{summary}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {stack.slice(0, featured ? 8 : 4).map(t => (
              <span key={t} className="border border-line bg-bg/60 px-2 py-0.5 font-mono text-[11px] text-ink/80">{t}</span>
            ))}
            {!featured && stack.length > 4 && <span className="px-1 py-0.5 font-mono text-[11px] text-muted">+{stack.length - 4}</span>}
          </div>
          <span className="mt-auto pt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            {t({ es: 'Ver detalles', en: 'View details' })}
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </div>
      </div>
    </button>
  )
}

// Ventana de detalle del proyecto
function ProjectModal({ project, onClose }) {
  const t = useT()
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const { title, subtitle, summary, highlights, stack, org, status, repo, demo, code } = project

  // Se dibuja directo en <body> para quedar por encima del menú
  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm animate-[fade_200ms_ease-out]" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto clip-hud bg-accent/50 p-px animate-[pop_250ms_ease-out]">
        <div className="clip-hud bg-surface">
          <div className="h-48 sm:h-60">
            <Cover project={project} large />
          </div>
          <button onClick={onClose} aria-label={t({ es: 'Cerrar', en: 'Close' })} className="absolute right-4 top-4 grid size-9 place-items-center border border-accent/40 bg-bg/80 text-accent hover:bg-accent hover:text-bg transition">
            <FaTimes />
          </button>

          <div className="p-6 sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">{code} <span className="text-muted">// {org} · {status}</span></p>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl font-bold uppercase leading-tight">{title}</h3>
            <p className="mt-1 text-ink/70">{subtitle}</p>
            <p className="mt-5 leading-relaxed text-muted">{summary}</p>

            <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-accent">&gt; {t({ es: 'lo_que_hice', en: 'what_i_did' })}</h4>
            <ul className="mt-4 space-y-2.5">
              {highlights.map(h => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-accent" />
                  {h}
                </li>
              ))}
            </ul>

            <h4 className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-accent">&gt; {t({ es: 'tecnologías', en: 'tech_stack' })}</h4>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map(t => (
                <span key={t} className="border border-accent/30 bg-accent/5 px-2.5 py-1 font-mono text-xs text-accent">{t}</span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {demo && (
                <a href={demo} target="_blank" rel="noreferrer" className="clip-hud inline-flex items-center gap-2 bg-accent px-5 py-2.5 font-display font-bold uppercase tracking-wider text-bg">
                  <FaExternalLinkAlt size={13} /> {t({ es: 'Ver demo', en: 'Live demo' })}
                </a>
              )}
              {repo && (
                <a href={repo} target="_blank" rel="noreferrer" className="clip-hud inline-flex items-center gap-2 border border-accent/60 px-5 py-2.5 font-display font-bold uppercase tracking-wider text-accent">
                  <FaGithub /> {t({ es: 'Código', en: 'Code' })}
                </a>
              )}
              {project.private && (
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
                  <FaLock /> {t({ es: 'Código privado de la institución', en: 'Private institutional code' })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Tarjeta "en construcción" para el siguiente proyecto
function UpcomingCard({ index, title, text }) {
  const t = useT()
  return (
    <div data-build="<UpcomingCard />" data-build-by="Git" className="md:col-span-2">
      <div className="relative overflow-hidden border border-dashed border-accent/35 bg-surface/40 px-6 py-8 sm:px-9">
        <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(135deg,rgba(16,217,160,0.08)_0_12px,transparent_12px_24px)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid size-14 shrink-0 place-items-center border border-accent/40 bg-bg/70 text-accent">
            <FaCode size={22} />
          </div>
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              PRJ_{String(index).padStart(2, '0')} <span className="text-muted">// {t({ es: 'en construcción', en: 'under construction' })}</span>
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase">{title}</h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{text}</p>
          </div>
          <div className="w-full sm:w-48">
            <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>{t({ es: 'compilando', en: 'compiling' })}</span><span className="caret text-accent">_</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden bg-line">
              <div className="h-full w-1/3 bg-accent shadow-[0_0_10px] shadow-accent animate-[sweep_2.4s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Certificates() {
  const t = useT()
  if (certificates.length === 0) {
    return (
      <div className="clip-hud bg-accent/20 p-px">
        <div className="clip-hud grid place-items-center gap-3 bg-surface/90 px-6 py-16 text-center">
          <FaCertificate size={32} className="text-accent" />
          <p className="font-display text-xl font-bold uppercase">{t({ es: 'Cargando credenciales...', en: 'Loading credentials...' })}</p>
          <p className="max-w-sm text-sm text-muted">{t({ es: 'Pronto agregaré aquí mis certificados y cursos.', en: "I'll add my certificates and courses here soon." })}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map(c => (
        <a key={t(c.title)} href={c.url || undefined} target="_blank" rel="noreferrer" className="group clip-hud bg-accent/20 p-px transition hover:bg-accent/60">
          <div className="clip-hud flex h-full gap-4 bg-surface p-5">
            <FaCertificate size={22} className="shrink-0 text-accent" />
            <div>
              <p className="font-display font-bold uppercase leading-tight">{t(c.title)}</p>
              <p className="mt-1 text-sm text-muted">{t(c.issuer)}</p>
              <p className="mt-2 font-mono text-[11px] text-accent">{c.date}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

export default function Projects() {
  const [tab, setTab] = useState('proyectos')
  const t = useT()
  const [filter, setFilter] = useState('Todos')
  const [open, setOpen] = useState(null)

  // La paleta de comandos puede abrir un proyecto
  useEffect(() => {
    const on = e => { setTab('proyectos'); setOpen(e.detail) }
    window.addEventListener('open-project', on)
    return () => window.removeEventListener('open-project', on)
  }, [])

  const list = useMemo(
    () => (filter === 'Todos' ? projects : projects.filter(p => p.category.includes(filter))).map(p => localize(p, t)),
    [filter, t]
  )

  const tabs = [
    { id: 'proyectos', label: t({ es: 'Proyectos', en: 'Projects' }), count: projects.length },
    { id: 'certificados', label: t({ es: 'Certificados', en: 'Certificates' }), count: certificates.length },
  ]

  return (
    <section id="proyectos" className="relative px-4 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionTitle index="03" tag={t({ es: 'proyectos', en: 'projects' })} title={t({ es: 'Lo que he', en: "What I've" })} highlight={t({ es: 'construido.', en: 'built.' })} />
        </Reveal>

        {/* Pestañas + filtros */}
        <Reveal>
          <div data-build="<Tabs />" data-build-by="React" className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex self-start rounded-full border border-accent/25 bg-surface/60 p-1 backdrop-blur">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-5 py-2 font-mono text-xs uppercase tracking-wider transition ${
                    tab === t.id ? 'bg-accent text-bg font-semibold shadow-[0_0_16px] shadow-accent/50' : 'text-muted hover:text-accent'
                  }`}
                >
                  {t.label} <span className="opacity-60">[{t.count}]</span>
                </button>
              ))}
            </div>

            {tab === 'proyectos' && projects.length > 2 && (
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFilter(c.id)}
                    className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition ${
                      filter === c.id ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent/50 hover:text-ink'
                    }`}
                  >
                    {filter === c.id ? '■' : '□'} {t(c.label)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {tab === 'proyectos' ? (
          <div key={filter} className="grid gap-5 md:grid-cols-2">
            {list.map((p, i) => (
              <div key={p.id} data-build={`<ProjectCard /> · ${p.title}`} data-build-by="Laravel" data-label={`ProjectCard · ${p.title}`}  className={`selectable ${p.featured ? 'md:col-span-2' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>
                <ProjectCard project={p} onOpen={setOpen} />
              </div>
            ))}
            {upcoming && filter === 'Todos' && <UpcomingCard index={list.length + 1} title={t(upcoming.title)} text={t(upcoming.text)} />}
          </div>
        ) : (
          <Certificates />
        )}
      </div>

      {open && <ProjectModal project={localize(projects.find(p => p.id === open), t)} onClose={() => setOpen(null)} />}
    </section>
  )
}
