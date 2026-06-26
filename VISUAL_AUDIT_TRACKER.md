# Visual Audit Tracker — Prawal Personal Brand
> Last audited: 2026-06-05 | Live screenshots taken of every page section

---

## Legend
- ✅ Done — implemented and verified live
- 🔴 Critical — actively hurts premium signal, must fix
- 🟠 High — noticeable quality gap, fix soon
- 🟡 Medium — polish issue, fix when possible
- ⚪ Low — minor, fix last
- 💡 Enhancement — beyond fixing, elevates further

---

## COMPLETED (session 2 — 2026-06-05)

| # | Item | Page | Notes |
|---|---|---|---|
| ✅ | **E1** — Boardroom stats: left-aligned, `flex-end`, numbers 4.8–9.6rem, `p` hidden, ` > span` specificity fix | Executive | "9+", "120K+" now massive and left-bottom aligned |
| ✅ | **E2** — Journey hero ledger stats: `clamp(2.4rem,4vw,4.2rem)`, mobile override `2.8rem` | Journey | Up from 1.75rem |
| ✅ | **A1** — Awards stat row: `flex-end`, `clamp(3rem,5.5vw,5.2rem)`, generous padding | Awards | "10", "8", "4", "2026" now large |
| ✅ | **CF1** — Conference image crop: `16/9` aspect ratio, `object-position: center top` | Conferences | Consistent crops across all event cards |
| ✅ | **CF2** — Conference card border-radius: `var(--radius)→4px` | Conferences | More editorial, less consumer-app |
| ✅ | **R1** — Reference archive: left border accent, top 2 rows highlighted, dark border-top | References | Visual hierarchy restored |
| ✅ | **R2** — Monogram avatars: bg opacity `0.10→0.16`, border opacity `0.22→0.32` | References | Better contrast on dark background |
| ✅ | **R3** — Reference dates: `0.78rem→0.68rem`, `opacity: 0.7` | References | Less clutter, dates recede |

---

## COMPLETED (session 1)

| # | Item | Page | Notes |
|---|---|---|---|
| ✅ | CSS color tokens — `--green` brightened `#0d594c→#0f6b5c` across 135+ usages | Global | CTAs and nav active now visible on dark |
| ✅ | Added light surface tokens (`--paper-light`, `--ink-on-light`, etc.) | Global | Enables light breathing sections |
| ✅ | Fixed `--ink-muted` contrast `#6b6158→#7a7068` (now AA compliant) | Global | |
| ✅ | Removed orphan `--blue` and `--copper` tokens | Global | `--blue` replaced with `--green-text` |
| ✅ | `0 GLOBAL DELIVERY ESCALATIONS` → `US·UK·SA` metric | Executive | No more "0" displaying as a stat |
| ✅ | `0 ESCALATIONS` sidebar → replaced with `8yr+` | Journey | |
| ✅ | Journey hero `0` → `4 GLOBAL DELIVERY REGIONS` | Journey | |
| ✅ | `ACH BANKING WORKFLOWS` → `FINTECH / Payment Systems` | Executive | |
| ✅ | Reference archive avatar circles → green square monograms | References | Removed Gmail-style colored circles |
| ✅ | Light breathing section on impact ledger (Selected Impact) | Executive | Dark→cream→dark rhythm now works |
| ✅ | Light breathing section on Operating Style | Executive | Second cream section |
| ✅ | Light breathing section on Earlier Foundations | Journey | Light cream with proper dark text overrides |
| ✅ | Boardroom stat font-size raised to `clamp(3.4rem, 7vw, 7.8rem)` | Executive | CSS done but still visually small — see E1 below |
| ✅ | Floating chat button — circle→pill design | Global | Frosted glass pill, only shows at >1100px |
| ✅ | Project portfolio card image area — cream→dark green | Projects | Unified with NDA case study dark aesthetic |
| ✅ | Book Contributor — vertical card→horizontal editorial layout | Highlights | Left: image, Right: content |
| ✅ | `evidence-index-item:hover` → `var(--green-text)` | Global | Removed gold from hover state |
| ✅ | `proof-state::before` dot → green | Global | |
| ✅ | Arbitrary first-card gold borders → green on leadership/executive note cards | Executive | |

---

## EXECUTIVE (HOME) — Remaining Issues

