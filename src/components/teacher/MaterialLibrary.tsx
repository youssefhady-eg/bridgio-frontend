import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
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
import { formatCount, formatDate } from '~/components/dashboard/format'
import { useLang, useStrings } from '~/shell/useStrings'
import {
  Drawer,
  EmptyBox,
  LoadingNote,
  Modal,
  PageHead,
  Panel,
  Status,
} from './ui'

/**
 * Part 2 (2026-11-22) — teacher material library as a dense table.
 *
 * Data is the composed `materialLibraryQueryOptions` (materials + classes + unit
 * names) through the adapter. Create and delete stay real: `materials.create`
 * with a text or link kind, `materials.delete` with the adapter's CONFLICT for a
 * material a test relies on.
 *
 * The size column is the word count the adapter supplies; a material without one
 * shows "—". No byte size or duration is invented. PDF/image upload remains an
 * integration gap and the copy says so instead of faking an upload button.
 */
export function MaterialLibrary() {
  const copy = useStrings().materialLibrary
  const sessionQuery = useQuery(sessionQueryOptions())

  if (sessionQuery.isPending) {
    return (
      <Frame title={copy.title}>
        <LoadingNote>{copy.loading}</LoadingNote>
      </Frame>
    )
  }

  if (sessionQuery.data?.user.role !== 'teacher') {
    return (
      <Frame title={copy.title}>
        <EmptyBox title={copy.noSessionTitle} body={copy.noSessionBody} />
      </Frame>
    )
  }

  return <MaterialLibraryBody teacherId={sessionQuery.data.user.id} />
}

