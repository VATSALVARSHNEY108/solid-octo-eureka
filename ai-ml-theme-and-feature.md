# CODING PROMPT — AI/ML Interactive Explainer Topic Page
# One prompt per topic. Produces all component files with real, working code.

---

## HOW TO USE

1. Fill every `{{PLACEHOLDER}}` below with your topic's values
2. Paste the entire prompt into Claude / Cursor / GPT-4
3. It will output every file listed in the FILE STRUCTURE section
4. Each file is complete, real, working TSX — no placeholders in output

---

## TOPIC INPUT

```
TOPIC_NAME        = {{TOPIC_NAME}}
TOPIC_SLUG        = {{TOPIC_SLUG}}
CATEGORY          = {{CATEGORY}}
DIFFICULTY        = {{DIFFICULTY}}
HOOK              = {{HOOK}}
CORE_CONCEPT      = {{CORE_CONCEPT}}
KEY_FORMULA       = {{KEY_FORMULA}}
REAL_WORLD_EXAMPLE= {{REAL_WORLD_EXAMPLE}}
MISCONCEPTION     = {{MISCONCEPTION}}
VISUAL_METAPHOR   = {{VISUAL_METAPHOR}}
ESTIMATED_MINUTES = {{ESTIMATED_MINUTES}}

PARAM_1 = { name: "{{P1_NAME}}", min: {{P1_MIN}}, max: {{P1_MAX}}, default: {{P1_DEFAULT}}, unit: "{{P1_UNIT}}" }
PARAM_2 = { name: "{{P2_NAME}}", min: {{P2_MIN}}, max: {{P2_MAX}}, default: {{P2_DEFAULT}}, unit: "{{P2_UNIT}}" }
PARAM_3 = { name: "{{P3_NAME}}", min: {{P3_MIN}}, max: {{P3_MAX}}, default: {{P3_DEFAULT}}, unit: "{{P3_UNIT}}" }

PRESET_1 = { label: "{{PRESET_1_LABEL}}", params: { p1: {{V}}, p2: {{V}}, p3: {{V}} }, description: "{{PRESET_1_DESC}}" }
PRESET_2 = { label: "{{PRESET_2_LABEL}}", params: { p1: {{V}}, p2: {{V}}, p3: {{V}} }, description: "{{PRESET_2_DESC}}" }
PRESET_3 = { label: "{{PRESET_3_LABEL}}", params: { p1: {{V}}, p2: {{V}}, p3: {{V}} }, description: "{{PRESET_3_DESC}}" }

ADVANCED_PARAM_1  = "{{ADV_P1}}"
ADVANCED_PARAM_2  = "{{ADV_P2}}"

METRIC_1 = "{{METRIC_1}}"
METRIC_2 = "{{METRIC_2}}"
METRIC_3 = "{{METRIC_3}}"

ALGORITHM_STEPS = [
  "{{STEP_1}}",
  "{{STEP_2}}",
  "{{STEP_3}}",
  "{{STEP_4}}",
  "{{STEP_5}}",
  "{{STEP_6}}",
  "{{STEP_7}}"
]

PYTHON_CODE = """
{{PASTE_ACTUAL_MINIMAL_PYTHON_IMPLEMENTATION_HERE}}
"""

ADVANTAGES = ["{{ADV_1}}", "{{ADV_2}}", "{{ADV_3}}", "{{ADV_4}}"]
LIMITATIONS = ["{{LIM_1}}", "{{LIM_2}}", "{{LIM_3}}", "{{LIM_4}}"]

APPLICATIONS = [
  { industry: "{{IND_1}}", app: "{{APP_1}}", company: "{{CO_1}}" },
  { industry: "{{IND_2}}", app: "{{APP_2}}", company: "{{CO_2}}" },
  { industry: "{{IND_3}}", app: "{{APP_3}}", company: "{{CO_3}}" },
  { industry: "{{IND_4}}", app: "{{APP_4}}", company: "{{CO_4}}" },
  { industry: "{{IND_5}}", app: "{{APP_5}}", company: "{{CO_5}}" },
  { industry: "{{IND_6}}", app: "{{APP_6}}", company: "{{CO_6}}" },
]

CHALLENGE_1 = { prompt: "{{C1_PROMPT}}", answer: "{{C1_ANSWER}}", hint: "{{C1_HINT}}" }
CHALLENGE_2 = { prompt: "{{C2_PROMPT}}", broken_param: "{{C2_BROKEN}}", fix: "{{C2_FIX}}" }
CHALLENGE_3 = { goal: "{{C3_GOAL}}", success_condition: "{{C3_SUCCESS}}" }
```