| ID | Priority | Issue | Root Cause | Fix Required |
|---|---|---|---|---|
| E1 | 🔴 | **Boardroom stats still visually tiny** — "9+", "120K+", "20-30%", "AWS/AZURE/GCP" sit as tiny centered numbers in large dark cards. CSS is at 73px but "9+" is only 15px wide (2 chars in serif). | Centered layout + short strings = no visual weight. Cards are 454px wide, numbers fill <5% of card area. | Change to left-aligned layout. Numbers at 9-12rem. Remove description text from card — move to below grid. Stack number + label only inside card. |
| E2 | 🟠 | **Journey hero sidebar stats (9+, 5, 4) still tiny** — same centering issue, numbers are 1-2 characters next to full-width label text | Same root cause as E1 | Increase font to `clamp(2.8rem, 4vw, 4rem)`, left-align |
| E3 | 🟠 | **Section pacing — all dark, no chapter breaks** — though two light sections exist, sections like "How I Lead", "Leadership OS", "Perspectives", "Framework" are back-to-back dark with no visual pause | Too many sections without structural relief | Add one more light section or visual full-bleed break between Framework and Final CTA |
| E4 | 🟡 | **"How I Lead" section card sub-headers** — "AI DELIVERY SYSTEM", "PLATFORM SCALE", "VISIBLE PROOF" labels in small caps are the same gold as eyebrow labels everywhere else | Gold overuse | Change to `var(--green-text)` |
| E5 | 🟡 | **Section header accent line (gradient bar)** — appears before EVERY section. Becomes invisible through repetition | Over-applied | Remove from 2-3 sections where it adds no value; keep only on first section per page |
| E6 | 🟡 | **Leadership OS pill tags** ("GLOBAL STAKEHOLDER ALIGNMENT" etc.) — green outlined pill shapes look consumer-app | CSS border-radius: 999px on tag chips | Change to `border-radius: 4px` or remove pill entirely, use small-caps text only |
| E7 | ⚪ | **Footer** — 4-column plain link grid, no visual payoff for reaching the bottom of any page | Never redesigned | Add a one-line brand statement or horizontal rule above footer |

---

## JOURNEY — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| J1 | 🟠 | **No visual hierarchy between Technology Manager and Software Engineer Trainee** — current and entry-level roles look identical in card weight, type size, border treatment | Make Technology Manager card visually dominant: larger title, bolder summary, different border treatment or background |
| J2 | 🟠 | **Role card bullet points too dense** — Technology Manager has 4 bullets, Technology Lead has 3. At a glance all cards blur together | Reduce to max 2 bullets per role. Condense each to one punchy line. The role summary sentence should carry the weight |
| J3 | 🟡 | **Journey hero ledger stats (9+, 5, 4)** — numbers are tiny next to label text, no visual weight | Increase from `clamp(1.75rem, 3vw, 3.15rem)` to `clamp(2.4rem, 4vw, 4.2rem)` |
| J4 | 🟡 | **No timeline metaphor** — 9-year single-company arc with 5 role transitions has no visual line/spine connecting roles | Add a vertical connector line with year markers in the role progression sidebar |
| J5 | ⚪ | **"What the journey proves" closing card** — text is body-copy sized, doesn't close the page with authority | Increase quote text to `1.3rem`, add more padding |

---

## AWARDS — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| A1 | 🟠 | **Award stat row (10, 8, 4, 2026)** — horizontal strip with small numbers and small labels. These are strong proof numbers displayed at reading size | Make stats display at `3-4rem`, full-width 4-column grid with generous padding |
| A2 | 🟠 | **Award photo grid inconsistent image crops** — 3-column grid mixes photos at different proportions (some portrait, some landscape, some group shots) | Enforce `aspect-ratio: 4/3` on all award card images with `object-fit: cover` |
| A3 | 🟡 | **Award photos unframed** — ceremony photos are raw without any editorial treatment | Add consistent `border-radius: 0` (no round corners), subtle inner shadow or vignette on image hover |
| A4 | 🟡 | **Award archive table** — plain date + title rows with no visual column separation | Add left border accent on hover, increase row padding |

---

## CREDENTIALS — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| C1 | 🟠 | **Primary cert cards missing certificate images** — the 4 main credential cards (AWS AI Practitioner, AWS Solutions Architect, MS Azure AI, Google Cloud) show text only with no certificate image/badge thumbnail | Re-add the certificate thumbnail image to the primary cards. Image should be 80px × 80px badge in top-right corner of card |
| C2 | 🟡 | **"Primary official proof wall" section label** — editorial copy is clunky; reads like a developer string | Rename to "Official credentials" or simply remove the section label |
| C3 | ⚪ | **Supporting credential list** — small certificate thumbnails are low-res | Either hide thumbnail or increase to 60×60 with proper border-radius |

---

## CONFERENCES — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| CF1 | 🟠 | **Event card image crops inconsistent** — 2-column grid shows selfie photos mixed with stage shots at same card height. Some are portrait crops, some landscape | Enforce `aspect-ratio: 16/9` on all event card images with `object-fit: cover; object-position: center top` |
| CF2 | 🟠 | **Event cards use large border-radius (12px)** — consumer-app rounded corners undercut the editorial/executive tone | Reduce to `border-radius: var(--radius)` (8px) or `4px` |
| CF3 | 🟡 | **Informal group selfies mixed with stage shots** — AWS Symposium shows a casual 3-person selfie at the same visual weight as AI Impact Summit stage photo | Either crop selfies to head-and-shoulders editorial portrait style, or add a "field note" label to informal shots |

