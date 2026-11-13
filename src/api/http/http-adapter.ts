import type { BridgioApi } from '../contract'
import type {
  AdapterInfo,
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
  Material,
  Message,
  MessageThread,
  MohsenAnswer,
  ParentOverview,
  ParentProfile,
  Question,
  ReorderQuestionsInput,
  SaveAnswerInput,
  SendMessageInput,
  SendMessageResult,
  Session,
  SignInInput,
  StartAttemptInput,
  StudentProfile,
  StudentProgress,
  StudentQuestion,
  SubmitAttemptInput,
  TeacherDashboard,
  TeacherProfile,
  Test,
  TestAttemptSummary,
  TestSummary,
  UpdateQuestionInput,
  UpdateTestInput,
  UserCapabilities,
  UserId,
} from '../types'
import { CONTRACT_VERSION } from '../version'
import { endpoints } from './endpoints'
import { HttpClient } from './http-client'

export interface HttpApiOptions {
  baseUrl: string
  requestTimeoutMs: number
  getAccessToken?: () => string | null
  fetchImpl?: typeof fetch
}

/**
 * HTTP ADAPTER — PROPOSED endpoints only.
 *
 * Implements the exact same `BridgioApi` interface as the mock adapter. No live
 * Mentingo backend is connected in Stage 0. Every path in `endpoints.ts` is a
 * proposal for Mentingo to implement on restore/rebuild, not a confirmed route.
 */
