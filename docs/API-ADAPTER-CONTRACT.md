# BRIDGIO — API Adapter Contract

**Status: PROPOSED ONLY. Not a Mentingo API. Not verified by Muse. Not final.**
Contract version: `0.1.0-proposed` · Stage: **0** · Date: 2026-11-01

> **There are NO confirmed Mentingo endpoints in this build.** Mentingo's local
> source was deleted by the owner on 2026-11-01. Every method, path, request and
> response in this document is **PROPOSED — Mentingo to implement on restore /
> rebuild**. Nothing here describes an existing Mentingo API, database table or
> auth flow.

Sources used: `BRIDGIO-UI-UX-token-sheet.md`, `BRIDGIO-AI-build-handoff.md`,
`BRIDGIO-OpenCode-stages.md`, `BRIDGIO-LIVE_RULES.md`. No PowerPoint deck was
opened or used as code context.

---

## 1. Purpose and scope

Stage 0 delivers:

1. A runnable TanStack Start + TanStack Router + TanStack Query + TypeScript +
   Vite app with no product screens.
2. One typed API layer in `src/api/`.
3. A mock adapter and an HTTP adapter that implement the **same interface**,
   method names and shapes.
4. This contract document, a delivery note, and Arabic screenshots.

Explicitly **not** in Stage 0: dashboards, test builder, player, auth UI, design
system, fonts, header, branding assets, pricing, marking, or any Mentingo
connection.

---

## 2. Architecture — one layer, two implementations

```
src/api/
├─ contract.ts          BridgioApi interface (the ONLY screen-facing surface)
├─ types/               Shared request/response domain types
├─ errors.ts            ApiError + codes (same for mock and HTTP)
├─ config.ts            VITE_API_ADAPTER / VITE_API_URL / mock options
├─ index.ts             createApiClient() + singleton `api`
├─ queries.ts           TanStack Query options built on `api`
├─ query-keys.ts        Query key factory
├─ http/
│  ├─ http-client.ts    the ONLY `fetch` call in the frontend
│  ├─ endpoints.ts      PROPOSED route map (one-place edits)
│  └─ http-adapter.ts   HTTP implementation of BridgioApi
└─ mock/
   ├─ mock-adapter.ts   in-memory implementation of BridgioApi
   ├─ seed.ts           Arabic draft demo data + grounded question bank
   └─ mock-adapter.test.ts
```

Rules enforced by the structure:

- A screen/component imports `api` or query options from `src/api/`; it never
  imports `http-adapter.ts`, `mock-adapter.ts`, or calls `fetch`.
- Persistent data (users, classes, materials, tests, questions, attempts,
  Mohsen answers + grounding) is always read/written through `BridgioApi`.
  Local component state is for UI state only (open panel, current step, tab).
- Switching to a real backend is **configuration only**:
  `VITE_API_ADAPTER=http` and `VITE_API_URL=<base>`.
- The mock is the default. No live Mentingo backend is connected in Stage 0.

### Screen usage pattern (for later stages)

```ts
// src/api/queries.ts (single layer)
export const dashboardQueryOptions = (teacherId: UserId) =>
  queryOptions({
    queryKey: queryKeys.teachers.dashboard(teacherId),
    queryFn: () => api.teachers.getDashboard({ teacherId }),
  })

// screen
const { data } = useQuery(dashboardQueryOptions(session.user.id))
```

No screen-level `fetch`, no hard-coded records, no business logic in components.

---

## 3. Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_ADAPTER` | `mock` | `mock` or `http`. Unknown values fail fast. |
| `VITE_API_URL` | `http://localhost:3001/api/v1` | **PROPOSED** Mentingo base URL; used only in `http` mode. |
| `VITE_MOCK_SCENARIO` | `seeded` | `seeded` demo data or `empty` for empty-state work. |
| `VITE_MOCK_SESSION` | `teacher` | Mock starting session: `teacher`, `student`, `none`. Mock convenience only, **not** a BRIDGIO auth system. |
| `VITE_API_TIMEOUT_MS` | `15000` | HTTP timeout. |