---

## FILE STRUCTURE TO GENERATE

Generate every file below. Each file is a self-contained TSX component.
Do not skip any file. Do not write placeholder content inside any file.

```
/components/topics/{{TOPIC_SLUG}}/
  ├── index.tsx                        ← Page root: imports + arranges all sections
  ├── HeroSection.tsx
  ├── WhyShouldICare.tsx
  ├── ProblemStatement.tsx
  ├── RealWorldExample.tsx
  ├── IntuitionSection.tsx
  ├── InteractiveVisualization.tsx     ← Main simulation canvas
  ├── StepByStepWorking.tsx
  ├── MathExplanation.tsx
  ├── AnimatedFormulaBreakdown.tsx
  ├── AlgorithmFlowAnimation.tsx
  ├── CodeWalkthrough.tsx
  ├── LineByLineCodeViz.tsx
  ├── InteractivePlayground.tsx
  ├── ParameterControlsDeepDive.tsx
  ├── ObserveChangesLive.tsx
  ├── TrainingProcessViz.tsx
  ├── ResultsVisualization.tsx
  ├── AdvantagesLimitations.tsx
  ├── RealWorldApplications.tsx
  ├── MiniChallenge.tsx
  ├── SummaryCheatSheet.tsx
  ├── StepNavigationBar.tsx
  └── types.ts                         ← Shared types for this topic
```

---

## SHARED DESIGN SYSTEM

All components must use these exact values. Do not invent new colors or fonts.

### CSS Variables (applied at root in index.tsx)
```css
--bg-primary: #FAFAF8;
--bg-secondary: #F3F3EF;
--accent: #1A1A2E;
--highlight: #FFF991;
--interactive: #4F46E5;
--success: #10B981;
--danger: #EF4444;
--border: rgba(0,0,0,0.08);
--glass: rgba(255,255,255,0.7);
```

### Fonts (import in index.tsx via next/font or @import)
- Display titles: `Playfair Display` (Google Fonts)
- Body text: `DM Sans` (Google Fonts)
- Code / formulas: `JetBrains Mono` (Google Fonts)

### Tailwind Patterns (use these classes consistently)
- Glass card:        `backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06)]`
- Section wrapper:   `min-h-screen w-full px-6 md:px-16 py-24 relative`
- Left+Right layout: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-start`
- Accent button:     `bg-[var(--interactive)] text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all`
- Highlight box:     `bg-[var(--highlight)] text-[var(--accent)] px-4 py-3 rounded-xl font-medium`
- Slider:            `w-full accent-[var(--interactive)] h-2 rounded-full cursor-pointer`

### Background Components (import from @/components/ui/)

**YellowGlowBackground** — use in: HeroSection, MathExplanation, SummaryCheatSheet
```tsx
// @/components/ui/background-components.tsx
export const YellowGlowBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle at center, #FFF991 0%, transparent 70%)`,
      opacity: 0.6,
      mixBlendMode: "multiply",
    }}
  />
);
```

**NoiseTextureBackground** — use in: all simulation canvas panels
```tsx
// @/components/ui/demo.tsx
export const NoiseTextureBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none"
    style={{
      background: "#ffffff",
      backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.35) 1px, transparent 0)",
      backgroundSize: "20px 20px",
    }}
  />
);
```

---

## SHARED TYPES FILE

### `types.ts`
```tsx
export interface TopicConfig {
  name: string;
  slug: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  hook: string;
  coreConceptHtml: string;
  keyFormula: string;
  estimatedMinutes: number;
}

export interface SimulationParam {
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
  description: string;
}

export interface SimulationState {
  params: Record<string, number>;
  isPlaying: boolean;
  speed: number;
  frame: number;
  metrics: Record<string, number>;
}

export interface StepState {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  condition: string;
  unlocked: boolean;
}