---

## HIGHLIGHTS — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| H1 | 🟡 | **"Selected proof notes" section divider** — barely visible small text, doesn't introduce the section with authority | Increase divider label font, add more top margin |
| H2 | 🟡 | **Book Contributor — first carousel image** — shows a group photo (Successive Digital team), not the book cover. Less impactful as the first visual | Reorder `images` array in `mediaAssets.js` to put the book cover (`the-subtle-art...webp`) first |
| H3 | 🟡 | **Global routes map** — functional but small and underweighted inside the `international-note` card | Increase map height from auto to `min-height: 280px`, give it more breathing room |
| H4 | ⚪ | **"Selected proof tiles"** — grid of small proof thumbnails has no captions visible at thumbnail scale | Either remove this grid or increase tile size and add visible label |

---

## REFERENCES — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| R1 | 🟠 | **Reference archive is a wall of text** — 9+ references listed as equal-weight rows. No visual hierarchy between a VP Engineering Track reference and a junior team member | Top 3-4 references should have larger quote text or a visual distinction (left border, slightly larger font). Remaining references form the standard list below |
| R2 | 🟡 | **Monogram squares** — the new green square avatars are better than Gmail circles but the background is too similar to the dark page background. Low contrast. | Increase background opacity from `rgba(15, 107, 92, 0.10)` to `0.16`, increase border opacity |
| R3 | ⚪ | **Reference dates** — shown right-aligned (e.g., "May 25, 2021"). Too prominent — they add date clutter that distracts from the quote | Reduce date font-size to `0.72rem` and `color: var(--ink-muted)` |

---

## PROJECTS — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| P1 | 🟡 | **Project description text still dense** — professional system cards (Data Refinery, BIM) have 3-5 sentence descriptions in body copy | Reduce to max 2 sentences. Lead with impact, not explanation. |
| P2 | 🟡 | **Domain system mini-cards** (Taxonomy, TruckBoard, ACL) — slightly lighter dark than the NDA cards above. Third visual variant on one page | Normalise border color to `rgba(255,255,255,0.08)` to match the rest |
| P3 | ⚪ | **"Every project should answer…" closing section** — 4-quadrant case study model grid is clean but the section label "Case study standard" in green pill looks app-like | Change pill to plain eyebrow text |

---

## GLOBAL / SYSTEMIC — Remaining Issues

| ID | Priority | Issue | Fix Required |
|---|---|---|---|
| G1 | 🟠 | **Thin 1px dividers** — used throughout as section separators between content blocks. Feels cheap, low-contrast | Replace `border-top: 1px solid rgba(255,255,255,0.08)` dividers with increased top-padding only (no line) OR use a 2px gradient line |
| G2 | 🟡 | **Green pill action tags** — "GLOBAL STAKEHOLDER ALIGNMENT", "AI-ASSISTED ENGINEERING PRACTICE" etc. — `border-radius: 999px` consumer-app pill shape | Change to `border-radius: 4px` throughout. More editorial, less startup. |
| G3 | 🟡 | **Nav has no visual active underline animation** — active state is a filled green pill. No hover microinteraction visible in screenshots | Already has `::after` underline animation in CSS — verify it's working in production |
| G4 | ⚪ | **Footer identical on every page** — 4-column link grid, no personality | Add current page section header or a single brand statement above the link columns |

---

## PREMIUM ENHANCEMENTS (Beyond Fixing)

These are not bugs but upgrades that would materially close the gap to a ₹1 crore portfolio:

| ID | Impact | Enhancement |
|---|---|---|
| PE1 | 💡 High | **Hero portrait card** — the executive page photo is good. Upgrade its right-side context card: add a thin typographic annotation overlay (e.g., "9+ years at Successive Digital" anchored at bottom-left of photo in cream text) |
| PE2 | 💡 High | **Awards page — pattern statement** — the hero editorial quote "A long-running pattern of being trusted..." deserves a full-viewport typographic moment: oversized serif text at `5-6rem`, light-on-dark, before the award grid |
| PE3 | 💡 High | **Conferences page — AI Impact Summit** — the stage photo is the strongest image on the entire site. It deserves a full-bleed cinematic section: full-width image, headline overlaid, no card border |
| PE4 | 💡 Medium | **Recommendation pull quotes** — the two highlighted quotes in the references page ("The great thing about Prawal…", "An innovative, hard-working…") should be displayed at `2rem+` as typographic anchors, not in small cards |
| PE5 | 💡 Medium | **Journey — Successive Digital flagship section** — "8yr 10mo" should be displayed at monument scale (`8-10rem`) as a standalone visual anchor before the role breakdown |
| PE6 | 💡 Medium | **Scroll-triggered chapter numbers** — the `01`, `02`, `03` chapter markers are already in the CSS but render small. Make them render at `6-8rem` in gold, fading in as you scroll |
| PE7 | 💡 Low | **Page transitions** — currently each route change is an instant swap. A subtle fade (150ms) between pages would feel premium |

