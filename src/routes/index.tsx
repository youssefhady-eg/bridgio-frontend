import { createFileRoute, redirect } from '@tanstack/react-router'
import { parentNav, studentNav, teacherNav } from '~/shell/nav'
import { useStrings } from '~/shell/useStrings'

export const Route = createFileRoute('/')({
  /**
   * Teacher lands on the Stage 2 dashboard; the parent preview lands on the
   * read-only child progress screen. The student and assistant previews keep
   * the shell overview.
   */
  beforeLoad: ({ search }) => {
    // No `?as` means the default teacher role, as before.
    if (search.as === undefined || search.as === 'teacher') {
      throw redirect({
        to: '/teacher/dashboard',
        search: { as: 'teacher', lang: search.lang },
      })
    }
    if (search.as === 'parent') {
      throw redirect({
        to: '/parent/progress',
        search: { as: 'parent', lang: search.lang },
      })
    }
    if (search.as === 'assistant') {
      throw redirect({
        to: '/assistant',
        search: { as: 'assistant', lang: search.lang },
      })
    }
  },
  component: ShellHome,
})

/**
 * Stage 1 shell overview — what the shell contains, and what is explicitly
 * NOT built yet. This is not a product screen and must not look like one.
 */
function ShellHome() {
  const strings = useStrings()
  const home = strings.shell.home
  const navItems = [...teacherNav, ...studentNav, ...parentNav]

  return (
    <div className="app-shell">
      <p className="app-shell__badge">{home.badge}</p>
      <h1 className="app-shell__hero">{home.title}</h1>
      <p className="app-shell__lead">{home.lead}</p>

      <section className="app-shell__section" aria-labelledby="shell-built-heading">
        <div className="app-card">
          <h2 id="shell-built-heading">{home.builtHeading}</h2>
          <ul className="app-list">
            {home.built.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="app-shell__section" aria-labelledby="shell-notbuilt-heading">
        <div className="app-card">
          <h2 id="shell-notbuilt-heading">{home.notBuiltHeading}</h2>
          <p className="placeholder__lead">{home.notBuiltLead}</p>
          <ul className="app-list app-list--links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a className="screen-link" href={item.to}>
                  {strings.nav[item.id]}
                </a>
                <span className="screen-meta">
                  {strings.placeholder.builtByScreen[item.id]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="app-shell__section" aria-labelledby="shell-role-note">
        <div className="app-card">
          <p>
            {strings.shell.roleHint}{' '}
            <code className="app-code">{strings.shell.codeHint}</code>
          </p>
          <p className="screen-meta" lang="en" dir="ltr">
            {strings.footer.noteEn}
          </p>
        </div>
      </section>
    </div>
  )
}
