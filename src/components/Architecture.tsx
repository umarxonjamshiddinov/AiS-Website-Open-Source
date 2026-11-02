import { useId } from 'react'
import { useSettings } from '../settings'

type ArchitectureProps = { compact?: boolean }

/** An illustrative product map. Animated paths are decorative, never telemetry. */
export default function Architecture({ compact = false }: ArchitectureProps) {
  const { t } = useSettings()
  const id = useId().replace(/:/g, '')
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const gridId = `${id}-grid`
  const glowId = `${id}-glow`
  const coreId = `${id}-core`
  const ingressPath = 'M104 94V118H280V136M280 94V136M456 94V118H280'
  const providerPath = 'M280 280V303H456V334M280 280V334'

  return <figure className={`architecture architecture-${compact ? 'compact' : 'expanded'}`}>
    <svg
      className="architecture-svg"
      viewBox={`0 0 560 ${compact ? 448 : 520}`}
      fill="none"
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <title id={titleId}>{t('How the AiS ecosystem connects', 'Как устроена экосистема AiS')}</title>
      <desc id={descriptionId}>{t(
        'Conceptual architecture: AiS Chat, Telegram and applications connect to AiS Platform through AiS API and the Model Router. Third-party providers are separate from AiS AI, our own AI project. AiS AI is coming soon and in training, with a dashed future connection and no production traffic. AiS Mobile for Android is also coming soon. Decorative animation is not live activity data.',
        'Концептуальная архитектура: AiS Chat, Telegram и приложения подключаются к платформе AiS через AiS API и маршрутизатор моделей. Сторонние провайдеры отделены от AiS AI — собственного AI-проекта AiS. AiS AI скоро появится и сейчас обучается: пунктир показывает будущее подключение, а не обработку реального трафика. AiS Mobile для Android тоже скоро появится. Декоративная анимация не отображает реальные данные активности.',
      )}</desc>
      <defs>
        <pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle className="diagram-grid-dot" cx="1" cy="1" r=".7" />
        </pattern>
        <radialGradient id={coreId}>
          <stop offset="0" stopColor="currentColor" stopOpacity=".18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect className="diagram-grid" x="12" y="12" width="536" height={compact ? 424 : 496} fill={`url(#${gridId})`} />
      <path className="diagram-frame" d={`M16 30V16H30M530 16H544V30M16 ${compact ? 418 : 490}v14h14M530 ${compact ? 432 : 504}h14v-14`} />

      <path className="flow-line" d={ingressPath} />
      <path className="flow-pulse" d={ingressPath} />
      <path className="flow-line" d={providerPath} />
      <path className="flow-pulse flow-pulse-2" d="M280 280V334" />
      <path className="flow-pulse flow-pulse-3" d="M280 280V303H456V334" />
      <path className="future-link" d="M280 303H104V334" />

      {!compact && <path className="future-link mobile-future-link" d="M196 470H22V208H170" />}

      <g className="network-node ingress-node">
        <rect x="32" y="38" width="144" height="56" rx="10" />
        <path className="diagram-icon" d="M49 56h20v14H58l-5 4v-4h-4V56Z" />
        <text className="diagram-label" x="81" y="70">AiS Chat</text>
      </g>
      <g className="network-node ingress-node">
        <rect x="208" y="38" width="144" height="56" rx="10" />
        <path className="diagram-icon" d="m224 63 21-8-5 22-7-8-5 4v-8l17-10-12 14" />
        <text className="diagram-label" x="256" y="70">Telegram</text>
      </g>
      <g className="network-node ingress-node">
        <rect x="384" y="38" width="144" height="56" rx="10" />
        <path className="diagram-icon" d="m404 57-5 7 5 7m12-14 5 7-5 7m-4-16-4 18" />
        <text className="diagram-label" x="431" y="70">{t('Apps / SDKs', 'Прил. / SDK')}</text>
      </g>

      <circle className="diagram-junction" cx="280" cy="118" r="3" />
      <circle className="ais-core-glow" cx="280" cy="208" r="115" fill={`url(#${coreId})`} />
      <rect className="ais-core-halo" x="172" y="138" width="216" height="140" rx="17" filter={`url(#${glowId})`} />
      <g className="network-node ais-core">
        <rect x="170" y="136" width="220" height="144" rx="16" />
        <path className="core-corner" d="M187 163v-10h10m166 0h10v10M187 253v10h10m166 0h10v-10" />
        <text className="diagram-core-label" x="280" y="177" textAnchor="middle">AiS Platform</text>
        <text className="diagram-label-muted" x="280" y="196" textAnchor="middle">{t('One connected ecosystem', 'Единая экосистема')}</text>
        <g className="router-node">
          <rect x="193" y="211" width="174" height="48" rx="8" />
          <text className="diagram-label" x="280" y="231" textAnchor="middle">AiS API</text>
          <text className="diagram-label-muted" x="280" y="248" textAnchor="middle">{t('Model Router', 'Маршрутизатор моделей')}</text>
        </g>
      </g>

      <circle className="diagram-junction" cx="280" cy="303" r="3" />
      <text className="diagram-label-micro" x="371" y="323" textAnchor="middle">{t('MODEL ECOSYSTEM', 'ЭКОСИСТЕМА МОДЕЛЕЙ')}</text>
      <g className="network-node future-node">
        <rect x="32" y="334" width="144" height="93" rx="12" />
        <circle className="future-node-dot" cx="49" cy="354" r="3" />
        <text className="diagram-label-micro diagram-future-status" x="59" y="357">{t('COMING SOON', 'СКОРО')}</text>
        <text className="diagram-product-label" x="48" y="382">AiS AI</text>
        <text className="diagram-label-muted" x="48" y="400">{t('Our own AI · In training', 'Свой AI · Обучается')}</text>
        <text className="diagram-label-micro" x="48" y="416">{t('IN DEVELOPMENT', 'В РАЗРАБОТКЕ')}</text>
      </g>
      <g className="network-node provider-node">
        <rect x="208" y="334" width="144" height="93" rx="12" />
        <path className="diagram-provider-mark" d="m227 355 7-7 7 7-7 7-7-7Zm7 7v10" />
        <text className="diagram-product-label" x="224" y="387">AWS / Bedrock</text>
        <text className="diagram-label-muted" x="224" y="408">{t('Cloud provider', 'Облачный провайдер')}</text>
      </g>
      <g className="network-node provider-node">
        <rect x="384" y="334" width="144" height="93" rx="12" />
        <path className="diagram-provider-mark" d="M401 348h8v8h-8zm13 0h8v8h-8zm-13 13h8v8h-8zm13 0h8v8h-8z" />
        <text className="diagram-product-label" x="400" y="387">{t('Model families', 'Семейства моделей')}</text>
        <text className="diagram-label-muted" x="400" y="408">{t('Third-party models', 'Сторонние модели')}</text>
      </g>

      {!compact && <g className="network-node future-node mobile-future-node">
        <rect x="196" y="448" width="232" height="54" rx="10" />
        <path className="diagram-icon" d="M211 462h14v25h-14zm5 20h4" />
        <text className="diagram-label" x="236" y="468">AiS Mobile <tspan className="diagram-label-muted">· Android</tspan></text>
        <text className="diagram-label-micro diagram-future-status" x="236" y="487">{t('COMING SOON · IN DEVELOPMENT', 'СКОРО · В РАЗРАБОТКЕ')}</text>
      </g>}
    </svg>
    <div className="architecture-mobile-legend">
      <p className="architecture-mobile-route">{t('AiS Chat · Telegram · Apps → AiS API → Model Router', 'AiS Chat · Telegram · Приложения → AiS API → Маршрутизатор моделей')}</p>
      <p><strong>AiS AI</strong> <span>{t('Coming soon · Our own AI in development and training', 'Скоро · Собственный AI в разработке и обучении')}</span></p>
      {!compact && <p><strong>AiS Mobile · Android</strong> <span>{t('Coming soon · In development', 'Скоро · В разработке')}</span></p>}
    </div>
    <figcaption className="architecture-caption">
      <span className="architecture-legend"><i aria-hidden="true" />{t('Illustrative architecture', 'Концептуальная архитектура')}</span>
      <span>{t('Dashed paths: in development', 'Пунктир: в разработке')}</span>
    </figcaption>
  </figure>
}