function MaterialLibraryBody({ teacherId }: { teacherId: UserId }) {
  const copy = useStrings().materialLibrary
  const [classId, setClassId] = useState('all')
  const [detail, setDetail] = useState<Material | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [createdTitle, setCreatedTitle] = useState<string | null>(null)
  const libraryQuery = useQuery(materialLibraryQueryOptions(teacherId))
  const data = libraryQuery.data

  const visible =
    data === undefined || classId === 'all'
      ? (data?.materials ?? [])
      : data.materials.filter((material) => material.classroomId === classId)

  if (libraryQuery.isPending || data === undefined) {
    return (
      <Frame title={copy.title}>
        <LoadingNote>{copy.loading}</LoadingNote>
      </Frame>
    )
  }

  if (libraryQuery.isError) {
    return (
      <Frame title={copy.title}>
        <EmptyBox
          tone="error"
          title={copy.loadErrorTitle}
          body={copy.loadErrorBody}
        />
      </Frame>
    )
  }

  return (
    <Frame
      title={copy.title}
      actions={
        <>
          {data.classrooms.length > 0 ? (
            <select
              className="tv-select"
              aria-label={copy.filterClass}
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
          ) : null}
          <button
            type="button"
            className="tv-btn tv-btn-primary"
            disabled={data.classrooms.length === 0}
            onClick={() => setShowUpload(true)}
          >
            {copy.upload}
          </button>
        </>
      }
    >
      {data.classrooms.length === 0 ? (
        <Panel>
          <EmptyBox title={copy.noClassesTitle} body={copy.noClassesBody} />
        </Panel>
      ) : null}

      {createdTitle ? (
        <p className="tv-cell-sub" role="status">
          {copy.createSuccessBody(createdTitle)}
        </p>
      ) : null}

      <Panel labelledBy="materials-heading">
        <div className="tv-panel-head">
          <h2 className="tv-panel-title" id="materials-heading">
            {copy.listHeading}
            <span className="tv-count">
              {copy.materialsCount(visible.length)}
            </span>
          </h2>
        </div>
        {visible.length === 0 ? (
          <EmptyBox
            title={
              data.materials.length === 0
                ? copy.emptyTitle
                : copy.emptyFilterTitle
            }
            body={
              data.materials.length === 0
                ? copy.emptyBody
                : copy.emptyFilterBody
            }
          />
        ) : (
          <div className="tv-table-wrap">
            <table className="tv-table">
              <caption className="visually-hidden">{copy.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{copy.colTitle}</th>
                  <th scope="col">{copy.colClass}</th>
                  <th scope="col">{copy.colType}</th>
                  <th scope="col">{copy.colWords}</th>
                  <th scope="col">{copy.colCreated}</th>
                  <th scope="col">{copy.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((material) => (
                  <MaterialRow
                    key={material.id}
                    material={material}
                    teacherId={teacherId}
                    classroom={data.classrooms.find(
                      (item) => item.id === material.classroomId,
                    )}
                    units={data.unitsByClass[material.classroomId] ?? []}
                    onOpen={() => setDetail(material)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {detail ? (
        <MaterialDetailDrawer
          material={detail}
          classroom={data.classrooms.find(
            (item) => item.id === detail.classroomId,
          )}
          units={data.unitsByClass[detail.classroomId] ?? []}
          onClose={() => setDetail(null)}
        />
      ) : null}

      {showUpload ? (
        <UploadMaterialModal
          teacherId={teacherId}
          classrooms={data.classrooms}
          unitsByClass={data.unitsByClass}
          onCreated={(material) => {
            setCreatedTitle(material.title)
            setShowUpload(false)
          }}
          onClose={() => setShowUpload(false)}
        />
      ) : null}
    </Frame>
  )
}

function MaterialRow({
  material,
  teacherId,
  classroom,
  units,
  onOpen,
}: {
  material: Material
  teacherId: UserId
  classroom: ClassroomSummary | undefined
  units: readonly CurriculumUnit[]
  onOpen: () => void
}) {
  const copy = useStrings().materialLibrary
  const lang = useLang()
  const queryClient = useQueryClient()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

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

  const unit = units.find((item) => item.id === material.unitId)
  const deleteConflict =
    isApiError(deleteMutation.error) && deleteMutation.error.code === 'CONFLICT'

  return (
    <tr>
      <td className="tv-td-primary">
        <div className="tv-cell-title">{material.title}</div>
        <div className="tv-cell-sub">{unit?.title ?? copy.noUnit}</div>
        {material.status !== 'ready' ? (
          <Status tone="warning">{statusLabels[material.status]}</Status>
        ) : null}
      </td>
      <td data-label={copy.colClass}>{classroom?.name ?? copy.noClass}</td>
      <td data-label={copy.colType}>{kindLabels[material.kind]}</td>
      <td data-label={copy.colWords} className="tv-num">
        {material.wordCount === null
          ? copy.noWords
          : formatCount(material.wordCount, lang)}
      </td>
      <td data-label={copy.colCreated} className="tv-cell-sub">
        {formatDate(material.createdAt, copy.unknownDate, lang)}
      </td>
      <td data-label={copy.colAction}>
        {confirmingDelete ? (
          <div className="tv-actions-cell">
            <button
              type="button"
              className="tv-btn tv-btn-danger-ghost tv-btn-sm"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending
                ? copy.deleting
                : copy.deleteConfirm}
            </button>
            <button
              type="button"
              className="tv-btn tv-btn-secondary tv-btn-sm"
              disabled={deleteMutation.isPending}
              onClick={() => setConfirmingDelete(false)}
            >
              {copy.deleteCancel}
            </button>
          </div>
        ) : (
          <div className="tv-actions-cell">
            <button
              type="button"
              className="tv-btn tv-btn-subtle tv-btn-sm"
              onClick={onOpen}
            >
              {copy.view}
            </button>
            <button
              type="button"
              className="tv-btn tv-btn-danger-ghost tv-btn-sm"
              onClick={() => {
                deleteMutation.reset()
                setConfirmingDelete(true)
              }}
            >
              {copy.delete}
            </button>
          </div>
        )}
        {deleteMutation.isError ? (
          <div className="tv-inline-error" role="alert">
            {deleteConflict ? copy.deleteConflictTitle : copy.deleteErrorTitle}
          </div>
        ) : null}
      </td>
    </tr>
  )
}

function MaterialDetailDrawer({
  material,
  classroom,
  units,
  onClose,
}: {
  material: Material
  classroom: ClassroomSummary | undefined
  units: readonly CurriculumUnit[]
  onClose: () => void
}) {
  const copy = useStrings().materialLibrary
  const lang = useLang()
  const detailQuery = useQuery(materialDetailQueryOptions(material.id))
  const unit = units.find((item) => item.id === material.unitId)

  return (
    <Drawer
      title={material.title}
      subtitle={[classroom?.name ?? copy.noClass, unit?.title ?? copy.noUnit].join(
        ' · ',
      )}
      closeLabel={copy.close}
      onClose={onClose}
      footer={
        <button
          type="button"
          className="tv-btn tv-btn-secondary tv-btn-sm"
          onClick={onClose}
        >
          {copy.close}
        </button>
      }
    >
      <p className="tv-cell-sub">
        {[
          material.wordCount === null
            ? copy.noWords
            : copy.wordsCount(material.wordCount),
          `${copy.created} ${formatDate(material.createdAt, copy.unknownDate, lang)}`,
        ].join(' · ')}
      </p>

      {detailQuery.isPending ? (
        <LoadingNote>{copy.detailLoading}</LoadingNote>
      ) : detailQuery.isError || !detailQuery.data ? (
        <EmptyBox
          tone="error"
          title={copy.detailErrorTitle}
          body={copy.detailErrorBody}
        />
      ) : (
        <>
          {detailQuery.data.textContent ? (
            <p>{detailQuery.data.textContent}</p>
          ) : (
            <p className="tv-cell-sub">{copy.detailNoContent}</p>
          )}
          {detailQuery.data.sourceUrl ? (
            <p>
              <a
                className="tv-btn tv-btn-secondary tv-btn-sm"
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
    </Drawer>
  )
}

/**
 * The "+ upload material" modal (brief §2.4) — the demo's `.br-modal`
 * (max-width 460px). It writes metadata with `materials.create`, which is
 * metadata-only by contract: text and link materials are accepted, and the note
 * states plainly that PDF/image file upload is not available yet. No upload is
 * faked and no success is shown before the adapter confirms it.
 */
function UploadMaterialModal({
  teacherId,
  classrooms,
  unitsByClass,
  onCreated,
  onClose,
}: {
  teacherId: UserId
  classrooms: ClassroomSummary[]
  unitsByClass: MaterialLibraryData['unitsByClass']
  onCreated: (material: Material) => void
  onClose: () => void
}) {
  const copy = useStrings().materialLibrary
  const queryClient = useQueryClient()
  const [classId, setClassId] = useState(classrooms[0]?.id ?? '')
  const [unitId, setUnitId] = useState('')
  const [kind, setKind] = useState<'text' | 'link'>('text')
  const [title, setTitle] = useState('')
  const [textContent, setTextContent] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

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
      void queryClient.invalidateQueries({ queryKey: queryKeys.materials.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all() })
      onCreated(material)
    },
  })

  return (
    <Modal
      title={copy.uploadModalTitle}
      closeLabel={copy.close}
      maxWidth={460}
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            className="tv-btn tv-btn-secondary tv-btn-sm"
            onClick={onClose}
          >
            {copy.cancel}
          </button>
          <button
            type="submit"
            form="tv-upload-material"
            className="tv-btn tv-btn-primary tv-btn-sm"
            disabled={!canSubmit || createMutation.isPending}
          >
            {createMutation.isPending ? copy.submitting : copy.submit}
          </button>
        </>
      }
    >
      <form
        id="tv-upload-material"
        className="tv-stack-sm"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSubmit) createMutation.mutate()
        }}
      >
        <p className="tv-cell-sub">
          {copy.uploadGapTitle} {copy.uploadGapBody}
        </p>

        <label className="tv-field">
          <span className="tv-label">{copy.titleLabel}</span>
          <input
            className="tv-input"
            type="text"
            value={title}
            required
            placeholder={copy.titlePlaceholder}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <div className="tv-grid-equal">
          <label className="tv-field">
            <span className="tv-label">{copy.classLabel}</span>
            <select
              className="tv-select"
              value={classId}
              required
              onChange={(event) => {
                setClassId(event.target.value)
                setUnitId('')
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
          </label>

          <label className="tv-field">
            <span className="tv-label">{copy.unitLabel}</span>
            <select
              className="tv-select"
              value={unitId}
              disabled={classId === '' || units.length === 0}
              onChange={(event) => setUnitId(event.target.value)}
            >
              <option value="">{copy.noUnit}</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="tv-field">
          <span className="tv-label">{copy.kindLabel}</span>
          <select
            className="tv-select"
            value={kind}
            onChange={(event) =>
              setKind(event.target.value === 'link' ? 'link' : 'text')
            }
          >
            <option value="text">{copy.kindText}</option>
            <option value="link">{copy.kindLink}</option>
          </select>
        </label>

        {kind === 'text' ? (
          <label className="tv-field">
            <span className="tv-label">{copy.textLabel}</span>
            <textarea
              className="tv-textarea"
              rows={5}
              value={textContent}
              required
              placeholder={copy.textPlaceholder}
              onChange={(event) => setTextContent(event.target.value)}
            />
          </label>
        ) : (
          <label className="tv-field">
            <span className="tv-label">{copy.urlLabel}</span>
            <input
              className="tv-input"
              type="text"
              inputMode="url"
              value={sourceUrl}
              required
              placeholder={copy.urlPlaceholder}
              onChange={(event) => setSourceUrl(event.target.value)}
            />
          </label>
        )}

        {createMutation.isError ? (
          <EmptyBox
            tone="error"
            title={copy.createErrorTitle}
            body={copy.createErrorBody}
          />
        ) : null}
      </form>
    </Modal>
  )
}

function Frame({
  title,
  actions,
  children,
}: {
  title: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="tv-page">
      <PageHead title={title}>{actions}</PageHead>
      {children}
    </div>
  )
}