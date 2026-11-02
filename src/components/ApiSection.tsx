import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { useSettings } from '../settings'
import { API_BASE_URL, API_URL_CONFIGURED } from '../config'

type Language = 'python' | 'curl' | 'javascript'
type CopyState = 'idle' | 'copied' | 'error'

const samples: Record<Language, string> = {
  python: `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_AIS_API_KEY",
    base_url="${API_BASE_URL}",
)

response = client.chat.completions.create(
    model="MODEL_NAME",
    messages=[
        {"role": "user", "content": "Hello, AiS!"}
    ],
)

print(response.choices[0].message.content)`,
  curl: `curl ${API_BASE_URL}/chat/completions \\
  -H "Authorization: Bearer YOUR_AIS_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "MODEL_NAME",
    "messages": [
      {"role": "user", "content": "Hello, AiS!"}
    ]
  }'`,
  javascript: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "YOUR_AIS_API_KEY",
  baseURL: "${API_BASE_URL}",
});

const response = await client.chat.completions.create({
  model: "MODEL_NAME",
  messages: [
    { role: "user", content: "Hello, AiS!" }
  ],
});

console.log(response.choices[0].message.content);`,
}

const tabs: { id: Language; label: string; filename: string }[] = [
  { id: 'python', label: 'Python', filename: 'app.py' },
  { id: 'curl', label: 'cURL', filename: 'request.sh' },
  { id: 'javascript', label: 'JavaScript', filename: 'app.mjs' },
]

function highlight(code: string): ReactNode[] {
  const tokens = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b(?:from|import|const|await|new|print|curl)\b|\b\d+\b)/g
  const result: ReactNode[] = []
  let cursor = 0
  for (const match of code.matchAll(tokens)) {
    const position = match.index ?? 0
    if (position > cursor) result.push(code.slice(cursor, position))
    const token = match[0]
    const kind = token.startsWith('"') || token.startsWith("'")
      ? 'string'
      : token.startsWith('#')
        ? 'comment'
        : /^\d+$/.test(token)
          ? 'number'
          : 'keyword'
    result.push(<span className={`code-token-${kind}`} key={position}>{token}</span>)
    cursor = position + token.length
  }
  if (cursor < code.length) result.push(code.slice(cursor))
  return result
}

async function copyText(value: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // The fallback also supports browsers without clipboard permission.
    }
  }
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  const field = document.createElement('textarea')
  field.value = value
  field.setAttribute('readonly', '')
  field.style.position = 'fixed'
  field.style.left = '-9999px'
  field.style.opacity = '0'
  document.body.appendChild(field)
  field.select()
  let success = false
  try {
    success = document.execCommand('copy')
  } catch {
    success = false
  } finally {
    field.remove()
    previousFocus?.focus({ preventScroll: true })
  }
  return success
}

function ArrowIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function CopyIcon({ copied }: { copied: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">{copied
    ? <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    : <><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.5" /></>}
  </svg>
}

export default function ApiSection() {
  const { t } = useSettings()
  const [language, setLanguage] = useState<Language>('python')
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyRequest = useRef(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      copyRequest.current += 1
      if (copyTimer.current) clearTimeout(copyTimer.current)
    }
  }, [])

  function selectLanguage(next: Language) {
    copyRequest.current += 1
    if (copyTimer.current) clearTimeout(copyTimer.current)
    setLanguage(next)
    setCopyState('idle')
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    selectLanguage(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  async function handleCopy() {
    const request = ++copyRequest.current
    if (copyTimer.current) clearTimeout(copyTimer.current)
    const copied = await copyText(samples[language])
    if (!mounted.current || request !== copyRequest.current) return
    setCopyState(copied ? 'copied' : 'error')
    copyTimer.current = setTimeout(() => {
      if (mounted.current) setCopyState('idle')
    }, 2600)
  }

  const selectedTab = tabs.find(tab => tab.id === language)!
  const copyLabel = copyState === 'copied'
    ? t('Copied', 'Скопировано')
    : copyState === 'error'
      ? t('Select and copy', 'Выделите и скопируйте')
      : t('Copy code', 'Копировать код')
  const useCases = [
    { index: '01', en: 'AI applications', ru: 'AI-приложения', enText: 'Add model intelligence to your product.', ruText: 'Добавляйте возможности AI-моделей в свой продукт.' },
    { index: '02', en: 'Bots & assistants', ru: 'Боты и ассистенты', enText: 'Build conversational experiences for your users.', ruText: 'Создавайте диалоговые интерфейсы для пользователей.' },
    { index: '03', en: 'SaaS products', ru: 'SaaS-продукты', enText: 'Integrate AI into your service workflows.', ruText: 'Интегрируйте AI в рабочие процессы вашего сервиса.' },
    { index: '04', en: 'Internal tools', ru: 'Внутренние инструменты', enText: 'Support your team with purpose-built AI tools.', ruText: 'Создавайте AI-инструменты для задач своей команды.' },
    { index: '05', en: 'Automation', ru: 'Автоматизация', enText: 'Connect models to recurring tasks and pipelines.', ruText: 'Подключайте модели к регулярным задачам и процессам.' },
    { index: '06', en: 'Prototypes', ru: 'Прототипы', enText: 'Explore ideas with a familiar API interface.', ruText: 'Проверяйте идеи через привычный API-интерфейс.' },
  ]

  return (
    <section id="api" className="section api-section" aria-labelledby="api-heading">
      <div className="container">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">{t('03 / FOR DEVELOPERS', '03 / ДЛЯ РАЗРАБОТЧИКОВ')}</p>
            <h2 id="api-heading">{t('One API. Multiple AI models.', 'Один API. Множество AI-моделей.')}</h2>
          </div>
          <p>{t('AiS API brings supported models and providers together through a unified integration layer. Build with a familiar interface, and choose a model available to your key.', 'AiS API объединяет поддерживаемые модели и провайдеров в едином слое интеграции. Работайте через привычный интерфейс и выбирайте модель, доступную вашему ключу.')}</p>
        </div>

        <div className="api-grid reveal">
          <div className="api-copy">
            <div className="api-endpoint"><span className="status-dot" aria-hidden="true" /><span>{t('BASE URL', 'БАЗОВЫЙ URL')}</span><code>{API_BASE_URL}</code></div>
            <h3>{t('Your stack. Connected.', 'Ваш стек. Всё подключено.')}</h3>
            <p>{t('Use AiS from your backend, scripts, or existing AI application. Configure your credentials and model once, then send requests through the same API.', 'Используйте AiS в бэкенде, скриптах или существующем AI-приложении. Настройте ключ и модель, затем отправляйте запросы через единый API.')}</p>
            <div className="api-facts">
              <div className="api-fact"><span className="api-fact-number">01</span><div><h4>{t('One integration layer', 'Единый слой интеграции')}</h4><p>{t('A consistent entry point for supported models.', 'Общий интерфейс для поддерживаемых моделей.')}</p></div></div>
              <div className="api-fact"><span className="api-fact-number">02</span><div><h4>{t('OpenAI-compatible format', 'OpenAI-совместимый формат')}</h4><p>{t('Keep the SDK and request patterns you know.', 'Используйте знакомые SDK и формат запросов.')}</p></div></div>
              <div className="api-fact"><span className="api-fact-number">03</span><div><h4>{t('Model access by key', 'Доступ к моделям по ключу')}</h4><p>{t('Choose from the models your API key is permitted to use.', 'Выбирайте модели, разрешённые для вашего API-ключа.')}</p></div></div>
            </div>
            <div className="api-actions">
              <a className="button button-primary" href={API_URL_CONFIGURED ? API_BASE_URL : '#api'} {...(API_URL_CONFIGURED && API_BASE_URL.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{t('Open AiS API', 'Открыть AiS API')}<ArrowIcon /></a>
              <a className="button button-secondary" href="#models">{t('Explore models', 'Посмотреть модели')}</a>
            </div>
          </div>

          <div className="code-window">
            <div className="code-window-top"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><span>{selectedTab.filename}</span><span className="code-environment">{t('SERVER SIDE', 'НА СЕРВЕРЕ')}</span></div>
            <div className="code-toolbar">
              <div className="code-tabs" role="tablist" aria-label={t('Code example language', 'Язык примера кода')}>
                {tabs.map((tab, index) => <button
                  className={`code-tab${language === tab.id ? ' is-active' : ''}`}
                  id={`api-tab-${tab.id}`}
                  role="tab"
                  aria-selected={language === tab.id}
                  aria-controls="api-code-panel"
                  tabIndex={language === tab.id ? 0 : -1}
                  ref={element => { tabRefs.current[index] = element }}
                  onClick={() => selectLanguage(tab.id)}
                  onKeyDown={event => handleTabKey(event, index)}
                  type="button"
                  key={tab.id}
                >{tab.label}</button>)}
              </div>
              <button className={`code-copy${copyState === 'copied' ? ' is-copied' : ''}`} type="button" onClick={handleCopy} aria-label={copyLabel}><CopyIcon copied={copyState === 'copied'} /><span>{copyLabel}</span></button>
            </div>
            <div id="api-code-panel" className="code-body" role="tabpanel" aria-labelledby={`api-tab-${language}`} tabIndex={0}><pre key={language}><code>{highlight(samples[language])}</code></pre></div>
            <div className="code-window-footer"><span className="code-note">{t('Replace the key and model placeholders. Keep API keys on your server.', 'Замените ключ и название модели. Храните API-ключи на сервере.')}</span><span className="sr-only" aria-live="polite">{copyState === 'idle' ? '' : copyLabel}</span></div>
          </div>
        </div>

        <div className="api-discovery reveal">
          <div className="api-discovery-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m4 7 8-4 8 4-8 4-8-4Zm0 5 8 4 8-4M4 17l8 4 8-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <div><h3>{t('Discover models available to your key', 'Узнайте, какие модели доступны вашему ключу')}</h3><p>{t('Your AiS API key is assigned model permissions. Send an authenticated GET request to /v1/models to discover the models available to it, then use a returned model identifier in your requests.', 'Для каждого AiS API-ключа назначаются права доступа к моделям. Отправьте авторизованный GET-запрос к /v1/models, чтобы узнать доступные модели, затем используйте полученный идентификатор модели в запросах.')}</p></div>
          <code><span className="http-method">GET</span> {API_BASE_URL}/models</code>
        </div>

        <div id="compatibility" className="compatibility-panel reveal" aria-labelledby="compatibility-heading">
          <div className="compatibility-top">
            <div><p className="eyebrow">{t('A FAMILIAR CONNECTION', 'ПРИВЫЧНОЕ ПОДКЛЮЧЕНИЕ')}</p><h3 id="compatibility-heading">{t('Already using the OpenAI SDK?', 'Уже используете OpenAI SDK?')}</h3></div>
            <p>{t('Set your base URL to', 'Укажите базовый URL')} <code>{API_BASE_URL}</code>{t(', provide an API key, and select a model your key can access. Your familiar SDK can connect to your self-hosted API.', ', укажите API-ключ и выберите доступную модель. Знакомый SDK сможет подключиться к вашему API.')}</p>
          </div>
          <ol className="compatibility-chain" aria-label={t('API request path', 'Путь API-запроса')}>
            {[
              { label: 'OpenAI SDK', detail: t('Your application', 'Ваше приложение') },
              { label: '/v1', detail: t('Compatible interface', 'Совместимый интерфейс') },
              { label: 'AiS API', detail: t('Unified access', 'Единый доступ') },
              { label: t('Model Router', 'Маршрутизатор моделей'), detail: t('Request routing', 'Маршрутизация запросов') },
              { label: t('Providers', 'Провайдеры'), detail: t('Connected services', 'Подключённые сервисы') },
              { label: t('Models', 'Модели'), detail: t('Available to your key', 'Доступны вашему ключу') },
            ].map((step, index) => <li className="compatibility-node" key={index}><span className="compatibility-step">{String(index + 1).padStart(2, '0')}</span><strong>{step.label}</strong><small>{step.detail}</small>{index < 5 && <span className="compatibility-arrow" aria-hidden="true"><ArrowIcon /></span>}</li>)}
          </ol>
          <p className="compatibility-footnote">{t('AiS AI is our own separate project, currently in development and training. It is not part of the live model routing shown here.', 'AiS AI — наш отдельный собственный проект, который сейчас находится в разработке и обучении. Он пока не участвует в рабочей маршрутизации моделей, показанной здесь.')}</p>
        </div>

        <div id="developers" className="developer-use-cases reveal" aria-labelledby="developers-heading">
          <div className="developer-heading"><p className="eyebrow">{t('BUILT TO BUILD WITH', 'ДЛЯ ВАШИХ ПРОЕКТОВ')}</p><h3 id="developers-heading">{t('From an idea to your next product.', 'От идеи до вашего следующего продукта.')}</h3><p>{t('Bring AI into the things you are building.', 'Добавляйте AI в то, что создаёте.')}</p></div>
          <div className="developer-grid">{useCases.map(item => <article className="developer-card" key={item.index}><span className="developer-card-index">{item.index}<ArrowIcon /></span><h4>{t(item.en, item.ru)}</h4><p>{t(item.enText, item.ruText)}</p></article>)}</div>
        </div>
      </div>
    </section>
  )
}
