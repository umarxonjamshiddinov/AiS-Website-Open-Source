import { useEffect, useLayoutEffect, type CSSProperties } from 'react'
import { SettingsProvider, useSettings } from './settings'
import Header from './components/Header'
import ApiSection from './components/ApiSection'
import Architecture from './components/Architecture'
import { API_BASE_URL, API_URL_CONFIGURED, CHAT_ENTRY_URL, SUPPORT_EMAIL, TELEGRAM_BOT_URL } from './config'

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={diagonal ? 'M4 16 16 4M6 4h10v10' : 'M3 10h13m-5-5 5 5-5 5'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function ProductIcon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    chat: 'M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2Z M7 9h10M7 13h7',
    api: 'm8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18',
    ai: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M18.4 5.6l-2.1 2.1m-8.6 8.6-2.1 2.1M12 7l5 5-5 5-5-5Z',
    compatible: 'M10 8H7a4 4 0 0 0 0 8h3m4-8h3a4 4 0 0 1 0 8h-3M8 12h8',
    telegram: 'm3 11 18-7-4 17-6-6-4 3v-5l10-6-10 8-4-4Z',
    mobile: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 3h4m-3 14h2',
  }
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={paths[kind] ?? paths.api} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Status({ upcoming = false }: { upcoming?: boolean }) {
  const { t } = useSettings()
  return <span className={'status ' + (upcoming ? 'status-upcoming' : 'status-live')}><span aria-hidden="true" />{upcoming ? t('Coming soon', 'Скоро') : t('Live', 'Работает')}</span>
}

function Logo() {
  const { t } = useSettings()
  return <a className="logo" href="#top" aria-label={t('AiS, back to top', 'AiS, к началу страницы')}><span className="logo-mark" aria-hidden="true">A</span><span>AiS<span className="logo-period">.</span></span></a>
}