export interface Preset {
  label: string;
  params: Record<string, number>;
  description: string;
}

export interface AlgorithmStep {
  id: number;
  title: string;
  description: string;
  whyItMatters: string;
}

export interface CodeLine {
  lineNumber: number;
  code: string;
  explanation: string;
  visualDescription: string;
}

export interface Application {
  industry: string;
  appName: string;
  howUsed: string;
  company: string;
  icon: string;
}

export interface Challenge {
  id: number;
  type: "predict" | "fix" | "design";
  prompt: string;
  hint: string;
  successCondition: string;
}
```

---

## COMPONENT SPECIFICATIONS

Write each file exactly as described. Every component receives typed props. Every simulation is mathematically correct for `{{TOPIC_NAME}}`.

---

### `index.tsx` — Page Root

```
- "use client" directive
- Import all 22 section components
- Import StepNavigationBar
- Set CSS variables on root div
- Load Google Fonts
- Initialize Zustand store with topic config
- Render sections in order (Hero → Summary)
- StepNavigationBar is sticky (fixed top-0 z-50), rendered outside section flow
- On mount: check localStorage for saved step → show "Resume?" toast if found
- Scroll listener: track which section is in viewport → update currentStep in store
- Keyboard listener: ← → Space R Escape
- Section order:
  1. HeroSection
  2. WhyShouldICare
  3. ProblemStatement
  4. RealWorldExample
  5. IntuitionSection
  6. InteractiveVisualization
  7. StepByStepWorking
  8. MathExplanation
  9. AnimatedFormulaBreakdown
  10. AlgorithmFlowAnimation
  11. CodeWalkthrough
  12. LineByLineCodeViz
  13. InteractivePlayground
  14. ParameterControlsDeepDive
  15. ObserveChangesLive
  16. TrainingProcessViz
  17. ResultsVisualization
  18. AdvantagesLimitations
  19. RealWorldApplications
  20. MiniChallenge
  21. SummaryCheatSheet
```

---

### `StepNavigationBar.tsx`

```
Props: none (reads from Zustand store)

Render:
  [← Prev]  [Step {n} of 21: {sectionTitle}]  [progress bar]  [{n}/21]  [Next →]

- Fixed top-0, full width, z-50
- Background: backdrop-blur-md bg-white/80 border-b border-[var(--border)]
- Progress bar: Framer Motion layoutId animated fill
- Clicking step label → opens SectionMapModal (full list of 21 sections, click to jump)
- Prev button: disabled + opacity-40 on step 1
- Next button: disabled + opacity-40 on step 21
- Badge strip: show unlocked badge emojis right side
- Height: 56px
- Mobile: collapse to icon-only on <640px
```

---

### `HeroSection.tsx`

```
Props: none

Layout: full viewport height (100vh), centered content

Background layers (z order bottom→top):
  1. YellowGlowBackground
  2. Canvas particle system (useEffect, requestAnimationFrame)
     - 80 particles representing {{VISUAL_METAPHOR}}
     - Each particle: x, y, vx, vy, radius, opacity
     - Mouse moves: particles gently repel from cursor (inverse square law)
     - Particles connect with lines if distance < 120px (opacity proportional to distance)
     - Color: var(--interactive) at 60% opacity
  3. Content (z-10)

Content (centered, Framer Motion staggerChildren):
  - Category badge: pill shape, border, category text — animate: fade+slideUp delay 0
  - Main title: {{TOPIC_NAME}} — font: Playfair Display 72px — animate: fade+slideUp delay 0.1
  - Hook: {{HOOK}} — font: DM Sans 24px muted — animate: fade+slideUp delay 0.2
  - Difficulty pill + estimated time — animate: fade+slideUp delay 0.3
  - CTA button "Start Exploring →" — animate: fade+slideUp delay 0.4
    onClick: smooth scroll to section 2 (WhyShouldICare)

Particle canvas: position absolute, inset-0, pointer-events-none
Cleanup: cancelAnimationFrame on unmount
```

---

### `WhyShouldICare.tsx`

```
Props: none

Layout: section wrapper, two-column (text left, animated illustration right)

