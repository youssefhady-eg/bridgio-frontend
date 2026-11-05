import { useRouterState } from '@tanstack/react-router'
import { AppIcon } from '~/components/AppIcon'
import { hrefWithLang } from '~/shell/lang'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Slim utility header — refinement branch.
 *
 * The header no longer carries the primary navigation (that is the sidebar's
 * job). It holds only utility controls: the menu button (phone only), the
 * brand, the language toggle, the messages trigger and the account area.
 *
 * Three brand size states are unchanged (see app.css), one DOM, media queries:
 *   ≥1024 px : full colour lockup (public/brand/logo-colour.svg, min 200 px)
 *   768–1023 : light small header — adopted wordmark, maroon fill, ≥120 px
 *   <768 px  : dark band — adopted wordmark, cream fill, ≥120 px
 *
 * No component here fetches data; auth is owned by Mentingo (method
 * unconfirmed), so the account area is a labelled placeholder only.
 */

interface AppHeaderProps {
  onOpenSidebar: () => void
  onOpenChat: () => void
}

export function AppHeader({ onOpenSidebar, onOpenChat }: AppHeaderProps) {
  const { pathname, href } = useRouterState({ select: (state) => state.location })
  const searchStr = href.slice(pathname.length).split('#')[0] ?? ''
  const lang = useLang()
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

        <div className="app-header__brand">
          {/* Full colour lockup — large header only (min 200 px, LOCKED). */}
          <img
            className="app-header__lockup"
            src="/brand/logo-colour.svg"
            alt={strings.header.lockupAlt}
            width={200}
            height={89}
            decoding="async"
          />
          {/* Adopted wordmark — small header slots, ≥120 px, fills baked in. */}
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
        </div>

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
            title={strings.header.langLabel}
          >
            <AppIcon name="globe" size={18} />
            <span className="app-utility__label">
              {nextLang === 'en'
                ? strings.header.langToEnglish
                : strings.header.langToArabic}
            </span>
          </a>

          <button
            type="button"
            className="app-utility__button"
            onClick={onOpenChat}
            aria-label={strings.header.assistantOpenLabel}
          >
            <AppIcon name="chat" size={18} />
            <span className="app-utility__label">
              {strings.header.assistantLabel}
            </span>
          </button>

          <button
            type="button"
            className="app-utility__button app-utility__button--account"
            disabled
            aria-label={strings.header.accountLabel}
            title={strings.header.accountNote}
          >
            <AppIcon name="user" size={18} />
            <span className="app-utility__label">
              {strings.header.accountLabel}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
