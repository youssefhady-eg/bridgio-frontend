import { Link } from '@tanstack/react-router'
import { PageHero } from '~/components/shared/PageHero'
import { defaultRoleForPath } from '~/shell/nav'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Help and guide — a static map of the screens built in this build plus the
 * honest limits. It links to every finished screen so the build can be checked
 * from one place. No data is fetched and no behaviour is claimed beyond what
 * the screens actually do.
 */
const links = [
  { id: 'dashboard', to: '/teacher/dashboard' },
  { id: 'classes', to: '/teacher/classes' },
  { id: 'students', to: '/teacher/students' },
  { id: 'tests', to: '/teacher/tests' },
  { id: 'lessons', to: '/student/lessons' },
  { id: 'progress', to: '/student/progress' },
  { id: 'profile', to: '/profile' },
  { id: 'signIn', to: '/sign-in' },
] as const

export function HelpView() {
  const strings = useStrings()
  const copy = strings.help
  const lang = useLang()

  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <section className="dashboard__section">
        <h2>{copy.screensHeading}</h2>
        <p className="section-lead">{copy.screensLead}</p>
        <ul className="app-list app-list--links">
          {links.map((link) => (
            <li key={link.id}>
              <Link
                to={link.to}
                search={{ as: defaultRoleForPath(link.to), lang }}
                className="screen-link"
                preload={false}
              >
                {copy.links[link.id]}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="dashboard__section">
        <h2>{copy.limitsHeading}</h2>
        <ul className="app-list">
          {copy.limits.map((limit, index) => (
            <li key={index}>{limit}</li>
          ))}
        </ul>
      </section>

      <section className="dashboard__section">
        <h2>{copy.sessionHeading}</h2>
        <p className="section-lead">{copy.sessionBody}</p>
      </section>
    </div>
  )
}