Left:
  - Section number "02"
  - Title "Why Should I Care?"
  - 3 impact cards, each with:
    - Lucide icon
    - Bold title
    - 1-2 sentence explanation
    - Specific to {{TOPIC_NAME}} — not generic
  - Animated stat: large number counter (useEffect counting up on mount)
    Example for {{TOPIC_NAME}}: pick a real compelling number

Right:
  - Animated SVG illustration specific to {{TOPIC_NAME}}
  - Must animate continuously (CSS keyframes or Framer Motion animate loop)
  - No external images — pure SVG/CSS only

Entrance: Intersection Observer → Framer Motion fadeInUp when section enters viewport
```

---

### `ProblemStatement.tsx`

```
Props: none

Layout: section wrapper, centered

Content:
  - Section number + title "The Problem"
  - Animated toggle: "Without {{TOPIC_NAME}}" ↔ "With {{TOPIC_NAME}}"
  - Two panels side by side:
    Left panel: naive approach visualization (Canvas or SVG, animated, shows failure)
    Right panel: {{TOPIC_NAME}} approach (Canvas or SVG, animated, shows success)
  - Toggle button switches which is highlighted
  - Key insight box (--highlight background):
    "The core problem {{TOPIC_NAME}} solves is: ..."
  - Interactive element: user can click "Try the naive approach" → watches it fail on canvas
  - Transition line at bottom: "So how does {{TOPIC_NAME}} fix this? →"
```

---

### `RealWorldExample.tsx`

```
Props: none

Content:
  - Section number + title "Real World Example"
  - Scenario: {{REAL_WORLD_EXAMPLE}}
  - Animated walkthrough: 5-step auto-playing sequence
    Each step: icon + title + explanation
    Auto-advances every 2.5s
    Manual: prev/next buttons + step dots
    Pause on hover
  - Each step has a small inline animation (CSS, no external lib)
  - Glossary: any technical term in text is underlined
    Hover → tooltip with plain English definition
    Use Framer motion AnimatePresence for tooltip
```

---

### `IntuitionSection.tsx`

```
Props: none

Content:
  - Section number + title "Build the Intuition"
  - Analogy card: plain English analogy for {{TOPIC_NAME}}
    Animated analogy visual (SVG, continuously animated)
  - 3-step intuition builder (accordion, opens one at a time):
    Step 1: Simplest version of {{TOPIC_NAME}}
    Step 2: Add one layer of complexity
    Step 3: Full concept
    Each step: text + small embedded animation
  - Comprehension check at bottom:
    Single question relevant to {{TOPIC_NAME}}
    3 answer options (radio buttons styled as cards)
    On select: immediate feedback (correct ✓ green / wrong ✗ red + explanation)
    Not graded — just for self-check
```

---

### `InteractiveVisualization.tsx`

```
Props: none

Layout: two-column (left explanation panel, right simulation canvas)
This is the most important component. Build it with full mathematical correctness.

LEFT PANEL:
  - Current parameter values displayed live
  - Key formula: {{KEY_FORMULA}} — updates variable highlights based on current params
  - "What to notice" bullets (3 items, topic-specific)
  - Insight callout: updates text based on current simulation state

RIGHT PANEL — Simulation Canvas:
  - <canvas> element, 100% width of panel, fixed height 480px
  - NoiseTextureBackground behind canvas
  - useRef for canvas, useEffect for animation loop
  - requestAnimationFrame loop → draws frame → schedules next
  - Simulation logic: implement actual {{TOPIC_NAME}} math/algorithm
  - Draw: axes, labels, animated data points, curves, arrows — all topic-specific

CONTROLS BAR (below canvas):
  - Play/Pause button (Lucide Play/Pause icon)
  - Step Forward button
  - Reset button
  - Speed slider: 0.25x, 0.5x, 1x, 2x, 4x
  - Zoom buttons: + and −

PARAMETER SLIDERS (below controls):
  For each of the 3 params defined in TOPIC INPUT:
  - Label + current value + unit
  - <input type="range"> styled with Tailwind
  - onChange: update state → simulation reacts immediately (no lag)
  - Tooltip on label hover: explains what this param does

PRESET BUTTONS:
  3 buttons matching PRESET_1/2/3 from TOPIC INPUT
  Click → sets all params to preset values + resets simulation

HOVER TOOLTIP:
  Mouse over canvas → show tooltip with:
  - Coordinates in simulation space
  - Value of nearest data point or curve
  - Relevant metric at cursor position

