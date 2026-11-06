import { createContext, useCallback, useContext, useEffect, useState } from 'react'

// ===== Idioma: español / inglés =====
// Cualquier texto puede ser un string simple o { es: '...', en: '...' }.
// En un componente: const t = useT()  →  t({ es: 'Hola', en: 'Hello' })

const LangContext = createContext({ lang: 'es', setLang: () => {}, toggle: () => {} })
const START_LANG = 'en' // idioma con el que abre la página ('en' o 'es')

export function LangProvider({ children }) {
  // Siempre inicia en inglés; el visitante puede cambiar a español con el botón ES / EN
  const [lang, setLang] = useState(START_LANG)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggle = useCallback(() => setLang(l => (l === 'es' ? 'en' : 'es')), [])

  // Otros componentes (paleta de comandos) pueden pedir el cambio con un evento
  useEffect(() => {
    const on = () => toggle()
    window.addEventListener('toggle-lang', on)
    return () => window.removeEventListener('toggle-lang', on)
  }, [toggle])

  return <LangContext.Provider value={{ lang, setLang, toggle }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

export const tr = (v, lang) => (v && typeof v === 'object' && 'es' in v ? v[lang] ?? v.es : v)

export function useT() {
  const { lang } = useLang()
  return useCallback(v => tr(v, lang), [lang])
}
