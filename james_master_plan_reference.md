# James — Master Summer Study Plan 2026
## Claude Code Integration Reference
### study.html — "Today's Study" Panel

---

## Overview

This file is the authoritative reference for integrating the master summer study plan into the dashboard at `row-fysk.vercel.app/study.html`. It contains:

1. The complete 10-week session schedule as a structured data object
2. The weekly rhythm (which subject goes on which day)
3. Integration spec — where and how to add the panel to study.html
4. Subject colour codes matching the existing dashboard palette
5. Session type definitions

---

## Summer Parameters

- **Start date:** Monday 23 June 2026
- **End date:** Friday 28 August 2026 (10 weeks)
- **Buffer week:** 1–5 September (before school resumes)
- **School resumes:** First week of September 2026
- **Total weeks:** 10

Week numbers are calculated from the start date:
- Week 1: 23–27 Jun
- Week 2: 30 Jun–4 Jul
- Week 3: 7–11 Jul
- Week 4: 14–18 Jul
- Week 5: 21–25 Jul
- Week 6: 28 Jul–1 Aug
- Week 7: 4–8 Aug
- Week 8: 11–15 Aug
- Week 9: 18–22 Aug
- Week 10: 25–29 Aug

---

## Subject Colour Codes

Use these consistently across the plan panel. Match to existing dashboard colour variables where possible.

```
Applied Maths  → --accent / #c8f060  (lime green — primary subject, 3x/week)
Accounting     → --amber  / #f0a040  (amber)
Chemistry      → --blue   / #60b4f0  (blue)
Physics        → --purple / #b08af0  (purple)
PE             → --green  / #60d090  (green)
Irish          → --red    / #ff6b6b  (red/coral)
Anki           → --text-sec / #888   (grey — maintenance, not a full session)
```

---

## Fixed Weekly Rhythm

This is the repeating weekly pattern. Specific session content varies by week number (see 10-Week Schedule below).

| Day | Fixed sessions | Notes |
|-----|---------------|-------|
| **Monday** | Applied Maths — Lesson (Study Block 1) | Always AM lesson. 50 min. |
| **Tuesday** | Accounting — Understand session (Study Block 1) · Anki Physics rotation (10 min, folded into Accounting block or separate) | Training morning — one study block only. |
| **Wednesday** | Applied Maths — Lesson (Study Block 1) · Chemistry (Study Block 2) | Best study day. Two full blocks. |
| **Thursday** | Accounting — Attempt session (Study Block 1) · PE session (Thursday slot, weeks 1–10 on rotating basis — see schedule) | Training morning — one study block. PE replaces Accounting on its assigned week. |
| **Friday** | Applied Maths — Lesson (Study Block 1) · Chemistry/AAC alternating (Study Block 2) | Free day. Two blocks. Study done by 12:30. |
| **Saturday** | Zero study | Match day. |
| **Sunday** | Anki only — PE rotation (10 min) | No full session. |

**Irish (6 sessions):** Float — slot into any gap when a day's second block is free or a session finishes early. Roughly one per 1–1.5 weeks. S1 must precede S2 and S6. S3 must precede S6.

**Physics (6 sessions):** Light-touch — mostly 30 min. Assigned to specific weeks (see schedule). Slot into any free morning on the assigned week.

---

## 10-Week Session Schedule (Complete)

This is the data source for the "Today's Study" panel. Index by `weekNumber` + `dayOfWeek`.

