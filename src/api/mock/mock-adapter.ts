import type { BridgioApi } from '../contract'
import { ApiError, type ApiErrorCode } from '../errors'
import type {
  AskMohsenInput,
  Attempt,
  AttemptSummary,
  ClassroomDetail,
  ClassroomStudent,
  ClassroomSummary,
  CreateMaterialInput,
  CreateQuestionInput,
  CreateTestDraftInput,
  CurriculumSubject,
  CurriculumUnit,
  DraftQuestionsInput,
  DraftQuestionsResult,
  GroundingRef,
  Material,
  Message,
  MessageThread,
  MohsenAnswer,
  ParentOverview,
  ParentProfile,
  Question,
  QuestionOption,
  ReorderQuestionsInput,
  SaveAnswerInput,
  SendMessageInput,
  SendMessageResult,
  Session,
  SignInInput,
  StartAttemptInput,
  StudentProfile,
  StudentProgress,
  StudentProgressSnapshot,
  StudentQuestion,
  StudentUnitProgress,
  SubmitAttemptInput,
  TeacherDashboard,
  TeacherProfile,
  Test,
  TestAttemptSummary,
  TestSource,
  TestSummary,
  UpdateQuestionInput,
  UpdateTestInput,
  User,
  UserCapabilities,
  UserId,
  UserRole,
} from '../types'
import { CONTRACT_VERSION } from '../version'
import {
  createSeedDatabase,
  mockQuestionBank,
  seedIds,
  type MockClassroom,
  type MockDatabase,
  type MockAttempt,
  type MockEnrollment,
  type MockTest,
} from './seed'

/**
 * MOCK ADAPTER — PROPOSED contract only.
 *
 * Implements `BridgioApi` with the exact same interface, method names and shapes
 * as the HTTP adapter. In-memory, deterministic demo data; no network, no
 * Mentingo connection, no AI model call.
 *
 * Mohsen in this adapter is a deterministic keyword retriever over seeded
 * material + fixed curriculum text. It refuses when nothing matches. It is NOT
 * a language model and must not be described as one in the UI or delivery notes.
 *
 * Arabic strings in the seed are DRAFT demo content awaiting owner review.
 */

export interface MockApiOptions {
  scenario?: 'seeded' | 'empty'
  session?: 'teacher' | 'student' | 'assistant' | 'parent' | 'none'
  latencyMs?: number
  now?: () => Date
}

const NOT_GROUNDED_ANSWER =
  'لا أجد إجابة موثّقة من المادة المرفوعة أو المنهج المقرر. لن أخمّن.'
const NO_DRAFT_SOURCE =
  'لا توجد أسئلة موثّقة جاهزة لهذا المصدر في المحاكي. المحاكي لا يخترع أسئلة بلا مصدر.'
const NO_MORE_DRAFT_SOURCE =
  'استُخدمت كل أسئلة هذا المصدر في المسودة. راجع الأسئلة الحالية أو احذف بعضها ثم أعد المحاولة.'

const ARABIC_DIACRITICS =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g

const STOPWORDS = new Set([
  'ما',
  'ماذا',
  'من',
  'في',
  'علي',
  'على',
  'هو',
  'هي',
  'هل',
  'عن',
  'الي',
  'التي',
  'الذي',
  'لماذا',
  'كيف',
  'متي',
  'اين',
  'بين',
  'اي',
  'او',
  'ثم',
  'هذا',
  'هذه',
  'ذلك',
  'تلك',
  'كل',
  'بعض',
  'عند',
  'عندما',
  'لكن',
  'لا',
  'نعم',
  'قد',
  'كان',
  'كانت',
  'يكون',
  'تكون',
  'يمكن',
  'نحن',
  'انت',
  'انا',
  'هم',
  'what',
  'which',
  'where',
  'when',
  'why',
  'how',
  'the',
  'and',
  'for',
  'from',
  'with',
  'this',
  'that',
  'these',
  'those',
  'does',
  'did',
  'is',
  'are',
  'was',
  'were',
  'can',
  'could',
  'should',
  'would',
  'about',
  'into',
  'than',
  'then',
])

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(' ')
    .filter((token) => token.length >= 3 && !STOPWORDS.has(token))
}

