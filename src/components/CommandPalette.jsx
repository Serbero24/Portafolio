import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaHome, FaUser, FaFolderOpen, FaEnvelope, FaBrain, FaCopy, FaLinkedin, FaGithub, FaFileDownload, FaDraftingCompass, FaLanguage, FaSearch } from 'react-icons/fa'
import { site } from '../data/site'
import { useLang, useT } from '../i18n'

// Paleta de comandos: Ctrl+K (o ⌘K en Mac). También se abre con el evento "open-palette".
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const go = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function CommandPalette() {
  const t = useT()
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const [toast, setToast] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const lastFocus = useRef(null)

  const notify = useCallback(msg => {
    setToast(msg)
    clearTimeout(notify.t)
    notify.t = setTimeout(() => setToast(''), 2200)
  }, [])

  const commands = useMemo(() => {
    const c = [
      { group: t({ es: 'Navegar', en: 'Navigate' }), Icon: FaHome, label: t({ es: 'Ir a Inicio', en: 'Go to Home' }), hint: '/inicio', run: () => go('inicio') },
      { group: t({ es: 'Navegar', en: 'Navigate' }), Icon: FaUser, label: t({ es: 'Ir a Sobre mí', en: 'Go to About' }), hint: '/sobre-mi', run: () => go('sobre-mi') },
      { group: t({ es: 'Navegar', en: 'Navigate' }), Icon: FaFolderOpen, label: t({ es: 'Ir a Proyectos', en: 'Go to Projects' }), hint: '/proyectos', run: () => go('proyectos') },
      { group: t({ es: 'Navegar', en: 'Navigate' }), Icon: FaEnvelope, label: t({ es: 'Ir a Contacto', en: 'Go to Contact' }), hint: '/contacto', run: () => go('contacto') },
      { group: t({ es: 'Navegar', en: 'Navigate' }), Icon: FaBrain, label: t({ es: 'Ver proyecto AmantIA', en: 'Open AmantIA project' }), hint: 'PRJ_01', run: () => { go('proyectos'); setTimeout(() => window.dispatchEvent(new CustomEvent('open-project', { detail: 'amantia' })), 500) } },
      { group: t({ es: 'Acciones', en: 'Actions' }), Icon: FaCopy, label: t({ es: 'Copiar mi correo', en: 'Copy my email' }), hint: site.email, run: async () => {
        try { await navigator.clipboard.writeText(site.email); notify(t({ es: 'Correo copiado', en: 'Email copied' })) }
        catch { notify(site.email) }
      } },
    ]
    if (site.linkedin) c.push({ group: t({ es: 'Acciones', en: 'Actions' }), Icon: FaLinkedin, label: t({ es: 'Abrir LinkedIn', en: 'Open LinkedIn' }), hint: 'linkedin.com', run: () => window.open(site.linkedin, '_blank', 'noopener') })
    if (site.github) c.push({ group: t({ es: 'Acciones', en: 'Actions' }), Icon: FaGithub, label: t({ es: 'Abrir GitHub', en: 'Open GitHub' }), hint: 'github.com', run: () => window.open(site.github, '_blank', 'noopener') })
    if (site.cv) c.push({ group: t({ es: 'Acciones', en: 'Actions' }), Icon: FaFileDownload, label: t({ es: 'Descargar CV', en: 'Download CV' }), hint: 'PDF', run: () => { const a = document.createElement('a'); a.href = site.cv; a.download = ''; a.click() } })
    c.push(
      { group: t({ es: 'Preferencias', en: 'Preferences' }), Icon: FaDraftingCompass, label: t({ es: 'Modo plano', en: 'Blueprint mode' }), hint: 'B', run: () => window.dispatchEvent(new Event('toggle-blueprint')) },
      { group: t({ es: 'Preferencias', en: 'Preferences' }), Icon: FaLanguage, label: lang === 'es' ? 'Switch to English' : 'Cambiar a Español', hint: lang === 'es' ? 'EN' : 'ES', run: () => window.dispatchEvent(new Event('toggle-lang')) },
    )
    return c
  }, [t, lang, notify])

  const list = useMemo(() => {
    const n = norm(q.trim())
    return n ? commands.filter(c => norm(c.label + ' ' + c.group + ' ' + c.hint).includes(n)) : commands
  }, [q, commands])

  const show = useCallback(() => {
    lastFocus.current = document.activeElement
    setQ(''); setSel(0); setOpen(true)
  }, [])
  const hide = useCallback(() => {
    setOpen(false)
    lastFocus.current?.focus?.()
  }, [])
  const run = c => { hide(); setTimeout(() => c.run(), 60) }

  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open ? hide() : show() }
    }
    const onOpen = () => show()
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-palette', onOpen)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-palette', onOpen) }
  }, [open, show, hide])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 10) }, [open])
  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [sel])

  const onInputKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(list.length - 1, s + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)) }
    else if (e.key === 'Enter' && list[sel]) { e.preventDefault(); run(list[sel]) }
    else if (e.key === 'Escape') { e.preventDefault(); hide() }
  }

  let lastGroup = null
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[150] grid place-items-start justify-center bg-bg/70 px-4 pt-[14vh] backdrop-blur-sm animate-[fade_150ms_ease-out]" onMouseDown={e => e.target === e.currentTarget && hide()}>
          <div role="dialog" aria-modal="true" aria-label={t({ es: 'Paleta de comandos', en: 'Command palette' })} className="clip-hud w-full max-w-xl bg-accent/50 p-px shadow-[0_40px_100px_-30px_#000] animate-[pop_200ms_ease-out]">
            <div className="clip-hud bg-surface">
              <div className="flex items-center gap-3 border-b border-line px-4">
                <FaSearch className="text-accent" size={14} />
                <input
                  ref={inputRef}
                  id="palette-input"
                  value={q}
                  onChange={e => { setQ(e.target.value); setSel(0) }}
                  onKeyDown={onInputKey}
                  placeholder={t({ es: 'Escribe un comando o una sección…', en: 'Type a command or a section…' })}
                  className="w-full bg-transparent py-4 font-mono text-sm text-ink outline-none placeholder:text-muted/60"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={list[sel] ? `cmd-${sel}` : undefined}
                  autoComplete="off"
                />
                <kbd className="shrink-0 border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">Esc</kbd>
              </div>
              <ul id="palette-list" ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {list.length === 0 && <li className="px-3 py-6 text-center font-mono text-sm text-muted">{t({ es: 'Sin resultados', en: 'No results' })}</li>}
                {list.map((c, i) => {
                  const head = c.group !== lastGroup ? (lastGroup = c.group) : null
                  return (
                    <li key={c.label} role="presentation">
                      {head && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-accent/80">{head}</p>}
                      <div
                        id={`cmd-${i}`}
                        role="option"
                        aria-selected={i === sel}
                        onMouseMove={() => setSel(i)}
                        onClick={() => run(c)}
                        className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm transition-colors ${i === sel ? 'bg-accent/12 text-ink shadow-[inset_2px_0_0] shadow-accent' : 'text-muted'}`}
                      >
                        <c.Icon size={14} className={i === sel ? 'text-accent' : ''} />
                        <span className="flex-1">{c.label}</span>
                        <span className="font-mono text-[11px] text-muted/80">{c.hint}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div className="flex flex-wrap gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                <span><kbd className="text-ink">↑ ↓</kbd> {t({ es: 'moverse', en: 'move' })}</span>
                <span><kbd className="text-ink">Enter</kbd> {t({ es: 'elegir', en: 'select' })}</span>
                <span><kbd className="text-ink">Esc</kbd> {t({ es: 'cerrar', en: 'close' })}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[160] -translate-x-1/2 border border-accent/50 bg-surface px-4 py-2 font-mono text-xs text-accent shadow-[0_0_24px_-8px] shadow-accent animate-[pop_200ms_ease-out]">
          ✓ {toast}
        </div>
      )}
    </>
  )
}