```javascript
const SUMMER_START = new Date('2026-06-23'); // Monday

const schedule = {
  1: { // Week 1: 23–27 Jun
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch1 L1 — Horizontal UAM', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 1 — Revaluation of Fixed Assets. Grinds360 book p.27 + video lessons.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch1 L2 — Vertical UAM (Free-fall)', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Theory', detail: 'Chemistry theory session — Wednesday slot', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'PE', type: 'Session 1', detail: 'Type A — Analysing Performance, Safe Practice, Role of Coach. Grinds360 3A/3B/3C.', duration: 60, color: 'green' },
      { subject: 'PE-PAP', type: 'PAP', detail: 'Read SEC PAP guidelines (curriculumonline.ie) — 45 min', duration: 45, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch1 L3 — Successive Times and Distances', duration: 50, color: 'accent' },
      { subject: 'Physics', type: 'Session 1', detail: 'LC Section A format familiarisation. Download 2023/2022/2019 papers. Build Section A template card.', duration: 55, color: 'purple' }
    ]
  },
  2: { // Week 2: 30 Jun–4 Jul
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch1 L4 — Catch-up Problems', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 2 — Suspense + Control Accounts. Grinds360 book p.131 + p.135. Suspense recorded grind.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch1 L5 — Bodies Moving in Opposite Directions', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Theory', detail: 'Chemistry theory session — Wednesday slot', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 2 — Unseen Suspense or Control Account past paper question. Cold. Verify if 84% was real.', duration: 50, color: 'amber' },
      { subject: 'PE-PAP', type: 'PAP', detail: 'Watch PAP Masterclasses 1+2 on Grinds360 (at 1.75x)', duration: 45, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch1 L6 — Velocity-Time Graphs. Take the full session — most nuanced UAM lesson.', duration: 50, color: 'accent' },
      { subject: 'Physics', type: 'Project 1', detail: 'Read official AAC Physics in Practice guidelines. Download from examinations.ie. Note assessment criteria.', duration: 30, color: 'purple' }
    ]
  },
  3: { // Week 3: 7–11 Jul
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch1 L7 — Dimensional Analysis (short lesson)', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 3 — Club Accounts rebuild. Grinds360 book p.108 + Club Accounts recorded grind (69 min).', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Checkpoint', detail: '✓ CHECKPOINT: UAM — 2 Old LC Questions timed, marked against scheme. Below 70% on both → do a third.', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Application', detail: 'Chemistry application/past paper session — alternating Friday/Wednesday', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 3 — 2019 Q6 Club Accounts. 45-minute timer. Do not watch Grinds360 solution first.', duration: 50, color: 'amber' },
      { subject: 'PE-PAP', type: 'PAP', detail: 'PAP Masterclass 3. Decide activity (gym recommended), confirm with PE teacher.', duration: 45, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch2 L1 — Basic Vectors', duration: 50, color: 'accent' },
      { subject: 'Irish', type: 'Float', detail: 'Irish Session 1 (if not done): Essay Phrases + Topic Selection. ~50 min. Must happen before S2 and S6.', duration: 50, color: 'red' }
    ]
  },
  4: { // Week 4: 14–18 Jul
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch2 L2 — Components of a Vector and Dot Product', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 4 — Service Firms rebuild. Grinds360 book p.112 + Loan Workings + Investment Workings + Service Accounts grind.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch2 L3 — i and j Vectors. TWO exercises (Ex3 + Ex4) — both must be completed.', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Theory', detail: 'Chemistry theory session — Wednesday slot', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 4 — 2020 Q7 Service Firm. 45-minute timer. Score vs 53% class result = measure of summer progress.', duration: 50, color: 'amber' },
      { subject: 'PE-PAP', type: 'PAP', detail: 'Complete Stage 1 performance analysis. Run all tests. Compile Hevy + Garmin data.', duration: 60, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Checkpoint', detail: '✓ CHECKPOINT: Vectors — 2 Old LC Questions timed. Below 70% → check i/j notation from L3 before proceeding.', duration: 50, color: 'accent' },
      { subject: 'Physics', type: 'Project 2', detail: 'Confirm AAC topic (leading: Phase Change Materials). Draft research question naming IV, DV, context.', duration: 30, color: 'purple' }
    ]
  },
  5: { // Week 5: 21–25 Jul
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch3 L1 — Applying equations of motion in x and y directions', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 5 — Q1 Sole Trader Final Accounts: structure. Grinds360 book p.39 + Quick Guide to Q1 + Week 1 Final Accounts grind.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch3 L2 — Proving general rules (range and max height from first principles)', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Application', detail: 'Chemistry application/past paper session', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 5 — First Q1 Sole Trader attempt. 54-minute timer. Studyclix. Identify every adjustment type missed.', duration: 54, color: 'amber' },
      { subject: 'PE', type: 'Session 3', detail: 'Type A — Physical Activity Participation and Promoting Pathways (5A + 5B). Grinds360 + 2–3 Studyclix Qs.', duration: 50, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch3 L3 — Finding Angles', duration: 50, color: 'accent' },
      { subject: 'Irish', type: 'Float', detail: 'Irish float session — S2, S3, S4, or S5 depending on what\'s been done. Check sequence constraints.', duration: 55, color: 'red' }
    ]
  },
  6: { // Week 6: 28 Jul–1 Aug
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch3 L4 — i and j Vector Approach. New territory — take the full session.', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 6 — Q1 Sole Trader: adjustments in depth. Depreciation adjustment lessons + Week 2 Final Accounts grind.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch3 L5 — Projectiles and Elasticity', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Theory', detail: 'Chemistry theory session — Wednesday slot', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 6 — Second Q1 Sole Trader (different year). 54-minute timer.', duration: 54, color: 'amber' },
      { subject: 'PE', type: 'Session 4', detail: 'Type A — Ethics and Fair Play (Ch 6). Grinds360 ethics videos + 2–3 written practice answers.', duration: 55, color: 'green' },
      { subject: 'PE-PAP', type: 'PAP', detail: 'Design Stage 3 training programme targeting all 4 SMART goals.', duration: 45, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Checkpoint', detail: '✓ CHECKPOINT: Projectiles — 2 Old LC Questions timed. If L5 ran long Wed, push checkpoint to Mon Wk7.', duration: 50, color: 'accent' },
      { subject: 'Physics', type: 'Project 3', detail: 'Background reading on confirmed PCM topic. Wikipedia level. Notes: phenomenon, physics principles, prior measurements.', duration: 30, color: 'purple' }
    ]
  },
  7: { // Week 7: 4–8 Aug
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch4 L2 — Connected Particles. (Ch4 L1 may be here if Wk6 checkpoint was pushed)', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 7 — Company Final Accounts. Grinds360 Company section + Q1 Company video. Note: share capital, debentures, corp tax, dividends.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Checkpoint', detail: '✓ CHECKPOINT: Ch4 L3 Pulleys + Newton\'s Laws checkpoint — budget full 50 min (Pulleys + checkpoint is tight).', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Application', detail: 'Chemistry application/past paper session', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 7 — Q1 Company from 2022, 2023, or 2024. 54-minute timer.', duration: 54, color: 'amber' },
      { subject: 'PE', type: 'Session 5', detail: 'Type B — Section 1 timed practice. 50 min timed. Mark + categorise every dropped mark.', duration: 55, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch6 L1 — Work and Energy', duration: 50, color: 'accent' },
      { subject: 'Irish', type: 'Float', detail: 'Irish float session — use whichever session has not been done. Check S1→S2→S6 sequence constraint.', duration: 55, color: 'red' }
    ]
  },
  8: { // Week 8: 11–15 Aug
    mon: [
      { subject: 'Applied Maths', type: 'Checkpoint', detail: '✓ CHECKPOINT: Ch6 L2 Conservation Laws + Work & Energy checkpoint immediately after.', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 8 — Q1 consolidation. Re-read error log Wks 5–7. Find 3 most-missed adjustment types, re-read book sections. Watch 2024 Q1 Suspense & Bank Rec workings.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch7 L1 — Equations of Circular Motion. New conceptual territory — go slowly.', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Theory', detail: 'Chemistry theory session — Wednesday slot', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 8 — Q1 from unused year. Choose A or B on the day as in the exam.', duration: 54, color: 'amber' },
      { subject: 'PE', type: 'Session 6', detail: 'Type B — Section 2 case study (40 min) + Section 3 long questions (50 min). Mark both against scheme.', duration: 90, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch7 L2 — Horizontal Circular Motion', duration: 50, color: 'accent' },
      { subject: 'Physics', type: 'Project 4', detail: 'Outline methodology: what to measure, how, equipment needed, number of trials, data recording format.', duration: 30, color: 'purple' }
    ]
  },
  9: { // Week 9: 18–22 Aug
    mon: [
      { subject: 'Applied Maths', type: 'Checkpoint', detail: '✓ CHECKPOINT: Ch7 L3 Vertical Circular Motion + Circular Motion checkpoint — 2 LC questions.', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 9 — Q5 Interpretation of Accounts. Grinds360 book p.125 + Interpretation grind (70 min) + Writing to a Shareholder (71 min).', duration: 90, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch8 L1 — Direct Collisions', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Application', detail: 'Chemistry application/past paper session', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 9 — Q5 from 2023 or 2024. 45-minute timer. Calculate all ratios + full written commentary.', duration: 45, color: 'amber' },
      { subject: 'PE', type: 'PAP Run', detail: 'Stage 3 programme running. Log in Hevy. Write one reflection per goal (ongoing).', duration: 45, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch8 L2 — More than one collision', duration: 50, color: 'accent' },
      { subject: 'Irish', type: 'Float', detail: 'Irish float session — S5 or S6 (S6 requires S1 + S3 done first). Final sessions before September.', duration: 60, color: 'red' }
    ]
  },
  10: { // Week 10: 25–29 Aug
    mon: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch8 L3 — Collisions with Strings', duration: 50, color: 'accent' }
    ],
    tue: [
      { subject: 'Accounting', type: 'Understand', detail: 'Week 10 — Review. Read full error log and all topic checklists. Write one-page handover note to self for September.', duration: 50, color: 'amber' },
      { subject: 'Anki', type: 'Maintenance', detail: 'Physics rotation — 10 min', duration: 10, color: 'grey' }
    ],
    wed: [
      { subject: 'Applied Maths', type: 'Lesson', detail: 'Ch8 L4 — Oblique Collisions. Hardest lesson all summer. Video + notes only — exercises on a separate day if needed.', duration: 50, color: 'accent' },
      { subject: 'Chemistry', type: 'Theory', detail: 'Chemistry theory session — final week', duration: 50, color: 'blue' }
    ],
    thu: [
      { subject: 'Accounting', type: 'Attempt', detail: 'Week 10 — Second Q5 attempt (different year). 45-minute timer. Baseline for 6th year.', duration: 45, color: 'amber' },
      { subject: 'PE', type: 'Session 7', detail: '✓ CHECKPOINT: Full 100-min exam conditions. Section 1 (50 min) → Section 2 (40 min) → begin S3. Mark all. Compare to Sessions 5 and 6.', duration: 100, color: 'green' },
      { subject: 'PE-PAP', type: 'PAP', detail: 'Draft Stage 4 concluding analysis (interim — programme continues into 6th year).', duration: 45, color: 'green' }
    ],
    fri: [
      { subject: 'Applied Maths', type: 'Checkpoint', detail: '✓ FINAL CHECKPOINT: Collisions — 2 Old LC Questions. Course complete. Log final lesson count.', duration: 50, color: 'accent' },
      { subject: 'Physics', type: 'Project 5', detail: 'September readiness review. Consolidate all Physics project sessions into one-page summary for supervisor.', duration: 30, color: 'purple' }
    ]
  }
};
```