`.env.example` contains example values only. No secret, token or password is
committed or stored in the frontend. `VITE_API_URL` is not a claim that a
Mentingo server exists at that address.

---

## 4. Auth, users and roles — integration gap

- Mentingo owns auth, users and roles. BRIDGIO does **not** create a second user
  model, auth system or role system.
- `teacher` and `student` are proposed Mentingo role projections, nothing more.
- The auth transport (cookie session vs bearer token) is **UNCONFIRMED**. The
  HTTP client contains one optional bearer-token hook; if Mentingo uses cookies,
  that hook is removed and credentials are set in that one file. It is not baked
  into UI state.
- `SignInInput` (email/password) is a **PROPOSED placeholder** so the mock can
  exercise role switching. Do not build a BRIDGIO sign-in screen from it until
  Mentingo's real auth method is confirmed in Stage 7.
- The mock starts with a demo teacher session (or student / none via config) so
  feature stages do not need to invent an auth UI.
- No token is exposed by `Session`; `expiresAt` is metadata only.

**Open integration gap:** Mentingo auth method, token transport and refresh
behaviour. Ask the owner; do not assume.

---

## 5. Entity mapping — all proposals

| BRIDGIO product concept | Proposed Mentingo domain mapping | Status |
| --- | --- | --- |
| User + role | Mentingo user + role (`teacher` / `student`) | Concept exists in Mentingo; shape/fields unconfirmed. |
| Teacher / student profile | Projection over the same Mentingo user + course memberships | **PROPOSED** view model; not a second user record. |
| Class / classroom | Proposed Mentingo class / course group / enrolment context | **PROPOSED** |
| Unit | Proposed course unit / module in the fixed Egyptian curriculum | **PROPOSED** |
| Curriculum subject | Fixed Egyptian curriculum subject + grade level | **PROPOSED**; source unconfirmed. |
| Material | Proposed uploaded material / asset with extracted text | **PROPOSED**; storage + extraction unconfirmed. |
| Test | Proposed quiz / test attached to a class | **PROPOSED** |
| Question + options | Proposed question + options under a test | **PROPOSED** |
| Attempt + answers | Proposed attempt / submission + answer records | **PROPOSED**; no marking. |
| Student progress | Proposed course/unit progress projection | **PROPOSED** |
| Mohsen answer + grounding | New proposed assistant-answer record with source references | **PROPOSED**; not a confirmed Mentingo entity. |

No UI state may depend on a mock-only shape. Every field above is part of the
adapter contract and must be supplied by the backend adapter when it is real.

---

## 6. Endpoint contract

Every row below is **PROPOSED — Mentingo to implement on restore/rebuild**.
`Input` and `Output` refer to TypeScript types in `src/api/types/`.

### 6.1 Auth

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `auth.getSession` | — | `Session \| null` | `GET /auth/session` | **PROPOSED** |
| `auth.signIn` | `SignInInput` | `Session` | `POST /auth/sign-in` | **PROPOSED** — credential shape unconfirmed |
| `auth.signOut` | — | `void` | `POST /auth/sign-out` | **PROPOSED** |

### 6.2 Teacher and student

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `teachers.getProfile` | `{ teacherId }` | `TeacherProfile` | `GET /teachers/{teacherId}` | **PROPOSED** |
| `teachers.getDashboard` | `{ teacherId }` | `TeacherDashboard` | `GET /teachers/{teacherId}/dashboard` | **PROPOSED** |
| `students.getProfile` | `{ studentId }` | `StudentProfile` | `GET /students/{studentId}` | **PROPOSED** |
| `students.getProgress` | `{ studentId, classroomId? }` | `StudentProgress` | `GET /students/{studentId}/progress?classroomId=` | **PROPOSED** |

### 6.3 Classrooms

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `classrooms.listForTeacher` | `{ teacherId }` | `ClassroomSummary[]` | `GET /teachers/{teacherId}/classrooms` | **PROPOSED** |
| `classrooms.get` | `{ classroomId }` | `ClassroomDetail` | `GET /classrooms/{classroomId}` | **PROPOSED** |
| `classrooms.listStudents` | `{ classroomId }` | `ClassroomStudent[]` | `GET /classrooms/{classroomId}/students` | **PROPOSED** |

