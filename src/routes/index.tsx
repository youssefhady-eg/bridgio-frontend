import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { adapterInfoQueryOptions } from '~/api/queries'
import { ar, en } from '~/content/strings'

export const Route = createFileRoute('/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(adapterInfoQueryOptions()),
  component: StageZeroStatus,
})

const strings = ar.stage0

/**
 * Stage 0 diagnostic page only.
 * This is NOT a product screen: no dashboard, builder, player, nav or brand shell.
 */
function StageZeroStatus() {
  const { data, isPending, isError } = useQuery(adapterInfoQueryOptions())

  return (
    <main className="stage0">
      <p className="stage0__badge">{strings.badge}</p>
      <h1>{strings.title}</h1>
      <p className="stage0__lead">{strings.lead}</p>

      <section className="stage0__card" aria-labelledby="adapter-status-heading">
        <h2 id="adapter-status-heading">{strings.adapterHeading}</h2>
        {isPending ? <p>{strings.loading}</p> : null}
        {isError ? <p role="alert">{strings.error}</p> : null}
        {data ? (
          <dl>
            <div>
              <dt>{strings.mode}</dt>
              <dd>
                {data.mode === 'mock' ? strings.mock : strings.http}
              </dd>
            </div>
            <div>
              <dt>{strings.contractVersion}</dt>
              <dd>
                <code dir="ltr">{data.contractVersion}</code>
              </dd>
            </div>
            <div>
              <dt>{strings.scenario}</dt>
              <dd>
                {data.mockScenario === 'empty'
                  ? strings.empty
                  : data.mockScenario === 'seeded'
                    ? strings.seeded
                    : '—'}
              </dd>
            </div>
            <div>
              <dt>{strings.endpointStatus}</dt>
              <dd>{strings.proposed}</dd>
            </div>
          </dl>
        ) : null}
      </section>

      <section aria-labelledby="not-built-heading">
        <h2 id="not-built-heading">{strings.notBuiltHeading}</h2>
        <ul>
          {strings.notBuilt.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <footer className="stage0__footer">
        <p>{strings.noConnection}</p>
        <p>
          <code dir="ltr">{strings.docsHint}</code>
        </p>
        <p className="stage0__footer-en" lang="en" dir="ltr">
          {en.stage0.footer}
        </p>
      </footer>
    </main>
  )
}
