import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { sessionQueryOptions } from '~/api/queries'
import { dashboardLinkLabel } from '~/content/roles'
import type { HelpLinkId } from '~/content/strings'
import { PageHero } from '~/components/shared/PageHero'
import { linkRoutes, linkSearchRole } from '~/shell/help-links'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Guide — a numbered walkthrough for the current role only.
 *
 * Teacher, parent and assistant run in formal (MSA) Arabic; the student
 * walkthrough is Egyptian casual. Because the page shows one role, the two
 * registers never mix inside a page. The role comes from the same source as the
 * sidebar nav. The session is read only to name the teacher dashboard in the
 * teacher walkthrough (gendered when signed in, neutral otherwise).
 */
export function GuideView() {
  const strings = useStrings()
  const copy = strings.guide
  const lang = useLang()
  const role = usePreviewRole()
  const walkthrough = copy[role]

  const sessionQuery = useQuery(sessionQueryOptions())
  const sessionUser = sessionQuery.data?.user ?? null

  // Female / neutral teacher name when signed in, neutral dashboard name with
  // no session.
  const dashboard = dashboardLinkLabel(sessionUser, strings.dashboard)
  const withDashboard = (text: string) => text.replace('{dashboard}', dashboard)

  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <section className="guide" aria-labelledby="guide-heading">
        <header className="guide__head">
          <p className="guide__role">{strings.profile.roles[role]}</p>
          <h2 id="guide-heading">{walkthrough.title}</h2>
          <p className="section-lead">{walkthrough.lead}</p>
        </header>

        <ol className="guide__steps" aria-label={copy.stepsLabel}>
          {walkthrough.steps.map((step, index) => {
            // The copy side is widened to `string` (see `Strings`), so the id is
            // named as a `HelpLinkId` before the exhaustive route map is read.
            const link = step.link as HelpLinkId
            const to = linkRoutes[link]
            return (
              <li className="guide__step" key={step.title}>
                <span className="guide__marker" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="guide__body">
                  <h3>{withDashboard(step.title)}</h3>
                  <p>{withDashboard(step.body)}</p>
                  <Link
                    to={to}
                    search={{ as: linkSearchRole(to, role), lang }}
                    className="guide__link"
                    preload={false}
                  >
                    <span>{copy.open}</span>
                    <span className="guide__link-target">
                      {link === 'teacherDashboard'
                        ? dashboard
                        : strings.help.links[link]}
                    </span>
                  </Link>
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}