function sentencesOf(text: string): string[] {
  return text
    .split(/[.؟!?\n]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

/**
 * The excerpt shown next to an answer must actually contain a query term,
 * otherwise it is not evidence for the answer. Returns null when no sentence
 * in the text supports the question — that candidate is then unusable.
 */
function supportingExcerpt(text: string, tokens: string[]): string | null {
  const match = sentencesOf(text).find((sentence) => {
    const normalized = normalizeText(sentence)
    return tokens.some((token) => normalized.includes(token))
  })
  return match ?? null
}

interface GroundingCandidate {
  key: string
  text: string
  grounding: GroundingRef
}

function clone<T>(value: T): T {
  return structuredClone(value)
}

function fail(code: ApiErrorCode, message: string, status: number | null = null): never {
  throw new ApiError(code, message, { status })
}

export function createMockApi(options: MockApiOptions = {}): BridgioApi {
  const db: MockDatabase = createSeedDatabase({
    scenario: options.scenario ?? 'seeded',
    session: options.session ?? 'teacher',
  })
  const latencyMs = options.latencyMs ?? 0
  const clock = options.now ?? (() => new Date())
  let sequence = 0

  const nowIso = (): string => clock().toISOString()
  const nextId = (prefix: string): string =>
    `${prefix}_${clock().getTime().toString(36)}_${(++sequence).toString(36)}`

  async function respond<T>(fn: () => T): Promise<T> {
    if (latencyMs > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, latencyMs)
      })
    }
    return clone(fn())
  }

  // ---------------------------------------------------------------------------
  // Lookups and guards (permissions are PROPOSED minimal rules for the mock)
  // ---------------------------------------------------------------------------

  const userById = (id: UserId): User | undefined =>
    db.users.find((user) => user.id === id)

  function requireUser(id: UserId): User {
    const user = userById(id)
    if (!user) fail('NOT_FOUND', `Mock user "${id}" does not exist.`, 404)
    return user
  }

  function currentUser(): User {
    if (!db.sessionUserId) {
      fail('UNAUTHENTICATED', 'No mock session is active.', 401)
    }
    return requireUser(db.sessionUserId)
  }

  function requireActor(role: UserRole): User {
    const user = currentUser()
    if (user.role !== role) {
      fail('FORBIDDEN', `This action requires the ${role} role.`, 403)
    }
    return user
  }

  function requireSelf(role: UserRole, id: UserId): User {
    const user = requireActor(role)
    if (user.id !== id) {
      fail('FORBIDDEN', 'A user may only access their own record.', 403)
    }
    return user
  }

  const subjectById = (id: string): CurriculumSubject | undefined =>
    db.subjects.find((subject) => subject.id === id)

  function requireSubject(id: string): CurriculumSubject {
    const subject = subjectById(id)
    if (!subject) fail('NOT_FOUND', `Curriculum subject "${id}" not found.`, 404)
    return subject
  }

  const unitById = (id: string): CurriculumUnit | undefined =>
    db.units.find((unit) => unit.id === id)

  function requireUnit(id: string): CurriculumUnit {
    const unit = unitById(id)
    if (!unit) fail('NOT_FOUND', `Curriculum unit "${id}" not found.`, 404)
    return unit
  }

  function requireClassroom(id: string): MockClassroom {
    const classroom = db.classrooms.find((item) => item.id === id)
    if (!classroom) fail('NOT_FOUND', `Class "${id}" not found.`, 404)
    return classroom
  }

  function requireMaterial(id: string): Material {
    const material = db.materials.find((item) => item.id === id)
    if (!material) fail('NOT_FOUND', `Material "${id}" not found.`, 404)
    return material
  }

  function requireTest(id: string): MockTest {
    const test = db.tests.find((item) => item.id === id)
    if (!test) fail('NOT_FOUND', `Test "${id}" not found.`, 404)
    return test
  }

  function requireAttempt(id: string): MockAttempt {
    const attempt = db.attempts.find((item) => item.id === id)
    if (!attempt) fail('NOT_FOUND', `Attempt "${id}" not found.`, 404)
    return attempt
  }

  function questionsForTest(testId: string): Question[] {
    return db.questions
      .filter((question) => question.testId === testId)
      .sort((left, right) => left.order - right.order)
  }

  /**
   * Explicit allowlist, not a delete/omit: `correctOptionId` (and any field later
   * added to `Question`) cannot reach a student unless it is listed here.
   */
  function toStudentQuestion(question: Question): StudentQuestion {
    return {
      id: question.id,
      testId: question.testId,
      order: question.order,
      prompt: question.prompt,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.text,
      })),
    }
  }

  function enrollmentFor(
    classroomId: string,
    studentId: string,
  ): MockEnrollment | undefined {
    return db.enrollments.find(
      (item) =>
        item.classroomId === classroomId && item.studentId === studentId,
    )
  }

  function isEnrolled(classroomId: string, studentId: string): boolean {
    return enrollmentFor(classroomId, studentId) !== undefined
  }

  function teacherOwnsClassroom(
    classroom: MockClassroom,
    teacherId: string,
  ): boolean {
    return classroom.teacherId === teacherId
  }

  function canViewClassroom(classroom: MockClassroom, user: User): boolean {
    return (
      (user.role === 'teacher' && teacherOwnsClassroom(classroom, user.id)) ||
      (user.role === 'student' && isEnrolled(classroom.id, user.id))
    )
  }

  function requireVisibleClassroom(id: string, user: User): MockClassroom {
    const classroom = requireClassroom(id)
    if (!canViewClassroom(classroom, user)) {
      fail('FORBIDDEN', 'This class is not available to the current user.', 403)
    }
    return classroom
  }

  function canViewTest(test: MockTest, user: User): boolean {
    const classroom = requireClassroom(test.classroomId)
    if (user.role === 'teacher') return teacherOwnsClassroom(classroom, user.id)
    return test.status === 'published' && isEnrolled(classroom.id, user.id)
  }

  function requireVisibleTest(id: string, user: User): MockTest {
    const test = requireTest(id)
    if (!canViewTest(test, user)) {
      fail('FORBIDDEN', 'This test is not available to the current user.', 403)
    }
    return test
  }

  function requireOwnedDraftTest(id: string, teacherId: string): MockTest {
    const teacher = requireSelf('teacher', teacherId)
    const test = requireTest(id)
    if (test.teacherId !== teacher.id) {
      fail('FORBIDDEN', 'A teacher may only edit their own tests.', 403)
    }
    if (test.status !== 'draft') {
      fail('CONFLICT', 'Published tests are read-only in this MVP.', 409)
    }
    return test
  }

  function assertClassOwned(classroom: MockClassroom, teacherId: string): void {
    if (classroom.teacherId !== teacherId) {
      fail('FORBIDDEN', 'A teacher may only use their own classes.', 403)
    }
  }

  // ---------------------------------------------------------------------------
  // Mappers (storage -> public contract)
  // ---------------------------------------------------------------------------

  function classSummary(classroom: MockClassroom): ClassroomSummary {
    const subject = requireSubject(classroom.subjectId)
    const units = classroom.unitIds.map(requireUnit)
    return {
      id: classroom.id,
      name: classroom.name,
      subjectId: classroom.subjectId,
      subjectName: subject.name,
      gradeLevel: classroom.gradeLevel,
      studentCount: db.enrollments.filter(
        (item) => item.classroomId === classroom.id,
      ).length,
      unitCount: units.length,
      lessonCount: units.reduce((total, unit) => total + unit.lessonCount, 0),
      certificateNote: classroom.certificateNote,
      createdAt: classroom.createdAt,
    }
  }

  function classDetail(classroom: MockClassroom): ClassroomDetail {
    return {
      ...classSummary(classroom),
      teacherId: classroom.teacherId,
      description: classroom.description,
      units: classroom.unitIds.map((unitId) => {
        const unit = requireUnit(unitId)
        return {
          unit,
          materialCount: db.materials.filter(
            (material) =>
              material.classroomId === classroom.id &&
              material.unitId === unit.id,
          ).length,
          testCount: db.tests.filter(
            (test) =>
              test.classroomId === classroom.id &&
              test.source.unitId === unit.id,
          ).length,
        }
      }),
    }
  }

  function testSummary(test: MockTest): TestSummary {
    const classroom = requireClassroom(test.classroomId)
    return {
      id: test.id,
      title: test.title,
      classroomId: test.classroomId,
      classroomName: classroom.name,
      status: test.status,
      questionCount: questionsForTest(test.id).length,
      updatedAt: test.updatedAt,
      publishedAt: test.publishedAt,
    }
  }

  function testDetail(test: MockTest): Test {
    return {
      ...testSummary(test),
      teacherId: test.teacherId,
      description: test.description,
      source: test.source,
      createdAt: test.createdAt,
    }
  }

  function attemptSummary(attempt: MockAttempt): AttemptSummary {
    const test = requireTest(attempt.testId)
    const classroom = requireClassroom(test.classroomId)
    return {
      id: attempt.id,
      testId: test.id,
      testTitle: test.title,
      classroomId: classroom.id,
      classroomName: classroom.name,
      status: attempt.status,
      answeredCount: attempt.answers.filter(
        (answer) => answer.optionId !== null,
      ).length,
      questionCount: questionsForTest(test.id).length,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
    }
  }

  function attemptDetail(attempt: MockAttempt): Attempt {
    return {
      ...attemptSummary(attempt),
      studentId: attempt.studentId,
      answers: attempt.answers,
      // Backend-supplied only. The UI renders this value; it never computes one.
      scorePercent: db.resultScores[attempt.id] ?? null,
    }
  }

  /**
   * Teacher-facing row for one attempt on a test. Same backend-supplied score
   * source as `attemptDetail`, plus the student the teacher needs to identify.
   */
  function teacherAttemptSummary(attempt: MockAttempt): TestAttemptSummary {
    return {
      id: attempt.id,
      testId: attempt.testId,
      studentId: attempt.studentId,
      studentName: requireUser(attempt.studentId).displayName,
      status: attempt.status,
      answeredCount: attempt.answers.filter(
        (answer) => answer.optionId !== null,
      ).length,
      questionCount: questionsForTest(attempt.testId).length,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      scorePercent: db.resultScores[attempt.id] ?? null,
    }
  }

  function studentSnapshot(
    enrollment: MockEnrollment,
    classroom: MockClassroom,
  ): StudentProgressSnapshot {
    const unitIds = classroom.unitIds
    const totalPercent = unitIds.reduce(
      (total, unitId) =>
        total + (enrollment.progressByUnit[unitId]?.progressPercent ?? 0),
      0,
    )
    const completedUnits = unitIds.filter(
      (unitId) => (enrollment.progressByUnit[unitId]?.progressPercent ?? 0) >= 100,
    ).length
    return {
      student: requireUser(enrollment.studentId),
      classroomId: classroom.id,
      classroomName: classroom.name,
      progressPercent:
        unitIds.length === 0 ? 0 : Math.round(totalPercent / unitIds.length),
      completedUnits,
      totalUnits: unitIds.length,
      lastActiveAt: enrollment.lastActiveAt,
    }
  }

  // ---------------------------------------------------------------------------
  // Validation helpers
  // ---------------------------------------------------------------------------

  function validateTitle(value: string, field: string): string {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      fail('VALIDATION', `${field} is required.`, 422)
    }
    return trimmed
  }

  function validateOptions(options: string[], correctIndex: number | null): string[] {
    if (options.length < 2 || options.length > 6) {
      fail('VALIDATION', 'A question needs between 2 and 6 options.', 422)
    }
    const trimmed = options.map((option) => option.trim())
    if (trimmed.some((option) => option.length === 0)) {
      fail('VALIDATION', 'Question options cannot be empty.', 422)
    }
    const unique = new Set(trimmed.map((option) => option.toLowerCase()))
    if (unique.size !== trimmed.length) {
      fail('VALIDATION', 'Question options must be unique.', 422)
    }
    if (
      correctIndex !== null &&
      (!Number.isInteger(correctIndex) ||
        correctIndex < 0 ||
        correctIndex >= trimmed.length)
    ) {
      fail('VALIDATION', 'correctOptionIndex is out of range.', 422)
    }
    return trimmed
  }

  function buildOptions(
    questionId: string,
    texts: string[],
  ): QuestionOption[] {
    return texts.map((text, index) => ({
      id: `${questionId}_opt_${index + 1}`,
      text,
    }))
  }

  function correctOptionIdFor(
    options: QuestionOption[],
    correctIndex: number | null,
  ): string | null {
    if (correctIndex === null) return null
    const option = options[correctIndex]
    if (!option) return fail('VALIDATION', 'correctOptionIndex is out of range.', 422)
    return option.id
  }

  function validateDraftSource(
    input: CreateTestDraftInput,
  ): TestSource {
    if (input.source.kind === 'material') {
      const material = requireMaterial(input.source.materialId)
      if (material.teacherId !== input.teacherId) {
        fail('FORBIDDEN', 'A teacher may only ground tests in their own material.', 403)
      }
      if (material.classroomId !== input.classroomId) {
        fail('VALIDATION', 'The chosen material belongs to another class.', 422)
      }
      if (material.status !== 'ready') {
        fail('CONFLICT', 'The chosen material is not ready for grounding yet.', 409)
      }
      return {
        kind: 'material',
        materialId: material.id,
        unitId: material.unitId,
        label: material.title,
      }
    }

    const unit = requireUnit(input.source.unitId)
    return {
      kind: 'curriculum_unit',
      materialId: null,
      unitId: unit.id,
      label: unit.title,
    }
  }

  // ---------------------------------------------------------------------------
  // Mohsen grounding (deterministic retrieval — not an AI model)
  // ---------------------------------------------------------------------------

  function studentCanAccessUnit(userId: UserId, unitId: string): boolean {
    const enrolledClassIds = db.enrollments
      .filter((item) => item.studentId === userId)
      .map((item) => item.classroomId)
    return db.classrooms.some(
      (classroom) =>
        enrolledClassIds.includes(classroom.id) &&
        classroom.unitIds.includes(unitId),
    )
  }

  function resolveCandidates(
    user: User,
    scope: AskMohsenInput['scope'],
  ): GroundingCandidate[] {
    const candidates = new Map<string, GroundingCandidate>()

    const addMaterial = (materialId: string): void => {
      const material = requireMaterial(materialId)
      const allowed =
        user.role === 'teacher'
          ? material.teacherId === user.id
          : isEnrolled(material.classroomId, user.id)
      if (!allowed) {
        fail('FORBIDDEN', 'This material is not available to the current user.', 403)
      }
      if (material.status !== 'ready' || !material.textContent) return
      if (candidates.has(`material:${material.id}`)) return
      candidates.set(`material:${material.id}`, {
        key: `material:${material.id}`,
        text: material.textContent,
        grounding: {
          kind: 'material',
          materialId: material.id,
          unitId: material.unitId,
          label: material.title,
          excerpt: null,
        },
      })
    }

    const addUnit = (unitId: string): void => {
      const unit = requireUnit(unitId)
      if (user.role === 'student' && !studentCanAccessUnit(user.id, unit.id)) {
        fail('FORBIDDEN', 'This unit is not available to the current user.', 403)
      }
      if (candidates.has(`unit:${unit.id}`)) return
      candidates.set(`unit:${unit.id}`, {
        key: `unit:${unit.id}`,
        text: `${unit.title}. ${unit.description ?? ''}`,
        grounding: {
          kind: 'curriculum_unit',
          materialId: null,
          unitId: unit.id,
          label: unit.title,
          excerpt: null,
        },
      })
    }

    if (scope.testId) {
      const test = requireVisibleTest(scope.testId, user)
      if (test.source.kind === 'material') {
        addMaterial(test.source.materialId)
      } else {
        addUnit(test.source.unitId)
      }
    }

    for (const materialId of scope.materialIds) {
      addMaterial(materialId)
    }

    if (scope.unitId) addUnit(scope.unitId)

    if (scope.classroomId) {
      const classroom = requireVisibleClassroom(scope.classroomId, user)
      for (const material of db.materials) {
        if (
          material.classroomId === classroom.id &&
          material.status === 'ready'
        ) {
          addMaterial(material.id)
        }
      }
      for (const unitId of classroom.unitIds) addUnit(unitId)
    }

    if (candidates.size === 0 && user.role === 'teacher') {
      for (const material of db.materials) {
        if (material.teacherId === user.id) addMaterial(material.id)
      }
      for (const classroom of db.classrooms) {
        if (classroom.teacherId === user.id) {
          for (const unitId of classroom.unitIds) addUnit(unitId)
        }
      }
    }

    return [...candidates.values()]
  }

  function refusalAnswer(): MohsenAnswer {
    return {
      status: 'not_grounded',
      answer: NOT_GROUNDED_ANSWER,
      grounding: [],
    }
  }

  /**
   * Grounding integrity guard: an answered result is only allowed to stand when
   * at least one grounding ref carries a real label and a real excerpt. If the
   * retrieval pipeline ever produced an ungrounded "answer", it is downgraded to
   * the honest refusal instead of being shown.
   */
  function hasUsableGrounding(grounding: readonly GroundingRef[]): boolean {
    return (
      grounding.length > 0 &&
      grounding.every(
        (ref) =>
          ref.label.trim().length > 0 &&
          (ref.excerpt ?? '').trim().length > 0,
      )
    )
  }

  function answerQuestion(
    question: string,
    candidates: GroundingCandidate[],
  ): MohsenAnswer {
    const tokens = tokenize(question)
    if (tokens.length === 0 || candidates.length === 0) {
      return refusalAnswer()
    }

    const grounded = candidates
      .map((candidate) => {
        const normalized = normalizeText(candidate.text)
        const score = tokens.reduce(
          (total, token) => (normalized.includes(token) ? total + 1 : total),
          0,
        )
        return {
          candidate,
          score,
          excerpt: supportingExcerpt(candidate.text, tokens),
        }
      })
      // A candidate only counts when it matches the question *and* a sentence
      // in it can be quoted as evidence.
      .filter(
        (entry): entry is {
          candidate: GroundingCandidate
          score: number
          excerpt: string
        } => entry.score > 0 && entry.excerpt !== null,
      )
      .sort((left, right) => right.score - left.score)

    const threshold = tokens.length >= 3 ? 2 : 1
    const top = grounded[0]
    if (!top || top.score < threshold) {
      return refusalAnswer()
    }

    const grounding: GroundingRef[] = grounded
      .slice(0, 2)
      .map((entry) => ({ ...entry.candidate.grounding, excerpt: entry.excerpt }))

    if (!hasUsableGrounding(grounding)) {
      return refusalAnswer()
    }

    const source = top.candidate.grounding
    const answer =
      source.kind === 'material'
        ? `وفقًا للمادة «${source.label}»: ${top.excerpt}`
        : `وفقًا لوحدة «${source.label}» في المنهج المقرر: ${top.excerpt}`

    return { status: 'answered', answer, grounding }
  }

  // ---------------------------------------------------------------------------
  // Parent, RBAC and in-app chat (display-only / mock)
  // ---------------------------------------------------------------------------

  function requireParent(): User {
    const user = currentUser()
    if (user.role !== 'parent') {
      fail('FORBIDDEN', 'This action requires the parent role.', 403)
    }
    return user
  }

  function childrenOf(parentId: UserId): User[] {
    const ids = db.parentLinks[parentId] ?? []
    return ids
      .map((id) => userById(id))
      .filter((user): user is User => user !== undefined)
  }

  function parentChild(child: User) {
    const enrollment = db.enrollments.find((item) => item.studentId === child.id)
    const classroom = enrollment ? requireClassroom(enrollment.classroomId) : null
    return {
      student: child,
      classroomId: classroom?.id ?? null,
      classroomName: classroom?.name ?? null,
      gradeLevel: classroom?.gradeLevel ?? '',
    }
  }

  function parentOverview(childId: UserId, parent: User): ParentOverview {
    const linked = (db.parentLinks[parent.id] ?? []).includes(childId)
    if (!linked) {
      fail('FORBIDDEN', 'This child is not linked to the signed-in parent.', 403)
    }
    const child = requireUser(childId)
    if (child.role !== 'student') {
      fail('VALIDATION', 'The requested user is not a student.', 422)
    }
    const childInfo = parentChild(child)
    const enrollment = db.enrollments.find(
      (item) => item.studentId === child.id && item.classroomId === childInfo.classroomId,
    )
    const classroom = childInfo.classroomId
      ? requireClassroom(childInfo.classroomId)
      : null

    const units: ParentOverview['progress']['units'] = classroom
      ? classroom.unitIds.map((unitId) => {
          const unit = requireUnit(unitId)
          const progress = enrollment?.progressByUnit[unitId]
          return {
            unitId: unit.id,
            unitTitle: unit.title,
            progressPercent: progress?.progressPercent ?? 0,
            lessonsCompleted: progress?.lessonsCompleted ?? 0,
          }
        })
      : []
    const overallPercent =
      units.length === 0
        ? 0
        : Math.round(
            units.reduce((total, unit) => total + unit.progressPercent, 0) /
              units.length,
          )

    const attempts = db.attempts.filter((item) => item.studentId === child.id)
    const attemptFor = (testId: string): MockAttempt | undefined =>
      attempts.find((item) => item.testId === testId)

    const classTests = classroom
      ? db.tests
          .filter(
            (test) =>
              test.classroomId === classroom.id && test.status === 'published',
          )
          .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      : []

    const tests = classTests.map((test) => {
      const attempt = attemptFor(test.id)
      const status = attempt
        ? attempt.status
        : ('not_started' as const)
      return {
        id: test.id,
        title: test.title,
        classroomName: classroom?.name ?? '',
        status,
        questionCount: questionsForTest(test.id).length,
        answeredCount: attempt?.answeredCount ?? 0,
        submittedAt: attempt?.submittedAt ?? null,
      }
    })

    const results: ParentOverview['results'] = attempts
      .filter((attempt) => attempt.status === 'submitted')
      .sort((left, right) =>
        (right.submittedAt ?? '').localeCompare(left.submittedAt ?? ''),
      )
      .map((attempt) => {
        const test = requireTest(attempt.testId)
        const classRoom = requireClassroom(test.classroomId)
        return {
          attemptId: attempt.id,
          testId: test.id,
          testTitle: test.title,
          classroomName: classRoom.name,
          submittedAt: attempt.submittedAt,
          answeredCount: attempt.answeredCount,
          questionCount: attempt.questionCount,
          // Backend-supplied only. The UI never computes this.
          scorePercent: db.resultScores[attempt.id] ?? null,
        }
      })

    return {
      child: childInfo,
      progress: {
        childId: child.id,
        overallPercent,
        completedUnits: units.filter((unit) => unit.progressPercent >= 100).length,
        totalUnits: units.length,
        units,
        lastActiveAt: enrollment?.lastActiveAt ?? null,
      },
      tests,
      results,
    }
  }

  function threadsForUser(user: User): MessageThread[] {
    if (user.role === 'parent') {
      return db.threads.filter(
        (thread) =>
          thread.id === seedIds.threadTeacher ||
          thread.id === seedIds.threadAssistant,
      )
    }
    if (user.role === 'teacher') {
      return db.threads.filter(
        (thread) => thread.id === seedIds.threadTeacherAssistant,
      )
    }
    return []
  }

  function messagesForThread(threadId: string, viewer: User): Message[] {
    return db.messages
      .filter((message) => message.threadId === threadId)
      .sort((left, right) => left.sentAt.localeCompare(right.sentAt))
      .map((message) => ({
        ...message,
        // `fromMe` is relative to the signed-in user: the same stored message is
        // "mine" for its author and "theirs" for the other participant.
        fromMe: message.author.role === viewer.role,
      }))
  }

  // ---------------------------------------------------------------------------
  // Public API — every method is PROPOSED (see contract.ts)
  // ---------------------------------------------------------------------------

  return {
    contractVersion: CONTRACT_VERSION,
    mode: 'mock',

    auth: {
      getSession: () =>
        respond<Session | null>(() => {
          if (!db.sessionUserId) return null
          return { user: requireUser(db.sessionUserId), expiresAt: null }
        }),

      signIn: (input: SignInInput) =>
        respond<Session>(() => {
          const email = input.email.trim().toLowerCase()
          if (!email || input.password.trim().length === 0) {
            fail('VALIDATION', 'Email and password are required.', 422)
          }
          const user = db.users.find(
            (candidate) => candidate.email.toLowerCase() === email,
          )
          if (!user) {
            fail('UNAUTHENTICATED', 'No mock user matches these credentials.', 401)
          }
          db.sessionUserId = user.id
          return { user, expiresAt: null }
        }),

      signOut: () =>
        respond<void>(() => {
          db.sessionUserId = null
        }),
    },

    teachers: {
      getProfile: (input) =>
        respond<TeacherProfile>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          const classes = db.classrooms.filter(
            (classroom) => classroom.teacherId === teacher.id,
          )
          return {
            user: teacher,
            subjectIds: [...new Set(classes.map((classroom) => classroom.subjectId))],
            gradeLevels: [
              ...new Set(classes.map((classroom) => classroom.gradeLevel)),
            ],
          }
        }),

      getDashboard: (input) =>
        respond<TeacherDashboard>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          const classes = db.classrooms.filter(
            (classroom) => classroom.teacherId === teacher.id,
          )
          const classIds = new Set(classes.map((classroom) => classroom.id))
          const tests = db.tests.filter((test) => test.teacherId === teacher.id)
          const enrollments = db.enrollments.filter((enrollment) =>
            classIds.has(enrollment.classroomId),
          )
          return {
            teacher,
            classes: classes.map(classSummary),
            recentTests: tests
              .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
              .slice(0, 5)
              .map(testSummary),
            studentProgress: enrollments
              .map((enrollment) =>
                studentSnapshot(
                  enrollment,
                  requireClassroom(enrollment.classroomId),
                ),
              )
              .sort((left, right) => left.progressPercent - right.progressPercent),
            totals: {
              classes: classes.length,
              students: new Set(enrollments.map((item) => item.studentId)).size,
              publishedTests: tests.filter((test) => test.status === 'published')
                .length,
              draftTests: tests.filter((test) => test.status === 'draft').length,
            },
          }
        }),
    },

    students: {
      getProfile: (input) =>
        respond<StudentProfile>(() => {
          const user = currentUser()
          if (user.role === 'student' && user.id !== input.studentId) {
            fail('FORBIDDEN', 'A student may only read their own profile.', 403)
          }
          const student = requireUser(input.studentId)
          if (student.role !== 'student') {
            fail('VALIDATION', 'The requested user is not a student.', 422)
          }
          const enrollments = db.enrollments.filter(
            (item) => item.studentId === student.id,
          )
          const firstClass =
            enrollments.length > 0
              ? requireClassroom(enrollments[0]!.classroomId)
              : null
          return {
            user: student,
            gradeLevel: firstClass?.gradeLevel ?? '',
            classroomIds: enrollments.map((item) => item.classroomId),
          }
        }),

      getProgress: (input) =>
        respond<StudentProgress>(() => {
          const user = currentUser()
          const student = requireUser(input.studentId)
          if (student.role !== 'student') {
            fail('VALIDATION', 'The requested user is not a student.', 422)
          }
          if (user.role === 'student' && user.id !== student.id) {
            fail('FORBIDDEN', 'A student may only read their own progress.', 403)
          }
          const enrollments = db.enrollments.filter(
            (item) => item.studentId === student.id,
          )
          const enrollment = input.classroomId
            ? enrollments.find((item) => item.classroomId === input.classroomId)
            : enrollments[0]
          if (!enrollment) {
            fail('NOT_FOUND', 'No progress record exists for this student.', 404)
          }
          const classroom = requireClassroom(enrollment.classroomId)
          const units: StudentUnitProgress[] = classroom.unitIds.map((unitId) => {
            const unit = requireUnit(unitId)
            const progress = enrollment.progressByUnit[unitId]
            return {
              unit,
              progressPercent: progress?.progressPercent ?? 0,
              lessonsCompleted: progress?.lessonsCompleted ?? 0,
            }
          })
          const overall =
            units.length === 0
              ? 0
              : Math.round(
                  units.reduce((total, unit) => total + unit.progressPercent, 0) /
                    units.length,
                )
          return {
            student,
            classroomId: classroom.id,
            overallPercent: overall,
            units,
            lastActiveAt: enrollment.lastActiveAt,
          }
        }),
    },

    rbac: {
      getCapabilities: (input) =>
        respond<UserCapabilities>(() => {
          const user = currentUser()
          if (user.id !== input.userId) {
            fail('FORBIDDEN', 'A user may only read their own capabilities.', 403)
          }
          return {
            userId: user.id,
            items: db.capabilities[user.id] ?? [],
          }
        }),
    },

    parents: {
      getProfile: () =>
        respond<ParentProfile>(() => {
          const parent = requireParent()
          return { user: parent, children: childrenOf(parent.id).map(parentChild) }
        }),

      getOverview: (input) =>
        respond<ParentOverview>(() => {
          const parent = requireParent()
          return parentOverview(input.childId, parent)
        }),
    },

    messages: {
      listThreads: () =>
        respond<MessageThread[]>(() => {
          const user = currentUser()
          return threadsForUser(user).sort((left, right) =>
            right.lastMessageAt.localeCompare(left.lastMessageAt),
          )
        }),

      listMessages: (input) =>
        respond<Message[]>(() => {
          const user = currentUser()
          const thread = threadsForUser(user).find(
            (item) => item.id === input.threadId,
          )
          if (!thread) {
            fail('NOT_FOUND', 'This conversation is not available.', 404)
          }
          return messagesForThread(thread.id, user)
        }),

      sendMessage: (input: SendMessageInput) =>
        respond<SendMessageResult>(() => {
          const user = currentUser()
          const body = input.body.trim()
          if (body.length === 0) {
            fail('VALIDATION', 'A message body is required.', 422)
          }
          const thread = threadsForUser(user).find(
            (item) => item.id === input.threadId,
          )
          if (!thread) {
            fail('NOT_FOUND', 'This conversation is not available.', 404)
          }
          const timestamp = nowIso()
          const sent: Message = {
            id: nextId('msg'),
            threadId: thread.id,
            author: {
              role: user.role === 'parent' ? 'parent' : 'teacher',
              name: user.displayName,
            },
            fromMe: true,
            body,
            sentAt: timestamp,
          }
          const reply: Message = {
            id: nextId('msg'),
            threadId: thread.id,
            author: thread.participant,
            fromMe: false,
            body:
              thread.participant.role === 'assistant'
                ? 'وصلت رسالتك، هتابع الموضوع وأرد عليك في أقرب وقت.'
                : 'شكرًا لتواصلك، هرد عليك بالتفاصيل حالًا.',
            sentAt: timestamp,
          }
          db.messages.push(sent, reply)
          thread.lastMessageAt = timestamp
          return { messages: [sent, reply], repliedBy: thread.participant }
        }),
    },

    classrooms: {
      listForTeacher: (input) =>
        respond<ClassroomSummary[]>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          return db.classrooms
            .filter((classroom) => classroom.teacherId === teacher.id)
            .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
            .map(classSummary)
        }),

      get: (input) =>
        respond<ClassroomDetail>(() => {
          const user = currentUser()
          const classroom = requireVisibleClassroom(input.classroomId, user)
          return classDetail(classroom)
        }),

      listStudents: (input) =>
        respond<ClassroomStudent[]>(() => {
          const teacher = currentUser()
          if (teacher.role !== 'teacher') {
            fail('FORBIDDEN', 'Only a teacher can read the class roster.', 403)
          }
          const classroom = requireClassroom(input.classroomId)
          assertClassOwned(classroom, teacher.id)
          return db.enrollments
            .filter((item) => item.classroomId === classroom.id)
            .map((item) => {
              const student = requireUser(item.studentId)
              const totalPercent = classroom.unitIds.reduce(
                (total, unitId) =>
                  total + (item.progressByUnit[unitId]?.progressPercent ?? 0),
                0,
              )
              return {
                student,
                progressPercent:
                  classroom.unitIds.length === 0
                    ? 0
                    : Math.round(totalPercent / classroom.unitIds.length),
                lastActiveAt: item.lastActiveAt,
              }
            })
            .sort((left, right) =>
              left.student.displayName.localeCompare(right.student.displayName, 'ar'),
            )
        }),
    },

    curriculum: {
      listSubjects: (input) =>
        respond<CurriculumSubject[]>(() => {
          const subjects = input?.gradeLevel
            ? db.subjects.filter(
                (subject) => subject.gradeLevel === input.gradeLevel,
              )
            : db.subjects
          return [...subjects]
        }),

      listUnits: (input) =>
        respond<CurriculumUnit[]>(() => {
          requireSubject(input.subjectId)
          return db.units
            .filter((unit) => unit.subjectId === input.subjectId)
            .sort((left, right) => left.order - right.order)
        }),

      getUnit: (input) =>
        respond<CurriculumUnit>(() => requireUnit(input.unitId)),
    },

    materials: {
      listForTeacher: (input) =>
        respond<Material[]>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          return db.materials
            .filter(
              (material) =>
                material.teacherId === teacher.id &&
                (input.classroomId === undefined ||
                  material.classroomId === input.classroomId),
            )
            .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        }),

      get: (input) =>
        respond<Material>(() => {
          const material = requireMaterial(input.materialId)
          const user = requireSelf('teacher', material.teacherId)
          if (material.teacherId !== user.id) {
            fail('FORBIDDEN', 'This material is not available.', 403)
          }
          return material
        }),

      create: (input: CreateMaterialInput) =>
        respond<Material>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          const classroom = requireClassroom(input.classroomId)
          assertClassOwned(classroom, teacher.id)
          if (input.unitId && !classroom.unitIds.includes(input.unitId)) {
            fail('VALIDATION', 'The chosen unit is not part of this class.', 422)
          }
          const title = validateTitle(input.title, 'Material title')
          if (input.kind === 'text' && !input.textContent?.trim()) {
            fail('VALIDATION', 'Text material needs text content.', 422)
          }
          if (input.kind === 'link' && !input.sourceUrl?.trim()) {
            fail('VALIDATION', 'Link material needs a URL.', 422)
          }
          const textContent =
            input.kind === 'text' ? (input.textContent?.trim() ?? null) : null
          const material: Material = {
            id: nextId('mat'),
            teacherId: teacher.id,
            classroomId: classroom.id,
            unitId: input.unitId,
            title,
            kind: input.kind,
            status:
              input.kind === 'text' || input.kind === 'link'
                ? 'ready'
                : 'processing',
            textContent,
            sourceUrl: input.sourceUrl?.trim() || null,
            wordCount: textContent ? textContent.split(/\s+/).length : null,
            createdAt: nowIso(),
          }
          db.materials.unshift(material)
          return material
        }),

      delete: (input) =>
        respond<void>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          const material = requireMaterial(input.materialId)
          if (material.teacherId !== teacher.id) {
            fail('FORBIDDEN', 'A teacher may only delete their own material.', 403)
          }
          const referenced = db.tests.some(
            (test) =>
              test.source.kind === 'material' &&
              test.source.materialId === material.id,
          )
          if (referenced) {
            fail(
              'CONFLICT',
              'This material is used by a test and cannot be deleted yet.',
              409,
            )
          }
          db.materials = db.materials.filter((item) => item.id !== material.id)
        }),
    },

    tests: {
      listForTeacher: (input) =>
        respond<TestSummary[]>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          return db.tests
            .filter((test) => test.teacherId === teacher.id)
            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
            .map(testSummary)
        }),

      listForClass: (input) =>
        respond<TestSummary[]>(() => {
          const user = currentUser()
          const classroom = requireVisibleClassroom(input.classroomId, user)
          return db.tests
            .filter(
              (test) =>
                test.classroomId === classroom.id && test.status === 'published',
            )
            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
            .map(testSummary)
        }),

      get: (input) =>
        respond<Test>(() => {
          const user = currentUser()
          return testDetail(requireVisibleTest(input.testId, user))
        }),

      createDraft: (input: CreateTestDraftInput) =>
        respond<Test>(() => {
          const teacher = requireSelf('teacher', input.teacherId)
          const classroom = requireClassroom(input.classroomId)
          assertClassOwned(classroom, teacher.id)
          const title = validateTitle(input.title, 'Test title')
          const source = validateDraftSource(input)
          if (
            source.kind === 'curriculum_unit' &&
            !classroom.unitIds.includes(source.unitId)
          ) {
            fail('VALIDATION', 'The chosen unit is not part of this class.', 422)
          }
          const timestamp = nowIso()
          const test: MockTest = {
            id: nextId('test'),
            teacherId: teacher.id,
            classroomId: classroom.id,
            title,
            description: input.description?.trim() || null,
            status: 'draft',
            source,
            createdAt: timestamp,
            updatedAt: timestamp,
            publishedAt: null,
          }
          db.tests.unshift(test)
          return testDetail(test)
        }),

      update: (input: UpdateTestInput & { teacherId: UserId; testId: string }) =>
        respond<Test>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          if (input.title !== undefined) {
            test.title = validateTitle(input.title, 'Test title')
          }
          if (input.description !== undefined) {
            test.description = input.description?.trim() || null
          }
          test.updatedAt = nowIso()
          return testDetail(test)
        }),

      publish: (input) =>
        respond<Test>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          if (questionsForTest(test.id).length === 0) {
            fail('VALIDATION', 'A test needs at least one question to publish.', 422)
          }
          if (test.source.kind === 'material') {
            const material = requireMaterial(test.source.materialId)
            if (material.status !== 'ready') {
              fail('CONFLICT', 'The grounding material is not ready.', 409)
            }
          }
          const timestamp = nowIso()
          test.status = 'published'
          test.publishedAt = timestamp
          test.updatedAt = timestamp
          return testDetail(test)
        }),

      delete: (input) =>
        respond<void>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          db.tests = db.tests.filter((item) => item.id !== test.id)
          db.questions = db.questions.filter((item) => item.testId !== test.id)
          db.attempts = db.attempts.filter((item) => item.testId !== test.id)
        }),
    },

    questions: {
      listForTest: (input) =>
        respond<Question[]>(() => {
          // Full questions carry `correctOptionId`, so this is teacher-only.
          // Student sessions read questions through `listForStudentTest`.
          const teacher = requireActor('teacher')
          requireVisibleTest(input.testId, teacher)
          return questionsForTest(input.testId)
        }),

      listForStudentTest: (input) =>
        respond<StudentQuestion[]>(() => {
          const user = currentUser()
          requireVisibleTest(input.testId, user)
          return questionsForTest(input.testId).map(toStudentQuestion)
        }),

      create: (input: CreateQuestionInput & { teacherId: UserId; testId: string }) =>
        respond<Question>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          const prompt = validateTitle(input.prompt, 'Question prompt')
          const texts = validateOptions(input.options, input.correctOptionIndex)
          const id = nextId('q')
          const options = buildOptions(id, texts)
          const timestamp = nowIso()
          const question: Question = {
            id,
            testId: test.id,
            order: questionsForTest(test.id).length + 1,
            prompt,
            options,
            correctOptionId: correctOptionIdFor(options, input.correctOptionIndex),
            grounding: [],
            origin: 'teacher',
            createdAt: timestamp,
            updatedAt: timestamp,
          }
          db.questions.push(question)
          test.updatedAt = timestamp
          return question
        }),

      update: (
        input: UpdateQuestionInput & {
          teacherId: UserId
          testId: string
          questionId: string
        },
      ) =>
        respond<Question>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          const question = db.questions.find(
            (item) =>
              item.id === input.questionId && item.testId === test.id,
          )
          if (!question) {
            fail('NOT_FOUND', 'Question not found in this test.', 404)
          }

          if (input.prompt !== undefined) {
            question.prompt = validateTitle(input.prompt, 'Question prompt')
          }

          if (input.options !== undefined) {
            if (!('correctOptionIndex' in input)) {
              fail(
                'VALIDATION',
                'correctOptionIndex must be supplied when options are replaced.',
                422,
              )
            }
            const texts = validateOptions(input.options, input.correctOptionIndex ?? null)
            question.options = buildOptions(question.id, texts)
            question.correctOptionId = correctOptionIdFor(
              question.options,
              input.correctOptionIndex ?? null,
            )
          } else if (input.correctOptionIndex !== undefined) {
            question.correctOptionId = correctOptionIdFor(
              question.options,
              input.correctOptionIndex,
            )
          }

          question.updatedAt = nowIso()
          test.updatedAt = question.updatedAt
          return question
        }),

      delete: (input) =>
        respond<void>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          const exists = db.questions.some(
            (item) =>
              item.id === input.questionId && item.testId === test.id,
          )
          if (!exists) fail('NOT_FOUND', 'Question not found in this test.', 404)
          db.questions = db.questions.filter(
            (item) => item.id !== input.questionId,
          )
          questionsForTest(test.id).forEach((question, index) => {
            question.order = index + 1
          })
          test.updatedAt = nowIso()
        }),

      reorder: (
        input: ReorderQuestionsInput & { teacherId: UserId; testId: string },
      ) =>
        respond<Question[]>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          const existing = questionsForTest(test.id)
          const currentIds = new Set(existing.map((question) => question.id))
          const nextIds = new Set(input.questionIds)
          if (
            nextIds.size !== input.questionIds.length ||
            nextIds.size !== currentIds.size ||
            input.questionIds.some((id) => !currentIds.has(id))
          ) {
            fail(
              'VALIDATION',
              'Reorder input must contain every question exactly once.',
              422,
            )
          }
          input.questionIds.forEach((id, index) => {
            const question = existing.find((item) => item.id === id)
            if (question) question.order = index + 1
          })
          test.updatedAt = nowIso()
          return questionsForTest(test.id)
        }),
    },

    attempts: {
      listForStudent: (input) =>
        respond<AttemptSummary[]>(() => {
          requireSelf('student', input.studentId)
          return db.attempts
            .filter((attempt) => attempt.studentId === input.studentId)
            .sort((left, right) => right.startedAt.localeCompare(left.startedAt))
            .map(attemptSummary)
        }),

      /**
       * PROPOSED — NEW in Batch 2, teacher-only. Returns every attempt on the
       * teacher's own test, newest activity first, with the backend-supplied
       * score. A student session, or a teacher who does not own the test, is
       * refused; nothing is marked or computed here.
       */
      listForTest: (input) =>
        respond<TestAttemptSummary[]>(() => {
          const teacher = requireActor('teacher')
          const test = requireVisibleTest(input.testId, teacher)
          return db.attempts
            .filter((attempt) => attempt.testId === test.id)
            .sort((left, right) =>
              (right.submittedAt ?? right.startedAt).localeCompare(
                left.submittedAt ?? left.startedAt,
              ),
            )
            .map(teacherAttemptSummary)
        }),

      start: (input: StartAttemptInput) =>
        respond<Attempt>(() => {
          const student = requireSelf('student', input.studentId)
          const test = requireVisibleTest(input.testId, student)
          if (test.status !== 'published') {
            fail('CONFLICT', 'Only published tests can be started.', 409)
          }
          const existing = db.attempts.find(
            (attempt) =>
              attempt.testId === test.id && attempt.studentId === student.id,
          )
          if (existing) {
            if (existing.status === 'submitted') {
              fail('CONFLICT', 'This test has already been submitted.', 409)
            }
            return attemptDetail(existing)
          }
          const attempt: MockAttempt = {
            id: nextId('attempt'),
            testId: test.id,
            testTitle: test.title,
            classroomId: test.classroomId,
            classroomName: requireClassroom(test.classroomId).name,
            studentId: student.id,
            status: 'in_progress',
            answeredCount: 0,
            questionCount: questionsForTest(test.id).length,
            answers: questionsForTest(test.id).map((question) => ({
              questionId: question.id,
              optionId: null,
              answeredAt: null,
            })),
            startedAt: nowIso(),
            submittedAt: null,
          }
          db.attempts.push(attempt)
          return attemptDetail(attempt)
        }),

      get: (input) =>
        respond<Attempt>(() => {
          const student = currentUser()
          if (student.role !== 'student') {
            fail('FORBIDDEN', 'Only the student can open their attempt.', 403)
          }
          const attempt = requireAttempt(input.attemptId)
          if (attempt.studentId !== student.id) {
            fail('FORBIDDEN', 'A student may only open their own attempt.', 403)
          }
          return attemptDetail(attempt)
        }),

      saveAnswer: (input: SaveAnswerInput) =>
        respond<Attempt>(() => {
          const student = requireActor('student')
          const attempt = requireAttempt(input.attemptId)
          if (attempt.studentId !== student.id) {
            fail('FORBIDDEN', 'A student may only answer their own attempt.', 403)
          }
          if (attempt.status !== 'in_progress') {
            fail('CONFLICT', 'This attempt is already submitted.', 409)
          }
          const test = requireTest(attempt.testId)
          const question = db.questions.find(
            (item) =>
              item.id === input.questionId && item.testId === test.id,
          )
          if (!question) {
            fail('NOT_FOUND', 'Question not found in this attempt.', 404)
          }
          if (!question.options.some((option) => option.id === input.optionId)) {
            fail('VALIDATION', 'The chosen option is not part of this question.', 422)
          }
          const answer = attempt.answers.find(
            (item) => item.questionId === input.questionId,
          )
          if (answer) {
            answer.optionId = input.optionId
            answer.answeredAt = nowIso()
          }
          const enrollment = enrollmentFor(test.classroomId, student.id)
          if (enrollment) enrollment.lastActiveAt = nowIso()
          return attemptDetail(attempt)
        }),

      submit: (input: SubmitAttemptInput) =>
        respond<Attempt>(() => {
          const student = requireActor('student')
          const attempt = requireAttempt(input.attemptId)
          if (attempt.studentId !== student.id) {
            fail('FORBIDDEN', 'A student may only submit their own attempt.', 403)
          }
          if (attempt.status !== 'in_progress') {
            fail('CONFLICT', 'This attempt is already submitted.', 409)
          }
          const timestamp = nowIso()
          attempt.status = 'submitted'
          attempt.submittedAt = timestamp
          const test = requireTest(attempt.testId)
          const enrollment = enrollmentFor(test.classroomId, student.id)
          if (enrollment) enrollment.lastActiveAt = timestamp
          return attemptDetail(attempt)
        }),
    },

    mohsen: {
      ask: (input: AskMohsenInput) =>
        respond<MohsenAnswer>(() => {
          const user = currentUser()
          if (input.askedBy !== user.id) {
            fail('FORBIDDEN', 'Mohsen answers only for the signed-in user.', 403)
          }
          if (input.question.trim().length === 0) {
            fail('VALIDATION', 'A question is required.', 422)
          }
          const candidates = resolveCandidates(user, input.scope)
          return answerQuestion(input.question, candidates)
        }),

      draftQuestions: (input: DraftQuestionsInput) =>
        respond<DraftQuestionsResult>(() => {
          const test = requireOwnedDraftTest(input.testId, input.teacherId)
          if (
            !Number.isInteger(input.count) ||
            input.count < 1 ||
            input.count > 10
          ) {
            fail('VALIDATION', 'count must be an integer between 1 and 10.', 422)
          }

          const key =
            test.source.kind === 'material'
              ? `material:${test.source.materialId}`
              : `unit:${test.source.unitId}`
          const bank = mockQuestionBank[key]
          if (!bank || bank.length === 0) {
            return {
              status: 'no_grounding',
              questions: [],
              grounding: [],
              message: NO_DRAFT_SOURCE,
            }
          }

          const groundingBase = (): GroundingRef => {
            if (test.source.kind === 'material') {
              const material = requireMaterial(test.source.materialId)
              return {
                kind: 'material',
                materialId: material.id,
                unitId: material.unitId,
                label: material.title,
                excerpt: null,
              }
            }
            const unit = requireUnit(test.source.unitId)
            return {
              kind: 'curriculum_unit',
              materialId: null,
              unitId: unit.id,
              label: unit.title,
              excerpt: null,
            }
          }

          const existingQuestions = questionsForTest(test.id)
          const existingCount = existingQuestions.length
          const existingPrompts = new Set(
            existingQuestions.map((question) => question.prompt),
          )
          const available = bank.filter(
            (item) => !existingPrompts.has(item.prompt),
          )
          if (available.length === 0) {
            return {
              status: 'no_grounding',
              questions: [],
              grounding: [],
              message: NO_MORE_DRAFT_SOURCE,
            }
          }

          const timestamp = nowIso()
          const created = available.slice(0, input.count).map((item, index) => {
            const id = nextId('q')
            const options = buildOptions(id, item.options)
            const question: Question = {
              id,
              testId: test.id,
              order: existingCount + index + 1,
              prompt: item.prompt,
              options,
              correctOptionId: correctOptionIdFor(options, item.correctIndex),
              grounding: [{ ...groundingBase(), excerpt: item.excerpt }],
              origin: 'mohsen',
              createdAt: timestamp,
              updatedAt: timestamp,
            }
            db.questions.push(question)
            return question
          })

          test.updatedAt = timestamp
          const grounding = [
            ...new Map(
              created
                .flatMap((question) => question.grounding)
                .map((item) => [
                  `${item.kind}:${item.materialId ?? item.unitId}`,
                  item,
                ]),
            ).values(),
          ]

          return { status: 'drafted', questions: created, grounding }
        }),
    },

    system: {
      getInfo: () =>
        respond(() => ({
          contractVersion: CONTRACT_VERSION,
          mode: 'mock' as const,
          mockScenario: options.scenario ?? 'seeded',
          endpointStatus: 'PROPOSED' as const,
        })),
    },
  }
}
