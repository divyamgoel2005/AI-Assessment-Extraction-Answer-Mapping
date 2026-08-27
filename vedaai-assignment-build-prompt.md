# Build Prompt: AI Assessment Extraction & Answer Mapping (VedaAI-style)

Use this as the master prompt/spec for an AI coding agent (Claude Code, Cursor, etc.) to scaffold and build the full app. It's written to be pasted in directly.

---

## 0. One-line brief

Build a Next.js web app where a teacher uploads a question paper and a handwritten answer sheet (PDF or images). The app extracts every question (with sub-parts as separate entries), extracts and transcribes the student's answers, maps each answer to its question, highlights the exact region of the answer sheet for the selected question, and grades each answer with a score + AI feedback. Match the attached Figma design pixel-for-pixel where shapes/colors/spacing are described below.

---

## 1. Tech stack

- **Framework**: Next.js 14+ (App Router), TypeScript
- **Styling**: Tailwind CSS
- **PDF → image conversion**: `pdf-lib` + `pdfjs-dist` (or `pdf-to-img`) on the server, convert each page to a PNG before sending to the vision model
- **AI model**: Google Gemini 2.0 Flash (via `@google/generative-ai`) — free tier, strong multimodal doc understanding, and can return normalized bounding boxes reliably. Use this for all three AI calls below (question extraction, answer extraction, grading). If Gemini's bbox output proves flaky, fall back to a bbox-refinement pass with a light OpenCV contour-detection step server-side (Node `opencv4nodejs` or a Python microservice) that proposes handwriting-block boxes for the model to just *label* rather than invent coordinates for.
- **State**: no DB. Single in-memory session object on the server (or just pass full state back and forth to the client and hold it in React state / Zustand) — everything resets on reload, which is fine per spec.
- **Deployment**: Vercel (matches Next.js recommendation, has a usable free tier for a demo).

---

## 2. Screens (match Figma exactly)

### Screen A — Upload (`/`)
- Left sidebar (desktop only): VedaAI logo, "AI Teacher's Toolkit" pill button, nav items (Home, My Classroom, Assignments, Exams [active], My Library), Settings, and a school badge card at the bottom ("Delhi Public School — Bokaro Steel City"). Sidebar collapses on mobile into a top bar with hamburger.
- Top bar: back arrow, breadcrumb "Exams", help icon, notification bell (with red dot), sparkle icon, user avatar + name + chevron.
- Heading: `Upload` (black) + `Question Paper & Answer Sheets` (rendered inside a soft orange highlighted pill/background, bold, orange text). Subtext: "Upload both files to get started".
- Centered circular illustration (teacher avatar) with a soft pink/orange ring and small orange dot accents around the ring.
- Two side-by-side dashed-border upload cards (stack vertically on mobile):
  - Card 1: upload icon in a rounded square, "Upload **Question Paper**" (Question Paper in orange), "Max 10MB" caption.
  - Card 2: same pattern for "Upload **Answer Sheet**".
  - On file selected: card becomes a solid white card with a red PDF icon, filename (truncate if long), `size • N Pages` caption, and a small circular `×` button top-right to remove/reset that upload.
- "Start Mapping →" button below, centered: disabled/grey state until both files are uploaded, then becomes solid black/dark with white text and arrow icon.
- Caption under the button: "Once both files are uploaded, you'll be able to map answers with questions."

### Screen B — Extracting (transient, shown right after "Start Mapping" is clicked)
- Sidebar collapses to icon-only rail (just icons stacked vertically, no labels), active icon (sparkle) highlighted with an orange ring.
- Centered: animated/pulsing orange sparkle icon (4-point star cluster, main star + 2 smaller accent stars), "Extracting…" bold heading, "This may take a while" subtext.
- This is shown while both AI extraction calls run in parallel on the backend.

### Screen C — Workspace (main screen, desktop = split pane, mobile = tabs)
**Desktop layout**: two panes side by side under the same top bar as Screen A.

