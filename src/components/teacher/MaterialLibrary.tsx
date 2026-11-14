import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Fragment, useState, type ReactNode } from 'react'
import { api } from '~/api'
import { isApiError } from '~/api/errors'
import { queryKeys } from '~/api/query-keys'
import {
  materialDetailQueryOptions,
  materialLibraryQueryOptions,
  sessionQueryOptions,
  type MaterialLibraryData,
} from '~/api/queries'
import type {
  ClassroomSummary,
  CurriculumUnit,
  Material,
  MaterialKind,
  MaterialStatus,
  UserId,
} from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { StatusChip, type StatusTone } from '~/components/dashboard/StatusChip'
import { formatDate } from '~/components/dashboard/format'
import type { IconName } from '~/components/dashboard/icons'
import { MetaSep } from '~/components/shared/MetaSep'
import { PageHero } from '~/components/shared/PageHero'
import { SelectField } from '~/components/shared/SelectField'
import { useLang, useStrings } from '~/shell/useStrings'

/**
 * Teacher material library — the teacher's text materials and links, with
 * metadata-only create and delete.
 *
 * Data is the composed `materialLibraryQueryOptions` (materials + classes +
 * unit names) through the adapter. Create uses `materials.create` with a `text`
 * or `link` kind only; PDF/image binary upload is an integration gap, so the
 * screen says so instead of faking an upload. Delete uses `materials.delete`:
 * the mock returns CONFLICT for a material a test relies on, and the row shows
 * that specific reason rather than a generic error.
 */
export function MaterialLibrary() {
  const copy = useStrings().materialLibrary
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

  if (sessionQuery.data?.user.role !== 'teacher') {
    return (
      <Frame>
        <EmptyNote
          icon="alert"
          title={copy.noSessionTitle}
          body={copy.noSessionBody}
        />
      </Frame>
    )
  }

  return <MaterialLibraryBody teacherId={sessionQuery.data.user.id} />
}

