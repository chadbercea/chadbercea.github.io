# Project Detail Page Specification

## Interaction Model

### Current State
Click card → opens external URL in new tab

### Proposed State
Click card → navigates to detail page → detail page links out

```
[Home Grid] → [Project Detail] → [External URL]
     ↑              ↓
     └──────────────┘
         (back)
```

---

## Why a Detail Page?

1. **Context before commitment** — Users see full story before leaving the site
2. **Richer content** — Room for screenshots, tech breakdown, lessons learned
3. **SEO** — Individual pages can be indexed and shared
4. **Analytics** — Track which projects get deep engagement vs. quick bounces
5. **Consistent UX** — External links behave unpredictably; detail pages don't

---

## URL Structure

```
/project.html?id=project-slug
```

Single template, dynamic content. No build step needed.

Alternative (if we want cleaner URLs later):
```
/projects/project-slug/index.html
```
Would require generating individual files — more complexity, prettier URLs.

**Recommendation**: Start with query param approach, migrate later if needed.

---

## Page Template

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back to projects]                      [timestamp]      │  Header
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PROJECT NAME                              [STATUS]         │  Title
│  One-line description or tagline                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                    HERO IMAGE                       │   │  Hero
│  │                  (screenshot/gif)                   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ## Overview                                                │
│  Extended description. What it does, why it exists,        │  Content
│  who it's for. 2-3 paragraphs.                             │
│                                                             │
│  ## Tech Stack                                              │
│  [tag] [tag] [tag] [tag]                                   │
│                                                             │
│  ## Links                                                   │
│  [→ Live Demo]  [→ Repository]  [→ Blog Post]              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Built: 2024-01  •  Status: ACTIVE  •  Last updated: ...   │  Footer meta
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [← Back to projects]              [Next: Project Name →]  │  Navigation
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Schema Extension

Current `projects.json` schema + new fields:

```json
{
  "id": "project-slug",
  "name": "Project Name",
  "tagline": "One-line hook for the hero section",
  "description": "Short description (for cards)",
  "overview": "Extended description (for detail page). Supports markdown.",
  "url": "https://live-demo.com",
  "repo": "https://github.com/...",
  "blog": "https://blog-post-url.com",
  "tags": ["javascript", "api", "tool"],
  "status": "active",
  "date": "2024-01",
  "updated": "2024-06",
  "hero": "assets/heroes/project-slug.png",
  "thumbnail": "assets/thumbnails/project-slug.png"
}
```

### New Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tagline` | string | No | Short hook for detail page hero |
| `overview` | string | No | Extended description (markdown supported) |
| `blog` | string | No | Link to related blog post/write-up |
| `updated` | string | No | Last updated date |
| `hero` | string | No | Large image for detail page |

---

## Interactions

### Card Click Behavior

Three card types, each with **one CTA**:

```javascript
function getCardType(project) {
  const hasDetailContent = project.overview || project.hero;
  
  if (hasDetailContent) return 'project';  // → Detail page
  if (project.repo && !project.url) return 'repo';  // → Repo directly
  return 'external';  // → External URL
}

function getCardCTA(project) {
  const type = getCardType(project);
  switch (type) {
    case 'project':
      return { label: 'View →', href: `/project.html?id=${project.id}` };
    case 'repo':
      return { label: 'Repo →', href: project.repo, external: true };
    case 'external':
      return { label: 'Link →', href: project.url, external: true };
  }
}
```

Card body click also triggers CTA action (whole card is clickable).

### Detail → Back

```javascript
// Back button
backBtn.addEventListener('click', () => {
  if (document.referrer.includes(window.location.origin)) {
    history.back();
  } else {
    window.location.href = '/';
  }
});
```

### Keyboard

- `Escape` on detail page → back to grid
- Arrow keys don't apply (single item view)

---

## Visual Design

### Header
- Sticky nav with back button
- Same timestamp as homepage
- Minimal — content is the focus

### Hero Section
- Full-width image container (max-height: 400px)
- Subtle border, no rounded corners
- Fallback: show accent-colored placeholder with project initial

### Typography
- Project name: `--font-editorial`, same scale as homepage title
- Tagline: `--font-mono`, `--white-dim`
- Overview: `--font-body`, comfortable reading width (65ch max)
- Section headers: `--font-mono`, uppercase, small

### Links Section
- Row of button-style links
- Same treatment as card links but larger
- Icons optional (→ arrow prefix is enough)

### Meta Footer
- Monospace, dimmed
- Pipe or bullet separated
- Mirrors card metadata style

---

## Empty/Error States

### No ID provided
```
> Error: No project specified
> Redirecting to home...

[Back to projects]
```

### Invalid ID
```
> Error: Project not found
> The project "xyz" doesn't exist.

[Back to projects]
```

---

## File Structure

```
/
├── index.html          # Grid view (home)
├── project.html        # Detail view (template)
├── js/
│   ├── main.js
│   ├── projects.js
│   ├── effects.js
│   └── project-detail.js   # NEW: Detail page logic
└── css/
    └── main.css            # Add detail page styles
```

---

## Implementation Order

1. Extend `projects.json` schema with new fields
2. Create `project.html` template
3. Create `project-detail.js` for data loading
4. Add detail page styles to `main.css`
5. Update card click behavior in `projects.js`
6. Add hero images for existing projects

---

## Decisions

### Card Types & CTAs

Cards show **one CTA button** on hover. The label tells you where you're going:

| Card Type | CTA Label | Destination |
|-----------|-----------|-------------|
| **Project** | `View →` | Detail page (`/project.html?id=...`) |
| **Repo-only** | `Repo →` | GitHub repo directly |
| **External** | `Link →` | External URL directly |

Determined by data:
- Has `overview` or `hero` → **Project** (detail page exists)
- Only has `repo`, no detail content → **Repo-only**
- Only has `url`, no repo or detail → **External**

### Navigation on Detail Page

No "Related Projects" section (too much maintenance).

Instead: **"Next Project →"** button at bottom, cycles through list order. Wraps to first project after last.

```
[← Back to projects]                    [Next: Project Name →]
```

### Copy to Clipboard

**Always** include copy-to-clipboard for repo URL on detail page.

```
[→ Live Demo]  [→ Repository 📋]  [→ Blog Post]
                      ↑
              Click copies URL, tooltip confirms
```

### Markdown Support

**Yes** — use `marked` for parsing + `DOMPurify` for sanitization.

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>
```

Overview field supports:
- **Bold**, *italic*, `code`
- [Links](url)
- Lists (ordered/unordered)
- Code blocks with syntax hints
- Headings (h3+ only, h1-h2 reserved for page structure)

