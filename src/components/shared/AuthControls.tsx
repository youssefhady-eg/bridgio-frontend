import { useRouterState } from '@tanstack/react-router'
import { AppIcon } from '~/components/AppIcon'
import { hrefWithLang } from '~/shell/lang'
import { useTheme } from '~/shell/useTheme'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Language and theme controls for the standalone account screens.
 *
 * These pages render outside the app shell, so they cannot borrow the header's
 * language link or the account menu's Theme row. Both controls are the same
 * mechanisms, not copies: the language link builds the URL with `hrefWithLang`,
 * and the theme switch reads the one shared `theme-state` store through
 * `useTheme`, so a change here and a change in the account menu always agree.
 */
export function AuthControls() {
  const { pathname, href } = useRouterState({
    select: (state) => state.location,
  })
  const strings = useStrings()
  const lang = useLang()
  const { theme, toggle } = useTheme()

  const nextLang = lang === 'en' ? 'ar' : 'en'
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''

  return (
    <div
      className="auth-controls"
      role="group"
      aria-label={strings.header.utilityLabel}
    >
      <a
        className="auth-controls__button auth-controls__button--lang"
        href={hrefWithLang(pathname, searchStr, nextLang)}
        lang={nextLang}
        hrefLang={nextLang}
        aria-label={`${strings.header.langLabel}: ${
          nextLang === 'en'
            ? strings.header.langToEnglish
            : strings.header.langToArabic
        }`}
        title={
          nextLang === 'en'
            ? strings.header.langToEnglish
            : strings.header.langToArabic
        }
      >
        <span className="app-utility__glyph" aria-hidden="true">
          {nextLang === 'en'
            ? strings.header.langGlyphEnglish
            : strings.header.langGlyphArabic}
        </span>
      </a>

      <button
        type="button"
        className="auth-controls__button auth-controls__button--theme"
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label={strings.header.themeLabel}
        onClick={toggle}
      >
        <AppIcon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
        <span className="auth-controls__label">{strings.header.themeLabel}</span>
        <span className="account-menu__switch" aria-hidden="true">
          <span className="account-menu__switch-thumb" />
        </span>
      </button>
    </div>
  )
}
