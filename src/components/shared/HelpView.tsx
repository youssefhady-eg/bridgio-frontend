import { Link } from '@tanstack/react-router'
import type { HelpCategory, HelpLinkId } from '~/content/strings'
import { PageHero } from '~/components/shared/PageHero'
import { linkRoutes, linkSearchRole } from '~/shell/help-links'
import { usePreviewRole } from '~/shell/usePreviewRole'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Help Center — a role-scoped reference library.
 *
 * The index lists the categories in scope for the current role — Getting
 * started, the role's own category, Account & settings and FAQ — and each
 * article is one task with short numbered steps and a link into the real
 * screen. The role comes from the same source as the sidebar nav
 * (`usePreviewRole`: the `?as` preview parameter, else the route area). No data
 * is fetched and no behaviour is claimed beyond what the screens do.
 */

export function HelpView() {
  const strings = useStrings()
  const copy = strings.help
  const lang = useLang()
  const role = usePreviewRole()

  // Getting started, the current role's category, Account & settings, then FAQ.
  const scopedCategories: HelpCategory[] = [
    'gettingStarted',
    role,
    'account',
    'faq',
  ]

  const articles = Object.entries(copy.articles).map(([id, article]) => ({
    id,
    ...article,
  }))

  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />

      <div className="help-layout">
        <nav className="help-index" aria-labelledby="help-index-heading">
          <h2 id="help-index-heading">{copy.indexHeading}</h2>
          <ul className="help-index__list">
            {scopedCategories.map((category) => {
              const inCategory = articles.filter(
                (article) => article.category === category,
              )
              return (
                <li key={category}>
                  <a
                    className="help-index__category"
                    href={`#help-cat-${category}`}
                  >
                    {copy.categories[category]}
                  </a>
                  {inCategory.length > 0 ? (
                    <ul className="help-index__articles">
                      {inCategory.map((article) => (
                        <li key={article.id}>
                          <a href={`#help-${article.id}`}>{article.title}</a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="help-articles">
          {scopedCategories.map((category) => {
            const inCategory = articles.filter(
              (article) => article.category === category,
            )
            if (category === 'faq') {
              return (
                <section
                  key={category}
                  id="help-cat-faq"
                  className="help-category"
                  aria-labelledby="help-faq-heading"
                >
                  <h2 id="help-faq-heading">{copy.categories.faq}</h2>
                  <dl className="help-faq">
                    {copy.faq.map((item) => (
                      <div className="help-faq__item" key={item.question}>
                        <dt>{item.question}</dt>
                        <dd>{item.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )
            }
            return (
              <section
                key={category}
                id={`help-cat-${category}`}
                className="help-category"
                aria-labelledby={`help-cat-${category}-heading`}
              >
                <h2 id={`help-cat-${category}-heading`}>
                  {copy.categories[category]}
                </h2>
                {inCategory.map((article) => {
                  // The copy side is widened to `string` (see `Strings`), so the
                  // id is named as a `HelpLinkId` before the route map is read.
                  const link = article.link as HelpLinkId | undefined
                  const to = link ? linkRoutes[link] : undefined
                  return (
                    <article
                      key={article.id}
                      id={`help-${article.id}`}
                      className="help-article"
                    >
                      <h3>{article.title}</h3>
                      <p className="help-article__body">{article.body}</p>
                      <h4 className="help-article__steps-label">
                        {copy.stepsLabel}
                      </h4>
                      <ol className="help-article__steps">
                        {article.steps.map((step, index) => (
                          <li key={`${article.id}-${index}`}>{step}</li>
                        ))}
                      </ol>
                      {link && to ? (
                        <Link
                          to={to}
                          search={{ as: linkSearchRole(to, role), lang }}
                          className="help-article__link"
                          preload={false}
                        >
                          <span>{copy.open}</span>
                          <span className="help-article__link-target">
                            {copy.links[link]}
                          </span>
                        </Link>
                      ) : null}
                    </article>
                  )
                })}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}