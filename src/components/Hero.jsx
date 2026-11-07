import { SiLaravel, SiReact, SiMysql, SiTailwindcss, SiGit, SiPhp, SiJavascript, SiPython } from 'react-icons/si'
import { FaJava, FaDatabase } from 'react-icons/fa'
import SocialDock from './SocialDock'
import useTypewriter from '../hooks/useTypewriter'
import foto from '../assets/foto.jpg' // tu foto (cuadrada, se recorta en círculo)
import { site } from '../data/site'
import { useT } from '../i18n'

// Frases que se escriben solas, una tras otra
const roles = {
  es: ['Desarrollador Full Stack', 'APIs con Laravel', 'Interfaces con React', 'Datos con PostgreSQL', 'IA aplicada a problemas reales'],
  en: ['Full Stack Developer', 'APIs with Laravel', 'Interfaces with React', 'Data with PostgreSQL', 'AI applied to real problems'],
}

const inner = [
  { Icon: SiLaravel, color: '#FF2D20', label: 'Laravel', by: 'Laravel' },
  { Icon: SiReact, color: '#61DAFB', label: 'React', by: 'React' },
  { Icon: FaJava, color: '#F89820', label: 'Java', by: 'Java' },
  { Icon: FaDatabase, color: '#F80000', label: 'Oracle', by: 'Java' },
  { Icon: SiPython, color: '#3776AB', label: 'Python', by: 'Python' },
]
const outer = [
  { Icon: SiPhp, color: '#8993BE', label: 'PHP', by: 'PHP' },
  { Icon: SiJavascript, color: '#F7DF1E', label: 'JavaScript', by: 'JavaScript' },
  { Icon: SiMysql, color: '#4479A1', label: 'MySQL', by: 'PostgreSQL' },
  { Icon: SiTailwindcss, color: '#38BDF8', label: 'Tailwind', by: 'Tailwind' },
  { Icon: SiGit, color: '#F05032', label: 'Git', by: 'Git' },
]