---

## PRIORITY ORDER FOR NEXT SESSION

### ✅ Completed Session 2
- **E1** Boardroom stats — done
- **E2** Journey hero stats — done
- **A1** Awards stat row — done
- **CF1/CF2** Conference crops + radius — done
- **R1/R2/R3** References hierarchy + contrast + dates — done
- **J1** TM card dominance — done
- **J2** Bullet density — already 2 per card
- **C1** Credential images — already showing
- **H2** Book cover first — done
- **G1** Gradient dividers (section + reference archive) — done
- **G2** Pill → 4px (conference-type-pill, highlight-category-pill) — done
- **A2** Award image 4:3 crop — done

### ✅ Completed Session 2 (continued)
- **C2** — "Official credentials" heading — done
- **E4** — "How I Lead" sub-headers → `var(--green-text)` — done
- **H1** — "SELECTED PROOF NOTES" divider label now green + gradient hr — done
- **H2** — Book cover first in carousel — done
- **H3** — Global routes map `min-height: 280px` — done
- **P2** — Domain map border `rgba(255,255,255,0.08)`, `border-radius: var(--radius)` — done
- **P3** — Case study standard already using `.eyebrow` — already done
- **G1** — Gradient dividers: project-section-divider, reference-archive-heading, highlight-section-divider — done
- **premium-divider-label** — new CSS class added, green small-caps — done
- **J1** — Technology Manager card visually dominant — done

### ✅ Completed Session 3

| # | Item | Notes |
|---|---|---|
| ✅ | **E3** — Exec break statement between Framework + Final CTA | Italic serif quote, subtle border rules |
| ✅ | **E5** — Section accent bar suppressed on `chapter-band--quiet` sections | Removes repetition from Leadership OS, Operating Style, Framework |
| ✅ | **E6** — Content tag pills → 4px: career-case systems, professional-case-hero panels, conference-feature signals | Functional UI (search, nav, current-badge) kept as pills |
| ✅ | **A3** — Award photo hover: scale + contrast + bottom gradient vignette | Editorial frame on hover |
| ✅ | **A4** — Award archive table: left border accent on hover, dark border-bottom | Matches reference archive pattern |
| ✅ | **G3** — Nav active animation verified | Green filled pill active state working correctly |
| ✅ | **P1** — Data Refinery + BIM bullets trimmed to 2 punchy impact-led lines | |
| ✅ | **P2** — Domain map border normalised + border-radius → var(--radius) | |
| ✅ | **PE3** — AI Impact Summit full-bleed cinematic | Copy overlaid on image via gradient veil |
| ✅ | **PE2** — Awards hero quote → monument scale `clamp(3.6rem,7vw,8rem)` | Dominates viewport before award grid |
| ✅ | **PE5** — "8yr 10mo" → `clamp(4rem,8vw,9rem)` monument | Visual anchor for Successive Digital section |

### ✅ Completed Session 4

| # | Item | Notes |
|---|---|---|
| ✅ | **J4** — Timeline gradient rail (green→muted) + year labels beside markers | "2024" in green-text, older years in ink-muted |
| ✅ | **J5** — Reflection block: `1.3rem` body, more padding, `font-weight: 500` | Closes page with authority |
| ✅ | **G4** — Footer thesis: `0.9rem` italic, `ink-soft` — brand statement now reads | |
| ✅ | **PE1** — Portrait annotation: "9+ YRS / Successive Digital" gold label + cream serif overlaid at bottom-left | |
| ✅ | **PE4** — Supporting pull quotes: `clamp(1.5rem, 2.2vw, 2.2rem)` display type | Cards now read as typographic anchors |
| ✅ | **PE6** — Chapter numbers: `clamp(4.2rem, 7vw, 7.2rem)` gold, `opacity: 0.7` | Monument scale between sections |
| ✅ | **PE7** — Page transitions: 180ms fade+8px y-offset (down from 520ms slide) | Snappier, less theatrical |

### Intentionally Skipped
| ID | Reason |
|---|---|
| C3 | Cert thumbnails low-res — images are fixed assets, no CSS fix available |
| H4 | Proof tiles grid — low-priority, current state acceptable |

---

## SESSION 5 — Fresh Audit (2026-06-05)

