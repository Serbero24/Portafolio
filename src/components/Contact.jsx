import { useState } from 'react'
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaArrowRight, FaCheck, FaPaperPlane, FaRedo } from 'react-icons/fa'
import SectionTitle from './SectionTitle'
import Reveal from './Reveal'
import { site } from '../data/site'
import { useT } from '../i18n'

const info = [
  { Icon: FaEnvelope, label: { es: 'Correo', en: 'Email' }, value: site.email, href: `mailto:${site.email}` },
  { Icon: FaMapMarkerAlt, label: { es: 'Ubicación', en: 'Location' }, value: site.location },
]

const socials = [
  { Icon: FaGithub, label: 'GitHub', user: site.githubUser, href: site.github },
  { Icon: FaLinkedin, label: 'LinkedIn', user: site.linkedinUser, href: site.linkedin },
].filter(s => s.href)

function Field({ label, id, error, textarea, ...props }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex justify-between font-mono text-[11px] uppercase tracking-widest text-muted">
        <span><span className="text-accent">&gt;</span> {label}</span>
        {error && <span className="normal-case tracking-normal text-red-400">{error}</span>}
      </label>
      <Tag
        id={id}
        name={id}
        {...props}
        className={`w-full border bg-bg/70 px-4 py-3 text-sm text-ink placeholder:text-muted/50 outline-none transition focus:border-accent focus:bg-bg focus:shadow-[0_0_0_3px] focus:shadow-accent/15 ${
          textarea ? 'min-h-36 resize-y' : ''
        } ${error ? 'border-red-400/60' : 'border-line'}`}
      />
    </div>
  )
}

