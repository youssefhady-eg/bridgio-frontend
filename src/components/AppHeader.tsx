import { Link, useRouterState } from '@tanstack/react-router'
import { ar } from '~/content/strings'
import { appRoles, hrefWithRole, navFor, type AppRole } from '~/shell/nav'
import { usePreviewRole } from '~/shell/usePreviewRole'

/**
 * App shell header — Stage 1.
 *
 * Three size states, one DOM (see app.css):
 *   ≥1024 px : full colour lockup (public/brand/logo-colour.svg, min 200 px)
 *   768–1023 : light small header — adopted wordmark, maroon fill, ≥120 px
 *   <768 px  : dark band — adopted wordmark, cream fill, ≥120 px
 *
 * The role switch is diagnostic UI state (`?as=teacher|student`), NOT auth:
 * Mentingo owns auth, and no identity is displayed until its exact auth
 * method is confirmed. No component fetches data for the header — the shell
 * is data-free by design in Stage 1.
 */

const strings = ar.header

export function AppHeader() {
  const { pathname, href } = useRouterState({ select: (state) => state.location })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  const role: AppRole = usePreviewRole()

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          {/* Full colour lockup — large header only (min 200 px, LOCKED). */}
          <img
            className="app-header__lockup"
            src="/brand/logo-colour.svg"
            alt={strings.lockupAlt}
            width={200}
            height={89}
            decoding="async"
          />
          {/* Adopted wordmark — small header slots, ≥120 px, fills baked in. */}
          <img
            className="app-header__wordmark app-header__wordmark--cream"
            src="/brand/wordmark-cream.svg"
            alt={strings.wordmarkAlt}
            width={136}
            height={49}
            decoding="async"
          />
          <img
            className="app-header__wordmark app-header__wordmark--maroon"
            src="/brand/wordmark-maroon.svg"
            alt={strings.wordmarkAlt}
            width={148}
            height={53}
            decoding="async"
          />
        </div>

        <nav className="app-header__nav" aria-label={strings.navLabel}>
          {navFor(role).map((item) => {
            const active = pathname === item.to
            return (
              <Link
                key={item.id}
                to={item.to}
                search={{ as: role }}
                className={`app-nav__link${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                preload={false}
              >
                {ar.nav[item.id]}
              </Link>
            )
          })}
        </nav>

        <div className="app-header__roles" role="group" aria-label={strings.roleGroupAria}>
          <span className="app-roles__hint">{strings.roleHint}</span>
          {appRoles.map((candidate) => (
            <a
              key={candidate}
              href={hrefWithRole(pathname, searchStr, candidate)}
              className={`app-roles__link${candidate === role ? ' is-active' : ''}`}
              // `aria-current` is the valid ARIA for a link that marks the
              // active item in a set; `aria-pressed` is not allowed on links.
              aria-current={candidate === role ? 'true' : undefined}
            >
              {candidate === 'teacher' ? strings.roleTeacher : strings.roleStudent}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