### 6.4 Fixed curriculum

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `curriculum.listSubjects` | `{ gradeLevel? }?` | `CurriculumSubject[]` | `GET /curriculum/subjects?gradeLevel=` | **PROPOSED** |
| `curriculum.listUnits` | `{ subjectId }` | `CurriculumUnit[]` | `GET /curriculum/subjects/{subjectId}/units` | **PROPOSED** |
| `curriculum.getUnit` | `{ unitId }` | `CurriculumUnit` | `GET /curriculum/units/{unitId}` | **PROPOSED** |

### 6.5 Materials

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `materials.listForTeacher` | `{ teacherId, classroomId? }` | `Material[]` | `GET /teachers/{teacherId}/materials?classroomId=` | **PROPOSED** |
| `materials.get` | `{ materialId }` | `Material` | `GET /materials/{materialId}` | **PROPOSED** |
| `materials.create` | `CreateMaterialInput` | `Material` | `POST /materials` | **PROPOSED** — metadata only; binary upload is an integration gap |
| `materials.delete` | `{ teacherId, materialId }` | `void` | `DELETE /materials/{materialId}?teacherId=` | **PROPOSED** |

### 6.6 Tests (builder steps 1, 4)

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `tests.listForTeacher` | `{ teacherId }` | `TestSummary[]` | `GET /teachers/{teacherId}/tests` | **PROPOSED** |
| `tests.listForClass` | `{ classroomId }` | `TestSummary[]` | `GET /classrooms/{classroomId}/tests` | **PROPOSED** — published only (student-facing) |
| `tests.get` | `{ testId }` | `Test` | `GET /tests/{testId}` | **PROPOSED** |
| `tests.createDraft` | `CreateTestDraftInput` | `Test` | `POST /tests` | **PROPOSED** |
| `tests.update` | `UpdateTestInput & { teacherId, testId }` | `Test` | `PATCH /tests/{testId}` | **PROPOSED** — draft only |
| `tests.publish` | `{ teacherId, testId }` | `Test` | `POST /tests/{testId}/publish` | **PROPOSED** — requires ≥1 question |
| `tests.delete` | `{ teacherId, testId }` | `void` | `DELETE /tests/{testId}?teacherId=` | **PROPOSED** — draft only |

### 6.7 Questions (builder step 3 + question editor)

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `questions.listForTest` | `{ testId }` | `Question[]` | `GET /tests/{testId}/questions` | **PROPOSED** |
| `questions.create` | `CreateQuestionInput & { teacherId, testId }` | `Question` | `POST /tests/{testId}/questions` | **PROPOSED** |
| `questions.update` | `UpdateQuestionInput & { teacherId, testId, questionId }` | `Question` | `PATCH /tests/{testId}/questions/{questionId}` | **PROPOSED** |
| `questions.delete` | `{ teacherId, testId, questionId }` | `void` | `DELETE /tests/{testId}/questions/{questionId}?teacherId=` | **PROPOSED** |
| `questions.reorder` | `ReorderQuestionsInput & { teacherId, testId }` | `Question[]` | `PUT /tests/{testId}/questions/order` | **PROPOSED** |

### 6.8 Attempts (student player)

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `attempts.listForStudent` | `{ studentId }` | `AttemptSummary[]` | `GET /students/{studentId}/attempts` | **PROPOSED** |
| `attempts.start` | `StartAttemptInput` | `Attempt` | `POST /attempts` | **PROPOSED** — resumes in-progress |
| `attempts.get` | `{ attemptId }` | `Attempt` | `GET /attempts/{attemptId}` | **PROPOSED** |
| `attempts.saveAnswer` | `SaveAnswerInput` | `Attempt` | `PUT /attempts/{attemptId}/answers/{questionId}` | **PROPOSED** |
| `attempts.submit` | `SubmitAttemptInput` | `Attempt` | `POST /attempts/{attemptId}/submit` | **PROPOSED** — records submission only, **no marking** |

