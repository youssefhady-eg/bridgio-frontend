import type {
  AdapterInfo,
  AskMohsenInput,
  Attempt,
  AttemptId,
  AttemptSummary,
  ClassroomDetail,
  ClassroomId,
  ClassroomStudent,
  ClassroomSummary,
  CreateMaterialInput,
  CreateQuestionInput,
  CreateTestDraftInput,
  CurriculumSubject,
  CurriculumUnit,
  DraftQuestionsInput,
  DraftQuestionsResult,
  Material,
  MaterialId,
  MohsenAnswer,
  Question,
  QuestionId,
  ReorderQuestionsInput,
  SaveAnswerInput,
  Session,
  SignInInput,
  StartAttemptInput,
  StudentProfile,
  StudentProgress,
  StudentQuestion,
  SubjectId,
  SubmitAttemptInput,
  TeacherDashboard,
  TeacherProfile,
  Test,
  TestId,
  TestSummary,
  UnitId,
  UpdateQuestionInput,
  UpdateTestInput,
  UserId,
} from './types'

/**
 * BRIDGIO API CONTRACT v0.1 — PROPOSED ONLY.
 *
 * Mentingo's local source was deleted by the owner (2026-11-01), so there are NO
 * confirmed Mentingo endpoints in this build. EVERY method below is
 * "PROPOSED — Mentingo to implement on restore/rebuild". Do not present any
 * method or shape as an existing Mentingo API.
 *
 * One layer only: screens/components call this interface (through the exported
 * client), never `fetch`. The mock adapter and the HTTP adapter implement this
 * same interface, method names and request/response shapes. Swapping mock for
 * the real backend is a configuration change (`VITE_API_ADAPTER` + `VITE_API_URL`),
 * not a screen rewrite.
 *
 * Auth note: Mentingo owns auth/users/roles. The exact auth transport is an open
 * integration gap. No token is exposed by this contract.
 */
export interface BridgioApi {
  readonly contractVersion: string
  readonly mode: 'mock' | 'http'

  auth: {
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    getSession(): Promise<Session | null>
    /** PROPOSED — credential shape unconfirmed; delegates to Mentingo auth when available. */
    signIn(input: SignInInput): Promise<Session>
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    signOut(): Promise<void>
  }

  teachers: {
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    getProfile(input: { teacherId: UserId }): Promise<TeacherProfile>
    /** PROPOSED — dashboard aggregate for Stage 2. */
    getDashboard(input: { teacherId: UserId }): Promise<TeacherDashboard>
  }

  students: {
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    getProfile(input: { studentId: UserId }): Promise<StudentProfile>
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    getProgress(input: {
      studentId: UserId
      classroomId?: ClassroomId
    }): Promise<StudentProgress>
  }

  classrooms: {
    /** PROPOSED — teacher's classes for the dashboard. */
    listForTeacher(input: { teacherId: UserId }): Promise<ClassroomSummary[]>
    /** PROPOSED — class detail with units. */
    get(input: { classroomId: ClassroomId }): Promise<ClassroomDetail>
    /** PROPOSED — roster with at-a-glance progress. */
    listStudents(input: {
      classroomId: ClassroomId
    }): Promise<ClassroomStudent[]>
  }

  curriculum: {
    /** PROPOSED — fixed Egyptian curriculum projection. */
    listSubjects(input?: { gradeLevel?: string }): Promise<CurriculumSubject[]>
    /** PROPOSED — units for a subject. */
    listUnits(input: { subjectId: SubjectId }): Promise<CurriculumUnit[]>
    /** PROPOSED — one curriculum unit. */
    getUnit(input: { unitId: UnitId }): Promise<CurriculumUnit>
  }