**Left pane — "Extracted Questions (from question paper)"**
- Header row: title left, "Expand All" toggle link right.
- Scrollable list of question rows. Each row:
  - Circular number badge on the left (black/dark fill, white number). For a sub-part like 11(a)/11(b), the badge shows the shared number `11`, and the row itself starts with `a.` / `b.` before the question text — i.e., two separate rows, same badge number, distinguished by the sub-label prefix.
  - Question text.
  - Score pill, right-aligned, format `X/Y`, pill background color-coded:
    - full marks → green bg, green text
    - partial credit → orange bg, orange text
    - zero / unanswered → red bg, red text (unanswered can show as `—` or `0/Y` in red/gray — pick red-outline "Unanswered" style if you want to visually distinguish from a genuine 0-score answer)
  - Chevron (down/up) to expand/collapse.
  - Expanded state reveals an "AI Feedback" block below the question: light-gray rounded card, bold "AI Feedback" label, 1–2 sentence feedback text.
  - The row corresponding to the currently active/selected question gets an orange left-border + subtle orange-tinted background.
  - Clicking anywhere on a row (not just the chevron) both expands it and sets it as the active question, which drives the right pane.

**Right pane — "Answer Sheet"**
- Header: "Answer Sheet" title, zoom controls (`− 100% +`), page navigator (`< Page 1 of 4 >`).
- Scrollable image viewer showing the actual scanned answer page.
- The region matching the active question is drawn as an overlay: green rounded-rectangle border, semi-transparent green fill, with a small green pill tag in the top-left corner of the box labeled with the question number (e.g. "Q2").
- Selecting a question in the left pane auto-scrolls the right pane to the correct page and scroll position and draws the box; if the answer spans multiple pages, either auto-advance through pages or show all relevant boxes with a page indicator per box.

**Mobile layout**: same content, but the two panes become a tab switcher pinned under the top bar: "Questions" | "Answer Sheet" (pill-style segmented control, active tab dark/filled). Only one pane visible at a time; selecting a question on the Questions tab should switch to Answer Sheet tab automatically with the highlight applied (or show a small "View in answer sheet" affordance).

---

## 3. Data model

```ts
type Question = {
  id: string;              // "11a" - unique, normalized
  displayNumber: string;   // "11" - what shows in the round badge
  subLabel?: string;       // "a." | "b." | undefined for non-split questions
  text: string;
  maxMarks: number;
  order: number;           // printed order in the paper, used for list sort
};

type AnswerBlock = {
  questionLabelRaw: string | null; // raw label as detected, e.g. "Q11 (a)" or null if no label found
  questionId: string | null;       // normalized match, null if unmatched
  text: string;                    // transcribed handwriting
  page: number;                    // 1-indexed
  bbox: [number, number, number, number]; // [x, y, w, h] normalized 0-1 relative to page image
};

type GradedQuestion = Question & {
  answers: AnswerBlock[];   // empty array = unanswered; can be >1 for multi-page/split answers
  score: number | null;    // null = unanswered, not graded
  status: "correct" | "partial" | "incorrect" | "unanswered";
  feedback: string;
};

type SessionState = {
  questions: GradedQuestion[];
  unmatchedAnswers: AnswerBlock[]; // answers with questionId === null
  answerSheetPages: { pageNumber: number; imageUrl: string }[];
  activeQuestionId: string | null;
};
```

---

## 4. Backend pipeline (API routes)

### `POST /api/upload`
Accepts both files (multipart form). Converts any PDF to an array of page PNGs (one image per page, stored temporarily server-side or as base64/blob URLs returned to client for the answer-sheet viewer). Returns page counts + preview thumbnails for the upload cards ("2MB • 2 Pages").

### `POST /api/extract`
Triggered by "Start Mapping". Runs two Gemini calls **in parallel**:

**Call 1 — Question extraction** (question paper images as input)
```
System/instruction prompt:
You are extracting questions from a scanned/printed exam question paper.
Return ONLY valid JSON, no markdown fences, no commentary.
Rules:
- Preserve the exact original question numbering as printed.
- If a question has labelled sub-parts (e.g. "11 (a)", "11 (b)"), emit each
  sub-part as a SEPARATE entry in the array, sharing the same displayNumber
  but with its own subLabel and text and maxMarks.
- Extract marks allotted if shown (e.g. "[5]", "(5 marks)"); if not shown, set maxMarks to null.
- Preserve printed order via the "order" field, ascending, matching top-to-bottom, left-to-right reading order across pages.
- Do not paraphrase or summarize question text — transcribe it exactly as printed.

Output schema:
[
  { "displayNumber": string, "subLabel": string | null, "text": string, "maxMarks": number | null, "order": number }
]
```

**Call 2 — Answer sheet extraction** (answer sheet images, per page)
```
System/instruction prompt:
You are extracting a student's handwritten answers from a scanned answer sheet.
For each distinguishable answer block on the page, return its transcribed text,
which question label it appears to be answering (as written by the student,
e.g. "Q2", "2)", "Ans 2" — or null if no label/marker is visible), and its
bounding box in NORMALIZED coordinates (0 to 1) relative to the full page image,
as [x, y, width, height] measured from the top-left corner.
Segment by clearly distinct answer blocks (a new question label, a visible gap,
or a ruled-off section usually marks a new block) — do not merge multiple
answers into a single block.
Return ONLY valid JSON, no markdown fences, no commentary.

Output schema (array per page, tag with page number in the parent call):
[
  { "questionLabelRaw": string | null, "text": string, "bbox": [number, number, number, number] }
]
```
Run this call once per page image, tag results with `page` in your own code (don't trust the model to track page numbers across separate calls), then merge into a single `AnswerBlock[]` for the whole answer sheet.

### Matching / normalization (pure server-side logic, no AI call)
- Normalize both `Question.displayNumber + subLabel` and `AnswerBlock.questionLabelRaw` to a canonical key: strip whitespace, punctuation, "Q"/"Ans" prefixes, lowercase, e.g. `"Q11 (a)"`, `"11a)"`, `"11-a"` → `"11a"`.
- For each `Question`, find all `AnswerBlock`s whose normalized label matches its `id`. Attach them to `answers[]`.
- `Question`s with zero matched answers → `status: "unanswered"`, `score: null`.
- `AnswerBlock`s with `questionId` that matches nothing in `Question[]`, or `questionLabelRaw === null` → push to `unmatchedAnswers[]` (don't drop them — surface them in UI, e.g. a small "Unmatched answers" section, or note in spec below).
- Handle answered-out-of-order naturally: matching is by label, not position, so order in the answer sheet doesn't matter.

### Call 3 — Grading (one call per answered question, or batched)
```
System/instruction prompt:
You are grading a student's answer against the original question.
Given the question text, max marks, and the student's transcribed answer,
return a score out of maxMarks, a status ("correct" | "partial" | "incorrect"),
and 1-2 sentences of constructive feedback addressed to the student.
Be fair and consistent; partial credit for partially correct answers.
Return ONLY valid JSON: { "score": number, "status": string, "feedback": string }
```
- Skip grading entirely for `unanswered` questions (score stays null, status stays "unanswered", feedback can be a fixed string like "No answer submitted").
- Batch these calls with reasonable concurrency (e.g. 5 at a time) to stay within free-tier rate limits.

### `GET /api/session` (or just return full `SessionState` from `/api/extract` directly)
Returns the fully assembled `SessionState` to the client in one shot once all three call-stages complete. No DB — just hold it in server memory keyed by a session id, or skip persistence and return it directly to the client on the same request/response cycle (simpler, works fine for single-session demo use).

---

## 5. Frontend behavior details

- Score pill color logic: `score === maxMarks` → green; `score > 0 && score < maxMarks` → orange; `score === 0` → red; `status === "unanswered"` → gray/red-outline "Unanswered" pill instead of a fraction.
- Clicking a question row: set `activeQuestionId`, expand that row (collapse others unless "Expand All" is toggled), scroll the right pane to `answers[0].page` and scroll-into-view the corresponding bbox element, draw the green box + "Qn" tag over it. If `answers.length > 1` (multi-page), show small page-jump chips near the question ("appears on p.1, p.3") that jump between the boxes.
- Unmatched answers: show as a distinct section (e.g. below the numbered list or a collapsible "Unrecognized answers (N)" panel) so the teacher can see handwriting that didn't map to any question — don't silently discard it.
- Bounding box rendering: wrap the page `<img>` in a `position: relative` container, render an absolutely positioned `<div>` per bbox using `left: ${x*100}%`, `top: ${y*100}%`, `width: ${w*100}%`, `height: ${h*100}%` against the image's natural rendered size.
- Zoom control: simple CSS transform scale on the image container, recompute nothing else since bboxes are in % and scale naturally.
- Loading/progress states: Screen A → B → C transitions should be driven by actual fetch/await state, not fixed timeouts — show real progress if you can stream stage completion (e.g. "Extracting questions…" → "Extracting answers…" → "Grading…"), otherwise a single "Extracting… this may take a while" is acceptable per the design.

---

## 6. Edge cases to explicitly handle

1. Sub-parts (11a/11b) always rendered as separate list rows with shared badge number.
2. Unanswered question → shown in list with an "Unanswered" indicator, no crash on missing `answers[]`.
3. Answer sheet content with no question label at all → goes to unmatched pool, never silently dropped.
4. Answered out of order → matching is label-based, unaffected by physical order in the answer sheet.
5. Answer spanning multiple pages → `answers[]` array with multiple `AnswerBlock`s across different `page` values, all boxed when that question is selected.
6. Bad/blurry scan or unreadable handwriting → model should still return a block with a best-effort transcription; if it truly can't read it, `text: "[illegible]"` rather than failing the whole batch. Wrap each page's Gemini call in try/catch; one bad page shouldn't kill extraction for the rest.
7. Question paper with no marks printed → `maxMarks: null`, and grading logic should default to a max of 1 or skip strict scoring — keep this configurable (e.g. default 5 if not specified) rather than crashing on `score / null`.
8. Oversized files → enforce the "Max 10MB" client-side before upload with a clear error toast/message.

---

## 7. File/folder structure (suggested)

```
/app
  /page.tsx                  -> Screen A (upload)
  /extracting/page.tsx       -> Screen B (or a modal/overlay state, not a route)
  /workspace/page.tsx        -> Screen C
  /api/upload/route.ts
  /api/extract/route.ts
/components
  UploadCard.tsx
  QuestionListItem.tsx
  AnswerSheetViewer.tsx
  BBoxOverlay.tsx
  ScorePill.tsx
  TabSwitcher.tsx (mobile)
/lib
  gemini.ts                  -> client + prompt builders for the 3 calls
  pdfToImages.ts
  matching.ts                -> label normalization + matching logic
  types.ts
/public (mock/sample files for local testing, optional)
```

---

## 8. Environment / deployment

- `.env.local`: `GEMINI_API_KEY=...`
- Deploy to Vercel, set the same env var in Vercel project settings.
- No auth, no DB required per spec — keep it stateless per request.

---

## 9. Acceptance checklist (self-test before calling it done)

- [ ] Upload both files → cards populate correctly with name/size/page count
- [ ] "Start Mapping" disabled until both files present
- [ ] Extracting screen shown while both AI calls run
- [ ] Every question incl. sub-parts (11a/11b) appears as separate correctly-numbered rows in printed order
- [ ] Selecting a question highlights the exact right region on the exact right page
- [ ] Unanswered question shows clearly as unanswered, doesn't crash
- [ ] An unmatched handwritten block is visible somewhere in the UI, not dropped
- [ ] Multi-page answer highlights correctly across pages
- [ ] Score pills color-coded correctly; AI Feedback expands per question
- [ ] Mobile tab-switch layout matches desktop split-pane functionally
- [ ] Deployed URL works end-to-end with a real scanned PDF and a real handwritten answer sheet
