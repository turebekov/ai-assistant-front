# JobTap design system

Visual direction: **IvyPanda-style service UI** — warm orange CTAs (`#FF8516`), navy tech surfaces (`#0F1724`), Inter, pill buttons, soft shadows.

## Source of truth

| Layer | Location |
|--------|----------|
| CSS variables (light + `.dark`) | `app/globals.css` |
| Hyperlink color (body copy only) | `--link-color` / `text-link` — scoped via `.article-body-prose p a`, `.legal-doc-prose p a` |
| Nav / footer / large blog links | `#163141` — `--nav-text` / `text-nav`, `hover:text-nav-text-hover` |
| Main header | `nav.nav-site` inherits `--nav-text`; components use explicit `text-nav` |
| TS tokens (for charts, emails, etc.) | `lib/design-system/tokens/*.ts` |
| Barrel export | `lib/design-system/index.ts` |
| Legacy marketing constants | `lib/constants.ts` → `colors` |

## Tailwind / shadcn

Components use Tailwind theme tokens mapped in `@theme inline` in `globals.css` (`primary`, `dark`, `shadow-card`, etc.). UI primitives live under `components/ui/` (e.g. `button.tsx` — pill primary, flat / no glow).

## Utilities

- `animate-fade-in-up` — hero-style entrance (see `globals.css` `@layer utilities`).
