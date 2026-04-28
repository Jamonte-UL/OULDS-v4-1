# Technician Daily View — Design Specification

---

## Overview

A mobile-friendly, desktop-first web interface designed for lab technicians. The goal is to give technicians a single place to see everything they need to act on today — without navigating LabWare, downloading files, or switching between Teams and email. The tone is dense but scannable — this is a working tool, not a dashboard for managers.

---

## Design Principles

- **Action-oriented.** Every element should answer the question: what do I do next?
- **Glanceable.** Critical status — blocked, in conditioning, ready to test — should be visible without clicking.
- **Role-appropriate.** Only show what a technician needs. No manager-level metrics, no cross-lab data.
- **Low friction.** Escalating an issue, logging data, or flagging a block should never take more than two taps.

---

## Brand and Visual Style

- **Color palette:** Navy (#002B5C), White (#FFFFFF), Red (#CC0000), Light grey (#F4F5F7), Mid grey (#9DA3AE)
- **Typography:** Inter or equivalent sans-serif. Headers 16–20px bold. Body 13–14px regular.
- **Spacing:** 8px base unit. Generous row padding for touch targets.
- **Iconography:** Simple line icons. No decorative illustration.
- **Status colors:**
  - 🟢 Green — Ready to test / Complete
  - 🟡 Amber — In conditioning / Awaiting sample
  - 🔴 Red — Blocked / Overdue
  - ⚪ Grey — Unstarted / Not yet due

---

## Layout Structure

The interface has three main zones:

```
+-------------------------------+
|        Top Navigation Bar     |
+-------------------------------+
|  Summary Strip (stat cards)   |
+-------------------------------+
|                               |
|       Project Queue           |
|       (main content)          |
|                               |
+-------------------------------+
|      Bottom Action Bar        |
|    (mobile only, sticky)      |
+-------------------------------+
```

---

## Zone 1 — Top Navigation Bar

**Height:** 56px **Background:** Navy (#002B5C) **Contents (left to right):**

- UL Solutions logo mark (white, left aligned)
- Page title: "My Work" (white, 16px bold, center)
- Avatar / initials of logged-in technician (right aligned, 32px circle, white border)
- Notification bell icon with unread badge count (right of avatar)

**No secondary navigation.** Technicians do not need tabs to other views. This is their only screen.

---

## Zone 2 — Summary Strip

**Height:** 88px **Background:** White **Border bottom:** 1px solid Light grey **Layout:** Four equal-width stat cards in a horizontal row

### Stat Card Anatomy

Each card contains:

- A number (24px bold, color-coded)
- A label (12px regular, Mid grey)
- A subtle left border (4px, color-coded by status)

### The Four Cards

| Card | Value Color | Label |
|------|-------------|-------|
| Ready to Test | Green | Projects I can start now |
| In Conditioning | Amber | Samples not yet ready |
| Blocked | Red | Needs attention |
| Due Today | Red (if >0) / Grey (if 0) | Due by end of day |

**Tapping a stat card filters the queue below to show only that category.**

---

## Zone 3 — Project Queue

This is the main content area. It is a vertically scrolling list of project rows, grouped into three sections with sticky section headers.

---

### Section Headers (Sticky)

Three sections, displayed in this order:

1. 🔴 **Blocked** — Projects the technician cannot currently progress
2. 🟢 **Ready to Test** — Projects with samples ready and datasheets confirmed
3. 🟡 **In Conditioning / Pending** — Projects awaiting sample conditioning, receipt, or information

Each section header is:

- 32px tall
- Light grey background
- 12px uppercase bold label + count badge (e.g. "BLOCKED · 2")
- Collapsible (tap to collapse/expand)

---

### Project Row — Default (Collapsed) State

**Height:** 72px **Background:** White **Border bottom:** 1px solid Light grey **Left border:** 4px colored strip matching section status color

**Contents (left to right):**

```
[Status Strip] [Project Info Column] [Due Date + Action]
```

**Project Info Column (left, ~70% width):**

- Line 1: Project ID (13px bold, Navy) + Customer name (13px regular, Mid grey) — separated by a dot
- Line 2: Test type (13px regular, dark grey)
- Line 3: Sample status pill (see below) + Equipment required (12px, Mid grey)

**Due Date + Action (right, ~30% width, right-aligned):**

- Due date (13px bold, color-coded: red if today or overdue, amber if within 2 days, grey otherwise)
- Small chevron icon (indicates expandable)

**Sample Status Pills:** Inline colored pills on Line 3 of the project info:

- 🟢 "Sample Ready" — green pill
- 🟡 "In Oven · 3 days left" — amber pill with countdown
- 🟡 "Awaiting Receipt" — amber pill
- 🔴 "Sample Missing" — red pill
- 🔴 "Function Check Failed" — red pill

---

### Project Row — Expanded State

Tapping a row expands it inline. The row grows to show a detail panel below the summary line. No navigation away from the list.

**Expanded panel sections (vertical stack):**

**A. Sample Details**

- Sample ID, quantity received vs. quantity required
- Conditioning profile if applicable (e.g. "70°C oven · Started Apr 20 · Ready Apr 27")
- A mini progress bar showing conditioning % complete
- If sample is missing or incorrect: a red banner with the specific issue noted

**B. Datasheet and Documents**

- Datasheet status: "✓ Confirmed" (green) or "⚠ Issues flagged" (amber) or "✗ Missing" (red)
- If confirmed: a "View Datasheet" button (opens inline PDF viewer or linked document)
- If issues flagged: a brief note on what is unclear, e.g. "Standard revision not specified"
- Supporting documents listed as chips: "Schematic," "Component Layout," "Operation Instructions" — each tappable to open. Missing documents shown as greyed-out chips with a "Missing" label.

**C. Test Details**

- Test parameters summary (key fields only — current, voltage, duration, standard reference)
- Equipment required with availability indicator:
  - 🟢 "Vibration Table · Available"
  - 🔴 "UV Chamber · Booked until May 3"

**D. Status and Data Entry**

- Current status dropdown: Unstarted / In Progress / On Hold / Complete
- If "In Progress": a simple inline data entry field for recording test observations or results, auto-saved, timestamped
- If "On Hold": a reason field (pre-populated options: Awaiting sample / Awaiting datasheet clarification / Equipment unavailable / Other)
- "Mark Complete" button — navy, full width — enabled only when all required data fields are filled

**E. Actions Row**

A horizontal strip of three action buttons at the bottom of the expanded panel:

| Button | Icon | Behavior |
|--------|------|----------|
| Flag Issue | ⚑ | Opens issue reporting modal (see below) |
| Contact Handler | ✉ | Opens pre-filled message to project handler |
| View History | 🕐 | Opens a timeline of all activity on this project |

---

## Issue Reporting Modal

Triggered by the "Flag Issue" button. Appears as a bottom sheet on mobile, centered modal on desktop.

**Contents:**

- Title: "Flag an Issue" (16px bold)
- Project ID and name shown at top (read-only)
- Issue type selector (radio buttons):
  - Sample missing or incorrect
  - Datasheet unclear or incomplete
  - Equipment unavailable
  - Function check failed
  - Other
- Free text field: "Describe the issue" (optional, placeholder text)
- Notify dropdown: Lab Leader (default) / Project Handler / Both
- Two buttons: "Cancel" (ghost) and "Send Flag" (navy, filled)

On submission:

- The project row status updates to 🔴 Blocked immediately
- A notification is sent to the selected recipient
- A timestamp and issue summary are logged in the project history

---

## Conditioning Timeline View

Accessible via a "Timeline" toggle button in the top right of the queue, next to a search icon.

**Layout:** A horizontal calendar strip showing the next 14 days across the top. Below it, each project with an active conditioning window is shown as a horizontal bar spanning its conditioning period.

- Bar color: Amber while conditioning, turns Green on completion date
- Each bar is labeled with Project ID and test type
- Tapping a bar opens the expanded project row

This gives technicians a quick answer to: "What will be ready to test this week and next?"

---

## Notification Center

Accessed via the bell icon in the top navigation bar. A slide-in panel from the right.

**Notification types:**

- 🟢 "Project [ID] sample is ready — conditioning complete"
- 🔴 "Project [ID] is overdue — due date was yesterday"
- 🟡 "Project [ID] has been assigned to you"
- ⚪ "Project handler responded to your flag on [ID]"

Each notification is tappable and navigates directly to the relevant project row in the expanded state.

---

## Empty States

| Scenario | Message |
|----------|---------|
| No blocked projects | "Nothing blocked — you're clear to test." (green checkmark icon) |
| No projects due today | "Nothing due today." |
| No projects assigned | "No projects assigned yet. Check back soon." |

---

## Responsive Behavior

- **Desktop (1200px+):** Expanded project rows show detail panel to the right in a split view rather than inline
- **Tablet (768–1199px):** Inline expansion as described above
- **Mobile (<768px):** Full-screen slide-in for expanded project detail. Bottom action bar is sticky with quick-access icons for Flag, Timeline, and Notifications.

---

## Accessibility

- All interactive elements minimum 44px touch target
- Color is never the only indicator of status — always paired with a label or icon
- All icons have aria-labels
- Keyboard navigable on desktop
- Focus states visible on all interactive elements

---

## Key Interactions Summary

| Interaction | Behavior |
|-------------|----------|
| Tap stat card | Filters queue to that category |
| Tap project row | Expands inline to show full detail |
| Tap section header | Collapses/expands that section |
| Tap "Flag Issue" | Opens issue modal, logs to history, alerts leader |
| Tap "Mark Complete" | Closes project row, moves to completed state |
| Toggle Timeline | Switches queue to 14-day conditioning calendar view |
| Tap notification | Navigates directly to relevant project row |