Cleanup: cancelAnimationFrame on unmount
```

---

### `StepByStepWorking.tsx`

```
Props: none

Layout: vertical timeline

Content:
  - Section number + title "Step-by-Step: How It Works"
  - 7 steps from ALGORITHM_STEPS in TOPIC INPUT
  - Each step:
    - Number circle (styled, accent color when active)
    - Title
    - 2-sentence explanation
    - Small inline animation (CSS keyframes, unique per step)
    - "Why this matters" callout box
  - Steps animate in on scroll (Intersection Observer, staggered)
  - Click any step number → smooth scroll to it + highlight
  - Active step: left border accent, background tint
```

---

### `MathExplanation.tsx`

```
Props: none

Background: YellowGlowBackground

Content:
  - Section number + title "The Math"
  - Formula: {{KEY_FORMULA}}
    Rendered as large styled text (JetBrains Mono, 36px+)
    Each symbol/term is a separate <span> with:
      - Color coding (inputs=blue, params=purple, output=green, operators=gray)
      - Hover → tooltip popup explaining that symbol
      - Framer Motion scale on hover
  - Side-by-side table:
    Left: math notation term | Right: plain English meaning
    Row per symbol
  - Expandable accordion: "Intuition behind each term"
    One accordion item per major term
    Each: 2-3 sentences + small visual example
  - Common misconception: {{MISCONCEPTION}}
    Styled as a warning card
```

---

### `AnimatedFormulaBreakdown.tsx`

```
Props: none

Content:
  - Section number + title "Formula, Piece by Piece"
  - Formula terms array (derived from {{KEY_FORMULA}})
  - Sequence animation:
    Term 1 appears → explanation shown → Term 2 appears → etc.
    Each term: Framer Motion fadeIn from below
    Connecting arrows between terms animate in with each step
  - Controls: "← Previous Term" / "Next Term →" buttons
    Keyboard: ← → also works
  - After all terms revealed:
    "Now plug in numbers" section:
      Input fields for each variable in the formula
      Live computed result shown large
      Full calculation chain shown step by step (each intermediate value)
      Animate number changes with spring interpolation
```

---

### `AlgorithmFlowAnimation.tsx`

```
Props: none

Content:
  - Section number + title "Algorithm Flow"
  - Flowchart using SVG (not React Flow — pure SVG for portability)
  - Nodes: rounded rectangles, each = one algorithm step
  - Edges: animated SVG paths with arrow markers
    Framer Motion pathLength animation for "drawing" effect
  - Node states:
    idle: bg gray, border gray
    active: bg var(--interactive), text white, scale 1.05, glow shadow
    complete: bg var(--success), text white
    error: bg var(--danger), text white
  - Controls:
    "Step Through" button: advances one node at a time
    "Auto Play" toggle: advances automatically (speed from slider)
    Speed slider
    Reset button
  - Hover any node → popup with detailed explanation (Framer AnimatePresence)
  - Layout: vertical flow for mobile, horizontal for desktop (CSS media query)
  - Decision nodes: diamond shape SVG
```

---

### `CodeWalkthrough.tsx`

```
Props: none

Content:
  - Section number + title "The Code"
  - Tab switcher: "Python" | "Pseudocode"
  - Code block:
    - Custom syntax highlighting (regex-based, no external lib)
      Keywords: var(--interactive)
      Strings: var(--success)
      Comments: gray italic
      Numbers: orange
      Functions: purple
    - Line numbers column (sticky left)
    - Active line: highlighted background (--highlight at 40% opacity)
    - Copy button (top right) → copies to clipboard → shows "Copied!" for 2s
  - Annotation panel (right side, scrolls in sync with code):
    Each code section has a title + 1-2 sentence explanation
    Clicking annotation → scrolls code to that section + highlights lines
    Scrolling code → updates active annotation
  - Collapsible: boilerplate sections collapse by default (import statements etc.)
  - "Open in Colab" button (placeholder href="#")
  - Python code: use PYTHON_CODE from TOPIC INPUT — do not invent fake code
```

---

### `LineByLineCodeViz.tsx`

```
Props: none

Layout: two-column (code left, visual right)

