# Design System

**Aesthetic**: Editorial Hacker  
**Version**: 1.0  

---

## Philosophy

High-end publication meets command line. Sophisticated typography with terminal undertones. Clean, intentional, no fluff.

---

## Colors

### Base Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--black` | `#050505` | Primary background |
| `--black-light` | `#0a0a0a` | Card backgrounds |
| `--black-lighter` | `#141414` | Elevated surfaces |
| `--black-border` | `#1f1f1f` | Borders, dividers |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `--white` | `#f0f0f0` | Primary text |
| `--white-dim` | `#a0a0a0` | Secondary text, descriptions |
| `--white-dimmer` | `#606060` | Tertiary text, metadata |

### Accent

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#00ff41` | Primary accent (electric green) |
| `--accent-dim` | `rgba(0, 255, 65, 0.15)` | Subtle backgrounds |
| `--accent-glow` | `rgba(0, 255, 65, 0.4)` | Glow effects |

### Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| Active | `#00ff41` | Live, maintained projects |
| WIP | `#ffb800` | Work in progress |
| Archived | `#606060` | Deprecated, unmaintained |

---

## Typography

### Font Stack

```css
--font-editorial: 'Instrument Serif', Georgia, serif;
--font-body: 'Söhne', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
```

### Hierarchy

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Hero Title | Editorial | `clamp(3rem, 10vw, 7rem)` | 400 | Italic for emphasis |
| Card Title | Editorial | `1.5rem` | 400 | — |
| Body | Body | `0.9375rem` | 400 | Line-height 1.6 |
| Mono/Meta | Mono | `0.75rem` | 400 | Uppercase, letter-spacing 0.1em |
| Tags | Mono | `0.6875rem` | 400 | — |

### Text Treatments

- **Headlines**: Serif, large, can use italics for accent words
- **Descriptions**: System sans, dimmed color
- **Metadata**: Monospace, uppercase, extra letter-spacing
- **Interactive**: Monospace for buttons, filters, status badges

---

## Spacing

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 2rem;      /* 32px */
--space-xl: 4rem;      /* 64px */
--space-2xl: 8rem;     /* 128px */
```

### Application

- **Card padding**: `--space-lg`
- **Grid gap**: `--space-lg`
- **Section padding**: `--space-xl` vertical
- **Inline spacing**: `--space-sm` to `--space-md`

---

## Components

### Status Badge

```html
<span class="card__status card__status--active">[ACTIVE]</span>
```

- Monospace, uppercase
- Square brackets required
- 1px border matching status color
- Font size: `0.625rem`

### Tag

```html
<span class="card__tag">javascript</span>
```

- Monospace, lowercase
- Background: `--black-lighter`
- No border
- Compact padding

### Filter Button

```html
<button class="filter-btn active" data-filter="all">All</button>
```

- Monospace, uppercase
- 1px border
- Active state: accent background tint + accent border

### Card

```html
<article class="card">
  <div class="card__header">...</div>
  <p class="card__desc">...</p>
  <div class="card__meta">...</div>
  <div class="card__links">...</div>
</article>
```

- Background: `--black-light`
- Border: 1px `--black-border`
- Hover: border becomes accent, slight Y translation
- Green gradient overlay on hover (top-left origin)

### Blinking Cursor

```html
<span class="cursor"></span>
```

- Width: `0.5em`
- Background: `--accent`
- Animation: step blink, 1s interval

---

## Effects

### Noise Overlay

Subtle SVG noise texture over entire page. Opacity: 3%.

```css
body::before {
  background-image: url("data:image/svg+xml,...");
  opacity: 0.03;
  pointer-events: none;
}
```

### Entrance Animations

Cards fade up with stagger:

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.15s; }
/* ... */
```

### Pulse Animation

Status indicator dot pulses:

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

---

## Terminal Vocabulary

Use these patterns to reinforce the hacker aesthetic:

| Element | Pattern |
|---------|---------|
| Status indicators | `[ACTIVE]` `[WIP]` `[ARCHIVED]` |
| Prompts | `$` `>` `λ` |
| Timestamps | `2024-01-15 14:32:00 UTC` |
| Loading states | `> Fetching data...` |
| Empty states | `> No results found.` |
| Console logs | `> System initialized` |

---

## Transitions

```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 400ms ease;
```

### Usage

- **Hover states**: fast
- **Color changes**: fast
- **Layout shifts**: base
- **Entrance animations**: slow

---

## Responsive Breakpoints

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Mobile | `< 768px` | Single column, reduced padding, always-visible card links |
| Desktop | `≥ 768px` | Multi-column grid, hover-reveal links |

---

## Accessibility

- Keyboard navigation with arrow keys
- Focus states visible
- Sufficient color contrast (accent on dark)
- Semantic HTML structure
- `prefers-reduced-motion` should be respected (TODO)

---

## Don'ts

- ❌ Gradients (except subtle hover overlays)
- ❌ Rounded corners (keep it sharp)
- ❌ Drop shadows (use borders instead)
- ❌ Multiple accent colors
- ❌ Pure white (`#ffffff`) — too harsh
- ❌ Generic sans-serifs for headlines
- ❌ Emojis in UI (keep it terminal-clean)

---

## File Structure

```
css/
├── reset.css       # CSS reset
├── variables.css   # Design tokens
└── main.css        # Component styles

js/
├── main.js         # Entry point
├── projects.js     # Data rendering
└── effects.js      # Interactions
```

---

## Markdown Content

For rich text areas (project overviews, blog content), use markdown with these constraints:

### Dependencies

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>
```

### Usage

```javascript
const html = DOMPurify.sanitize(marked.parse(markdownString));
element.innerHTML = html;
```

### Allowed Elements

| Element | Usage |
|---------|-------|
| `**bold**` | Emphasis |
| `*italic*` | Secondary emphasis |
| `` `code` `` | Inline code, commands |
| `[text](url)` | Links |
| `- item` | Unordered lists |
| `1. item` | Ordered lists |
| ` ``` ` | Code blocks |
| `### Heading` | Subheadings (h3+ only) |

### Heading Restrictions

- **h1**: Reserved for page title only
- **h2**: Reserved for major sections
- **h3+**: Allowed in markdown content

### Styling Markdown Output

```css
.markdown-content h3 { /* styles */ }
.markdown-content p { /* styles */ }
.markdown-content a { /* styles */ }
.markdown-content code { /* styles */ }
.markdown-content pre { /* styles */ }
.markdown-content ul, .markdown-content ol { /* styles */ }
```

Apply `.markdown-content` wrapper class to rendered markdown areas.

---

## Extending

When adding new components:

1. Use existing tokens — don't introduce new colors
2. Prefer monospace for interactive/meta elements
3. Keep borders at 1px
4. Use accent sparingly — it should pop
5. Animate with purpose, not decoration