### 6.9 Mohsen (grounded Q&A + step 2 drafting)

| Method | Input | Output | Proposed HTTP route | Status |
| --- | --- | --- | --- | --- |
| `mohsen.ask` | `AskMohsenInput` | `MohsenAnswer` | `POST /mohsen/ask` | **PROPOSED** — grounded only |
| `mohsen.draftQuestions` | `DraftQuestionsInput` | `DraftQuestionsResult` | `POST /mohsen/draft-questions` | **PROPOSED** — grounded only |

### 6.10 Adapter-local diagnostics

| Method | Input | Output | Route | Status |
| --- | --- | --- | --- | --- |
| `system.getInfo` | — | `AdapterInfo` | No network call | **NOT a Mentingo endpoint** — local diagnostic for the Stage 0 status page and demo mode. |

Proposed HTTP paths all sit under the configured `VITE_API_URL` base. They are
one proposal, not a reverse-engineered Mentingo route list.

---

## 7. Contract invariants

1. **No ungrounded Mohsen.** `MohsenAnswer` is a discriminated union:
   `status: 'answered'` always carries ≥1 `GroundingRef`; `status: 'not_grounded'`
   carries no grounding and fixed refusal copy. There is no free-form chat path.
2. **No invented Mohsen drafts.** `DraftQuestionsResult` is either `drafted`
   (questions persisted with grounding) or `no_grounding` (no questions).
3. **No marking.** `Attempt` has no score, grade or correct/incorrect fields.
   `submit` only records the attempt. Intelligent marking is deferred by the
   owner (2026-10-28) and must not be promised in UI copy.
4. **No price, installments, Learn-to-Hire or exotic-language flows** in any
   shape in this contract.
5. **Ownership fields are proposed guards.** `teacherId` / `studentId` inputs
   are used by the mock for ownership checks. A real backend must derive the
   actor from Mentingo auth, not trust a client-supplied ID.
6. **Published tests are read-only** in this MVP. Question edits, reorder,
   delete and test delete happen while `status: 'draft'`.
7. **No local-only persistent store.** The mock is an adapter; screens never
   read or write mock state directly.

### Correct answer field

`Question.correctOptionId` exists as **authoring metadata only** so a teacher can
record the intended answer. It is deliberately **not** used to compute results.
Whether it should remain in a marking-free MVP is an open question.

---

## 8. Error model

Both adapters throw `ApiError` with:

| Field | Meaning |
| --- | --- |
| `code` | `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, `CONFLICT`, `UNSUPPORTED`, `NETWORK`, `TIMEOUT`, `INTERNAL` |
| `message` | Safe, user-displayable message (no token, no stack) |
| `status` | HTTP status when applicable, else `null` |
| `details` | Optional backend detail payload |

Screens handle this one shape; they never catch `fetch`/`Response` errors.

---

## 9. Mock adapter — behaviour and honest limits

- **Deterministic in-memory data**, seeded with Arabic demo content. Arabic here
  is **DRAFT**, not approved product copy, and not real teacher/student data.
- **No network, no Mentingo, no AI model call.** Mohsen in the mock is a keyword
  retriever over seeded material + fixed curriculum text. It scores query tokens
  against candidate sources and refuses when nothing matches. It is **not** a
  language model; do not describe it as one.
- **Question drafting** uses a small seeded question bank keyed by material/unit.
  If a material has no bank entry, the mock returns `no_grounding` rather than
  inventing questions. The real Mohsen will need a grounded generation service.
- **Scenarios:** `seeded` (2 classes, 3 students, 2 published tests, 1 draft,
  materials, attempts) and `empty` (no classes/tests/materials) for empty states.
- **Sessions:** default demo teacher; `VITE_MOCK_SESSION=student` starts as a
  student; `auth.signIn` can switch by demo email. This is mock convenience, not
  a BRIDGIO auth system.
- **Latency** is configurable in code (default 60 ms in the app, 0 in tests) to
  exercise loading states later.
- **Permissions** are minimal proposed checks (teacher owns class/test/material;
  student is enrolled and test is published). The real permission matrix is
  unconfirmed — see open questions.

---

## 10. Integration checklist by future screen

All methods are **mocked in Stage 0** and every endpoint is **PROPOSED**. For each
row: "Proposed concept" means a Mentingo domain mapping is proposed but no
endpoint is confirmed.

| Future screen / stage | Adapter methods used | Proposed Mentingo concept | Confirmed endpoint? | Mocked now? |
| --- | --- | --- | --- | --- |
| Stage 1 shell | `auth.getSession` | Mentingo session + user/role | No | Yes |
| Stage 2 teacher dashboard | `teachers.getDashboard`, `classrooms.listForTeacher`, `tests.listForTeacher` (optional detail), `classrooms.get` / `listStudents` | user, course/class, test, progress | No | Yes |
| Stage 3 test builder step 1 | `curriculum.listSubjects`, `listUnits`, `materials.listForTeacher`, `classrooms.get` | curriculum, material, course/class | No | Yes |
| Stage 3 step 2 (Mohsen drafts) | `tests.createDraft`, `mohsen.draftQuestions`, `questions.listForTest` | test, question, assistant answer + grounding | No | Yes |
| Stage 3 step 3 + question editor | `questions.create`, `update`, `delete`, `reorder`, `tests.update` | question, test | No | Yes |
| Stage 3 step 4 (publish) | `tests.publish` | test | No | Yes |
| Stage 4 student player | `tests.listForClass`, `tests.get`, `questions.listForTest`, `attempts.start`, `get`, `saveAnswer`, `submit`, `mohsen.ask` | test, question, attempt, assistant answer | No | Yes |
| Stage 5 Mohsen hardening + states | `mohsen.ask`, `mohsen.draftQuestions`, all error/empty paths | assistant answer + grounding | No | Yes |
| Stage 7 real backend | All HTTP adapter methods | To be documented by running the Docker demo | **No** | Real adapter skeleton only |

A screen with no adapter mapping is a gate failure. No screen is built in Stage 0.

---

## 11. Open questions / integration gaps

Ask the owner or resolve at Stage 7 — do not invent:

1. **Mentingo auth method** (cookie/token), sign-in shape, refresh, logout.
2. **Mentingo database type** for the free-tier hosting plan (do not assume Postgres).
3. **Every endpoint path/shape** — none is confirmed; the Docker demo must be
   run in Stage 7 and every mismatch listed.
4. **Curriculum source**: where the fixed Egyptian curriculum data comes from,
   grade levels, unit IDs, and who owns updates.
5. **Material upload**: binary storage, PDF/image text extraction, processing
   states, size limits, virus scanning.
6. **Correct answers / marking**: `correctOptionId` is authoring-only; confirm
   whether it stays while intelligent marking is deferred.
7. **Pagination / filtering** for classes, tests and students beyond demo size.
8. **Permission matrix**: exactly which teacher can see which student progress,
   and what a student may read.
9. **Arabic copy approval** for all mock seed content and UI strings.
10. **Stage 1 assets**: wordmark/font file paths from the isolated folder were
    not supplied in this session; Stage 1 needs them.
11. **Canonical repo path**: the rules doc says
    `...\LMS to Hire\bridgio-frontend`, but that folder does not exist; the git
    repo is at `...\Projects\bridgio-frontend` with the remote set.
12. **Favicon / small mark**: TBD per token sheet; deliberately none added.
13. **`system.getInfo`**: adapter-local diagnostic. Confirm whether it survives
    into production or is dev-only.
14. **CORS / allowed origin** for Stage 7 free hosting.

---

## 12. Verification in Stage 0

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm test` | 23 tests pass across mock, HTTP and config |
| `npm run build` | Pass (client + SSR) |
| Mock/HTTP method parity test | Pass (37 contract methods) |
| Browser console errors/warnings | None |
| External network requests | None (Vite dev modules only) |
| No product screens | Only a Stage 0 status page exists |

Muse verification is still required. This document does not claim the stage is
final, locked, or externally ready.