Content:
  - Section number + title "Watch the Code Run"
  - Left: same code as CodeWalkthrough, but clickable line by line
  - Right: canvas/SVG visualization panel
    - Shows visual state after executing up to clicked line
    - Unique visualization per line group, topic-specific
  - Below left: "Memory Inspector" panel
    - Shows current variable values as the code executes line by line
    - Each variable: name | type | current value | previous value
    - Changed values flash yellow momentarily
  - Click line → right panel animates to new state (Framer Motion)
  - "Run All" button → auto-steps through all lines with 800ms delay
```

---

### `InteractivePlayground.tsx`

```
Props: none

Content:
  - Section number + title "Playground — Free Explore"
  - Full simulation canvas (same engine as InteractiveVisualization)
  - All 3 base params + ADVANCED_PARAM_1 + ADVANCED_PARAM_2 exposed
  - Live metrics panel (updates every animation frame):
    {{METRIC_1}}: large number, animated counter
    {{METRIC_2}}: gauge dial (SVG)
    {{METRIC_3}}: mini sparkline (Canvas)
  - Export button: canvas.toBlob → download PNG
  - Share button: encode params as URL query string → copy to clipboard
  - "Surprise Me" button:
    Picks a random interesting parameter combination (precomputed list of 5)
    Animates smoothly to new params (interpolated, not instant)
  - "Reset to Default" button
  - Fullscreen toggle (browser fullscreen API)
```

---

### `ParameterControlsDeepDive.tsx`

```
Props: none

Content:
  - Section number + title "What Each Parameter Does"
  - For each of the 3 params + 2 advanced params:
    Card with:
      - Param name + mathematical symbol
      - Too Low warning (what happens, icon ⚠️)
      - Just Right range (what happens, icon ✓)
      - Too High warning (what happens, icon ⚠️)
      - Mini embedded chart: x=param value, y=effect on {{METRIC_1}}
        Canvas-drawn, 200×120px
        Updates as user drags a mini slider on this card
      - Recommended range callout box
      - Common mistake warning (red border card)
```

---

### `ObserveChangesLive.tsx`

```
Props: none

Content:
  - Section number + title "Compare Side by Side"
  - Two simulation panels: A (left) and B (right)
  - Each panel: full independent simulation canvas + param sliders
  - Both run simultaneously (independent animation loops)
  - Delta metrics bar between/below panels:
    "A vs B: {{METRIC_1}} difference: +X%"
    "A vs B: {{METRIC_2}} difference: −Y"
    Color coded: green = A better, red = B better, gray = equal
  - Timeline scrubber: replay last 30 seconds of simulation history
    Both panels scrub in sync
  - Annotation tool:
    Toggle "Draw" mode button
    Mouse drag on either canvas → draws colored line (rgba overlay)
    Clear annotations button
```

---

### `TrainingProcessViz.tsx`

```
Props: none

Content:
  - Section number + title "Watch It Learn"
  - If {{TOPIC_NAME}} is not training-based: adapt to show convergence/fitting/optimization
  - Simulated training loop (runs in browser using topic math)
  - Epoch counter (large, animated)
  - Three live-updating charts side by side:
    1. Loss curve (D3.js or Canvas line chart)
       x: epoch, y: loss value
       Two lines: training (blue) + validation (orange)
    2. Primary metric curve ({{METRIC_1}}) — same format
    3. Weight/parameter evolution heatmap
       Grid of colored cells, color = value magnitude
       Updates per epoch
  - Overfit detector:
    When validation loss > training loss by threshold → red banner "Overfitting detected!"
    Arrow annotation on chart at that epoch
  - Pause at any epoch:
    Click chart at any x point → freeze simulation at that epoch
    Show full model state at that epoch
  - Run comparison:
    "Add Run" button → runs same sim with different params, overlays on charts
    Up to 3 runs, each a different color
    Legend shows param config per run
```

---

### `ResultsVisualization.tsx`

```
Props: none