  materials: {
    /** PROPOSED — teacher-uploaded material, optional class filter. */
    listForTeacher(input: {
      teacherId: UserId
      classroomId?: ClassroomId
    }): Promise<Material[]>
    /** PROPOSED — one material. */
    get(input: { materialId: MaterialId }): Promise<Material>
    /** PROPOSED — metadata-only create; binary upload is an integration gap. */
    create(input: CreateMaterialInput): Promise<Material>
    /** PROPOSED — Mentingo to implement on restore/rebuild. */
    delete(input: {
      teacherId: UserId
      materialId: MaterialId
    }): Promise<void>
  }

  tests: {
    /** PROPOSED — teacher's tests, newest first. */
    listForTeacher(input: { teacherId: UserId }): Promise<TestSummary[]>
    /** PROPOSED — student-facing published tests for a class. */
    listForClass(input: { classroomId: ClassroomId }): Promise<TestSummary[]>
    /** PROPOSED — test detail. */
    get(input: { testId: TestId }): Promise<Test>
    /** PROPOSED — step 1 of the builder creates a draft. */
    createDraft(input: CreateTestDraftInput): Promise<Test>
    /** PROPOSED — edit title/description while draft. */
    update(
      input: UpdateTestInput & { teacherId: UserId; testId: TestId },
    ): Promise<Test>
    /** PROPOSED — step 4 publishes to the class; requires at least one question. */
    publish(input: { teacherId: UserId; testId: TestId }): Promise<Test>
    /** PROPOSED — draft-only delete. */
    delete(input: { teacherId: UserId; testId: TestId }): Promise<void>
  }

  questions: {
    /**
     * PROPOSED — TEACHER-ONLY. Ordered full questions of a test for the builder,
     * including `correctOptionId`. Student screens must not call this; they use
     * `listForStudentTest`. The mock rejects a student session with FORBIDDEN,
     * and a real backend must never return `correctOptionId` to a student.
     */
    listForTest(input: { testId: TestId }): Promise<Question[]>
    /**
     * PROPOSED — student-safe ordered questions of a published test, for the
     * player. Never carries `correctOptionId`, as a value or as a property. The
     * owning teacher may also call it (preview); the result is stripped for every
     * caller.
     */
    listForStudentTest(input: { testId: TestId }): Promise<StudentQuestion[]>
    /** PROPOSED — add a teacher-authored question. */
    create(
      input: CreateQuestionInput & { teacherId: UserId; testId: TestId },
    ): Promise<Question>
    /** PROPOSED — step 3 edit; replaces options when supplied. */
    update(
      input: UpdateQuestionInput & {
        teacherId: UserId
        testId: TestId
        questionId: QuestionId
      },
    ): Promise<Question>
    /** PROPOSED — step 3 delete before publishing. */
    delete(input: {
      teacherId: UserId
      testId: TestId
      questionId: QuestionId
    }): Promise<void>
    /** PROPOSED — step 3 reorder. */
    reorder(
      input: ReorderQuestionsInput & { teacherId: UserId; testId: TestId },
    ): Promise<Question[]>
  }

  attempts: {
    /** PROPOSED — student's attempts for "My Tests". */
    listForStudent(input: { studentId: UserId }): Promise<AttemptSummary[]>
    /** PROPOSED — start or resume an in-progress attempt. */
    start(input: StartAttemptInput): Promise<Attempt>
    /** PROPOSED — attempt with saved answers. */
    get(input: { attemptId: AttemptId }): Promise<Attempt>
    /** PROPOSED — autosave one answer. */
    saveAnswer(input: SaveAnswerInput): Promise<Attempt>
    /** PROPOSED — records submission only. NO marking or scoring in the MVP. */
    submit(input: SubmitAttemptInput): Promise<Attempt>
  }

  mohsen: {
    /** PROPOSED — grounded Q&A; refusal when material does not contain the answer. */
    ask(input: AskMohsenInput): Promise<MohsenAnswer>
    /** PROPOSED — step 2 of the builder; grounded question drafts. */
    draftQuestions(input: DraftQuestionsInput): Promise<DraftQuestionsResult>
  }

  system: {
    /** Adapter-local diagnostics, NOT a Mentingo endpoint. */
    getInfo(): Promise<AdapterInfo>
  }
}
