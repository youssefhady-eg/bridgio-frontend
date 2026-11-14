import { Link, useRouterState } from '@tanstack/react-router'
import { AppIcon } from '~/components/AppIcon'
import { hrefWithLang } from '~/shell/lang'
import { usePreviewRole } from '~/shell/usePreviewRole'
import type { Theme } from '~/shell/theme-state'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Slim utility header — refinement branch.
 *
 * The header no longer carries the primary navigation (that is the sidebar's
 * job). It holds only utility controls: the menu button (phone only), the
 * brand, the language toggle, the messages trigger and the account area.
 *
 * Three brand size states are unchanged (see app.css), one DOM, media queries:
 *  - ≥ 1024 px : large header — adopted wordmark, maroon fill, 136 px
 *    (the 200 px colour lockup is no longer rendered in the header; the asset
 *    stays in the repo for large/cover use)
 *   768–1023 : light small header — adopted wordmark, maroon fill, 148 px
 *   <768 px  : dark band — adopted wordmark, cream fill, 136 px
 *
 * No component here fetches data; the account area is a labelled placeholder
 * only, and every label comes from the central strings.
 */

interface AppHeaderProps {
  onOpenSidebar: () => void
  onOpenChat: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function AppHeader({
  onOpenSidebar,
  onOpenChat,
  theme,
  onToggleTheme,
}: AppHeaderProps) {
  const { pathname, href } = useRouterState({ select: (state) => state.location })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  const lang = useLang()
  const role = usePreviewRole()
  const strings = useStrings()
  const nextLang = lang === 'en' ? 'ar' : 'en'

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <button
          type="button"
          className="app-header__menu"
          onClick={onOpenSidebar}
          aria-label={strings.header.menuLabel}
        >
          <AppIcon name="menu" size={22} />
        </button>

        {/* The brand links to the shell home, keeping the preview role and the
            language in the query so `/` redirects to the same role home. */}
        <Link
          to="/"
          search={{ as: role, lang }}
          className="app-header__brand"
        >
          {/* Adopted wordmark — fills baked in the files, never recoloured.
              One of the two is visible per breakpoint/theme (see app.css). */}
          <img
            className="app-header__wordmark app-header__wordmark--cream"
            src="/brand/wordmark-cream.svg"
            alt={strings.header.wordmarkAlt}
            width={136}
            height={49}
            decoding="async"
          />
          <img
            className="app-header__wordmark app-header__wordmark--maroon"
            src="/brand/wordmark-maroon.svg"
            alt={strings.header.wordmarkAlt}
            width={148}
            height={53}
            decoding="async"
          />
        </Link>

        <div
          className="app-header__utilities"
          role="group"
          aria-label={strings.header.utilityLabel}
        >
          <a
            className="app-utility__button app-utility__button--lang"
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
            className="app-utility__button app-utility__button--theme"
            onClick={onToggleTheme}
            aria-label={`${strings.header.themeLabel}: ${
              theme === 'dark'
                ? strings.header.themeToLight
                : strings.header.themeToDark
            }`}
            title={
              theme === 'dark'
                ? strings.header.themeToLight
                : strings.header.themeToDark
            }
          >
            <AppIcon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
          </button>

          <button
            type="button"
            className="app-utility__button"
            onClick={onOpenChat}
            aria-label={strings.header.assistantOpenLabel}
          >
            <AppIcon name="chat" size={20} />
            <span className="app-utility__label">
              {strings.header.assistantLabel}
            </span>
          </button>

          <Link
            to="/profile"
            search={{ as: role, lang }}
            className="app-utility__button app-utility__button--account"
            aria-label={strings.header.accountLabel}
            preload={false}
          >
            <AppIcon name="user" size={20} />
            <span className="app-utility__label">
              {strings.header.accountLabel}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