---

## Irish Floating Sessions — Sequence Rules

Irish has 6 sessions that float across the 10 weeks. They are suggested in the schedule above but can move freely within these constraints:

- **S1 must happen before S2 and S6**
- **S3 must happen before S6**
- **S4 and S5 are fully independent**
- Target roughly one session per 1–1.5 weeks
- Weeks 3, 5, 7, 9 are the suggested slots (Friday second block or any free gap)

| Session | Content | Duration | Dependency |
|---------|---------|----------|------------|
| S1 | Essay Phrases + Topic Selection | 50 min | None — do first |
| S2 | First Timed Essay + Pulc.ai Feedback | 60 min | After S1 |
| S3 | Reading Comprehension: Format + Timing | 55 min | None |
| S4 | Prose Exam Technique | 50 min | None |
| S5 | Poetry Exam Technique | 50 min | None |
| S6 | Second Essay + Reading Comp Consolidation | 60 min | After S1 + S3 |

---

## PE Sessions — Thursday Slot Assignment

PE sessions are on Thursdays. PAP tasks share the Thursday slot (PE theory and PAP may be on the same Thursday or split — use judgment based on load).

| Week | Thursday PE content |
|------|-------------------|
| 1 | Session 1 — Type A (3A/3B/3C) + PAP: Read SEC guidelines |
| 2 | Accounting Attempt + PAP: Masterclasses 1+2 |
| 3 | Accounting Attempt + PAP: Masterclass 3, confirm activity |
| 4 | Accounting Attempt + PAP: Stage 1 performance analysis |
| 5 | Session 3 — Type A (5A/5B) |
| 6 | Session 4 — Type A (Ethics, Ch6) + PAP: Design Stage 3 programme |
| 7 | Session 5 — Type B (Section 1 timed practice) |
| 8 | Session 6 — Type B (Case study + long questions) |
| 9 | PAP: Stage 3 running + Hevy logging |
| 10 | Session 7 — Checkpoint (full exam conditions) + PAP: Draft Stage 4 |

