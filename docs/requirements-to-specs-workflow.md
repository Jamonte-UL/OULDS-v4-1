# Requirements to Spec Files Workflow

A systematic approach for converting product requirements into structured spec files that vibe coding tools (like Figma Make, v0, etc.) can consume to generate high-quality starter code.

---

## Overview

**Goal**: Transform a requirements document into discrete, tool-parseable spec files that minimize guesswork and maximize code quality from AI generation tools.

**Workflow**:

```
Requirements Doc
    ↓
Decompose into Views/Features (Plan Mode)
    ↓
Write Spec File per View
    ↓
Feed to Vibe Coding Tool

```

---

## Step 1: Decompose Requirements into Views

Read the requirements and identify **discrete UI surfaces**:

| Surface Type   | Example                                                |
| -------------- | ------------------------------------------------------ |
| Page/View      | Dashboard, File Manager, Settings Page                 |
| Modal/Dialog   | Upload Modal, Confirmation Dialog, User Profile Editor |
| Component      | Stats Card, File Preview Panel, Search Bar             |
| Shared Pattern | Error Banner, Loading Skeleton, Pagination Controls    |

**Output**: A list of spec files to create, in dependency order (primitives first, composites second).

**Example decomposition** for a "Dashboard + File Management" feature:

- `dashboard.md` — main dashboard view
- `file-manager.md` — file browser/list view
- `file-upload-modal.md` — upload flow
- `file-preview-panel.md` — file detail/preview (conditional UI)
- `stats-card.md` — shared dashboard widget
- `confirmation-dialog.md` — shared delete confirmation
- `empty-state.md` — shared "no files" view

---

## Step 2: Write Spec Files

Each spec file should contain everything a tool needs to generate that UI without guessing.

### Spec File Template

```markdown
# [Type]: [Name]

## Purpose

One sentence: what does this screen/component do for the user?

## Layout

Spatial description of major areas (left sidebar, main table, right panel, etc.)

## Data Model

| Field     | Type     | Source        | Display Notes        |
| --------- | -------- | ------------- | -------------------- |
| fieldName | string   | API /endpoint | Truncate at N chars  |
| createdAt | datetime | API /endpoint | Relative < 7 days    |
| status    | enum     | ready, error  | Badge with color map |

## User Actions

| Action      | Trigger             | Behavior                         |
| ----------- | ------------------- | -------------------------------- |
| Create item | "New" button        | Opens creation modal             |
| Delete item | Row action menu     | Confirmation → API DELETE        |
| Search      | Input onChange      | Filters results, debounced 300ms |
| Sort        | Column header click | Toggle asc/desc on that column   |

## States

- **Empty** — no data → empty state illustration + CTA
- **Loading** — fetching → skeleton placeholders
- **Error** — API failure → inline error banner with retry
- **Populated** — data displayed, pagination if > N items

## Constraints

- Max file size: 50MB
- Pagination: 25 items per page
- Search debounce: 300ms
- Supported file types: .pdf, .docx, .xlsx

## Acceptance Criteria

- [ ] Feature X works as described
- [ ] Validation error shown when Y
- [ ] Screen reader announces Z
- [ ] Mobile responsive layout
```

---

## Example Spec: File Manager View