export function createHttpApi(options: HttpApiOptions): BridgioApi {
  const client = new HttpClient({
    baseUrl: options.baseUrl,
    timeoutMs: options.requestTimeoutMs,
    getAccessToken: options.getAccessToken,
    fetchImpl: options.fetchImpl,
  })

  return {
    contractVersion: CONTRACT_VERSION,
    mode: 'http',

    auth: {
      getSession: async () => {
        // A signed-out backend may answer 204 or a `null`/empty body, which the
        // HTTP client returns as `undefined`. The contract says `Session | null`,
        // and TanStack Query treats `undefined` query data as an error, so this
        // method (and only this one) normalises `undefined` to `null`.
        const session = await client.request<Session | null | undefined>({
          method: 'GET',
          path: endpoints.auth.session,
        })
        return session ?? null
      },
      signIn: (input: SignInInput) =>
        client.request<Session>({
          method: 'POST',
          path: endpoints.auth.signIn,
          body: input,
        }),
      signOut: () =>
        client.request<void>({
          method: 'POST',
          path: endpoints.auth.signOut,
        }),
    },

    teachers: {
      getProfile: (input) =>
        client.request<TeacherProfile>({
          method: 'GET',
          path: endpoints.teachers.profile(input.teacherId),
        }),
      getDashboard: (input) =>
        client.request<TeacherDashboard>({
          method: 'GET',
          path: endpoints.teachers.dashboard(input.teacherId),
        }),
    },

    students: {
      getProfile: (input) =>
        client.request<StudentProfile>({
          method: 'GET',
          path: endpoints.students.profile(input.studentId),
        }),
      getProgress: (input) =>
        client.request<StudentProgress>({
          method: 'GET',
          path: endpoints.students.progress(input.studentId),
          query: { classroomId: input.classroomId },
        }),
    },

    rbac: {
      getCapabilities: (input) =>
        client.request<UserCapabilities>({
          method: 'GET',
          path: endpoints.rbac.capabilities(input.userId),
        }),
    },

    parents: {
      getProfile: () =>
        client.request<ParentProfile>({
          method: 'GET',
          path: endpoints.parents.profile,
        }),
      getOverview: (input) =>
        client.request<ParentOverview>({
          method: 'GET',
          path: endpoints.parents.overview(input.childId),
        }),
    },

    messages: {
      listThreads: () =>
        client.request<MessageThread[]>({
          method: 'GET',
          path: endpoints.messages.threads,
        }),
      listMessages: (input) =>
        client.request<Message[]>({
          method: 'GET',
          path: endpoints.messages.messages(input.threadId),
        }),
      sendMessage: (input: SendMessageInput) =>
        client.request<SendMessageResult>({
          method: 'POST',
          path: endpoints.messages.messages(input.threadId),
          body: { body: input.body },
        }),
    },

    classrooms: {
      listForTeacher: (input) =>
        client.request<ClassroomSummary[]>({
          method: 'GET',
          path: endpoints.classrooms.forTeacher(input.teacherId),
        }),
      get: (input) =>
        client.request<ClassroomDetail>({
          method: 'GET',
          path: endpoints.classrooms.detail(input.classroomId),
        }),
      listStudents: (input) =>
        client.request<ClassroomStudent[]>({
          method: 'GET',
          path: endpoints.classrooms.students(input.classroomId),
        }),
    },

    curriculum: {
      listSubjects: (input) =>
        client.request<CurriculumSubject[]>({
          method: 'GET',
          path: endpoints.curriculum.subjects,
          query: { gradeLevel: input?.gradeLevel },
        }),
      listUnits: (input) =>
        client.request<CurriculumUnit[]>({
          method: 'GET',
          path: endpoints.curriculum.units(input.subjectId),
        }),
      getUnit: (input) =>
        client.request<CurriculumUnit>({
          method: 'GET',
          path: endpoints.curriculum.unit(input.unitId),
        }),
    },

    materials: {
      listForTeacher: (input) =>
        client.request<Material[]>({
          method: 'GET',
          path: endpoints.materials.forTeacher(input.teacherId),
          query: { classroomId: input.classroomId },
        }),
      get: (input) =>
        client.request<Material>({
          method: 'GET',
          path: endpoints.materials.detail(input.materialId),
        }),
      create: (input: CreateMaterialInput) =>
        client.request<Material>({
          method: 'POST',
          path: endpoints.materials.create,
          body: input,
        }),
      delete: (input) =>
        client.request<void>({
          method: 'DELETE',
          path: endpoints.materials.detail(input.materialId),
          query: { teacherId: input.teacherId },
        }),
    },

    tests: {
      listForTeacher: (input) =>
        client.request<TestSummary[]>({
          method: 'GET',
          path: endpoints.tests.forTeacher(input.teacherId),
        }),
      listForClass: (input) =>
        client.request<TestSummary[]>({
          method: 'GET',
          path: endpoints.tests.forClass(input.classroomId),
        }),
      get: (input) =>
        client.request<Test>({
          method: 'GET',
          path: endpoints.tests.detail(input.testId),
        }),
      createDraft: (input: CreateTestDraftInput) =>
        client.request<Test>({
          method: 'POST',
          path: endpoints.tests.createDraft,
          body: input,
        }),
      update: (
        input: UpdateTestInput & { teacherId: UserId; testId: string },
      ) =>
        client.request<Test>({
          method: 'PATCH',
          path: endpoints.tests.detail(input.testId),
          body: {
            teacherId: input.teacherId,
            title: input.title,
            description: input.description,
          },
        }),
      publish: (input) =>
        client.request<Test>({
          method: 'POST',
          path: endpoints.tests.publish(input.testId),
          body: { teacherId: input.teacherId },
        }),
      delete: (input) =>
        client.request<void>({
          method: 'DELETE',
          path: endpoints.tests.detail(input.testId),
          query: { teacherId: input.teacherId },
        }),
    },

    questions: {
      // TEACHER-ONLY: full questions including `correctOptionId`. PROPOSED — the
      // real backend must not return `correctOptionId` to a student principal.
      listForTest: (input) =>
        client.request<Question[]>({
          method: 'GET',
          path: endpoints.questions.list(input.testId),
        }),
      // Student-safe list for the player. PROPOSED route. The real backend MUST
      // NOT return `correctOptionId` (or any other answer-key field) in this
      // response, and must not return it to a student principal from any
      // questions route. This adapter does not filter the body, so protection on
      // the wire in HTTP mode is the backend's responsibility.
      listForStudentTest: (input) =>
        client.request<StudentQuestion[]>({
          method: 'GET',
          path: endpoints.questions.studentList(input.testId),
        }),
      create: (
        input: CreateQuestionInput & { teacherId: UserId; testId: string },
      ) =>
        client.request<Question>({
          method: 'POST',
          path: endpoints.questions.list(input.testId),
          body: {
            teacherId: input.teacherId,
            prompt: input.prompt,
            options: input.options,
            correctOptionIndex: input.correctOptionIndex,
          },
        }),
      update: (
        input: UpdateQuestionInput & {
          teacherId: UserId
          testId: string
          questionId: string
        },
      ) =>
        client.request<Question>({
          method: 'PATCH',
          path: endpoints.questions.detail(input.testId, input.questionId),
          body: {
            teacherId: input.teacherId,
            prompt: input.prompt,
            options: input.options,
            correctOptionIndex: input.correctOptionIndex,
          },
        }),
      delete: (input) =>
        client.request<void>({
          method: 'DELETE',
          path: endpoints.questions.detail(input.testId, input.questionId),
          query: { teacherId: input.teacherId },
        }),
      reorder: (
        input: ReorderQuestionsInput & { teacherId: UserId; testId: string },
      ) =>
        client.request<Question[]>({
          method: 'PUT',
          path: endpoints.questions.reorder(input.testId),
          body: {
            teacherId: input.teacherId,
            questionIds: input.questionIds,
          },
        }),
    },

    attempts: {
      listForStudent: (input) =>
        client.request<AttemptSummary[]>({
          method: 'GET',
          path: endpoints.attempts.forStudent(input.studentId),
        }),
      listForTest: (input) =>
        client.request<TestAttemptSummary[]>({
          method: 'GET',
          path: endpoints.attempts.forTest(input.testId),
        }),
      start: (input: StartAttemptInput) =>
        client.request<Attempt>({
          method: 'POST',
          path: endpoints.attempts.start,
          body: input,
        }),
      get: (input) =>
        client.request<Attempt>({
          method: 'GET',
          path: endpoints.attempts.detail(input.attemptId),
        }),
      saveAnswer: (input: SaveAnswerInput) =>
        client.request<Attempt>({
          method: 'PUT',
          path: endpoints.attempts.answer(input.attemptId, input.questionId),
          body: { optionId: input.optionId },
        }),
      submit: (input: SubmitAttemptInput) =>
        client.request<Attempt>({
          method: 'POST',
          path: endpoints.attempts.submit(input.attemptId),
        }),
    },

    mohsen: {
      ask: (input: AskMohsenInput) =>
        client.request<MohsenAnswer>({
          method: 'POST',
          path: endpoints.mohsen.ask,
          body: input,
        }),
      draftQuestions: (input: DraftQuestionsInput) =>
        client.request<DraftQuestionsResult>({
          method: 'POST',
          path: endpoints.mohsen.draftQuestions,
          body: input,
        }),
    },

    system: {
      getInfo: async (): Promise<AdapterInfo> => ({
        contractVersion: CONTRACT_VERSION,
        mode: 'http',
        mockScenario: null,
        endpointStatus: 'PROPOSED',
      }),
    },
  }
}