| ID | Priority | Issue | Page | Fix Required |
|---|---|---|---|---|
| S5-C1 | 🟡 | **Cert dossier ledger stats undersized** — `clamp(1.85rem, 3vw, 3.1rem)` is noticeably smaller than every other stat block (journey: 4.2rem, boardroom: 9rem). Values "4", "AWS/Azure/GCP", "AI+Cloud" lose visual punch. | Credentials | Raise to `clamp(2.2rem, 3.4vw, 3.6rem)` in `.credential-dossier-ledger__item strong` |
| S5-J1 | 🟡 | **Journey "Three chapters" card h3 too small** — at `1.24rem` body font, the chapter titles have no display weight. Cards rely entirely on label + description text at reading size. | Journey | Add `font-family: var(--font-display)` + raise to `clamp(1.3rem, 2vw, 1.6rem)` |
| S5-P1 | 🟡 | **Case study model `border-radius: 14px`** — the closing "Every project should answer…" container still uses 14px radius, inconsistent with the `var(--radius)` editorial standard used everywhere else. | Projects | Change to `border-radius: var(--radius)` |
| S5-CF1 | ✅ | **Conference archive card cover images** — AWS Symposium first image is a casual group selfie. The `images[]` array order determines which photo appears as the card cover. | Conferences | Investigate actual image files and reorder `images[]` in `mediaAssets.js` so most professional image is first |

### ✅ Completed Session 5

| # | Item | Notes |
|---|---|---|
| ✅ | **S5-C1** — Cert dossier ledger stats raised to `clamp(2.2rem, 3.4vw, 3.6rem)` | "10" and text values now have visual weight consistent with other stat blocks |
| ✅ | **S5-J1** — Journey arc card h3: display font + `clamp(1.3rem, 2vw, 1.6rem)` + weight 500 | Chapter titles now read as editorial anchors, not body copy |
| ✅ | **S5-P1** — Case study model `border-radius: 14px` → `var(--radius)` | Container now matches the 8px editorial standard |
| ✅ | **S5-CF1** — AWS Symposium cover image | Reordered images array in `mediaAssets.js` to put professional sponsor-board portrait first |

---

## SESSION 6 — Projects Fresh Audit (2026-06-10)

| ID | Priority | Issue | Page | Fix Required |
|---|---|---|---|---|
| S6-P1 | 🔴 | **Gold bullets leak** — career case card lists show gold bullets under projects theme | Projects | Replace `background: var(--gold)` with blue/slate overrides on list items |
| S6-P2 | 🔴 | **Emerald background glows** — `.professional-project-dossier` and `.case-study-model` leak green lighting under projects theme | Projects | Override radial gradients to use blue tint |
| S6-P3 | 🟡 | **Inconsistent border radii** — `.project-portfolio-thesis` and `.project-featured-build` use 14px instead of 8px | Projects | Set to `var(--radius)` (8px) |
| S6-P4 | 🟡 | **Stats hierarchy** — overall portfolio stats are too small/underweighted | Projects | Increase strong text font-size to responsive clamp |
| S6-P5 | 💡 | **Featured dossier button interaction** — featured project dossier buttons need premium hover feedback | Projects | Add blue hover background and border glow |
| S6-P6 | 🔴 | **Confidential panel glow leak** — `.professional-case-hero__panel` background leaks green/gold glows | Case Studies | Override with blue/navy radial and linear gradients |
| S6-P7 | 🔴 | **Confidential panel chip borders** — tag borders leak green in confidential panel | Case Studies | Set to clean blue `rgba(45, 95, 145, 0.28)` |
| S6-P8 | 🔴 | **Case visual inner background leak** — `.project-case-visual-inner` uses green glow/background | Case Studies | Override with dark navy base and blue glow |
| S6-P9 | 🔴 | **Mini-case leak** — `.mini-case` borders, background, labels, and accent indicators leak green/gold | Case Studies | Override with cohesive blue styles |
| S6-P10 | 🟡 | **Pagination hover leak** — `.case-study-nav a:hover` leaks green border | Case Studies | Override to blue border on hover |
| S6-P11 | 🟡 | **Meta block corner radius** — `.professional-case-meta` uses 10px instead of 8px | Case Studies | Set to `var(--radius)` |

### ✅ Completed Session 6

| # | Item | Notes |
|---|---|---|
| ✅ | **S6-P1** — Bullet colors corrected to light/slate blue | Overrode background of list item marker element |
| ✅ | **S6-P2** — Emerald glow backgrounds overridden with blue | Replaced with `rgba(45, 95, 145, 0.12/0.14)` |
| ✅ | **S6-P3** — Border radii normalized to `var(--radius)` | Card corners match the 8px editorial standard |
| ✅ | **S6-P4** — Stat text size raised to clamp values | Main stats now have dominant weight |
| ✅ | **S6-P5** — Dossier button hover microinteraction added | Smooth hover transition with blue background |
| ✅ | **S6-P6** — Dossier panel background glow overridden with blue/navy | Styled with `radial-gradient(circle..., rgba(110, 160, 210, 0.12))` |
| ✅ | **S6-P7** — Dossier panel chips border color overridden with blue | Replaced with `rgba(45, 95, 145, 0.28)` |
| ✅ | **S6-P8** — Case visual inner background overridden with dark navy/blue | Replaced green elements with blue-navy styling |
| ✅ | **S6-P9** — Mini-case border, background, accent lines, labels set to blue | Overrode borders, background, ::before gradient, and strong header colors |
| ✅ | **S6-P10** — Pagination hover border overridden with blue | Replaced with `rgba(45, 95, 145, 0.35)` |
| ✅ | **S6-P11** — Meta block corner radius normalized | Updated `.professional-case-meta` to `var(--radius)` |

