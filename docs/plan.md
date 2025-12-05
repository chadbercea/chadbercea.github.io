# Build Plan: Interactive Project Hub

## Tech Stack

**Vanilla HTML/CSS/JS** — no build step, deploys directly to GitHub Pages, zero dependencies to maintain.

Why not React/Vue/etc?
- Overkill for a landing page
- Adds build complexity
- GH Pages serves static files beautifully
- Modern CSS and vanilla JS are powerful enough

---

## Core Features

### 1. Visual Identity
- **Bold, distinctive aesthetic** — not another generic portfolio
- **Dynamic background** — gradient shifts, particle effects, or generative art
- **Custom typography** — something with character

### 2. Project Cards
- **Interactive tiles** that respond to hover/focus
- **Live previews** — screenshots, maybe iframe embeds for GH Pages projects
- **Metadata** — tech stack tags, status indicators, links
- **Filtering/sorting** — by tech, date, or category

### 3. Animations & Micro-interactions
- **Staggered entrance animations** — elements cascade in on load
- **Hover states** — cards lift, glow, reveal details
- **Smooth scrolling** — if we go multi-section
- **Cursor effects** — subtle trail or glow (optional, don't overdo it)

### 4. Navigation
- **Keyboard accessible** — arrow keys to navigate cards
- **Search/filter** — quick jump to projects
- **External link handling** — clear indication of where links go

---

## Data Architecture

Projects defined in a simple JSON file:

```json
{
  "projects": [
    {
      "name": "Project Name",
      "description": "What it does",
      "url": "https://...",
      "repo": "https://github.com/...",
      "tags": ["python", "api", "tool"],
      "status": "active",
      "thumbnail": "assets/thumbnails/project.png"
    }
  ]
}
```

Page reads JSON and renders cards dynamically. Easy to update — just edit the JSON.

---

## File Structure

```
/
├── index.html
├── css/
│   ├── reset.css
│   ├── variables.css
│   └── main.css
├── js/
│   ├── main.js
│   ├── projects.js
│   └── effects.js
├── data/
│   └── projects.json
├── assets/
│   ├── fonts/
│   └── thumbnails/
└── docs/
    ├── first-principles.md
    └── plan.md
```

---

## Build Phases

### Phase 1: Foundation
- [ ] HTML structure
- [ ] CSS variables & base styles
- [ ] Project data JSON
- [ ] Basic card rendering

### Phase 2: Interactions
- [ ] Card hover effects
- [ ] Entrance animations
- [ ] Background effects
- [ ] Keyboard navigation

### Phase 3: Polish
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Final visual tweaks

---

## Design Direction: Editorial Hacker

**The vibe**: Bloomberg Terminal meets high-end tech publication. Sophisticated typography with CLI undertones.

### Typography
- **Headlines**: Bold editorial serif or geometric sans — something with presence
- **Body**: Clean, readable sans-serif
- **Code/Technical**: Monospace throughout for tags, metadata, status indicators
- **Hierarchy**: Strong contrast between levels, magazine-style

### Color Palette
- **Base**: Deep charcoal/near-black (`#0a0a0a`, `#141414`)
- **Text**: Off-white, not pure white (`#e8e8e8`, `#a0a0a0` for secondary)
- **Accent**: Single sharp color — electric green (`#00ff41`), amber (`#ffb800`), or cyan (`#00d4ff`)
- **No gradients** — flat, editorial, intentional

### Layout
- **Grid-based**: Strong columns, clear structure
- **Generous whitespace**: Let things breathe
- **Asymmetric balance**: Editorial, not corporate

### Terminal Elements
- Blinking cursors
- `[STATUS]` indicators
- ASCII borders or dividers
- Timestamp metadata
- Command-prompt prefixes (`>`, `$`, `λ`)

### Micro-details
- Subtle scan lines or noise texture (very subtle)
- Monospace timestamps on cards
- Status pills: `[ACTIVE]` `[ARCHIVED]` `[WIP]`
- Hover states reveal "system info"

### References
- Bloomberg Terminal
- The Verge (typography boldness)
- Stripe documentation (clarity)
- Hacker News (stripped down)
- Old-school BBS/Teletext aesthetics

---

## Next Steps

1. Choose visual direction
2. Build Phase 1 foundation
3. Iterate from there

Ready when you are.

