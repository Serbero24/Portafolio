import { SiLaravel, SiReact, SiPhp, SiJavascript, SiTailwindcss, SiPostgresql, SiMysql, SiPython, SiFastapi, SiGit, SiLinux, SiVite, SiPostman } from 'react-icons/si'
import { FaJava, FaDatabase } from 'react-icons/fa'
import { useT } from '../i18n'

// Cinta infinita de tecnologías (inspirada en la franja de logos del video)
const items = [
  [SiLaravel, 'Laravel'], [SiReact, 'React'], [SiPostgresql, 'PostgreSQL'], [SiPhp, 'PHP'],
  [SiJavascript, 'JavaScript'], [SiTailwindcss, 'Tailwind'], [FaJava, 'Java'], [FaDatabase, 'Oracle'],
  [SiPython, 'Python'], [SiFastapi, 'FastAPI'], [SiMysql, 'MySQL'], [SiVite, 'Vite'],
  [SiGit, 'Git'], [SiLinux, 'Linux'], [SiPostman, 'Postman'],
]

export default function TechMarquee() {
  const t = useT()
  const row = items.map(([Icon, label]) => (
    <li key={label} className="flex shrink-0 items-center gap-3 text-muted transition-colors hover:text-accent">
      <Icon size={22} />
      <span className="font-display text-lg font-bold uppercase tracking-wide">{label}</span>
      <span className="ml-6 size-1.5 rotate-45 bg-accent/50" />
    </li>
  ))

  return (
    <section data-build="<TechMarquee />" data-build-by="Vite" aria-label={t({ es: 'Tecnologías que uso', en: 'Technologies I use' })} className="relative z-10 border-y border-line/70 bg-surface/40 py-6 backdrop-blur-sm">
      <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.3em]">
        <span className="text-accent">// {t({ es: 'stack_en_uso', en: 'stack_in_use' })}</span>
        <span className="hidden text-muted sm:inline">{items.length} {t({ es: 'tecnologías', en: 'technologies' })}</span>
      </div>
      <div className="marquee group overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
          <ul className="flex shrink-0 gap-6 pr-6">{row}</ul>
          {/* Copia para que el bucle sea continuo */}
          <ul className="flex shrink-0 gap-6 pr-6" aria-hidden="true">{row}</ul>
        </div>
      </div>
    </section>
  )
}