## SESSION 7 — Awards Fresh Audit (2026-06-10)

| ID | Priority | Issue | Page | Fix Required |
|---|---|---|---|---|
| S7-A1 | 🔴 | **Portal modal theme leak** — proof inspect modal uses default theme, leaking green borders, backgrounds, and chips | Awards | Pass `data-theme="awards"` to the React Portal modal overlay container |
| S7-A2 | 🔴 | **Modal signal title leak** — signal title (`.award-modal__signal strong`) is green (`var(--green-text)`) | Awards | Add theme override to set color to gold |
| S7-A3 | 🔴 | **Modal thumbnail border leak** — active/hover thumbnail buttons display green borders | Awards | Add theme override to set border-color to gold |
| S7-A4 | 🔴 | **Signature card signal tag leak** — signature card signal tags (`.signature-award-card__signal`) display green text | Awards | Add theme override to set color to gold |
| S7-A5 | 🔴 | **Archive table signal leak** — archive row signal column (`.awards-archive-row__signal`) displays green text | Awards | Add theme override to set color to gold |
| S7-A6 | 🔴 | **Archive row hover leak** — row hover displays green text, borders, and background | Awards | Add theme override to use gold text, borders, and warm-neutral background |
| S7-A7 | 🟡 | **Archive row date color mismatch** — dates (`.awards-archive-row__date`) display in wine-red | Awards | Add theme override to use warm gold |
| S7-A8 | 🟡 | **Reflection block gradient leak** — reflection block background gradient fades to green (`#0a4d41`) | Awards | Add theme override to fade to warm bronze |

### ✅ Completed Session 7

| # | Item | Notes |
|---|---|---|
| ✅ | **S7-A1** — Portal modal themed | Appended `data-theme="awards"` to overlay so it inherits the awards stylesheet rules |
| ✅ | **S7-A2** — Modal signal title overridden to gold | Set `.award-modal__signal strong` to gold |
| ✅ | **S7-A3** — Modal thumbnail active borders overridden to gold | Set active/hover thumbnails border to `rgba(209, 176, 106, 0.88)` |
| ✅ | **S7-A4** — Signature card signal tags overridden to gold | Set `.signature-award-card__signal` to gold |
| ✅ | **S7-A5** — Archive table signal tags overridden to gold | Set `.awards-archive-row__signal` to gold |
| ✅ | **S7-A6** — Archive row hover states overridden to gold | Set hover colors to warm gold text and borders with a transparent gold tint background |
| ✅ | **S7-A7** — Archive row dates overridden to warm gold | Replaced wine-red color with warm gold (`rgba(209, 176, 106, 0.88)`) |
| ✅ | **S7-A8** — Reflection block background overridden to bronze | Replaced green gradient with `linear-gradient(135deg, #11100e, #2d2312)` |

---

## SESSION 8 — Conferences Visual Audit (2026-06-10)

| ID | Priority | Issue | Page | Fix Required |
|---|---|---|---|---|
| S8-CF1 | 🔴 | **Theme background conflict** — duplicate `[data-theme="conferences"]` block at bottom overrides electric indigo to gold | Conferences | Remove overriding gold background block, restoring intended electric indigo environment |
| S8-CF2 | 🔴 | **Featured event signals green leak** — `.conference-feature__signals span` displays green borders and backgrounds | Conferences | Override borders to blue-indigo and background to transparent blue |
| S8-CF3 | 🔴 | **Judgment block gradient green leak** — `.conference-judgment-block` fades to emerald green | Conferences | Override background gradient to fade to navy/indigo |
| S8-CF4 | 🔴 | **Location tag green leak** — `.conference-location-tag` displays green text | Conferences | Override to lavender/ice blue |
| S8-CF5 | 🟠 | **Mobile featured event text clipping** — copy is absolutely positioned, overflowing/clipping on narrow mobile viewports | Conferences | Set copy block to relative layout and stack below the carousel on mobile |
| S8-CF6 | 🟡 | **Category pill wine-red color mismatch** — `.conference-type-pill--featured` displays wine-red text | Conferences | Override text color to lavender/ice blue |