function Orbit({ items, size, speed, reverse, ringBy, ringLabel }) {
  const dir = reverse ? 'reverse' : 'normal'
  return (
    <div
      className="orbit absolute rounded-full"
      style={{ width: size, height: size, '--speed': speed, animationDirection: dir }}
    >
      {/* El anillo se dibuja aparte para que cada ícono se coloque después */}
      <div data-build={ringLabel} data-build-by={ringBy} data-build-kind="pop" className="absolute inset-0 rounded-full border border-dashed border-accent/20" />
      {items.map(({ Icon, color, label, by }, i) => {
        const angle = (360 / items.length) * i
        return (
          <div key={label} className="planet-pos absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg) translateY(-${size / 2}px) rotate(-${angle}deg)` }}>
            <div className="planet -translate-x-1/2 -translate-y-1/2" style={{ animationDirection: dir }}>
              <div title={label} data-build={`<Icon /> · ${label}`} data-build-by={by} data-build-kind="pop" className="clip-hud grid place-items-center size-11 border border-accent/30 bg-surface/90 shadow-[inset_0_0_12px] shadow-accent/20">
                <Icon size={20} color={color} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Visor central: anillos HUD + foto con escaneo
function Core() {
  const ticks = Array.from({ length: 60 })
  return (
    <div className="selectable relative grid place-items-center size-60 rounded-full" data-label="foto.jpg · perfil">
      {/* Anillo con marcas */}
      <div data-build="<TickRing /> · 60 marcas" data-build-by="Linux" data-build-kind="pop" className="spin-slow absolute inset-0">
        {ticks.map((_, i) => (
          <span
            key={i}
            className={`absolute left-1/2 top-0 origin-[0_120px] w-px ${i % 5 === 0 ? 'h-3 bg-accent' : 'h-1.5 bg-accent/40'}`}
            style={{ transform: `rotate(${i * 6}deg)` }}
          />
        ))}
      </div>
      {/* Arcos de energía */}
      <div data-build="<EnergyArc /> · verde" data-build-by="FastAPI" data-build-kind="pop" className="spin-slow-rev absolute inset-4 rounded-full bg-[conic-gradient(from_0deg,transparent_0_70%,var(--color-accent)_85%,transparent_100%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-3px),#000_calc(100%-2px))]" />
      <div data-build="<EnergyArc /> · cian" data-build-by="Vite" data-build-kind="pop" className="spin-slow absolute inset-7 rounded-full bg-[conic-gradient(from_180deg,transparent_0_80%,#2de2ff_92%,transparent_100%)] [mask:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-1px))]" />
      {/* Foto */}
      <div data-build="<img> · foto.jpg" data-build-by="Python" data-build-kind="image" className="relative size-40 rounded-full overflow-hidden border border-accent/50 shadow-[0_0_60px_-8px] shadow-accent">
        <img src={foto} alt="Sheridan Manuyama" className="size-full object-cover bg-surface" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(16,217,160,0.06)_0_1px,transparent_1px_3px)]" />
        <div className="scanline absolute inset-x-0 h-8 -translate-y-1/2 bg-gradient-to-b from-transparent via-accent/40 to-transparent" />
      </div>
    </div>
  )
}

export default function Hero() {
  const t = useT()
  const typed = useTypewriter(t(roles))

  return (
    <section id="inicio" className="lg:min-h-screen flex items-center px-4 pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-x-clip">
      <div className="mx-auto max-w-6xl w-full grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
        {/* Texto */}
        <div>
          <div data-build="<Status />" data-build-by="Tailwind" className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-accent">
            <span className="pulse-dot size-2 rounded-full bg-accent" />
            {t(site.disponible)}
          </div>

          <p data-build="<code> · saludo" data-build-by="JavaScript" className="mt-6 font-mono text-sm text-muted">
            <span className="text-accent">// </span>{t({ es: 'hola_mundo', en: 'hello_world' })}<span className="text-accent">(</span>{t({ es: '"soy Sheridan"', en: '"I\'m Sheridan"' })}<span className="text-accent">)</span>
          </p>

          <h1 data-build="<h1> · titular" data-build-by="React" data-label="<h1> · display" className="selectable mt-3 font-display font-bold uppercase leading-[0.95] tracking-tight text-[2.3rem] min-[400px]:text-[2.6rem] sm:text-6xl lg:text-[3.6rem] xl:text-[4.4rem]">
            {t({ es: 'Convierto ideas', en: 'I turn ideas' })}
            <br />
            {t({ es: 'en software', en: 'into software' })}
            <br />
            {t({ es: 'que', en: 'that' })}{' '}
            <span className="glitch text-accent neon" data-text={t({ es: 'funciona.', en: 'works.' })}>{t({ es: 'funciona.', en: 'works.' })}</span>
          </h1>

          <p data-build="<Typewriter />" data-build-by="JavaScript" className="mt-6 font-mono text-lg sm:text-xl text-ink/90 h-8">
            <span className="text-accent">&gt; </span>
            {typed}
            <span className="caret text-accent">_</span>
          </p>

          <p data-build="<p> · descripción" data-build-by="Tailwind" className="mt-5 max-w-lg text-muted leading-relaxed">
            {t({
              es: 'Estudiante de Ingeniería de Software con IA y practicante de desarrollo de software. Hoy trabajo en AmantIA, una plataforma web que acerca modelos de inteligencia artificial a la investigación amazónica.',
              en: 'Software Engineering with AI student and software development intern. Right now I work on AmantIA, a web platform that brings artificial intelligence models to Amazon research.',
            })}
          </p>

          <div data-build="<Buttons />" data-build-by="Vite" className="mt-8 flex flex-wrap gap-3">
            {site.cv && <a href={site.cv} download className="clip-hud bg-accent px-6 py-3 font-display font-bold uppercase tracking-wider text-bg shadow-[0_0_24px_-4px] shadow-accent hover:brightness-110 transition">
              {t({ es: 'Descargar CV', en: 'Download CV' })}
            </a>}
            <a href="#contacto" className="group clip-hud bg-accent/70 p-px">
              <span className="clip-hud block bg-bg px-6 py-[11px] font-display font-bold uppercase tracking-wider text-accent group-hover:bg-surface transition">
                {t({ es: 'Contáctame', en: 'Contact me' })}
              </span>
            </a>
          </div>

          <div data-build="<SocialDock />" data-build-by="React">
            <SocialDock />
          </div>
        </div>

        {/* Visor con órbitas */}
        <div className="brackets relative mx-auto grid place-items-center size-[320px] sm:size-[460px]">
          <span data-build="<Label /> · estado" data-build-by="Linux" className="absolute left-0 -top-6 font-mono text-[10px] uppercase tracking-widest text-accent/70">sys.profile // online</span>
          <span data-build="<Label /> · coordenadas" data-build-by="Git" className="absolute right-0 -bottom-6 font-mono text-[10px] uppercase tracking-widest text-accent/70">03°44′S · 73°15′W</span>
          <div className="absolute inset-0 grid place-items-center scale-[0.68] sm:scale-100">
            <Orbit items={outer} size={420} speed="40s" reverse ringBy="Vite" ringLabel="<OrbitRing /> · 420px" />
            <Orbit items={inner} size={300} speed="28s" ringBy="FastAPI" ringLabel="<OrbitRing /> · 300px" />
            <Core />
          </div>
        </div>
      </div>
    </section>
  )
}
