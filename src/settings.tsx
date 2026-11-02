import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import uz from './locales/uz'

export const THEMES = [
  { id: 'night', en: 'Night', ru: 'Ночь', preview: 'linear-gradient(135deg, #0b111b 55%, #b7e3c6)' },
  { id: 'light', en: 'Light', ru: 'Светлая', preview: 'linear-gradient(135deg, #f5f7f4 55%, #497b5a)' },
  { id: 'galaxy', en: 'Galaxy', ru: 'Галактика', preview: 'linear-gradient(135deg, #0e1022, #7c59bd 60%, #b6abff)' },
  { id: 'cyberpunk', en: 'Cyberpunk', ru: 'Киберпанк', preview: 'linear-gradient(135deg, #151321, #bb88d5 60%, #7ae4d8)' },
  { id: 'monochrome', en: 'Monochrome', ru: 'Монохром', preview: 'linear-gradient(135deg, #111111 50%, #e4e4e4 50%)' },
  { id: 'glassmorphism', en: 'Glassmorphism', ru: 'Стекло', preview: 'linear-gradient(135deg, #11252a, #85b7b7 60%, #dfebe9)' },
] as const

export type Theme = typeof THEMES[number]['id']
export type Language = 'en' | 'ru' | 'uz'

const locales: Record<Language, string> = { en: 'en_US', ru: 'ru_RU', uz: 'uz_UZ' }

function isLanguage(value: string | null): value is Language {
  return value === 'en' || value === 'ru' || value === 'uz'
}

interface Settings {
  lang: Language
  theme: Theme
  setLang: (lang: Language) => void
  setTheme: (theme: Theme) => void
  t: (en: string, ru: string) => string
}

const SettingsContext = createContext<Settings | undefined>(undefined)
const themeColors: Record<Theme, string> = {
  night: '#0b111b', light: '#f5f7f4', galaxy: '#0e1022',
  cyberpunk: '#151321', monochrome: '#111111', glassmorphism: '#11252a',
}

function readPreference(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}

function savePreference(key: string, value: string) {
  try { window.localStorage.setItem(key, value) } catch { /* Preferences still work for this visit. */ }
}

function initialLanguage(): Language {
  const stored = readPreference('ais-language')
  return isLanguage(stored) ? stored : 'en'
}

function initialTheme(): Theme {
  const stored = readPreference('ais-theme')
  return THEMES.find((option) => option.id === stored)?.id ?? 'night'
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(initialLanguage)
  const [theme, setThemeValue] = useState<Theme>(initialTheme)
  const transitionTimer = useRef<number | undefined>(undefined)
  const t = useCallback((en: string, ru: string) => lang === 'uz' ? uz[en] ?? en : lang === 'ru' ? ru : en, [lang])
  const setTheme = useCallback((nextTheme: Theme) => {
    if (nextTheme === theme) return
    if (transitionTimer.current !== undefined) window.clearTimeout(transitionTimer.current)
    document.documentElement.classList.add('theme-changing')
    setThemeValue(nextTheme)
    transitionTimer.current = window.setTimeout(() => {
      document.documentElement.classList.remove('theme-changing')
      transitionTimer.current = undefined
    }, 300)
  }, [theme])

  useEffect(() => () => {
    if (transitionTimer.current !== undefined) window.clearTimeout(transitionTimer.current)
    document.documentElement.classList.remove('theme-changing')
  }, [])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'ais-language' || event.key === null) {
        if (isLanguage(event.newValue) || event.newValue === null) setLang(event.newValue ?? 'en')
      }
      if (event.key === 'ais-theme' || event.key === null) {
        const nextTheme = THEMES.find((option) => option.id === event.newValue)?.id
        if (nextTheme || event.newValue === null) setThemeValue(nextTheme ?? 'night')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    savePreference('ais-language', lang)
    const title = t('AiS — Multi-Model AI Platform', 'AiS — платформа для работы с AI-моделями')
    const description = t(
      'AiS is a multi-model AI platform with web chat, Telegram access and an OpenAI-compatible API for connecting applications to multiple AI models.',
      'AiS — мультимодельная AI-платформа с веб-чатом, доступом через Telegram и совместимым с OpenAI API для подключения приложений к различным моделям искусственного интеллекта.',
    )
    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:locale"]', locales[lang])
    const alternateLocales = Object.values(locales).filter(locale => locale !== locales[lang])
    document.querySelectorAll<HTMLMetaElement>('meta[property="og:locale:alternate"]').forEach((meta, index) => {
      meta.content = alternateLocales[index]
    })
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    const imageDescription = t('AiS — Multi-Model AI Platform. Chat, APIs, Telegram and the AiS ecosystem.', 'AiS — платформа для работы с AI-моделями. Чат, API, Telegram и экосистема AiS.')
    setMeta('meta[property="og:image:alt"]', imageDescription)
    setMeta('meta[name="twitter:image:alt"]', imageDescription)
  }, [lang, t])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    savePreference('ais-theme', theme)
    setMeta('meta[name="theme-color"]', themeColors[theme])
  }, [theme])

  const value = useMemo(() => ({ lang, theme, setLang, setTheme, t }), [lang, theme, setTheme, t])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): Settings {
  const settings = useContext(SettingsContext)
  if (!settings) throw new Error('useSettings must be used within SettingsProvider')
  return settings
}
