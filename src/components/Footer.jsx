import { FaArrowUp } from 'react-icons/fa'
import { site } from '../data/site'
import { useT } from '../i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="relative z-10 border-t border-line/70 bg-bg/60 px-4 py-8 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} {site.name} <span className="text-accent">//</span> {t({ es: 'Hecho con React + Tailwind', en: 'Built with React + Tailwind' })}
        </p>
        <p className="hidden md:flex items-center gap-3 font-mono text-[11px] text-muted">
          <span><kbd className="border border-line px-1.5 py-0.5 text-ink">Ctrl</kbd> <kbd className="border border-line px-1.5 py-0.5 text-ink">K</kbd> {t({ es: 'comandos', en: 'commands' })}</span>
          <span><kbd className="border border-line px-1.5 py-0.5 text-ink">B</kbd> {t({ es: 'modo plano', en: 'blueprint mode' })}</span>
        </p>
        <a href="#inicio" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted hover:text-accent">
          {t({ es: 'Volver arriba', en: 'Back to top' })}
          <span className="grid size-8 place-items-center border border-accent/30 transition group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-[0_0_14px] group-hover:shadow-accent/50">
            <FaArrowUp size={11} />
          </span>
        </a>
      </div>
    </footer>
  )
}
