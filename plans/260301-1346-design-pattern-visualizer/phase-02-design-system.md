# Phase 02: Design System & Layout Shell

## Context Links
- [Plan Overview](plan.md)
- Depends on: [Phase 01](phase-01-project-setup.md)

## Overview
- **Priority:** P1
- **Status:** pending
- **Effort:** 3h
- **Description:** Dark theme design system, shared layout components, pattern page shell.

## Key Insights
- Dark theme essential for 3D glow/bloom effects to pop
- Desktop-first breakpoints; mobile gets simplified layout
- shadcn/ui components provide accessible base; customize colors only

## Requirements

### Functional
- Dark theme with deep navy/black background, neon accent colors
- Navbar with site title + pattern navigation
- Pattern page shell layout (title header, content sections)
- Landing page grid layout for pattern cards
- Responsive (desktop-first, readable on tablet, functional on mobile)

### Non-Functional
- Consistent spacing scale (Tailwind defaults)
- Font: Geist (Next.js default) or Inter
- Color tokens as CSS variables for easy theming

## Architecture

### Color Palette (CSS Variables)
```
--background: hsl(222, 47%, 6%)       /* Deep navy-black */
--foreground: hsl(210, 40%, 96%)      /* Light gray text */
--accent: hsl(199, 89%, 48%)         /* Cyan neon glow */
--accent-secondary: hsl(280, 80%, 60%) /* Purple accent */
--muted: hsl(217, 33%, 17%)          /* Card backgrounds */
--border: hsl(217, 33%, 22%)         /* Subtle borders */
```

### Layout Components
- `Navbar` — site title, pattern links, GitHub link
- `Footer` — minimal, copyright + links
- `PageShell` — wraps pattern pages (title, description, section containers)
- `PatternCard` — card for landing page grid (thumbnail, title, description, link)

## Related Code Files
- **Create:** `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/page-shell.tsx`, `src/components/pattern/pattern-card.tsx`
- **Modify:** `src/styles/globals.css` (CSS variables), `src/app/layout.tsx` (wrap with Navbar/Footer), `tailwind.config.ts` (extend colors)
- **shadcn:** Add Button, Badge, Separator, Card via `npx shadcn@latest add`

## Implementation Steps

1. Define CSS variables in `globals.css` under `:root` and `.dark` (force dark mode)
2. Extend `tailwind.config.ts` to reference CSS variables for colors
3. Set `<html className="dark">` in `layout.tsx`
4. Install shadcn components: `npx shadcn@latest add button badge separator card`
5. Create `Navbar` component:
   - Site logo/title (left)
   - Pattern links dropdown or horizontal list (center/right)
   - GitHub icon link (right)
   - Sticky top, backdrop blur
6. Create `Footer` component: copyright, minimal links
7. Wrap `layout.tsx` children with `<Navbar />` + `<Footer />`
8. Create `PageShell` component:
   - Props: `title`, `description`, `children`
   - Renders: gradient header section + content container
9. Create `PatternCard` component:
   - Props: `title`, `description`, `slug`, `category` (creational/structural/behavioral)
   - Renders: shadcn Card with hover effect (Framer Motion scale), link to `/patterns/[slug]`
10. Define responsive breakpoints: `lg:` as primary, `md:` for tablet, `sm:` for mobile
11. Test: render Navbar + Footer + placeholder content; verify dark theme renders correctly

## Todo List
- [ ] Define color palette CSS variables
- [ ] Configure Tailwind with custom colors
- [ ] Force dark mode in layout
- [ ] Install shadcn base components
- [ ] Build Navbar
- [ ] Build Footer
- [ ] Build PageShell
- [ ] Build PatternCard
- [ ] Verify responsive layout

## Success Criteria
- Dark theme renders with correct colors across all viewports
- Navbar is sticky with backdrop blur
- PatternCard has hover animation
- Layout renders correctly at 1440px, 1024px, 768px, 375px widths

## Risk Assessment
- **Color contrast issues:** Test text readability against dark backgrounds (WCAG AA minimum)
- **Font loading flash:** Use `next/font` for Geist/Inter to avoid FOUT

## Next Steps
- Phase 04 (Scene Framework) can start once this + Phase 03 are done