Note: Session 2 (Diet/Nutrition, 2D) was not explicitly placed in the Thursday slots above — it should be inserted in **Week 2 or 3 Thursday** if the Accounting Attempt is short or energy allows. It is a 50-min Type A session.

---

## Applied Maths Progress Counter

The dashboard already has an Applied Maths lesson counter (`0 / 35`). The schedule above has exactly **27 lessons + 7 checkpoints = 34 sessions** (3/week × 10 weeks = 30 blocks, some shared with checkpoints). The total lesson count is 27 lessons across Ch1–Ch8 (excluding Ch5, 9, 10, 11 which are deferred).

**Lesson log by chapter:**
- Ch1 UAM: L1–L7 = 7 lessons
- Ch2 Vectors: L1–L3 = 3 lessons (+ 2 exercises = effectively 4 sessions)
- Ch3 Projectiles: L1–L5 = 5 lessons
- Ch4 Newton's Laws: L1–L3 = 3 lessons
- Ch6 Work & Energy: L1–L2 = 2 lessons
- Ch7 Circular Motion: L1–L3 = 3 lessons
- Ch8 Collisions: L1–L4 = 4 lessons
- **Total: 27 lessons**

The existing `+1 Lesson` button on study.html increments this counter. No change needed to that component.

---

## Panel Integration Spec for study.html