Content:
  - Section number + title "Results"
  - Before/After comparison:
    Animated flip card or side-by-side toggle
    Before: random/naive state, After: {{TOPIC_NAME}} output
  - Metrics dashboard:
    {{METRIC_1}}: animated gauge (SVG arc)
    {{METRIC_2}}: horizontal bar chart (Canvas)
    {{METRIC_3}}: trend line sparkline
    All values computed from simulation, not hardcoded
  - Edge cases section:
    3 cards showing where {{TOPIC_NAME}} struggles
    Each: scenario description + mini canvas showing the failure
  - Confusion matrix (if classification applicable, else skip and show equivalent)
    SVG grid, color intensity = cell value
    Hover cell → tooltip with count and percentage
```

---

### `AdvantagesLimitations.tsx`

```
Props: none

Content:
  - Section number + title "Pros & Cons"
  - Two columns: Advantages | Limitations
    From ADVANTAGES and LIMITATIONS arrays in TOPIC INPUT
    Each item: Lucide icon + bold title + 1-sentence explanation
    Entrance: staggered Framer Motion fadeInUp
  - "Rate this limitation" section:
    For each limitation: slider "How important for your use case?" 1–5
    Selecting rating updates a summary: "For your use case, the biggest concern is X"
  - Decision table:
    "Use {{TOPIC_NAME}} when..." vs "Don't use when..."
    3 rows each, icon + condition
  - Comparison table vs 3 alternatives:
    Columns: {{TOPIC_NAME}} | Alt1 | Alt2 | Alt3
    Rows: Speed, Accuracy, Interpretability, Data requirements, Complexity
    Cells: colored dot ratings (green/yellow/red)
    Animated entrance per row
```

---

### `RealWorldApplications.tsx`

```
Props: none

Content:
  - Section number + title "In the Real World"
  - Filter tabs: All | Healthcare | Finance | Tech | Science | Other
    Framer Motion layout animation when filtering
  - 6 application cards from APPLICATIONS array in TOPIC INPUT
    Each card:
      - Industry Lucide icon
      - Industry tag
      - Application name (bold)
      - How {{TOPIC_NAME}} is used (2 sentences)
      - Company/product name
    Hover: card expands (Framer Motion height animation) with more detail
    Cards: glass card style
  - Staggered entrance animation
```

---

### `MiniChallenge.tsx`

```
Props: none

State: tracks score (0–3), per-challenge status

Content:
  - Section number + title "Mini Challenge"
  - Score display: "⭐ X / 3"

  CHALLENGE 1 — Predict (from CHALLENGE_1 in TOPIC INPUT):
    - Scenario shown with visualization
    - "What will happen if you change X?" → user drags slider to predict
    - "Reveal Answer" button → shows actual result + explanation
    - Mark correct/incorrect based on proximity to right answer

  CHALLENGE 2 — Fix the Bug (from CHALLENGE_2):
    - Simulation shown running with wrong parameter (CHALLENGE_2.broken_param)
    - "Something is wrong. Find and fix it."
    - User adjusts params
    - Hint button: reveals 3 levels of hint on successive clicks
    - Success: when param within 10% of CHALLENGE_2.fix value
    - Confetti burst on success (CSS confetti, no external lib)

  CHALLENGE 3 — Design (from CHALLENGE_3):
    - Goal shown: CHALLENGE_3.goal
    - Full simulation unlocked
    - Success condition: CHALLENGE_3.success_condition
    - Progress meter showing how close user is to goal
    - Confetti + badge unlock on completion

  Each challenge: "Try Again" resets only that challenge
  Explanation shown after each attempt (correct or not)
```

---

### `SummaryCheatSheet.tsx`

```
Props: none

Background: YellowGlowBackground

Content:
  - Section number + title "Summary Cheat Sheet"
  - Cheat sheet card (print-friendly layout, white bg, clean borders):
    - "Core Idea" — 1 sentence
    - "Key Formula" — {{KEY_FORMULA}} styled
    - "When to Use" — 3 bullet points
    - "When NOT to Use" — 3 bullet points
    - "Key Parameters" — table: name | role | typical range
    - "Common Pitfalls" — 3 items
    - "Go-To Resources" — 3 placeholder links
  - Dark/Light toggle for print optimization
  - "Download as PNG" button:
    html2canvas the cheat sheet card → PNG download
  - Accordion reveal animation on mount (Framer Motion)
  - Completion badge unlock: "🏆 Master" if all 21 sections visited
  - Confetti burst on first completion