function MaterialLibraryBody({ teacherId }: { teacherId: UserId }) {
  const strings = useStrings()
  const copy = strings.materialLibrary
  const [classId, setClassId] = useState('all')
  const libraryQuery = useQuery(materialLibraryQueryOptions(teacherId))
  const data = libraryQuery.data

  const visible =
    data === undefined || classId === 'all'
      ? (data?.materials ?? [])
      : data.materials.filter((material) => material.classroomId === classId)

  return (
    <Frame>
      {libraryQuery.isError ? (
        <EmptyNote
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      ) : libraryQuery.isPending || data === undefined ? (
        <p className="loading-note" role="status">
          {copy.loading}
        </p>
      ) : (
        <>
          <EmptyNote
            icon="alert"
            title={copy.uploadGapTitle}
            body={copy.uploadGapBody}
          />

          {data.classrooms.length === 0 ? (
            <EmptyNote
              title={copy.noClassesTitle}
              body={copy.noClassesBody}
            />
          ) : (
            <AddMaterialForm
              teacherId={teacherId}
              classrooms={data.classrooms}
              unitsByClass={data.unitsByClass}
            />
          )}

          <section
            className="dashboard__section"
            aria-labelledby="materials-list-heading"
          >
            <div className="section-head">
              <h2 id="materials-list-heading">{copy.listHeading}</h2>
              <span className="count-chip">
                {copy.materialsCount(visible.length)}
              </span>
            </div>
            <p className="section-lead">{copy.listLead}</p>

            <div className="filter-bar" aria-label={copy.filtersLabel}>
              <label className="filter-bar__field">
                <span className="field__label">{copy.filterClass}</span>
                <SelectField>
                  <select
                    className="input"
                    value={classId}
                    onChange={(event) => setClassId(event.target.value)}
                  >
                    <option value="all">{copy.allClasses}</option>
                    {data.classrooms.map((classroom) => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </select>
                </SelectField>
              </label>
              {classId !== 'all' ? (
                <button
                  type="button"
                  className="button button--secondary button--small"
                  onClick={() => setClassId('all')}
                >
                  {copy.clearFilters}
                </button>
              ) : null}
            </div>

            {visible.length === 0 ? (
              data.materials.length === 0 ? (
                <EmptyNote
                  icon="book"
                  title={copy.emptyTitle}
                  body={copy.emptyBody}
                />
              ) : (
                <EmptyNote
                  icon="spark"
                  title={copy.emptyFilterTitle}
                  body={copy.emptyFilterBody}
                />
              )
            ) : (
              <ul className="material-list">
                {visible.map((material) => (
                  <li key={material.id}>
                    <MaterialRow
                      material={material}
                      teacherId={teacherId}
                      classroom={data.classrooms.find(
                        (item) => item.id === material.classroomId,
                      )}
                      units={data.unitsByClass[material.classroomId] ?? []}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </Frame>
  )
}

function AddMaterialForm({
  teacherId,
  classrooms,
  unitsByClass,
}: {
  teacherId: UserId
  classrooms: ClassroomSummary[]
  unitsByClass: MaterialLibraryData['unitsByClass']
}) {
  const strings = useStrings()
  const copy = strings.materialLibrary
  const queryClient = useQueryClient()
  const [classId, setClassId] = useState('')
  const [unitId, setUnitId] = useState('')
  const [kind, setKind] = useState<'text' | 'link'>('text')
  const [title, setTitle] = useState('')
  const [textContent, setTextContent] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [createdTitle, setCreatedTitle] = useState<string | null>(null)

  const units = classId === '' ? [] : (unitsByClass[classId] ?? [])
  const canSubmit =
    classId !== '' &&
    title.trim() !== '' &&
    (kind === 'text' ? textContent.trim() !== '' : sourceUrl.trim() !== '')

  const createMutation = useMutation({
    mutationFn: () =>
      api.materials.create({
        teacherId,
        classroomId: classId,
        unitId: unitId === '' ? null : unitId,
        title: title.trim(),
        kind,
        textContent: kind === 'text' ? textContent.trim() : null,
        sourceUrl: kind === 'link' ? sourceUrl.trim() : null,
      }),
    onSuccess: (material) => {
      setCreatedTitle(material.title)
      setTitle('')
      setTextContent('')
      setSourceUrl('')
      setUnitId('')
      void queryClient.invalidateQueries({ queryKey: queryKeys.materials.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all() })
    },
  })

  return (
    <section
      className="dashboard__section"
      aria-labelledby="material-add-heading"
    >
      <div className="section-head">
        <h2 id="material-add-heading">{copy.addHeading}</h2>
      </div>
      <p className="section-lead">{copy.addLead}</p>

      <form
        className="builder-form material-form"
        onSubmit={(event) => {
          event.preventDefault()
          setCreatedTitle(null)
          createMutation.mutate()
        }}
      >
        <div className="material-form__row">
          <label className="field">
            <span className="field__label">{copy.classLabel}</span>
            <SelectField>
              <select
                className="input"
                value={classId}
                required
                onChange={(event) => {
                  setClassId(event.target.value)
                  setUnitId('')
                  setCreatedTitle(null)
                }}
              >
                <option value="" disabled>
                  {copy.classPlaceholder}
                </option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </SelectField>
          </label>

          <label className="field">
            <span className="field__label">{copy.unitLabel}</span>
            <SelectField>
              <select
                className="input"
                value={unitId}
                disabled={classId === '' || units.length === 0}
                onChange={(event) => {
                  setUnitId(event.target.value)
                  setCreatedTitle(null)
                }}
              >
                <option value="">{copy.noUnit}</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.title}
                  </option>
                ))}
              </select>
            </SelectField>
          </label>

          <label className="field">
            <span className="field__label">{copy.kindLabel}</span>
            <SelectField>
              <select
                className="input"
                value={kind}
                onChange={(event) => {
                  setKind(event.target.value === 'link' ? 'link' : 'text')
                  setCreatedTitle(null)
                }}
              >
                <option value="text">{copy.kindText}</option>
                <option value="link">{copy.kindLink}</option>
              </select>
            </SelectField>
          </label>
        </div>

        <label className="field">
          <span className="field__label">{copy.titleLabel}</span>
          <input
            className="input"
            type="text"
            value={title}
            required
            placeholder={copy.titlePlaceholder}
            onChange={(event) => {
              setTitle(event.target.value)
              setCreatedTitle(null)
            }}
          />
        </label>

        {kind === 'text' ? (
          <label className="field">
            <span className="field__label">{copy.textLabel}</span>
            <textarea
              className="input textarea"
              rows={5}
              value={textContent}
              required
              placeholder={copy.textPlaceholder}
              onChange={(event) => {
                setTextContent(event.target.value)
                setCreatedTitle(null)
              }}
            />
          </label>
        ) : (
          <label className="field">
            <span className="field__label">{copy.urlLabel}</span>
            <input
              className="input"
              type="text"
              inputMode="url"
              value={sourceUrl}
              required
              placeholder={copy.urlPlaceholder}
              onChange={(event) => {
                setSourceUrl(event.target.value)
                setCreatedTitle(null)
              }}
            />
          </label>
        )}

        {createMutation.isError ? (
          <EmptyNote
            tone="error"
            title={copy.createErrorTitle}
            body={copy.createErrorBody}
          />
        ) : null}

        {createdTitle ? (
          <p className="finish-note" role="status">
            {copy.createSuccessBody(createdTitle)}
          </p>
        ) : null}

        <div className="builder-actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={!canSubmit || createMutation.isPending}
          >
            {createMutation.isPending ? copy.submitting : copy.submit}
          </button>
        </div>
      </form>
    </section>
  )
}

function MaterialRow({
  material,
  teacherId,
  classroom,
  units,
}: {
  material: Material
  teacherId: UserId
  classroom: ClassroomSummary | undefined
  units: readonly CurriculumUnit[]
}) {
  const strings = useStrings()
  const copy = strings.materialLibrary
  const lang = useLang()
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const detailQuery = useQuery({
    ...materialDetailQueryOptions(material.id),
    enabled: expanded,
  })

  const deleteMutation = useMutation({
    mutationFn: () =>
      api.materials.delete({ teacherId, materialId: material.id }),
    onSuccess: () => {
      setConfirmingDelete(false)
      void queryClient.invalidateQueries({ queryKey: queryKeys.materials.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all() })
    },
    onError: () => setConfirmingDelete(false),
  })

  const kindLabels: Record<MaterialKind, string> = {
    text: copy.kindText,
    link: copy.kindLink,
    pdf: copy.kindPdf,
    image: copy.kindImage,
  }

  const statusLabels: Record<MaterialStatus, string> = {
    ready: copy.statusReady,
    processing: copy.statusProcessing,
    failed: copy.statusFailed,
  }

  const statusTone: StatusTone =
    material.status === 'ready' ? 'success' : 'warning'
  const statusIcon: IconName =
    material.status === 'ready'
      ? 'check'
      : material.status === 'processing'
        ? 'clock'
        : 'alert'

  const unit = units.find((item) => item.id === material.unitId)
  const meta = [
    classroom?.name ?? copy.noClass,
    unit?.title ?? copy.noUnit,
    kindLabels[material.kind],
  ]
  if (material.wordCount !== null) {
    meta.push(copy.wordsCount(material.wordCount))
  }
  meta.push(
    `${copy.created} ${formatDate(material.createdAt, copy.unknownDate, lang)}`,
  )

  const deleteConflict =
    isApiError(deleteMutation.error) && deleteMutation.error.code === 'CONFLICT'

  return (
    <article className="material-row">
      <div className="material-row__head">
        <h3>
          <bdi>{material.title}</bdi>
        </h3>
        <StatusChip
          tone={statusTone}
          icon={statusIcon}
          label={statusLabels[material.status]}
        />
      </div>
      <p className="row-meta">
        {meta.map((item, index) => (
          <Fragment key={`${item}:${index}`}>
            {index > 0 ? <MetaSep /> : null}
            <bdi>{item}</bdi>
          </Fragment>
        ))}
      </p>

      <div className="builder-actions">
        <button
          type="button"
          className="button button--secondary button--small"
          aria-expanded={expanded}
          aria-controls={`material-detail-${material.id}`}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? copy.hide : copy.view}
        </button>
        {confirmingDelete ? null : (
          <button
            type="button"
            className="button button--danger button--small"
            onClick={() => {
              deleteMutation.reset()
              setConfirmingDelete(true)
            }}
          >
            {copy.delete}
          </button>
        )}
      </div>

      {confirmingDelete ? (
        <div className="delete-confirm" role="alert">
          <p>{copy.deleteConfirmTitle}</p>
          <p>{copy.deleteConfirmBody}</p>
          <div className="builder-actions">
            <button
              type="button"
              className="button button--danger button--small"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending ? copy.deleting : copy.deleteConfirm}
            </button>
            <button
              type="button"
              className="button button--secondary button--small"
              disabled={deleteMutation.isPending}
              onClick={() => setConfirmingDelete(false)}
            >
              {copy.deleteCancel}
            </button>
          </div>
        </div>
      ) : null}

      {deleteMutation.isError ? (
        <EmptyNote
          tone="error"
          title={
            deleteConflict ? copy.deleteConflictTitle : copy.deleteErrorTitle
          }
          body={deleteConflict ? copy.deleteConflictBody : copy.deleteErrorBody}
        />
      ) : null}

      {expanded ? (
        <div
          className="material-row__detail"
          id={`material-detail-${material.id}`}
        >
          {detailQuery.isPending ? (
            <p className="loading-note" role="status">
              {copy.detailLoading}
            </p>
          ) : detailQuery.isError || !detailQuery.data ? (
            <EmptyNote
              tone="error"
              title={copy.detailErrorTitle}
              body={copy.detailErrorBody}
            />
          ) : (
            <>
              {detailQuery.data.textContent ? (
                <p className="material-row__text">
                  {detailQuery.data.textContent}
                </p>
              ) : (
                <p className="finish-note">{copy.detailNoContent}</p>
              )}
              {detailQuery.data.sourceUrl ? (
                <p>
                  <a
                    className="screen-link"
                    href={detailQuery.data.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {copy.openLink}
                  </a>
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </article>
  )
}

function Frame({ children }: { children: ReactNode }) {
  const copy = useStrings().materialLibrary
  return (
    <div className="dashboard">
      <PageHero badge={copy.badge} title={copy.title} lead={copy.lead} />
      {children}
    </div>
  )
}
