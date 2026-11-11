import type { ReactNode } from 'react'

/**
 * Page header shared by the frontend-finish screens: an eyebrow badge, the page
 * heading, an optional lead and an optional footer slot (greeting, session line
 * or actions). It reuses the teacher-dashboard hero classes so every page keeps
 * one heading rhythm. Copy is always passed in from the central string file.
 */
export function PageHero({
  badge,
  title,
  lead,
  footer,
}: {
  badge: string
  title: string
  lead?: string
  footer?: ReactNode
}) {
  return (
    <header className="dashboard__hero">
      <p className="app-shell__badge">{badge}</p>
      <h1>{title}</h1>
      {lead ? <p className="dashboard__lead">{lead}</p> : null}
      {footer ?? null}
    </header>
  )
}