```

---

## STATE MANAGEMENT

### Zustand Store (import from @/store/topicStore.ts)

```tsx
// This file already exists in the project — import from it, do not redefine
import { useTopicStore } from "@/store/topicStore";

// Available state:
const {
  currentStep,       // number 1–21
  setCurrentStep,    // (step: number) => void
  completedSteps,    // Set<number>
  markComplete,      // (step: number) => void
  simParams,         // Record<string, number>
  setSimParam,       // (key: string, value: number) => void
  isPlaying,         // boolean
  setIsPlaying,      // (v: boolean) => void
  speed,             // number
  setSpeed,          // (v: number) => void
  badges,            // Badge[]
  unlockBadge,       // (id: string) => void
  score,             // number (mini challenge)
  setScore,          // (n: number) => void
} = useTopicStore();
```

---

## ANIMATION RULES

Apply these rules in every component:

1. **Entrance**: every section uses Intersection Observer + Framer Motion `whileInView`
   ```tsx
   initial={{ opacity: 0, y: 40 }}
   whileInView={{ opacity: 1, y: 0 }}
   transition={{ duration: 0.6, ease: "easeOut" }}
   viewport={{ once: true, margin: "-100px" }}
   ```

2. **Stagger children**: wrap multiple items in `<motion.div>` with `staggerChildren: 0.1`

3. **Canvas loops**: always use `requestAnimationFrame`, always store ref to frame ID, always cancel on unmount

4. **Number counters**: never snap — always interpolate over 600ms using `requestAnimationFrame`

5. **Param changes**: use `useRef` for current value + lerp toward target each frame (lerp factor 0.12)
   ```tsx
   currentValue.current += (targetValue - currentValue.current) * 0.12;
   ```

6. **Hover states**: all interactive elements have `transition-all duration-200` + hover scale or shadow

7. **Page transitions**: wrap entire page in `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}`

---

## GAMIFICATION

Implement in `index.tsx` and trigger from child components via Zustand:

### Badges (unlock conditions):
```
🔍 "First Look"     → currentStep >= 1
🧠 "Got the Idea"   → currentStep >= 5 (IntuitionSection completed)
⚗️ "Experimenter"   → simParams changed 5+ times
📐 "Math Nerd"      → MathExplanation visited + all formula terms hovered
🎮 "Playground"     → InteractivePlayground visited
🏆 "Master"         → all 21 sections visited + mini challenge score = 3
```

### Badge Toast:
When badge unlocked → bottom-right toast:
```
[emoji] Badge Unlocked: [label]
```
Framer Motion slideInFromBottom, auto-dismiss 3s

### Progress Bar:
Top of page, fixed, 4px height, z-50, background var(--interactive)
Width = (completedSteps.size / 21) * 100%
Framer Motion layoutId="progressBar"

---

## RULES FOR CODE GENERATION

1. Every file starts with `"use client"` (this is a Next.js App Router project)
2. All imports use `@/` path aliases
3. No `any` types — use proper TypeScript throughout
4. No hardcoded simulation values — derive from TOPIC INPUT params
5. All simulation math must be correct for `{{TOPIC_NAME}}`
6. No placeholder text in output (`"Lorem ipsum"`, `"TODO"`, `"..."`, `"Coming soon"`)
7. All icons from `lucide-react` only — no other icon libraries
8. No external image URLs — CSS/SVG illustrations only
9. Canvas cleanup: always return `() => cancelAnimationFrame(frameId)` from useEffect
10. Mobile responsive: every layout works at 320px width minimum
11. Dark mode: all components respect `prefers-color-scheme` via CSS variables
12. Accessibility: all interactive elements have `aria-label`, sliders have `aria-valuetext`
13. Do not use `React.FC` — use plain function declarations with typed props
14. Export each component as named export (not default) — except `index.tsx` which uses default export

---

## OUTPUT FORMAT

For each file, output:

```
=== /components/topics/{{TOPIC_SLUG}}/FileName.tsx ===
[complete file contents]
```

Output all 23 files in order:
types.ts → index.tsx → StepNavigationBar.tsx → HeroSection.tsx → ... → SummaryCheatSheet.tsx

Do not add commentary between files. Output pure code only.

---

*AI/ML Interactive Explainer Platform — 211 Topics*
