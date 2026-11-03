import { describe, expect, it } from 'vitest'
import { ApiError } from '../errors'
import type { BridgioApi } from '../contract'
import type { StudentQuestion } from '../types'
import { createMockApi } from './mock-adapter'
import { seedIds } from './seed'

const created = () =>
  createMockApi({ scenario: 'seeded', session: 'teacher', latencyMs: 0 })

function methodPaths(api: BridgioApi): string[] {
  const paths: string[] = []
  for (const [namespace, value] of Object.entries(api)) {
    if (typeof value !== 'object' || value === null) continue
    for (const [name, member] of Object.entries(value)) {
      if (typeof member === 'function') paths.push(`${namespace}.${name}`)
    }
  }
  return paths.sort()
}

const EXPECTED_METHODS = [
  'auth.getSession',
  'auth.signIn',
  'auth.signOut',
  'teachers.getProfile',
  'teachers.getDashboard',
  'students.getProfile',
  'students.getProgress',
  'classrooms.listForTeacher',
  'classrooms.get',
  'classrooms.listStudents',
  'curriculum.listSubjects',
  'curriculum.listUnits',
  'curriculum.getUnit',
  'materials.listForTeacher',
  'materials.get',
  'materials.create',
  'materials.delete',
  'tests.listForTeacher',
  'tests.listForClass',
  'tests.get',
  'tests.createDraft',
  'tests.update',
  'tests.publish',
  'tests.delete',
  'questions.listForTest',
  'questions.listForStudentTest',
  'questions.create',
  'questions.update',
  'questions.delete',
  'questions.reorder',
  'attempts.listForStudent',
  'attempts.start',
  'attempts.get',
  'attempts.saveAnswer',
  'attempts.submit',
  'mohsen.ask',
  'mohsen.draftQuestions',
  'rbac.getCapabilities',
  'parents.getProfile',
  'parents.getOverview',
  'messages.listThreads',
  'messages.listMessages',
  'messages.sendMessage',
  'system.getInfo',
].sort()

describe('mock adapter — contract surface', () => {
  it('implements every method of the BridgioApi contract', () => {
    const api = created()
    expect(api.mode).toBe('mock')
    expect(methodPaths(api)).toEqual(EXPECTED_METHODS)
  })

  it('reports its adapter status as PROPOSED', async () => {
    const info = await created().system.getInfo()
    expect(info.endpointStatus).toBe('PROPOSED')
    expect(info.mode).toBe('mock')
    expect(info.mockScenario).toBe('seeded')
  })
})

describe('mock adapter — auth and permissions', () => {
  it('starts with a demo teacher session and can sign out', async () => {
    const api = created()
    const session = await api.auth.getSession()
    expect(session?.user.id).toBe(seedIds.teacher)

    await api.auth.signOut()
    expect(await api.auth.getSession()).toBeNull()
    await expect(
      api.teachers.getDashboard({ teacherId: seedIds.teacher }),
    ).rejects.toMatchObject({ code: 'UNAUTHENTICATED' })
  })

  it('signs a student in by demo email and rejects unknown credentials', async () => {
    const api = created()
    const session = await api.auth.signIn({
      email: 'sara.student@bridgio.test',
      password: 'demo',
    })
    expect(session.user.role).toBe('student')
    expect(session.user.id).toBe(seedIds.studentSara)

    await expect(
      api.auth.signIn({ email: 'nobody@example.test', password: 'demo' }),
    ).rejects.toMatchObject({ code: 'UNAUTHENTICATED' })
  })
})