function Hero() {
  const { t } = useSettings()
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-atmosphere" aria-hidden="true" />
    <div className="container hero-grid">
      <div className="hero-copy">
        <a className="announcement hero-enter" href="#ais-ai"><span className="announcement-core" aria-hidden="true" /><span>AiS AI <span className="announcement-divider">/</span> {t('Our own AI. Coming soon.', 'Собственный AI. Скоро.')}</span><Arrow /></a>
        <p className="eyebrow hero-enter">AiS Platform <span>/</span> {t('Multi-model AI', 'Мультимодельный AI')}</p>
        <h1 id="hero-title"><span className="hero-enter">{t('One platform.', 'Одна платформа.')}</span><span className="hero-enter hero-accent">{t('Multiple AI models.', 'Множество AI-моделей.')}</span></h1>
        <p className="hero-intro hero-enter">{t('Chat with leading AI models or connect your applications through one unified API.', 'Общайтесь с ведущими AI-моделями или подключайте свои приложения через единый API.')}</p>
        <div className="hero-actions hero-enter"><a className="button button-primary" href={CHAT_ENTRY_URL || '#chat'} {...(CHAT_ENTRY_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{t('Open AiS Chat', 'Открыть AiS Chat')}<Arrow diagonal /></a><a className="button button-secondary" href="#api">{t('Explore AiS API', 'Изучить AiS API')}<Arrow /></a></div>
        <div className="hero-footnote hero-enter"><span className="tiny-line" /><span>{t('Built in Uzbekistan. Connected to the AI ecosystem.', 'Создано в Узбекистане. Подключено к экосистеме AI.')}</span></div>
        <p className="hero-capabilities hero-enter">{t('OpenAI-compatible API · Telegram · Android coming soon', 'OpenAI-совместимый API · Telegram · Android — скоро')}</p>
      </div>
      <div className="hero-network hero-enter"><div className="panel-bar"><span className="panel-dots" aria-hidden="true"><i /><i /><i /></span><span>AiS / {t('PLATFORM OVERVIEW', 'ОБЗОР ПЛАТФОРМЫ')}</span><span className="panel-corner">↗</span></div><Architecture compact /><div className="network-bottom"><span>{t('One entry point. A connected ecosystem.', 'Единая точка входа. Связанная экосистема.')}</span><span className="network-symbol" aria-hidden="true">⌘</span></div></div>
    </div>
    <div className="container access-strip"><span className="access-label">{t('YOUR WAY INTO AiS', 'ВАШ СПОСОБ РАБОТЫ С AiS')}</span><a href={CHAT_ENTRY_URL || '#chat'} {...(CHAT_ENTRY_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><ProductIcon kind="chat" />{t('In your browser', 'В браузере')}<Arrow diagonal /></a><a href="#api"><ProductIcon kind="api" />{t('In your application', 'В приложении')}<Arrow /></a><a href={TELEGRAM_BOT_URL || '#in-action'} {...(TELEGRAM_BOT_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><ProductIcon kind="telegram" />{t('In Telegram', 'В Telegram')}<Arrow diagonal /></a></div>
  </section>
}

function Ecosystem() {
  const { t } = useSettings()
  const products = [
    { name: 'AiS Chat', kind: 'chat', description: t('A web interface for accessing multiple AI models. Pick a model and keep your conversations in one place.', 'Веб-интерфейс для работы с различными AI-моделями. Выбирайте модель и ведите диалоги в одном месте.'), href: CHAT_ENTRY_URL || '#chat', cta: t('Open Chat', 'Открыть чат') },
    { name: 'AiS API', kind: 'api', description: t('A unified API for AI applications and models. Connect your product to the wider AiS ecosystem.', 'Единый API для AI-приложений и моделей. Подключайте свой продукт к экосистеме AiS.'), href: '#api', cta: t('Explore the API', 'Изучить API') },
    { name: 'AiS AI', kind: 'ai', description: t('Our own AI, currently being developed and trained. A new part of the AiS ecosystem.', 'Собственный AI от AiS, который сейчас разрабатывается и обучается. Новая часть экосистемы AiS.'), href: '#ais-ai', cta: t('In development · Training', 'В разработке · Обучается'), upcoming: true },
    { name: t('OpenAI Compatible', 'Совместимость с OpenAI'), kind: 'compatible', description: t('Connect existing OpenAI-compatible applications with minimal changes to your integration.', 'Подключайте приложения, совместимые с OpenAI API, с минимальными изменениями интеграции.'), href: '#compatibility', cta: API_BASE_URL },
    { name: 'AiSCloudBot', kind: 'telegram', description: t('Use AiS directly inside Telegram. A familiar client for the same multi-model platform.', 'Используйте AiS прямо в Telegram. Привычный клиент единой мультимодельной платформы.'), href: TELEGRAM_BOT_URL || '#in-action', cta: t('Open Telegram', 'Открыть Telegram') },
    { name: 'AiS Mobile', kind: 'mobile', description: t('Our native Android client is in development. Access AiS anywhere with the upcoming app.', 'Нативный клиент для Android находится в разработке. Работайте с AiS где угодно с будущим приложением.'), href: '#ais-mobile', cta: t('Android · In development', 'Android · В разработке'), upcoming: true },
  ]
  return <section className="section ecosystem-section" id="ecosystem" aria-labelledby="ecosystem-title"><div className="container">
    <div className="section-heading reveal"><div><p className="eyebrow">01 / {t('THE ECOSYSTEM', 'ЭКОСИСТЕМА')}</p><h2 id="ecosystem-title">{t('Everything connects.', 'Всё взаимосвязано.')}<br /><span>{t('Everything is AiS.', 'Всё — AiS.')}</span></h2></div><p>{t('One platform, different ways to use it. From your first conversation to the application you build next.', 'Одна платформа, разные способы работы. От первого диалога до следующего приложения, которое вы создадите.')}</p></div>
    <div className="ecosystem-grid">{products.map((product, index) => <article className={'product-card reveal ' + (product.kind === 'ai' ? 'ai-product-card' : '')} key={product.kind} style={{ '--stagger': `${index % 3 * 80}ms` } as CSSProperties}><div className="product-card-top"><span className="product-icon"><ProductIcon kind={product.kind} /></span><Status upcoming={product.upcoming} /></div><h3>{product.name}</h3><p>{product.description}</p><a className="card-link" href={product.href} {...(product.href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}><span>{product.cta}</span><Arrow diagonal={product.href.startsWith('https:')} /></a></article>)}</div>
  </div></section>
}

function ChatPreview() {
  const { t } = useSettings()
  return <div className="chat-preview reveal" aria-label={t('Illustrative AiS Chat interface preview', 'Иллюстрация интерфейса AiS Chat')}>
    <div className="browser-bar"><span className="panel-dots" aria-hidden="true"><i /><i /><i /></span><span className="browser-address"><span aria-hidden="true">▧</span> {CHAT_ENTRY_URL ? t('Configured chat destination', 'Адрес чата настроен') : 'VITE_CHAT_URL'}</span><span aria-hidden="true">↗</span></div>
    <div className="chat-preview-body"><aside className="chat-sidebar"><div className="preview-brand"><span className="logo-mark">A</span> AiS Chat</div><div className="preview-new"><span aria-hidden="true">＋</span>{t('New conversation', 'Новый диалог')}</div><p>{t('CONVERSATIONS', 'ДИАЛОГИ')}</p><div className="preview-history active">{t('Understanding AI routing', 'Маршрутизация AI')}</div><div className="preview-history">{t('Ideas for my next project', 'Идеи для нового проекта')}</div><div className="preview-history">{t('A little help with Python', 'Помощь с Python')}</div><div className="sidebar-bottom"><span className="user-avatar">U</span>{t('Your workspace', 'Ваше пространство')}</div></aside>
      <div className="preview-conversation"><div className="conversation-top"><span>{t('Your selected model', 'Выбранная модель')}<span aria-hidden="true">⌄</span></span><span className="preview-label">{t('INTERFACE PREVIEW', 'ПРИМЕР ИНТЕРФЕЙСА')}</span></div><div className="chat-messages"><div className="user-message"><span className="user-avatar">U</span><p>{t('How does AiS connect different AI models?', 'Как AiS объединяет разные AI-модели?')}</p></div><div className="assistant-message"><span className="assistant-avatar">A</span><div><strong>AiS</strong><p>{t('Think of AiS as a single connection to a wider AI ecosystem.', 'AiS — это единая точка подключения к большой экосистеме AI.')}</p><p>{t('You choose an available model. AiS API and the model router connect your request to its provider, then return the response to this conversation.', 'Вы выбираете доступную модель. AiS API и маршрутизатор направляют запрос её провайдеру, а затем возвращают ответ в этот диалог.')}</p><div className="message-path"><span>AiS Chat</span><Arrow /><span>AiS API</span><Arrow /><span>{t('Model', 'Модель')}</span></div></div></div></div><div className="preview-composer"><span>{t('Your next question starts here…', 'Ваш следующий вопрос начинается здесь…')}</span><span className="composer-send" aria-hidden="true">↑</span></div><p className="preview-disclaimer">{t('Illustrative preview. Available models and interface may vary.', 'Иллюстрация. Доступные модели и интерфейс могут отличаться.')}</p></div>
    </div>
  </div>
}

function ChatSection() {
  const { t } = useSettings()
  return <section className="section chat-section" id="chat" aria-labelledby="chat-title"><div className="container chat-grid"><div className="section-copy reveal"><p className="eyebrow">02 / AiS Chat</p><h2 id="chat-title">{t('Your browser.', 'Ваш браузер.')}<br /><span>{t('Your AI workspace.', 'Ваше AI-пространство.')}</span></h2><p>{t('Use AiS directly from your browser. Choose a model, start a conversation and manage your chats from one interface.', 'Используйте AiS прямо из браузера. Выберите модель, начните диалог и работайте с чатами через единый интерфейс.')}</p><ul className="feature-list"><li>{t('Choose between available AI models', 'Выбирайте среди доступных AI-моделей')}</li><li>{t('Keep conversations in one interface', 'Ведите диалоги в едином интерфейсе')}</li><li>{t('Work with chat history where supported', 'Работайте с историей чатов, где это поддерживается')}</li></ul><a className="button button-primary" href={CHAT_ENTRY_URL || '#chat'} {...(CHAT_ENTRY_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{t('Launch AiS Chat', 'Открыть AiS Chat')}<Arrow diagonal /></a><p className="small-note">{CHAT_ENTRY_URL ? t('Chat destination configured', 'Адрес чата настроен') : 'VITE_CHAT_URL'} <span>·</span> <Status /></p></div><ChatPreview /></div></section>
}

function Models() {
  const { t } = useSettings()
  return <section className="section models-section" id="models" aria-labelledby="models-title"><div className="container"><div className="section-heading reveal"><div><p className="eyebrow">04 / {t('CONNECTED INFRASTRUCTURE', 'СВЯЗАННАЯ ИНФРАСТРУКТУРА')}</p><h2 id="models-title">{t('Model choice.', 'Выбор моделей.')}<br /><span>{t('Without the complexity.', 'Без лишней сложности.')}</span></h2></div><p>{t('A growing catalog of AI models, connected through a common platform. The available catalog depends on your access and the provider configuration.', 'Расширяющийся каталог AI-моделей на общей платформе. Доступные модели зависят от ваших прав доступа и конфигурации провайдеров.')}</p></div>
    <div className="models-grid"><div className="model-principles reveal"><article><span className="principle-number">01</span><div><h3>{t('Choose the model for the task', 'Выбирайте модель под задачу')}</h3><p>{t('Different models offer different approaches. Explore the models available to your account in AiS Chat or through the API.', 'Разные модели предлагают разные подходы. Изучайте доступные вашему аккаунту модели в AiS Chat или через API.')}</p></div></article><article><span className="principle-number">02</span><div><h3>{t('One integration layer', 'Единый слой интеграции')}</h3><p>{t('AiS Backend API connects clients to model routes and provider infrastructure, including Amazon Bedrock.', 'AiS Backend API соединяет клиенты с маршрутами моделей и инфраструктурой провайдеров, включая Amazon Bedrock.')}</p></div></article><article><span className="principle-number">03</span><div><h3>{t('Our own AI is on the horizon', 'Собственный AI — впереди')}</h3><p>{t('AiS AI is a separate, AiS-owned project in development and training. It is not yet available for public use.', 'AiS AI — отдельный собственный проект AiS в разработке и обучении. Он пока недоступен для публичного использования.')}</p><a className="text-link" href="#ais-ai">AiS AI · {t('Coming soon', 'Скоро')}<Arrow /></a></div></article></div><div className="architecture-panel reveal"><div className="panel-bar"><span>{t('FROM CLIENT TO MODEL', 'ОТ КЛИЕНТА К МОДЕЛИ')}</span><span className="diagram-key"><i />{t('Upcoming', 'Скоро')}</span></div><Architecture /></div></div><p className="provider-note reveal">{t('Third-party models belong to their respective developers. AiS provides the platform, interfaces and integration layer. Provider references do not imply partnership or endorsement.', 'Сторонние модели принадлежат их разработчикам. AiS предоставляет платформу, интерфейсы и слой интеграции. Упоминание провайдеров не означает партнёрство или одобрение.')}</p>
  </div></section>
}

function IntelligenceCore() {
  const points = [[180, 38], [83, 79], [277, 79], [38, 158], [322, 158], [85, 239], [275, 239], [180, 281], [125, 124], [235, 124], [125, 194], [235, 194]]
  return <div className="intelligence-core" aria-hidden="true"><div className="core-halo" /><svg viewBox="0 0 360 320" fill="none"><g className="neural-lines"><path d="M180 38 83 79 38 158 85 239 180 281 275 239 322 158 277 79 180 38ZM83 79 125 124 180 160 235 124 277 79M38 158l87-34v70l-40 45m40-45 55-34 55 34 40 45m-95 42v-121M180 38v122l142-2M125 124h110v70H125M38 158l142 2 95 79" /></g><g className="neural-stream"><path d="m83 79 42 45 55 36 55 34 40 45" /><path d="m277 79-42 45-55 36-55 34-40 45" /></g>{points.map(([x, y], i) => <circle className="neural-node" key={i} cx={x} cy={y} r={i > 7 ? 3 : 4} />)}<rect className="neural-core-ring" x="150" y="130" width="60" height="60" rx="13" transform="rotate(45 180 160)" /><rect className="neural-core-box" x="156" y="136" width="48" height="48" rx="10" /><text x="180" y="169" textAnchor="middle" className="neural-core-letter">A</text></svg><div className="core-coordinate">AiS / AI</div></div>
}

function MobilePreview() {
  const { t } = useSettings()
  return <div className="mobile-preview" aria-label={t('AiS Mobile concept preview, in development', 'Концепция AiS Mobile, в разработке')}><div className="phone-shell"><div className="phone-camera" /><div className="phone-screen"><div className="phone-top">AiS<span className="phone-grid" aria-hidden="true">▦</span></div><span className="phone-core" aria-hidden="true">A</span><p>{t('Your AI.', 'Ваш AI.')}<br />{t('Anywhere.', 'Где угодно.')}</p><div className="phone-suggestion">{t('Start with a question', 'Начните с вопроса')}<Arrow /></div><div className="phone-suggestion">{t('Explore an idea', 'Исследуйте идею')}<Arrow /></div><div className="phone-coming">Android · {t('Coming soon', 'Скоро')}</div></div><div className="phone-home" /></div></div>
}

function Upcoming() {
  const { t } = useSettings()
  return <section className="section upcoming-section" id="upcoming" aria-labelledby="upcoming-title"><div className="container"><div className="section-heading reveal"><div><p className="eyebrow">05 / {t('THE NEXT CHAPTER', 'СЛЕДУЮЩАЯ ГЛАВА')}</p><h2 id="upcoming-title">{t("What's next for AiS.", 'Что дальше у AiS.')}</h2></div><p>{t('The ecosystem keeps evolving. Our next products are being built, with the same connected platform at their core.', 'Экосистема развивается. Мы создаём новые продукты на базе той же единой платформы.')}</p></div><div className="upcoming-grid"><article className="upcoming-ai upcoming-card reveal" id="ais-ai"><div className="upcoming-card-copy"><Status upcoming /><p className="eyebrow">{t('OUR OWN AI PROJECT', 'СОБСТВЕННЫЙ AI-ПРОЕКТ')}</p><h3>AiS AI</h3><p>{t('Our own AI, currently in development and training.', 'Собственный AI от AiS, который сейчас находится в разработке и обучении.')}</p><p className="upcoming-detail">{t('Developed and trained by AiS as a separate project within our ecosystem. Public production access is not available yet.', 'Разрабатывается и обучается AiS как отдельный проект внутри нашей экосистемы. Публичный доступ пока не открыт.')}</p><span className="development-note"><span aria-hidden="true" />{t('In development · Training in progress', 'В разработке · Идёт обучение')}</span></div><IntelligenceCore /></article><article className="upcoming-mobile upcoming-card reveal" id="ais-mobile"><div className="upcoming-card-copy"><Status upcoming /><p className="eyebrow">{t('NATIVE ANDROID CLIENT', 'НАТИВНЫЙ КЛИЕНТ ДЛЯ ANDROID')}</p><h3>AiS Mobile</h3><p>{t('AiS Mobile for Android — coming soon.', 'AiS Mobile для Android — скоро.')}</p><p className="upcoming-detail">{t('Access AiS anywhere with the upcoming native Android app, currently in development.', 'Используйте AiS где угодно с будущим нативным приложением для Android, которое сейчас находится в разработке.')}</p><span className="development-note">Android · {t('In development', 'В разработке')}</span></div><MobilePreview /></article></div></div></section>
}

function TelegramSection() {
  const { t } = useSettings()
  return <section className="section telegram-section" id="in-action" aria-labelledby="telegram-title"><div className="container telegram-grid"><div className="section-copy reveal"><p className="eyebrow">06 / Telegram</p><h2 id="telegram-title">{t('A familiar interface.', 'Привычный интерфейс.')}<br /><span>{t('The same AiS.', 'Тот же AiS.')}</span></h2><p>{t('AiSCloudBot brings the AiS platform into Telegram. Select an available model, ask a question and keep the conversation where you already communicate.', 'AiSCloudBot открывает доступ к платформе AiS в Telegram. Выбирайте доступную модель, задавайте вопросы и общайтесь там, где уже привыкли.')}</p><p>{t('Telegram is one client of AiS — alongside web chat and developer applications.', 'Telegram — один из клиентов AiS наряду с веб-чатом и приложениями разработчиков.')}</p><a className="button button-secondary" href={TELEGRAM_BOT_URL || '#in-action'} {...(TELEGRAM_BOT_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{t('Open @AiSCloudBot', 'Открыть @AiSCloudBot')}<Arrow diagonal /></a></div><div className="telegram-evidence reveal"><div className="panel-bar"><span><ProductIcon kind="telegram" /> Telegram / AiSCloudBot</span><Status /></div><div className="telegram-concept"><span className="telegram-concept-avatar" aria-hidden="true">A</span><div><strong>AiSCloudBot</strong><p>{t('Illustrative product preview. Connect your own Telegram bot URL in the environment.', 'Иллюстрация продукта. Укажите адрес своего Telegram-бота в переменных окружения.')}</p><span className="message-path"><span>Telegram</span><Arrow /><span>AiS API</span><Arrow /><span>{t('Model', 'Модель')}</span></span></div></div></div></div></section>
}

function About() {
  const { t } = useSettings()
  return <section className="section about-section" id="about" aria-labelledby="about-title"><div className="container about-grid reveal" id="why-ais"><div><p className="eyebrow">07 / {t('ABOUT AiS', 'ОБ AiS')}</p><h2 id="about-title">{t('Built in Uzbekistan.', 'Создано в Узбекистане.')}<br /><span>{t('Built to connect.', 'Создано объединять.')}</span></h2></div><div className="about-copy"><p>{t('AiS Uzbekistan is building a multi-model AI platform for people, developers and applications. Our work connects user interfaces, a unified API and model infrastructure in one ecosystem.', 'AiS Uzbekistan создаёт мультимодельную AI-платформу для людей, разработчиков и приложений. Мы объединяем пользовательские интерфейсы, единый API и инфраструктуру моделей в одной экосистеме.')}</p><p>{t('Alongside access to third-party models, we are developing and training our own AI project, AiS AI. AiS Mobile for Android is also in development.', 'Наряду с доступом к сторонним моделям мы разрабатываем и обучаем собственный проект AiS AI. AiS Mobile для Android также находится в разработке.')}</p><p className="open-source-note">{t('AiS Chat is powered by open-source technologies including Open WebUI, connected to AiS infrastructure.', 'AiS Chat использует открытые технологии, включая Open WebUI, и подключён к инфраструктуре AiS.')}</p></div></div></section>
}

function GetStarted() {
  const { t } = useSettings()
  return <section className="get-started" id="try-ais"><div className="container get-started-inner reveal"><div><p className="eyebrow">{t('YOUR NEXT IDEA STARTS HERE', 'ВАША СЛЕДУЮЩАЯ ИДЕЯ НАЧИНАЕТСЯ ЗДЕСЬ')}</p><h2>{t('Make it with AiS.', 'Создавайте с AiS.')}</h2></div><div className="hero-actions"><a className="button button-primary" href={CHAT_ENTRY_URL || '#chat'} {...(CHAT_ENTRY_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{t('Open AiS Chat', 'Открыть AiS Chat')}<Arrow diagonal /></a><a className="button button-secondary" href="#api">{t('Build with the API', 'Разрабатывать с API')}<Arrow /></a></div></div></section>
}

function Footer() {
  const { t } = useSettings()
  return <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Logo /><p>{t('One platform. Multiple AI models.', 'Одна платформа. Множество AI-моделей.')}</p>{SUPPORT_EMAIL && <a className="footer-contact" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL} <Arrow diagonal /></a>}</div><div className="footer-column"><h3>{t('Products', 'Продукты')}</h3><a href={CHAT_ENTRY_URL || '#chat'} {...(CHAT_ENTRY_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>AiS Chat <Arrow diagonal /></a><a href={API_URL_CONFIGURED ? API_BASE_URL : '#api'} {...(API_URL_CONFIGURED && API_BASE_URL.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>AiS API <Arrow diagonal /></a><a href={TELEGRAM_BOT_URL || '#in-action'} {...(TELEGRAM_BOT_URL ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>Telegram <Arrow diagonal /></a><a href="#ais-ai">AiS AI <span>{t('Soon', 'Скоро')}</span></a><a href="#ais-mobile">AiS Mobile <span>{t('Soon', 'Скоро')}</span></a></div><div className="footer-column"><h3>{t('Developers', 'Разработчикам')}</h3><a href="#api">{t('API overview', 'Обзор API')}</a><a href="#compatibility">{t('OpenAI compatibility', 'Совместимость с OpenAI')}</a><a href="#models">{t('Models & infrastructure', 'Модели и инфраструктура')}</a><a href="#developers">{t('Build with AiS', 'Разработка с AiS')}</a></div><div className="footer-column"><h3>AiS Uzbekistan</h3><a href="#about">{t('About the platform', 'О платформе')}</a><a href="#ecosystem">{t('Ecosystem', 'Экосистема')}</a><a href="#upcoming">{t("What's next", 'Что дальше')}</a><span className="footer-location">{t('Uzbekistan → the world', 'Узбекистан → весь мир')}</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} AiS Uzbekistan</span><span>{t('Model availability may change. Upcoming products are in development.', 'Доступность моделей может меняться. Будущие продукты находятся в разработке.')}</span><a href="#top">{t('Back to top', 'Наверх')} ↑</a></div></footer>
}

function Page() {
  const { t } = useSettings()
  useLayoutEffect(() => {
    // Fragment targets exist only after React mounts the page.
    const initialHash = window.location.hash
    let targetId: string
    try { targetId = decodeURIComponent(initialHash.slice(1)) } catch { return }
    const target = targetId ? document.getElementById(targetId) : null
    if (!target) return
    let cancelled = false
    let frame = 0
    const restorePosition = () => {
      if (!cancelled && window.location.hash === initialHash) target.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    restorePosition()
    // Fonts can change the height of every section above the target.
    const restoreAfterLoad = () => {
      void document.fonts.ready.then(() => {
        if (!cancelled) frame = window.requestAnimationFrame(restorePosition)
      })
    }
    if (document.readyState === 'complete') restoreAfterLoad()
    else window.addEventListener('load', restoreAfterLoad, { once: true })
    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener('load', restoreAfterLoad)
    }
  }, [])
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: 0.08 })
    elements.forEach(element => { element.classList.add('reveal-ready'); observer.observe(element) })
    const ambient = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('motion-paused', !entry.isIntersecting)), { rootMargin: '80px' })
    document.querySelectorAll('.architecture, .intelligence-core, .mobile-preview, .hero-atmosphere').forEach(element => ambient.observe(element))
    return () => { observer.disconnect(); ambient.disconnect() }
  }, [])
  return <div id="top"><a className="skip-link" href="#main">{t('Skip to content', 'Перейти к содержимому')}</a><Header /><main id="main" tabIndex={-1}><Hero /><Ecosystem /><ChatSection /><ApiSection /><Models /><Upcoming /><TelegramSection /><About /><GetStarted /></main><Footer /></div>
}

export default function App() { return <SettingsProvider><Page /></SettingsProvider> }
