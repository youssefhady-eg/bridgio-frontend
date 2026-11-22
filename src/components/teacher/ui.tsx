import { useEffect, useRef, type ReactNode } from 'react'
import { formatPercent } from '~/components/dashboard/format'
import { useLang } from '~/shell/useStrings'
import { masteryTone } from './tones'

/**
 * Shared primitives for the Part 2 teacher views.
 *
 * Markup mirrors docs/gemini-demo.html §3 (`br-panel`, `br-kpi`, `br-status`,
 * `br-bar-*`, `br-page-head`). Class names are `tv-` prefixed and live in
 * src/styles/teacher-views.css. These components hold no data logic: every
 * number arrives already computed by the adapter.
 */

export function PageHead({
  title,
  children,
}: {
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="tv-page-head">
      <h1 className="tv-page-title">{title}</h1>
      {children ? <div className="tv-page-actions">{children}</div> : null}
    </div>
  )
}

export function Panel({
  children,
  labelledBy,
}: {
  children: ReactNode
  labelledBy?: string
}) {
  return (
    <section className="tv-panel" aria-labelledby={labelledBy}>
      {children}
    </section>
  )
}

export function PanelHead({
  id,
  title,
  count,
  children,
}: {
  id?: string
  title: ReactNode
  count?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="tv-panel-head">
      <h2 className="tv-panel-title" id={id}>
        {title}
        {count !== undefined ? <span className="tv-count">{count}</span> : null}
      </h2>
      {children}
    </div>
  )
}

export function Kpi({
  label,
  value,
  meta,
  metaTone,
}: {
  label: string
  value: ReactNode
  meta?: ReactNode
  metaTone?: 'success' | 'warning' | 'danger'
}) {
  return (
    <div className="tv-kpi">
      <span className="tv-kpi-label">{label}</span>
      <div className="tv-kpi-row">
        <span className="tv-kpi-value tv-num">{value}</span>
        {meta ? (
          <span className="tv-kpi-meta" data-tone={metaTone}>
            {meta}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function Status({
  tone,
  children,
}: {
  tone: 'success' | 'warning' | 'danger' | 'neutral'
  children: ReactNode
}) {
  return (
    <span className="tv-status" data-tone={tone === 'neutral' ? undefined : tone}>
      {children}
    </span>
  )
}

/**
 * Mastery bar with the exact value beside it. ARIA carries the number even when
 * the visible label is abbreviated, and the fill follows the inline direction in
 * RTL without a mirroring transform.
 */
export function MasteryBar({
  percent,
  label,
  valueText,
}: {
  percent: number
  label?: string
  valueText?: string
}) {
  const lang = useLang()
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="tv-bar-wrap">
      <div
        className="tv-bar-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-valuetext={valueText ?? formatPercent(clamped, lang)}
      >
        <div
          className="tv-bar-fill"
          data-tone={masteryTone(clamped)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="tv-num tv-cell-sub">{formatPercent(clamped, lang)}</span>
    </div>
  )
}

export function EmptyBox({
  title,
  body,
  tone = 'neutral',
}: {
  title: string
  body?: string
  tone?: 'neutral' | 'error'
}) {
  return (
    <div className="tv-empty" role={tone === 'error' ? 'alert' : 'status'}>
      <p className="tv-empty-title">{title}</p>
      {body ? <p className="tv-empty-body">{body}</p> : null}
    </div>
  )
}

export function LoadingNote({ children }: { children: ReactNode }) {
  return (
    <p className="tv-loading" role="status">
      {children}
    </p>
  )
}

/**
 * Right-side drawer. One overlay, Escape closes it, and the backdrop click
 * closes it too. Focus moves to the close button when it opens and returns to
 * the trigger when it closes, so the keyboard path never lands behind the
 * overlay.
 */
export function Drawer({
  title,
  subtitle,
  closeLabel,
  onClose,
  footer,
  children,
}: {
  title: string
  subtitle?: ReactNode
  closeLabel: string
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    closeRef.current?.focus()
    return () => opener?.focus()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="tv-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="tv-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tv-drawer-title"
      >
        <div className="tv-panel-head">
          <div>
            <h2 className="tv-panel-title" id="tv-drawer-title">
              {title}
            </h2>
            {subtitle ? <div className="tv-cell-sub">{subtitle}</div> : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            className="tv-btn tv-btn-ghost tv-btn-icon tv-btn-sm"
            onClick={onClose}
            aria-label={closeLabel}
          >
            ✕
          </button>
        </div>
        <div className="tv-drawer-body">{children}</div>
        {footer ? <div className="tv-drawer-foot">{footer}</div> : null}
      </div>
    </div>
  )
}