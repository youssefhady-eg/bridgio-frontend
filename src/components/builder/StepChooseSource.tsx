import type {
  ClassroomDetail,
  ClassroomSummary,
  Material,
  Test,
  TestSourceInput,
} from '~/api/types'
import { EmptyNote } from '~/components/dashboard/EmptyNote'
import { formatCount } from '~/components/dashboard/format'
import { useLang, useStrings } from '~/shell/useStrings'
import { sourceDraftIssue } from './builder'

export type SourceKind = TestSourceInput['kind']

/**
 * Step 1 — choose a class and one grounded source: teacher material or a
 * curriculum unit that belongs to that class. Lists come from the adapter; no
 * class, material or unit is hard-coded in this component.
 */
export function StepChooseSource({
  classes,
  classesLoading,
  classesError,
  classroomId,
  onClassroomChange,
  sourceKind,
  onSourceKindChange,
  materials,
  materialsLoading,
  materialsError,
  materialId,
  onMaterialIdChange,
  classroomDetail,
  classroomLoading,
  classroomError,
  unitId,
  onUnitIdChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  draft,
  className,
  creating,
  createError,
  onCreateDraft,
}: {
  classes: readonly ClassroomSummary[]
  classesLoading: boolean
  classesError: boolean
  classroomId: string
  onClassroomChange: (value: string) => void
  sourceKind: SourceKind
  onSourceKindChange: (value: SourceKind) => void
  materials: readonly Material[]
  materialsLoading: boolean
  materialsError: boolean
  materialId: string
  onMaterialIdChange: (value: string) => void
  classroomDetail: ClassroomDetail | undefined
  classroomLoading: boolean
  classroomError: boolean
  unitId: string
  onUnitIdChange: (value: string) => void
  title: string
  onTitleChange: (value: string) => void
  description: string
  onDescriptionChange: (value: string) => void
  draft: Test | null
  className: string
  creating: boolean
  createError: boolean
  onCreateDraft: () => void
}) {
  const builder = useStrings().builder
  const strings = builder.source
  const lang = useLang()
  const issue = sourceDraftIssue({
    classroomId,
    title,
    sourceKind,
    materialId,
    unitId,
  })
  const readyMaterials = materials.filter(
    (material) => material.status === 'ready',
  )
  const units = classroomDetail?.units ?? []

  return (
    <section className="builder-panel" aria-labelledby="builder-source-heading">
      <header className="builder-panel__head">
        <h2 id="builder-source-heading">{strings.heading}</h2>
        <p className="builder-panel__lead">{strings.lead}</p>
      </header>

      {draft ? (
        <>
          <dl className="summary-list">
            <div>
              <dt>{strings.classLabel}</dt>
              <dd>{className}</dd>
            </div>
            <div>
              <dt>{builder.draft.sourceLabel}</dt>
              <dd>{draft.source.label}</dd>
            </div>
            <div>
              <dt>{strings.titleLabel}</dt>
              <dd>{draft.title}</dd>
            </div>
          </dl>
          <p className="field__hint">{strings.lockedNote}</p>
        </>
      ) : (
        <div className="builder-form">
          {classesLoading ? (
            <p className="loading-note" role="status">
              {builder.loading}
            </p>
          ) : null}

          {classesError ? (
            <EmptyNote
              tone="error"
              title={strings.classesError}
              body={builder.loadErrorBody}
            />
          ) : null}

          {!classesLoading && !classesError && classes.length === 0 ? (
            <EmptyNote
              icon="classes"
              title={strings.classesEmptyTitle}
              body={strings.classesEmptyBody}
            />
          ) : null}

          {classes.length > 0 ? (
            <div className="field">
              <label className="field__label" htmlFor="builder-class">
                {strings.classLabel}
              </label>
              <select
                id="builder-class"
                className="input"
                value={classroomId}
                onChange={(event) => onClassroomChange(event.target.value)}
              >
                <option value="">{strings.classPlaceholder}</option>
                {classes.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} — {classroom.subjectName}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {classroomId ? (
            <>
              <fieldset className="field">
                <legend className="field__label">{strings.kindLabel}</legend>
                <div className="choice-grid choice-grid--two">
                  <label
                    className={`choice-card${
                      sourceKind === 'material' ? ' is-selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="builder-source-kind"
                      value="material"
                      checked={sourceKind === 'material'}
                      onChange={() => onSourceKindChange('material')}
                    />
                    <span className="choice-card__title">
                      {strings.kindMaterial}
                    </span>
                  </label>
                  <label
                    className={`choice-card${
                      sourceKind === 'curriculum_unit' ? ' is-selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="builder-source-kind"
                      value="curriculum_unit"
                      checked={sourceKind === 'curriculum_unit'}
                      onChange={() => onSourceKindChange('curriculum_unit')}
                    />
                    <span className="choice-card__title">
                      {strings.kindUnit}
                    </span>
                  </label>
                </div>
              </fieldset>

              {sourceKind === 'material' ? (
                <section className="field" aria-labelledby="builder-material-heading">
                  <h3 id="builder-material-heading">
                    {strings.materialHeading}
                  </h3>
                  {materialsLoading ? (
                    <p className="loading-note" role="status">
                      {strings.materialsLoading}
                    </p>
                  ) : null}
                  {materialsError ? (
                    <EmptyNote
                      tone="error"
                      title={strings.materialsError}
                      body={builder.loadErrorBody}
                    />
                  ) : null}
                  {!materialsLoading &&
                  !materialsError &&
                  materials.length === 0 ? (
                    <EmptyNote
                      icon="book"
                      title={strings.materialsEmptyTitle}
                      body={strings.materialsEmptyBody}
                    />
                  ) : null}
                  {materials.length > 0 ? (
                    <div className="choice-grid">
                      {materials.map((material) => {
                        const ready = material.status === 'ready'
                        return (
                          <label
                            key={material.id}
                            className={`choice-card${
                              materialId === material.id ? ' is-selected' : ''
                            }${ready ? '' : ' is-disabled'}`}
                          >
                            <input
                              type="radio"
                              name="builder-material"
                              value={material.id}
                              checked={materialId === material.id}
                              disabled={!ready}
                              onChange={() => onMaterialIdChange(material.id)}
                            />
                            <span className="choice-card__title">
                              {material.title}
                            </span>
                            <span className="choice-card__meta">
                              {ready
                                ? strings.materialReady
                                : strings.materialProcessing}
                              {material.wordCount !== null
                                ? ` · ${strings.materialWords(material.wordCount)}`
                                : ''}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  ) : null}
                  {readyMaterials.length === 0 &&
                  materials.length > 0 &&
                  !materialsLoading &&
                  !materialsError ? (
                    <p className="field__hint">
                      {strings.materialsEmptyBody}
                    </p>
                  ) : null}
                </section>
              ) : (
                <section className="field" aria-labelledby="builder-unit-heading">
                  <h3 id="builder-unit-heading">{strings.unitHeading}</h3>
                  {classroomLoading ? (
                    <p className="loading-note" role="status">
                      {strings.unitsLoading}
                    </p>
                  ) : null}
                  {classroomError ? (
                    <EmptyNote
                      tone="error"
                      title={strings.unitsError}
                      body={builder.loadErrorBody}
                    />
                  ) : null}
                  {!classroomLoading &&
                  !classroomError &&
                  units.length === 0 ? (
                    <EmptyNote
                      icon="book"
                      title={strings.unitsEmptyTitle}
                      body={strings.unitsEmptyBody}
                    />
                  ) : null}
                  {units.length > 0 ? (
                    <div className="choice-grid">
                      {units.map((item) => (
                        <label
                          key={item.unit.id}
                          className={`choice-card${
                            unitId === item.unit.id ? ' is-selected' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name="builder-unit"
                            value={item.unit.id}
                            checked={unitId === item.unit.id}
                            onChange={() => onUnitIdChange(item.unit.id)}
                          />
                          <span className="choice-card__title">
                            {item.unit.title}
                          </span>
                          <span className="choice-card__meta">
                            {item.unit.subjectName} ·{' '}
                            {strings.unitLessons(item.unit.lessonCount)}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : null}
                </section>
              )}

              <div className="field">
                <label className="field__label" htmlFor="builder-title">
                  {strings.titleLabel}
                </label>
                <input
                  id="builder-title"
                  className="input"
                  type="text"
                  value={title}
                  placeholder={strings.titlePlaceholder}
                  onChange={(event) => onTitleChange(event.target.value)}
                />
                <p className="field__hint">{strings.titleHint}</p>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="builder-description">
                  {strings.descriptionLabel}
                </label>
                <textarea
                  id="builder-description"
                  className="input textarea"
                  rows={2}
                  value={description}
                  placeholder={strings.descriptionPlaceholder}
                  onChange={(event) =>
                    onDescriptionChange(event.target.value)
                  }
                />
              </div>

              {createError ? (
                <EmptyNote
                  tone="error"
                  title={strings.createDraftErrorTitle}
                  body={strings.createDraftErrorBody}
                />
              ) : null}

              <div className="builder-actions">
                <button
                  type="button"
                  className="button button--primary"
                  disabled={issue !== null || creating}
                  onClick={onCreateDraft}
                >
                  {creating ? strings.creatingDraft : strings.createDraft}
                </button>
              </div>
            </>
          ) : (
            classes.length > 0 && !classesLoading && !classesError ? (
              <p className="field__hint">{strings.selectClassHint}</p>
            ) : null
          )}
        </div>
      )}
    </section>
  )
}