```markdown
# View: File Manager

## Purpose

Users upload, browse, search, filter, and delete their files.

## Layout

- **Left sidebar**: folder tree navigation (collapsible)
- **Main area**: file list table with toolbar (search + bulk actions)
- **Right panel** (conditional): file preview/detail when row selected

## Data Model

| Field      | Type     | Source                   | Display Notes                 |
| ---------- | -------- | ------------------------ | ----------------------------- |
| fileName   | string   | GET /api/files           | Truncate at 60 chars with ... |
| fileSize   | number   | GET /api/files           | Format as KB/MB/GB            |
| uploadedBy | string   | GET /api/files           | User display name             |
| uploadedAt | datetime | GET /api/files           | Relative time if < 7 days     |
| status     | enum     | processing, ready, error | Badge: blue/green/red         |

## User Actions

| Action         | Trigger                     | Behavior                                     |
| -------------- | --------------------------- | -------------------------------------------- |
| Upload file(s) | "Upload" button / drag-drop | Opens upload modal, accepts .pdf .docx .xlsx |
| Delete file    | Row kebab menu → Delete     | Confirmation dialog → DELETE /api/files/:id  |
| Search files   | Search input onChange       | Filters by fileName, debounced 300ms         |
| Sort table     | Column header click         | Toggles asc/desc on that column              |
| Select files   | Checkbox (per row / all)    | Enables bulk actions toolbar                 |
| Preview file   | Row click                   | Opens right detail panel with metadata       |
| Download file  | Row kebab menu → Download   | Downloads file with original fileName        |
| Bulk delete    | Select multiple → Delete    | Confirmation → DELETE for each selected      |

## States

- **Empty** — no files uploaded yet
  - Show empty state illustration
  - CTA: "Upload your first file" button
- **Loading** — fetching file list
  - Show skeleton table rows (5 rows)
- **Error** — API failure
  - Inline error banner above table: "Failed to load files. [Retry]"
- **Populated** — files displayed
  - Table with data
  - Pagination controls if > 25 files
  - Search active → show "X results for 'query'" badge

## Constraints

- Max upload file size: 50MB per file
- Supported file types: .pdf, .docx, .xlsx
- Pagination: 25 files per page
- Search debounce: 300ms
- Bulk actions: max 100 files at once

## Acceptance Criteria

- [ ] Drag-and-drop upload works in main area and upload modal
- [ ] Files over 50MB show validation error before upload
- [ ] Unsupported file types show validation error
- [ ] Search filters results as user types (300ms debounce)
- [ ] Table sortable by: name, size, date, status
- [ ] Delete requires confirmation dialog
- [ ] Bulk delete requires confirmation with file count
- [ ] Empty state shown when no files exist
- [ ] Pagination controls appear when > 25 files
- [ ] File preview panel shows metadata (size, upload date, uploader)
- [ ] Mobile: table switches to card layout on < 768px
```

---

## Example Spec: Upload Modal

```markdown
# Modal: File Upload

## Purpose

Users select and upload one or more files to their file manager.

## Layout

- Modal overlay with centered dialog (600px max width)
- Header: "Upload Files" + close button
- Body: drag-and-drop zone + file picker button
- Footer: selected file list + "Upload" / "Cancel" buttons

## Data Model

| Field    | Type   | Source         | Notes                      |
| -------- | ------ | -------------- | -------------------------- |
| file     | File   | User selection | Native File object         |
| fileName | string | file.name      | Display in selected list   |
| fileSize | number | file.size      | Validate < 50MB            |
| fileType | string | file.type      | Validate against allowlist |

## User Actions

| Action       | Trigger                         | Behavior                                      |
| ------------ | ------------------------------- | --------------------------------------------- |
| Open modal   | "Upload" button in File Manager | Modal appears, focus on drop zone             |
| Select files | Click file picker button        | Opens native file picker                      |
| Drag files   | Drag over drop zone             | Highlights drop zone border                   |
| Drop files   | Drop on drop zone               | Adds to selected file list                    |
| Remove file  | X button on file chip           | Removes from selected file list               |
| Upload       | "Upload" button                 | POST /api/files (multipart), close on success |
| Cancel       | "Cancel" or close X             | Confirms if files selected, then closes       |

## States

- **Initial** — no files selected
  - Drop zone: dashed border, "Drag files here or click to browse"
  - Upload button: disabled
- **Files selected** — 1+ files in list
  - Selected files shown as chips with name, size, remove X
  - Upload button: enabled
  - Total size displayed: "3 files, 12.5 MB"
- **Uploading** — POST in progress
  - Progress bar per file
  - Upload button: disabled, shows spinner
  - Cancel: disabled
- **Success** — all files uploaded
  - Success message: "3 files uploaded successfully"
  - Auto-close after 2s
- **Error** — validation or upload failure
  - Inline error per file: "File too large (max 50MB)" or "Unsupported file type"
  - Or global error: "Upload failed. [Retry]"

## Constraints

- Max file size: 50MB per file
- Supported types: .pdf, .docx, .xlsx (check file extension)
- Max files per upload: 20
- Modal max width: 600px
- Modal closes on success after 2s

## Acceptance Criteria

- [ ] Drag-and-drop highlights drop zone on dragover
- [ ] File picker filters to supported types
- [ ] Files over 50MB show error immediately on selection
- [ ] Unsupported file types show error immediately
- [ ] Selected files displayed as removable chips
- [ ] Progress bar shown per file during upload
- [ ] Success state auto-closes modal after 2s
- [ ] Canceling with files selected requires confirmation
- [ ] Upload button disabled until valid files selected
- [ ] Escape key closes modal (with confirmation if files selected)
```

---

## Example Spec: Shared Component (Stats Card)

````markdown
# Component: Stats Card

## Purpose

Displays a single metric with label, value, trend indicator, and optional comparison.

## Layout

Compact card with padding, rounded corners:

- Top: label (small text)
- Middle: large value (primary metric)
- Bottom: trend indicator (up/down/flat) + change percentage

## Props

| Prop        | Type   | Default | Required | Description                              |
| ----------- | ------ | ------- | -------- | ---------------------------------------- |
| label       | string | —       | yes      | Metric name (e.g., "Total Files")        |
| value       | string | —       | yes      | Primary metric value (formatted)         |
| trend       | enum   | —       | no       | "up", "down", "flat" or null             |
| trendValue  | string | —       | no       | Change text (e.g., "+12%")               |
| trendPeriod | string | —       | no       | Comparison period (e.g., "vs last week") |

## Variants

- **size**: `sm` (compact), `md` (default), `lg` (prominent)
- **trend**: `up` (green), `down` (red), `flat` (gray), none (no indicator)

## States

- **Default** — all data displayed
- **Loading** — skeleton placeholder for value
- **No trend** — trend section hidden if trend prop null

## Example Usage

```jsx
<StatsCard
  label="Total Files"
  value="1,247"
  trend="up"
  trendValue="+8.3%"
  trendPeriod="vs last month"
/>
```
````

## Acceptance Criteria

- [ ] Label renders in muted text
- [ ] Value renders large and prominent
- [ ] Trend icon color matches trend direction (up=green, down=red, flat=gray)
- [ ] Trend section hidden if trend prop is null/undefined
- [ ] Loading state shows skeleton for value only
- [ ] Card has hover state (subtle shadow/border change)

```

---

## What to Include in Specs

### ✅ Include

| Section | Why |
|---------|-----|
| **Data model with types** | Tool knows what to mock and what API shapes to expect |
| **User actions as table** | Each row becomes an interaction to wire up |
| **Named states** | Tool generates each state, not just happy path |
| **Layout description** | Spatial structure without prescribing CSS |
| **Constraints** | Prevents arbitrary numbers (debounce timing, max file size, pagination) |
| **Acceptance criteria** | Checklist for verification, also hints at edge cases |

### ❌ Leave Out

| Don't Include | Why |
|---------------|-----|
| Implementation details | Framework choice, state management, API auth headers |
| Visual design specifics | Colors, exact font sizes — let design system handle it |
| Code snippets | Tool generates code, spec describes *what*, not *how* |
| Database schema | Backend concern, not UI spec |

---

## Using Specs with Vibe Coding Tools

### Workflow

1. **Write spec file** for one view/component
2. **Feed to vibe coding tool** (Figma Make, v0, Cursor Composer, etc.)
   - Paste full spec into tool prompt
   - Or attach spec file if tool supports file uploads
3. **Generate code** — tool produces initial implementation
4. **Review and refine**
   - Check token usage (if design system)
   - Verify accessibility (ARIA, keyboard nav)
   - Wire to real API endpoints
   - Add error handling
5. **Iterate** — update spec if requirements change, regenerate

### Best Practices

- **One spec per view/component** — keeps context focused
- **Separate shared components** — reuse across multiple views
- **Be explicit about states** — empty, loading, error, success
- **Include constraints** — max lengths, timeouts, limits
- **Write for humans *and* tools** — both should understand it the same way

---

## Folder Structure Example

```

project/
├── requirements/
│ └── file-management-feature.md ← Original requirements doc
├── specs/
│ ├── dashboard.md ← Main dashboard view
│ ├── file-manager.md ← File browser/list
│ ├── file-upload-modal.md ← Upload flow
│ ├── file-preview-panel.md ← Detail panel
│ ├── stats-card.md ← Shared component
│ ├── confirmation-dialog.md ← Shared component
│ └── empty-state.md ← Shared component
└── generated/
├── Dashboard.tsx ← Generated from specs
├── FileManager.tsx
└── components/
├── FileUploadModal.tsx
├── StatsCard.tsx
└── ...

```

---

## Tips for Better Specs

1. **Use tables** — data models, props, user actions all work well in tables
2. **Name states explicitly** — "Empty", "Loading", "Error", "Populated"
3. **Specify debounce/throttle timing** — prevents tools from guessing
4. **Include max lengths/limits** — file size, character counts, pagination
5. **Write acceptance criteria as checkboxes** — easy to verify, hints at edge cases
6. **Separate concerns** — one file per logical UI surface
7. **Reference design system tokens** — if using one (e.g., `{spacing.4}`, `{color.red.600}`)

---

## Next Steps

1. Write your requirements doc first (what the feature does, user needs)
2. Use **Plan Mode** to decompose requirements into spec file list
3. Write one spec at a time, following the template
4. Feed specs to vibe/Figma make vibe coding tool

```