### ✅ Completed Session 8

| # | Item | Notes |
|---|---|---|
| ✅ | **S8-CF1** — Theme background restored to indigo | Restored `#05060f` base background with electric indigo atmospheric gradients |
| ✅ | **S8-CF2** — Featured signals green leak fixed | Overrode borders to `rgba(90, 110, 210, 0.28)` and background to `rgba(72, 88, 178, 0.12)` |
| ✅ | **S8-CF3** — Judgment block green leak fixed | Overrode background gradient to fade to deep navy-indigo (`rgba(22, 28, 80, 0.92)`) |
| ✅ | **S8-CF4** — Card location green leak fixed | Overrode `.conference-location-tag` to lavender/ice blue (`rgba(164, 180, 240, 0.88)`) |
| ✅ | **S8-CF5** — Mobile copy clipping fixed | Set `.conference-feature` to stack vertically on mobile with relative overlay layout |
| ✅ | **S8-CF6** — Featured pill text color corrected | Overrode `.conference-type-pill--featured` to use lavender/ice blue text |

---

## SESSION 9 — Highlights Visual Audit (2026-06-10)

| ID | Priority | Issue | Page | Fix Required |
|---|---|---|---|---|
| S9-H1 | 🔴 | **Takeaway panel wine-red color leak** — `.highlight-takeaway-panel` displays wine-red border and title | Highlights | Override border-left and strong header color to matching emerald green |
| S9-H2 | 🔴 | **Featured highlight label wine-red color leak** — `.featured-highlight__why span` displays wine-red text | Highlights | Override text color to matching gold/bronze |
| S9-H3 | 🟠 | **Book Contributor unstyled action links** — Buy links lack CTA button styling (no border, background, or hover transitions) | Highlights | Wrap action links using secondary Button component |
| S9-H4 | 🟠 | **Mobile stats ledger horizontal cramping** — `.highlights-hero-ledger` keeps a 3-column layout on narrow mobile screens | Highlights | Stack ledger items vertically on viewports below 520px |
| S9-H5 | 🟡 | **Global signal ledger border radius mismatch** — `.global-signal-ledger` uses 10px instead of 8px standard | Highlights | Set container border-radius to `var(--radius)` |

### ✅ Completed Session 9

| # | Item | Notes |
|---|---|---|
| ✅ | **S9-H1** — Takeaway panel green overrides applied | Set left border and strong text colors to theme-scopped emerald green |
| ✅ | **S9-H2** — Featured quote label wine-red leak fixed | Set `.featured-highlight__why span` color to gold/bronze (`rgba(148, 112, 24, 0.88)`) |
| ✅ | **S9-H3** — Action links styled as Button | Wrapped links inside `Button asChild variant="secondary" size="compact"` |
| ✅ | **S9-H4** — Mobile ledger stats stacked | Set `.highlights-hero-ledger` to 1 column on screens below 520px |
| ✅ | **S9-H5** — Signal ledger radius normalized | Updated `.global-signal-ledger` to use standard `var(--radius)` (8px) |

---

## SESSION 10 — Credentials Visual Audit (2026-06-10)

| ID | Priority | Issue | Page | Fix Required |
|---|---|---|---|---|
| S10-C1 | 🔴 | **Provider tags leak green** — `.credential-meta-row > span` shows green border and background | Credentials | Override border and background to matching slate-blue |
| S10-C2 | 🔴 | **Accordion toggles leak green** — `.provider-toggle` and `.archive-toggle` use green borders/icons, and green backgrounds when expanded | Credentials | Override toggle colors and active backgrounds to slate-blue |
| S10-C3 | 🔴 | **Filter buttons leak green** — `.filter-bar button.active` and hovered state use green backgrounds/borders | Credentials | Override active/hover background, border, and shadow to slate-blue |
| S10-C4 | 🔴 | **Proof state badges leak green** — `.proof-state` and its dot indicator use green text, border, background, and dot glow | Credentials | Override badge text, border, background, dot, and glow to slate-blue |
| S10-C5 | 🟠 | **Reveal button hover leaks green** — `.proof-reveal-actions button:hover` uses green background/shadow | Credentials | Override hover state background and shadow to slate-blue |
| S10-C6 | 🟠 | **Pagination warning leaks green** — `.certification-provider-more` uses green border and background | Credentials | Override border and background to matching slate-blue |
| S10-C7 | 🟡 | **Supporting card hover leaks green** — `.official-credential-card:hover` highlights border in green | Credentials | Override hover border to slate-blue |
| S10-C8 | 🟡 | **Section headings leak wine-red** — `.credential-section-heading > small` and `.official-credential-ledger__header > span` use wine-red text | Credentials | Override text color to steel-gray / ice-blue |
| S10-C9 | 🟡 | **Empty state label leaks wine-red** — `.proof-empty-state span` uses wine-red text | Credentials | Override text color to steel-gray / ice-blue |