describe('mock adapter — teacher dashboard', () => {
  it('returns classes, recent tests and student progress through the adapter', async () => {
    const dashboard = await created().teachers.getDashboard({
      teacherId: seedIds.teacher,
    })
    expect(dashboard.classes).toHaveLength(2)
    expect(dashboard.recentTests.length).toBeGreaterThan(0)
    expect(dashboard.studentProgress.length).toBeGreaterThan(0)
    expect(dashboard.totals.classes).toBe(2)
    expect(dashboard.totals.students).toBe(3)
    expect(
      dashboard.recentTests.every((test) => test.questionCount >= 0),
    ).toBe(true)
  })

  it('returns an empty dashboard in the empty scenario', async () => {
    const api = createMockApi({ scenario: 'empty', session: 'teacher' })
    const dashboard = await api.teachers.getDashboard({
      teacherId: seedIds.teacher,
    })
    expect(dashboard.classes).toEqual([])
    expect(dashboard.recentTests).toEqual([])
    expect(dashboard.studentProgress).toEqual([])
    await expect(
      api.students.getProgress({ studentId: seedIds.studentSara }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})

describe('mock adapter — test builder flow', () => {
  it('drafts grounded questions, edits, deletes, reorders and publishes', async () => {
    const api = created()
    const draft = await api.tests.createDraft({
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      title: 'اختبار تجريبي — المرحلة صفر',
      description: null,
      source: { kind: 'material', materialId: seedIds.materialDerivatives },
    })
    expect(draft.status).toBe('draft')
    expect(draft.questionCount).toBe(0)

    const drafted = await api.mohsen.draftQuestions({
      teacherId: seedIds.teacher,
      testId: draft.id,
      count: 2,
      focus: null,
    })
    expect(drafted.status).toBe('drafted')
    if (drafted.status !== 'drafted') throw new Error('expected drafted')
    expect(drafted.questions).toHaveLength(2)
    expect(drafted.grounding.length).toBeGreaterThan(0)
    expect(drafted.questions.every((question) => question.grounding.length > 0)).toBe(
      true,
    )
    expect(drafted.questions.every((question) => question.origin === 'mohsen')).toBe(
      true,
    )

    const [first, second] = drafted.questions
    if (!first || !second) throw new Error('expected two drafted questions')

    const edited = await api.questions.update({
      teacherId: seedIds.teacher,
      testId: draft.id,
      questionId: first.id,
      prompt: 'ما مشتقة الدالة x² بعد التعديل؟',
      options: ['2x', 'x', 'x³'],
      correctOptionIndex: 0,
    })
    expect(edited.options).toHaveLength(3)
    expect(edited.correctOptionId).toBe(edited.options[0]?.id)

    await api.questions.delete({
      teacherId: seedIds.teacher,
      testId: draft.id,
      questionId: second.id,
    })

    const remaining = await api.questions.listForTest({ testId: draft.id })
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.order).toBe(1)

    const published = await api.tests.publish({
      teacherId: seedIds.teacher,
      testId: draft.id,
    })
    expect(published.status).toBe('published')
    expect(published.publishedAt).not.toBeNull()

    await expect(
      api.questions.update({
        teacherId: seedIds.teacher,
        testId: draft.id,
        questionId: first.id,
        prompt: 'تعديل بعد النشر',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('refuses to publish a test with no questions', async () => {
    const api = created()
    const draft = await api.tests.createDraft({
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      title: 'اختبار بلا أسئلة',
      description: null,
      source: { kind: 'curriculum_unit', unitId: seedIds.unitIntegration },
    })
    await expect(
      api.tests.publish({ teacherId: seedIds.teacher, testId: draft.id }),
    ).rejects.toMatchObject({ code: 'VALIDATION' })
  })
})

describe('mock adapter — student player flow (no marking)', () => {
  it('starts, answers and submits an attempt without any score', async () => {
    const api = created()
    await api.auth.signIn({
      email: 'sara.student@bridgio.test',
      password: 'demo',
    })

    const attempt = await api.attempts.start({
      studentId: seedIds.studentSara,
      testId: seedIds.testDerivatives,
    })
    expect(attempt.status).toBe('in_progress')
    expect(attempt.questionCount).toBe(3)

    const question = await api.questions.listForStudentTest({
      testId: seedIds.testDerivatives,
    })
    const secondQuestion = question[1]
    const secondOption = secondQuestion?.options[1]
    if (!secondQuestion || !secondOption) {
      throw new Error('expected a second question with options')
    }

    const saved = await api.attempts.saveAnswer({
      attemptId: attempt.id,
      questionId: secondQuestion.id,
      optionId: secondOption.id,
    })
    expect(saved.answeredCount).toBeGreaterThanOrEqual(2)

    const submitted = await api.attempts.submit({ attemptId: attempt.id })
    expect(submitted.status).toBe('submitted')
    expect(submitted.submittedAt).not.toBeNull()
    expect('score' in submitted).toBe(false)
    expect('correctCount' in submitted).toBe(false)

    await expect(
      api.attempts.saveAnswer({
        attemptId: attempt.id,
        questionId: secondQuestion.id,
        optionId: secondOption.id,
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' })
  })
})

describe('mock adapter — Mohsen grounding', () => {
  it('answers only from material and always shows grounding', async () => {
    const api = created()
    const answer = await api.mohsen.ask({
      question: 'ما مشتقة الدالة x^n؟',
      askedBy: seedIds.teacher,
      scope: {
        classroomId: seedIds.classMath,
        testId: null,
        materialIds: [],
        unitId: null,
      },
    })
    expect(answer.status).toBe('answered')
    expect(answer.grounding.length).toBeGreaterThan(0)
    expect(answer.grounding[0]?.excerpt).toBeTruthy()
  })

  it('refuses instead of guessing when the source does not cover the question', async () => {
    const api = created()
    const answer = await api.mohsen.ask({
      question: 'ما هي عاصمة فرنسا؟',
      askedBy: seedIds.teacher,
      scope: {
        classroomId: seedIds.classMath,
        testId: null,
        materialIds: [],
        unitId: null,
      },
    })
    expect(answer.status).toBe('not_grounded')
    expect(answer.grounding).toEqual([])
  })

  it('never returns an answered result without usable grounding', async () => {
    const api = created()
    const questions = [
      'ما مشتقة الدالة x^n؟',
      'ما الذي تقيسه المشتقة؟',
      'ما العلاقة بين التكامل والاشتقاق؟',
      'ما هي عاصمة فرنسا؟',
    ]

    for (const question of questions) {
      const answer = await api.mohsen.ask({
        question,
        askedBy: seedIds.teacher,
        scope: {
          classroomId: seedIds.classMath,
          testId: null,
          materialIds: [],
          unitId: null,
        },
      })

      if (answer.status === 'answered') {
        expect(answer.grounding.length).toBeGreaterThan(0)
        expect(
          answer.grounding.every(
            (ref) =>
              ref.label.trim().length > 0 &&
              (ref.excerpt ?? '').trim().length > 0,
          ),
        ).toBe(true)
      } else {
        expect(answer.grounding).toEqual([])
      }
    }
  })

  it('refuses a question made only of stopwords instead of answering', async () => {
    const api = created()
    const answer = await api.mohsen.ask({
      question: 'ما هو؟',
      askedBy: seedIds.teacher,
      scope: {
        classroomId: seedIds.classMath,
        testId: null,
        materialIds: [],
        unitId: null,
      },
    })
    expect(answer.status).toBe('not_grounded')
    expect(answer.grounding).toEqual([])
  })

  it('adds only unused grounded questions when asked for more', async () => {
    const api = created()
    const draft = await api.tests.createDraft({
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      title: 'اختبار الأسئلة الإضافية',
      description: null,
      source: { kind: 'material', materialId: seedIds.materialDerivatives },
    })

    const first = await api.mohsen.draftQuestions({
      teacherId: seedIds.teacher,
      testId: draft.id,
      count: 3,
      focus: null,
    })
    const second = await api.mohsen.draftQuestions({
      teacherId: seedIds.teacher,
      testId: draft.id,
      count: 3,
      focus: null,
    })
    expect(first.status).toBe('drafted')
    expect(second.status).toBe('drafted')
    if (first.status !== 'drafted' || second.status !== 'drafted') return

    expect(second.questions).toHaveLength(1)
    const all = await api.questions.listForTest({ testId: draft.id })
    expect(all).toHaveLength(4)
    expect(new Set(all.map((question) => question.prompt)).size).toBe(4)

    const third = await api.mohsen.draftQuestions({
      teacherId: seedIds.teacher,
      testId: draft.id,
      count: 3,
      focus: null,
    })
    expect(third.status).toBe('no_grounding')
  })

  it('returns no_grounding draft result for a source the mock cannot draft from', async () => {
    const api = created()
    const material = await api.materials.create({
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      unitId: seedIds.unitDerivatives,
      title: 'مادة بلا بنك أسئلة',
      kind: 'text',
      textContent: 'نص جديد لا يوجد له بنك أسئلة في المحاكي.',
      sourceUrl: null,
    })
    const draft = await api.tests.createDraft({
      teacherId: seedIds.teacher,
      classroomId: seedIds.classMath,
      title: 'اختبار من مادة جديدة',
      description: null,
      source: { kind: 'material', materialId: material.id },
    })
    const result = await api.mohsen.draftQuestions({
      teacherId: seedIds.teacher,
      testId: draft.id,
      count: 3,
      focus: null,
    })
    expect(result.status).toBe('no_grounding')
    expect(result.questions).toEqual([])
  })
})

describe('mock adapter — answer key boundary', () => {
  const signInAsSara = (api: BridgioApi) =>
    api.auth.signIn({ email: 'sara.student@bridgio.test', password: 'demo' })

  it('never gives a student correctOptionId, as a value or as a property', async () => {
    const api = created()
    await signInAsSara(api)

    const questions = await api.questions.listForStudentTest({
      testId: seedIds.testDerivatives,
    })
    expect(questions).toHaveLength(3)

    for (const question of questions) {
      expect(
        Object.prototype.hasOwnProperty.call(question, 'correctOptionId'),
      ).toBe(false)
      expect('correctOptionId' in question).toBe(false)
      expect(question.options.length).toBeGreaterThanOrEqual(2)
      for (const option of question.options) {
        expect(Object.keys(option).sort()).toEqual(['id', 'text'])
      }
    }
    // Pins the allowlist: a field added to `Question` must not leak by default.
    expect(Object.keys(questions[0] ?? {}).sort()).toEqual([
      'id',
      'options',
      'order',
      'prompt',
      'testId',
    ])
    expect(JSON.stringify(questions)).not.toContain('correctOptionId')
  })

  it('keeps correctOptionId on the teacher path for the builder', async () => {
    const api = created()

    const questions = await api.questions.listForTest({
      testId: seedIds.testDerivatives,
    })
    expect(questions).toHaveLength(3)
    for (const question of questions) {
      expect('correctOptionId' in question).toBe(true)
      expect(question.correctOptionId).not.toBeNull()
      expect(question.options.map((option) => option.id)).toContain(
        question.correctOptionId,
      )
    }
  })

  it('serves the student list in the same order and content as the teacher list', async () => {
    const api = created()
    const full = await api.questions.listForTest({
      testId: seedIds.testDerivatives,
    })
    const safe = await api.questions.listForStudentTest({
      testId: seedIds.testDerivatives,
    })

    expect(safe.map((question) => question.id)).toEqual(
      full.map((question) => question.id),
    )
    expect(safe.map((question) => question.prompt)).toEqual(
      full.map((question) => question.prompt),
    )
    expect(safe.map((question) => question.options)).toEqual(
      full.map((question) => question.options),
    )
  })

  it('strips the key for every caller of the student list, including the owning teacher', async () => {
    const api = created()
    const questions = await api.questions.listForStudentTest({
      testId: seedIds.testDerivatives,
    })
    expect(questions).toHaveLength(3)
    for (const question of questions) {
      expect('correctOptionId' in question).toBe(false)
    }
  })

  it('rejects a student calling the teacher-only full question list', async () => {
    const api = created()
    await signInAsSara(api)
    await expect(
      api.questions.listForTest({ testId: seedIds.testDerivatives }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('does not let a student read questions of an unpublished test', async () => {
    const api = created()
    await signInAsSara(api)
    await expect(
      api.questions.listForStudentTest({
        testId: seedIds.testIntegrationDraft,
      }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('does not let a student read questions of a class they are not enrolled in', async () => {
    const api = created()
    await signInAsSara(api)
    await expect(
      api.questions.listForStudentTest({ testId: seedIds.testPhysics }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('has no correctOptionId on the StudentQuestion type', () => {
    const question: StudentQuestion = {
      id: 'q',
      testId: 't',
      order: 1,
      prompt: 'p',
      options: [],
    }
    // @ts-expect-error StudentQuestion must not expose the answer key.
    void question.correctOptionId
    expect('correctOptionId' in question).toBe(false)
  })
})

describe('mock adapter — student class tests', () => {
  it('lists only published tests for a class the student is enrolled in', async () => {
    const api = created()
    await api.auth.signIn({
      email: 'sara.student@bridgio.test',
      password: 'demo',
    })
    const tests = await api.tests.listForClass({
      classroomId: seedIds.classMath,
    })
    expect(tests.length).toBeGreaterThan(0)
    expect(tests.every((test) => test.status === 'published')).toBe(true)
    expect(tests.map((test) => test.id)).toContain(seedIds.testDerivatives)
    expect(tests.map((test) => test.id)).not.toContain(
      seedIds.testIntegrationDraft,
    )
  })

  it('forbids a student from listing a class they are not enrolled in', async () => {
    const api = created()
    await api.auth.signIn({
      email: 'sara.student@bridgio.test',
      password: 'demo',
    })
    await expect(
      api.tests.listForClass({ classroomId: seedIds.classPhysics }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })
})

describe('mock adapter — errors', () => {
  it('throws ApiError for missing records', async () => {
    const api = created()
    const error = await api.tests.get({ testId: 'missing' }).catch((value) => value)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ code: 'NOT_FOUND', status: 404 })
  })
})
