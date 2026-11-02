function normalizeBaseUrl(value: string | undefined, fallback: string): string {
  const configured = value?.trim()
  return (configured || fallback).replace(/\/+$/, '')
}

function normalizeOptionalUrl(value: string | undefined): string {
  return value?.trim().replace(/\/+$/, '') ?? ''
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL, 'https://api.example.org/v1')
export const API_URL_CONFIGURED = Boolean(import.meta.env.VITE_API_BASE_URL?.trim())
export const AUTH_URL = normalizeOptionalUrl(import.meta.env.VITE_AUTH_URL)
export const CHAT_URL = normalizeOptionalUrl(import.meta.env.VITE_CHAT_URL)
export const CHAT_ENTRY_URL = AUTH_URL || CHAT_URL
export const TELEGRAM_BOT_URL = normalizeOptionalUrl(import.meta.env.VITE_TELEGRAM_BOT_URL)
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL?.trim() ?? ''