### ✅ Completed Session 10

| # | Item | Notes |
|---|---|---|
| ✅ | **S10-C1** — Provider tags slate-blue overrides applied | Scoped `.credential-meta-row > span` to use theme slate-blue border/background |
| ✅ | **S10-C2** — Accordion toggles green leak fixed | Overrode `.provider-toggle` and `.archive-toggle` to slate-blue for default/expanded states |
| ✅ | **S10-C3** — Filter buttons styled slate-blue | Set active/hover states to slate-blue background, border, and shadow |
| ✅ | **S10-C4** — Proof badges slate-blue overrides applied | Set `.proof-state` and dot indicators to slate-blue theme colors |
| ✅ | **S10-C5** — Reveal button hover styled slate-blue | Set `.proof-reveal-actions button:hover` background to slate-blue |
| ✅ | **S10-C6** — Pagination warning box overrides applied | Set `.certification-provider-more` to slate-blue border/background |
| ✅ | **S10-C7** — Supporting card hover border overridden | Set `.official-credential-card:hover` border to slate-blue |
| ✅ | **S10-C8** — Section headings wine-red leaks resolved | Set labels to steel-gray / ice-blue (`rgba(145, 168, 195, 0.88)`) |
| ✅ | **S10-C9** — Empty state text wine-red leak resolved | Set `.proof-empty-state span` color to steel-gray / ice-blue |

---

## SESSION 11 — Recommendations Visual Audit (2026-06-10)

| ID | Priority | Issue | Page | Fix Required |
|---|---|---|---|---|
| S11-R1 | 🔴 | **Lead card background green leak** — `.reference-lead-quote` fades to green (`rgba(8, 61, 53, 0.9)`) | Recommendations | Override to fade to warm bronze/brown |
| S11-R2 | 🔴 | **Curated voice card border accent leak** — `.reference-voice-item` borders use green and blue-indigo gradients | Recommendations | Override to use gold/bronze gradients |
| S11-R3 | 🔴 | **Supporting quote cards wine-red leak** — `.reference-supporting-quote` left border and icon use wine-red | Recommendations | Override left border and quote icon to warm gold/bronze |
| S11-R4 | 🔴 | **Signal map green/wine-red leaks** — map container glows green, first-child is green, labels are wine-red | Recommendations | Override container background, first-child background, and labels (`span`) to warm gold/bronze |
| S11-R5 | 🔴 | **Archive divider line green leak** — line gradient uses green | Recommendations | Override line gradient to warm gold/bronze |
| S11-R6 | 🔴 | **Archive divider label green leak** — heading label defaults to green text | Recommendations | Override `.premium-divider-label` to warm gold |
| S11-R7 | 🟠 | **Unstyled count pill** — `.premium-divider-count-pill` lacks container padding, background, or borders | Recommendations | Style pill with warm gold background, border, padding, and text styling |
| S11-R8 | 🔴 | **Archive row hover/highlight green leaks** — row hover and highlighted borders default to green | Recommendations | Override hover/highlight borders to warm gold/bronze |
| S11-R9 | 🔴 | **Source verification note leaks** — shield icon is green and link text is wine-red | Recommendations | Override icon and verify link text to warm gold |

### ✅ Completed Session 11

| # | Item | Notes |
|---|---|---|
| ✅ | **S11-R1** — Lead card background green leak resolved | Overrode `.reference-lead-quote` background to fade to warm bronze (`rgba(32, 28, 22, 0.9)`) |
| ✅ | **S11-R2** — Curated voice card borders overridden with gold/bronze | Overrode `::before` borders on voice items to use warm gold/bronze gradients |
| ✅ | **S11-R3** — Supporting quote card left borders and icons overridden with gold | Set left border to `rgba(209, 176, 106, 0.6)` and quote icon to `rgba(209, 176, 106, 0.35)` |
| ✅ | **S11-R4** — Reference signal map green/wine-red leaks fixed | Styled container, highlight card, and labels with warm gold/bronze values |
| ✅ | **S11-R5** — Archive divider line green leak fixed | Overrode `.reference-archive-heading hr` to transition through gold/bronze |
| ✅ | **S11-R6** — Archive divider label overridden to warm gold | Set references `.premium-divider-label` to `#d1b06a` |
| ✅ | **S11-R7** — Count pill styled as premium warm gold container | Added base `.premium-divider-count-pill` styles and theme-scoped overrides |
| ✅ | **S11-R8** — Archive row hover/highlight green leaks resolved | Overrode row hovers and highlights to use warm gold/bronze |
| ✅ | **S11-R9** — Source verification note icon and link overridden to gold | Set shield icon and verify source link to warm gold |

---

*This file is the single source of truth for all visual work. Update status inline as items are completed.*