### Where to insert

Insert the new "Today's Study" panel **between the streaks section and the Applied Maths lesson counter**. This is the most natural position — plan before tracker.

### Panel structure (HTML)

```html
<section id="today-plan" class="card">
  <div class="card-header">
    <span class="label">WEEK <span id="plan-week-num">—</span> OF 10</span>
    <h2>Today's Study</h2>
    <span class="plan-date" id="plan-today-date"></span>
  </div>

  <div id="plan-sessions-today">
    <!-- Populated by JS — today's sessions -->
  </div>

  <div class="plan-week-strip">
    <div class="plan-strip-label">THIS WEEK</div>
    <div id="plan-week-overview">
      <!-- Populated by JS — remaining days this week -->
    </div>
  </div>
</section>
```

### JavaScript logic

```javascript
function getSummerWeek() {
  const start = new Date('2026-06-23');
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(10, week)); // clamp to 1–10
}

function getDayKey() {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return days[new Date().getDay()];
}

function getTodaySessions() {
  const week = getSummerWeek();
  const day = getDayKey();
  if (day === 'sat') return []; // match day
  if (day === 'sun') return [{ subject: 'Anki', type: 'Maintenance', detail: 'PE rotation — 10 min only', duration: 10, color: 'grey' }];
  const weekPlan = schedule[week];
  if (!weekPlan) return [];
  return weekPlan[day] || [];
}
```

### Session card rendering

Each session renders as a pill/card with:
- Subject name (coloured dot or left border matching subject colour)
- Session type badge (Lesson / Checkpoint / Understand / Attempt / Type A / Type B / Project / Float)
- Detail text (truncated to 2 lines with expand on tap)
- Duration badge (e.g. "50 min")

### Edge cases

- **Saturday:** Show "Match Day — Zero Study" message
- **Sunday:** Show Anki maintenance card only
- **Before 23 June or after 29 August:** Show "Summer plan complete" or "Pre-summer" state
- **Week > 10:** Show "Return to school" message

---

## Session Type Badges

| Type | Display label | Meaning |
|------|-------------|---------|
| `Lesson` | LESSON | New Grinds360 content |
| `Checkpoint` | ✓ CHECK | Timed past paper under exam conditions |
| `Understand` | UNDERSTAND | Accounting Tuesday — read + video, no attempt |
| `Attempt` | ATTEMPT | Accounting Thursday — cold past paper |
| `Type A` | THEORY | PE knowledge consolidation (Grinds360) |
| `Type B` | EXAM PRACTICE | PE timed exam sections |
| `PAP` | PAP | PE Physical Activity Project task |
| `Theory` | THEORY | Chemistry Wednesday theory session |
| `Application` | PAST PAPER | Chemistry/Physics past paper practice |
| `Project 1–5` | AAC PROJECT | Physics AAC task |
| `Float` | IRISH | Irish floating session |
| `Maintenance` | ANKI | 10-min Anki rotation |

---

## Chemistry Note

Chemistry sessions follow a Wednesday (theory) / Friday (application, alternating with AAC) pattern from the Chemistry plan. The specific topics within each Chemistry session follow the Chemistry plan's own week-by-week content schedule — the master plan does not override the Chemistry plan's internal topic sequence. Reference `james_chemistry_plan_v3.html` for the Chemistry topic progression.

---

## What This Plan Does NOT Include

- **Maths HL:** No summer study required. H1 secured.
- **English HL:** No summer study allocated. Passive reading only if desired.
- **French:** Light Duolingo maintenance (10–15 min, not a study session). Not tracked as a study session in the dashboard.

---

## Files in This Project

| File | Purpose |
|------|---------|
| `james_master_plan_reference.md` | This file — integration spec for Claude Code |
| `applied_maths_plan_reference.md` | Applied Maths detailed plan |
| `james_accounting_plan_reference.md` | Accounting detailed plan |
| `james_pe_plan_reference_v2.md` | PE detailed plan |
| `james_physics_plan_reference_v2.md` | Physics detailed plan |
| `james_irish_plan_reference_v1.md` | Irish detailed plan |
| `james_chemistry_plan_v3.html` | Chemistry detailed plan (HTML) |
| `james_lifestyle_plan.html` | Full weekly lifestyle structure |
