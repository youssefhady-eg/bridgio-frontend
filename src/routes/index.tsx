import { createFileRoute } from '@tanstack/react-router'
import { ar, en } from '~/content/strings'
import { studentNav, teacherNav } from '~/shell/nav'

export const Route = createFileRoute('/')({
  component: ShellHome,
})

const strings = ar.shell.home

/**
 * Stage 1 shell overview — what the shell contains, and what is explicitly
 * NOT built yet. This is not a product screen and must not look like one.
 */
function ShellHome() {
  return (
    <div className="app-shell">
      <p className="app-shell__badge">{strings.badge}</p>
      <h1 className="app-shell__hero">{strings.title}</h1>
      <p className="app-shell__lead">{strings.lead}</p>

      <section className="app-shell__section" aria-labelledby="shell-built-heading">
        <div className="app-card">
          <h2 id="shell-built-heading">{strings.builtHeading}</h2>
          <ul className="app-list">
            {strings.built.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="app-shell__section" aria-labelledby="shell-notbuilt-heading">
        <div className="app-card">
          <h2 id="shell-notbuilt-heading">{strings.notBuiltHeading}</h2>
          <p className="placeholder__lead">{strings.notBuiltLead}</p>
          <ul className="app-list app-list--links">
            {[...teacherNav, ...studentNav].map((item) => (
              <li key={item.id}>
                <a className="screen-link" href={item.to}>
                  {ar.nav[item.id]}
                </a>
                <span className="screen-meta">
                  {ar.placeholder.builtByScreen[item.id]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="app-shell__section" aria-labelledby="shell-role-note">
        <div className="app-card">
          <p>
            {ar.shell.roleHint}{' '}
            <code className="app-code">{ar.shell.codeHint}</code>
          </p>
          <p className="screen-meta" lang="en" dir="ltr">
            {en.shell.footerEn}
          </p>
        </div>
      </section>
    </div>
  )
}
