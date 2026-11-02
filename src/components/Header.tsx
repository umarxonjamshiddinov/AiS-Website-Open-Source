import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { THEMES, useSettings } from '../settings'
import { CHAT_ENTRY_URL } from '../config'

function Chevron() {
  return <svg className="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
}

function ThemePicker() {
  const { theme, setTheme, t } = useSettings()
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(0)
  const pickerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const current = THEMES.find((option) => option.id === theme) ?? THEMES[0]

  function close(restoreFocus = false) {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }

  function show(index = THEMES.findIndex((option) => option.id === theme)) {
    setFocused(index)
    setOpen(true)
  }

  useEffect(() => {
    if (open) optionRefs.current[focused]?.focus()
  }, [open, focused])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open])

  function handleOptionKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined
    if (event.key === 'ArrowDown') next = (index + 1) % THEMES.length
    if (event.key === 'ArrowUp') next = (index - 1 + THEMES.length) % THEMES.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = THEMES.length - 1
    if (next !== undefined) {
      event.preventDefault()
      setFocused(next)
    }
    if (event.key === 'Tab') {
      close(true)
      if (event.shiftKey) event.preventDefault()
    }
  }

  return (
    <div className="theme-picker" ref={pickerRef} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
    }}>
      <button className="theme-trigger" type="button" ref={triggerRef} aria-haspopup="listbox" aria-expanded={open} aria-controls={menuId}
        aria-label={`${t('Theme', 'Тема')}: ${t(current.en, current.ru)}. ${t('Change theme', 'Изменить тему')}`}
        onClick={() => open ? close() : show()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            show()
          }
        }}>
        <span className="theme-swatch" style={{ background: current.preview }} aria-hidden="true" />
        <span className="theme-name">{t(current.en, current.ru)}</span>
        <Chevron />
      </button>
      {open && <div className="theme-menu" id={menuId} role="listbox" aria-label={t('Choose theme', 'Выберите тему')}>
        {THEMES.map((option, index) => <button className="theme-option" key={option.id} role="option" type="button" aria-selected={theme === option.id}
          tabIndex={focused === index ? 0 : -1} ref={(element) => { optionRefs.current[index] = element }}
          onFocus={() => setFocused(index)} onKeyDown={(event) => handleOptionKey(event, index)}
          onClick={() => { setTheme(option.id); close(true) }}>
          <span className="theme-swatch" style={{ background: option.preview }} aria-hidden="true" />
          <span>{t(option.en, option.ru)}</span>
          <span className="theme-check" aria-hidden="true">{theme === option.id ? '✓' : ''}</span>
        </button>)}
      </div>}
    </div>
  )
}

export function Header() {
  const { lang, setLang, t } = useSettings()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const mobileId = useId()
  const links = [
    { href: '#ecosystem', en: 'Products', ru: 'Продукты' },
    { href: '#chat', en: 'Chat', ru: 'Чат' },
    { href: '#api', en: 'API', ru: 'API' },
    { href: '#models', en: 'Models', ru: 'Модели' },
    { href: '#developers', en: 'Developers', ru: 'Разработчикам' },
    { href: '#about', en: 'About', ru: 'О нас' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)')
    const onResize = () => { if (desktop.matches) setMobileOpen(false) }
    desktop.addEventListener('change', onResize)
    return () => desktop.removeEventListener('change', onResize)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMobileOpen(false)
    }
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        setMobileOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} ref={headerRef}>
      <div className="container header-inner">
        <a className="logo" href="#top" aria-label={t('AiS, back to top', 'AiS, в начало страницы')} onClick={() => setMobileOpen(false)}>
          <span className="logo-mark" aria-hidden="true">A</span><span>AiS<span className="logo-period">.</span></span>
        </a>
        <nav className="desktop-nav" aria-label={t('Main navigation', 'Основная навигация')}>
          {links.map((link) => <a href={link.href} key={link.href}>{t(link.en, link.ru)}</a>)}
        </nav>
        <div className="header-controls">
          <div className="language-switch" role="group" aria-label={t('Language', 'Язык')}>
            <button type="button" lang="en" aria-label="English" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
            <button type="button" lang="ru" aria-label="Русский" aria-pressed={lang === 'ru'} onClick={() => setLang('ru')}>RU</button>
            <button type="button" lang="uz" aria-label="O‘zbekcha" aria-pressed={lang === 'uz'} onClick={() => setLang('uz')}>UZ</button>
          </div>
          <ThemePicker />
          <a className="header-chat" href={CHAT_ENTRY_URL || '#chat'} {...(CHAT_ENTRY_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{t('Open Chat', 'Открыть чат')}<span aria-hidden="true">↗</span></a>
          <button className="menu-toggle" type="button" ref={toggleRef} aria-expanded={mobileOpen} aria-controls={mobileId}
            aria-label={mobileOpen ? t('Close menu', 'Закрыть меню') : t('Open menu', 'Открыть меню')} onClick={() => setMobileOpen((value) => !value)}>
            <svg className="icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              {mobileOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && <div className="mobile-menu" id={mobileId}>
        <div className="container mobile-menu-inner">
          <div className="mobile-settings">
            <div className="language-switch" role="group" aria-label={t('Menu language', 'Язык в меню')}>
              <button type="button" lang="en" aria-label="English" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              <button type="button" lang="ru" aria-label="Русский" aria-pressed={lang === 'ru'} onClick={() => setLang('ru')}>RU</button>
              <button type="button" lang="uz" aria-label="O‘zbekcha" aria-pressed={lang === 'uz'} onClick={() => setLang('uz')}>UZ</button>
            </div>
            <ThemePicker />
          </div>
          <nav className="mobile-nav" aria-label={t('Mobile navigation', 'Мобильная навигация')}>
            {links.map((link) => <a href={link.href} key={link.href} onClick={() => setMobileOpen(false)}>{t(link.en, link.ru)}<span aria-hidden="true">↗</span></a>)}
          </nav>
          <a className="button button-primary mobile-chat" href={CHAT_ENTRY_URL || '#chat'} {...(CHAT_ENTRY_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})} onClick={() => setMobileOpen(false)}>{t('Open Chat', 'Открыть чат')}<span aria-hidden="true">↗</span></a>
        </div>
      </div>}
    </header>
  )
}

export default Header
