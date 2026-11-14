import { useQuery } from '@tanstack/react-query'
import { useRouterState } from '@tanstack/react-router'
import { sessionQueryOptions } from '~/api/queries'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { MetaList } from '~/components/shared/MetaList'
import { PageHero } from '~/components/shared/PageHero'
import { hrefWithLang } from '~/shell/lang'
import { useTheme } from '~/shell/useTheme'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Profile and settings — session display plus the two real UI settings
 * (language and colour theme).
 *
 * Account data is owned by Mentingo, so there is no edit form here: the screen
 * shows the current session and states that the data comes from the session.
 * The language and theme controls are the same settings as the header, so the
 * choices stay consistent across screens.
 */
export function ProfileView() {
  const strings = useStrings()
  const copy = strings.profile
  const lang = useLang()
  const { theme, toggle } = useTheme()
  const { pathname, href } = useRouterState({ select: (state) => state.location })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  const nextLang = lang === 'en' ? 'ar' : 'en'

  const sessionQuery = useQuery(sessionQueryOptions())

  if (sessionQuery.isPending) {
    return (
      <Frame>
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      </Frame>
    )
  }

  if (sessionQuery.isError) {
    return (
      <Frame>
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  const session = sessionQuery.data

  return (
    <Frame>
      {!session ? (
        <EmptyNote icon="alert" title={copy.noSession} body={copy.accountNote} />
      ) : (
        <section className="dashboard__section">
          <h2>{copy.sessionHeading}</h2>
          <MetaList
            items={[
              { label: copy.sessionName, value: session.user.displayName },
              {
                label: copy.sessionRole,
                value: copy.roles[session.user.role],
              },
              { label: copy.sessionEmail, value: session.user.email },
            ]}
          />
          <p className="field__hint">{copy.accountNote}</p>
        </section>
      )}

      <section className="dashboard__section">
        <h2>{copy.settingsHeading}</h2>
        <MetaList
          items={[
            {
              label: copy.languageLabel,
              value: (
                <a
                  className="screen-link"
                  href={hrefWithLang(pathname, searchStr, nextLang)}
                  lang={nextLang}
                  hrefLang={nextLang}
                >
                  {nextLang === 'en'
                    ? strings.header.langToEnglish
                    : strings.header.langToArabic}
                </a>
              ),
            },
            {
              label: copy.themeLabel,
              value: (
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={toggle}
                >
                  {theme === 'dark' ? copy.themeLight : copy.themeDark}
                </button>
              ),
            },
          ]}
        />
      </section>
    </Frame>
  )
}

function Frame({ children }: { children: React.ReactNode }) {
  const copy = useStrings().profile
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}