function ContactForm() {
  const t = useT()
  const [data, setData] = useState({ nombre: '', email: '', mensaje: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const change = e => setData({ ...data, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!data.nombre.trim()) e.nombre = t({ es: 'Requerido', en: 'Required' })
    if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = t({ es: 'Correo no válido', en: 'Invalid email' })
    if (data.mensaje.trim().length < 10) e.mensaje = t({ es: 'Mínimo 10 caracteres', en: 'At least 10 characters' })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async e => {
    e.preventDefault()
    if (!validate()) return

    // Sin Formspree configurado: abre el correo del visitante
    if (!site.formspreeId) {
      const body = encodeURIComponent(`${data.mensaje}\n\n— ${data.nombre} (${data.email})`)
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(t({ es: 'Contacto desde tu portafolio', en: 'Contact from your portfolio' }))}&body=${body}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
      if (res.ok) setData({ nombre: '', email: '', mensaje: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="clip-hud bg-accent/30 p-px">
      <div className="clip-hud relative bg-surface/95 backdrop-blur">
        {/* Barra tipo terminal */}
        <div className="flex items-center gap-2 border-b border-line px-5 py-3">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-yellow-400/70" />
          <span className="size-2.5 rounded-full bg-accent/80" />
          <span className="ml-3 font-mono text-[11px] text-muted">{t({ es: '~/contacto/nuevo_mensaje.sh', en: '~/contact/new_message.sh' })}</span>
          <span className="ml-auto hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-accent">
            {status === 'sending' ? t({ es: 'transmitiendo…', en: 'transmitting…' }) : t({ es: 'canal abierto', en: 'channel open' })}
          </span>
        </div>

        {status === 'sent' ? (
          <div className="grid place-items-center gap-4 px-6 py-20 text-center animate-[pop_400ms_ease-out]">
            <div className="relative grid size-20 place-items-center">
              <span className="absolute inset-0 rounded-full border border-accent/40 animate-ping" />
              <span className="grid size-20 place-items-center rounded-full border border-accent bg-accent/10 text-accent shadow-[0_0_40px_-6px] shadow-accent">
                <FaCheck size={28} />
              </span>
            </div>
            <p className="font-display text-2xl font-bold uppercase">{t({ es: '¡Mensaje enviado!', en: 'Message sent!' })}</p>
            <p className="max-w-xs text-sm text-muted">{t({ es: 'Gracias por escribirme. Te responderé lo antes posible.', en: "Thanks for reaching out. I'll get back to you as soon as I can." })}</p>
            <button onClick={() => setStatus('idle')} className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent hover:underline">
              <FaRedo size={11} /> {t({ es: 'Enviar otro', en: 'Send another' })}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-5 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t({ es: 'Nombre', en: 'Name' })} id="nombre" placeholder={t({ es: 'Tu nombre', en: 'Your name' })} value={data.nombre} onChange={change} error={errors.nombre} autoComplete="name" />
              <Field label={t({ es: 'Correo', en: 'Email' })} id="email" type="email" placeholder={t({ es: 'tu@correo.com', en: 'you@email.com' })} value={data.email} onChange={change} error={errors.email} autoComplete="email" />
            </div>
            <Field label={t({ es: 'Mensaje', en: 'Message' })} id="mensaje" textarea placeholder={t({ es: 'Cuéntame sobre tu proyecto o propuesta…', en: 'Tell me about your project or offer…' })} value={data.mensaje} onChange={change} error={errors.mensaje} />

            {status === 'error' && (
              <p className="border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {t({ es: 'No se pudo enviar. Inténtalo de nuevo o escríbeme a', en: "Couldn't send it. Try again or email me at" })} {site.email}.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="group clip-hud relative w-full overflow-hidden bg-accent px-6 py-3.5 font-display font-bold uppercase tracking-wider text-bg shadow-[0_0_24px_-6px] shadow-accent transition hover:brightness-110 disabled:opacity-70"
            >
              {status === 'sending' && <span className="absolute inset-y-0 left-0 w-1/3 bg-white/30 animate-[sweep_1s_linear_infinite]" />}
              <span className="relative inline-flex items-center justify-center gap-2">
                {status === 'sending' ? t({ es: 'Enviando…', en: 'Sending…' }) : t({ es: 'Enviar mensaje', en: 'Send message' })}
                <FaPaperPlane size={13} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Contact() {
  const t = useT()
  return (
    <section id="contacto" className="relative px-4 pt-16 sm:pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionTitle index="04" tag={t({ es: 'contacto', en: 'contact' })} title={t({ es: 'Trabajemos', en: "Let's work" })} highlight={t({ es: 'juntos.', en: 'together.' })} />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          {/* Información */}
          <div>
            <Reveal>
              <p data-build="<p> · intro" data-build-by="JavaScript" className="max-w-md text-lg leading-relaxed text-ink/85">
                {t({ es: '¿Tienes una oferta de trabajo, un proyecto o simplemente quieres conversar sobre tecnología?', en: 'Have a job offer, a project, or just want to talk tech?' })}
                <span className="text-accent"> {t({ es: 'Escríbeme', en: 'Write to me' })}</span>{t({ es: ', respondo todos los mensajes.', en: ', I answer every message.' })}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ul data-build="<ContactInfo />" data-build-by="PHP" className="mt-10 space-y-5">
                {info.map(({ Icon, label, value, href }) => (
                  <li key={t(label)} className="flex items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rotate-45 border border-accent/40 bg-accent/5">
                      <Icon className="-rotate-45 text-accent" />
                    </span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{t(label)}</p>
                      {href ? (
                        <a href={href} className="text-ink hover:text-accent transition">{value}</a>
                      ) : (
                        <p className="text-ink">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-12 mb-4 font-mono text-xs uppercase tracking-[0.3em] text-accent">&gt; {t({ es: 'encuéntrame_en', en: 'find_me_on' })}</p>
              <div data-build="<SocialCards />" data-build-by="Tailwind" className="space-y-3">
                {socials.map(({ Icon, label, user, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group clip-hud flex bg-accent/20 p-px transition hover:bg-accent/70"
                  >
                    <span className="clip-hud flex w-full items-center gap-4 bg-surface px-5 py-4 transition group-hover:bg-surface/80">
                      <Icon size={22} className="text-muted transition group-hover:text-accent group-hover:scale-110" />
                      <span className="flex-1">
                        <span className="block font-display font-bold uppercase tracking-wide">{label}</span>
                        <span className="block font-mono text-xs text-muted">{user}</span>
                      </span>
                      <FaArrowRight className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:-rotate-45 group-hover:text-accent" />
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Formulario */}
          <Reveal delay={150}>
            <div className="selectable" data-label="ContactForm.jsx" data-build="<ContactForm />" data-build-by="Laravel">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
